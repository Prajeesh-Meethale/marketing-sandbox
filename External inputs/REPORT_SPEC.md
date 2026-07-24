# AI Visibility Investigation Report — Spec

This document describes the report, not the code. Every implementation change is measured against this file. If Antigravity/Porta builds something that doesn't match a rule here, the rule wins — update this file first, then the code.

---

## 0. Philosophy

- This is a **Senior Consulting Investigation**, not a scored audit export. Nobody reads "Module 3." They read "why is this happening to my business."
- **Evidence is deterministic. Narrative is generated. Presentation is editable.** Never let those three blur into each other in the code or in the writing.
- The report is the deliverable that drives outbound. It has to work as a cold read with zero context, in under 2 minutes, on a phone.
- Executives don't buy schema markup. They buy market positioning and deal capture. Every sentence should survive the question: "would a strategy consultant say it this way?"

---

## 1. The Three Layers

| Layer | What it is | Cost to regenerate |
|---|---|---|
| **Evidence** | AEO audit, crawl, prompt transcripts, citations, competitors, SERP, screenshots — 100% deterministic, zero AI writing | Free (AEO) to ~$0.003/report (prompts, batched via OpenRouter) |
| **Story** | Narrative, transitions, business translation, confidence tags, roadmap prioritization | One LLM call, regenerate anytime without re-collecting evidence |
| **Presentation** | Freelancer/operator layer — reorder, hide, edit, add screenshots/Loom, leave notes | Manual, per client |

Never let Story-layer writing leak into Evidence JSON, and never hardcode narrative strings in the React layer — Presentation only consumes fields, it doesn't generate them.

---

## 2. Section Order (locked)

1. **Opening Narrative** (not a module — precedes Module 1)
2. **Module 1 — The Reality Check**
3. **Module 2 — The Evidence** (Crime Scene)
4. **Module 3 — The Forensics** (Why AI Trusts Your Competitors More Than You)
5. **Module 4 — The Machine Layer** (What AI Actually Sees When It Looks At You)
6. **Module 5 — The Roadmap**
7. **Final Assessment** (closes the loop, 3–5 sentences)

> Naming note: earlier brainstorms swapped "Forensics" and "Machine Layer" between two sessions. This ordering is now canonical — Forensics = citations/grounding (the *external* reason), Machine Layer = AEO/technical audit (the *internal* reason). Don't relitigate this.

Report **never opens on a dashboard**. It opens on three sentences of plain narrative. Metrics appear inside Module 1, not before it.

---

## 3. Opening Narrative

Fixed shape, no dashboard, no numbers yet:

```
What We Investigated
We investigated how AI systems recommend companies in your category, what
information they rely on, and whether your business appears during real
buying conversations.

What We Found
Across [N] high-intent buying questions and [N] AI systems, [brand] appeared
[N] time(s). Competitors were consistently recommended instead. The primary
reason isn't product quality — it's [weak AI visibility | limited machine-
readable authority | both].
```

The second sentence of "What We Found" is the load-bearing line of the entire report. It has to name a real number and a real gap in one breath.

---

## 4. Module 1 — The Reality Check

**Question answered:** Are AI systems recommending you when buyers ask?

**Hero metric order (do not reverse):**
1. AI Recommendation Rate — *"1 / 12 buying questions"* (fraction, not percentage — a fraction reads as a story, a percentage reads as a stat)
2. Technical Readiness — *"80 / 100"* (supporting evidence, smaller, secondary)
3. Primary Finding — one sentence, plain English

```
Primary Finding
AI understands your website reasonably well, but rarely recommends your
business.
```

**JSON schema:**
```json
{
  "moduleId": "reality-check",
  "summaryNarrative": "string",
  "metrics": {
    "totalQueriesRun": "number",
    "totalMentions": "number",
    "visibilityScore": "number"
  },
  "matrix": {
    "engines": ["string"],
    "queries": ["string"],
    "results": [
      { "query": "string", "engine": "string", "status": "MENTIONED | ABSENT", "rank": "number | null" }
    ]
  }
}
```

**Component rule:** renders the headline metric, then maps the matrix into a color-coded grid (present/absent). No text-parsing logic in the component — it consumes state only.

---

## 5. Module 2 — The Evidence (Crime Scene)

**Question answered:** What are buyers actually seeing, and who's winning instead?

Raw transcripts, brand and competitor names highlighted inline. This module's entire job is to be unarguable — it's not written, it's shown. One narrative sentence introduces it, then get out of the way:

```
The models consistently named [Competitor A] and [Competitor B] instead of you.
```

**JSON schema:**
```json
{
  "moduleId": "evidence-viewer",
  "competitorsFound": ["string"],
  "transcripts": [
    {
      "engine": "string",
      "query": "string",
      "rawText": "string",
      "highlights": [
        { "term": "string", "type": "TARGET | COMPETITOR", "startIndex": "number", "endIndex": "number" }
      ]
    }
  ]
}
```

**Component rule:** tabbed/stacked transcript viewer, `<mark>` tags from highlight indices. No editorializing inside the transcript itself — the raw text is the proof, don't dilute it.

---

## 6. Module 3 — The Forensics ("Why AI Trusts Your Competitors More Than You")

**Question answered:** Why are competitors winning the citation war?

Traces the model's answer back to the sources it actually cited. This is where you show the mechanism, not just the outcome.

```
ChatGPT looked for "[service]" across 3 cited directories. You're missing
from 2 of them — so it defaulted to the brands it could confirm.
```

**JSON schema:**
```json
{
  "moduleId": "forensics",
  "forensicNarrative": "string",
  "criticalSources": [
    { "domain": "string", "aiCitationWeight": "HIGH | MEDIUM", "targetBrandPresent": "boolean" }
  ]
}
```

**Component rule:** flowchart / dependency view — Prompt → Cited Domain → Brand. Visually flag the broken link (high-weight domain, brand absent).

---

## 7. Module 4 — The Machine Layer ("What AI Actually Sees When It Looks At You")

**Question answered:** What does your own site contribute to (or withhold from) the AI's understanding of you?

This is the AEO audit module. **Evidence stays 100% deterministic and free to run** (see `free_features_and_aeo_breakdown.md` — every check here is native fetch/parse, no Bright Data, no per-report API cost). The only thing that changes is presentation. This is the resolved version of the "no narrative, pure facts" rule from earlier drafts — the checks are still pure facts underneath; they just don't get *shown* as a flat checklist anymore.

### 7.1 Grouping rule

Do **not** group findings by technical category (Discovery / Structure / Content / Technical / Rendering). Those stay as internal tags only. Group the *rendered* findings by business consequence, always in this order:

1. **Machines can't find the front door** — `llms.txt`, `llms-full.txt`, robots.txt bot access, sitemap
2. **Machines find you, but can't confidently repeat what you do** — JSON-LD, FAQ schema, BLUF style, content depth, OG tags, meta description
3. **Machines might be seeing a blank page** — CSR detection, noscript fallback, JS bundle weight, server-rendered content quality
4. **Nothing here is holding you back** — every check that passed (HTTPS, page size, canonical tag, lang attribute) collapsed into **one confirming sentence**. Never pad a passing check into its own finding — that's checklist behavior creeping back in.

### 7.2 Finding template (mandatory, every finding)

```
Confidence: [High | Medium | Low]
[Symptom — one sentence, plain English, no jargon]
[Mechanism — one sentence: what's actually happening technically, still in plain English]
Business cost: [one sentence — what this costs them commercially]
Fix: [one action] · [effort: Low/Medium/High] · [★ Quick Win if effort=Low and impact=High]
```

Confidence tiers are not decorative — they're load-bearing:
- **High** = binary technical fact (file exists / doesn't)
- **Medium** = inferred pattern (e.g. "AI likely has difficulty identifying your primary service")
- **Low** = speculative opportunity, phrase as a hypothesis, not a claim (e.g. "competitors may benefit from Reddit mentions")

### 7.3 Translation table (extend, don't replace)

| Technical check | Never say | Say instead |
|---|---|---|
| `llms.txt` missing | "llms.txt missing" | "AI systems receive zero direct guidance on how to represent your brand" |
| robots.txt blocks bots | "GPTBot blocked" | "Major AI search engines are actively blocked from discovering your products" |
| No FAQ schema | "FAQ schema missing" | "Your expertise is difficult for AI systems to confidently understand" |
| No JSON-LD | "Schema markup missing" | "AI models struggle to accurately attribute your core services and authority" |
| CSR without SSR | "Client-side rendering detected" | "AI web crawlers cannot read your website content during live searches" |
| No BLUF | "Content not BLUF-formatted" | "Your pages don't lead with an answer models can quote" |

### 7.4 Worked example

```
Machine Layer — What AI Actually Sees When It Looks At You

Confidence: High — Machines can't find the front door.
No llms.txt, no blocking in robots.txt. AI crawlers can technically get in,
but you've given them nothing telling them what matters. It's a listed
address with no floor directory — they'll find you if they look hard
enough, but won't walk in confident about what you do.
Business cost: models fall back on whatever the wider web says about you
instead of what you'd tell them yourself.
Fix: publish llms.txt · Low effort · ★ Quick Win

Confidence: High — Machines find you, but can't confidently repeat what you do.
No FAQ schema, no pages that lead with a direct answer. AI models cite
sources that already read like an answer. Your pages read like brochures.
Business cost: this is why competitors get quoted directly in AI answers
and you get summarized vaguely, if at all.
Fix: rewrite top 5 pages to open with a one-line direct answer, add FAQ
schema to the same five · Medium effort

Confidence: Medium — Machines might be seeing a blank page.
Key pages render client-side with no SSR fallback. The content a human
sees may render as an empty shell to a bot that doesn't run JavaScript.
Business cost: content you've invested in may functionally not exist to
half the crawlers hitting the site.
Fix: SSR or noscript fallback on buyer-facing pages · High effort, needs a dev

Nothing else is holding you back. HTTPS, page weight, and language
declaration all pass. This was never a "broken website" problem.
```

**JSON schema:**
```json
{
  "moduleId": "machine-layer",
  "totalScore": "number",
  "maxScore": "number",
  "groupings": [
    {
      "consequenceHeading": "string",
      "findings": [
        {
          "checkCategory": "DISCOVERY | STRUCTURE | CONTENT | TECHNICAL | RENDERING",
          "checkName": "string",
          "status": "PASS | FAIL | WARNING",
          "confidence": "HIGH | MEDIUM | LOW",
          "symptom": "string",
          "mechanism": "string",
          "businessCost": "string",
          "fix": "string",
          "effort": "LOW | MEDIUM | HIGH",
          "quickWin": "boolean",
          "evidence": { "screenshotUrl": "string | null", "htmlSnippet": "string | null" }
        }
      ]
    }
  ],
  "confirmingLine": "string"
}
```

**Component rule:** each finding is collapsed by default, click-to-expand reveals `evidence` (screenshot/snippet). This turns the module from "report" into "software" — matches the explorable-finding idea. Passing checks render as the single `confirmingLine`, not as list items.

---

## 8. Module 5 — The Roadmap

**Question answered:** What should you fix first?

Pulls `fix` + `effort` + `businessCost` directly from Modules 3 and 4 — no new writing, just sorted and re-presented as a phased plan.

```json
{
  "moduleId": "strategic-roadmap",
  "narrative": "string",
  "phases": [
    {
      "phaseNumber": "number",
      "title": "string",
      "actionItems": [
        { "description": "string", "impact": "HIGH | MEDIUM", "derivedFromModule": "string" }
      ]
    }
  ]
}
```

Ranked by impact/effort, ★ Quick Wins surface first regardless of phase number. Each action item should visually link back to the module it came from (clicking it highlights the source finding).

---

## 9. Final Assessment

3–5 sentences, no new information, closes the loop opened in the Opening Narrative:

```
The opportunity isn't to become more visible. It's to become more
understandable. [Brand] has the expertise and the credibility — they're
just disconnected from each other in a way AI can't parse. That gap is
highly fixable, and most of the fix doesn't require new content, just
better packaging of what already exists.
```

---

## 10. Voice Rules (apply everywhere)

1. Every finding: Confidence → Symptom → Mechanism → Business Cost → Fix. No exceptions, no reordering.
2. Never surface a raw check name as a heading. Ever.
3. One sentence of jargon max per finding, and only inside the "mechanism" line — never in the symptom or business cost lines.
4. Passing checks get one line total, not a celebrated finding.
5. Numbers as fractions where the fraction tells a story ("1/12"), percentages where they support a claim ("80/100 technical readiness").
6. No exclamation points. No "unlock," "supercharge," "leverage." Read it back — would a McKinsey deck say it this way?

---

## 11. What NOT to build

- No "Quick / Standard / Deep" toggle exposed to the operator by default — bury it under an Advanced disclosure if it exists at all. One button: **Generate Report**.
- No raw JSON, `/evidence`, `/forensics`, `/synthesis` routes in the primary UI — those live behind a Developer Tools drawer.
- No AEO score or SRO score as the first thing shown. They're evidence, not headlines.

---

## 12. Open decision (not yet resolved — flag before implementing)

Module 4 (Machine Layer) is the only zero-marginal-cost module. Decide: does it stay embedded as Module 4 inside the full report only, or does it also ship as a standalone instant/free teaser report (top-of-funnel, no signup) separate from the full 5-module investigation? This spec assumes embedded-only until that's decided — building the standalone version means extracting section 7 into its own template, which this spec already supports since Module 4's JSON is self-contained.
