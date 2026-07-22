export interface ProviderResponse {
  rawTranscript: string;
}

export interface AIProvider {
  /**
   * The underlying provider execution identifier (e.g. "gemini", "openai", "anthropic", "perplexity").
   */
  readonly name: string;

  /**
   * Executes a prompt.
   * @param prompt The payload to execute.
   * @param targetEngine The target model/engine (e.g. "ChatGPT", "Claude", "Gemini", "Perplexity").
   */
  execute(prompt: string, targetEngine: string): Promise<ProviderResponse>;
}

