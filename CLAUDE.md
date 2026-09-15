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
- **Deployed** since 2026-09-15 to `https://electronix-trace-site.vercel.app`
  (Vercel project `electronix-trace-site`, team `dinesh417gs-projects`). This
  supersedes `docs/DECISIONS.md` D-007, which still says otherwise. No custom
  DNS yet — `NEXT_PUBLIC_SITE_URL` points at the vercel.app address, and
  canonicals, sitemap, OG images and JSON-LD all follow from it.
- **Leads are stored.** `supabase/migrations/` 0001-0003 are applied to the
  Supabase project `kowotmvjnbapegdxytxl`, which is the ElectronIx DNC site's
  project and is now the shared hub for both products' enquiries. Trace writes
  `trace_leads`, DNC keeps `quote_requests`, and the `customer_requests` view
  unions them with a `product` column naming each.
- Static marketing routes plus `/api/lead`, `/api/lead/verify` and a staff-only
  `/admin` area (sign-in, enquiries inbox, password reset), all `noindex` and
  disallowed in `robots.txt`.
- **`later.md` at the repo root lists what still needs the owner** — two API
  keys and one Supabase redirect-allowlist entry. Until they are set, double
  opt-in and password-reset links are off, and the site degrades to "stored and
  owner alerted immediately" rather than failing. Keep it current.

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
app/                routes, sitemap.ts, robots.ts, opengraph-image.tsx, api/, admin/
components/ui/      section, page-header, related, cta-band, faq, scroll-region
components/         site-header, site-footer, logo, theme-toggle, lead-form
components/sections/ hero-trace, stage-sequence, product-tour
components/demo/    unit-record, demo-explorer, recall-calculator
content/            features, industries, comparisons, resources, home
lib/                site, routes, schema, seo, demo-data, lead-schema, analytics,
                    auth (the DAL), email, supabase/server
docs/               PRODUCT-FACTS, COMPETITORS, SEO-PLAN, DECISIONS, LOOP-LOG
scripts/            contrast.mjs (colour gate), screenshots.mjs, hero-frames.mjs
supabase/migrations 0001-0003 — applied to kowotmvjnbapegdxytxl
tests/              a11y, seo, journeys
```

`lib/routes.ts` is the single route manifest. `sitemap.ts`, `robots.ts` and the
internal-link test all read from it, so **a page cannot exist without being
discoverable**. Add a route there or it is invisible.

---

## Commands

```bash
npm run check         # contrast + typecheck + lint + build
npm run contrast      # colour gate on its own, both themes
npm run test:e2e      # 179 Playwright tests, desktop + Pixel 7 (build first)
npm run screenshots   # light and dark x 360/768/1440 + horizontal-overflow check
npm run hero-frames   # scrub the hero loop to exact frames; proves it closes
```

`screenshots` and `hero-frames` do NOT start a server — they expect one already
on port 3100, and fail with `ERR_CONNECTION_REFUSED` if it is missing:

```bash
npm run build && npx next start -p 3100
```

`hero-frames` takes a theme argument (`node scripts/hero-frames.mjs dark`) and
writes to `screenshots/hero/`. `/screenshots/` is gitignored.

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

### Two themes, one set of role tokens

Light is the default and is what a visitor gets unless they have chosen dark;
the system preference is deliberately not consulted. Dark is opt-in via
`:root[data-theme="dark"]`.

The palette names are **roles**, which is the only reason two themes cost no
utility-class churn: `graphite-*` appears only as `bg-`, `steel-*` and
`line-050` only as `text-`. Redefining the variables per theme re-skins the
site. Keep it that way — a `text-graphite-900` anywhere breaks the scheme.

`signal` and `signal-solid` are a pair, and the distinction matters. Brand
orange `#FF6B1A` on white is **2.87:1**, so it cannot be text in a light theme.
`signal` is the accent wherever it is text or a meaningful border and darkens to
`#9E3D0B` in light mode; `signal-solid` stays brand orange and is for fills —
buttons, the logo dot, the laser — where the label reads against the orange
rather than against the page.

Theme application is an inline script in `<body>`, before paint, so a dark-theme
visitor never sees a white flash. That mutates `<html>` before React hydrates,
which is why the root element carries `suppressHydrationWarning` — it is scoped
to that one element's attributes and must not be removed.

### Contrast is a gate, not a preference

Run **`npm run contrast`**. It measures all 98 foreground/background pairs both
themes can produce and exits non-zero on any failure; `npm run check` runs it
first. Do not adjust a colour token without it.

It models what the CSS actually paints, not just the plain surfaces — including
the chip tints, where the accent sits on a 10% wash of *itself*. That case is
why `signal` is `#9E3D0B` and not the lighter orange it started as: axe caught
`.chip-signal` at 4.14:1 after the first version of the gate had passed it.

Two things it fixed that predate the light theme:

- `--rule-strong` was `color-mix(steel-500 32%, transparent)`, which flattened
  to **2.6-2.9:1** on panels in the dark theme. It draws form-input and
  secondary-button borders, so it owes 3:1 under WCAG 1.4.11. It is now opaque
  and per-theme. The axe suite never caught this because axe has no rule for
  input borders — passing axe is not the same as passing 1.4.11.
- The steel scale's original `#5E6673` measured 2.85:1 and produced 61 AA
  failures. Lowest ratio across both themes is now 3.02:1 for borders and
  4.46:1 for text.

---

## Things that will bite you

- **`.table-scroll` must keep `position: relative`.** An `sr-only` span inside a
  wide table is `position: absolute`; without a positioned ancestor its containing
  block is the viewport, so it escapes the scroll container and scrolls the whole
  page sideways. This cost 240px of horizontal overflow at 360px.
- **Reduced motion must zero `animation-delay`, not just duration.** Collapsing
  duration alone leaves a staged sequence waiting out its delays — the hero sat
  half-drawn for two seconds. That global rule still applies everywhere except
  the hero, which now opts out of it entirely (see below).
- **Elements in the hero that correctly rest at opacity 0 carry
  `data-transient`.** The beam, scan line, sparks, firing indicator and decode
  flash are machine states, not content. `tests/a11y.spec.ts` uses the attribute
  to tell "correctly off" from "stranded mid-animation" — without it, a laser
  left lit after marking would be the only way to pass the test.
- **Never put a responsive `hidden` on an element that also has `.btn`.** `.btn`
  sets `display: inline-flex` and is declared after Tailwind's utilities, so it
  wins on the same element and the thing never hides. Put the `hidden lg:block`
  on a wrapper. This shipped the desktop CTA into the 360px header.
- **A CSS comment cannot contain `*/`.** Writing `steel-*/line-050` in a comment
  in `globals.css` closed it early and took the rest of the token block with it.
  Turbopack reported it as a dangling combinator 400 lines further down.
- **`lib/demo-data.ts` must stay deterministic.** It uses a seeded LCG so server
  and client render identically. Never introduce `Math.random()` or `Date.now()`
  there.
- **The honeypot must parse successfully** and be dropped silently in the route
  handler. A zod `max(0)` on it returns 422 naming the field, which tells a bot
  exactly what caught it.
- Every scrollable table must be a `ScrollRegion` (focusable, labelled), or a
  keyboard user cannot reach its right-hand columns.

---

## The hero is a loop, and that constrains it

`components/sections/hero-trace.tsx` plus the `st-*` keyframes in `globals.css`
are one marking station running a 13s cycle: part indexes in, hold-down shuts,
head feeds down its Z axis, galvo rasters the code row by row, head parks, the
DPM reader lights and grades the mark, the record writes itself out of that
read, holds, then clears as the part indexes out.

Four rules, each of which was learned by breaking it:

1. **One master timeline, no `animation-delay` for sequencing.** Every animated
   node carries `.station-anim` — 13s, linear, infinite — and puts its phase in
   its own keyframe percentages. A delay applies *only to the first iteration*,
   so the delay-chained version this replaced ran once and then fired
   everything at once forever. The percentages are generated, not hand-counted.

2. **Every cycle must end where it starts,** or the loop visibly rewinds. Any
   repositioning happens while the element is at opacity 0. `npm run hero-frames`
   asserts this: it compares frame *t* against frame *t + 13000ms* and fails on
   any difference.

3. **Reduced motion is a separate path, not a squashed one.** The global
   override lands a one-shot on its final frame — but a loop's final frame is
   the empty stage before the next part. So `.station-anim` sets
   `animation: none !important` under reduced motion, and every element's BASE
   attributes are the finished diagram. If you add an element, set its static
   attributes to how it should look at rest, then animate away from that.

4. **`animation-delay: -8000ms` is load-time framing, not sequencing.** A
   negative delay seeks into the timeline instead of postponing it, so the page
   opens on the completed record rather than on six seconds of empty right-hand
   column. Every element shares the offset, so the cycle stays in sync.

Two things that make the station read as a machine rather than a diagram, worth
preserving: the part lies down (a Z axis is above the surface it writes to), and
the reader is a separate canted device (a verifier aimed square at a specular
machined surface reads its own reflection).

Scale discipline matters more than detail here. A rotating toggle clamp was
tried and read as a diagonal slash across the workpiece at 200px wide; a linear
hold-down reads instantly. Add a part, look at `npm run hero-frames` output, and
delete it if it becomes noise.

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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
