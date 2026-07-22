import { AIProvider, ProviderResponse } from "./AIProvider";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";

  async execute(prompt: string, targetEngine: string): Promise<ProviderResponse> {
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

    const rawTranscript = response.text || "[No content returned]";

    return { rawTranscript };
  }
}
