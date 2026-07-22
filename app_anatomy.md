# 🏗️ Archdrift (geo-aeo-tracker) — Complete App Anatomy

> [!CAUTION]
> **READ-ONLY BOUNDARY RULE FOR AI AGENTS & DEVELOPERS**:
> - **Main Parent App Directory**: [c:\Users\Prajeesh\Downloads\New folder (3)\geo-aeo-tracker](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker)
> - **Marketing App Sandbox Directory**: [c:\Users\Prajeesh\Downloads\New folder (3)\geo-aeo-tracker\marketing-sandbox](file:///c:/Users/Prajeesh/Downloads/New%20folder%20%283%29/geo-aeo-tracker/marketing-sandbox)
> 
> **NEVER edit, write, or delete any files inside the parent app directory!** 
> If you need components, API routes, or utility logic from the main parent app when working on `marketing-sandbox`, **replicate/copy the files into `marketing-sandbox`**. Keep the main app untouched.

---

> **What is this app?** Archdrift is a live, deployed SaaS platform that tracks your brand's **AI Visibility** — how often and how favorably your brand is mentioned/recommended by major AI models (ChatGPT, Gemini, Perplexity, Copilot, Google AI, etc.). It provides analytics, AEO (Answer Engine Optimization) audits, SRO (Selection Rate Optimization) analysis, and competitive intelligence.

> **GitHub Repo**: [Prajeesh-Meethale/archdrift-saas](https://github.com/Prajeesh-Meethale/archdrift-saas)
> **Deployed on**: Vercel (auto-deploys from the `origin` remote)
> **Tech Stack**: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Clerk Auth + Supabase + IndexedDB (local-first data)

---

## Table of Contents

1. [Identity & Naming Confusion](#identity--naming-confusion)
2. [Complete Directory Tree](#complete-directory-tree)
3. [What's On GitHub vs. Local Only](#whats-on-github-vs-local-only)
4. [Root-Level Files](#root-level-files)
5. [App Directory (Pages & Routes)](#app-directory-pages--routes)
6. [API Routes](#api-routes)
7. [Components](#components)
8. [Lib (Shared Logic)](#lib-shared-logic)
9. [Supabase (Database)](#supabase-database)
10. [Scripts](#scripts)
11. [Tests](#tests)
12. [Marketing Material (Local Only)](#marketing-material-local-only)
13. [Public Assets](#public-assets)
14. [Environment Variables](#environment-variables)
15. [Feature Map — What the App Actually Does](#feature-map--what-the-app-actually-does)
16. [Waste / Leftover / Suspicious Files](#waste--leftover--suspicious-files)
17. [Architecture Concerns](#architecture-concerns)

---

## Identity & Naming Confusion

> [!WARNING]
> This project has **multiple names** floating around, which is a source of confusion:

| Where | Name Used |
|-------|-----------|
| Local folder name | `geo-aeo-tracker` |
| `package.json` name field | `llm-tracker` |
| GitHub repo | `archdrift-saas` |
| The actual product name | **Archdrift** |
| `README.md` heading | `Archdrift` |
| Browser tab / metadata | `Geo AEO Tracker` (outdated, from early days) |

The folder name `geo-aeo-tracker` is a relic from when this was first created — the app has evolved significantly since then. The `package.json` still says `llm-tracker` (version 1.2.0). The GitHub repo is `archdrift-saas`. The **real product name** used everywhere in the UI, demo script, and landing pages is **Archdrift**.

### The Lead Generator Confusion

There was a commit (`19da95a`) specifically titled *"chore: remove lead-generator page accidentally committed in previous push"*. However, **lead generator code still exists in the app**:
- [app/api/lead-generator/route.ts](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/app/api/lead-generator/route.ts) — A 350-line API route
- [components/lead-generator/ReportTemplate.tsx](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/components/lead-generator/ReportTemplate.tsx) — A 24KB report template
- [app/audit/[slug]/page.tsx](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/app/audit/[slug]/page.tsx) — Renders lead reports from Supabase
- [supabase/migrations/004_lead_reports.sql](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/supabase/migrations/004_lead_reports.sql) — Database table for lead reports

So the lead generator **is part of this app**. It generates AI visibility audit reports for potential leads, stores them in Supabase, and serves them on public URLs like `/audit/some-slug`. This is likely what caused the confusion where AI referred to this as a "lead generator app".

---

## Complete Directory Tree

```
geo-aeo-tracker/
├── .env.local                          (471 B)   🔒 Local only — API keys
├── .git/                                         🔒 Git history
├── .gitignore                          (614 B)   ✅ Tracked
├── .next/                                        🔒 Local only — build output
├── .swc/                                         🔒 Local only — compiler cache
├── .vercel/                                      🔒 Local only — Vercel CLI config
│
├── CHANGELOG.md                        (30 B)    ✅ Tracked — nearly empty
├── DEV_DIARY.md                        (914 B)   ✅ Tracked
├── README.md                           (60 B)    ✅ Tracked — nearly empty
├── UI_UX_BRAINSTORM.md                 (2.3 KB)  ✅ Tracked
├── demo_script.txt                     (5.9 KB)  ✅ Tracked
│
├── eslint.config.mjs                   (504 B)   ✅ Tracked
├── jest.config.ts                      (640 B)   ✅ Tracked
├── jest.setup.ts                       (36 B)    ✅ Tracked
├── next-env.d.ts                       (257 B)   🔒 Local only (gitignored)
├── next.config.ts                      (179 B)   ✅ Tracked
├── package-lock.json                   (284 KB)  ✅ Tracked
├── package.json                        (896 B)   ✅ Tracked
├── postcss.config.mjs                  (101 B)   ✅ Tracked
├── proxy.ts                            (658 B)   ✅ Tracked ⚠️ MISNAMED (it's Clerk middleware)
├── tsconfig.json                       (798 B)   ✅ Tracked
├── tsconfig.tsbuildinfo                (238 KB)  🔒 Local only (gitignored)
├── vercel.json                         (60 B)    ✅ Tracked
│
├── node_modules/                                 🔒 Local only
│
├── app/                                          ✅ Tracked — Next.js App Router
│   ├── favicon.ico                     (25.9 KB)
│   ├── globals.css                     (8.2 KB)
│   ├── layout.tsx                      (1.5 KB)
│   ├── page.tsx                        (266 B)
│   │
│   ├── dashboard/
│   │   └── page.tsx                    (273 B)
│   │
│   ├── sign-in/[[...sign-in]]/
│   │   └── page.tsx
│   ├── sign-up/[[...sign-up]]/
│   │   └── page.tsx
│   │
│   ├── audit/[slug]/
│   │   └── page.tsx                    (833 B)
│   │
│   ├── brainstorm/
│   │   └── page.tsx                    (12.1 KB)  ⚠️ Alternate landing page
│   │
│   ├── demo/
│   │   └── page.tsx                    (1.9 KB)
│   │
│   ├── saas-preview/
│   │   ├── page.tsx                    (1.8 KB)   ⚠️ Another landing page variant
│   │   └── case-study/
│   │       └── agilecatalyst/          (EMPTY)    🗑️ WASTE
│   │
│   └── api/
│       ├── analyze/route.ts
│       ├── audit/route.ts
│       ├── brightdata-platforms/route.ts
│       ├── bulk-sro/route.ts
│       ├── credits/route.ts
│       ├── gemini-grounding/route.ts
│       ├── lead-generator/route.ts     (14.1 KB)
│       ├── scrape/route.ts
│       ├── serp/route.ts
│       ├── site-context/route.ts
│       ├── sro-analyze/route.ts
│       ├── state/route.ts
│       ├── unlocker/route.ts
│       └── usage-history/route.ts
│
├── components/
│   ├── sovereign-dashboard.tsx         (86.4 KB / 2005 lines)  ← THE MONOLITH
│   │
│   ├── dashboard/
│   │   ├── types.ts                    (4.8 KB)
│   │   └── tabs/
│   │       ├── aeo-audit-tab.tsx            (8.1 KB)
│   │       ├── automation-tab-v2.tsx        (11.7 KB)
│   │       ├── battlecards-tab.tsx          (7.8 KB)
│   │       ├── billing-tab.tsx              (5.5 KB)
│   │       ├── citation-opportunities-tab.tsx (22.5 KB)
│   │       ├── documentation-tab.tsx        (14.2 KB)
│   │       ├── fan-out-tab.tsx              (2.9 KB)
│   │       ├── niche-explorer-tab.tsx       (3.1 KB)
│   │       ├── partner-discovery-tab.tsx    (15.1 KB)
│   │       ├── prompt-hub-tab.tsx           (13.7 KB)
│   │       ├── project-settings-tab.tsx     (9.3 KB)
│   │       ├── reputation-sources-tab.tsx   (23.2 KB)
│   │       ├── sro-analysis-tab.tsx         (24.0 KB)
│   │       └── visibility-analytics-tab.tsx (22.8 KB)
│   │
│   ├── landing/                        ⚠️ Landing page components (variant 1)
│   │   ├── hero-section.tsx            (2.8 KB)
│   │   └── features-section.tsx        (2.5 KB)
│   │
│   ├── landing-page/                   ⚠️ Landing page components (variant 2)
│   │   ├── navbar.tsx                  (2.7 KB)
│   │   ├── hero.tsx                    (5.6 KB)
│   │   ├── bento-grid.tsx              (6.3 KB)
│   │   └── footer.tsx                  (3.0 KB)
│   │
│   └── lead-generator/
│       └── ReportTemplate.tsx          (24.7 KB)
│
├── lib/
│   ├── credits.ts                      (1.5 KB)
│   ├── demo-data.ts                    (31.7 KB)
│   ├── theme.ts                        (7.0 KB)
│   │
│   ├── client/
│   │   ├── sovereign-store.ts          (4.5 KB)
│   │   └── cloud-mode.ts              (1.1 KB)
│   │
│   └── server/
│       ├── auth.ts                     (58 B)    — Barrel export for Clerk
│       ├── brightdata-platforms.ts      (7.3 KB)
│       ├── brightdata-scraper.ts        (13.2 KB)
│       ├── credits-helper.ts            (4.9 KB)
│       ├── gemini-grounding.ts          (3.8 KB)
│       ├── http.ts                      (1.9 KB)
│       ├── kv-store.ts                  (1.6 KB)
│       ├── openrouter-scraper.ts        (3.5 KB)
│       ├── openrouter-sro.ts            (14.2 KB)
│       ├── serp.ts                      (2.8 KB)
│       ├── sro-types.ts                 (5.2 KB)
│       ├── supabase.ts                  (1.2 KB)
│       └── unlocker.ts                  (3.0 KB)
│
├── supabase/
│   └── migrations/
│       ├── 001_kv_store.sql            (1.5 KB)
│       ├── 002_credits.sql             (4.9 KB)
│       ├── 003_add_email.sql           (1.3 KB)
│       └── 004_lead_reports.sql        (1.2 KB)
│
├── scripts/
│   ├── test-scraper.js                 (2.6 KB)
│   └── test-pillar.js                  (943 B)
│
├── __tests__/
│   └── fan-out-tab.test.tsx            (2.1 KB)
│
├── public/
│   ├── file.svg                        (391 B)   🗑️ Default Next.js starter — UNUSED
│   ├── globe.svg                       (1.0 KB)  🗑️ Default Next.js starter — UNUSED
│   ├── next.svg                        (1.4 KB)  🗑️ Default Next.js starter — UNUSED
│   ├── vercel.svg                      (128 B)   🗑️ Default Next.js starter — UNUSED
│   ├── window.svg                      (385 B)   🗑️ Default Next.js starter — UNUSED
│   └── images/
│       └── founder.png                 (2.0 MB)  ✅ Used in sign-in/sign-up page
│
└── marketing-material/                           ❌ NOT on GitHub (untracked)
    ├── README.md                       (170 B)
    ├── run-sample.js                   (4.8 KB)
    ├── run-full-study.js               (10.1 KB)
    └── output/
        ├── brand-mention-matrix.csv
        ├── mention-summary.csv         (345 B)
        ├── raw-answers.json            (2 B — empty)
        ├── run-metadata.json           (3.7 KB)
        ├── sample-answers-api.json     (995 B)
        └── full-study/
            ├── aeo-audits.json         (2.2 KB)
            ├── brand-mention-matrix.csv (2.3 KB)
            ├── gemini-grounding.json    (83.5 KB)
            ├── mention-summary.csv      (164 B)
            └── raw-answers.json         (1.2 MB)  ← Large data file
```

---

## What's On GitHub vs. Local Only

### ✅ Pushed to GitHub (tracked by git)
Everything except what's listed below.

### 🔒 Git-Ignored (local only, by design)
| Path | Why |
|------|-----|
| `.env.local` | Contains API keys (OpenRouter, Gemini, BrightData + dataset IDs) |
| `.next/` | Next.js build output |
| `.swc/` | SWC compiler cache |
| `.vercel/` | Vercel CLI project config |
| `node_modules/` | NPM dependencies |
| `tsconfig.tsbuildinfo` | TypeScript incremental build cache (238 KB) |
| `next-env.d.ts` | Auto-generated TypeScript declarations |

### ❓ Untracked — NOT in `.gitignore` either
| Path | Status |
|------|--------|
| `marketing-material/` | Shows as `??` in `git status`. Contains Node scripts that query AI APIs for Indian Fintech brands + their output data (1.2 MB of JSON). **Not gitignored, not committed** — in limbo. |

---

## Root-Level Files

| File | Purpose | Status |
|------|---------|--------|
| [package.json](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/package.json) | Defines app as `llm-tracker` v1.2.0. Scripts: `dev`, `build`, `start`, `lint`, `test:scraper`, `test:pillar` | ✅ Active |
| [proxy.ts](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/proxy.ts) | **MISNAMED!** This is actually Clerk authentication middleware (`clerkMiddleware`). Protects `/dashboard(.*)` routes. | ⚠️ Confusing name |
| [next.config.ts](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/next.config.ts) | Minimal — enables Turbopack filesystem cache for dev | ✅ Active |
| [vercel.json](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/vercel.json) | Just a JSON schema reference, no actual config | ⚠️ Essentially empty |
| [tsconfig.json](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/tsconfig.json) | Standard Next.js TS config with `@/*` path alias | ✅ Active |
| [postcss.config.mjs](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/postcss.config.mjs) | PostCSS with Tailwind v4 plugin | ✅ Active |
| [eslint.config.mjs](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/eslint.config.mjs) | ESLint with next/core-web-vitals + next/typescript | ✅ Active |
| [jest.config.ts](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/jest.config.ts) | Jest config (ts-jest, jsdom) | ⚠️ Missing deps |
| [jest.setup.ts](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/jest.setup.ts) | Imports `@testing-library/jest-dom` | ⚠️ Missing deps |
| [README.md](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/README.md) | Just says "# Archdrift" + dev command | ⚠️ Minimal |
| [CHANGELOG.md](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/CHANGELOG.md) | Just says "Initial release." | ⚠️ Placeholder |
| [DEV_DIARY.md](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/DEV_DIARY.md) | Documents git remote confusion | ✅ Useful reference |
| [UI_UX_BRAINSTORM.md](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/UI_UX_BRAINSTORM.md) | Design direction notes | ✅ Active design doc |
| [demo_script.txt](file:///c:/Users/Prajeesh/Downloads/New%20folder%20(3)/geo-aeo-tracker/demo_script.txt) | Detailed sales demo script | ✅ Business doc |
