import { InvestigationData } from "./db";
import { Insight, Recommendation } from "@/domain/models";
import { getExecutionProvider } from "./providers";

export interface SynthesisResult {
  insights: Insight[];
  recommendations: Recommendation[];
}

/**
 * Single-Pass Synthesis Pipeline:
 * Bundles evidence transcripts, AEO technical audits, and SRO findings, then
 * passes them to SmartFallbackProvider (Gemini Key Pool -> OpenRouter) to generate structured Insights & Recommendations.
 */
export async function performSinglePassSynthesis(data: InvestigationData): Promise<SynthesisResult> {
  const provider = getExecutionProvider();

  const brandId = data.website?.brandId || crypto.randomUUID();
  const websiteUrl = data.website?.url || "Not provided";
  const aeoScore = data.website?.aeoScore ?? 0;

  const findingsSummary = data.findings.map(f => {
    const ev = data.evidence.find(e => e.id === f.evidenceId);
    return `[Engine: ${ev?.targetEngine || ev?.engine || "Unknown"}]
- Brand Mentioned: ${f.targetBrandMentioned ? "YES" : "NO"}
- Rank Position: ${f.targetRank ? `#${f.targetRank}` : "Not Ranked"}
- Competitors Mentioned: ${f.competitorsMentioned.join(", ") || "None"}
- Transcript Snippet: "${(ev?.rawTranscript || "").substring(0, 300)}..."`;
  }).join("\n\n");

  const technicalChecksSummary = (data.website?.technicalChecks || []).map(c => 
    `- [${c.status}] ${c.type}: ${c.details || ""}`
  ).join("\n");

  const citationsSummary = data.citations.slice(0, 5).map(c => 
    `- Domain: ${c.domain} (${c.url}) | Mentions Target: ${c.mentionsTargetBrand ? "YES" : "NO"}`
  ).join("\n");

  const prompt = `You are a world-class AI Visibility & Answer Engine Optimization (AEO) Strategist.

Analyze the following investigation audit data for target website: ${websiteUrl}

--- 1. TECHNICAL AEO AUDIT (Score: ${aeoScore}/100) ---
${technicalChecksSummary}

--- 2. SRO ENGINE FINDINGS & RANKS ---
${findingsSummary}

--- 3. EXTRACTED CITATIONS ---
${citationsSummary || "No direct citations extracted"}

--- INSTRUCTIONS ---
Based strictly on the empirical evidence above, generate a strategic analysis consisting of:
1. **insights**: 2-3 strategic insights (each with: topic, narrative, whyThisMatters, businessImpact).
2. **recommendations**: 3-4 prioritized action items (each with: actionType, title, description, effort ("LOW"|"MEDIUM"|"HIGH"), impact ("LOW"|"MEDIUM"|"HIGH")).

Ensure the insights directly address the brand's visibility rank and technical AEO gaps.
Return ONLY a JSON object matching this schema:
{
  "insights": [
    {
      "topic": "string",
      "narrative": "string",
      "whyThisMatters": "string",
      "businessImpact": "string"
    }
  ],
  "recommendations": [
    {
      "actionType": "string",
      "title": "string",
      "description": "string",
      "effort": "LOW" | "MEDIUM" | "HIGH",
      "impact": "LOW" | "MEDIUM" | "HIGH"
    }
  ]
}`;

  try {
    const response = await provider.execute(prompt, "Gemini");
    const transcript = response.rawTranscript;

    // Clean JSON formatting if wrapped in code blocks
    const cleanedJson = transcript.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleanedJson);

    const findingIds = data.findings.map(f => f.id);

    const insights: Insight[] = (parsed.insights || []).map((ins: any) => ({
      id: crypto.randomUUID(),
      brandId,
      topic: ins.topic || "AI Visibility & Engine Dominance",
      findingIds,
      narrative: ins.narrative || "Analysis of brand presence across evaluated AI engines.",
      whyThisMatters: ins.whyThisMatters || "AI recommendations directly impact top-of-funnel discovery.",
      businessImpact: ins.businessImpact || "Optimizing AI visibility drives high-intent organic buyer traffic.",
    }));

    const insightIds = insights.map(i => i.id);

    const recommendations: Recommendation[] = (parsed.recommendations || []).map((rec: any) => ({
      id: crypto.randomUUID(),
      brandId,
      actionType: rec.actionType || "AEO_OPTIMIZATION",
      title: rec.title || "Optimize Brand Entity Graph for AI Scrapers",
      description: rec.description || "Deploy structured data markup and machine-readable context files.",
      effort: ["LOW", "MEDIUM", "HIGH"].includes(rec.effort) ? rec.effort : "MEDIUM",
      impact: ["LOW", "MEDIUM", "HIGH"].includes(rec.impact) ? rec.impact : "HIGH",
      basedOnInsightIds: insightIds,
    }));

    return { insights, recommendations };

  } catch (error: any) {
    console.error("Single-Pass Synthesis LLM Call Failed:", error);

    // Fallback deterministic synthesis if parsing fails
    const findingIds = data.findings.map(f => f.id);
    const fallbackInsightId = crypto.randomUUID();

    const fallbackInsights: Insight[] = [
      {
        id: fallbackInsightId,
        brandId,
        topic: "Technical AEO & AI Knowledge Ingestion Gap",
        findingIds,
        narrative: `The brand achieved a technical AEO score of ${aeoScore}/100. While core crawler access is established, missing machine-readable standards like llms.txt impede complete knowledge ingestion by LLMs.`,
        whyThisMatters: "Answer engines prioritize websites with structured schema and explicit crawler permissions.",
        businessImpact: "Improving technical AEO signals increases likelihood of being cited in commercial buyer queries.",
      },
      {
        id: crypto.randomUUID(),
        brandId,
        topic: "Selection Rate Optimization (SRO) Positioning",
        findingIds,
        narrative: "Evaluating ChatGPT, Perplexity, Gemini, and Claude reveals competitive positioning variance. Key competitor entities are frequently referenced in buyer evaluation lists.",
        whyThisMatters: "When buyers ask AI models for vendor recommendations, omitted brands lose immediate deal opportunities.",
        businessImpact: "Targeted content structuring can shift AI recommendation ranks into top 3 positions.",
      }
    ];

    const fallbackRecommendations: Recommendation[] = [
      {
        id: crypto.randomUUID(),
        brandId,
        actionType: "TECHNICAL_AEO",
        title: "Deploy llms.txt Specification File",
        description: "Create and host a clean /llms.txt file on the primary domain detailing core value propositions, product features, and pricing tiers.",
        effort: "LOW",
        impact: "HIGH",
        basedOnInsightIds: [fallbackInsightId],
      },
      {
        id: crypto.randomUUID(),
        brandId,
        actionType: "CONTENT_OPTIMIZATION",
        title: "Enhance JSON-LD Entity Markup",
        description: "Expand Organization and Product schema markup across high-value landing pages to explicitly define brand attributes.",
        effort: "MEDIUM",
        impact: "HIGH",
        basedOnInsightIds: [fallbackInsightId],
      },
      {
        id: crypto.randomUUID(),
        brandId,
        actionType: "SRO_STRATEGY",
        title: "Build Comparative Digital Footprint",
        description: "Publish side-by-side comparison matrices and authoritative third-party reviews to increase competitor cross-reference authority.",
        effort: "MEDIUM",
        impact: "HIGH",
        basedOnInsightIds: [fallbackInsightId],
      }
    ];

    return { insights: fallbackInsights, recommendations: fallbackRecommendations };
  }
}
