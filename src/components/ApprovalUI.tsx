"use client";

import { useState } from "react";

export function ApprovalUI({ 
  data, 
  onApprove 
}: { 
  data: any, 
  onApprove: (updatedPromptPack: any[]) => void 
}) {
  const [industry, setIndustry] = useState(data.industry);
  const [valueProp, setValueProp] = useState(data.inferredValueProp);
  const [competitors, setCompetitors] = useState(data.competitors || []);
  const [queries, setQueries] = useState(data.buyerQueries || []);
  const [promptPack, setPromptPack] = useState<any[]>(data.promptPack || []);

  const handlePromptChange = (index: number, newPayload: string) => {
    const updated = [...promptPack];
    updated[index] = { ...updated[index], payload: newPayload };
    setPromptPack(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-900">Context Checkpoint</h2>
        <p className="text-gray-500 mt-2">
          Review and refine the system's inferred understanding and prompts before proceeding to the deep scrape.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Business Profile</h3>
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Industry</label>
              <input 
                type="text" 
                value={industry} 
                onChange={e => setIndustry(e.target.value)} 
                className="w-full mt-1 p-2 bg-white border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-900 font-medium" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Inferred Value Prop</label>
              <textarea 
                value={valueProp} 
                onChange={e => setValueProp(e.target.value)} 
                className="w-full mt-1 p-2 bg-white border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-900 font-medium" 
                rows={2} 
              />
            </div>
          </div>
        </section>

        {/* Competitors */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Competitive Landscape</h3>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <ul className="list-disc pl-5 space-y-1">
              {competitors.map((comp: string, i: number) => (
                <li key={i} className="text-gray-700 font-medium">{comp}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Queries */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">3. High-Intent Buyer Queries</h3>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <ul className="list-disc pl-5 space-y-1">
              {queries.map((q: string, i: number) => (
                <li key={i} className="text-gray-700 font-medium">{q}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Editable Prompt Pack Section */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-gray-800">4. Prompt Pack ({promptPack.length} Prompts)</h3>
            <span className="text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full font-medium">
              Editable before scraping
            </span>
          </div>

          <div className="space-y-4">
            {promptPack.map((p: any, i: number) => (
              <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {p.engine}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Prompt #{i + 1}</span>
                </div>
                <textarea
                  value={p.payload}
                  onChange={(e) => handlePromptChange(i, e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono text-sm text-gray-800 leading-relaxed"
                  rows={3}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-10">
        <button 
          onClick={() => onApprove(promptPack)}
          className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition shadow-md hover:shadow-lg text-lg flex items-center justify-center gap-2"
        >
          <span>✓ Approve & Proceed to Scrape</span>
        </button>
      </div>
    </div>
  );
}
