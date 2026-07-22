import { IInvestigationRepository } from './IInvestigationRepository';
import { FileInvestigationRepository } from './FileInvestigationRepository';
import { SupabaseInvestigationRepository } from './SupabaseInvestigationRepository';
import { InMemoryInvestigationRepository } from './InMemoryInvestigationRepository';

export * from './IInvestigationRepository';
export * from './FileInvestigationRepository';
export * from './SupabaseInvestigationRepository';
export * from './InMemoryInvestigationRepository';

let repositoryInstance: IInvestigationRepository | null = null;

export function getInvestigationRepository(): IInvestigationRepository {
  if (repositoryInstance) {
    return repositoryInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    console.log('[RepositoryFactory] Using SupabaseInvestigationRepository');
    repositoryInstance = new SupabaseInvestigationRepository(supabaseUrl, supabaseKey);
  } else if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    console.warn('[RepositoryFactory] No Supabase credentials found in production/Vercel. Falling back to InMemoryInvestigationRepository.');
    repositoryInstance = new InMemoryInvestigationRepository();
  } else {
    console.log('[RepositoryFactory] Using FileInvestigationRepository (Local JSON)');
    repositoryInstance = new FileInvestigationRepository();
  }

  return repositoryInstance;
}
