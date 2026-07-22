# Chat Journey, Architecture Decisions & Context Handover Guide

This document captures the complete chronological history of our development chat, design decisions, major pivots, and current state. It is specifically written so you can seamlessly continue working on **Antigravity** (or via Porta on your phone) without losing any context.

---

> [!CAUTION]
> **READ-ONLY BOUNDARY RULE FOR PARENT APP**:
> - **Main Parent App Location**: [c:\Users\Prajeesh\Downloads\New folder (3)\geo-aeo-tracker](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker)
> - **Parent App Anatomy Reference**: [app_anatomy.md](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker/marketing-sandbox/app_anatomy.md)
> 
> **NEVER edit, write, or mutate files inside the main parent app directory while working on the marketing app.**
> If you need to replicate UI components, scraper logic, API patterns, or helper utilities from the main parent app into `marketing-sandbox`, **always copy them into `marketing-sandbox`**. Keep the main parent app completely untouched.

---

## 📌 1. Project Background & How We Started

The project was created inside `marketing-sandbox` as a Next.js 15 (App Router) application designed to automate **AI Visibility, Selection Rate Optimization (SRO), and Answer Engine Optimization (AEO)** audits for prospect brands.

### Initial Architectural Decisions:
1. **Decoupled 5-Module Report Model**: Rather than generating raw unstructured text, the audit is structured into 5 core business modules:
   - **Module 1: Reality Check** (Executive Summary & AI Selection Rate %)
   - **Module 2: Crime Scene** (Engine-by-Engine SERP & LLM recommendation matrix)
   - **Module 3: Technical Forensics** (Machine readability & crawler accessibility audit)
   - **Module 4: Machine Layer** (Extracted web citations & domain attribution)
   - **Module 5: Action Roadmap** (Prioritized recommendations & Quick Wins)
2. **Strict Knowledge Graph**: Built 11 Zod domain models in `src/domain/models.ts` (`Brand`, `Website`, `Competitor`, `Evidence`, `Finding`, `Citation`, `Insight`, `Recommendation`, `Section`, `Investigation`).
3. **Local Database Store**: Implemented `src/lib/db.ts` to persist investigation objects to `data/investigation.json`.

---

## 🔄 2. Major Discussion Highlights & Engineering Pivots

### Pivot A: Gemini Free Tier ➔ Resilient OpenRouter Provider
- **The Issue**: Originally used Google Gemini API free tier directly, but hit daily quota limits (20 requests/day).
- **The Pivot**: Switched back to **OpenRouter**, but engineered a multi-tiered resilience system to minimize cost:
  1. **Ascending-Cost Fallback Chain**: Starts with ultra-cheap models (`Llama 3.3 70B` @ $0.10/1M ➔ `GPT-4o-mini` @ $0.15/1M ➔ `DeepSeek Chat` ➔ `Gemini 2.5 Flash` ➔ `Qwen 2.5 72B` ➔ `Claude 3.5 Haiku` ➔ `GPT-4o`).
  2. **10-Second AbortController Timeout**: Prevents hanging or infinite execution loops. If a model doesn't respond in 10s, it instantly cancels and retries the next model.
  3. **Single-Request Prompt Batching**: Groups all engine prompts (ChatGPT, Perplexity, Gemini, Claude) into a single batched JSON request (`executeBatch`), reducing token costs from ~$0.05 per run down to **~$0.0014 per run** (less than 1/5th of a cent!).

### Pivot B: Operator UX Redesign (The "Mr. X" Document)
- **The Discussion**: Evaluated instructions from "Mr. X" pointing out that the initial UI exposed internal developer pipeline steps (`Evidence` → `Forensics` → `Synthesis`), which caused friction for non-developer operators (marketers & BDRs).
- **The Implementation**:
  1. Streamlined the workflow to **1 Manual Checkpoint**: `Input` ➔ `Review Understanding` (Context Checkpoint: Add/Edit/Delete Competitors & Buyer Queries, Edit Prompts) ➔ `1-Click Generate Report`.
  2. Built an **Automatic Progress Screen** that handles Evidence Gathering, Technical AEO, SRO Analysis, and Synthesis seamlessly in the background.
  3. Created **Developer Tools Navigation** (`src/components/DeveloperToolsNav.tsx`) to isolate debug views (`/evidence`, `/forensics`, `/synthesis`) under a subtle header menu.
  4. Rewrote `mr x.txt` with an intelligence response translating technical jargon (`llms.txt missing`, `FAQ schema missing`) into executive consulting language (*"AI receives very little structured guidance about your company"*).

### Pivot C: Live OpenRouter CSV Audit & Dynamic Price-Sorting Engine
- **The Discussion**: Analyzed user's OpenRouter CSV activity export (`openrouter_activity_2026-07-22.csv`). Discovered earlier test calls hit expensive models (`mistral-large` @ $2.00/1M & `perplexity/sonar-pro` @ $0.013/call).
- **The Solution**:
  1. Updated `src/lib/providers/OpenRouterProvider.ts` to strictly restrict execution to a target set of low-cost models.
  2. Added **Dynamic Price-Sorting**: Automatically calls OpenRouter's free metadata endpoint (`GET https://openrouter.ai/api/v1/models`) on startup, extracts `pricing.prompt` (input cost per token), sorts the models ascending by price at runtime, and caches the order in-memory for 6 hours.
  3. Wrote and executed a unit test ([src/lib/providers/__tests__/OpenRouterProvider.test.ts](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker/marketing-sandbox/src/lib/providers/__tests__/OpenRouterProvider.test.ts)) confirming sorting logic.
  4. Discovered user's OpenRouter API key had a spending limit of `$0.50` set on OpenRouter ($0.28 used out of $0.50), recommending removing/bumping the limit in OpenRouter dashboard.

### Pivot D: Global Agent Inspection Skills (Porta Phone Integration)
- Created global agent skills in `C:\Users\Prajeesh\.gemini\config\skills\` accessible by Antigravity from any environment or via Porta on your phone:
  - **`openrouter-status`**: Queries live OpenRouter credit balance, spending limits, and total usage.
  - **`vercel-status`**: Queries live Vercel deployments, build statuses, and error log traces. Saved user's `VERCEL_TOKEN` into `.env.local`. Verified live connection to Vercel account (`prajeesh-meethales-projects`).

---

## 📂 3. Key Files & Project Map

| File Path | Purpose / Description |
|---|---|
| [src/app/page.tsx](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker/marketing-sandbox/src/app/page.tsx) | Operator Entry point (Input ➔ Context Checkpoint ➔ Auto Progress Screen). |
| [src/app/report/page.tsx](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker/marketing-sandbox/src/app/report/page.tsx) | **The Final 5-Module Report Renderer** (Reality Check, Crime Scene, Forensics, Machine Layer, Action Roadmap). |
| [src/app/api/generate-report/route.ts](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker/marketing-sandbox/src/app/api/generate-report/route.ts) | Unified background pipeline orchestrator (Evidence ➔ Forensics ➔ Synthesis). |
| [src/lib/providers/OpenRouterProvider.ts](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker/marketing-sandbox/src/lib/providers/OpenRouterProvider.ts) | Dynamic price-sorted OpenRouter provider with 6-hr caching and batch execution. |
| [src/lib/forensic.ts](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker/marketing-sandbox/src/lib/forensic.ts) | Deterministic AEO website audit & SRO rank position findings generator. |
| [src/lib/synthesis.ts](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker/marketing-sandbox/src/lib/synthesis.ts) | Single-pass narrative LLM synthesis generating Insights & Recommendations. |
| [src/components/DeveloperToolsNav.tsx](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker/marketing-sandbox/src/components/DeveloperToolsNav.tsx) | Header menu giving access to internal debug views (`/evidence`, `/forensics`, `/synthesis`). |
| [app_anatomy.md](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker/marketing-sandbox/app_anatomy.md) | Complete directory tree and feature breakdown of the main parent app. |
| [PROJECT_STATUS.md](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker/marketing-sandbox/PROJECT_STATUS.md) | Technical status and architecture changelog. |
| [mr x.txt](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker/marketing-sandbox/mr%20x.txt) | Strategic UX redesign proposal & intelligence alignment response. |

---

## 🚀 4. How to Continue on Antigravity & Deploy Standalone

### 100% Decoupled Standalone Workspace
The `marketing-sandbox` directory is **100% self-contained**. It has **zero dependencies** on parent repository files:
- It contains its own `package.json`, `tsconfig.json`, `next.config.ts`, `src/`, `data/`, and `.env.local`.
- **To move to a separate GitHub repo and deploy online to Vercel**:
  1. Simply copy/move the `marketing-sandbox` folder into its own standalone directory or Git repository.
  2. Push to GitHub.
  3. Connect the GitHub repo to Vercel and add your environment variables (`OPENROUTER_KEY`, `VERCEL_TOKEN`).
  4. Deploy! It will build cleanly in seconds.

### Quick Commands:
- **Run Locally**: `npm run dev` (starts on `http://localhost:3000`)
- **Test OpenRouter Dynamic Price Sorting**: `npx tsx src/lib/providers/__tests__/OpenRouterProvider.test.ts`
- **Test Live OpenRouter Balance**: `node "C:\Users\Prajeesh\.gemini\config\skills\openrouter-status\scripts\check_openrouter.js"`
- **Test Live Vercel Deployments**: `node "C:\Users\Prajeesh\.gemini\config\skills\vercel-status\scripts\check_vercel.js"`
