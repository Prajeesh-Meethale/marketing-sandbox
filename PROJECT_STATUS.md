# Marketing App: Project Status & Architecture Changelog

This document tracks the complete architecture, features built, and verification status of the AI Visibility Marketing Application.

---

> [!CAUTION]
> **READ-ONLY BOUNDARY RULE FOR PARENT APP**:
> - **Main Parent App Directory**: [c:\Users\Prajeesh\Downloads\New folder (3)\geo-aeo-tracker](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker)
> - **Marketing Sandbox Directory**: [c:\Users\Prajeesh\Downloads\marketing-sandbox](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox)
> 
> **NEVER edit, write, or mutate files inside the parent app directory while working on the marketing app.**
> If you need to copy or replicate UI components, scrapers, API patterns, or helper utilities from the main parent app, **always copy them into `marketing-sandbox`**. Keep the main parent app completely untouched.

---

## 🟢 Current Overall Status: Repository Pattern Complete & Vercel/Supabase Ready

> **Status Note**: The application is fully refactored into a clean Repository Abstraction (`src/lib/repositories/`). Storage logic is 100% decoupled from business logic. Ready for Vercel deployment with Supabase production database support.

---

## 🎯 Current Milestone Completed: Persistence Decoupling & Supabase Repository

- **Repository Abstraction (`IInvestigationRepository`)**: Storage interface defined in `src/lib/repositories/IInvestigationRepository.ts`.
- **Supabase Repository (`SupabaseInvestigationRepository.ts`)**: Production repository utilizing `@supabase/supabase-js` to read/write JSONB investigation data.
- **Local File Repository (`FileInvestigationRepository.ts`)**: Preserved for local offline dev (`data/investigation.json`).
- **In-Memory Fallback (`InMemoryInvestigationRepository.ts`)**: Safe fallback for Vercel preview environments when Supabase keys are omitted (prevents serverless read-only filesystem crash).
- **Auto Repository Factory (`getInvestigationRepository()`)**: Dynamically resolves the active repository based on environment configuration.

---

## 🏗️ Core Architecture & Design Decisions

1. **Self-Contained Standalone Architecture**:
   - Independent Next.js 16 (App Router) project with zero parent repository dependencies.
   - Pushes cleanly to standalone GitHub repository and deploys directly to Vercel.

2. **Streamlined Operator UX (Single Checkpoint Flow)**:
   - **Step 1: New Investigation** (Company Name + Website).
   - **Step 2: Review Understanding** (The ONLY manual checkpoint: Business Profile, Competitor List Add/Edit/Delete, Buyer Questions Add/Edit/Delete, Prompt Pack inline editing).
   - **Step 3: Generate Report** (1-Click Action triggering background execution with animated progress indicator).
   - **Step 4: Final 5-Module Report (`/report`)** (Executive-ready consulting investigation).

3. **Dynamic Price-Sorted OpenRouter Execution Layer**:
   - Live model pricing fetch (`GET https://openrouter.ai/api/v1/models`) sorted ascending by cost.
   - Batch request execution (`executeBatch`) reducing cost to **~$0.0014 per brand run**.

4. **Decoupled 5-Module Domain Architecture**:
   - 11 strict Zod schemas (`Brand`, `Website`, `Competitor`, `Evidence`, `Finding`, `Citation`, `Insight`, `Recommendation`, `Section`, `Investigation`).
   - Technical-to-Consulting Translation Layer.

---

## 📋 Documentation Map

| File Path | Purpose / Description |
|---|---|
| [SUPABASE_SETUP.md](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/SUPABASE_SETUP.md) | Supabase SQL schema, table setup, and Vercel environment variables. |
| [CHAT_HISTORY_AND_CONTEXT.md](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/CHAT_HISTORY_AND_CONTEXT.md) | Chronological development log, pivot decisions, and handover guide. |
| [PROJECT_STATUS.md](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/PROJECT_STATUS.md) | Active milestone status, architecture rules, and current state. |
| [src/lib/repositories/](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/src/lib/repositories/) | Repository interface, factory, and implementations (Supabase, File, InMemory). |

---

## 🚀 Next Objective & Milestone

- **Deploy to Vercel**: Connect repository to Vercel, populate environment variables (`OPENROUTER_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`), and verify live report generation end-to-end.
- **Design & UI Enhancements**: Iterate on design aesthetics and report visual presentation.
