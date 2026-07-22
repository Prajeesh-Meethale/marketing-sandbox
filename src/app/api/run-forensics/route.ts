import { NextResponse } from "next/server";
import { getInvestigationData, saveForensicsData } from "@/lib/db";
import { performTechnicalAeoAudit, generateFindingsAndCitations } from "@/lib/forensic";

export async function POST(req: Request) {
  try {
    const { companyName, websiteUrl, competitors } = await req.json();

    if (!companyName) {
      return NextResponse.json({ error: "companyName is required" }, { status: 400 });
    }

    const data = await getInvestigationData();

    if (!data.evidence || data.evidence.length === 0) {
      return NextResponse.json({ error: "No evidence found. Please complete evidence gathering first." }, { status: 400 });
    }

    const brandId = crypto.randomUUID();
    const effectiveUrl = websiteUrl || `${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
    const effectiveCompetitors: string[] = Array.isArray(competitors) ? competitors : [];

    // 1. Perform Technical AEO Website Audit
    const website = await performTechnicalAeoAudit(brandId, effectiveUrl);

    // 2. Perform SRO Transcript Analysis on collected evidence
    const { findings, citations } = generateFindingsAndCitations(
      companyName,
      effectiveCompetitors,
      data.evidence,
      data.prompts
    );

    // 3. Persist Forensics data into database
    await saveForensicsData(website, findings, citations);

    return NextResponse.json({
      success: true,
      aeoScore: website.aeoScore,
      totalFindings: findings.length,
      totalCitations: citations.length,
    });

  } catch (error: any) {
    console.error("Run Forensics Error:", error);
    return NextResponse.json({ error: error.message || "Failed to run forensic audit" }, { status: 500 });
  }
}
