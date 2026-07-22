import { AIProvider } from "./AIProvider";
import { GeminiProvider } from "./GeminiProvider";
import { OpenRouterProvider } from "./OpenRouterProvider";
import { SmartFallbackProvider } from "./SmartFallbackProvider";

export * from "./AIProvider";
export * from "./GeminiProvider";
export * from "./OpenRouterProvider";
export * from "./SmartFallbackProvider";

/**
 * Returns the active execution provider based on configuration.
 * Prioritizes Gemini Free Key Rotation Pool (GEMINI_API_KEYS / GEMINI_API_KEY) for $0 cost execution.
 * Automatically fails over to OpenRouterProvider when all Gemini free keys are exhausted.
 */
export function getExecutionProvider(_targetEngine?: string): AIProvider {
  return new SmartFallbackProvider();
}
