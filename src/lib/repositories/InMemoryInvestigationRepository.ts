import { Prompt, Evidence, Finding, Citation, Website, Insight, Recommendation } from '@/domain/models';
import { IInvestigationRepository, InvestigationData } from './IInvestigationRepository';

const defaultData: InvestigationData = {
  prompts: [],
  evidence: [],
  findings: [],
  citations: [],
  website: null,
  insights: [],
  recommendations: [],
};

// Global in-memory storage for serverless preview fallback when no DB env vars are configured
let memoryStore: InvestigationData = { ...defaultData };

export class InMemoryInvestigationRepository implements IInvestigationRepository {
  async getInvestigationData(): Promise<InvestigationData> {
    return { ...memoryStore };
  }

  async savePromptAndEvidence(prompt: Prompt, evidence: Evidence): Promise<void> {
    memoryStore.prompts.push(prompt);
    memoryStore.evidence.push(evidence);
  }

  async saveForensicsData(website: Website, findings: Finding[], citations: Citation[]): Promise<void> {
    memoryStore.website = website;
    memoryStore.findings = findings;
    memoryStore.citations = citations;
  }

  async saveSynthesisData(insights: Insight[], recommendations: Recommendation[]): Promise<void> {
    memoryStore.insights = insights;
    memoryStore.recommendations = recommendations;
  }

  async clearInvestigationData(): Promise<void> {
    memoryStore = {
      prompts: [],
      evidence: [],
      findings: [],
      citations: [],
      website: null,
      insights: [],
      recommendations: [],
    };
  }
}
