import { getInvestigationRepository, InvestigationData } from './repositories';
import { Prompt, Evidence, Finding, Citation, Website, Insight, Recommendation } from '@/domain/models';

export type { InvestigationData };

export async function getInvestigationData(): Promise<InvestigationData> {
  return getInvestigationRepository().getInvestigationData();
}

export async function savePromptAndEvidence(prompt: Prompt, evidence: Evidence): Promise<void> {
  return getInvestigationRepository().savePromptAndEvidence(prompt, evidence);
}

export async function saveForensicsData(website: Website, findings: Finding[], citations: Citation[]): Promise<void> {
  return getInvestigationRepository().saveForensicsData(website, findings, citations);
}

export async function saveSynthesisData(insights: Insight[], recommendations: Recommendation[]): Promise<void> {
  return getInvestigationRepository().saveSynthesisData(insights, recommendations);
}

export async function clearInvestigationData(): Promise<void> {
  return getInvestigationRepository().clearInvestigationData();
}
