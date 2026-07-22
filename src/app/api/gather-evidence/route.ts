import { NextResponse } from "next/server";
import { savePromptAndEvidence, clearInvestigationData } from "@/lib/db";
import { getExecutionProvider } from "@/lib/providers";
import { Prompt, Evidence } from "@/domain/models";

export async function POST(req: Request) {
  try {
    const { promptPack } = await req.json();

    if (!promptPack || !Array.isArray(promptPack) || promptPack.length === 0) {
      return NextResponse.json({ error: "promptPack is required and must be a non-empty array" }, { status: 400 });
    }

    const investigationId = crypto.randomUUID();
    
    // Clear previous investigation data since we are in a sandbox testing mode
    await clearInvestigationData();

    const provider = getExecutionProvider() as any;

    // 🚀 BATCH EXECUTION: Batch all prompts into 1 single OpenRouter request to save API credits & time
    const batchItems = promptPack.map(p => ({ engine: p.engine, payload: p.payload }));
    
    let batchResponses;
    try {
      batchResponses = await provider.executeBatch(batchItems);
    } catch (e: any) {
      console.error("Batched execution error:", e.message);
      // Fallback response array if batching fails completely
      batchResponses = promptPack.map(p => ({
        engine: p.engine,
        rawTranscript: `[ERROR: Execution failed - ${e.message}]`
      }));
    }

    const results = [];

    // Save prompt and evidence records for each response
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
      results.push({ prompt, evidence });
    }

    return NextResponse.json({ success: true, investigationId, gathered: results.length });

  } catch (error: any) {
    console.error("Gather Evidence Error:", error);
    return NextResponse.json({ error: error.message || "Failed to gather evidence" }, { status: 500 });
  }
}
