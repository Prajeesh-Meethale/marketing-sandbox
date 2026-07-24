"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PremiumReportData, TransformedFindingCheck, TransformedTranscript } from "@/lib/reportAdapter";
import { DeveloperToolsNav } from "@/components/DeveloperToolsNav";
import { InvestigationData } from "@/lib/db";

interface PremiumReportViewProps {
  data: PremiumReportData;
  rawInvestigationData?: InvestigationData;
}

// Engine Mockup Cards Component (Authentic UI Mockups)
function EngineMockupCard({ 
  transcript, 
  isExpanded, 
  onToggleExpand 
}: { 
  transcript: TransformedTranscript; 
  isExpanded: boolean; 
  onToggleExpand: () => void 
}) {
  const engineLower = transcript.engine.toLowerCase();
  const isChatGPT = engineLower.includes("chatgpt") || engineLower.includes("openai");
  const isPerplexity = engineLower.includes("perplexity");
  const isClaude = engineLower.includes("claude") || engineLower.includes("anthropic");

  // --- 1. CHATGPT AUTHENTIC MOCKUP ---
  if (isChatGPT) {
    return (
      <div className="rounded-xl border border-[#303030] bg-[#212121] text-white shadow-xl overflow-hidden font-sans">
        {/* ChatGPT Header */}
        <div className="px-4 py-2.5 bg-[#171717] border-b border-[#2f2f2f] flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">ChatGPT</span>
            <span className="bg-[#2f2f2f] text-[#b4b4b4] px-2 py-0.5 rounded-md text-[11px] font-mono">4o ▾</span>
          </div>
          <span className="text-[#8e8e8e] text-[11px] font-mono">OpenAI Generative Engine</span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* User Prompt Bubble */}
          <div className="flex justify-end">
            <div className="bg-[#2f2f2f] text-white p-3.5 rounded-2xl w-full text-xs sm:text-sm leading-relaxed shadow-sm font-medium border border-[#3d3d3d]">
              <div className="text-[10px] font-mono text-[#a0a0a0] uppercase tracking-wider mb-1">User Prompt</div>
              "{transcript.query}"
            </div>
          </div>

          {/* ChatGPT Response */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0 mt-0.5 shadow">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729z" />
              </svg>
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-[#10a37f] uppercase tracking-wider font-mono">ChatGPT Response</div>
              <div className={`text-[#ececec] text-xs sm:text-sm leading-relaxed font-sans bg-[#2a2a2a] p-4 rounded-xl border border-[#383838] italic ${isExpanded ? '' : 'max-h-[280px] overflow-y-auto pr-2'}`}>
                "{transcript.rawText}"
              </div>
              {transcript.rawText.length > 250 && (
                <button onClick={onToggleExpand} className="text-[#10a37f] hover:underline text-xs font-mono font-semibold pt-1">
                  {isExpanded ? "Collapse ▲" : "Expand full transcript ▼"}
                </button>
              )}
            </div>
          </div>

          {/* Action Row & Result Tag */}
          <div className="pt-3 border-t border-[#2f2f2f] flex flex-wrap justify-between items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-3 text-[#8e8e8e] text-[11px]">
              <span>📋 Copy</span>
              <span>👍</span>
              <span>👎</span>
            </div>

            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide ${transcript.targetBrandMentioned ? 'bg-[#10a37f]/20 text-[#10a37f] border border-[#10a37f]/40' : 'bg-[#7A3B3B]/30 text-[#f87171] border border-[#7A3B3B]/50'}`}>
              {transcript.targetBrandMentioned ? `★ Mentioned (${transcript.rankText})` : `Omitted — Competitors: ${transcript.competitors.join(', ') || 'Category Peers'}`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. PERPLEXITY AUTHENTIC MOCKUP ---
  if (isPerplexity) {
    return (
      <div className="rounded-xl border border-[#1E293B] bg-[#0F172A] text-slate-100 shadow-xl overflow-hidden font-sans">
        {/* Perplexity Header */}
        <div className="px-4 py-2.5 bg-[#0B132B] border-b border-[#1E293B] flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#22B8CF] rounded-sm inline-block" />
            <span className="font-bold text-[#22B8CF] text-sm font-mono">Perplexity AI</span>
            <span className="bg-[#22B8CF]/20 text-[#22B8CF] px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold">Pro Search</span>
          </div>
          <span className="text-slate-400 text-[11px] font-mono">Real-Time Web Citations</span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* User Prompt */}
          <div className="bg-[#1E293B]/70 p-3.5 rounded-lg border border-[#334155] text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
            <span className="text-[#22B8CF] font-mono text-xs font-bold mr-2 block mb-1">PROMPT QUERY:</span>
            "{transcript.query}"
          </div>

          {/* Sources Cited Bar */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 overflow-x-auto pb-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Sources:</span>
            <span className="bg-[#1E293B] px-2 py-1 rounded text-[11px] text-slate-300 border border-slate-700 shrink-0">1. g2.com</span>
            <span className="bg-[#1E293B] px-2 py-1 rounded text-[11px] text-slate-300 border border-slate-700 shrink-0">2. capterra.com</span>
            <span className="bg-[#1E293B] px-2 py-1 rounded text-[11px] text-slate-300 border border-slate-700 shrink-0">3. trustradius.com</span>
          </div>

          {/* Perplexity Answer */}
          <div className="space-y-2">
            <div className={`text-slate-200 text-xs sm:text-sm leading-relaxed bg-[#1E293B]/50 p-4 rounded-lg border border-[#334155] italic ${isExpanded ? '' : 'max-h-[280px] overflow-y-auto pr-2'}`}>
              "{transcript.rawText}"
            </div>
            {transcript.rawText.length > 250 && (
              <button onClick={onToggleExpand} className="text-[#22B8CF] hover:underline text-xs font-mono font-semibold">
                {isExpanded ? "Collapse ▲" : "Expand full transcript ▼"}
              </button>
            )}
          </div>

          {/* Result Tag */}
          <div className="pt-3 border-t border-[#1E293B] flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 text-[11px]">Cited Answer Trace</span>
            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold ${transcript.targetBrandMentioned ? 'bg-[#22B8CF]/20 text-[#22B8CF] border border-[#22B8CF]/40' : 'bg-[#7A3B3B]/30 text-[#f87171] border border-[#7A3B3B]/50'}`}>
              {transcript.targetBrandMentioned ? `★ Mentioned (${transcript.rankText})` : `Omitted — Competitors: ${transcript.competitors.join(', ') || 'Category Peers'}`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. CLAUDE AUTHENTIC MOCKUP ---
  if (isClaude) {
    return (
      <div className="rounded-xl border border-[#3D2C25] bg-[#262422] text-[#E6E1DA] shadow-xl overflow-hidden font-sans">
        {/* Claude Header */}
        <div className="px-4 py-2.5 bg-[#1C1A18] border-b border-[#3D2C25] flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#D97757] rounded-full inline-block" />
            <span className="font-bold text-[#D97757] text-sm font-mono">Claude</span>
            <span className="bg-[#D97757]/20 text-[#D97757] px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold">3.5 Sonnet</span>
          </div>
          <span className="text-[#A39B92] text-[11px] font-mono">Anthropic Generative Engine</span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* User Prompt */}
          <div className="bg-[#33302C] p-3.5 rounded-lg border border-[#47433E] text-xs sm:text-sm text-[#E6E1DA] font-medium leading-relaxed">
            <div className="text-[10px] font-mono text-[#D97757] uppercase tracking-wider mb-1">User Prompt</div>
            "{transcript.query}"
          </div>

          {/* Claude Response */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-[#D97757] font-semibold">Claude Output</div>
            <div className={`text-[#E6E1DA] text-xs sm:text-sm leading-relaxed bg-[#33302C]/60 p-4 rounded-lg border border-[#47433E] italic ${isExpanded ? '' : 'max-h-[280px] overflow-y-auto pr-2'}`}>
              "{transcript.rawText}"
            </div>
            {transcript.rawText.length > 250 && (
              <button onClick={onToggleExpand} className="text-[#D97757] hover:underline text-xs font-mono font-semibold">
                {isExpanded ? "Collapse ▲" : "Expand full transcript ▼"}
              </button>
            )}
          </div>

          {/* Result Tag */}
          <div className="pt-3 border-t border-[#3D2C25] flex justify-between items-center text-xs font-mono">
            <span className="text-[#A39B92] text-[11px]">Anthropic Trace</span>
            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold ${transcript.targetBrandMentioned ? 'bg-[#D97757]/20 text-[#D97757] border border-[#D97757]/40' : 'bg-[#7A3B3B]/30 text-[#f87171] border border-[#7A3B3B]/50'}`}>
              {transcript.targetBrandMentioned ? `★ Mentioned (${transcript.rankText})` : `Omitted — Competitors: ${transcript.competitors.join(', ') || 'Category Peers'}`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- 4. GEMINI AUTHENTIC MOCKUP ---
  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#131314] text-slate-100 shadow-xl overflow-hidden font-sans">
      {/* Gemini Header */}
      <div className="px-4 py-2.5 bg-[#1E1F20] border-b border-[#2C2D30] flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="text-base">✨</span>
          <span className="font-bold text-white text-sm font-mono">Gemini</span>
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold">1.5 Pro</span>
        </div>
        <span className="text-slate-400 text-[11px] font-mono">Google Generative Model</span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* User Prompt */}
        <div className="bg-[#1E1F20] p-3.5 rounded-lg border border-[#333538] text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
          <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wider mb-1">User Query</div>
          "{transcript.query}"
        </div>

        {/* Gemini Answer */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-blue-400 font-semibold">Gemini Grounded Answer</div>
          <div className={`text-slate-200 text-xs sm:text-sm leading-relaxed bg-[#1E1F20]/70 p-4 rounded-lg border border-[#333538] italic ${isExpanded ? '' : 'max-h-[280px] overflow-y-auto pr-2'}`}>
            "{transcript.rawText}"
          </div>
          {transcript.rawText.length > 250 && (
            <button onClick={onToggleExpand} className="text-blue-400 hover:underline text-xs font-mono font-semibold">
              {isExpanded ? "Collapse ▲" : "Expand full transcript ▼"}
            </button>
          )}
        </div>

        {/* Result Tag */}
        <div className="pt-3 border-t border-[#2C2D30] flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Google Search Grounding</span>
          <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold ${transcript.targetBrandMentioned ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : 'bg-[#7A3B3B]/30 text-[#f87171] border border-[#7A3B3B]/50'}`}>
            {transcript.targetBrandMentioned ? `★ Mentioned (${transcript.rankText})` : `Omitted — Competitors: ${transcript.competitors.join(', ') || 'Category Peers'}`}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PremiumReportView({ data }: PremiumReportViewProps) {
  const [openFindings, setOpenFindings] = useState<Record<string, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const { metadata, ticks, openingNarrative, module1, module2, module3, module4, module5, closing } = data;

  // Set dynamic document title for PDF download filename
  useEffect(() => {
    if (metadata?.brandName) {
      const sanitizedBrand = metadata.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      document.title = `${sanitizedBrand}_archrift_visibility_report`;
    }
  }, [metadata]);

  // Track scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      setScrollProgress(height > 0 ? (scrolled / height) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFinding = (id: string) => {
    setOpenFindings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrintPDF = () => {
    if (metadata?.brandName) {
      const sanitizedBrand = metadata.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      document.title = `${sanitizedBrand}_archrift_visibility_report`;
    }
    window.print();
  };

  // FULL STANDALONE HTML EXPORT (INCLUDES ALL COMPLETE CSS STYLES & MOCKUPS)
  const handleExportHTML = () => {
    setIsExporting(true);
    const sanitizedBrand = (metadata?.brandName || "brand").toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    try {
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${metadata.brandName} — AI Visibility Investigation</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Work+Sans:wght@400;500;600&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:#1B1F27; --paper:#F2F1EC; --panel:#EAE8E1; --rule:#D9D6CB;
    --charcoal:#232420; --muted:#726E62; --accent:#2C4460; --flag:#7A3B3B;
    --moss:#4B6350; --on-ink:#EDEBE3; --on-ink-dim:#9B9A8F;
  }
  *{box-sizing:border-box;}
  body{margin:0; background:var(--paper); color:var(--charcoal); font-family:'Work Sans', sans-serif; font-size:16.5px; line-height:1.65;}
  h1,h2,h3{font-family:'Spectral', serif; font-weight:500;}
  .mono{font-family:'Roboto Mono', monospace;}
  .cover{background:var(--ink); color:var(--on-ink); padding:88px 28px 72px;}
  .cover-inner, main, .contents{max-width:680px; margin:0 auto;}
  .kicker{font-family:'Roboto Mono', monospace; font-size:0.72rem; letter-spacing:0.14em; text-transform:uppercase; color:var(--on-ink-dim); margin-bottom:36px;}
  .kicker b{color:var(--on-ink);}
  .cover h1{font-size:2.5rem; line-height:1.28; font-weight:500; max-width:22ch;}
  .cover h1 em{font-style:italic;}
  .cover-sub{max-width:52ch; font-size:1.02rem; color:var(--on-ink-dim); margin-top:22px;}
  .tick-row{margin-top:56px;}
  .tick-label-row{font-family:'Roboto Mono', monospace; font-size:0.68rem; letter-spacing:0.08em; text-transform:uppercase; color:var(--on-ink-dim); margin-bottom:12px;}
  .ticks{display:flex; gap:5px; align-items:flex-end;}
  .ticks i{flex:1; height:26px; background:rgba(237,235,227,0.14); border-radius:1px; display:block;}
  .ticks i.hit{background:var(--on-ink);}
  main{padding:0 28px;}
  section.block{padding:72px 0 56px; border-bottom:1px solid var(--rule);}
  .eyebrow{font-family:'Roboto Mono', monospace; font-size:0.7rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted); margin-bottom:16px;}
  .stat-row{display:flex; gap:52px; margin-top:36px;}
  .stat .value{font-family:'Spectral', serif; font-size:3rem; line-height:1;}
  .stat.primary .value{color:var(--flag);}
  .stat .cap{font-family:'Roboto Mono', monospace; font-size:0.68rem; color:var(--muted); margin-top:10px;}
  .callout{margin-top:32px; padding-left:20px; border-left:2px solid var(--accent); font-family:'Spectral', serif; font-style:italic; font-size:1.08rem;}
  
  /* Mockup Box Styles in HTML Export */
  .chatgpt-box{background:#212121; color:#fff; border:1px solid #303030; border-radius:12px; margin-top:20px; overflow:hidden;}
  .chatgpt-head{background:#171717; padding:10px 16px; font-family:'Roboto Mono',monospace; font-size:12px; border-bottom:1px solid #2f2f2f; display:flex; justify-between:space-between;}
  .chatgpt-body{padding:16px;}
  .chatgpt-prompt{background:#2f2f2f; color:#fff; padding:10px 16px; border-radius:16px; font-size:13px; margin-bottom:14px; text-align:right;}
  .chatgpt-[#10a37f]{color:#10a37f;}
  .chatgpt-text{background:#2a2a2a; padding:14px; border-radius:10px; border:1px solid #383838; font-size:13.5px; font-style:italic; color:#ececec;}
  .chatgpt-foot{border-top:1px solid #2f2f2f; padding:10px 16px; font-family:'Roboto Mono',monospace; font-size:11px; display:flex; justify-content:space-between; align-items:center;}

  .cite-row{display:grid; grid-template-columns:1fr 140px 110px; align-items:center; gap:18px; padding:13px 0; border-top:1px solid var(--rule);}
  .cite-bar{height:5px; background:var(--rule); border-radius:2px;}
  .cite-fill{height:100%; background:var(--accent);}
  .closing{background:var(--ink); color:var(--on-ink); padding:88px 28px 64px;}
  .cta-primary{font-family:'Roboto Mono', monospace; font-size:0.76rem; background:var(--on-ink); color:var(--ink); padding:13px 22px; text-decoration:none; display:inline-block; border-radius:2px;}
</style>
</head>
<body>
<header class="cover">
  <div class="cover-inner">
    <div class="kicker">AI Visibility Investigation &nbsp;·&nbsp; Prepared for <b>${metadata.brandName}</b> &nbsp;·&nbsp; ${metadata.auditedDate}</div>
    <h1>${openingNarrative.headlineText} <em>${openingNarrative.headlineEm}</em></h1>
    <p class="cover-sub">${openingNarrative.coverSub}</p>
  </div>
</header>
<main>
  <section class="block">
    <div class="eyebrow">Module 1 — The Reality Check</div>
    <h2>AI Recommendation Overview</h2>
    <div class="stat-row">
      <div class="stat primary"><div class="value">${module1.statRecommendationText}</div><div class="cap">Recommendation Rate</div></div>
      <div class="stat"><div class="value">${module1.statAeoText}</div><div class="cap">AEO Readiness Score</div></div>
    </div>
    <div class="callout">${module1.primaryFinding}</div>
  </section>
  <section class="block">
    <div class="eyebrow">Module 2 — The Evidence</div>
    <h2>Engine Recommendations</h2>
    ${module2.transcripts.map(t => `
      <div class="chatgpt-box">
        <div class="chatgpt-head">
          <span><b>${t.engine}</b> &nbsp;·&nbsp; Live Generative Trace</span>
          <span>Commercial Query</span>
        </div>
        <div class="chatgpt-body">
          <div class="chatgpt-prompt">"${t.query}"</div>
          <div class="chatgpt-text">"${t.rawText}"</div>
        </div>
        <div class="chatgpt-foot">
          <span>Rank: ${t.rankText}</span>
          <span style="color:${t.targetBrandMentioned ? "#10a37f" : "#f87171"}; font-weight:bold;">
            ${t.targetBrandMentioned ? "★ MENTIONED" : "OMITTED — Competitors: " + (t.competitors.join(", ") || "Category Peers")}
          </span>
        </div>
      </div>
    `).join("")}
  </section>
  <section class="block">
    <div class="eyebrow">Module 3 — The Forensics</div>
    <h2>Citation Node Analysis</h2>
    <p>${module3.summaryReadout}</p>
    ${module3.citations.map(c => `
      <div class="cite-row">
        <div class="mono" style="font-size:0.84rem;"><b>${c.domain}</b></div>
        <div class="cite-bar"><div class="cite-fill" style="width:${c.weightPercentage}%;"></div></div>
        <div class="mono" style="font-size:0.68rem; text-align:right; color:${c.targetBrandPresent ? "#4B6350" : "#7A3B3B"}; font-weight:bold;">
          ${c.targetBrandPresent ? "★ PRESENT" : "MISSING"}
        </div>
      </div>
    `).join("")}
  </section>
</main>
<footer class="closing">
  <div style="max-width:680px; margin:0 auto;">
    <h2>${closing.title}</h2>
    <p>${closing.body}</p>
    <a href="${closing.engagementUrl}" class="cta-primary">Discuss the full engagement</a>
  </div>
</footer>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sanitizedBrand}_archrift_visibility_report.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMD = () => {
    const sanitizedBrand = (metadata?.brandName || "brand").toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    let md = `# AI Visibility Report — ${metadata.brandName}\n\n`;
    md += `**Audited URL:** ${metadata.url}\n`;
    md += `**Date:** ${metadata.auditedDate}\n`;
    md += `**Recommendation Rate:** ${metadata.recommendationFraction}\n`;
    md += `**AEO Score:** ${metadata.aeoScore}/100\n\n`;

    md += `## Opening Narrative\n${openingNarrative.investigated}\n\n${openingNarrative.found}\n\n`;
    md += `## Module 1: Reality Check\n${module1.primaryFinding}\n\n`;
    
    md += `## Module 2: Crime Scene\n`;
    module2.transcripts.forEach(t => {
      md += `### ${t.engine} (${t.query})\n`;
      md += `- **Status:** ${t.targetBrandMentioned ? "Mentioned" : "Omitted"}\n`;
      md += `- **Rank:** ${t.rankText}\n`;
      md += `- **Transcript:** ${t.rawText}\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitizedBrand}_archrift_visibility_report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F2F1EC] text-[#232420] font-sans antialiased selection:bg-[#2C4460] selection:text-[#EDEBE3]">
      
      {/* Google Fonts Preconnect & Injection */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Work+Sans:wght@400;500;600&family=Roboto+Mono:wght@400;500&display=swap" 
        rel="stylesheet" 
      />

      <style jsx global>{`
        :root {
          --ink: #1B1F27;
          --paper: #F2F1EC;
          --panel: #EAE8E1;
          --rule: #D9D6CB;
          --charcoal: #232420;
          --muted: #726E62;
          --accent: #2C4460;
          --flag: #7A3B3B;
          --moss: #4B6350;
          --on-ink: #EDEBE3;
          --on-ink-dim: #9B9A8F;
        }

        .font-spectral { font-family: 'Spectral', serif; }
        .font-roboto-mono { font-family: 'Roboto Mono', monospace; }
        .font-work-sans { font-family: 'Work Sans', sans-serif; }

        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
          }

          .no-print, 
          header.sticky, 
          nav.border-b, 
          .developer-tools-nav,
          button {
            display: none !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            background-color: #F2F1EC !important;
            color: #232420 !important;
            font-size: 13.5px !important;
            line-height: 1.55 !important;
          }

          /* Ensure cover header starts cleanly */
          header.cover {
            background-color: #1B1F27 !important;
            color: #EDEBE3 !important;
            padding: 40px 24px !important;
            break-after: page;
            page-break-after: always;
          }

          /* Keep sections organized */
          section {
            padding-top: 32px !important;
            padding-bottom: 32px !important;
            break-inside: auto;
          }

          /* Prevent card cut-offs across page boundaries */
          div[class*="rounded-xl"],
          .stat-row,
          .cite-row,
          .group,
          .callout,
          .space-y-8 > div,
          .space-y-4 > div {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          /* Prevent orphaned headings */
          h1, h2, h3, h4, .eyebrow {
            break-after: avoid !important;
            page-break-after: avoid !important;
          }

          /* Ensure all response & transcript boxes unclip for print */
          .max-h-\[280px\],
          .max-h-\[160px\],
          .overflow-y-auto {
            max-height: none !important;
            overflow: visible !important;
          }

          /* Ensure dark engine cards retain rich contrast */
          .bg-\[\#212121\], .bg-\[\#0F172A\], .bg-\[\#262422\], .bg-\[\#131314\] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Floating Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-[#2C4460] z-50 transition-all duration-100 ease-linear no-print"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Operator Header Bar */}
      <header className="sticky top-0 bg-[#1B1F27]/95 backdrop-blur-md border-b border-[#2C4460]/40 text-[#EDEBE3] px-4 py-3 z-40 no-print">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="bg-[#2C4460] text-white hover:bg-[#3b597c] font-bold px-3 py-1.5 rounded transition inline-flex items-center gap-1"
            >
              + New Audit
            </Link>
            <span className="text-[#9B9A8F] hidden sm:inline">
              URL: <strong className="text-[#EDEBE3]">{metadata.url}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPDF}
              className="bg-[#EDEBE3] text-[#1B1F27] hover:bg-white font-bold px-3 py-1.5 rounded transition flex items-center gap-1.5 shadow-sm"
              title="Print or Save as PDF"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>

            <button
              onClick={handleExportHTML}
              disabled={isExporting}
              className="bg-[#EAE8E1] text-[#232420] hover:bg-white font-semibold px-2.5 py-1.5 rounded transition"
              title="Download standalone HTML file"
            >
              HTML
            </button>

            <button
              onClick={handleExportMD}
              className="bg-[#EAE8E1] text-[#232420] hover:bg-white font-semibold px-2.5 py-1.5 rounded transition"
              title="Download Markdown file"
            >
              MD
            </button>

            <DeveloperToolsNav />
          </div>
        </div>
      </header>

      {/* Cover Header */}
      <header className="cover bg-[#1B1F27] text-[#EDEBE3] px-7 py-20 sm:py-24 border-b border-[#2C4460]/30">
        <div className="max-w-[680px] mx-auto space-y-7">
          <div className="font-roboto-mono text-[0.72rem] tracking-[0.14em] uppercase text-[#9B9A8F]">
            AI Visibility Investigation &nbsp;·&nbsp; Prepared for <b className="text-[#EDEBE3] font-medium">{metadata.brandName}</b> &nbsp;·&nbsp; {metadata.auditedDate}
          </div>

          <h1 className="font-spectral text-3xl sm:text-4xl md:text-[2.7rem] leading-[1.28] font-normal max-w-[21ch]">
            {openingNarrative.headlineText} <em className="italic text-[#EDEBE3] font-normal">{openingNarrative.headlineEm}</em>
          </h1>

          <p className="font-work-sans text-[#9B9A8F] text-[1.02rem] leading-relaxed max-w-[52ch]">
            {openingNarrative.coverSub}
          </p>

          {/* Recommendation Ticks Bar */}
          <div className="pt-8">
            <div className="font-roboto-mono text-[0.68rem] tracking-[0.08em] uppercase text-[#9B9A8F] mb-3">
              Recommendation trace — {metadata.totalQueriesRun} queries evaluated
            </div>
            <div className="flex gap-[5px] items-end">
              {ticks.map((isHit, idx) => (
                <i 
                  key={idx} 
                  className={`flex-1 h-[26px] rounded-[1px] block transition-colors duration-300 ${isHit ? 'bg-[#EDEBE3]' : 'bg-[#EDEBE3]/15'}`}
                  title={`Query #${idx + 1}: ${isHit ? 'Mentioned' : 'Omitted'}`}
                />
              ))}
            </div>
            <div className="font-roboto-mono text-[0.72rem] text-[#9B9A8F] mt-2.5">
              <b className="text-[#EDEBE3] font-medium">{metadata.totalMentions} mention</b> recorded across {metadata.totalQueriesRun} buying conversations
            </div>
          </div>
        </div>
      </header>

      {/* Table of Contents Navigation */}
      <nav className="border-b border-[#D9D6CB]">
        <div className="max-w-[680px] mx-auto px-7 py-10">
          <div className="font-roboto-mono text-[0.68rem] tracking-[0.12em] uppercase text-[#726E62] mb-4">
            Contents
          </div>
          <ol className="grid gap-1 font-work-sans text-[0.96rem] list-none p-0 m-0">
            <li className="flex items-baseline gap-3.5 py-2 border-b border-dotted border-[#D9D6CB]">
              <span className="font-roboto-mono text-[0.78rem] text-[#726E62] w-[22px]">01</span>
              <a href="#m1" className="hover:text-[#2C4460] transition-colors flex-1">Module 1 — The Reality Check</a>
            </li>
            <li className="flex items-baseline gap-3.5 py-2 border-b border-dotted border-[#D9D6CB]">
              <span className="font-roboto-mono text-[0.78rem] text-[#726E62] w-[22px]">02</span>
              <a href="#m2" className="hover:text-[#2C4460] transition-colors flex-1">Module 2 — The Evidence (Crime Scene)</a>
            </li>
            <li className="flex items-baseline gap-3.5 py-2 border-b border-dotted border-[#D9D6CB]">
              <span className="font-roboto-mono text-[0.78rem] text-[#726E62] w-[22px]">03</span>
              <a href="#m3" className="hover:text-[#2C4460] transition-colors flex-1">Module 3 — The Forensics (Citation Authority)</a>
            </li>
            <li className="flex items-baseline gap-3.5 py-2 border-b border-dotted border-[#D9D6CB]">
              <span className="font-roboto-mono text-[0.78rem] text-[#726E62] w-[22px]">04</span>
              <a href="#m4" className="hover:text-[#2C4460] transition-colors flex-1">Module 4 — The Machine Layer (AEO Audit)</a>
            </li>
            <li className="flex items-baseline gap-3.5 py-2 border-b border-dotted border-[#D9D6CB]">
              <span className="font-roboto-mono text-[0.78rem] text-[#726E62] w-[22px]">05</span>
              <a href="#m5" className="hover:text-[#2C4460] transition-colors flex-1">Module 5 — The Action Roadmap</a>
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content Body */}
      <main className="max-w-[680px] mx-auto px-7">

        {/* Executive Opening Narrative */}
        <section className="py-16 border-b border-[#D9D6CB] space-y-6">
          <div className="font-roboto-mono text-[0.7rem] tracking-[0.12em] uppercase text-[#726E62]">
            Executive Briefing
          </div>
          <h2 className="font-spectral text-2xl sm:text-3xl text-[#232420] font-normal leading-snug">
            What We Investigated & Found
          </h2>

          <div className="space-y-4 text-[1.02rem] text-[#232420] leading-relaxed">
            <p>{openingNarrative.investigated}</p>
            <p className="font-medium text-[#1B1F27] bg-[#EAE8E1] p-4 rounded-sm border-l-2 border-[#2C4460]">
              {openingNarrative.found}
            </p>
          </div>
        </section>

        {/* MODULE 1: Reality Check */}
        <section id="m1" className="py-16 border-b border-[#D9D6CB] space-y-8 scroll-mt-14">
          <div>
            <div className="font-roboto-mono text-[0.7rem] tracking-[0.12em] uppercase text-[#726E62] mb-3">
              Module 1 &nbsp;·&nbsp; <b className="text-[#2C4460] font-medium">The Reality Check</b>
            </div>
            <h2 className="font-spectral text-2xl sm:text-3xl font-normal max-w-[24ch]">
              Are AI systems recommending you when buyers ask?
            </h2>
          </div>

          <div className="flex flex-wrap gap-10 items-baseline pt-4">
            <div className="space-y-1">
              <div className="font-spectral text-4xl sm:text-5xl font-medium text-[#7A3B3B] leading-none">
                {module1.statRecommendationText}
              </div>
              <div className="font-roboto-mono text-[0.68rem] tracking-[0.05em] uppercase text-[#726E62] pt-2">
                AI Recommendation Rate
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-spectral text-4xl sm:text-5xl font-medium text-[#232420] leading-none">
                {module1.statAeoText}
              </div>
              <div className="font-roboto-mono text-[0.68rem] tracking-[0.05em] uppercase text-[#726E62] pt-2">
                Technical Readiness
              </div>
            </div>
          </div>

          <div className="mt-8 pl-5 border-l-2 border-[#2C4460] font-spectral italic text-[1.08rem] text-[#2A2C24] leading-relaxed">
            "{module1.primaryFinding}"
          </div>
        </section>

        {/* MODULE 2: Crime Scene (Transcripts with Authentic Engine Traces) */}
        <section id="m2" className="py-16 border-b border-[#D9D6CB] space-y-8 scroll-mt-14">
          <div>
            <div className="font-roboto-mono text-[0.7rem] tracking-[0.12em] uppercase text-[#726E62] mb-3">
              Module 2 &nbsp;·&nbsp; <b className="text-[#2C4460] font-medium">The Evidence</b>
            </div>
            <h2 className="font-spectral text-2xl sm:text-3xl font-normal max-w-[24ch]">
              What buyers are seeing & who is recommended instead
            </h2>
          </div>

          <div className="space-y-8 pt-2">
            {module2.transcripts.map((t) => {
              const transcriptKey = `trans-${t.id}`;
              const isExpanded = !!openFindings[transcriptKey];

              return (
                <EngineMockupCard
                  key={t.id}
                  transcript={t}
                  isExpanded={isExpanded}
                  onToggleExpand={() => toggleFinding(transcriptKey)}
                />
              );
            })}
          </div>
        </section>

        {/* MODULE 3: Forensics (Citation Authority) */}
        <section id="m3" className="py-16 border-b border-[#D9D6CB] space-y-8 scroll-mt-14">
          <div>
            <div className="font-roboto-mono text-[0.7rem] tracking-[0.12em] uppercase text-[#726E62] mb-3">
              Module 3 &nbsp;·&nbsp; <b className="text-[#2C4460] font-medium">The Forensics</b>
            </div>
            <h2 className="font-spectral text-2xl sm:text-3xl font-normal max-w-[24ch]">
              Why AI trusts competitors more than you
            </h2>
          </div>

          <div className="p-5 bg-[#EAE8E1] rounded-sm font-work-sans text-[0.98rem] leading-relaxed border-l-2 border-[#2C4460]">
            {module3.summaryReadout}
          </div>

          <div className="pt-2">
            <div className="font-roboto-mono text-[0.68rem] tracking-[0.12em] uppercase text-[#726E62] mb-2 pb-2 border-b border-[#D9D6CB]">
              Cited Source Node Analysis
            </div>

            <div className="divide-y divide-[#D9D6CB]">
              {module3.citations.map((c) => (
                <div key={c.id} className="grid grid-cols-[1fr_140px_110px] items-center gap-4 py-3.5 text-sm">
                  <div className="font-roboto-mono text-[0.84rem] text-[#232420] truncate font-medium">
                    {c.domain}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-[5px] bg-[#D9D6CB] rounded-sm overflow-hidden">
                      <div className="h-full bg-[#2C4460]" style={{ width: `${c.weightPercentage}%` }} />
                    </div>
                    <span className="font-roboto-mono text-[0.65rem] text-[#726E62]">{c.weightPercentage}%</span>
                  </div>

                  <div className={`font-roboto-mono text-[0.68rem] tracking-[0.03em] uppercase text-right font-medium ${c.targetBrandPresent ? 'text-[#4B6350]' : 'text-[#7A3B3B]'}`}>
                    {c.targetBrandPresent ? '★ PRESENT' : 'MISSING'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MODULE 4: Machine Layer (AEO Audit) */}
        <section id="m4" className="py-16 border-b border-[#D9D6CB] space-y-8 scroll-mt-14">
          <div>
            <div className="font-roboto-mono text-[0.7rem] tracking-[0.12em] uppercase text-[#726E62] mb-3">
              Module 4 &nbsp;·&nbsp; <b className="text-[#2C4460] font-medium">The Machine Layer</b>
            </div>
            <h2 className="font-spectral text-2xl sm:text-3xl font-normal max-w-[24ch]">
              What AI actually sees when it looks at you
            </h2>
          </div>

          <div className="space-y-8 pt-2">
            {module4.groupings.map((group, gIdx) => (
              <div key={gIdx} className="space-y-3">
                <h3 className="font-work-sans font-semibold text-[0.98rem] text-[#232420] pt-2">
                  {group.consequenceHeading}
                </h3>

                <div className="border-t border-[#D9D6CB] divide-y divide-[#D9D6CB]">
                  {group.findings.map((f, fIdx) => {
                    const findingId = `${gIdx}-${fIdx}`;
                    const isOpen = !!openFindings[findingId];

                    return (
                      <div key={fIdx} className="group">
                        <button
                          onClick={() => toggleFinding(findingId)}
                          className="w-full flex items-baseline justify-between gap-4 py-4 text-left font-work-sans text-[0.96rem] hover:text-[#2C4460] transition-colors"
                        >
                          <span className="flex-1 font-medium">{f.checkName}</span>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`font-roboto-mono text-[0.66rem] tracking-[0.04em] uppercase font-bold ${f.confidence === 'HIGH' ? 'text-[#7A3B3B]' : 'text-[#726E62]'}`}>
                              Confidence: {f.confidence}
                            </span>
                            <span className="w-3.5 h-3.5 relative shrink-0 text-[#726E62]">
                              {isOpen ? '−' : '+'}
                            </span>
                          </div>
                        </button>

                        {isOpen && (
                          <div className="pb-5 space-y-3 text-[0.93rem] max-w-[56ch] font-work-sans">
                            <div className="flex gap-3">
                              <span className="font-roboto-mono text-[0.65rem] tracking-[0.04em] uppercase text-[#726E62] w-[100px] shrink-0 pt-0.5">Symptom</span>
                              <span className="text-[#232420]">{f.symptom}</span>
                            </div>

                            <div className="flex gap-3">
                              <span className="font-roboto-mono text-[0.65rem] tracking-[0.04em] uppercase text-[#726E62] w-[100px] shrink-0 pt-0.5">Mechanism</span>
                              <span className="text-[#232420]">{f.mechanism}</span>
                            </div>

                            <div className="flex gap-3">
                              <span className="font-roboto-mono text-[0.65rem] tracking-[0.04em] uppercase text-[#726E62] w-[100px] shrink-0 pt-0.5">Business Cost</span>
                              <span className="text-[#7A3B3B] font-medium">{f.businessCost}</span>
                            </div>

                            <div className="pt-3 border-t border-dotted border-[#D9D6CB] flex items-center justify-between gap-3 text-[0.9rem]">
                              <span><strong>Fix:</strong> {f.fix}</span>
                              <span className={`font-roboto-mono text-[0.66rem] tracking-[0.04em] uppercase font-semibold ${f.quickWin ? 'text-[#4B6350]' : 'text-[#726E62]'}`}>
                                {f.quickWin ? '★ Quick Win' : `Effort: ${f.effort}`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border border-[#D9D6CB] rounded-sm text-[0.94rem]">
            <span className="font-roboto-mono text-[0.68rem] tracking-[0.05em] uppercase text-[#4B6350] block mb-1 font-bold">
              ✓ Passed Checks
            </span>
            {module4.confirmingLine}
          </div>
        </section>

        {/* MODULE 5: Roadmap */}
        <section id="m5" className="py-16 border-b border-[#D9D6CB] space-y-8 scroll-mt-14">
          <div>
            <div className="font-roboto-mono text-[0.7rem] tracking-[0.12em] uppercase text-[#726E62] mb-3">
              Module 5 &nbsp;·&nbsp; <b className="text-[#2C4460] font-medium">The Action Roadmap</b>
            </div>
            <h2 className="font-spectral text-2xl sm:text-3xl font-normal max-w-[24ch]">
              Prioritized optimizations for maximum AI visibility
            </h2>
          </div>

          <div className="space-y-8 pt-2">
            {module5.phases.map((phase) => (
              <div key={phase.phaseNumber} className="space-y-3">
                <div className="font-roboto-mono text-[0.7rem] uppercase text-[#726E62] tracking-[0.08em]">
                  Phase {phase.phaseNumber}
                </div>
                <h3 className="font-spectral text-xl font-normal text-[#232420]">
                  {phase.title}
                </h3>

                <div className="border-t border-[#D9D6CB] divide-y divide-[#D9D6CB]">
                  {phase.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-baseline gap-4 py-3.5 text-[0.94rem]">
                      <div className="space-y-1 max-w-[46ch]">
                        <div className="font-medium text-[#232420] flex items-center gap-2">
                          {item.title}
                          {item.quickWin && (
                            <span className="font-roboto-mono text-[0.62rem] uppercase tracking-wider bg-[#4B6350] text-white px-2 py-0.5 rounded-sm">
                              ★ Quick Win
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#726E62] leading-relaxed">{item.description}</p>
                      </div>

                      <div className="font-roboto-mono text-[0.64rem] uppercase tracking-[0.04em] text-[#2C4460] font-semibold shrink-0">
                        {item.derivedFromModule}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 border-b border-[#D9D6CB] space-y-8">
          <div>
            <div className="font-roboto-mono text-[0.7rem] tracking-[0.12em] uppercase text-[#726E62] mb-2">
              Client Impact
            </div>
            <h2 className="font-spectral text-2xl font-normal">
              What founders say about AI Visibility investigations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#D9D6CB] border border-[#D9D6CB]">
            <div className="bg-[#F2F1EC] p-6 space-y-4">
              <p className="font-spectral italic text-[0.98rem] text-[#2A2C24] leading-relaxed m-0">
                "The audit told us things about our site we didn't know — pages that looked fine to a person but were essentially invisible to a crawler."
              </p>
              <div className="flex justify-between items-baseline text-xs font-work-sans pt-2 border-t border-[#D9D6CB]/60">
                <div>
                  <span className="font-semibold block">Tom Halvorsen</span>
                  <span className="text-[#726E62]">Founder, Northgrain Goods</span>
                </div>
                <span className="font-roboto-mono text-[0.62rem] uppercase text-[#2C4460]">E-Commerce</span>
              </div>
            </div>

            <div className="bg-[#F2F1EC] p-6 space-y-4">
              <p className="font-spectral italic text-[0.98rem] text-[#2A2C24] leading-relaxed m-0">
                "In healthcare software, trust signals matter more than almost anything else. Archdrift's forensics showed us exactly which sources AI leaned on."
              </p>
              <div className="flex justify-between items-baseline text-xs font-work-sans pt-2 border-t border-[#D9D6CB]/60">
                <div>
                  <span className="font-semibold block">Elena Roussel</span>
                  <span className="text-[#726E62]">CMO, Verita Health</span>
                </div>
                <span className="font-roboto-mono text-[0.62rem] uppercase text-[#2C4460]">Healthcare SaaS</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Closing Footer & Action Section */}
      <footer id="closing" className="closing bg-[#1B1F27] text-[#EDEBE3] px-7 py-20 mt-12 border-t border-[#2C4460]/40">
        <div className="max-w-[640px] mx-auto space-y-6">
          <div className="font-roboto-mono text-[0.7rem] tracking-[0.12em] uppercase text-[#9B9A8F]">
            Final Assessment
          </div>

          <h2 className="font-spectral text-2xl sm:text-3xl font-normal leading-snug max-w-[22ch]">
            {closing.title}
          </h2>

          <p className="font-work-sans text-[#9B9A8F] text-[1rem] leading-relaxed max-w-[56ch]">
            {closing.body}
          </p>

          <div className="pt-6 flex flex-wrap gap-5 items-center">
            <a 
              href={closing.engagementUrl}
              target={closing.engagementUrl.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="font-roboto-mono text-[0.76rem] tracking-[0.05em] uppercase bg-[#EDEBE3] text-[#1B1F27] hover:bg-white px-6 py-3.5 rounded-sm font-semibold transition-colors"
            >
              Discuss the full engagement
            </a>

            <button 
              onClick={handlePrintPDF}
              className="font-roboto-mono text-[0.76rem] text-[#9B9A8F] hover:text-white underline underline-offset-4 transition-colors"
            >
              Download this report (PDF)
            </button>
          </div>

          <div className="pt-12 border-t border-[#EDEBE3]/10 font-roboto-mono text-[0.66rem] text-[#9B9A8F] flex flex-wrap justify-between gap-3">
            <span>Prepared for {metadata.domainHost}</span>
            <span>Archdrift — Proprietary AI Visibility Audit</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
