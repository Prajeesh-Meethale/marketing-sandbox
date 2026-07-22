const fs = require("fs");
const path = require("path");

const BRANDS = [
  { name: "Groww",    domains: ["groww.in"], aliases: ["groww"] },
  { name: "Zerodha",  domains: ["zerodha.com", "zerodha.tech"], aliases: ["zerodha", "kite by zerodha"] },
  { name: "Razorpay", domains: ["razorpay.com"], aliases: ["razorpay"] },
  { name: "PhonePe",  domains: ["phonepe.com"], aliases: ["phonepe", "phone pe"] },
  { name: "Paytm",    domains: ["paytm.com", "ir.paytm.com", "paytmbank.com"], aliases: ["paytm"] },
  { name: "CRED",     domains: ["cred.club"], aliases: ["cred", "cred.club"] },
  { name: "Slice",    domains: ["slice.com", "slice.so"], aliases: ["slice"] },
  { name: "Upstox",   domains: ["upstox.com"], aliases: ["upstox"] }
];

const PROMPTS = [
  { id: "P01", text: "Best app to start investing in mutual funds for a beginner in India?" },
  { id: "P02", text: "Groww vs Zerodha for long term investing?" },
  { id: "P03", text: "Is Upstox better than Zerodha for options trading in India?" },
  { id: "P04", text: "Which Indian broker has the lowest charges for equity delivery?" },
  { id: "P05", text: "Safest platform to invest 1000 rupees a month in SIP in India?" },
  { id: "P06", text: "How to buy US stocks from India with low fees?" },
  { id: "P07", text: "Best demat account for family in India 2026?" },
  { id: "P08", text: "Is PhonePe safer than Paytm for daily UPI transactions?" },
  { id: "P09", text: "Best UPI app for cashback and rewards in India?" },
  { id: "P10", text: "Can I still use Paytm for UPI after the RBI ban?" },
  { id: "P11", text: "Slice app vs CRED for UPI payments - which is better?" },
  { id: "P12", text: "Best app to pay credit card bills in India for rewards?" },
  { id: "P13", text: "Is CRED worth it in 2026 for a premium credit card user?" },
  { id: "P14", text: "What are the hidden charges in the Slice credit card alternative?" },
  { id: "P15", text: "Best personal loan app in India without salary slip?" },
  { id: "P16", text: "Razorpay vs Cashfree vs PayU for Indian SaaS startup?" },
  { id: "P17", text: "Which payment gateway in India has the best developer API?" },
  { id: "P18", text: "Best way for an Indian freelancer to receive international payments?" },
  { id: "P19", text: "Cheapest payment gateway for an e-commerce store in India?" },
  { id: "P20", text: "Best platform to buy term life insurance online in India?" },
  { id: "P21", text: "Where should I buy health insurance - directly or via apps like PhonePe?" },
  { id: "P22", text: "Which Indian fintech app has the best customer support?" },
  { id: "P23", text: "Most trusted fintech brand in India in 2026?" },
  { id: "P24", text: "Best app for digital gold investment in India?" },
  { id: "P25", text: "How to invest in corporate bonds online in India?" },
  { id: "P26", text: "Alternative to FD with better returns and high safety in India?" },
  { id: "P27", text: "Which platform gives the most accurate stock market analysis for beginners?" },
  { id: "P28", text: "Best Buy Now Pay Later (BNPL) app in India?" },
  { id: "P29", text: "Is getting a loan from Paytm safe?" },
  { id: "P30", text: "Which app offers instant credit line for students in India?" },
];

const PLATFORMS = [
  { id: "chatgpt", label: "ChatGPT", targetUrl: "https://chatgpt.com", datasetId: process.env.BRIGHT_DATA_DATASET_CHATGPT },
  { id: "perplexity", label: "Perplexity", targetUrl: "https://www.perplexity.ai", datasetId: process.env.BRIGHT_DATA_DATASET_PERPLEXITY },
  { id: "gemini", label: "Gemini", targetUrl: "https://gemini.google.com", datasetId: process.env.BRIGHT_DATA_DATASET_GEMINI },
  { id: "copilot", label: "Copilot", targetUrl: "https://copilot.microsoft.com", datasetId: process.env.BRIGHT_DATA_DATASET_COPILOT },
  { id: "google_ai", label: "Google AI", targetUrl: "https://www.google.com/search?udm=50", datasetId: process.env.BRIGHT_DATA_DATASET_GOOGLE_AI },
];

const OUTPUT_DIR = path.join(__dirname, "output", "full-study");

const TRIGGER_URL = "https://api.brightdata.com/datasets/v3/trigger";
const SNAPSHOT_URL = "https://api.brightdata.com/datasets/v3/snapshot";

async function triggerBrightData(platform, keyword) {
  const apiKey = process.env.BRIGHT_DATA_KEY;
  const payload = [{ url: platform.targetUrl, prompt: keyword, country: "US" }];
  
  const res = await fetch(`${TRIGGER_URL}?dataset_id=${platform.datasetId}&include_errors=true`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Trigger failed for ${platform.id}: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.snapshot_id || data.id;
}

async function pollBrightData(snapshotId) {
  const apiKey = process.env.BRIGHT_DATA_KEY;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 8000));
    const res = await fetch(`${SNAPSHOT_URL}/${snapshotId}?format=json`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.status === 200) {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (Array.isArray(data)) return data[0];
        if (data.data && Array.isArray(data.data)) return data.data[0];
      } catch {
        const lines = text.split("\n").filter(l => l.trim()).map(l => JSON.parse(l));
        if (lines.length > 0) return lines[0];
      }
    }
  }
  throw new Error(`Timeout polling ${snapshotId}`);
}

async function fetchGeminiGrounding(keyword) {
  const apiKey = process.env.GEMINI_API_KEY;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: keyword }] }],
      tools: [{ googleSearch: {} }]
    })
  });
  if (!res.ok) throw new Error(`Gemini Error ${res.status}`);
  return await res.json();
}

async function runAudit(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Archdrift-Crawler/1.0" }, redirect: "follow" });
    if (!res.ok) return { url, status: "error", error: res.statusText };
    const html = await res.text();
    const wordCount = html.replace(/<[^>]+>/g, " ").split(/\s+/).length;
    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    const isHttps = url.startsWith("https");
    const hasSchema = html.includes("application/ld+json") || html.includes("schema.org");
    const hasRobots = await fetch(new URL("/robots.txt", url).toString()).then(r => r.ok).catch(() => false);
    
    return {
      url,
      wordCount,
      h1Count,
      isHttps,
      hasSchema,
      hasRobots,
      score: (wordCount > 300 ? 20 : 0) + (h1Count === 1 ? 20 : 0) + (isHttps ? 20 : 0) + (hasSchema ? 20 : 0) + (hasRobots ? 20 : 0)
    };
  } catch (err) {
    return { url, status: "error", error: err.message };
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`\n🚀 Starting Full 30-Prompt Study on 5 Platforms (150 Scrapes)`);

  const scrapeJobs = [];
  const rawData = [];

  // 1. Trigger all brightdata scrapes
  console.log(`\n📦 Triggering 150 BrightData scrapes...`);
  for (const prompt of PROMPTS) {
    for (const platform of PLATFORMS) {
      try {
        const snapshotId = await triggerBrightData(platform, prompt.text);
        scrapeJobs.push({ prompt, platform, snapshotId });
        process.stdout.write(".");
      } catch (err) {
        console.log(`\n✗ Error triggering ${platform.id} for P${prompt.id}: ${err.message}`);
      }
    }
  }
  console.log(`\n\n⏳ Waiting for BrightData snapshots to complete (this will take a few minutes)...`);

  // 2. Poll all
  const pollPromises = scrapeJobs.map(async (job) => {
    try {
      const record = await pollBrightData(job.snapshotId);
      const answer = record?.answer_text_markdown || record?.answer_text || "";
      const citations = record?.citations || record?.sources || [];
      
      const mentioned = BRANDS.map(b => {
        let count = 0;
        b.aliases.forEach(alias => {
          count += (answer.toLowerCase().match(new RegExp(alias.toLowerCase(), "gi")) || []).length;
        });
        return { brand: b.name, count };
      }).filter(m => m.count > 0);

      rawData.push({
        promptId: job.prompt.id,
        promptText: job.prompt.text,
        platform: job.platform.id,
        answer,
        citations,
        mentioned
      });
      process.stdout.write("✓");
    } catch (err) {
      process.stdout.write("✗");
      rawData.push({
        promptId: job.prompt.id,
        platform: job.platform.id,
        error: err.message
      });
    }
  });

  await Promise.all(pollPromises);
  fs.writeFileSync(path.join(OUTPUT_DIR, "raw-answers.json"), JSON.stringify(rawData, null, 2));

  // 3. Gemini Grounding
  console.log(`\n\n🔍 Running Gemini Grounding...`);
  const groundingData = [];
  for (const prompt of PROMPTS) {
    try {
      const g = await fetchGeminiGrounding(prompt.text);
      const candidate = g.candidates?.[0];
      const metadata = candidate?.groundingMetadata;
      const chunks = metadata?.groundingChunks?.map(c => c?.web?.uri) || [];
      groundingData.push({ promptId: prompt.id, chunks });
      process.stdout.write("G");
    } catch (err) {
      process.stdout.write("E");
    }
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, "gemini-grounding.json"), JSON.stringify(groundingData, null, 2));

  // 4. AEO Audit
  console.log(`\n\n🛠 Running AEO Audits...`);
  const auditData = [];
  for (const brand of BRANDS) {
    for (const domain of brand.domains) {
      const res = await runAudit(`https://${domain}`);
      auditData.push({ brand: brand.name, ...res });
      process.stdout.write("A");
    }
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, "aeo-audits.json"), JSON.stringify(auditData, null, 2));

  console.log(`\n\n✅ DONE! All raw data saved to ${OUTPUT_DIR}`);
}

main().catch(console.error);
