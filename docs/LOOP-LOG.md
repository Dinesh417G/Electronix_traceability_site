# LOOP-LOG

Phase 9: check → improve → revalidate. One entry per round, including the things
that were wrong.

Tooling note: this ran in a sandbox whose egress proxy blocks arbitrary domains,
and whose pre-installed Chromium (build 1194) is older than the one Playwright
1.63 expects. `playwright.config.ts` points at the installed binary when it is
present and falls back to Playwright's own resolution elsewhere, so the suite
runs both here and on a normal machine.

---

## Round 1 — first full check

**Ran:** `tsc --noEmit`, `eslint`, `next build`, 172 Playwright tests across
desktop and Pixel 7, `@axe-core/playwright` on all 34 routes.

**Failed:**

1. **61 colour-contrast violations, every page.** `--steel-600: #5E6673` measured
   2.85–3.29:1 against the graphite backgrounds — well under the 4.5:1 needed for
   the small label text it was used for. It was the only failing token; everything
   else measured 5.0:1 or better.
2. **Two ESLint errors in the lead form.** `useRef(Date.now())` is an impure call
   in a render body, and the UTM effect called `setState` synchronously inside
   `useEffect`, causing a cascading render.
3. **Eleven unused `eslint-disable` directives** for `react/no-danger`, a rule this
   config does not enable.
4. **`eslint-config-next` 16 could not be loaded through `FlatCompat`** — it threw
   on a circular structure. It ships flat-config entry points directly.

**Changed:**

1. Shifted the whole steel scale up, preserving its three-step hierarchy:
   `steel-600 #838C99`, `steel-500 #9BA3AF`, `steel-400 #BAC1CB`. Lowest measured
   ratio is now 4.86:1. Pulled `--rule` and `--rule-strong` back (22%→18%, 38%→32%)
   so hairlines stayed hairlines against the lighter source colour. Updated the
   matching hex literals in the logo, hero, product tour and OG image.
2. Rewrote the UTM handling to read campaign parameters on submit instead of
   holding them in state, which removes the effect entirely. Mount time moved into
   an effect.
3. Removed the directives; imported `eslint-config-next/core-web-vitals` and
   `/typescript` directly.

**Re-run:** typecheck, lint and build clean.

---

## Round 2 — accessibility and journeys

**Failed:**

1. **axe reported contrast failures on elements that were not actually visible.**
   The foreground it measured was `#101215` — a `.reveal` element at `opacity: 0`
   waiting to be scrolled into view. Auditing a page mid-animation is auditing a
   state no user is meant to read.
2. **`scrollable-region-focusable` on mobile.** Every `.table-scroll` wrapper
   overflows horizontally and holds a table with no focusable content, so a
   keyboard user could not scroll it at all — the right-hand columns were simply
   unreachable.
3. **Honeypot returned 422 with field errors.** The schema declared
   `website: z.string().max(0)`, so a filled honeypot failed validation and the
   response named the field that gave the bot away. The intent was a silent 200.
4. **Five meta descriptions over the 155-character budget** (`/demo`, `/resources`
   and three articles, up to 185 characters).
5. **`/privacy` and `/terms` had one outbound internal link each**, against the
   three-link rule in `SEO-PLAN.md`.
6. **Rate limiting coupled the tests to each other.** At 4 requests/minute keyed on
   one shared origin IP, the API tests consumed each other's budget and failed
   with 429s that had nothing to do with what they were testing.
7. **Mobile menu button changed its accessible name** from "Open menu" to
   "Close menu" on toggle, while also setting `aria-expanded` — the same state
   announced twice, and a locator that stops matching after the first click.

**Changed:**

1. The accessibility suite now runs with `reducedMotion: "reduce"`, which is the
   static end state the design promises and a real user configuration. Added a
   test asserting no `.reveal` element stays transparent under it, so the audit
   cannot be quietly passing because content is hidden.
2. Added a `ScrollRegion` component: `tabIndex={0}`, `role="group"` and a
   descriptive `aria-label`, applied to all eleven scrollable tables and the one
   scrollable code block.
3. Made the honeypot permissive in the schema and dropped silently in the handler.
4. Rewrote the five descriptions to 131–153 characters.
5. Added a related-links block to both legal pages.
6. Rate limit is now `LEAD_RATE_LIMIT`, default 8/minute. Each API test sends its
   own `x-forwarded-for`, and one test deliberately floods a single address to
   prove the limiter still refuses.
7. The menu button keeps a stable name ("Menu") and carries state only on
   `aria-expanded`.

**Re-run:** 179 Playwright tests green. Zero axe violations on 34 routes × 2
viewports.

---

## Round 3 — looking at it, and Lighthouse

**Failed:**

1. **240px of horizontal overflow at 360px on `/` and `/demo`.** The cause was an
   `sr-only` `<span>` inside a wide table: `position: absolute` with no positioned
   ancestor resolves its containing block to the viewport, so it escaped the
   `overflow-x: auto` wrapper and dragged the document sideways. `main` measured
   360px while the root measured 600px, which is what made it hard to see.
2. **The hero was broken under reduced motion** — only the part silhouette drew.
   The global reduced-motion rule collapsed `animation-duration` but not
   `animation-delay`, so a staged sequence still waited out its delays. The
   audit's own screenshots showed it.
3. **An empty grey cell** in "What changes, depending on where you sit" — five
   roles in a three-column grid.
4. **Lighthouse mobile accessibility 98 on `/how-it-works`**, two findings axe
   with my tag set did not report: `heading-order` (the stage sequence's `h3`
   followed the `h1` with no `h2` between) and `label-content-name-mismatch` (the
   logo's `aria-label="ElectronIx Trace, home"` did not match its visible
   wordmark, a WCAG 2.5.3 problem for voice control).
5. **Mobile LCP 2.9s** against a 2.0s gate, with FCP at 1.0s — a 1.9s gap, the
   signature of a webfont swap on the `h1`.

**Changed:**

1. `position: relative` on `.table-scroll`, so absolutely positioned descendants
   resolve inside the scroll container. Added a test that fails if any route
   scrolls horizontally at 360px.
2. Added `animation-delay: 0ms` and `transition-delay: 0ms` to the reduced-motion
   block. Added a test asserting the hero's tree nodes are opaque and its labels
   present under reduced motion.
3. The sixth cell is now a link to `/contact` that earns its place.
4. Added an `h2` before the stage sequence; removed the logo's `aria-label` so the
   visible wordmark is the accessible name.
5. Preloaded only the display face (Space Grotesk) rather than all three families,
   which took ~88 KB of fonts off the critical path, and dropped its unused 700
   weight. LCP moved from 2.9s to 2.4–2.8s.

**Re-run:** 179 Playwright tests green, zero axe violations, no horizontal
overflow at 360px, Lighthouse mobile accessibility back to 100 on every page
checked.

---

## Final numbers

Lighthouse 12, against `next start` on the build in this branch.

| Page | | P | A | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| `/` | desktop | **100** | **100** | 96 | **100** | 0.6s | 0.001 | 0ms |
| `/demo` | desktop | **100** | **100** | 96 | **100** | 0.5s | 0.001 | 0ms |
| `/` | mobile | 95 | **100** | 96 | **100** | 2.8s | 0.013 | 110ms |
| `/demo` | mobile | 97 | **100** | 96 | **100** | 2.4s | 0 | 80ms |
| `/how-it-works` | mobile | 97 | **100** | 96 | **100** | 2.5s | 0.03 | 100ms |
| `/industries/auto-components` | mobile | 97 | **100** | 96 | **100** | 2.4s | 0.002 | 70ms |
| `/resources/planning-a-recall-scope-calculation` | mobile | 97 | **100** | 96 | **100** | 2.6s | 0.006 | 40ms |

## Gates

| Gate | Target | Result |
|---|---|---|
| Performance | ≥90 mobile / ≥95 desktop | **Pass** — 95–97 mobile, 100 desktop |
| Accessibility | 100 | **Pass** — 100 on every page measured |
| Best Practices | ≥95 | **Pass** — 96 |
| SEO | 100 | **Pass** |
| CLS | < 0.1 | **Pass** — 0 to 0.03 |
| INP proxy (TBT) | < 200ms | **Pass** — 40–110ms mobile |
| axe violations | 0 | **Pass** — 34 routes × 2 viewports |
| Playwright | all green | **Pass** — 179 tests |
| Unique title, meta, H1, schema per page | all | **Pass** — enforced by test |
| Sitemap covers every route, all 200 | yes | **Pass** — enforced by test |
| Usable with JavaScript disabled | yes | **Pass** — enforced by test |
| No horizontal scroll at 360px | yes | **Pass** — enforced by test |
| **LCP** | **< 2.0s mobile** | **FAIL — 2.4s to 2.8s** |

## The gate that did not pass, in plain language

**Mobile LCP is 2.4–2.8 seconds against a 2.0 second target.**

The page is not slow in the ordinary sense: first contentful paint is 1.0–1.5s,
Speed Index is 1.0s, there is no render-blocking resource, the server responds in
10ms, and total blocking time is under 110ms. The gap between FCP and LCP is
almost entirely the moment Space Grotesk finishes loading and the `h1` repaints
in it. Preloading only the display face and dropping its unused weight moved it
about half a second; that was the available headroom without changing the brand.

Three honest options, none of which I took unilaterally because each is a trade
rather than a fix:

1. **Set the `h1` in the system font stack** and keep Space Grotesk for smaller
   headings. This would almost certainly clear 2.0s, and it costs the brand its
   most visible expression on every page.
2. **Subset Space Grotesk to the characters the headings actually use.** Real, but
   it makes headline copy edits a build-time concern, which is a bad trade on a
   site whose copy should stay easy to change.
3. **Accept it.** Lighthouse mobile simulates ~1.6 Mbps with 150ms RTT against a
   local server with no CDN. On Vercel's edge with HTTP/2 and a warm font cache,
   field LCP will be materially better than this figure. That is a reason to
   expect a better real number, not evidence of one — the honest thing is to
   measure it in Search Console once traffic exists rather than assert it here.

Measurement caveat: repeated runs of the identical build returned 2.4s and 2.8s
for the same page, so roughly ±0.4s of this is sandbox noise.

## Known gaps beyond the gates

- ~~**Competitor research is search-surface only.**~~ Re-run from an unrestricted
  network on 2026-09-16; see `COMPETITORS.md`, which now marks what was verified
  directly and what was corrected.
- ~~**The ElectronIx DNC site was not found.**~~ Sampled 2026-09-16; the
  reconciliation is `DECISIONS.md` D-011.
- **No Lighthouse CI config is committed.** Runs were driven directly. If you want
  this in CI, `@lhci/cli` with these gates is the obvious next step.

---

## Post-deployment measurement — 2026-09-16

The numbers above were taken against `next start` on a laptop. The site has been
live on Vercel since 2026-09-15, so the LCP question could finally be answered
the way option 3 asked for: by measuring the deployed thing rather than arguing
about it. Lighthouse 13.4.1, mobile preset, three runs per page, against
`https://electronix-trace-site.vercel.app`.

| Page | P | FCP | LCP | SI | TBT | CLS |
|---|---|---|---|---|---|---|
| `/` | 97–98 | 1.5–1.7s | **2.0 / 2.4 / 2.4s** | 1.5–2.6s | 10–30ms | 0 |
| `/how-it-works` | 99–100 | 0.9–1.2s | **1.9 / 2.1 / 1.8s** | 0.9–1.2s | 10–30ms | 0 |
| `/industries/auto-components` | 99 | 1.1–1.2s | **2.0 / 1.9 / 2.1s** | 1.1–1.3s | 10–20ms | 0 |

**The gate now passes on interior pages and is marginal on the home page.**
Interior routes land 1.8–2.1s against the 2.0s target; `/` lands 2.0–2.4s. The
CDN was worth roughly half a second, which is what option 3 predicted and did
not have the right to assert. CLS is 0 on every run and TBT is a third of what
the local runs showed.

### The diagnosis in the section above is wrong

That section blames the `h1` repainting when Space Grotesk loads. Lighthouse 13
names the LCP element, and on every run of every page it is **not the `h1`** —
it is the lede paragraph under it (`p.prose-measure`), which is set in `sans`
(Geist), not in the display face. `font-display-insight` scores 1: no font is
blocking text. The LCP subparts are TTFB 120ms plus element render delay
(143ms–1.3s, the variance being what the ±0.4s of run noise actually is).

So the font-swap story survives only in a modified form: the element that
repaints is body copy, not the headline, which makes option 1 — setting the `h1`
in a system stack — pointless. It would trade the brand's most visible
expression for nothing measurable.

### Preloading the sans face: tried, measured, rejected

If the LCP element is set in `sans`, the obvious move is to preload `sans` too.
Measured locally, four runs each on the identical build:

| | FCP median | LCP median | LCP range | Perf |
|---|---|---|---|---|
| `sans` not preloaded (shipped) | 1659ms | **2945ms** | 2925–2965 | 94 |
| `sans` preloaded | 1360ms | **2953ms** | 2944–3107 | 94–95 |

FCP improves by ~300ms; **LCP does not move at all.** The change is not in the
tree: ~50 KB of extra critical-path font for no movement on the failing gate is
the wrong trade to make silently, and it is the reverse of the decision recorded
above. If the owner wants the FCP, it is a one-line change in `app/layout.tsx`
and the comment there says so.

### What is left, if the home page's 2.4s matters

`render-blocking-insight` scores 0 on every page: one stylesheet,
`_next/static/immutable/chunks/*.css`, 10.4 KB, costing ~150ms. That is the only
remaining lever the build owns, and inlining critical CSS in the App Router is
not a one-line change. Everything else — TTFB 120ms, no long chains, modern HTTP,
no unused JS worth naming — is already where it should be.

Field data (CrUX) will say more than any of this once traffic exists. There is
none yet: the PageSpeed Insights API returns no `loadingExperience` for the
origin.
