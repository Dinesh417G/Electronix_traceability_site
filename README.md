# ElectronIx Trace — marketing website

Production site for **ElectronIx Trace**, a product traceability platform for
manufacturing plants. Next.js 16 (App Router), React 19, TypeScript strict,
Tailwind CSS v4.

The product itself lives in [`Dinesh417G/Traceability`](https://github.com/Dinesh417G/Traceability)
and is the source of truth for what this site may claim. See
[`docs/PRODUCT-FACTS.md`](docs/PRODUCT-FACTS.md).

## Run it

```bash
npm install
cp .env.local.example .env.local     # every key is documented in there
npm run dev                          # http://localhost:3000
```

Nothing needs configuring to run locally. With no Supabase keys set, the lead
route logs submissions instead of storing them, so a preview deployment can never
silently lose an enquiry.

## Checks

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # eslint
npm run build         # next build
npm run check         # all three
npm run test:e2e      # Playwright: 179 tests, desktop + Pixel 7
```

`npm run test:e2e` builds nothing — run `npm run build` first. The suite always starts
its own server on port 3117 (never reusing one, so it cannot test a stale
build) and covers accessibility (`@axe-core/playwright` on
every route), metadata and schema, internal linking, the sitemap, the demo, the
recall calculator, the lead form including honeypot and rate limiting, the mobile
menu, and that the site works with JavaScript disabled.

Lighthouse, against a production build (the numbers in `docs/LOOP-LOG.md` were
produced this way):

```bash
npm run build && npx next start -p 3100 &
CHROME_PATH=/path/to/chrome npx lighthouse http://127.0.0.1:3100/ --view
CHROME_PATH=/path/to/chrome npx lighthouse http://127.0.0.1:3100/ --preset=desktop --view
```

Screenshots at 360 / 768 / 1440 with a horizontal-overflow check:

```bash
npm run build && npx next start -p 3100 &
node scripts/screenshots.mjs          # writes to screenshots/
```

## Layout

```
app/                routes, sitemap.ts, robots.ts, opengraph-image.tsx, api/lead
components/
  ui/               section, page header, related links, CTA band, FAQ, scroll region
  sections/         hero, stage sequence, product tour
  demo/             unit record, demo explorer, recall calculator
  site-header.tsx   site-footer.tsx  lead-form.tsx  logo.tsx  analytics.tsx
content/            features, industries, comparisons, resources, home copy
lib/                site constants, route manifest, schema builders, SEO, demo data
docs/               PRODUCT-FACTS, COMPETITORS, SEO-PLAN, DECISIONS, LOOP-LOG
supabase/migrations lead table SQL (committed, not applied)
tests/              Playwright specs
```

## Adding an article

Articles are typed content modules, not MDX — see `DECISIONS.md` D-005.

1. Append an entry to the `resources` array in `content/resources.ts`.
2. Fill in `slug`, `title`, `metaTitle` (≤60 chars), `description` (≤155 chars),
   `published`, `readingMinutes`, `topic`, `lede`, `relatedFeature` and
   `relatedIndustry`.
3. Write `blocks` using the `Block` union: `p`, `h2`, `h3`, `ul`, `ol`, `note`,
   `table`, `code`. TypeScript will reject a malformed block, which is the point.

The route, the sitemap entry, the JSON-LD `Article` and the index card all follow
automatically. Run `npm run test:e2e` — the SEO spec will fail if the title or
description duplicates another page's or runs long.

## Adding an industry page

Append to `industries` in `content/industries.ts`. Every field is required
because an industry page that cannot name what is measured at a station in that
industry should not exist:

- `scenario` — the specific thing that goes wrong there without traceability
- `capturePoints` — what is actually recorded, and why each matters
- `routeExample` — a plausible route for that product
- `faq` — at least two real objections; these become `FAQPage` schema

## Updating the demo dataset

`lib/demo-data.ts`. The spine is real: product `EX-VLV-2200` rev A, station
`ST-01`, operator `R. Kumar`, part `SCR-M6-20` and the `final_torque` point
(10–14 Nm, nominal 12) all come from the route simulator's worked example in the
product repo. It is extended to 24 units across 3 job cards and 8 component lots
so the recall query has something to find.

- Units are generated deterministically from a seeded LCG, so server and client
  render identically. Do not introduce `Math.random()` or `Date.now()` here.
- Two units fail their torque gate on purpose. A demo where everything passes
  teaches a visitor nothing about the software.
- `LOTS`, `JOB_CARDS`, `OPERATORS` and `STATIONS` are the knobs worth turning.
- It is sample data and is labelled as such wherever it is shown. Do not present
  it as production data from a customer.

## Lead capture

`POST /api/lead` → zod validation → honeypot and timing check → Supabase insert →
optional Resend notification. Nothing fails the request because a notification
failed.

`supabase/migrations/0001_trace_leads.sql` is **committed but not applied**. It
enables RLS with an insert-only policy for `anon`: the public key in every
visitor's browser can add an enquiry and cannot read one back. Reads need the
service role key, which stays server-side. Apply it with the Supabase CLI or the
SQL editor before pointing production at a project.

## Deploying

Not deployed from this branch — see `DECISIONS.md` D-007. When you are ready:

1. Import the repo into Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` to the real origin. Canonicals, the sitemap, OG
   images and JSON-LD all derive from it, so this one is not optional.
3. Set the Supabase keys, and `RESEND_API_KEY` plus `LEAD_NOTIFY_FROM` if you
   want lead emails.
4. Set `NEXT_PUBLIC_GA_ID` to turn analytics on. Left unset, the site ships with
   no tracking at all.
5. Apply the Supabase migration.
6. Submit `/sitemap.xml` in Search Console and confirm GA4 is receiving events
   from production, not from localhost.

## Conventions worth keeping

- **Never claim a capability that is not in `docs/PRODUCT-FACTS.md`**, and never
  invent proof — no customer logos, testimonials, certifications, star ratings,
  install counts or benchmark numbers. The claims blocklist in that file is the
  list to check against.
- Machine data — serials, lot codes, torque readings, timestamps, station IDs —
  is always set in the mono face. That is how a plant engineer recognises a value
  they are meant to trust.
- Sentence case. No ALL-CAPS eyebrow labels, no gradient decoration, no arrow
  glued to a link, no single accent-coloured word in a headline. The accent is
  reserved for interactive elements and verdict states, where it means something.
- Every animation must have a static end state, and the page must be complete
  with JavaScript off. Both are covered by tests.
