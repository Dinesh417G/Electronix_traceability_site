# ElectronIx Trace — website charter

Marketing site for **ElectronIx Trace**, a product traceability platform for
Indian MSME / mid-size manufacturers. Built by ElectronIx (Coimbatore, India).

Product repo (source of truth for capabilities):
[`Dinesh417G/Traceability`](https://github.com/Dinesh417G/Traceability) — Rust,
PostgreSQL, offline-first, on-premise.

---

## Rules of engagement (binding)

1. **`docs/PRODUCT-FACTS.md` is the factual record.** It marks every capability
   `Built` or `Designed`, with the file path in the product repo that proves it.
   Read it before writing a capability claim. Do not extend it from imagination —
   extend it by reading the product repo.

2. **The site presents the designed system.** The product owner decided on
   2026-09-11 that the site speaks about the full designed product — laser DPM,
   the declared driver set (RS232/RS485, Modbus, OPC UA, S7, EtherNet/IP, FOCAS),
   and the station touch UI — in present-tense product voice, even where those are
   `Designed` rather than `Built`. Recorded in `docs/DECISIONS.md` D-003. Do not
   silently revert this to a shipped-only surface.

3. **Never fabricate proof.** This is a different category from rule 2 and it is
   not negotiable. No customer logos, testimonials, case studies, certifications,
   star ratings, install counts, units-traced counters, uptime figures or
   benchmark numbers. No rendering captioned as a photograph or screenshot of
   running software. The claims blocklist at the end of `PRODUCT-FACTS.md` is the
   list to check against.

4. **Certification language is banned outright.** No ISO 9001, IATF 16949, FDA,
   21 CFR Part 11, SOC 2, GDPR or CE claim for the software or the company.
   Neither is certified. The software *produces evidence an auditor asks for*; it
   does not confer compliance. `/terms` says so explicitly — keep it that way.

5. **The ElectronIx DNC deployment is a different product.** If referenced, name
   it precisely as ElectronIx DNC. Never imply it is Trace running in a plant.

6. **No price may appear.** Quote-based only. `DECISIONS.md` Q2/Q3/Q4 in the
   product repo are still open.

---

## Current state

- Branch: `claude/traceability-report-review-sqs75r`, which is currently the
  repository's **only branch and its default**. No PR exists because a PR needs a
  base different from the head. To open one, create `main` from this branch on
  GitHub first.
- **Not deployed.** No Vercel project, no DNS, no Supabase migration applied.
  `docs/DECISIONS.md` D-007.
- 34 routes, all static except `/api/lead`.

---

## Stack and why

Next.js 16 App Router, React 19, TypeScript strict (`noUncheckedIndexedAccess`),
Tailwind CSS v4, zod, Supabase JS, Playwright + `@axe-core/playwright`.

Deliberately **not** used, with reasons in `docs/DECISIONS.md`:

- **No GSAP / Lenis / Framer Motion** (D-004). They consume the whole 90 KB
  motion budget before any site code. Motion is native CSS transforms, `position:
  sticky` and `IntersectionObserver`. If you add a motion library, you own the
  LCP regression.
- **No MDX** (D-005). Articles are typed block arrays in `content/resources.ts`,
  so a malformed article fails `tsc`.
- **No shadcn/ui.** Three form controls do not justify it.

---

## Layout

```
app/                routes, sitemap.ts, robots.ts, opengraph-image.tsx, api/lead
components/ui/      section, page-header, related, cta-band, faq, scroll-region
components/sections/ hero-trace, stage-sequence, product-tour
components/demo/    unit-record, demo-explorer, recall-calculator
content/            features, industries, comparisons, resources, home
lib/                site, routes, schema, seo, demo-data, lead-schema, analytics
docs/               PRODUCT-FACTS, COMPETITORS, SEO-PLAN, DECISIONS, LOOP-LOG
supabase/migrations 0001_trace_leads.sql — committed, NOT applied
tests/              a11y, seo, journeys
```

`lib/routes.ts` is the single route manifest. `sitemap.ts`, `robots.ts` and the
internal-link test all read from it, so **a page cannot exist without being
discoverable**. Add a route there or it is invisible.

---

## Commands

```bash
npm run check         # typecheck + lint + build
npm run test:e2e      # 179 Playwright tests, desktop + Pixel 7 (build first)
npm run screenshots   # 360/768/1440 + horizontal-overflow check
```

`test:e2e` starts its own server on port 3117 and **never reuses an existing
one** — a long-lived `next start` from an earlier build silently turns the whole
suite into a test of stale output. This happened twice during the build. If tests
fail inexplicably, check you are not serving a stale build.

---

## Design conventions

- **Machine data is always mono** — serials, lot codes, torque readings,
  timestamps, station IDs. It is how a plant engineer recognises a value they are
  meant to trust.
- Sentence case throughout. The accent (`--color-signal`) is reserved for
  interactive elements and verdict states, where it carries meaning.
- **Avoid the generated-looking tells**: ALL-CAPS tracked-out eyebrow labels,
  uniform rounded cards with one soft shadow, gradient washes as decoration, `→`
  glued to links, one accent-coloured word in a headline. The visual language is
  hairline rules and panels, not floating cards.
- Voice: plain verbs, specific over clever, written for a plant head or QA
  manager in Coimbatore who has been burned by software that promised integration
  and delivered a spreadsheet. Concede a limitation early — it buys belief.

### Contrast is a gate, not a preference

The steel scale (`#838C99` / `#9BA3AF` / `#BAC1CB`) was chosen because the
original `steel-600 #5E6673` measured **2.85:1** and produced 61 AA failures.
Lowest current ratio is 4.86:1. **Measure before changing any token** — the axe
suite will catch it, but only if you run it.

---

## Things that will bite you

- **`.table-scroll` must keep `position: relative`.** An `sr-only` span inside a
  wide table is `position: absolute`; without a positioned ancestor its containing
  block is the viewport, so it escapes the scroll container and scrolls the whole
  page sideways. This cost 240px of horizontal overflow at 360px.
- **Reduced motion must zero `animation-delay`, not just duration.** Collapsing
  duration alone leaves a staged sequence waiting out its delays — the hero sat
  half-drawn for two seconds.
- **`lib/demo-data.ts` must stay deterministic.** It uses a seeded LCG so server
  and client render identically. Never introduce `Math.random()` or `Date.now()`
  there.
- **The honeypot must parse successfully** and be dropped silently in the route
  handler. A zod `max(0)` on it returns 422 naming the field, which tells a bot
  exactly what caught it.
- Every scrollable table must be a `ScrollRegion` (focusable, labelled), or a
  keyboard user cannot reach its right-hand columns.

---

## Validation status

Lighthouse desktop 100 / 100 / 96 / 100. Mobile 95–97 / **100** / 96 / 100.
179 Playwright tests green. Zero axe violations, 34 routes × 2 viewports.

**One gate not met: mobile LCP 2.4–2.8s against a 2.0s target.** FCP is 1.0–1.5s
and nothing blocks rendering; the gap is the `h1` repainting when Space Grotesk
loads. Only the display face is preloaded and its unused 700 weight is dropped —
that was the available headroom without changing the brand. Full numbers and the
three remaining options are in `docs/LOOP-LOG.md`. Do not claim this gate passes.

---

## Known gaps

- **`docs/COMPETITORS.md` is search-surface only.** The build environment's egress
  proxy blocked every competitor domain. Anything unverified is marked
  `[unverified]`. Re-run from an unrestricted network before trusting page-section
  order or page-speed claims.
- **The ElectronIx DNC site was not found**, so the palette comes from the
  specified brand tokens rather than being sampled from the live sibling site.
  Re-sample and reconcile before launch.
- **No Lighthouse CI config committed.** Runs were driven manually.
- **No real proof point exists for Trace.** Every honest weakness in
  `COMPETITORS.md` is a variant of "nobody has run this yet."

## Next steps

1. Create `main` on GitHub, open the PR against it.
2. Deploy to Vercel; set `NEXT_PUBLIC_SITE_URL` (canonicals, sitemap, OG images
   and JSON-LD all derive from it).
3. Apply `supabase/migrations/0001_trace_leads.sql` before pointing production at
   a project. Until then the lead route logs instead of storing.
