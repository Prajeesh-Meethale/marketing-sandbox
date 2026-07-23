"use client";

import { useState } from "react";
import { InvestigationForm } from "@/components/InvestigationForm";
import { ApprovalUI } from "@/components/ApprovalUI";
import { DeveloperToolsNav } from "@/components/DeveloperToolsNav";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState<string>("Initializing report pipeline...");
  const [error, setError] = useState<string | null>(null);
  const [companyDetails, setCompanyDetails] = useState<{ companyName: string; websiteUrl: string } | null>(null);
  const [inferredData, setInferredData] = useState<any>(null);

  const handleStartInvestigation = async ({ companyName, websiteUrl }: { companyName: string, websiteUrl: string }) => {
    setIsLoading(true);
    setError(null);
    setCompanyDetails({ companyName, websiteUrl });
    try {
      const response = await fetch("/api/infer-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, websiteUrl })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to infer context");
      
      setInferredData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async (updatedPromptPack: any[]) => {
    setIsGenerating(true);
    setError(null);
    setProgressStep("Phase 1 of 3: Querying AI Engines via Batched Execution...");

    try {
      // Simulate progress feedback
      const timer = setTimeout(() => {
        setProgressStep("Phase 2 of 3: Auditing Technical AEO & SRO Ranks...");
      }, 4000);

      const timer2 = setTimeout(() => {
        setProgressStep("Phase 3 of 3: Synthesizing Insights & Action Roadmap...");
      }, 8000);

      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyDetails?.companyName || "Target Company",
          websiteUrl: companyDetails?.websiteUrl || "",
          promptPack: updatedPromptPack,
          buyerQueries: inferredData?.buyerQueries || [],
          competitors: inferredData?.competitors || [],
        })
      });

      clearTimeout(timer);
      clearTimeout(timer2);

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate report");

      window.location.href = "/report";

    } catch (err: any) {
      setError(err.message);
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        
        {/* Header with Developer Mode Toggle */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">AI Employee</span>
            <h1 className="text-2xl font-extrabold text-gray-900">Jordan - AI Visibility Analyst</h1>
          </div>
          <DeveloperToolsNav />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-center border border-red-200 font-medium">
            {error}
          </div>
        )}

        {isGenerating ? (
          /* Automatic Progress Screen */
          <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-200 text-center space-y-6">
            <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Generating Prospect Report</h2>
              <p className="text-gray-500 font-mono text-sm bg-gray-100 py-2 px-4 rounded-lg inline-block mt-2">
                {progressStep}
              </p>
            </div>
            <p className="text-xs text-gray-400">Please wait while Jordan gathers evidence and synthesizes your report...</p>
          </div>
        ) : !inferredData ? (
          /* Step 1: New Investigation */
          <InvestigationForm onSubmit={handleStartInvestigation} isLoading={isLoading} />
        ) : (
          /* Step 2: Review Understanding (ONLY manual checkpoint) */
          <ApprovalUI 
            data={inferredData} 
            onApprove={handleGenerateReport} 
          />
        )}
      </div>
    </main>
  );
}
