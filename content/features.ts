export type Feature = {
  slug: string;
  name: string;
  /** Nav / card label, shorter than the name. */
  short: string;
  title: string;
  description: string;
  h1: string;
  lede: string;
  /** Who in the plant this lands with. */
  audience: string;
  points: { heading: string; body: string }[];
  /** Machine-data facts rendered in mono. */
  facts: { label: string; value: string }[];
  relatedIndustry: string;
  relatedResource: string;
};

export const features: Feature[] = [
  {
    slug: "recall-and-forward-trace",
    name: "Recall and forward trace",
    short: "Recall",
    title: "Recall Scope in Seconds — Forward Trace by Lot",
    description:
      "Give Trace a component lot code and it returns every finished unit that consumed it, where each one went, and when. An indexed lookup, not an overnight report.",
    h1: "A bad lot arrives. You need the unit list, not a project.",
    lede: "Forward trace answers the only question that matters during a containment: which units are affected, and which are provably clean. Trace answers it from an index, so the answer arrives while the customer is still on the phone.",
    audience: "QA head, plant head, owner",
    points: [
      {
        heading: "Trace by component lot",
        body: "Enter the lot code your supplier flagged. Trace returns every unit that consumed it, with the job card, the operation it was fitted at, the operator, and the dispatch date. Units that never touched the lot are proven clean, which is usually the more valuable half of the answer.",
      },
      {
        heading: "Trace by machine and time window",
        body: "A torque gun drifts out of calibration and you only find out at the weekly check. Ask Trace which units that device measured between 14:00 and 16:00 on Tuesday. Most systems cannot ask this question at all, because they record that a part was scanned rather than which instrument produced the reading.",
      },
      {
        heading: "Indexed, not scanned",
        body: "Genealogy stores serialised children and lot consumption in separate indexed columns rather than one JSON blob. That is a schema decision made specifically so the recall query stays a lookup as the table grows past ten million rows.",
      },
      {
        heading: "Containment window, not just a count",
        body: "The result carries first and last build timestamps for the affected set, so you can bound the containment rather than quarantining a month of production to be safe.",
      },
    ],
    facts: [
      { label: "Query", value: "units_affected_by_lot(lot_no)" },
      { label: "Second axis", value: "units_measured_by_device(device, from, to)" },
      { label: "Index", value: "genealogy_lot_idx (partial)" },
      { label: "Volume budget", value: "~7M measurements / plant / year" },
    ],
    relatedIndustry: "auto-components",
    relatedResource: "planning-a-recall-scope-calculation",
  },
  {
    slug: "process-data-capture",
    name: "Process data capture",
    short: "Data capture",
    title: "Capture Torque, Grease and Test Values Per Unit",
    description:
      "Trace records what was done to each unit, not just that it was scanned. Torque per fastener, grease applied, test readings, with limits held as configuration.",
    h1: "Scanning tells you a part was there. It does not tell you it was built right.",
    lede: "A traceability system that only records scans produces a list of places a unit has been. Trace records the values: every fastener's torque, whether grease went on, what the end-of-line test actually read, and whether each was inside the limit at that moment.",
    audience: "Production head, QA head",
    points: [
      {
        heading: "Every limit is a row, never a constant",
        body: "A data collection point declares its name, unit, datatype, minimum, maximum, nominal, whether it is mandatory, and where the value comes from. Changing a torque window is a configuration change your engineer makes, not a software release you wait for.",
      },
      {
        heading: "Sampling rules that match how you actually work",
        body: "Capture every unit, first-off only, or every nth. First-off inspection is a real practice and the software should not force you to pretend otherwise.",
      },
      {
        heading: "Manual entry is not second class",
        body: "A station with no instrument on it captures the same points against the same limits with the same audit fields. Only the source flag differs. That matters because a real plant is never uniformly instrumented, and the half that is manual is exactly where data usually goes missing.",
      },
      {
        heading: "Incoherent configuration cannot reach a shift",
        body: "A minimum above a maximum, or an every-nth rule with no n, is rejected by the database itself rather than discovered by an operator at 06:00.",
      },
    ],
    facts: [
      { label: "Datatypes", value: "NUMERIC · TEXT · BOOLEAN · BARCODE" },
      { label: "Sample rules", value: "EVERY · FIRST_OFF · EVERY_NTH" },
      { label: "Limits", value: "min · max · nominal" },
      { label: "Source", value: "DEVICE · MANUAL" },
    ],
    relatedIndustry: "pumps-and-valves",
    relatedResource: "capturing-torque-data-from-a-plc",
  },
  {
    slug: "part-genealogy",
    name: "Part genealogy",
    short: "Genealogy",
    title: "Part Genealogy — What Went Into Every Unit",
    description:
      "A multi-level record of every component serial and every material lot consumed by a unit, tied to the operation and operator that fitted it.",
    h1: "The birth certificate for every unit you ship",
    lede: "Genealogy is the structure underneath both trace directions. Walk down from a finished unit to every component inside it, or up from a component to every unit it ended up in.",
    audience: "QA head, owner",
    points: [
      {
        heading: "Serialised children and lot consumption, modelled separately",
        body: "A serialised sub-assembly contributes its own identity and its own history. A material lot contributes a lot code and a quantity. These are different things and Trace stores them as different things, which is what lets both be indexed.",
      },
      {
        heading: "Multi-level, not one level deep",
        body: "A sub-assembly built on your line carries its own genealogy, and the finished unit inherits the whole tree. The trace page shows depth, so an auditor can see how far down the record goes.",
      },
      {
        heading: "Bound to the BOM, checked at the station",
        body: "Each link references the BOM line it satisfies. A component that is not on the BOM for that revision does not get quietly recorded, it gets refused.",
      },
      {
        heading: "Constraints that keep the graph honest",
        body: "Exactly one of serial or lot is populated. A lot link must carry a quantity. A unit can never be its own component. These are database constraints, so no amount of bad input creates a nonsense tree.",
      },
    ],
    facts: [
      { label: "Link kinds", value: "child_unit_id XOR lot_no" },
      { label: "Tracking modes", value: "SERIALISED · LOT_TRACKED · NON_TRACKED" },
      { label: "Bound to", value: "bom_line_id, operation_seq, operator" },
      { label: "Walk", value: "parent → children, child → parents" },
    ],
    relatedIndustry: "switchgear-and-electricals",
    relatedResource: "what-a-part-genealogy-record-must-contain",
  },
  {
    slug: "marking-and-labels",
    name: "Marking and labels",
    short: "Marking",
    title: "Your Label Template, Driven Directly — ZPL and Laser",
    description:
      "Load your existing label design as-is. Trace generates ZPL natively to the printer, drives a laser marker for direct part marking, and records every attempt.",
    h1: "Your label, your format, printed by us",
    lede: "Nobody wants a relabelling project as the price of traceability. Trace loads the template you already use, versions it with an effective date, and drives the printer directly.",
    audience: "QA head, production head, IT",
    points: [
      {
        heading: "Native ZPL to port 9100, no print driver",
        body: "Trace generates ZPL II itself and writes it to the printer over TCP. No OS print subsystem, no vendor DLL, no driver to install on an operator terminal. That is what keeps the station app identical on Windows and Linux, and it means swapping a printer never touches a terminal.",
      },
      {
        heading: "Laser direct part marking",
        body: "For parts that must carry their identity through paint, heat or wash, a Data Matrix is marked straight onto the raw part at the first operation and read back before the unit is allowed to advance. Label and laser share one binding engine, so the identity on the part can never disagree with the identity in the database.",
      },
      {
        heading: "Reprinting is controlled, in the database",
        body: "Two physical objects carrying one identity destroys the record for both. A reprint therefore needs a reason code and an authoriser, enforced as a constraint rather than a policy document, and every attempt is recorded whether it succeeded or not.",
      },
      {
        heading: "Labels printed in year one still resolve in year five",
        body: "The base URL encoded into each code is stored with the record, so you always know exactly what was printed on the part in front of you.",
      },
    ],
    facts: [
      { label: "Printer", value: "Zebra ZPL II over TCP 9100" },
      { label: "Fallback sinks", value: "USB · file" },
      { label: "Mark methods", value: "LASER_DPM · LABEL · BOTH · NONE" },
      { label: "Outcomes", value: "VERIFIED · VERIFY_FAILED · DEVICE_FAULT" },
    ],
    relatedIndustry: "precision-machining",
    relatedResource: "laser-marking-vs-label-printing",
  },
  {
    slug: "offline-first-stations",
    name: "Offline-first stations",
    short: "Offline",
    title: "Stations That Keep Working When the Network Dies",
    description:
      "Every event is written to durable local storage before anything is attempted over the network, and replayed safely when the edge comes back.",
    h1: "The switch reboots. The line does not stop.",
    lede: "A factory station has to keep working with the network, the server and the internet all down. In Trace that is not a resilience feature bolted on afterwards, it is the order the code does things in.",
    audience: "Plant head, IT, production head",
    points: [
      {
        heading: "Local first, network second",
        body: "Every event a station produces is written to durable local storage and flushed to disk before any network call is attempted. If the edge is unreachable the operator sees no difference and the record is not at risk.",
      },
      {
        heading: "A hard power cut costs one event, not the queue",
        body: "The spool is an append-only file with one writer, one JSON record per line. A torn final line from a power cut is skipped on load rather than poisoning everything behind it. Losing the event that was mid-write is unavoidable; losing the other nine hundred is not.",
      },
      {
        heading: "Replay cannot duplicate",
        body: "Every record carries an identifier assigned the moment it was created, and the edge deduplicates on it. A station that dies between sending and being acknowledged does not create a second event when it comes back.",
      },
      {
        heading: "Nothing in the runtime path waits on a remote call",
        body: "Not licensing, not billing, not updates. A factory LAN may have no internet at all, and no part of production is allowed to depend on something outside the building.",
      },
    ],
    facts: [
      { label: "Spool", value: "append-only JSON lines, fsync per write" },
      { label: "Replay", value: "idempotent, deduplicated on event id" },
      { label: "Internet", value: "not required" },
      { label: "Trace page", value: "self-contained HTML, zero CDN calls" },
    ],
    relatedIndustry: "general-assembly",
    relatedResource: "mes-or-standalone-traceability",
  },
  {
    slug: "audit-and-tamper-evidence",
    name: "Audit and tamper evidence",
    short: "Audit trail",
    title: "A Traceability Record That Survives Being Disputed",
    description:
      "Append-only records with a per-unit hash chain, raw device payloads kept verbatim, and corrections that supersede rather than overwrite.",
    h1: "A record is only worth what it is worth under challenge",
    lede: "Any system can store a number. The question an auditor or a customer's lawyer asks is whether that number could have been changed afterwards, and whether you can show it was not.",
    audience: "QA head, owner",
    points: [
      {
        heading: "Append-only, enforced by the database",
        body: "Measurements, events, genealogy links, marks, test results and scrap records cannot be updated or deleted. That is enforced by database triggers as well as by application code, so it holds even for someone with a SQL prompt and a bad idea.",
      },
      {
        heading: "Hash chained per unit",
        body: "Each evidence row carries the hash of the one before it, forming a chain per unit across both evidence tables. Altering a historical row breaks every link after it, and the chain can be verified on demand.",
      },
      {
        heading: "Corrections supersede, they never overwrite",
        body: "When a reading was genuinely wrong, the fix is a new row pointing at the one it replaces, carrying a reason and the operator who made the call. The original stays visible. An auditor seeing corrections handled this way trusts the rest of the record more, not less.",
      },
      {
        heading: "The raw bytes are kept",
        body: "Every device payload is stored verbatim beside the parsed value. When a customer disputes a reading two years later, the answer is what the instrument actually said, not what software decided it meant.",
      },
      {
        heading: "Both clocks, and the skew between them",
        body: "Every row records device time and server time. When they disagree beyond the configured threshold the row is flagged rather than dropped, because a drifting clock on a panel PC corrupts traceability in a way that is very hard to spot afterwards.",
      },
    ],
    facts: [
      { label: "Chain", value: "prev_hash · row_hash · chain_seq" },
      { label: "Digest", value: "SHA-256" },
      { label: "Corrections", value: "supersedes + supersede_reason" },
      { label: "Clocks", value: "recorded_at · received_at · clock_skewed" },
    ],
    relatedIndustry: "auto-components",
    relatedResource: "traceability-requirements-iatf-16949-audit",
  },
  {
    slug: "route-configuration",
    name: "Route configuration",
    short: "Routes",
    title: "Your Line's Real Shape, Configured Not Coded",
    description:
      "Routes are validated graphs with parallel branches, optional operations, rework loops and eight gate types. All configuration, no custom code.",
    h1: "Lines are not straight, and the software should not assume they are",
    lede: "Trace models a route as a graph of operations with explicit dependencies. That is what lets it express a parallel sub-assembly branch, an optional operation and a rework loop without any of it being special-cased for your plant.",
    audience: "Production head, IT",
    points: [
      {
        heading: "Eight gates decide whether a unit may advance",
        body: "Identity scanned, operator certified, predecessors complete, components match the BOM, mandatory values captured and in limit, named test passed, mark read back and verified, and finally the interlock released to the fixture. Each is configuration on the operation, so one list describes what must be true.",
      },
      {
        heading: "The interlock is released last, and only last",
        body: "The signal to the PLC or fixture is emitted only after every other gate on that operation is green. That ordering is the difference between a poka-yoke and a suggestion.",
      },
      {
        heading: "Failures route somewhere specific",
        body: "Retry with a bounded attempt count, rework back to a named operation with the operations it invalidates, quarantine for a supervisor, or scrap. A rework loop forces the voided operations to be performed again and stays visible in the final trace, because an audit that cannot see the loop has not seen the truth.",
      },
      {
        heading: "A bad route is caught at load, not mid-shift",
        body: "Cycles, dangling predecessors, self-references and duplicate sequence numbers are rejected when the route is loaded. The failure you never want is a configuration error surfacing with a part already in the fixture.",
      },
      {
        heading: "Dry-run it before the hardware arrives",
        body: "A route simulator pushes a unit through the whole route with no plant, no PLC and no printer, and a device simulator plays a torque wrench that fails every fifth part. You can validate the configuration before commissioning week rather than during it.",
      },
    ],
    facts: [
      { label: "Gates", value: "IDENTITY · OPERATOR_AUTH · PRECONDITION · COMPONENT_VERIFY" },
      { label: "", value: "DATA_CAPTURE · TEST_PASS · MARK_VERIFIED · INTERLOCK_OUT" },
      { label: "Failure paths", value: "RETRY · REWORK · QUARANTINE · SCRAP" },
      { label: "Validated for", value: "cycles · dangling predecessors · duplicates" },
    ],
    relatedIndustry: "ev-components",
    relatedResource: "mes-or-standalone-traceability",
  },
  {
    slug: "deployment-and-updates",
    name: "Deployment and updates",
    short: "Deployment",
    title: "On-Premise Deployment and Updates That Cannot Cost a Shift",
    description:
      "One edge box per plant running PostgreSQL on your own hardware, with signed over-the-air updates that verify before downloading and roll back automatically.",
    h1: "Your data stays in your plant, and updates cannot strand you",
    lede: "The box being updated is running a production line. An update that half applies, or boots into something broken with no way back, does not cost a reboot. It costs a shift.",
    audience: "IT, plant head, owner",
    points: [
      {
        heading: "One edge box per plant, internet optional",
        body: "PostgreSQL on hardware you own, on your LAN. No cloud dependency in the runtime path, no per-seat tax, and your traceability data never leaves the building unless you decide it should.",
      },
      {
        heading: "Verified before a single byte is downloaded",
        body: "The update manifest's signature is checked first. An attacker who can serve bytes should not even be able to make the box spend bandwidth, let alone unpack their payload. Every artifact is then checked against the digest named in that signed manifest.",
      },
      {
        heading: "Atomic apply, automatic rollback",
        body: "Unpack into staging, flush to disk, then swap a symlink. The running install is never modified in place, so power loss mid-update leaves the old version intact. If the new version fails its health probe inside the deadline, the box rolls itself back and the previous release is kept until the new one is confirmed healthy.",
      },
      {
        heading: "Downgrades are refused unless explicitly a rollback",
        body: "A manifest signed last year is still perfectly signed. Replaying it must not walk a box backwards into a known problem.",
      },
      {
        heading: "The USB path runs identical code",
        body: "Plenty of shop floors have no internet. The same signed bundle can arrive on a USB stick and goes through exactly the same verification, with no shortcut for being on local media. A USB stick found in a car park is not a trusted source.",
      },
    ],
    facts: [
      { label: "Edge minimum", value: "x86-64 · 4 cores · 8 GB · 128 GB SSD" },
      { label: "Recommended", value: "8 cores · 16 GB · 512 GB SSD" },
      { label: "OS", value: "Debian 12 / Ubuntu 22.04+" },
      { label: "Station OS", value: "Windows 10/11 or Linux" },
      { label: "Database", value: "PostgreSQL 16" },
    ],
    relatedIndustry: "general-assembly",
    relatedResource: "mes-or-standalone-traceability",
  },
];

export const featureSlugs = features.map((f) => f.slug);

export function featureBySlug(slug: string): Feature | undefined {
  return features.find((f) => f.slug === slug);
}
