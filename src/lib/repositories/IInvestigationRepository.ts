import { Prompt, Evidence, Finding, Citation, Website, Insight, Recommendation } from '@/domain/models';

export type InvestigationData = {
  prompts: Prompt[];
  evidence: Evidence[];
  findings: Finding[];
  citations: Citation[];
  website: Website | null;
  insights: Insight[];
  recommendations: Recommendation[];
};

export interface IInvestigationRepository {
  getInvestigationData(): Promise<InvestigationData>;
  savePromptAndEvidence(prompt: Prompt, evidence: Evidence): Promise<void>;
  saveForensicsData(website: Website, findings: Finding[], citations: Citation[]): Promise<void>;
  saveSynthesisData(insights: Insight[], recommendations: Recommendation[]): Promise<void>;
  clearInvestigationData(): Promise<void>;
}
