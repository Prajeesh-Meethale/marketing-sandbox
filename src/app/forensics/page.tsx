"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ForensicsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/run-forensics", { method: "POST", body: JSON.stringify({}) })
      .then(() => fetch("/api/gather-evidence", { method: "GET" }).catch(() => {}))
      .then(async () => {
        // Fetch current investigation state from a simple endpoint or mock read
        const res = await fetch("/api/run-synthesis", { method: "GET" }).catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          setData(json);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRunSynthesis = async () => {
    setIsSynthesizing(true);
    setError(null);
    try {
      const response = await fetch("/api/run-synthesis", { method: "POST" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to execute synthesis");

      window.location.href = "/synthesis";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Forensic Engine Audit
              </span>
              <span className="text-xs text-gray-400 font-mono">Module 3 of 5</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
              SRO & AEO Technical Forensics
            </h1>
            <p className="text-gray-500 text-lg mt-1">
              Deterministic technical website audit and SERP cross-referencing findings.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleRunSynthesis}
              disabled={isSynthesizing}
              className="bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-emerald-700 transition text-sm shadow flex items-center gap-2"
            >
              {isSynthesizing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Running Synthesis...</span>
                </>
              ) : (
                <span>Run Strategy Synthesis →</span>
              )}
            </button>

            <Link 
              href="/evidence" 
              className="bg-white border border-gray-300 text-gray-700 font-semibold py-2.5 px-4 rounded-xl hover:bg-gray-50 transition text-sm flex items-center"
            >
              ← Evidence
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center border border-red-200 font-medium">
            {error}
          </div>
        )}

        {/* Action Callout Card */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <span className="bg-purple-700/60 text-purple-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Next Step: Synthesis Layer
            </span>
            <h2 className="text-2xl font-bold">Ready to Generate Strategic Insights & Action Roadmap?</h2>
            <p className="text-purple-200 text-sm max-w-2xl">
              Pass deterministic technical checks and engine findings into single-pass LLM synthesis to create prioritized recommendations and business impact analysis.
            </p>
          </div>

          <button 
            onClick={handleRunSynthesis}
            disabled={isSynthesizing}
            className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-base py-4 px-8 rounded-xl transition shadow-lg shrink-0 flex items-center gap-2"
          >
            {isSynthesizing ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-gray-950 border-t-transparent rounded-full"></div>
                <span>Executing Single-Pass AI Synthesis...</span>
              </>
            ) : (
              <span>Execute Synthesis & Generate Roadmap →</span>
            )}
          </button>
        </div>

      </div>
    </main>
  );
}
