# COMPETITORS

Phase 2. Researched 2026-09-11.

## Method and its limit — read this first

The build environment's egress proxy **blocked direct page fetches** to every
competitor domain (`geipl.com`, `etcodetech.com`, and others returned
`EGRESS_BLOCKED`). Search-surface evidence was available and is what this analysis
rests on: search result titles, meta descriptions, indexed page copy and
third-party review aggregators.

**What that means in practice:** positioning lines, claimed capabilities, target
keywords and proof types below are well evidenced. **Page section order, page
speed and exact CTA wording are not directly verified** and are marked
`[unverified]` wherever they appear. Re-run this analysis from an unrestricted
network before treating the section-order column as fact.

---

## Segment A — Indian AIDC / traceability integrators

These are who we actually lose deals to. They are systems integrators who sell a
barcode/QR/RFID project, not a product.

### GEIPL

- **Positioning:** "Comprehensive Barcode Traceability India Solutions." Barcode + QR + RFID assigned as unique product identity, integrated into ERP and supply chain.
- **Proof used:** industry breadth and ERP integration claims. No public pricing, no measured outcomes surfaced.
- **Pricing:** not shown. Enquiry-led.
- **Primary CTA:** contact / enquiry form `[unverified]`.
- **Keywords:** *barcode traceability India*, *product traceability solutions*, *RFID traceability*.
- **Does badly:** capability described at the level of the technology (barcode, RFID) rather than the plant outcome. Nothing about what happens at a station, what is captured, or what a recall actually costs in time.

### ETCodeTech (Pune)

- **Positioning:** "Material Traceability Solutions India" — customised QR/barcode/RFID traceability software development.
- **Proof used:** geography and service breadth (Pune, Mumbai, India). Custom-development framing.
- **Pricing:** not shown.
- **Primary CTA:** enquiry `[unverified]`.
- **Keywords:** *QR code traceability solutions India*, *barcode QR code software Pune*, *material traceability*.
- **Does badly:** sells bespoke development. That means every buyer is funding a from-scratch project, with the schedule and risk that implies, and no product roadmap behind it.

### EduTech (Pune)

- **Positioning:** "QR Code Traceability Solutions India" / "Traceability Software & Solutions India". Broad AIDC catalogue — barcode solutions across many industries.
- **Proof used:** industry-list breadth.
- **Pricing:** not shown.
- **Keywords:** *QR code traceability*, *barcode solutions for industries*.
- **Does badly:** horizontal catalogue. Traceability sits beside label printers and asset tags, so nothing on the page speaks to a line engineer.

### Barcode India

- **Positioning:** track & trace for industrial manufacturing — serialisation, aggregation, real-time visibility.
- **Proof used:** enterprise-flavoured vocabulary (serialisation, aggregation) aimed at pharma/FMCG supply chain rather than discrete assembly.
- **Keywords:** *track and trace system*, *serialisation*, *aggregation*.
- **Does badly:** serialisation/aggregation is a packaging-hierarchy problem. It does not address per-fastener process values on an assembly line.

### Perteck, Aeologic, Ciphercode, Genefied, Onspot

- **Positioning:** traceability software *development services* (Perteck); consulting/blog-led authority play (Aeologic, which ranks on "Top 10 Traceability Companies in India"); QR authentication and anti-counterfeit (Ciphercode, Genefied).
- **Note:** Ciphercode and Genefied are solving **brand protection / consumer authentication**, not manufacturing genealogy. They compete for the keyword, not for the deal.
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
