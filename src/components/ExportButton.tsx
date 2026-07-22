"use client";

import { InvestigationData } from "@/lib/db";
import { useState } from "react";

export function ExportButton({ data }: { data: InvestigationData }) {
  const [isExporting, setIsExporting] = useState(false);

  const generateMarkdown = () => {
    let md = `# AI Visibility Report\n\n`;
    if (data.website) {
      md += `**Audited URL:** ${data.website.url}\n`;
      md += `**Date:** ${new Date(data.website.lastAuditedAt).toLocaleDateString()}\n\n`;
      md += `## Technical AEO Score: ${data.website.aeoScore}/100\n\n`;
    }

    const totalFindings = data.findings.length;
    const mentionedFindings = data.findings.filter(f => f.targetBrandMentioned);
    const sroVisibilityRate = totalFindings > 0 ? Math.round((mentionedFindings.length / totalFindings) * 100) : 0;
    const quickWins = data.recommendations.filter(r => r.impact === "HIGH" && r.effort === "LOW");

    md += `## AI Selection Rate (SRO): ${sroVisibilityRate}%\n`;
    md += `## High-Impact Quick Wins: ${quickWins.length}\n\n`;

    md += `---\n\n## Module 1: Reality Check\n\n`;
    md += `- **AI Recommendation Overview:** The target brand is currently recommended in ${mentionedFindings.length} out of ${totalFindings} evaluated commercial buyer queries.\n`;
    if (data.website) {
      md += `- **Crawler Accessibility:** Technical crawler readiness scored ${data.website.aeoScore}/100.\n\n`;
    }

    md += `---\n\n## Module 2: Crime Scene (Engine Recommendations)\n\n`;
    data.findings.forEach(f => {
      const ev = data.evidence.find(e => e.id === f.evidenceId);
      const engine = ev?.targetEngine || ev?.engine || "Target Engine";
      md += `### ${engine}\n`;
      md += `- **Status:** ${f.targetBrandMentioned ? "Mentioned" : "Omitted"}\n`;
      md += `- **Rank Position:** ${f.targetRank ? "#" + f.targetRank : "Omitted / Unranked"}\n`;
      md += `- **Competitors Listed:** ${f.competitorsMentioned.join(", ") || "None"}\n\n`;
    });

    if (data.website && data.website.technicalChecks.length > 0) {
      md += `---\n\n## Module 3: Technical AEO Audit\n\n`;
      data.website.technicalChecks.forEach(check => {
        md += `### ${check.type} [${check.status}]\n`;
        if (check.details) md += `${check.details}\n\n`;
      });
    }

    if (data.citations && data.citations.length > 0) {
      md += `---\n\n## Module 4: Machine Layer (Citations)\n\n`;
      md += `| Domain | Target Mentioned | Competitors |\n`;
      md += `|---|---|---|\n`;
      data.citations.forEach(c => {
        md += `| ${c.domain} | ${c.mentionsTargetBrand ? "YES" : "NO"} | ${c.mentionsCompetitorIds.join(", ") || "—"} |\n`;
      });
      md += `\n`;
    }

    if (data.recommendations && data.recommendations.length > 0) {
      md += `---\n\n## Module 5: Roadmap & Quick Wins\n\n`;
      data.recommendations.forEach(rec => {
        const isQuickWin = rec.impact === "HIGH" && rec.effort === "LOW";
        md += `### ${rec.title} ${isQuickWin ? "(★ Quick Win)" : ""}\n`;
        md += `- **Action Type:** ${rec.actionType}\n`;
        md += `- **Impact:** ${rec.impact}\n`;
        md += `- **Effort:** ${rec.effort}\n`;
        md += `- **Description:** ${rec.description}\n\n`;
      });
    }

    return md;
  };

  const handleExport = () => {
    setIsExporting(true);
    const md = generateMarkdown();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visibility-report.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-900 transition text-xs flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export MD
    </button>
  );
}
