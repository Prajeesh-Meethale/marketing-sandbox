import { getExecutionProvider } from "./providers";

export interface ScrapeResult {
  rawTranscript: string;
  executionProvider: string;
  targetEngine: string;
}

/**
 * Scrapes a prompt by routing execution through the active AIProvider.
 * In development mode, all target engines are executed via Gemini API simulating the target engine.
 * In production mode, native target engine providers are executed directly.
 */
export async function scrapePrompt(targetEngine: string, payload: string): Promise<ScrapeResult> {
  const provider = getExecutionProvider(targetEngine);
  const response = await provider.execute(payload, targetEngine);

  return {
    rawTranscript: response.rawTranscript,
    executionProvider: provider.name,
    targetEngine,
  };
}
