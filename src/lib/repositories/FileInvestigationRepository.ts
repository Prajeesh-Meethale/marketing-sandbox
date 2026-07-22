import fs from 'fs/promises';
import path from 'path';
import { Prompt, Evidence, Finding, Citation, Website, Insight, Recommendation } from '@/domain/models';
import { IInvestigationRepository, InvestigationData } from './IInvestigationRepository';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'investigation.json');

const defaultData: InvestigationData = {
  prompts: [],
  evidence: [],
  findings: [],
  citations: [],
  website: null,
  insights: [],
  recommendations: [],
};

export class FileInvestigationRepository implements IInvestigationRepository {
  private async ensureDb(): Promise<void> {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      try {
        await fs.access(DB_FILE);
      } catch {
        await fs.writeFile(DB_FILE, JSON.stringify(defaultData, null, 2));
      }
    } catch (error) {
      console.error("Failed to ensure local DB file:", error);
    }
  }

  async getInvestigationData(): Promise<InvestigationData> {
    await this.ensureDb();
    try {
      const data = await fs.readFile(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        prompts: parsed.prompts || [],
        evidence: parsed.evidence || [],
        findings: parsed.findings || [],
        citations: parsed.citations || [],
        website: parsed.website || null,
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
      };
    } catch {
      return defaultData;
    }
  }

  async savePromptAndEvidence(prompt: Prompt, evidence: Evidence): Promise<void> {
    const data = await this.getInvestigationData();
    data.prompts.push(prompt);
    data.evidence.push(evidence);
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
  }

  async saveForensicsData(website: Website, findings: Finding[], citations: Citation[]): Promise<void> {
    const data = await this.getInvestigationData();
    data.website = website;
    data.findings = findings;
    data.citations = citations;
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
  }

  async saveSynthesisData(insights: Insight[], recommendations: Recommendation[]): Promise<void> {
    const data = await this.getInvestigationData();
    data.insights = insights;
    data.recommendations = recommendations;
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
  }

  async clearInvestigationData(): Promise<void> {
    await this.ensureDb();
    await fs.writeFile(DB_FILE, JSON.stringify(defaultData, null, 2));
  }
}
