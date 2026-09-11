# PRODUCT-FACTS

Phase 1 repo intelligence. Source: `github.com/Dinesh417G/Traceability`, read at
commit `f165d6d` on 2026-09-11.

Every row here carries the file path that proves it. **The "State" column is the
important one.** `Built` means the code exists and is tested in the workspace.
`Designed` means the type, seam, schema column or documented design exists but
the implementation does not yet.

> Site-copy policy for this build was set by the product owner: the site presents
> the **designed system**, including `Designed` rows, in present-tense product
> voice. See `DECISIONS.md` D-003. This file remains the factual record so that
> nobody later mistakes the marketing surface for the shipped surface.

---

## 1. Feature inventory

### Route engine and process control

| Feature | State | Proof |
|---|---|---|
| Route is a validated DAG per product revision per line | Built | `crates/trace-core/src/route.rs` `Route::validate` |
| Cycle, dangling-predecessor, self-reference and duplicate-seq detection at load time | Built | `route.rs` `validate()` |
| Parallel branches and optional operations via explicit predecessor edges | Built | `route.rs` `RouteOperation::predecessors`, `Requirement::Optional` |
| A station serves a *set* of operations; the route decides what is valid | Built | `engine.rs` `resolve_operation` |
| 8 gate types (below) evaluated as pure functions | Built | `route.rs:80-130`, `engine.rs` |
| Failure paths: Retry(max_attempts) / Rework(to_operation, invalidates) / Quarantine / Scrap | Built | `route.rs` `FailurePath` |
| Rework loops stay visible in the final trace; invalidated operations must be redone | Built | `rework_order.invalidates INTEGER[]`, migration 0002 |
| Whole route runnable with no hardware, no DB, no PLC | Built | `trace-core` has zero I/O deps; `tools/route-sim` |

**The eight gates** — `crates/trace-core/src/route.rs`:

| Gate | What it enforces |
|---|---|
| `IDENTITY` | A valid unit UID was scanned or read back from the mark |
| `OPERATOR_AUTH` | Operator is logged in and holds the required skill certification |
| `PRECONDITION` | Required predecessor operations are complete |
| `COMPONENT_VERIFY` | Scanned components match expected BOM lines. Poka-yoke: wrong part is a hard stop, not a warning |
| `DATA_CAPTURE` | All mandatory DCPs captured and within configured limits |
| `TEST_PASS` | The named test's verdict is a pass |
| `MARK_VERIFIED` | The applied mark was read back and matches the intended UID |
| `INTERLOCK_OUT` | Output effect: releases an interlock to a PLC/fixture only after every other gate is green |

### Identity

| Feature | State | Proof |
|---|---|---|
| ULID public identity, 26-char Crockford base32, time-sortable | Built | `trace-core/src/id.rs`; `unit_uid_is_ulid` CHECK, migration 0002 |
| Internal keys are BIGINT surrogates, never exposed | Built | `CLAUDE.md` Identity rule; all `id BIGINT GENERATED ALWAYS AS IDENTITY` |
| UID globally unique, not per-tenant, so `/t/{ulid}` resolves with no tenant context | Built | `unit_uid_key UNIQUE (uid)`, migration 0002 |
| A scrapped UID is retired forever and never reissued | Built | `trace.retired_uid` + trigger, migrations 0002/0003 |
| Unit lifecycle states: BORN, MARKED, IN_PROCESS, HELD, QUARANTINED, REWORKING, COMPLETED, SHIPPED, SCRAPPED | Built | `unit.state` CHECK, migration 0002; `UnitState::can_transition_to` |

### Evidence and audit

| Feature | State | Proof |
|---|---|---|
| `unit_event` and `measurement` are append-only, enforced by DB triggers *and* the store crate | Built | `migrations/0003_integrity.sql`; `trace-store/src/lib.rs` |
| Per-unit hash chain (`prev_hash`, `row_hash`, `chain_seq`) spanning both evidence tables | Built | `trace-core/src/hash.rs`; `DECISIONS.md` D-009 |
| Chain verification query | Built | `trace-store/src/query.rs:354` `verify_unit_chain` |
| Every raw device payload stored verbatim beside the parsed value | Built | `measurement.raw_payload`; `trace-devices` `RawSample` |
| Corrections are new rows that supersede old ones, with reason | Built | `measurement.supersedes`, `supersede_reason` |
| Device time (`recorded_at`) *and* server time (`received_at`) on every runtime row | Built | migrations 0002 |
| Clock skew beyond threshold flags the row rather than dropping the data | Built | `clock_skewed BOOLEAN`; `trace-core/src/clock.rs` |
| Monthly range partitioning on the two high-volume tables (~7M rows/plant/year) | Built | migration 0002 partition DDL |

### The two queries the product exists for

| Feature | State | Proof |
|---|---|---|
| **Backward trace** — unit → complete history | Built | `trace-store/src/query.rs:136` `unit_history` |
| **Forward trace by lot** — the recall query | Built | `query.rs:269` `units_affected_by_lot`; index `genealogy_lot_idx` |
| **Forward trace by device and time window** — "which units did this machine touch while it was drifting" | Built | `query.rs:312` `units_measured_by_device`; index `measurement_device_time_idx` |
| Recall is an indexed lookup, never a table scan | Built | partial indexes, migration 0002; perf test noted in `DECISIONS.md` |

### Genealogy

| Feature | State | Proof |
|---|---|---|
| Serialised child units and lot consumption modelled as separate columns, not a JSONB blob, so recall can be indexed | Built | `genealogy_link`, migration 0002 |
| Constraint: exactly one of `child_unit_id` / `lot_no` | Built | `genealogy_one_kind` CHECK |
| A unit cannot be its own component | Built | `genealogy_no_self` CHECK |
| Multi-level backward walk (depth) rendered on the trace page | Built | `apps/trace-edge/src/page.rs` "Components consumed" with Depth column |

### Marking and labels

| Feature | State | Proof |
|---|---|---|
| Native ZPL II generation, no OS print driver, no vendor DLL | Built | `crates/trace-mark/src/zpl.rs` |
| Raw ZPL to TCP 9100; USB and file sinks for sites with no network printer | Built | `trace-mark/src/sink.rs`; `HARDWARE-PROFILE.md` |
| Customer's own label template loaded as versioned JSONB with `effective_from` | Built | `label_template`, `label_template_version`, migration 0001 |
| One binding engine (`{{unit.uid}}`) shared across label, mark and trace page | Built | `trace-mark/src/binding.rs` |
| Every print attempt recorded, successful or not, with outcome and read-back grade | Built | `mark_record`, migration 0002 |
| Reprint requires a reason code **and** an authoriser, enforced by CHECK constraint | Built | `mark_reprint_is_controlled` |
| Base URL encoded in the code stored per record, so year-one labels still resolve in year five | Built | `mark_record.trace_base_url` |
| `MarkerDriver` seam for laser | Built (seam) | `trace-mark/src/marker.rs` |
| **Laser direct part marking (DPM)** | **Designed** | `docs/LASER-DPM-DEFERRED.md`; `DECISIONS.md` D-002. `product_revision.mark_method` (`LASER_DPM/LABEL/BOTH/NONE`) exists from migration 001 |
| TSPL / Godex printers | Designed | feature-gated, not built in v1 (`HARDWARE-PROFILE.md`) |

### Devices and capture

| Driver | State | Proof |
|---|---|---|
| `ManualDriver` — operator keys the value, same validation path, only `source` differs | Built | `trace-devices/src/manual.rs` |
| `TcpLineDriver` — raw ASCII line protocol over TCP | Built | `trace-devices/src/tcp.rs` |
| `SimulatedDriver` — scriptable virtual device for CI and route-sim | Built | `trace-devices/src/simulator.rs` |
| Reconnect with exponential backoff; every read has a deadline; a driver never panics the station | Built | `trace-devices/src/retry.rs` |
| Serial RS232/RS485, Modbus RTU/TCP, OPC UA, Siemens S7, EtherNet/IP, Fanuc FOCAS | **Designed** | declared in `trace-devices/src/lib.rs` driver table, deliberately unbuilt pending hardware |

### Offline behaviour

| Feature | State | Proof |
|---|---|---|
| Station writes every event to durable local storage **before** any network attempt | Built | `apps/trace-station/src/spool.rs` |
| Append-only JSON-lines spool, fsync per write | Built | `spool.rs` |
| Torn final line from a power cut is skipped on load, not allowed to poison the queue | Built | `spool.rs` |
| ULID per record means replay after reconnect is idempotent; edge dedupes | Built | `spool.rs`; `unit_event.id` doubles as idempotency key |
| Nothing in the runtime path blocks on a remote call — including licensing, billing and OTA | Built | `CLAUDE.md` rule 3; `trace-license` local Ed25519 verify |
| Public trace page is a self-contained HTML document, zero CDN references | Built | `apps/trace-edge/src/page.rs` |

### Licensing and billing

| Feature | State | Proof |
|---|---|---|
| Stripe runs in a control plane the factory box never contacts | Built | `crates/trace-billing/src/lib.rs` |
| Ed25519-signed entitlement verified locally in microseconds, no network | Built | `crates/trace-license/src/entitlement.rs`; `crates/trace-sign` |
| **A lapsed subscription never stops production.** `Enforcement` has no `Stopped` variant, deliberately, and is a closed enum so nobody adds one | Built | `trace-license/src/lib.rs`; `Enforcement::{Full,Grace,Restricted}` |
| Enforcement degrades config changes and cloud sync only | Built | `apps/trace-edge/src/routes.rs` `require_config_change` — the single enforcement point |
| Tiers `Starter / Professional / Enterprise`, capped on **station count** (Starter default 3) | Built | `entitlement.rs:44-89` |
| Grace period, default 30 days, configurable | Built | `entitlement.rs`; `DECISIONS.md` Q5 |
| Clock-tamper guard | Built | `trace-license/src/clockguard.rs` |

### OTA updates

| Feature | State | Proof |
|---|---|---|
| Manifest signature verified **before** downloading anything | Built | `trace-updater/src/manifest.rs` |
| Each artifact's SHA-256 checked against the signed manifest | Built | `trace-updater/src/source.rs` |
| Downgrades refused unless the manifest explicitly marks a rollback | Built | `trace-updater/src/manifest.rs` |
| Atomic apply: staging dir, fsync, `rename` symlink swap. Running install never mutated in place | Built | `trace-updater/src/apply.rs` |
| Automatic rollback if the new version fails a health probe within a deadline | Built | `trace-updater/src/health.rs` |
| Offline USB path runs the *identical* verification code — no "trusted because local" shortcut | Built | `trace-updater/src/lib.rs` |

### Multi-tenancy and security

| Feature | State | Proof |
|---|---|---|
| `tenant_id` on every table with RLS from migration 001 | Built | `trace.apply_tenant_rls(...)` on every table |
| Impossible to get a query handle without a tenant: `Store::tenant` opens a tx and `SET LOCAL app.tenant_id` | Built | `trace-store/src/store.rs` |
| Unset tenant denies every row rather than raising — a bug cannot degrade into "returns everything" | Built | `trace-store/src/lib.rs` |
| Integration tests run as a **non-superuser** because superusers bypass RLS and would make isolation tests vacuous | Built | `README.md`; `crates/trace-store/tests` |
| Tenant provisioning is a `SECURITY DEFINER` privileged function | Built | migration 0004; `DECISIONS.md` D-008 |
| `unsafe_code = "forbid"` workspace-wide | Built | `Cargo.toml` workspace lints |
| Dedicated `trace` schema, never `public` | Built | migration 0001 |

### Edge service HTTP surface

`apps/trace-edge/src/routes.rs` — all Built:

| Route | Purpose |
|---|---|
| `GET /t/{code}` | Public trace page for a scanned unit |
| `GET /health` | Liveness |
| `GET /api/license` | Entitlement status |
| `POST /api/units` | Birth a unit |
| `GET /api/units/{uid}` | Full unit history (backward trace) |
| `GET /api/recall/lot/{lot_no}` | Forward trace — the recall query |
| `POST /api/config/products` | Configuration (licence-gated) |
| `POST /api/billing/webhook` | Stripe webhook (control plane) |

Production endpoints are never licence-gated; configuration endpoints are, at exactly one function.

### Hardware-free tooling

| Tool | State | Proof |
|---|---|---|
| `route-sim` — dry-run a full route, gates, interlock, failure paths | Built | `tools/route-sim` |
| `device-sim instrument` — virtual torque wrench, `--bad-every N` | Built | `tools/device-sim` |
| `device-sim printer` — virtual Zebra that prints the ZPL it receives | Built | `tools/device-sim` |

---

## 2. Data model

Hierarchy (names deliberately aligned with ElectronIx MES — `MERGE-NOTES.md`):

```
tenant → plant → line → station
                          └── station_operation → operation_def → data_collection_point
product → product_revision → bom → bom_line
                           └── route → route_operation → route_operation_predecessor
                                         └── gates (JSONB), failure_path (JSONB)
job_card → unit (ULID) ─┬─ unit_event      (append-only, hash chained, partitioned)
                        ├─ measurement     (append-only, hash chained, partitioned)
                        ├─ test_result
                        ├─ genealogy_link  (child_unit_id XOR lot_no)
                        ├─ defect → rework_order / scrap_record
                        └─ mark_record
app_user → user_role → role
         └── user_skill → skill_certification
device, label_template → label_template_version, outbox, retired_uid
```

**Configuration-driven, per `CLAUDE.md` rule 1.** Every limit is a
`data_collection_point` row (`min_value`, `max_value`, `nominal_value`,
`sample_rule` ∈ `EVERY / FIRST_OFF / EVERY_NTH`, `mandatory`, `device_id`), never a
constant. Gates and failure paths are JSONB on `route_operation` so a new gate type
never needs a migration. `device.kind` is TEXT not an enum for the same reason.

BOM lines carry `tracking` ∈ `SERIALISED / LOT_TRACKED / NON_TRACKED`, which is what
decides whether a component contributes a serial or a lot to genealogy.

Guard rails worth naming on the site: `dcp_limits_coherent` (min ≤ max) and
`dcp_sample_n_present` stop an incoherent limit configuration reaching a shift.

## 3. Screens

**Built:** exactly one — the public trace page at `/t/{ulid}`
(`apps/trace-edge/src/page.rs`, 315 lines). Self-contained HTML, no external
stylesheet/font/script, because the first customer's shop floor has no route to a
CDN. Sections: header (model, state, serial, job card), Components consumed
(Depth / Item / Op / When), Measurements (When / Point / Value / Verdict / Source /
Raw device payload), Event history (When / Event / Op / Station / Operator / Hash).

**Designed:** the operator terminal UI. `trace-station` is a headless agent by
deliberate decision (`DECISIONS.md` D-006) — the durability logic lives in a library
so it is testable, and the Tauri 2 touch shell wraps it once terminal hardware is
chosen. `HARDWARE-PROFILE.md` already fixes the UI constraints that follow from
"gloves, no keyboard": ≥12 mm hit targets, badge/PIN login with no password typing,
on-screen numeric pads, **no hover states and no right-click**, high contrast for
poor lighting and scratched screen protectors.

There are no dashboard, Pareto, yield-trend or template-manager screens in the
repo. Anything the site shows for those is a design rendering, not a screenshot of
running software, and must never be captioned as the latter.

## 4. Integrations

- **Printers:** Zebra via raw ZPL II over TCP 9100 (built); USB and file sinks (built); TSPL/Godex (designed).
- **Marking:** label at operation 1 (built); laser DPM via `MarkerDriver` with file-drop atomic-rename contract and Data Matrix (designed — `docs/LASER-DPM-DEFERRED.md`).
- **Scanners:** any 1D/2D imager, USB-HID keyboard-wedge or serial, for printed labels. DPM-capable imager with correct illumination required downstream of op 1 *if* laser is enabled.
- **Machine data:** TCP ASCII line protocol (built), manual entry (built), simulators (built). RS232/RS485, Modbus RTU/TCP, OPC UA, Siemens S7, EtherNet/IP, Fanuc FOCAS (designed).
- **PLC interlock:** `INTERLOCK_OUT` gate emits a release to a device only after all other gates pass (built).
- **Database:** PostgreSQL 16 only. MySQL explicitly rejected — `DECISIONS.md` D-001.
- **Cloud:** `trace-cloud` is a stub; outbox table and ULID idempotency keys exist now so enabling sync later is config, not a rewrite. Phase 6.
- **ERP:** none. `job_card.external_ref` and the `JobCardSource` trait are the seams where MES/ERP will land (`MERGE-NOTES.md`). No Tally, SAP or connector code exists.
- **Billing:** Stripe, control plane only.

## 5. Non-functional

- **Offline:** station survives loss of network, edge and internet. Durable spool first, network second.
- **Performance:** recall is an indexed lookup. Measurement volume budgeted at ~7M rows/plant/year, partitioned monthly.
- **Install footprint:** Rust release profile, `lto = "thin"`, `strip = "debuginfo"`. No runtime, no JVM, no container required.
- **OS:** edge on Debian 12 / Ubuntu 22.04+; station app on Windows 10/11 **or** Linux, with no Windows-only dependency in the runtime path.
- **Edge box minimum:** x86-64 4 cores, 8 GB RAM, 128 GB SSD, 1 GbE plant LAN, **internet not required**. Recommended 8 cores / 16 GB / 512 GB.
- **Security/audit:** RLS, hash chain, append-only triggers, `unsafe_code = "forbid"`, signed entitlements, signed OTA manifests.
- **Clock discipline:** stations sync to edge, edge to NTP or a local source; both device and server time recorded; skew flagged. Battery-backed RTC required — a drifting RTC corrupts traceability in a way that is very hard to detect afterwards.
- **Tests:** 301 across the workspace; clippy clean; integration tests against real Postgres with real migrations as a non-superuser.

## 6. Screenshots / assets

**None.** No PNG, JPG, SVG, ICO or WebP anywhere in the repo. No sample label
template files. Every visual on the website is original work for this build.

Usable real values mined from `tools/route-sim/src/main.rs` (the built-in example
scenario) — these seed the demo dataset:

| Value | Source |
|---|---|
| Product `EX-VLV-2200`, revision `A` | `example_scenario()` scenario name |
| Route: op 10 `label_and_verify`, 20 `assemble`, 30 `torque`, 40 `eol_test` | `operation_defs` |
| Station `ST-01` "Single terminal running the whole route" | `stations` |
| Operator `R.KUMAR` / "R. Kumar", id 7 | `operator` |
| Component part `SCR-M6-20`, BOM line 11 | `component_scans` |
| DCP `final_torque` / "Final torque", Nm, min 10.0 max 14.0 nominal 12.0, `EVERY`, mandatory, device 5 | `dcps` |
| Captured value 12.1 Nm, verdict Pass | `inputs["30"]` |
| Test `EOL`, verdict Pass | `verdicts` |
| Mark read-back grade `B` | `inputs["10"].mark_verification` |
| Example ULID `01JX8P2K7F3QW9ABCDEFGHJKMN` | `example_uid` |
| Serial format `SIM-0000000001` | `unit.serial` |
| Gate failure codes `COMPONENT_VERIFY`, `DATA_CAPTURE`, disposition `BLOCKED` | test assertions |

## 7. Feature → buyer benefit map

| Feature | What it does | What the plant gets | Who cares |
|---|---|---|---|
| Forward trace by lot | Indexed lookup from a lot code to every unit that consumed it | Recall scope in seconds instead of a week of spreadsheets | QA head, Owner |
| Forward trace by device + time | Every unit a machine touched in a window | Contain a drifted machine without scrapping a month | QA head, Maintenance |
| Backward trace | Full birth certificate for a returned unit | Answer a warranty claim with evidence, not apology | QA head, Owner |
| Hash-chained append-only records | Tamper-evident evidence chain per unit | A record that stands up when a customer disputes it | QA head, Owner |
| Raw payload stored verbatim | The exact bytes the device returned | Settle a disputed reading two years later | QA head, Maintenance |
| `COMPONENT_VERIFY` gate | Wrong part is a hard stop | Mis-build never reaches final assembly | Production head, QA |
| DCP limits as configuration | Torque/grease/test limits are rows | Change a limit without a software release | Production head, QA |
| Route as a DAG | Parallel branches, optional ops, rework loops | Your line's real shape, not the software's assumption | Production head |
| Offline spool | Station keeps working with everything down | A switch reboot does not cost a shift of records | Plant head, IT |
| Licence never stops production | No `Stopped` enforcement state | A billing problem can never strand units on the line | Plant head, Owner |
| Native ZPL, no print driver | Labels straight to TCP 9100 | Swap a printer without touching a terminal | IT, Maintenance |
| Controlled reprint | Reason code + authoriser enforced in the database | No uncontrolled duplicate labels in the field | QA head |
| Customer's own template, versioned | Your label, loaded as-is, with effective dates | No relabelling project, and template changes are auditable | QA head, Production |
| Signed OTA + auto rollback | Verify before download, atomic swap, health probe | Updates that cannot cost you a shift | IT, Plant head |
| USB update path | Identical verification, no internet | Updates on an air-gapped shop floor | IT |
| RLS multi-tenancy | `tenant_id` + policies from migration 001 | Multi-plant later without a data migration | Owner, IT |
| Postgres on your own box | On-premise, internet not required | Your data stays in your plant | Owner, IT |
| `route-sim` / `device-sim` | Dry-run the route with no hardware | Validate configuration before commissioning week | Production head, IT |

## 8. Claims blocklist

Never say these — no code supports them, and an industrial buyer will check.

1. **Any certification.** No ISO 9001, IATF 16949, FDA, 21 CFR Part 11, GDPR, SOC 2 or CE claim. The product is *designed to support an audit*; it is not certified, and neither is the company as far as this repo shows.
2. **Customer proof.** No logos, testimonials, case studies, install counts, units-traced counters, star ratings or named references. Nothing in the repo evidences a single production installation of Trace.
3. **The 23-machine DNC deployment.** That is the sibling product, not Trace, and is not evidenced in this repo. If used, it must be described precisely as ElectronIx DNC and never implied to be Trace running in a plant.
4. **Uptime, throughput or latency numbers.** No benchmark exists. "Recall in seconds" is defensible as an indexed-lookup design claim; "sub-100ms across 10M rows" is not.
5. **AI / ML / blockchain / computer vision.** None of it is in the repo. The hash chain is SHA-256, not a blockchain, and calling it one will be caught.
6. **ERP integration.** No SAP, Tally, Oracle, Zoho or generic ERP connector exists. `external_ref` is a column, not an integration.
7. **Cloud multi-plant available today.** `trace-cloud` is a stub. Multi-tenancy is in the schema; the hosted service is not built.
8. **Pricing numbers.** No price is decided. `DECISIONS.md` Q2/Q3/Q4 are open. Quote-based only.
9. **MySQL support.** Explicitly rejected in D-001.
10. **"Certified", "validated" or "proven" hardware.** `HARDWARE-PROFILE.md` states terminal hardware is not yet selected. The edge spec is a *minimum validated spec* for the software, not a certification.
11. **Free trial download.** No installer or trial build exists.
12. **Support SLAs, 24/7 response, or a support team.** One engineer. Say so — it is a stronger claim than a fake team.
