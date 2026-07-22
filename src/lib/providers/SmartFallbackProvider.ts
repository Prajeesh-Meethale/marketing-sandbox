import { AIProvider, ProviderResponse } from "./AIProvider";
import { OpenRouterProvider, BatchedPromptItem, BatchedResponseItem } from "./OpenRouterProvider";
import { GoogleGenAI } from "@google/genai";

function getGeminiKeys(): string[] {
  const keysStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
  return keysStr
    .split(",")
    .map(k => k.trim())
    .filter(k => k.length > 0);
}

let activeKeyIndex = 0;

export class SmartFallbackProvider implements AIProvider {
  readonly name = "smart-fallback";
  private openRouterProvider = new OpenRouterProvider();

  /**
   * Executes a single prompt.
   * Tries available Gemini free keys with key rotation first.
   * Automatically falls back to OpenRouterProvider if all Gemini keys are exhausted or fail.
   */
  async execute(prompt: string, targetEngine: string): Promise<ProviderResponse> {
    const keys = getGeminiKeys();

    if (keys.length > 0) {
      const attempts = keys.length;

      for (let i = 0; i < attempts; i++) {
        const keyIndex = (activeKeyIndex + i) % keys.length;
        const apiKey = keys[keyIndex];

        try {
          const ai = new GoogleGenAI({ apiKey });
          const systemInstruction = `You are a highly capable AI proxy operating in a development environment. 
Your task is to accurately simulate the behavior, tone, styling, and structural tendencies of the target engine: ${targetEngine}.

CRITICAL BEHAVIOR RULES FOR ${targetEngine.toUpperCase()} SIMULATION:
1. DO NOT state or reveal that you are Gemini. Respond authentically as ${targetEngine}.
2. **BE DIRECT & BRAND-FOCUSED**: Cut straight to listing and evaluating specific company/brand/advisor names. DO NOT output long generic introductory fluff, disclaimers, or high-level advice before naming the brands.
3. **STYLE ADAPTATION FOR ${targetEngine.toUpperCase()}**:
   - If Perplexity: Provide a concise direct answer starting with a ranked list, use bullet points with inline citations like [1], [2], and short data tables.
   - If ChatGPT: Provide conversational, structured recommendations with bullet points for Key Strengths and Considerations for each brand.
   - If Claude: Provide an objective, structured breakdown listing the top brand names first with clear decision criteria.
   - If Gemini: Provide a clean, direct analytical breakdown categorized by brand positioning and value proposition.`;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.3,
            }
          });

          const rawTranscript = response.text || "";
          if (rawTranscript.trim().length > 0) {
            console.log(`[SmartFallbackProvider] Successfully executed prompt using Gemini Key #${keyIndex + 1}/${keys.length} ($0 cost)`);
            activeKeyIndex = keyIndex;
            return { rawTranscript };
          }
        } catch (err: any) {
          const isQuota = err.status === 429 || err.status === 403 || /quota|rate limit|resource_exhausted/i.test(err.message || "");
          console.warn(`[SmartFallbackProvider] Gemini Key #${keyIndex + 1} failed (${isQuota ? "Quota/Rate Limit Exceeded" : err.message}). Rotating to next key...`);
          activeKeyIndex = (activeKeyIndex + 1) % keys.length;
        }
      }

      console.warn("[SmartFallbackProvider] All Gemini free keys exhausted or failed. Failing over to OpenRouterProvider...");
    } else {
      console.log("[SmartFallbackProvider] No Gemini API keys configured. Using OpenRouterProvider...");
    }

    return this.openRouterProvider.execute(prompt, targetEngine);
  }

  /**
   * Executes a batch of prompts.
   * Attempts execution via Gemini free keys first, falling back to OpenRouterProvider if quota is exceeded.
   */
  async executeBatch(promptItems: BatchedPromptItem[]): Promise<BatchedResponseItem[]> {
    const keys = getGeminiKeys();

    if (keys.length > 0) {
      try {
        const batchResults = await Promise.allSettled(
          promptItems.map(item => this.execute(item.payload, item.engine))
        );

        const allSucceeded = batchResults.every(r => r.status === "fulfilled");

        if (allSucceeded) {
          return batchResults.map((r, idx) => ({
            engine: promptItems[idx].engine,
            rawTranscript: (r as PromiseFulfilledResult<ProviderResponse>).value.rawTranscript,
          }));
        }
      } catch (err: any) {
        console.warn("[SmartFallbackProvider] Gemini batch execution encountered errors. Falling back to OpenRouterProvider batch...", err.message);
      }
    }

    return this.openRouterProvider.executeBatch(promptItems);
  }
}
