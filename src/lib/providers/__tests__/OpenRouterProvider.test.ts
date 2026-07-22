import { getSortedModelChain, DEFAULT_STATIC_FALLBACK_CHAIN, TARGET_MODELS } from "../OpenRouterProvider";

/**
 * Unit Test for Dynamic OpenRouter Pricing Sorting
 */
export async function testPricingSort() {
  console.log("=== RUNNING UNIT TEST: Dynamic Model Pricing Sorting ===");

  // Mock OpenRouter GET /api/v1/models response with sample pricing out of order
  const mockModelsResponse = {
    data: [
      { id: "openai/gpt-4o", pricing: { prompt: "0.0000025" } },           // $2.50 / 1M
      { id: "google/gemini-2.5-flash", pricing: { prompt: "0.00000030" } }, // $0.30 / 1M
      { id: "meta-llama/llama-3.3-70b-instruct", pricing: { prompt: "0.00000010" } }, // $0.10 / 1M
      { id: "anthropic/claude-3.5-haiku", pricing: { prompt: "0.00000080" } }, // $0.80 / 1M
      { id: "openai/gpt-4o-mini", pricing: { prompt: "0.00000015" } },     // $0.15 / 1M
      { id: "deepseek/deepseek-chat", pricing: { prompt: "0.00000020" } },  // $0.20 / 1M
      { id: "qwen/qwen-2.5-72b-instruct", pricing: { prompt: "0.00000036" } }, // $0.36 / 1M
    ]
  };

  const mockFetch = async (url: string) => {
    if (url.includes("/models")) {
      return {
        ok: true,
        json: async () => mockModelsResponse
      } as Response;
    }
    throw new Error(`Unexpected mock URL: ${url}`);
  };

  const sortedChain = await getSortedModelChain(mockFetch as any);

  const expectedOrder = [
    "meta-llama/llama-3.3-70b-instruct", // $0.10
    "openai/gpt-4o-mini",                // $0.15
    "deepseek/deepseek-chat",            // $0.20
    "google/gemini-2.5-flash",           // $0.30
    "qwen/qwen-2.5-72b-instruct",        // $0.36
    "anthropic/claude-3.5-haiku",        // $0.80
    "openai/gpt-4o",                     // $2.50
  ];

  console.log("Actual Sorted Output:", sortedChain);
  console.log("Expected Order:     ", expectedOrder);

  const passed = JSON.stringify(sortedChain) === JSON.stringify(expectedOrder);
  if (passed) {
    console.log("✅ UNIT TEST PASSED: Fallback array correctly sorted ascending by prompt input price!");
  } else {
    console.error("❌ UNIT TEST FAILED: Output order does not match expected ascending order.");
    throw new Error("Unit test failed");
  }
}

// Execute test if run directly via Node
if (require.main === module) {
  testPricingSort().catch(console.error);
}
