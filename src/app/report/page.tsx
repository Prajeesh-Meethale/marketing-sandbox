import { getInvestigationData } from "@/lib/db";
import Link from "next/link";
import { DeveloperToolsNav } from "@/components/DeveloperToolsNav";
import { ExportButton } from "@/components/ExportButton";

export const dynamic = 'force-dynamic';

export default async function FinalReportView() {
  const data = await getInvestigationData();
  const { website, findings, evidence, citations, insights, recommendations } = data;

  if (!website && findings.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">No Report Found</h1>
          <p className="text-gray-500 mb-6">Please run a new prospect investigation first.</p>
          <Link 
            href="/" 
            className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition"
          >
            ← Start New Investigation
          </Link>
        </div>
      </main>
    );
  }

  // Calculate SRO metrics
  const totalFindings = findings.length;
  const mentionedFindings = findings.filter(f => f.targetBrandMentioned);
  const sroVisibilityRate = totalFindings > 0 ? Math.round((mentionedFindings.length / totalFindings) * 100) : 0;
  const quickWins = recommendations.filter(r => r.impact === "HIGH" && r.effort === "LOW");

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition text-xs flex items-center gap-1"
            >
              + New Audit
            </Link>
            <span className="text-xs text-gray-500 font-mono hidden sm:inline">
              Audited URL: <span className="font-bold text-gray-900">{website?.url}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ExportButton data={data} />
            <DeveloperToolsNav />
          </div>
        </div>

        {/* Report Cover / Header */}
        <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-2xl space-y-6">
          <div className="flex justify-between items-start">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-widest">
              AI Visibility & AEO Audit Report
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {website?.lastAuditedAt ? new Date(website.lastAuditedAt).toLocaleDateString() : ""}
            </span>
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              AI Visibility Report
            </h1>
            <p className="text-indigo-200 text-lg sm:text-xl mt-2 max-w-2xl font-light">
              Comprehensive Answer Engine Optimization (AEO) and Selection Rate Optimization (SRO) investigation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
            <div className="bg-white/5 backdrop-blur p-4 rounded-2xl border border-white/10">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technical AEO Score</div>
              <div className="text-3xl font-extrabold text-blue-400 mt-1">{website?.aeoScore ?? 0} <span className="text-sm font-normal text-slate-400">/ 100</span></div>
            </div>

            <div className="bg-white/5 backdrop-blur p-4 rounded-2xl border border-white/10">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Selection Rate (SRO)</div>
              <div className="text-3xl font-extrabold text-purple-400 mt-1">{sroVisibilityRate}%</div>
            </div>

            <div className="bg-white/5 backdrop-blur p-4 rounded-2xl border border-white/10">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">High-Impact Quick Wins</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">{quickWins.length}</div>
            </div>
          </div>
        </header>

        {/* MODULE 1: Reality Check */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-6">
          <div className="border-b pb-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Module 1</span>
            <h2 className="text-2xl font-extrabold text-gray-900">Reality Check</h2>
            <p className="text-gray-500 text-sm mt-0.5">Overall market presence and AI engine recommendation reality.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-gray-200 space-y-3">
              <h3 className="font-bold text-gray-900">AI Recommendation Overview</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The target brand is currently recommended in <strong className="text-gray-900">{mentionedFindings.length} out of {totalFindings}</strong> evaluated commercial buyer queries across major AI engines.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-gray-200 space-y-3">
              <h3 className="font-bold text-gray-900">Crawler Accessibility</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Technical crawler readiness scored <strong className="text-blue-600">{website?.aeoScore ?? 0}/100</strong>. Implementing missing machine-readable specifications will improve model training inclusion.
              </p>
            </div>
          </div>
        </section>

        {/* MODULE 2: Crime Scene (SRO Rank Breakdown) */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-6">
          <div className="border-b pb-4">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Module 2</span>
            <h2 className="text-2xl font-extrabold text-gray-900">Crime Scene (Engine Recommendations)</h2>
            <p className="text-gray-500 text-sm mt-0.5">Where your brand was recommended vs omitted by target AI models.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {findings.map((f) => {
              const ev = evidence.find(e => e.id === f.evidenceId);
              const targetEngine = ev?.targetEngine || ev?.engine || "Target Engine";

              return (
                <div key={f.id} className="p-6 rounded-2xl border border-gray-200 bg-gray-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {targetEngine}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${f.targetBrandMentioned ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                      {f.targetBrandMentioned ? "Mentioned" : "Omitted"}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Rank Position:</span>
                      <span className="font-bold text-gray-900">{f.targetRank ? `#${f.targetRank}` : "Omitted / Unranked"}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-gray-500">Competitors Listed:</span>
                      <span className="font-semibold text-gray-800">{f.competitorsMentioned.join(", ") || "None"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MODULE 3: Technical Forensics */}
        {website && (
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-6">
            <div className="border-b pb-4">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Module 3</span>
              <h2 className="text-2xl font-extrabold text-gray-900">Technical AEO Audit</h2>
              <p className="text-gray-500 text-sm mt-0.5">Machine readability and crawler policy readiness.</p>
            </div>

            <div className="space-y-3">
              {website.technicalChecks.map((check, idx) => {
                const isPass = check.status === "PASS";
                const isWarn = check.status === "WARNING";
                const badgeColor = isPass ? "bg-emerald-100 text-emerald-800" : isWarn ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800";

                return (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex justify-between items-center gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{check.type}</h3>
                      {check.details && <p className="text-xs text-gray-600 mt-0.5">{check.details}</p>}
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide shrink-0 ${badgeColor}`}>
                      {check.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* MODULE 4: Machine Layer (Citations) */}
        {citations.length > 0 && (
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-6">
            <div className="border-b pb-4">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Module 4</span>
              <h2 className="text-2xl font-extrabold text-gray-900">Machine Layer (Citations)</h2>
              <p className="text-gray-500 text-sm mt-0.5">Extracted web domains referenced by AI engines.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                    <th className="p-3">Domain</th>
                    <th className="p-3">Target Mentioned</th>
                    <th className="p-3">Competitors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {citations.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 font-semibold text-gray-900">{c.domain}</td>
                      <td className="p-3 font-bold text-xs">{c.mentionsTargetBrand ? "YES" : "NO"}</td>
                      <td className="p-3 text-xs text-gray-600">{c.mentionsCompetitorIds.join(", ") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* MODULE 5: Roadmap & Action Plan */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-6">
          <div className="border-b pb-4">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Module 5</span>
            <h2 className="text-2xl font-extrabold text-gray-900">Roadmap & Quick Wins</h2>
            <p className="text-gray-500 text-sm mt-0.5">Prioritized optimizations for maximum AI visibility.</p>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec) => {
              const isQuickWin = rec.impact === "HIGH" && rec.effort === "LOW";
              const effortBadge = rec.effort === "LOW" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800";

              return (
                <div key={rec.id} className="p-6 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
                        {rec.actionType}
                      </span>
                      {isQuickWin && (
                        <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">
                          ★ Quick Win
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900">{rec.title}</h3>
                    <p className="text-xs text-gray-600">{rec.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full uppercase">
                      Impact: {rec.impact}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${effortBadge}`}>
                      Effort: {rec.effort}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
}
