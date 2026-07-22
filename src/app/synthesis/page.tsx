import { getInvestigationData } from "@/lib/db";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function SynthesisDashboard() {
  const data = await getInvestigationData();
  const { website, insights, recommendations, findings } = data;

  if ((!insights || insights.length === 0) && (!recommendations || recommendations.length === 0)) {
    return (
      <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Synthesis Layer</h1>
          <p className="text-gray-500 mb-6">No strategy synthesis generated yet. Please complete forensics first.</p>
          <Link 
            href="/forensics" 
            className="inline-block bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition"
          >
            ← Go to Forensics
          </Link>
        </div>
      </main>
    );
  }

  const quickWins = recommendations.filter(r => r.impact === "HIGH" && r.effort === "LOW");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Synthesis Layer
              </span>
              <span className="text-xs text-gray-400 font-mono">Module 4 of 5</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
              Strategic Insights & Roadmap
            </h1>
            <p className="text-gray-500 text-lg mt-1">
              Single-pass narrative synthesis and prioritized action roadmap derived from audit evidence.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link 
              href="/forensics" 
              className="bg-white border border-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-xl hover:bg-gray-50 transition text-sm"
            >
              ← Forensics
            </Link>
            <Link 
              href="/" 
              className="bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-xl hover:bg-blue-700 transition text-sm shadow"
            >
              New Audit
            </Link>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Insights</div>
            <div className="text-4xl font-extrabold text-gray-900 mt-2">{insights.length}</div>
            <p className="text-xs text-gray-500 mt-2">Core strategic observations linked to empirical findings.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">High-Impact Quick Wins</div>
            <div className="text-4xl font-extrabold text-emerald-600 mt-2">{quickWins.length}</div>
            <p className="text-xs text-gray-500 mt-2">Action items with High Impact and Low Implementation Effort.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">Target Website AEO Readiness</div>
            <div className="text-4xl font-extrabold text-blue-600 mt-2">{website?.aeoScore ?? 0}%</div>
            <p className="text-xs text-gray-500 mt-2">Overall technical accessibility score across evaluated crawlers.</p>
          </div>
        </div>

        {/* Section 1: Strategic Insights */}
        <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Strategic Insights</h2>
            <p className="text-sm text-gray-500 mt-1">Single-pass narrative synthesis connected directly to audit findings.</p>
          </div>

          <div className="space-y-6">
            {insights.map((ins, idx) => (
              <div key={ins.id} className="p-6 rounded-xl border border-gray-200 bg-gray-50 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">{ins.topic}</h3>
                </div>

                <p className="text-gray-700 leading-relaxed text-base">
                  {ins.narrative}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
                      Why This Matters
                    </span>
                    <p className="text-sm text-gray-600">{ins.whyThisMatters}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                      Business Impact
                    </span>
                    <p className="text-sm text-gray-600">{ins.businessImpact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Actionable Recommendations Roadmap */}
        <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Prioritized Action Roadmap</h2>
            <p className="text-sm text-gray-500 mt-1">Recommended optimizations prioritized by effort and business impact.</p>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec) => {
              const isQuickWin = rec.impact === "HIGH" && rec.effort === "LOW";
              const effortBadgeColor = rec.effort === "LOW" ? "bg-emerald-100 text-emerald-800" : rec.effort === "MEDIUM" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800";
              const impactBadgeColor = rec.impact === "HIGH" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";

              return (
                <div key={rec.id} className="p-6 rounded-xl border border-gray-200 bg-gray-50 space-y-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono uppercase bg-gray-200 text-gray-800 px-2.5 py-0.5 rounded font-bold">
                        {rec.actionType}
                      </span>
                      {isQuickWin && (
                        <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wide animate-pulse">
                          ★ Quick Win
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{rec.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{rec.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-gray-400">Impact</div>
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${impactBadgeColor}`}>
                        {rec.impact}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-gray-400">Effort</div>
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${effortBadgeColor}`}>
                        {rec.effort}
                      </span>
                    </div>
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
