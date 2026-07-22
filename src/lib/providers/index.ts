import { AIProvider } from "./AIProvider";
import { GeminiProvider } from "./GeminiProvider";
import { OpenRouterProvider } from "./OpenRouterProvider";

export * from "./AIProvider";
export * from "./GeminiProvider";
export * from "./OpenRouterProvider";

/**
 * Returns the active execution provider based on configuration.
 * Always defaults to OpenRouterProvider with ascending-cost fallback chain and batching.
 */
export function getExecutionProvider(_targetEngine?: string): AIProvider {
  return new OpenRouterProvider();
}
