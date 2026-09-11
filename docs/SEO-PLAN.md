# SEO-PLAN

India primary (`en-IN`), export/global secondary. Quote-led conversion, so
commercial-intent pages outrank informational volume in priority.

## Keyword map by intent

### Transactional — highest priority

| Keyword | Page |
|---|---|
| product traceability software | `/` |
| manufacturing traceability system India | `/` |
| traceability software price India | `/pricing` |
| barcode traceability system for MSME | `/pricing` |
| traceability software for auto component manufacturers | `/industries/auto-components` |
| assembly line traceability system | `/industries/general-assembly` |
| serial number traceability software | `/features/part-genealogy` |

### Commercial investigation — our best-value, lowest-competition set

| Keyword | Page |
|---|---|
| MES traceability module alternative | `/vs/siemens-opcenter` |
| Siemens Opcenter alternative for small manufacturers | `/vs/siemens-opcenter` |
| Sepasoft MES traceability alternative | `/vs/sepasoft-mes` |
| DELMIAWorks track and trace alternative | `/vs/delmiaworks` |
| iTAC MES alternative | `/vs/itac` |
| traceability software vs barcode integrator | `/vs/aidc-integrators` |
| recall management software manufacturing | `/features/recall-and-forward-trace` |
| first pass yield tracking software | `/features/process-data-capture` |

### Informational — organic moat, links down to commercial pages

| Keyword | Page |
|---|---|
| traceability requirements IATF 16949 | `/resources/traceability-requirements-iatf-16949-audit` |
| torque data logging traceability | `/resources/capturing-torque-data-from-a-plc` |
| part genealogy software / what is part genealogy | `/resources/what-a-part-genealogy-record-must-contain` |
| laser marking traceability software | `/resources/laser-marking-vs-label-printing` |
| how to calculate recall scope | `/resources/planning-a-recall-scope-calculation` |
| MES vs standalone traceability | `/resources/mes-or-standalone-traceability` |
| QR code traceability manufacturing | `/how-it-works` |

## Per-URL specification

Title tags ≤ 60 chars, meta descriptions ≤ 155. Every page carries
`BreadcrumbList` in addition to the schema named.

| URL | Intent | Primary keyword | Title | H1 | Schema |
|---|---|---|---|---|---|
| `/` | Transactional | product traceability software | ElectronIx Trace — Product Traceability Software | Know exactly which units are affected. Prove it. | Organization, LocalBusiness, SoftwareApplication, FAQPage |
| `/how-it-works` | Informational | QR code traceability manufacturing | How ElectronIx Trace Works — Job Card to Scan | From job card to a scan that returns everything | HowTo |
| `/demo` | Transactional | traceability software demo | Live Traceability Demo — Scan a Sample Unit | Scan a sample unit | SoftwareApplication |
| `/pricing` | Transactional | traceability software price India | Traceability Software Pricing — ElectronIx Trace | What drives the price of a traceability system | Product/Offer |
| `/features/[slug]` | Commercial | per feature | per feature | per feature | SoftwareApplication |
| `/industries/[slug]` | Transactional | per industry | per industry | per industry | Service |
| `/vs/[slug]` | Commercial | per competitor | per competitor | per competitor | Article |
| `/resources` | Informational | manufacturing traceability guides | Traceability Guides for Plant Engineers | Traceability, written by the engineer who built it | CollectionPage |
| `/resources/[slug]` | Informational | per article | per article | per article | Article |
| `/contact` | Transactional | traceability software Coimbatore | Talk to the Engineer — ElectronIx Trace | Book a 20-minute line walkthrough | LocalBusiness |
| `/thank-you` | — | noindex | Thank You — ElectronIx Trace | Booked | — |
| `/privacy`, `/terms` | — | noindex-eligible | — | — | — |

## Programmatic sets

**`/industries/<slug>`** — 6 pages: auto-components, pumps-and-valves,
switchgear-and-electricals, ev-components, precision-machining, general-assembly.
Each carries its own capture points, its own failure scenario, its own route
example and its own FAQ. No spun text: if an industry page cannot name what is
measured at a station in that industry, it should not exist.

**`/vs/<slug>`** — 5 pages. Each concedes at least two points to the competitor
before making our case, and each links to `/pricing` and `/demo`.

**`/features/<slug>`** — 8 pages, one per major capability.

## Internal linking rules (enforced by `scripts/audit.ts`)

- Every page links to **at least 3** other pages with descriptive anchors — never "click here" or a bare arrow.
- Every feature page links up to `/` and across to at least one industry page and one resource.
- Every resource links to at least one feature page and one commercial page.
- `/` links to every top-level section.
- No orphan pages: every route in the manifest is reachable from `/` within two clicks.

## Technical

- Metadata API per route; unique title, description, canonical, OG image.
- `en-IN` primary locale with an `x-default` global fallback.
- JSON-LD from typed builders in `lib/schema.ts` — never hand-written strings.
- `app/sitemap.ts` and `app/robots.ts` generated from `lib/routes.ts`, so a new page cannot be missing from the sitemap.
- `next/og` dynamic OG image per route using the brand system.
- Semantic HTML: exactly one `h1`, logical heading order, real `<table>` for comparisons, descriptive `alt` on every meaningful image.
- `public/llms.txt` — a plain description of the product for AI search, which is increasingly where a buyer asks first.
- Conversion events: `quote_submit`, `demo_interaction`, `calculator_use`, `whatsapp_click`.

## Measurement

GA4 + Search Console + Vercel Speed Insights are **wired but not activated** in
this build — see `DECISIONS.md` D-008. Set the env vars at deploy time and the
scripts mount themselves.
