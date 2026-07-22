import { NextResponse } from "next/server";
import { getInvestigationData, saveSynthesisData } from "@/lib/db";
import { performSinglePassSynthesis } from "@/lib/synthesis";

export async function POST() {
  try {
    const data = await getInvestigationData();

    if (!data.evidence || data.evidence.length === 0) {
      return NextResponse.json({ error: "No evidence found. Please complete evidence gathering first." }, { status: 400 });
    }

    // 🚀 Execute Single-Pass Strategy Synthesis
    const { insights, recommendations } = await performSinglePassSynthesis(data);

    // Save generated insights & recommendations to local database
    await saveSynthesisData(insights, recommendations);

    return NextResponse.json({
      success: true,
      totalInsights: insights.length,
      totalRecommendations: recommendations.length,
    });

  } catch (error: any) {
    console.error("Run Synthesis Error:", error);
    return NextResponse.json({ error: error.message || "Failed to run strategy synthesis" }, { status: 500 });
  }
}
