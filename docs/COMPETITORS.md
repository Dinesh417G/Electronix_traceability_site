# COMPETITORS

Phase 2. Researched 2026-09-11 from search surface only. **Re-verified 2026-09-16
by direct fetch and by running Lighthouse against the live pages** — the
constraint that produced the `[unverified]` marks was the build environment's
egress proxy, and it no longer applies.

## Method and its limit — read this first

Every competitor domain named below was fetched directly on 2026-09-16, and the
page structure, titles, headings and CTA labels here are transcribed from the
markup rather than inferred from search results. Page speed is measured, not
claimed: Lighthouse 13.4.1, mobile preset, one run per homepage.

Two of the nine could not be reached from an ordinary connection: `genefied.in`
and `perteck.com` both timed out on the TLS handshake after 21s, twice. That is
their availability, not a proxy, but one run is not an outage — treat those two
entries as still search-surface only.

What is still **not** verified, and should not be treated as fact: Gartner star
ratings and review counts in Segment B (taken from search surface; Gartner Peer
Insights gates the pages), the $50,000+ enterprise price point, and the claim
that Aeologic's listicle ranks — SERP position was not re-checked, only the site.

### Measured homepage performance, 2026-09-16

| Site | Perf | FCP | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|---|
| **ElectronIx Trace** (`/`) | **97–98** | 1.5–1.7s | **2.0–2.4s** | 10–30ms | **0** | ~0.3 MB |
| Ciphercode | 68 | 3.3s | 6.5s | 20ms | 0 | 0.6 MB |
| ETCodeTech | 66 | 2.7s | 7.3s | 20ms | 0.081 | 1.0 MB |
| Bar Code India | 65 | 2.5s | 3.9s | 410ms | 0.024 | 15.4 MB |
| GEIPL | 57 | 8.7s | 32.9s | 50ms | 0 | 5.7 MB |
| Aeologic | 56 | 7.2s | 29.0s | 80ms | 0 | 15.6 MB |

GEIPL and Aeologic are not slow in the ordinary sense — they are WordPress
builds shipping 5.7 MB and 15.6 MB of images and scripts to a phone. A plant head
opening either on 4G in Coimbatore waits half a minute for the hero.

**This is measurement, not a claim we can put on the site.** It is one run, on one
connection, on one day, and competitor page speed is exactly the kind of number
that goes stale and looks like a smear. It belongs here, where it informs what we
build, not on `/compare`.

---

## Segment A — Indian AIDC / traceability integrators

These are who we actually lose deals to. They are systems integrators who sell a
barcode/QR/RFID project, not a product.

### GEIPL

- **Positioning:** verified. `/solutions/product-traceability/` carries the title *"Comprehensive Barcode Traceability India Solutions"*; the homepage sells the wider AIDC catalogue — *"Increase Productivity & Profits With Advanced Barcode, RFID & Mobile Computing Technologies!"*
- **Homepage section order** (verified): industry tiles — Manufacturing, Logistics, Retail, Healthcare, BFSI → "Auto-ID Solutions. Standards-driven, Custom Built." → testimonials ("What our customers say") → an FAQ block of nine questions.
- **Proof used:** testimonials and an FAQ. **Certification, and its scope, is the notable one:** their own FAQ states ISO 9001:2015 and ISO 14001:2015 for the *Gurgaon manufacturing facility*, "for manufacturing of specialty labels, tags & printing ribbons, and supply & support of barcode/RFID systems." That is a label factory's certification, not a software quality claim — worth knowing precisely, because it is the shape of ISO claim a buyer will wave at us, and it does not cover traceability software either.
- **Pricing:** not shown. Enquiry-led. Verified.
- **Primary CTA:** "Learn more" into solution pages; enquiry form via the contact route. The traceability page itself has **no CTA of its own** — one `h1` ("Product Traceability"), one `h2`, and no next step.
- **Keywords:** *barcode traceability India*, *product traceability solutions*, *RFID traceability*.
- **Does badly:** capability described at the level of the technology (barcode, RFID) rather than the plant outcome. Nothing about what happens at a station, what is captured, or what a recall actually costs in time. And the page that ranks for the money keyword is two headings deep with nowhere to go — mobile LCP 32.9s on a 5.7 MB homepage.

### ETCodeTech (Pune)

- **Positioning:** "Material Traceability Solutions India" — customised QR/barcode/RFID traceability software development.
- **Proof used:** geography and service breadth (Pune, Mumbai, India). Custom-development framing.
- **Pricing:** not shown.
- **Primary CTA:** verified — "Get Started" and "Explore More" in the hero, closing with "Embark On Your Automation Journey — Contact ETCodeTech Today".
- **Section order** (verified): hero *"Smart AIDC & Traceability Solutions for a Brighter Future."* → five capability blocks (Barcode Systems, QR Code, RFID, Material Traceability, Industrial Automation) → industries → "Why Choose ETCodeTech Systems?" (Customised Solutions / Integration Support / Complete Solutions) → contact band.
- **Keywords:** *QR code traceability solutions India*, *barcode QR code software Pune*, *material traceability*. Their own meta description keyword-stuffs SAP integration, WMS inventory and Zebra printers into one line.
- **Does badly:** sells bespoke development. That means every buyer is funding a from-scratch project, with the schedule and risk that implies, and no product roadmap behind it.

### EduTech (Pune)

- **Positioning:** "QR Code Traceability Solutions India" / "Traceability Software & Solutions India". Broad AIDC catalogue — barcode solutions across many industries.
- **Proof used:** industry-list breadth.
- **Pricing:** not shown.
- **Keywords:** *QR code traceability*, *barcode solutions for industries*.
- **Not re-verified:** no domain was identified for this vendor on 2026-09-16, so this entry is still search-surface only.
- **Does badly:** horizontal catalogue. Traceability sits beside label printers and asset tags, so nothing on the page speaks to a line engineer.

### Bar Code India (BCI)

Named **Bar Code India**, trading as BCI, at `barcodeindia.com`. The 2026-09-11
entry had the positioning roughly right and the name loose.

- **Positioning:** verified and larger than recorded — *"Driving Global Manufacturing And Supply Chain Operations"*, now with an AI frame: "From the devices that generate your data to the software that runs your floor to the AI that turns it all into decisions."
- **Section order** (verified): hero → the devices/software/AI line → "How BCI is Powering the Future of Intelligent Supply Chains" → solutions → **client logo wall** → technologies → industries → **case studies** → partners → news → blogs.
- **Proof used:** named clients and case studies, at volume. This is the one Segment A competitor whose proof we cannot answer in kind, and pretending otherwise on `/compare` would be a lie the visitor can check in one click.
- **Keywords:** *track and trace system*, *serialisation*, *aggregation*.
- **Does badly:** serialisation/aggregation is a packaging-hierarchy problem — it does not address per-fastener process values on an assembly line. And the homepage ships 15.4 MB with 410ms of blocking script, the worst TBT measured in this set.

### Perteck, Aeologic, Ciphercode, Genefied, Onspot

- **Positioning:** traceability software *development services* (Perteck); consulting/blog-led authority play (Aeologic); QR authentication and anti-counterfeit (Ciphercode, Genefied).
- **Aeologic has repositioned** since the September 11 reading, and the "blog-led consultancy" description is now out of date. The live site sells a productised framework: *"Enterprise automation from sensor to strategy"*, an eight-layer model ("One signal, eight layers, zero handoffs"), fifteen industries, and CTAs that are **"Book an AAF Workshop"** and **"Download framework PDF"** rather than a contact form. Whether the listicle still ranks was not re-checked.
- **Ciphercode now serves from `ciphercode.ai`** (`.co` redirects). Positioning verified and sharpened: *"Give Every Product a Verifiable Digital Identity"* — authenticity, distribution visibility, consumer engagement, and a "Trusted By Most Innovative Brands" logo wall. Its SEO is the best-executed in this set (Lighthouse SEO 100).
- **`genefied.in` and `perteck.com` did not respond** on 2026-09-16 (TLS timeout, twice). Their entries here remain search-surface only.
- **Note:** Ciphercode and Genefied are solving **brand protection / consumer authentication**, not manufacturing genealogy. They compete for the keyword, not for the deal. The Ciphercode page confirms this directly: its traceability block is about compliance and distribution, not about what a station captured.
- **Aeologic's listicle ranking is itself the lesson:** the highest-intent Indian traceability queries are currently answered by a vendor's own listicle, not by a product page. That gap is ours to take.

## Segment B — global MES suites

What buyers compare us to on capability, and what sets their expectations.

| Vendor | Positioning | Proof | Pricing | Notes |
|---|---|---|---|---|
| **Siemens Opcenter Execution** | Forward and backward traceability of components within each end product | Gartner Peer Insights 4.4★ (100 reviews); named references in pharma GxP, semiconductor wafer genealogy, aerospace serialisation, automotive Tier-1 | **Not published.** Quote-based subscription, per-user or per-module, plus implementation | The capability benchmark. Also the cost benchmark that prices out an MSME |
| **Sepasoft MES** (Ignition module) | Traceability module on the Ignition platform | Gartner 4.4★ (28 reviews) | Module licence + Ignition platform | Requires Ignition and an integrator |
| **iTAC Software** | Traditional on-premise MES | Gartner 4.6★ (39 reviews) — highest rated of the three | Not published | Strong in electronics/automotive |
| **DELMIAWorks (IQMS)** | Track & trace inside an ERP/MES suite | Vendor case studies | Not published | Traceability is a module of a much bigger commitment |
| **Critical Manufacturing, Tulip, Optel** | Industry 4.0 platform / no-code apps / supply-chain traceability respectively | Analyst coverage, customer logos | Not published | Tulip's no-code framing is the closest thing to our "config not code" message, at a very different price |

**Market context that matters for our copy:** enterprise IATF 16949 software is
reported to start around **$50,000+ annually** scaling with users, modules and
deployment. India has one of the world's largest IATF 16949-certified supplier
bases, clustered in **Pune-Chakan-Aurangabad, Chennai-Oragadam and
Gurgaon-Manesar** — with Coimbatore a major precision-engineering cluster of its
own. Those buyers are contractually required to produce traceability records and
are systematically priced out of the suites that do it well.

---

## Content gap table

| Topic | Indian integrators | Global suites | Us |
|---|---|---|---|
| What is actually captured at a station (torque, grease, test values) | Rarely named | Named, buried in datasheets | **Own it** — show the values |
| A working, scannable live record on the marketing page | No | No | **Nobody does this. Own it** |
| Recall scope, calculated interactively | No | Case studies only | **Own it** |
| Behaviour when the network dies | Silent | Assumes uptime | **Own it** |
| What happens when the subscription lapses | Silent | Silent | **Own it — nobody else will say this out loud** |
| Tamper-evidence of the record itself | Silent | Implied by validation | **Own it** — hash chain, plainly explained |
| Deployment timeline, honestly | "Custom" | Months to years | **Own it** |
| Price transparency | None | None | Concede: quote-based, but explain what drives it |
| Certifications | Some claim ISO | IATF/GxP validated | **Concede — we have none** |
| ERP connector breadth | ERP integration is their headline | Deep | **Concede — we have none** |
| Global support footprint | Regional | Global | **Concede — one engineer** |
| Reference customers | Some | Many | **Concede — none for Trace** |

## Ten things we can beat them on

Each is evidence-backed against `PRODUCT-FACTS.md`.

1. **Offline-first is structural, not a feature.** Durable spool before any network attempt, torn-line tolerant, idempotent replay (`trace-station/src/spool.rs`). Cloud suites assume uptime an Indian plant cannot promise.
2. **A licence problem can never stop your line.** `Enforcement` is a closed enum with no `Stopped` variant, deliberately (`trace-license/src/lib.rs`). No competitor states this, and every buyer who has been locked out of software fears it.
3. **The recall query is indexed, not a report job.** `genealogy_lot_idx`, `measurement_device_time_idx`, and a second forward-trace axis — by machine and time window — that integrators do not offer at all.
4. **Per-fastener process values, not scan events.** DCPs with min/max/nominal, sample rules and mandatory flags as rows. Integrators capture *that a part was scanned*; we capture *what was done to it*.
5. **Tamper-evident by construction.** Per-unit hash chain across both evidence tables, append-only enforced by database triggers, verifiable (`verify_unit_chain`).
6. **The raw device payload is kept verbatim.** Settles a disputed reading years later. Nobody else mentions this.
7. **Your label template, versioned with effective dates.** Loaded as-is, and native ZPL II to TCP 9100 with no OS print driver — so a printer swap never touches an operator terminal.
8. **Controlled reprint enforced in the database.** Reason code and authoriser are a CHECK constraint, not a policy document.
9. **Updates that cannot cost a shift.** Signature verified before download, SHA-256 per artifact, atomic symlink swap, automatic rollback on a failed health probe, identical verification on the USB path.
10. **Config over code, provable before commissioning.** Route is a validated DAG; `route-sim` and `device-sim` dry-run the whole line with no hardware. An integrator cannot show you your line working before they build it.

## Honest weakness list — must appear on the comparison page

Conceding these is what makes the ten above believable.

1. **No certifications.** No ISO 9001, IATF 16949, FDA or 21 CFR Part 11. The suites have them; we do not. We are built to survive an audit, not certified.
2. **No ERP connectors.** Opcenter and DELMIAWorks plug into SAP and Oracle. We have a column called `external_ref` and a documented seam. That is not the same thing.
3. **No reference customers for Trace.** Zero production installations evidenced. ElectronIx DNC is a different product.
4. **One engineer, one time zone.** No 24/7 desk, no global partner network. That is a real limitation and also a real advantage — name both.
5. **No hosted multi-plant service yet.** The schema is multi-tenant from migration 001; `trace-cloud` is a stub.
6. **Breadth.** Opcenter does scheduling, OEE, GxP batch records, wafer genealogy. We do traceability, on purpose.
7. **Terminal hardware not yet selected** (`HARDWARE-PROFILE.md`), so the operator UI is specified but not validated on a device.

## What to steal (structure only, never copy or assets)

- The suites' **forward/backward trace** vocabulary — buyers already know those two words; use them and then out-specify them.
- The listicle players' **keyword coverage**, answered by a real product page instead of a ranked list.
- Gartner-style **honest comparison tables**. A table that concedes is more persuasive than a table that sweeps.
