import { AIProvider, ProviderResponse } from "./AIProvider";

const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";

/**
 * Target set of models monitored for dynamic price-ordered execution
 */
export const TARGET_MODELS = [
  "meta-llama/llama-3.3-70b-instruct",
  "openai/gpt-4o-mini",
  "deepseek/deepseek-chat",
  "google/gemini-2.5-flash",
  "qwen/qwen-2.5-72b-instruct",
  "anthropic/claude-3.5-haiku",
  "openai/gpt-4o",
];

/**
 * Default fallback chain ordered by current verified OpenRouter input pricing (prompt price / token):
 * 1. meta-llama/llama-3.3-70b-instruct ($0.10 / 1M)
 * 2. openai/gpt-4o-mini ($0.15 / 1M)
 * 3. deepseek/deepseek-chat (~$0.20 / 1M)
 * 4. google/gemini-2.5-flash ($0.30 / 1M)
 * 5. qwen/qwen-2.5-72b-instruct ($0.36 / 1M)
 * 6. anthropic/claude-3.5-haiku ($0.80 / 1M)
 * 7. openai/gpt-4o ($2.50 / 1M)
 */
export const DEFAULT_STATIC_FALLBACK_CHAIN = [
  "meta-llama/llama-3.3-70b-instruct",
  "openai/gpt-4o-mini",
  "deepseek/deepseek-chat",
  "google/gemini-2.5-flash",
  "qwen/qwen-2.5-72b-instruct",
  "anthropic/claude-3.5-haiku",
  "openai/gpt-4o",
];

// In-Memory Cache configuration (6 hours)
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
let cachedModelChain: string[] | null = null;
let lastPricingFetchTime: number = 0;

/**
 * Dynamically fetches live OpenRouter pricing from GET https://openrouter.ai/api/v1/models,
 * extracts input pricing (pricing.prompt), sorts the 7 target models ascending by cost,
 * and caches the order in-memory for 6 hours.
 */
export async function getSortedModelChain(fetchFn = fetch): Promise<string[]> {
  const now = Date.now();

  if (cachedModelChain && (now - lastPricingFetchTime) < CACHE_TTL_MS) {
    return cachedModelChain;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for models metadata

    const res = await fetchFn(OPENROUTER_MODELS_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const rawModelsList: Array<{ id: string; pricing?: { prompt?: string } }> = data.data || [];

    const pricingMap = new Map<string, number>();

    for (const item of rawModelsList) {
      if (TARGET_MODELS.includes(item.id)) {
        // pricing.prompt is cost per 1 token (string e.g. "0.00000015")
        const promptPrice = parseFloat(item.pricing?.prompt || "0");
        pricingMap.set(item.id, promptPrice);
      }
    }

    // Filter models present in catalog; log warning for deprecated models
    const availableModels = TARGET_MODELS.filter(modelId => {
      const exists = pricingMap.has(modelId);
      if (!exists) {
        console.warn(`[OpenRouter Dynamic Pricing] Model ${modelId} not found in catalog; skipping.`);
      }
      return exists;
    });

    // Sort ascending by prompt input price per token
    availableModels.sort((a, b) => {
      const priceA = pricingMap.get(a) ?? 0;
      const priceB = pricingMap.get(b) ?? 0;
      return priceA - priceB;
    });

    if (availableModels.length > 0) {
      cachedModelChain = availableModels;
      lastPricingFetchTime = now;

      const priceSummary = availableModels
        .map(id => `${id} ($${((pricingMap.get(id) ?? 0) * 1_000_000).toFixed(3)}/1M)`)
        .join(" -> ");

      console.log(`[OpenRouter Dynamic Pricing] Live pricing updated (6-hr cache):\n${priceSummary}`);
      return cachedModelChain;
    }

    throw new Error("No target models found in OpenRouter catalog response");

  } catch (err: any) {
    console.warn(`[OpenRouter Dynamic Pricing] Failed to fetch live pricing: ${err.message}. Using fallback model order.`);
    if (cachedModelChain) {
      return cachedModelChain;
    }
    cachedModelChain = DEFAULT_STATIC_FALLBACK_CHAIN;
    return cachedModelChain;
  }
}

const TIMEOUT_MS = 10000; // 10 second timeout per model attempt

export interface BatchedPromptItem {
  engine: string;
  payload: string;
}

export interface BatchedResponseItem {
  engine: string;
  rawTranscript: string;
}

export class OpenRouterProvider implements AIProvider {
  readonly name = "openrouter";

  /**
   * Executes a single prompt using the dynamically sorted ascending-cost fallback chain with timeouts.
   */
  async execute(prompt: string, targetEngine: string): Promise<ProviderResponse> {
    const apiKey = process.env.OPENROUTER_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_KEY is missing from environment variables");
    }

    const modelChain = await getSortedModelChain();

    const systemInstruction = `You are a highly capable AI proxy operating via OpenRouter.
Your task is to accurately simulate the behavior, tone, styling, and structural tendencies of the target engine: ${targetEngine}.

CRITICAL INSTRUCTIONS:
1. DO NOT state or reveal that you are Gemini, Llama, or OpenRouter. Respond authentically as ${targetEngine}.
2. BE DIRECT & BRAND-FOCUSED: Cut straight to listing and evaluating specific company/brand/advisor names. Skip long generic introductory text or disclaimers.
3. Match ${targetEngine}'s formatting style (bullet points, clear headings, ranked lists).`;

    let lastError: Error | null = null;

    for (const model of modelChain) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const response = await fetch(OPENROUTER_CHAT_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Marketing Sandbox Evidence Scraper",
          },
          signal: controller.signal,
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 1500,
          }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`OpenRouter (${model}) status ${response.status}: ${errText}`);
        }

        const json = await response.json();
        const content = json?.choices?.[0]?.message?.content;

        if (content && content.trim().length > 0) {
          return { rawTranscript: content };
        }
        throw new Error(`Empty response from model ${model}`);
      } catch (err: any) {
        const isAbort = err.name === "AbortError";
        const reason = isAbort ? `Timed out after ${TIMEOUT_MS / 1000}s` : err.message;
        console.warn(`OpenRouter model ${model} failed: ${reason}. Retrying next model in chain...`);
        lastError = err;
      }
    }

    throw new Error(`All OpenRouter models in fallback chain failed. Last error: ${lastError?.message}`);
  }

  /**
   * BATCHED EXECUTION: Combines all prompts into a single API call using the dynamic price-ordered chain.
   */
  async executeBatch(promptItems: BatchedPromptItem[]): Promise<BatchedResponseItem[]> {
    const apiKey = process.env.OPENROUTER_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_KEY is missing from environment variables");
    }

    const modelChain = await getSortedModelChain();

    const promptListFormatted = promptItems.map((item, idx) => `
--- ITEM #${idx + 1} ---
TARGET ENGINE: ${item.engine}
PROMPT: ${item.payload}
`).join("\n");

    const batchSystemInstruction = `You are an advanced AI simulator tasked with executing multiple prompt pack items in a single batch.

CRITICAL BATCH RULES:
1. For each item listed below, generate an authentic, direct, brand-focused response matching the specified TARGET ENGINE's style.
2. DO NOT include generic disclaimers or intros. Get straight to brand recommendations.
3. Return a JSON object with a "results" array containing objects with keys "engine" and "rawTranscript".

JSON RESPONSE SCHEMA:
{
  "results": [
    {
      "engine": "ChatGPT",
      "rawTranscript": "Direct brand recommendations..."
    }
  ]
}`;

    let lastError: Error | null = null;

    for (const model of modelChain) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS * 1.5); // Slightly longer for batch

        const response = await fetch(OPENROUTER_CHAT_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Marketing Sandbox Evidence Scraper",
          },
          signal: controller.signal,
          body: JSON.stringify({
            model,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: batchSystemInstruction },
              { role: "user", content: `Please execute the following ${promptItems.length} prompts in batch:\n${promptListFormatted}` },
            ],
            temperature: 0.3,
            max_tokens: 3000,
          }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`OpenRouter Batch (${model}) status ${response.status}: ${errText}`);
        }

        const json = await response.json();
        const content = json?.choices?.[0]?.message?.content;

        if (content) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed.results) && parsed.results.length === promptItems.length) {
            return parsed.results.map((r: any, idx: number) => ({
              engine: promptItems[idx].engine,
              rawTranscript: r.rawTranscript || r.response || r.content || "[No content]",
            }));
          }
        }
        throw new Error(`Invalid batch JSON format from model ${model}`);
      } catch (err: any) {
        const isAbort = err.name === "AbortError";
        const reason = isAbort ? `Timed out` : err.message;
        console.warn(`OpenRouter batch model ${model} failed: ${reason}. Retrying next model in chain...`);
        lastError = err;
      }
    }

    // Fallback: If batch execution fails across all models, execute sequentially
    console.warn("Batched execution failed across all models. Falling back to sequential execution...");
    const results: BatchedResponseItem[] = [];
    for (const item of promptItems) {
      const res = await this.execute(item.payload, item.engine);
      results.push({ engine: item.engine, rawTranscript: res.rawTranscript });
    }
    return results;
  }
}
