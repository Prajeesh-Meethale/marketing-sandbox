# AI Visibility Marketing Application - Infrastructure & Data Guide

## 1. Project Overview
This application performs an **Answer Engine Optimization (AEO)** and **Selection Rate Optimization (SRO)** audit for a prospect brand. 
It evaluates how often and how well a brand is recommended across major AI engines (ChatGPT, Perplexity, Gemini, Claude).

## 2. The 5-Module Workflow
When a user initiates an investigation, the app automatically executes the following 5 background steps:

1. **Context Inference:** Infers commercial intent queries and competitor keywords for the brand.
2. **Evidence Gathering:** Executes prompts against the major AI engines using OpenRouter, gathering raw transcripts.
3. **Forensics:** Analyzes the transcripts to determine if the target brand was "Mentioned", "Omitted", or ranked, and runs a technical SEO/AEO scrape on the brand's website (checking `robots.txt`, schema, `llms.txt`).
4. **Synthesis:** Uses AI to generate high-level insights, narratives, and actionable recommendations (Quick Wins vs. Long-term strategy) based on the findings.
5. **Final Report:** The web view that renders all of the above data for the user.

## 3. Data Structure Available to the UI
The final report page has access to the complete `InvestigationData` object. This is the exact structure available to you for designing the UI:

```typescript
type InvestigationData = {
  prompts: Prompt[];           // The questions asked to the AI engines
  evidence: Evidence[];        // The raw responses from ChatGPT, Claude, etc.
  findings: Finding[];         // Structured analysis of the evidence (e.g. was the brand mentioned? what rank?)
  citations: Citation[];       // Any websites the AI engines cited in their answers
  website: Website;            // The brand's technical AEO score and crawler checks
  insights: Insight[];         // High-level AI-generated summaries of the brand's visibility
  recommendations: Action[];   // Actionable tasks for the brand to improve their AI visibility
}
```

## 4. The Goal for the Designer
You don't need to trigger the real application to design the report. The accompanying `sample-report.md` shows exactly what data is generated at the end of the pipeline.

**Design Goals:**
*   Make the report look incredibly premium, modern, and data-rich.
*   We want to communicate a sense of "investigation" and "forensics" (e.g. Crime Scene, Reality Check).
*   Visualizing the SRO (Selection Rate Optimization) percentage and Technical AEO score is critical.
*   Currently, the report is very structural. Feel free to rethink how we display the raw AI transcripts, the ranking data, and the final strategic roadmap.
