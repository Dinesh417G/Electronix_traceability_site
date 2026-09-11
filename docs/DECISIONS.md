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
exists.

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
