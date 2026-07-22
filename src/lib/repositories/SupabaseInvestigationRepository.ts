import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

const INVESTIGATION_ID = 'current';

export class SupabaseInvestigationRepository implements IInvestigationRepository {
  private client: SupabaseClient;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    const url = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!url || !key) {
      throw new Error('Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY) are required.');
    }

    this.client = createClient(url, key);
  }

  async getInvestigationData(): Promise<InvestigationData> {
    try {
      const { data, error } = await this.client
        .from('investigations')
        .select('data')
        .eq('id', INVESTIGATION_ID)
        .maybeSingle();

      if (error) {
        console.error('Supabase fetch error:', error.message);
        return defaultData;
      }

      if (!data || !data.data) {
        return defaultData;
      }

      const parsed = data.data;
      return {
        prompts: parsed.prompts || [],
        evidence: parsed.evidence || [],
        findings: parsed.findings || [],
        citations: parsed.citations || [],
        website: parsed.website || null,
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
      };
    } catch (e: any) {
      console.error('Failed to get investigation data from Supabase:', e);
      return defaultData;
    }
  }

  private async saveInvestigationData(data: InvestigationData): Promise<void> {
    const { error } = await this.client
      .from('investigations')
      .upsert({
        id: INVESTIGATION_ID,
        data,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Supabase save error:', error.message);
      throw new Error(`Failed to save investigation data to Supabase: ${error.message}`);
    }
  }

  async savePromptAndEvidence(prompt: Prompt, evidence: Evidence): Promise<void> {
    const data = await this.getInvestigationData();
    data.prompts.push(prompt);
    data.evidence.push(evidence);
    await this.saveInvestigationData(data);
  }

  async saveForensicsData(website: Website, findings: Finding[], citations: Citation[]): Promise<void> {
    const data = await this.getInvestigationData();
    data.website = website;
    data.findings = findings;
    data.citations = citations;
    await this.saveInvestigationData(data);
  }

  async saveSynthesisData(insights: Insight[], recommendations: Recommendation[]): Promise<void> {
    const data = await this.getInvestigationData();
    data.insights = insights;
    data.recommendations = recommendations;
    await this.saveInvestigationData(data);
  }

  async clearInvestigationData(): Promise<void> {
    await this.saveInvestigationData(defaultData);
  }
}
