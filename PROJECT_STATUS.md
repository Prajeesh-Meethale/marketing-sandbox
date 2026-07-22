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

## 🟢 Current Overall Status: Multi-Key Free Pool + Supabase + Vercel 60s Timeout Active

> **Status Note**: The application is fully equipped with `SmartFallbackProvider` (Gemini Free Key Rotation Pool -> OpenRouter failover), Supabase JSONB repository persistence, and extended 60-second Vercel serverless execution limits.

---

## 🎯 Key Capabilities & Execution Layer

1. **`SmartFallbackProvider` ($0 Cost Gemini Key Rotation Pool)**:
   - Accepts multiple free Gemini API keys via `GEMINI_API_KEYS=key1,key2,key3`.
   - Rotates automatically to Key #2 / Key #3 if Key #1 encounters `429 Quota Exceeded` or rate limit errors.
   - Automatically fails over to `OpenRouterProvider` (dynamic price-sorted model chain) if all free keys are exhausted.

2. **Serverless Execution Limits Extended**:
   - `export const maxDuration = 60;` added to long-running API routes (`/api/generate-report`, `/api/infer-context`), preventing 15-second Vercel serverless timeouts.

3. **Repository Abstraction (`IInvestigationRepository`)**:
   - `SupabaseInvestigationRepository.ts`: Production database storing investigation JSONB in Supabase.
   - `FileInvestigationRepository.ts`: Local JSON storage (`data/investigation.json`).
   - `InMemoryInvestigationRepository.ts`: Vercel preview build fallback.

---

## 📋 Documentation Map

| File Path | Purpose / Description |
|---|---|
| [SUPABASE_SETUP.md](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/SUPABASE_SETUP.md) | Supabase SQL schema, table setup, and Vercel environment variables. |
| [src/lib/providers/SmartFallbackProvider.ts](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/src/lib/providers/SmartFallbackProvider.ts) | Multi-Key Gemini Rotation Pool + OpenRouter Failover execution engine. |
| [PROJECT_STATUS.md](file:///c:/Users/Prajeesh/Downloads/marketing-sandbox/PROJECT_STATUS.md) | Active milestone status, architecture rules, and current state. |
