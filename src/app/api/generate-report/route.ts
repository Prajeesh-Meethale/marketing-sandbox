import { NextResponse } from "next/server";
import { savePromptAndEvidence, clearInvestigationData, saveForensicsData, saveSynthesisData, getInvestigationData } from "@/lib/db";
import { getExecutionProvider } from "@/lib/providers";
import { performTechnicalAeoAudit, generateFindingsAndCitations } from "@/lib/forensic";
import { performSinglePassSynthesis } from "@/lib/synthesis";
import { Prompt, Evidence } from "@/domain/models";

export const maxDuration = 60; // Extend Vercel serverless function execution limit to 60 seconds

export async function POST(req: Request) {
  try {
    const { companyName, websiteUrl, promptPack, buyerQueries, competitors } = await req.json();

    if (!promptPack || !Array.isArray(promptPack) || promptPack.length === 0) {
      return NextResponse.json({ error: "promptPack is required and must be a non-empty array" }, { status: 400 });
    }

    const investigationId = crypto.randomUUID();
    const brandId = crypto.randomUUID();
    const effectiveUrl = websiteUrl || `${(companyName || "company").toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
    const effectiveCompetitors: string[] = Array.isArray(competitors) ? competitors : [];

    // Clear previous investigation data
    await clearInvestigationData();

    // 🚀 PHASE 1: Gather Evidence via Smart Fallback Provider (Gemini Key Pool -> OpenRouter)
    const provider = getExecutionProvider() as any;
    const batchItems = promptPack.map(p => ({ engine: p.engine, payload: p.payload }));

    let batchResponses;
    try {
      batchResponses = await provider.executeBatch(batchItems);
    } catch (e: any) {
      console.error("Pipeline Evidence Gathering Error:", e.message);
      batchResponses = promptPack.map(p => ({
        engine: p.engine,
        rawTranscript: `[ERROR: Failed to gather evidence - ${e.message}]`
      }));
    }

    for (let i = 0; i < promptPack.length; i++) {
      const p = promptPack[i];
      const resp = batchResponses[i] || { engine: p.engine, rawTranscript: "[No content]" };

      const prompt: Prompt = {
        id: crypto.randomUUID(),
        queryId: "query-mock-id",
        engine: p.engine,
        payload: p.payload,
      };

      const evidence: Evidence = {
        id: crypto.randomUUID(),
        promptId: prompt.id,
        executionProvider: "openrouter",
        targetEngine: p.engine,
        engine: p.engine,
        rawTranscript: resp.rawTranscript,
        timestamp: new Date().toISOString(),
        scrapedAt: new Date().toISOString(),
        status: resp.rawTranscript.startsWith("[ERROR:") ? "FAILURE" : "SUCCESS",
      };

      await savePromptAndEvidence(prompt, evidence);
    }

    // 🚀 PHASE 2: Technical AEO & SRO Forensics Audit
    const currentDataAfterEvidence = await getInvestigationData();
    const website = await performTechnicalAeoAudit(brandId, effectiveUrl);
    const { findings, citations } = generateFindingsAndCitations(
      companyName || "Target Company",
      effectiveCompetitors,
      currentDataAfterEvidence.evidence,
      currentDataAfterEvidence.prompts
    );
    await saveForensicsData(website, findings, citations);

    // 🚀 PHASE 3: Strategy Synthesis
    const currentDataAfterForensics = await getInvestigationData();
    const { insights, recommendations } = await performSinglePassSynthesis(currentDataAfterForensics);
    await saveSynthesisData(insights, recommendations);

    return NextResponse.json({
      success: true,
      investigationId,
      reportUrl: "/report"
    });

  } catch (error: any) {
    console.error("Generate Report Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate report" }, { status: 500 });
  }
}
