import { z } from "zod";

// --- ENUMS & SHARED TYPES ---

export const DiscoveryMethodSchema = z.enum(["MANUAL", "LLM_INFERRED"]);
export const IntentTypeSchema = z.enum(["NAVIGATIONAL", "INFORMATIONAL", "COMMERCIAL_INVESTIGATION", "TRANSACTIONAL"]);
export const StatusSchema = z.enum(["SUCCESS", "FAILURE", "PENDING"]);
export const CheckStatusSchema = z.enum(["PASS", "FAIL", "WARNING", "UNKNOWN"]);
export const EngineSchema = z.enum(["ChatGPT", "Perplexity", "Gemini", "Claude", "Copilot"]);

// --- DOMAIN MODELS ---

export const BrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  industry: z.string().optional(),
  inferredValueProp: z.string().optional(),
  createdAt: z.date().or(z.string()),
});
export type Brand = z.infer<typeof BrandSchema>;

export const TechnicalCheckSchema = z.object({
  type: z.string(),
  status: CheckStatusSchema,
  details: z.string().optional(),
});
export type TechnicalCheck = z.infer<typeof TechnicalCheckSchema>;

export const WebsiteSchema = z.object({
  id: z.string(),
  brandId: z.string(), // Foreign Key to Brand
  url: z.string().url(),
  lastAuditedAt: z.date().or(z.string()).optional(),
  aeoScore: z.number().optional(),
  technicalChecks: z.array(TechnicalCheckSchema),
});
export type Website = z.infer<typeof WebsiteSchema>;

export const CompetitorSchema = z.object({
  id: z.string(),
  brandId: z.string(), // Foreign Key to Brand
  name: z.string(),
  domain: z.string().optional(),
  discoveryMethod: DiscoveryMethodSchema,
});
export type Competitor = z.infer<typeof CompetitorSchema>;

export const QuerySchema = z.object({
  id: z.string(),
  brandId: z.string(), // Foreign Key to Brand
  text: z.string(),
  intentType: IntentTypeSchema,
});
export type Query = z.infer<typeof QuerySchema>;

export const PromptSchema = z.object({
  id: z.string(),
  queryId: z.string(), // Foreign Key to Query
  engine: EngineSchema,
  payload: z.string(),
});
export type Prompt = z.infer<typeof PromptSchema>;

export const EvidenceSchema = z.object({
  id: z.string(),
  promptId: z.string(), // Foreign Key to Prompt
  executionProvider: z.string(),
  targetEngine: z.string(),
  timestamp: z.date().or(z.string()).optional(),
  scrapedAt: z.string().optional(),
  rawTranscript: z.string(),
  status: StatusSchema.optional(),
  engine: z.string().optional(),
});
export type Evidence = z.infer<typeof EvidenceSchema>;

export const CitationSchema = z.object({
  id: z.string(),
  evidenceId: z.string(), // Foreign Key to Evidence
  domain: z.string(),
  url: z.string().url(),
  mentionsTargetBrand: z.boolean(),
  mentionsCompetitorIds: z.array(z.string()), // Array of Competitor IDs
});
export type Citation = z.infer<typeof CitationSchema>;

export const FindingSchema = z.object({
  id: z.string(),
  evidenceId: z.string(), // Foreign Key to Evidence
  findingType: z.string(),
  targetBrandMentioned: z.boolean(),
  competitorsMentioned: z.array(z.string()), // Array of Competitor IDs
  targetRank: z.number().nullable(),
});
export type Finding = z.infer<typeof FindingSchema>;

export const InsightSchema = z.object({
  id: z.string(),
  brandId: z.string(), // Foreign Key to Brand
  topic: z.string(),
  findingIds: z.array(z.string()), // References deterministic findings
  narrative: z.string(), // E.g., The "Finding" in our 5-part structure
  whyThisMatters: z.string(),
  businessImpact: z.string(),
});
export type Insight = z.infer<typeof InsightSchema>;

export const RecommendationSchema = z.object({
  id: z.string(),
  brandId: z.string(), // Foreign Key to Brand
  actionType: z.string(),
  title: z.string(),
  description: z.string(),
  effort: z.enum(["LOW", "MEDIUM", "HIGH"]),
  impact: z.enum(["LOW", "MEDIUM", "HIGH"]),
  basedOnInsightIds: z.array(z.string()), // Connecting recommendations back to insights
});
export type Recommendation = z.infer<typeof RecommendationSchema>;

export const SectionSchema = z.object({
  id: z.string(),
  type: z.enum([
    "METHODOLOGY", 
    "BUSINESS_CONTEXT", 
    "REALITY_CHECK", 
    "CRIME_SCENE", 
    "FORENSICS", 
    "MACHINE_LAYER", 
    "ROADMAP"
  ]),
  title: z.string(),
  // Pointers to the knowledge graph objects that populate this section
  evidenceIds: z.array(z.string()).optional(),
  findingIds: z.array(z.string()).optional(),
  insightIds: z.array(z.string()).optional(),
  recommendationIds: z.array(z.string()).optional(),
});
export type Section = z.infer<typeof SectionSchema>;

export const InvestigationSchema = z.object({
  id: z.string(),
  brandId: z.string(), // Foreign Key to Brand
  title: z.string(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  createdAt: z.date().or(z.string()),
  sections: z.array(SectionSchema), // The ordered sections that render the report
});
export type Investigation = z.infer<typeof InvestigationSchema>;
