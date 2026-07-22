import { getInvestigationData } from "@/lib/db";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function EvidenceExplorer() {
  const data = await getInvestigationData();

  if (!data || data.evidence.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Evidence Explorer</h1>
        <p className="text-gray-500 mb-6">No evidence collected yet.</p>
        <Link href="/" className="text-blue-600 hover:underline">← Back to Investigation setup</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Evidence Explorer</h1>
            <p className="text-gray-500 mt-1">Raw transcripts collected during the deep scrape phase.</p>
          </div>
          <Link href="/" className="text-blue-600 font-medium hover:underline">← Start New Investigation</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {data.evidence.map((ev) => {
            const prompt = data.prompts.find(p => p.id === ev.promptId);
            const targetEngine = ev.targetEngine || ev.engine || "Unknown Target Engine";
            const dateStr = ev.scrapedAt || ev.timestamp;

            return (
              <div key={ev.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {/* Target Engine Badge (ChatGPT, Perplexity, Gemini, Claude) */}
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {targetEngine}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {dateStr ? new Date(dateStr).toLocaleString() : ""}
                    </span>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-mono text-gray-700 break-words line-clamp-3">
                      <span className="font-bold text-gray-900">Prompt:</span> {prompt?.payload || "Unknown"}
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm shadow-inner whitespace-pre-wrap">
                  {ev.rawTranscript}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
