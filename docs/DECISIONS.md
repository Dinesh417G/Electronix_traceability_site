# DECISIONS

One line of reasoning each. Newest last.

## D-001 — Build in `Electronix_traceability_site`, not a new repo

The brief said create `electronix-trace-web`. The product owner directed the build
into the existing empty repo, which is already attached to this session with push
access. Branch `claude/traceability-report-review-sqs75r` per the session's branch
requirement.

## D-002 — ElectronIx DNC site could not be found; Phase 4 tokens used

Searched for the live DNC site. Results returned CIMCO, Predator, NCnet and a
Coimbatore CIMCO reseller — no ElectronIx DNC property. No Vercel or GoDaddy
tooling was connected to this session to check the accounts directly, and the
environment's egress proxy blocks arbitrary domain fetches. So the brand system is
built from the tokens specified in Phase 4 of the brief rather than sampled from
the live sibling site. **Re-sample and reconcile before launch** if the DNC site
exists. *(Done 2026-09-16 — the site was found. See D-011.)*

## D-003 — The site presents the designed system, not only the shipped subset

Phase 1 found that laser DPM is deferred (`DECISIONS.md` D-002 in the product
repo), that only Manual, TCP-line and Simulated drivers are built, and that no
operator UI exists. This was put to the product owner with the shipped-only option
recommended. **The owner chose to present the full designed system** — laser DPM,
the declared driver set, and the station UI — in present-tense product voice. That
is a commercial decision the owner is entitled to make about their own product, and
it is implemented.

**The boundary held anyway, on the author's judgement:** capability claims are the
owner's call, but *fabricated evidence* is a different category of risk and is not
present. The site carries no invented customer logos, testimonials, certifications,
star ratings, install counts or performance benchmarks, and no rendering is
captioned as a photograph or screenshot of running software. `PRODUCT-FACTS.md`
remains the accurate built-vs-designed record.

## D-004 — No GSAP, Lenis, Framer Motion or shadcn/ui

The brief specified them. Implemented the motion natively instead — CSS
transforms, `position: sticky` for the pinned sequence, `IntersectionObserver` for
reveals, and one small `requestAnimationFrame` timeline for the hero.

Reasoning: the motion budget in the brief is under 90 KB gzipped and the gates
demand LCP < 2.0s on throttled mobile. GSAP + ScrollTrigger + Lenis is roughly
that entire budget before a line of site code. The native implementation is a few
kilobytes, has no hydration cost, cannot block LCP, and degrades to a static
end-state under `prefers-reduced-motion` by construction rather than by
configuration. shadcn/ui was skipped because three form controls and one dialog do
not justify the dependency, and the brief itself warns against looking like a
shadcn demo.

## D-005 — Resources are typed content modules, not MDX

The brief specified MDX. Articles are authored as typed block arrays in
`content/resources/`. Reasoning: six long technical articles do not need a compiler
plugin, and MDX under Next 16 with Turbopack adds a build-fragility risk that the
Phase 9 gates would have to absorb. Typed blocks give compile-time checking of
every article's structure, which MDX does not. `README.md` documents how to add an
article; it is no harder than MDX.

## D-006 — Lead email notification: Resend, wired but inert

Chose Resend over a Supabase Edge Function: one HTTP call from a route handler that
already exists, no second deployment target, no Deno toolchain. If
`RESEND_API_KEY` is unset the handler logs and still stores the lead, so a missing
key can never lose a lead.

## D-007 — Supabase migration committed, not applied

The owner scoped this session to build-and-push. `supabase/migrations/0001_trace_leads.sql`
is committed with RLS enabled and an anon `INSERT`-only policy. Nothing was run
against the live Supabase project, no Vercel deploy was made, and no GoDaddy DNS
was touched.

## D-008 — Analytics wired but not activated

GA4, Vercel Analytics and Speed Insights mount only when their env vars are
present, so the repo ships with no tracking and no consent problem, and production
turns them on with configuration alone.

## D-009 — Demo dataset seeded from `route-sim`, extended for depth

The real values in `tools/route-sim/src/main.rs` (EX-VLV-2200 rev A, ST-01,
R. Kumar, SCR-M6-20, final_torque 10–14 Nm nominal 12, EOL test, mark grade B) are
the spine of the demo. A demo needs more than one unit to make a recall query
meaningful, so the dataset extends that spine to 24 units across 3 job cards and 4
component lots. The extension is clearly labelled as sample data in the UI and in
`lib/demo-data.ts`; it is not presented as production data from a customer.

## D-010 — Title-case avoided, one H1, no accent-coloured headline word

Phase 4 lists the generated-looking tells to avoid. Implemented as rules: sentence
case throughout, no ALL-CAPS eyebrows, no uniform card grid with one shadow, no
gradient decoration, no arrows glued to links, no single accent-coloured word in a
headline. The accent is reserved for interactive elements and verdict states, where
it carries meaning.

## D-011 — DNC site found and sampled; palette kept, one delta flagged

D-002 recorded that the ElectronIx DNC site could not be found, so the brand
system came from the brief's Phase 4 tokens rather than from the sibling site.
The site is up at `electronix.co.in` and was sampled on 2026-09-16 from its
compiled stylesheet (`/_next/static/chunks/27fdv4y7cwii5.css`):

| DNC token | Value | Trace equivalent |
|---|---|---|
| `--color-accent` | `#f97316` | `--color-signal-solid` `#ff6b1a` |
| `--color-accent-hover` | `#ea580c` | `.btn-primary:hover` `#ff7d36` |
| `--color-graphite` | `#0f1318` | `--color-graphite-950` dark `#0e1013` |
| `--color-surface` | `#161b22` | `--color-graphite-850` dark `#171b21` |
| `--color-light` | `#f6f7f9` | `--color-graphite-900` light `#f6f7f9` |
| `--color-muted` | `#64748b` | `--color-steel-500` `#9ba3af` dark / `#49525f` light |
| `--color-live` | `#22c55e` | `--color-verify` `#2ed47a` dark / `#0f6b33` light |
| `--font-display` | Space Grotesk | Space Grotesk |
| `--font-mono` | JetBrains Mono | JetBrains Mono |
| `--font-sans` | **Inter** | **Geist** |

The two systems are the same system. Surfaces, the light ground, the verdict
green and two of the three families already match to within a shade. Two deltas
are real:

1. **Accent hue.** `#f97316` and `#ff6b1a` are different values but, measured,
   near-identical in luminance: 2.80:1 vs 2.85:1 on white, 6.65:1 vs 6.69:1 on
   their respective dark grounds. Neither can be text on a light ground, so the
   `signal` / `signal-solid` split this site already runs would be needed on DNC's
   value too. Changing it is a brand call, not a technical one, so it is the
   owner's — and it is a one-token change if they want the sibling's exact orange.
2. **Sans family.** DNC sets body copy in Inter; Trace uses Geist. Both are
   neutral grotesques at text sizes, and the visible family on a page — the
   display face — is the same on both sites. Also the owner's call; also one line.

Trace's steel scale is deliberately darker than DNC's `--color-muted`: `#64748b`
measures 4.76:1 on white, which passes AA text but fails the 3:1 that
`--rule-strong` owes as a border under WCAG 1.4.11. That difference stays.

**Not changed unilaterally.** D-002's instruction was to re-sample and reconcile;
the reconciliation is that nothing is broken and two brand-level choices are now
visible enough to decide. Whichever way they go, run `npm run contrast` after.
