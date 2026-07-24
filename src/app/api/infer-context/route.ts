import { NextResponse } from "next/server";
import { getExecutionProvider } from "@/lib/providers";

export const maxDuration = 60; // Extend Vercel serverless function execution limit to 60 seconds

export async function POST(req: Request) {
    try {
        const { companyName, websiteUrl } = await req.json();

        if (!companyName) {
            return NextResponse.json({ error: "companyName is required" }, { status: 400 });
        }

        const prompt = `You are an expert market analyst and SEO strategist. 
I am conducting an AI Visibility Investigation for the following company:
Company Name: ${companyName}
Website URL: ${websiteUrl || "Not provided"}

Your task is to analyze this brand based on your knowledge and infer their business context.
Return a structured JSON object with the following fields:
1. "industry": The specific market they operate in.
2. "inferredValueProp": A concise sentence explaining their unique value proposition.
3. "competitors": A list of 3-5 direct competitors (company names).
4. "buyerQueries": A list of 3-5 high-intent queries that a buyer would ask an AI when looking for this type of product/service.
5. "promptPack": A set of 4 prompts (one for ChatGPT, Perplexity, Gemini, and Claude) wrapping high-intent buyer search intents in realistic prompt structures.

CRITICAL INSTRUCTIONS FOR PROMPT PACK GENERATION:
- **Make every engine prompt distinctly different in tone, structure, and phrasing**:
  * **ChatGPT Prompt**: Personal advisory style. (e.g., "I'm evaluating top options for [category]. Can you give me a ranked list of the best 5 brands/companies to consider? Please start directly with the recommended brand names.")
  * **Perplexity Prompt**: Direct research/vendor query. (e.g., "What are the top-rated [category] providers in [market]? Provide a direct bulleted list of top company names with key highlights for each.")
  * **Gemini Prompt**: Structured commercial analysis query. (e.g., "Which 4-5 companies dominate [category]? Give a ranked breakdown starting immediately with the top company names and their main value props.")
  * **Claude Prompt**: Objective comparative query. (e.g., "I need a direct recommendation of the best [category] vendors. List the top 4 options by company name first, then briefly compare their core capabilities.")
- **Ensure every prompt explicitly instructs the AI engine to answer directly with specific brand/company recommendations first, skipping long generic introductions or filler advice.**

Return ONLY a valid JSON object matching this schema:
{
  "industry": "string",
  "inferredValueProp": "string",
  "competitors": ["string"],
  "buyerQueries": ["string"],
  "promptPack": [
    {
      "engine": "ChatGPT",
      "payload": "string"
    },
    {
      "engine": "Perplexity",
      "payload": "string"
    },
    {
      "engine": "Gemini",
      "payload": "string"
    },
    {
      "engine": "Claude",
      "payload": "string"
    }
  ]
}`;

        const provider = getExecutionProvider();
        const response = await provider.execute(prompt, "Gemini");

        const cleanedJson = response.rawTranscript.replace(/```json\n?|\n?```/g, "").trim();
        
        let data;
        try {
            data = JSON.parse(cleanedJson);
        } catch (parseError) {
            console.error("Failed to parse JSON. Raw transcript:", response.rawTranscript);
            return NextResponse.json({ error: "AI model failed to return a valid structured response. Please try again." }, { status: 500 });
        }
        
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Inference Error:", error);
        return NextResponse.json({ error: error.message || "Failed to infer context" }, { status: 500 });
    }
}
