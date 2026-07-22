/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const BRANDS = [
  { name: "Groww",    aliases: ["groww"] },
  { name: "Zerodha",  aliases: ["zerodha", "zerodha kite", "kite by zerodha"] },
  { name: "Razorpay", aliases: ["razorpay"] },
  { name: "PhonePe",  aliases: ["phonepe", "phone pe", "phone-pe"] },
  { name: "Paytm",    aliases: ["paytm"] },
  { name: "CRED",     aliases: ["cred"] },
  { name: "Slice",    aliases: ["slice"] },
];

const SAMPLE_PROMPTS = [
  { id: "P01", text: "I'm 23, just started my first job in India, and want to invest ₹500 a month. Which app should I start with so I don't get overwhelmed?", angle: "Retail investing" },
  { id: "P03", text: "Between Groww and Zerodha, which is better in 2026 for long-term index fund investing for a typical Indian salaried professional?", angle: "Head-to-head" },
  { id: "P14", text: "Best payment gateway stack for an early-stage Indian SaaS startup in 2025-26 that needs subscriptions, one-time payments, refunds, and good developer docs?", angle: "B2B payments" },
];

// Using OpenRouter models as a fallback for the sample since BrightData key is missing
const ENGINES = [
  { id: "chatgpt_api",  label: "ChatGPT (API)",    modelId: "openai/gpt-4o" },
  { id: "perplexity_api", label: "Perplexity (API)", modelId: "perplexity/llama-3.1-sonar-large-128k-online" },
];

const OUTPUT_DIR = path.join(__dirname, "output");

async function fetchFromOpenRouter(modelId, promptText) {
  const apiKey = process.env.OPENROUTER_KEY;
  if (!apiKey) throw new Error("OPENROUTER_KEY not set in .env.local");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: "user", content: promptText }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const answer = data.choices?.[0]?.message?.content || "";
  
  // Extract URLs if the model included citations (Perplexity Sonar online does this)
  const sources = [];
  const urlRegex = /https?:\/\/[^\s)\]"]+/g;
  const matches = answer.match(urlRegex) || [];
  matches.forEach(m => sources.push(m));

  return { answer: answer.trim(), sources: [...new Set(sources)] };
}

function detectMentions(answer, brands) {
  const lower = answer.toLowerCase();
  return brands.map((brand) => {
    let mentioned = false;
    let count = 0;
    for (const alias of brand.aliases) {
      const idx = lower.indexOf(alias.toLowerCase());
      if (idx !== -1) {
        mentioned = true;
        count += (lower.match(new RegExp(alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length;
      }
    }
    return { brand: brand.name, mentioned, count };
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║  Archdrift · SAMPLE RUN (OpenRouter Fallback Mode)         ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const rawAnswers = [];
  
  for (const prompt of SAMPLE_PROMPTS) {
    console.log(`\n▶ [${prompt.id}] "${prompt.text.slice(0, 90)}…"`);

    for (const engine of ENGINES) {
      process.stdout.write(`  → ${engine.label}... `);
      try {
        const { answer, sources } = await fetchFromOpenRouter(engine.modelId, prompt.text);
        const mentions = detectMentions(answer, BRANDS);
        const mentionedBrands = mentions.filter(m => m.mentioned).map(m => m.brand);
        
        console.log(`✓ (${mentionedBrands.length ? mentionedBrands.join(", ") : "none"})`);
        
        rawAnswers.push({
          promptId: prompt.id,
          engine: engine.label,
          mentionedBrands,
          answerPreview: answer.slice(0, 150).replace(/\n/g, " ") + "...",
          sourcesFound: sources.length
        });
        
        await sleep(1000);
      } catch (err) {
        console.log(`✗ ERROR: ${err.message}`);
      }
    }
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, "sample-answers-api.json"), JSON.stringify(rawAnswers, null, 2));
  console.log(`\n✅ Done! Saved to ${OUTPUT_DIR}/sample-answers-api.json\n`);
}

main().catch(console.error);
