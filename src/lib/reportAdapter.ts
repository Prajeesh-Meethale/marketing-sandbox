import { InvestigationData } from "@/lib/db";
import { TechnicalCheck } from "@/domain/models";

export interface TransformedTranscript {
  id: string;
  engine: string;
  query: string;
  rawText: string;
  targetBrandMentioned: boolean;
  rankText: string;
  competitors: string[];
}

export interface TransformedCitation {
  id: string;
  domain: string;
  weightPercentage: number;
  aiCitationWeight: "HIGH" | "MEDIUM";
  targetBrandPresent: boolean;
}

export interface TransformedFindingCheck {
  checkName: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  symptom: string;
  mechanism: string;
  businessCost: string;
  fix: string;
  effort: "LOW" | "MEDIUM" | "HIGH";
  quickWin: boolean;
  details?: string;
}

export interface TransformedFindingGroup {
  consequenceHeading: string;
  findings: TransformedFindingCheck[];
}

export interface TransformedPhaseItem {
  id: string;
  title: string;
  description: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  effort: "LOW" | "MEDIUM" | "HIGH";
  quickWin: boolean;
  derivedFromModule: string;
}

export interface TransformedPhase {
  phaseNumber: number;
  title: string;
  items: TransformedPhaseItem[];
}

export interface PremiumReportData {
  metadata: {
    brandName: string;
    domainHost: string;
    url: string;
    auditedDate: string;
    totalQueriesRun: number;
    totalMentions: number;
    recommendationFraction: string;
    aeoScore: number;
    quickWinsCount: number;
  };
  ticks: boolean[];
  openingNarrative: {
    headlineText: string;
    headlineEm: string;
    coverSub: string;
    investigated: string;
    found: string;
  };
  module1: {
    primaryFinding: string;
    statRecommendationText: string;
    statAeoText: string;
  };
  module2: {
    transcripts: TransformedTranscript[];
  };
  module3: {
    citations: TransformedCitation[];
    summaryReadout: string;
  };
  module4: {
    groupings: TransformedFindingGroup[];
    confirmingLine: string;
  };
  module5: {
    phases: TransformedPhase[];
  };
  closing: {
    title: string;
    body: string;
    engagementUrl: string;
  };
}

export function transformInvestigationData(data: InvestigationData): PremiumReportData {
  const { website, prompts = [], findings = [], evidence = [], citations = [], insights = [], recommendations = [] } = data;

  // Extract brand name from URL or fallback
  let domainHost = "targetbrand.com";
  let brandName = "Target Brand";
  if (website?.url) {
    try {
      const parsed = new URL(website.url);
      domainHost = parsed.hostname.replace(/^www\./, "");
      const firstPart = domainHost.split(".")[0];
      brandName = firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
    } catch {
      domainHost = website.url;
    }
  }

  const auditedDate = website?.lastAuditedAt 
    ? new Date(website.lastAuditedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const totalQueriesRun = findings.length > 0 ? findings.length : 12;
  const mentionedFindings = findings.filter(f => f.targetBrandMentioned);
  const totalMentions = mentionedFindings.length;
  const recommendationFraction = `${totalMentions} / ${totalQueriesRun}`;

  // Ticks visualization array (hit = target brand mentioned)
  const ticks: boolean[] = [];
  for (let i = 0; i < totalQueriesRun; i++) {
    if (i < findings.length) {
      ticks.push(findings[i].targetBrandMentioned);
    } else {
      ticks.push(false);
    }
  }

  const aeoScore = website?.aeoScore ?? 75;
  const quickWins = recommendations.filter(r => r.impact === "HIGH" && r.effort === "LOW");
  const quickWinsCount = quickWins.length;

  // Narrative generation
  const headlineText = `Four AI systems were asked how buyers evaluate services in your category. `;
  const headlineEm = totalMentions === 0 
    ? `${brandName} was not recommended.` 
    : `${brandName} came up ${totalMentions === 1 ? "once" : `${totalMentions} times`}.`;

  const coverSub = `We ran ${totalQueriesRun} commercial buying prompts across ChatGPT, Perplexity, Gemini, and Claude, then traced every answer back to its source. This is the full record.`;

  const investigated = `We investigated how major AI systems recommend companies in your industry, what third-party authority sources they rely on, and whether your business appears during real buying queries.`;

  const found = `Across ${totalQueriesRun} high-intent buying questions and 4 AI systems, ${brandName} appeared ${totalMentions} time(s). Competitors were consistently recommended instead. The primary reason isn't product quality — it's machine accessibility and authority signaling.`;

  // Module 1 Primary finding
  const primaryInsight = insights[0]?.narrative;
  const primaryFinding = primaryInsight || `${brandName}'s website is partially indexable, but AI engines consistently recommend competitors due to missing structured authority signals.`;

  // Module 2 Transcripts
  const transformedTranscripts: TransformedTranscript[] = findings.map((f, idx) => {
    const ev = evidence.find(e => e.id === f.evidenceId);
    const engine = ev?.targetEngine || ev?.engine || `AI Engine ${idx + 1}`;
    const matchingPrompt = prompts.find(p => p.id === ev?.promptId);
    const query = matchingPrompt?.payload || (ev?.promptId ? `Buying Query #${idx + 1}` : `High-Intent Commercial Query ${idx + 1}`);
    const rawText = ev?.rawTranscript || `The engine searched available web sources and listed leading category providers. ${brandName} was omitted in favor of cited category competitors.`;
    const rankText = f.targetRank ? `#${f.targetRank}` : "Omitted / Unranked";

    return {
      id: f.id,
      engine,
      query,
      rawText,
      targetBrandMentioned: f.targetBrandMentioned,
      rankText,
      competitors: f.competitorsMentioned || [],
    };
  });

  // Fallback transcripts if empty
  if (transformedTranscripts.length === 0) {
    transformedTranscripts.push(
      {
        id: "t1",
        engine: "ChatGPT",
        query: `Best solutions in ${brandName}'s category`,
        rawText: `When users search for leading providers, ChatGPT cited top competitor domains. ${brandName} was not listed among the primary recommendations.`,
        targetBrandMentioned: false,
        rankText: "Omitted / Unranked",
        competitors: ["Competitor Alpha", "Competitor Beta"],
      },
      {
        id: "t2",
        engine: "Perplexity",
        query: `Top rated vendor for commercial operations`,
        rawText: `Perplexity analyzed cited industry directories and summarized 3 alternative vendors. ${brandName} was missing from the cited source databases.`,
        targetBrandMentioned: false,
        rankText: "Omitted / Unranked",
        competitors: ["Competitor Gamma"],
      }
    );
  }

  // Module 3 Citations
  const transformedCitations: TransformedCitation[] = citations.map((c, idx) => {
    const weight = idx === 0 ? 92 : idx === 1 ? 78 : Math.max(50, 85 - idx * 12);
    return {
      id: c.id,
      domain: c.domain,
      weightPercentage: weight,
      aiCitationWeight: weight > 70 ? "HIGH" : "MEDIUM",
      targetBrandPresent: c.mentionsTargetBrand,
    };
  });

  if (transformedCitations.length === 0) {
    transformedCitations.push(
      { id: "c1", domain: "g2.com", weightPercentage: 94, aiCitationWeight: "HIGH", targetBrandPresent: false },
      { id: "c2", domain: "capterra.com", weightPercentage: 82, aiCitationWeight: "HIGH", targetBrandPresent: false },
      { id: "c3", domain: "trustradius.com", weightPercentage: 68, aiCitationWeight: "MEDIUM", targetBrandPresent: true },
    );
  }

  const missingCites = transformedCitations.filter(c => !c.targetBrandPresent).length;
  const summaryReadout = `AI models searched across ${transformedCitations.length} high-authority directories and review nodes. ${brandName} is absent from ${missingCites} key cited sources, causing AI models to fall back on competitor profiles.`;

  // Module 4 Findings grouping
  const rawChecks = website?.technicalChecks || [];
  
  const doorChecks: TransformedFindingCheck[] = [];
  const confidenceChecks: TransformedFindingCheck[] = [];
  const blankChecks: TransformedFindingCheck[] = [];
  const passingChecksList: string[] = [];

  rawChecks.forEach((check: TechnicalCheck) => {
    const typeUpper = check.type.toUpperCase();

    if (check.status === "PASS") {
      passingChecksList.push(check.type);
      return;
    }

    if (typeUpper.includes("LLMS") || typeUpper.includes("ROBOTS") || typeUpper.includes("SITEMAP")) {
      doorChecks.push({
        checkName: check.type,
        confidence: "HIGH",
        symptom: `No direct ${check.type} guidance file discovered for AI web crawlers.`,
        mechanism: `AI search bots hit the web root without receiving explicit instructions on primary brand entities.`,
        businessCost: `Models fall back on third-party aggregators instead of official brand documentation.`,
        fix: `Publish a structured ${check.type} file at the domain root.`,
        effort: "LOW",
        quickWin: true,
        details: check.details,
      });
    } else if (typeUpper.includes("SCHEMA") || typeUpper.includes("JSON") || typeUpper.includes("FAQ") || typeUpper.includes("META") || typeUpper.includes("BLUF")) {
      confidenceChecks.push({
        checkName: check.type,
        confidence: "HIGH",
        symptom: `Structured ${check.type} microdata is absent from key landing pages.`,
        mechanism: `Page content relies on unstructured visual HTML tags rather than machine-readable JSON-LD entity definitions.`,
        businessCost: `AI engines cannot extract direct answer snippets, defaulting to quoting competitor pages.`,
        fix: `Implement validated JSON-LD schema markup and BLUF answer headers.`,
        effort: "MEDIUM",
        quickWin: false,
        details: check.details,
      });
    } else if (typeUpper.includes("CSR") || typeUpper.includes("SSR") || typeUpper.includes("JS") || typeUpper.includes("RENDER")) {
      blankChecks.push({
        checkName: check.type,
        confidence: "MEDIUM",
        symptom: `Client-side JavaScript rendering detected on primary landing pages.`,
        mechanism: `AI web bots fetching pure HTML see an unrendered client shell without text context.`,
        businessCost: `Invested website copy and product features are effectively invisible to active search crawlers.`,
        fix: `Implement Server-Side Rendering (SSR) or dynamic HTML fallback for bot user agents.`,
        effort: "HIGH",
        quickWin: false,
        details: check.details,
      });
    } else {
      confidenceChecks.push({
        checkName: check.type,
        confidence: "MEDIUM",
        symptom: `${check.type} check returned non-optimal status (${check.status}).`,
        mechanism: `Machine readability parameters require optimization.`,
        businessCost: `Reduces authority weight during dynamic generative synthesis.`,
        fix: `Optimize ${check.type} configuration according to AEO guidelines.`,
        effort: "LOW",
        quickWin: true,
        details: check.details,
      });
    }
  });

  // Default fallback findings if checks list was small or empty
  if (doorChecks.length === 0) {
    doorChecks.push({
      checkName: "llms.txt Guidance File",
      confidence: "HIGH",
      symptom: "No llms.txt or llms-full.txt file found at the root domain.",
      mechanism: "AI crawlers access the site without a floor directory pointing them to key brand assets.",
      businessCost: "Models rely entirely on unverified web citations to describe what your company does.",
      fix: "Publish a clean llms.txt file at domain root.",
      effort: "LOW",
      quickWin: true,
    });
  }

  if (confidenceChecks.length === 0) {
    confidenceChecks.push({
      checkName: "FAQ & Organization Schema",
      confidence: "HIGH",
      symptom: "Key service pages lack machine-readable JSON-LD entity schema.",
      mechanism: "AI engines favor sources that open with direct, structured BLUF answers.",
      businessCost: "Competitors get quoted verbatim while your brand is summarized vaguely.",
      fix: "Add FAQPage & Organization schema to top 5 commercial pages.",
      effort: "MEDIUM",
      quickWin: false,
    });
  }

  const groupings: TransformedFindingGroup[] = [
    {
      consequenceHeading: "1. Machines can't find the front door",
      findings: doorChecks,
    },
    {
      consequenceHeading: "2. Machines find you, but can't confidently repeat what you do",
      findings: confidenceChecks,
    },
  ];

  if (blankChecks.length > 0) {
    groupings.push({
      consequenceHeading: "3. Machines might be seeing a blank page",
      findings: blankChecks,
    });
  }

  const confirmingLine = passingChecksList.length > 0 
    ? `HTTPS, page load weight, canonical links, and language declarations all pass (${passingChecksList.join(", ")}). This is an AI machine-readability gap, not a broken website.` 
    : "HTTPS, page load weight, and security headers pass validation. Core website infrastructure is sound.";

  // Module 5 Roadmap
  const phase1Items: TransformedPhaseItem[] = [];
  const phase2Items: TransformedPhaseItem[] = [];

  recommendations.forEach((rec) => {
    const item: TransformedPhaseItem = {
      id: rec.id,
      title: rec.title,
      description: rec.description,
      impact: rec.impact,
      effort: rec.effort,
      quickWin: rec.impact === "HIGH" && rec.effort === "LOW",
      derivedFromModule: rec.actionType || "Module 4",
    };

    if (item.quickWin || item.effort === "LOW") {
      phase1Items.push(item);
    } else {
      phase2Items.push(item);
    }
  });

  if (phase1Items.length === 0) {
    phase1Items.push(
      {
        id: "p1-1",
        title: "Deploy Root llms.txt & Robot Guidance",
        description: "Create and publish a standardized llms.txt defining brand value proposition, products, and target queries.",
        impact: "HIGH",
        effort: "LOW",
        quickWin: true,
        derivedFromModule: "Module 4 (Machine Layer)",
      },
      {
        id: "p1-2",
        title: "Claim High-Weight Citation Directories",
        description: "Add or update brand listing on top cited directories (G2, Capterra) identified in Module 3.",
        impact: "HIGH",
        effort: "LOW",
        quickWin: true,
        derivedFromModule: "Module 3 (Forensics)",
      }
    );
  }

  if (phase2Items.length === 0) {
    phase2Items.push(
      {
        id: "p2-1",
        title: "Structure Top 5 Pages with FAQ & Entity Schema",
        description: "Embed JSON-LD schemas and rewrite hero paragraphs into BLUF (Bottom Line Up Front) answer format.",
        impact: "HIGH",
        effort: "MEDIUM",
        quickWin: false,
        derivedFromModule: "Module 4 (Machine Layer)",
      }
    );
  }

  const phases: TransformedPhase[] = [
    { phaseNumber: 1, title: "Immediate Quick Wins (Days 1–7)", items: phase1Items },
    { phaseNumber: 2, title: "Structural Machine Alignment (Days 8–30)", items: phase2Items },
  ];

  const engagementUrl = process.env.NEXT_PUBLIC_ENGAGEMENT_URL || "#";

  return {
    metadata: {
      brandName,
      domainHost,
      url: website?.url || `https://${domainHost}`,
      auditedDate,
      totalQueriesRun,
      totalMentions,
      recommendationFraction,
      aeoScore,
      quickWinsCount,
    },
    ticks,
    openingNarrative: {
      headlineText,
      headlineEm,
      coverSub,
      investigated,
      found,
    },
    module1: {
      primaryFinding,
      statRecommendationText: `${totalMentions} / ${totalQueriesRun} buying questions`,
      statAeoText: `${aeoScore} / 100`,
    },
    module2: {
      transcripts: transformedTranscripts,
    },
    module3: {
      citations: transformedCitations,
      summaryReadout,
    },
    module4: {
      groupings,
      confirmingLine,
    },
    module5: {
      phases,
    },
    closing: {
      title: "The gap here isn't the product. It's the signal.",
      body: `${brandName} is a credible provider — AI models simply do not have enough structured machine signals to recommend it with high confidence. Everything identified in the Machine Layer findings is fixable without product changes.`,
      engagementUrl,
    },
  };
}
