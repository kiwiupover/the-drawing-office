# Add Services, Process, and FAQ pages to thedrawingoffice.com

## Context

The site is currently a portfolio-only experience: Home, About, Contact, and project detail pages. That's it. A survey of ~12 comparable NZ residential design / drafting studios (Auckland, Wellington, Christchurch, Queenstown) found that **all of them** publish a Services page, almost all publish a Process page, and most publish an FAQ or Journal. The Drawing Office today has none of those, which hurts SEO (no service-keyword pages to rank), trust (no explanation of what working with Matt actually involves), or conversion (no answers to the obvious cost/timeline/consent questions a homeowner asks before making contact).

Goal: add three new pages — **Services**, **Process**, **FAQ** — using the same content/route patterns the site already uses, with draft copy that Matt can refine. Lean SEO across the build (canonical URLs, descriptive titles, schema), but no behaviour change to the existing portfolio.

## What's missing today (and what to add)

Current routes: `/`, `/about`, `/contact`, `/[slug]`, `/studio`.

Add three routes:

| Route | Purpose | SEO target |
|---|---|---|
| `/services` | What Matt does, sub-sectioned | "architectural designer Auckland", "residential drafting Hobsonville/North Shore" |
| `/process` | 5–6 named stages from first chat to construction observation | "architectural design process NZ" |
| `/faq` | Cost, timeline, consent, designer-vs-architect questions | Long-tail consent & cost queries |

## NZ-studio benchmarks (reference)

The competitor research notes are saved alongside this plan at `plans/nz-studio-research.md`. Highlights:

- **Services sub-categories that recur:** New Homes · Renovations & Alterations · Subdivisions / Multi-unit · Resource & Building Consents. Some studios add Recladding, Healthy Homes, Aged-care.
- **Process stages that recur (5–7):** Brief / Feasibility → Concept Design → Developed Design → Detailed Design & Consent → Tender → Construction Observation.
- **Credentials commonly displayed in footer:** ADNZ, LBP-Design, NZIA (architects only), PHINZ, Master Builders.
- **Lead-capture patterns:** "Book a feasibility chat" CTA, downloadable brochure, free feasibility report. Worth noting but out of scope for this pass.
- Comparable studios to keep open while drafting: measureanddraw.co.nz, gubbdesign.co.nz, sonderarchitecture.co.nz, cba-design.co.nz, modal.archi, firstlightstudio.co.nz.

## Approach

### 1. Extend `src/lib/content.json` instead of hard-coding copy

The site already drives Home, About, Contact intro from `src/lib/content.json` (edited via the `/studio` admin panel). Keep that pattern. Add three top-level keys: `services`, `process`, `faq`. Each page reads from there so Matt can edit copy in `/studio` without a deploy.

Sketch of the new schema (final field names to be confirmed when writing):

```json
{
  "services": {
    "intro": "…",
    "items": [
      { "title": "New Homes", "body": "…" },
      { "title": "Renovations & Alterations", "body": "…" },
      { "title": "Subdivisions & Multi-unit", "body": "…" },
      { "title": "Resource & Building Consents", "body": "…" }
    ]
  },
  "process": {
    "intro": "…",
    "stages": [
      { "name": "Brief & Feasibility", "body": "…" },
      { "name": "Concept Design", "body": "…" },
      { "name": "Developed Design", "body": "…" },
      { "name": "Detailed Design & Consent", "body": "…" },
      { "name": "Tender & Builder Selection", "body": "…" },
      { "name": "Construction Observation", "body": "…" }
    ]
  },
  "faq": {
    "intro": "…",
    "items": [
      { "q": "Do I need a designer or an architect?", "a": "…" },
      { "q": "What does a project cost?", "a": "…" },
      { "q": "How long does it take?", "a": "…" },
      { "q": "Do I need a resource consent?", "a": "…" },
      { "q": "Can you work with my builder?", "a": "…" },
      { "q": "Where do you work?", "a": "…" }
    ]
  }
}
```

Draft copy is mine to write (Dave-first-pass), Matt to refine. I'll leave `[TBC: Matt to confirm]` markers wherever a fact is unknown — e.g. credential strings, fee approach, typical project timelines.

### 2. New routes, mirroring existing page patterns

Each new page follows the same structure as `src/routes/about/+page.svelte`:
- `<SEO />` component with `title`, `description`, `canonicalPath`, `ogImage`
- Container + `reveal` action for entrance motion
- Read from `content.json`
- Reuse `app.css` design tokens (`--space-*`, `--step-*`, `--font-serif`, `--track-caps`)

Files to add:
- `src/routes/services/+page.svelte`
- `src/routes/process/+page.svelte`
- `src/routes/faq/+page.svelte`

Layout direction (no new design system needed):
- **Services** — page title, intro paragraph, then 4 stacked sections (title + body). Two-column on wide screens, single column on mobile.
- **Process** — numbered stages, large numerals in the serif font (matches existing `.page-title` styling), each stage one short paragraph. Vertical rhythm only — no horizontal timeline.
- **FAQ** — `<details>` / `<summary>` accordion of question/answer pairs. Native disclosure is enough; no JS needed. Add `FAQPage` JSON-LD schema for rich-result eligibility.

### 3. Studio admin panel

`src/routes/studio/+page.svelte` and `+page.server.js` already edit `content.json`. Extend the admin form with collapsible sections for the new `services`, `process`, and `faq` keys, with add/remove for list items. This is the largest non-page-creation change in the plan — worth scoping carefully to avoid rewriting the editor. If it gets gnarly, acceptable v1 is "edit raw JSON" for the new sections and a follow-up to add proper UI.

### 4. Navigation and footer

`src/routes/+layout.svelte` header `<nav>` currently has Projects / About / Contact. Add Services, Process, FAQ. Order to confirm with user, suggested:

`Projects · Services · Process · About · FAQ · Contact`

That's six links — at mobile widths the existing `.site-nav` flex layout will need a check. If it crowds, drop FAQ from the header and surface it via a footer link + contextual links from Services and Process.

Footer (`src/routes/+layout.svelte`): add a small credentials line that reads from `content.json` (e.g. `"credentials": ["ADNZ Member", "LBP Design"]`) once Matt confirms what he holds. Mark TBC in the draft.

### 5. SEO touches

- Add `/services`, `/process`, `/faq` to `src/routes/sitemap.xml/+server.js`.
- Add `FAQPage` JSON-LD to the FAQ page (inline in `<svelte:head>`, same pattern as the businessLd block in `+layout.svelte`).
- Optional: extend the existing `ArchitecturalService` schema in `+layout.svelte` with a `hasOfferCatalog` referencing the four service items. Worth doing while we're in there.
- Each new page gets distinct `<title>`, `<meta description>`, and canonical via the existing `SEO.svelte` component.

### 6. Credentials, registration, and copy voice — open questions for Matt

Carry into the draft as `[TBC]`, not blockers:
- ADNZ / LBP / NZIA status (changes whether we say "architect" or "architectural designer" — Squarespace site and current copy use "architecture practice", which is only safe if NZIA-registered).
- Project type mix (% new builds vs renovations vs multi-unit) — sharpens the Services page.
- Typical fee approach (fixed-fee, percentage of build, hourly) — needed for the FAQ "what does it cost?" answer.
- Typical project length from first chat to consent — same.
- Regions actually served (`BUSINESS.areaServed` in `src/lib/site.js` currently exists; reconcile with the Services copy).

## Critical files

**New:**
- `src/routes/services/+page.svelte`
- `src/routes/process/+page.svelte`
- `src/routes/faq/+page.svelte`

**Modified:**
- `src/lib/content.json` — add `services`, `process`, `faq` keys with draft copy
- `src/routes/+layout.svelte` — add nav links; optional footer credentials line; optional `hasOfferCatalog` on business schema
- `src/routes/sitemap.xml/+server.js` — register the three new routes
- `src/routes/studio/+page.svelte` + `+page.server.js` — extend admin to edit the new sections

**Reused as-is:**
- `src/lib/components/SEO.svelte`
- `src/lib/actions/reveal.js`
- `src/lib/site.js` (business metadata)
- `app.css` design tokens

## Out of scope (deliberately deferred)

- Blog / Journal — high upkeep, separate decision.
- Testimonials page — needs Matt to collect client quotes.
- "Book a feasibility chat" CTA / Calendly — sensible follow-up once the trust pages are live.
- Per-service sub-pages (e.g. `/services/renovations`) — only worth doing if a single Services page underperforms.
- Team page — single-practitioner studio for now (TBC).
- Visual redesign of any kind. Same tokens, same components, same voice.

## Verification

1. `bun run dev`, click through `/services`, `/process`, `/faq` — copy renders, reveal animations fire, no console errors.
2. Check the header nav fits on mobile (Safari iOS width, Chrome devtools 375px).
3. View source on `/faq` — confirm `FAQPage` JSON-LD is present and validates ([Rich Results Test](https://search.google.com/test/rich-results)).
4. `/sitemap.xml` includes the three new routes.
5. Run the existing build (`bun run build`) — prerender succeeds for all new routes.
6. Open `/studio` (with `STUDIO_PASSWORD`), edit a service title, save, reload `/services` — change is reflected.
7. Lighthouse on each new page — no regressions vs `/about` baseline.
8. Confirm Matt has reviewed `[TBC]` markers before merging the copy to main.
