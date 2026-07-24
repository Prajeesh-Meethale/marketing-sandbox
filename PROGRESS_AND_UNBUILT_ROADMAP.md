# 🚀 Archdrift Marketing Sandbox: Master Progress & Unbuilt Roadmap

This document provides a consolidated executive overview of **everything built so far** and **everything originally brainstormed that is yet to be built**, compiled directly from the workspace context files:
* [CHAT_HISTORY_AND_CONTEXT.md](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/CHAT_HISTORY_AND_CONTEXT.md)
* [lead_generation_brainstorm.md](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/lead_generation_brainstorm.md)
* [app_anatomy.md](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/app_anatomy.md)
* [mr x.txt](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/mr%20x.txt)
* [PROJECT_STATUS.md](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/PROJECT_STATUS.md)

---

## 📊 Quick Status Matrix

| Feature Area | Status | Key Deliverable | Location in Code |
|---|---|---|---|
| **Operator Flow & UX** | 🟢 Built | 1-checkpoint entry flow & context review | [src/app/page.tsx](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/src/app/page.tsx) & [ApprovalUI.tsx](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/src/components/ApprovalUI.tsx) |
| **5-Module Web Report** | 🟢 Built | Consulting report (Reality Check $\rightarrow$ Action Roadmap) | [src/app/report/page.tsx](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/src/app/report/page.tsx) & [PremiumReportView.tsx](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/src/components/PremiumReportView.tsx) |
| **AI Compute Infrastructure**| 🟢 Built | Smart fallback pool + OpenRouter dynamic price-sorting | [SmartFallbackProvider.ts](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/src/lib/providers/SmartFallbackProvider.ts) |
| **Developer Tools Isolation**| 🟢 Built | Hidden header nav for `/evidence`, `/forensics`, `/synthesis` | [DeveloperToolsNav.tsx](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/src/components/DeveloperToolsNav.tsx) |
| **Standalone Deployment** | 🟢 Built | GitHub repository & live Vercel build (60s timeout) | [Vercel Deployment](https://marketing-sandbox-kale1mml5-prajeesh-meethales-projects.vercel.app) |
| **Niche Dataset Caching** | 🟡 Unbuilt | "Write once, read many" cached industry scrape datasets | `lead_generation_brainstorm.md` §1 |
| **Bulk Lead Gen Portal** | 🟡 Unbuilt | `/admin/lead-gen` batch CSV processor for freelancers | `lead_generation_brainstorm.md` §3 |
| **Public Multi-Tenant Links** | 🟡 Unbuilt | `/report/[slug]` dynamic Supabase report fetcher | `lead_generation_brainstorm.md` §5 |
| **Interactive UI Mockups** | 🟡 Unbuilt | Scroll-triggered animated ChatGPT typing simulations | `lead_generation_brainstorm.md` §2 |
| **Lead Engagement Tracking** | 🟡 Unbuilt | Analytics logging open rate, scroll depth & CTA clicks | `lead_generation_brainstorm.md` §2 |

---

## 🟢 Part 1: Detailed Breakdown of What Is Built

### 1. Unified Operator UX (The "Mr. X" UX Pivot)
Exposing raw pipeline steps (`Evidence` $\rightarrow$ `Forensics` $\rightarrow$ `Synthesis`) forced marketers to act like software testers. We streamlined this into a single professional workflow:
* **Step 1: Input URL**: Enter prospect brand & domain.
* **Step 2: Review Understanding ([ApprovalUI.tsx](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/src/components/ApprovalUI.tsx))**: The single manual checkpoint allowing operators to add/edit/delete competitors, buyer queries, and AI engine prompts.
* **Step 3: Automatic Progress Screen**: Background execution showing real-time phase updates.
* **Step 4: Final 5-Module Report**: Renders consulting-grade insights immediately upon completion.

### 2. The 5-Module Executive Consulting Web Report
Translates technical SEO jargon into executive consulting language (*"AI receives very little structured guidance about your company"*):
* **Module 1 (Reality Check)**: Executive summary, AI Selection Rate %, AEO Score (0-100).
* **Module 2 (Crime Scene)**: Side-by-side ChatGPT, Perplexity, Gemini, Claude matrix displaying rank position (#1, #2, Omitted) and competitor mentions.
* **Module 3 (Technical Forensics)**: Machine readability & crawler accessibility audit.
* **Module 4 (Machine Layer)**: Extracted web citations and third-party authority domain attribution.
* **Module 5 (Action Roadmap)**: Effort vs. Impact matrix with **★ Quick Win** highlights and "Discuss the full engagement" CTA.

### 3. Ultra-Low-Cost Resilient AI Infrastructure (~$0.0014 / Audit)
* **`SmartFallbackProvider`**: Rotates through a pool of free Gemini API keys (`GEMINI_API_KEYS=key1,key2,key3`), failing over automatically to OpenRouter if quotas are hit.
* **Dynamic Price-Sorting Engine**: Queries OpenRouter's metadata API on startup, sorts models ascending by token cost, and caches the optimal chain for 6 hours.
* **Single-Request Prompt Batching**: Bundles all 4 engine prompts into a single payload (`executeBatch`), reducing token cost from ~$0.05 per run down to **~$0.0014 per run** (less than 1/5th of a cent).

---

## 🟡 Part 2: Detailed Breakdown of Unbuilt Brainstormed Features

The following features were outlined in [lead_generation_brainstorm.md](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/lead_generation_brainstorm.md) and architectural specs, but are not yet implemented in code:

```
                  ┌────────────────────────────────────────────────────────┐
                  │              UNBUILT ROADMAP BACKLOG                   │
                  └───────────────────────────┬────────────────────────────┘
                                              │
         ┌───────────────────┬────────────────┴───────────────────┬───────────────────┐
         ▼                   ▼                                    ▼                   ▼
┌─────────────────┐ ┌─────────────────┐                 ┌───────────────────┐ ┌─────────────────┐
│ 1. Niche Data   │ │ 2. Bulk Lead    │                 │ 3. Multi-Tenant   │ │ 4. Animated UI  │
│    Caching      │ │    Gen Portal   │                 │    Slug Router    │ │    Simulations  │
│ (Write Once,    │ │ (/admin/lead-   │                 │ (/report/[slug])  │ │ (Typing ChatGPT │
│  Read Many)     │ │  gen)           │                 │                   │ │  Mockups)       │
└─────────────────┘ └─────────────────┘                 └───────────────────┘ └─────────────────┘
```

### 1. Cached "Niche Datasets" Architecture ("Write Once, Read Many")
* **Concept**: Running expensive live AI scrapes per prospect burns budget unnecessarily. Instead:
  1. **Industry Scrape (Infrequent)**: Run a batch of 10-20 prompts for a target niche (e.g. "Indian Fintech" or "D2C Ice Cream") and save as `niche_datasets` in Supabase.
  2. **Lead AEO Audit (Free)**: Run live technical checks on the prospect's domain (`llms.txt`, schema, crawler blocks).
  3. **Cheap LLM Synthesis**: Pass the lead's AEO results + cached Niche dataset into Gemini Flash via OpenRouter to generate a personalized narrative for pennies.
* **Current Gap**: Currently, every audit runs fresh live AI queries per lead via `SmartFallbackProvider` (Gemini Free Key Rotation Pool first $\rightarrow$ OpenRouter failover). The cached `niche_datasets` table and reuse pipeline are unbuilt.

### 2. Automated Bulk Lead Generator Portal (`/admin/lead-gen`)
* **Concept**: A portal designed for external freelancers or outbound BDRs:
  1. Paste a list of 50 prospect URLs + select a Niche ID.
  2. Click **"Generate Reports"**.
  3. System queues background audits, merges with Niche datasets, and stores JSON payloads in Supabase `lead_reports`.
  4. Spits out a downloadable CSV of public report URLs: `https://app.archdrift.com/report/prospect-slug`.
* **Current Gap**: Reports are generated manually one brand at a time through the main home page (`/`).

### 3. Public Multi-Tenant Slug-Based Report Router (`/report/[slug]`)
* **Concept**: A public dynamic page route (`app/report/[slug]/page.tsx`) that reads the prospect's report JSON from Supabase by slug.
* **Current Gap**: In `marketing-sandbox`, `/report` currently renders whatever single investigation data is active in local storage (`db.ts` / `investigation.json`).

### 4. Interactive Animated ChatGPT UI Search Simulations
* **Concept**: Upgrade Module 2 ("Crime Scene") so that as the prospect scrolls into the section, a CSS mockup of the ChatGPT window types out the buyer query in real-time (e.g., *"Best ice cream in Mumbai"*), visually highlighting competitors getting recommended while the prospect brand is omitted.
* **Current Gap**: Module 2 currently displays static transcript cards.

### 5. Prospect Analytics & Engagement Tracking
* **Concept**: Log `viewed_at` timestamps, scroll depth percentages, and CTA click events in Supabase so sales reps receive notifications when a prospect opens their report link.
* **Current Gap**: Unbuilt.

---

## 🎯 Recommended Next Steps

When you're ready to continue building, here is the suggested implementation sequence:
1. **Phase 1**: Build the **Multi-Tenant Slug Router (`app/report/[slug]/page.tsx`)** & Supabase `lead_reports` table.
2. **Phase 2**: Build the **Bulk Lead Generator Portal (`/admin/lead-gen`)**.
3. **Phase 3**: Add **Animated Typing ChatGPT UI Mockups** to Module 2.
