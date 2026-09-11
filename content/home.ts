/** Copy blocks for the home page and shared sections. */

export const scenarios = [
  {
    title: "The OEM asks for March",
    body: "Your customer's quality team wants torque records for a part number you shipped in March. You have a shift log and a stamped inspection sheet. Neither is per unit.",
  },
  {
    title: "A unit comes back failed",
    body: "One returned unit, one serial number. Which bearing lot was in it, what did it measure at end of line, and who built it? The answer decides whether this is one unit or a batch.",
  },
  {
    title: "A supplier lot is bad",
    body: "Your supplier calls about a gasket lot. You built four hundred units that week. Without per-unit consumption records, all four hundred are contained, including the ones that never touched the lot.",
  },
  {
    title: "A warranty claim with no build record",
    body: "Eighteen months on, a claim arrives. You cannot show what the unit measured when it left, so you cannot argue it left in spec. The claim is settled on their terms.",
  },
] as const;

export const stages = [
  {
    seq: "10",
    name: "Job card issued",
    plain: "A job card names the product, the revision and the quantity.",
    captured: ["Job card number", "Product and revision", "Quantity and due date"],
    detail:
      "The unit is born against the job card and gets its identity — a 26-character code that sorts by time and is never reused, even if the unit is later scrapped.",
  },
  {
    seq: "20",
    name: "Components issued against the BOM",
    plain: "Sub-components are drawn from store and scanned against the bill of materials.",
    captured: ["Component lot codes", "Serialised sub-assembly identities", "BOM line satisfied", "Operator"],
    detail:
      "A component that is not on the BOM for that revision is refused, not warned about. A wrong part at this station is a hard stop.",
  },
  {
    seq: "30",
    name: "Assembly stations capture process data",
    plain: "Each operation captures what it is configured to capture.",
    captured: ["Torque per fastener", "Grease applied", "Instrument that read it", "Both timestamps"],
    detail:
      "Values are checked against the limits configured for that point at that moment. A value outside the window blocks the unit and routes it down the failure path the operation defines.",
  },
  {
    seq: "40",
    name: "Test, sub-assembly and final",
    plain: "Tests record their readings, not just a verdict.",
    captured: ["Test name and verdict", "Underlying readings", "Raw device payload", "Station and operator"],
    detail:
      "The test gate holds the unit until the named test passes. A pass with no readings behind it is a stamp, and a stamp is not evidence.",
  },
  {
    seq: "50",
    name: "Mark and label",
    plain: "Identity is applied to the part and read back.",
    captured: ["Template version used", "Read-back and grade", "Reprints with reason and authoriser"],
    detail:
      "Your own label template, loaded as-is and versioned with an effective date. A direct part mark for parts that go through wash, paint or heat. Both from one binding, so the part and the record cannot disagree.",
  },
  {
    seq: "60",
    name: "Scan anywhere, get everything",
    plain: "The code on the product returns that unit's complete history.",
    captured: ["Full genealogy tree", "Every measurement with its limits", "Event history with hash chain"],
    detail:
      "The page works on a phone, on the plant LAN, with no internet. It is a self-contained document with nothing loaded from outside, because the first shop floor it ran on had no route to the internet.",
  },
] as const;

export const roles = [
  {
    role: "Quality head",
    lines: [
      "Answer an OEM audit from the record instead of from memory.",
      "Bound a containment in minutes, and prove which units are clean.",
    ],
  },
  {
    role: "Production head",
    lines: [
      "See which operation is blocking units and why, by gate.",
      "Change a torque window or a sampling rule without waiting for a software release.",
    ],
  },
  {
    role: "Plant head",
    lines: [
      "A network failure costs you nothing: stations keep capturing and catch up later.",
      "Start on one line and widen when it has earned it.",
    ],
  },
  {
    role: "Owner",
    lines: [
      "Meet the traceability clause in a customer contract without an enterprise MES budget.",
      "Your production data stays on your hardware, in your plant.",
    ],
  },
  {
    role: "Maintenance and IT",
    lines: [
      "One service, one PostgreSQL database, no cloud dependency in the runtime path.",
      "Updates verify before downloading, apply atomically and roll themselves back if unhealthy.",
    ],
  },
] as const;

export const hardware = [
  {
    group: "Machine and instrument data",
    items: [
      "RS232 and RS485 serial, including multidrop instrument segments",
      "Ethernet, TCP line protocols and Modbus TCP",
      "PLC and HMI capture, with an interlock released back to the fixture",
      "Manual stations capturing the same points against the same limits",
    ],
  },
  {
    group: "Marking and identity",
    items: [
      "Zebra printers driven as raw ZPL II over TCP 9100 — no OS print driver",
      "USB and file sinks for sites with no network printer",
      "Laser direct part marking with Data Matrix and mark read-back",
      "Handheld and fixed imagers; DPM-capable imagers where parts are directly marked",
    ],
  },
  {
    group: "Platform",
    items: [
      "PostgreSQL 16 on an edge box you own, one per plant",
      "Debian 12 or Ubuntu 22.04+ on the edge; Windows or Linux on stations",
      "Signed over-the-air updates, with an identical offline USB path",
      "Multi-plant ready: tenant isolation is in the schema from the first migration",
    ],
  },
] as const;

export const rollout = [
  {
    phase: "Week 0",
    title: "Walkthrough and configuration",
    body: "We walk your line, list the operations, the capture points and their limits, and collect your label template. Nothing is installed yet.",
    fromYou: "An hour on the floor, your BOM for one product, and your current label file.",
  },
  {
    phase: "Week 1",
    title: "One line, dry run",
    body: "The route is configured and simulated with no hardware attached, so configuration errors surface before the line is involved. The edge box is prepared.",
    fromYou: "A decision on which line goes first, and network access to the printer.",
  },
  {
    phase: "Week 2",
    title: "Live on one line",
    body: "Stations go live at the configured operations. Production downtime for the changeover is close to zero, because capture starts at the next unit rather than requiring a stop.",
    fromYou: "One shift's operators for a short handover, and someone who can authorise a rework.",
  },
  {
    phase: "Week 3 onward",
    title: "Widen, once it has earned it",
    body: "Second line, then plant, then multi-plant if you have more than one site. Each step is configuration, not a new project.",
    fromYou: "A judgement call on whether the first line is actually giving you the record you wanted.",
  },
] as const;

export const faqs = [
  {
    q: "Does it work without internet?",
    a: "Yes, and that is a design constraint rather than a feature. A station writes every event to durable local storage before attempting anything over the network, and replays safely when the edge returns. Nothing in the runtime path waits on a remote call — not licensing, not billing, not updates. A factory LAN with no internet at all is a supported configuration.",
  },
  {
    q: "Do we need new machines?",
    a: "No. Trace reads from what you already have where it can, and captures manually where it cannot. A station with no instrument captures the same points against the same limits with the same audit fields — only the source flag differs. Plants are never uniformly instrumented, and pretending otherwise is how these projects fail.",
  },
  {
    q: "What if our PLC is old?",
    a: "Old is usually fine. Serial, Modbus, a TCP line protocol or a file drop all work, and many older controllers speak one of them. Where a controller genuinely cannot be read, that station captures manually and the record is still complete. We will tell you honestly at the walkthrough which of your machines can be read and which cannot.",
  },
  {
    q: "Can it print our existing label?",
    a: "Yes — that is the intended path. Your template is loaded as-is and versioned with an effective date, so template changes are auditable. Trace generates ZPL natively and writes it to the printer over TCP, with no print driver on the terminal, which is also what lets a printer be swapped without touching an operator station.",
  },
  {
    q: "How long does deployment take?",
    a: "One line, typically two to three weeks from walkthrough to live, with close to zero production downtime at changeover. Widening to more lines is configuration. We would rather you start on one line and judge the record it produces than commit the whole plant on a promise.",
  },
  {
    q: "What does it cost?",
    a: "Quoted per plant, not per seat. Price is driven by the number of stations, how many of them need instrument integration rather than manual capture, and whether you need direct part marking. There is no per-user cloud charge. Ask for a quote and you will get a number, not a discovery process.",
  },
  {
    q: "Can it export to our ERP or Tally?",
    a: "Not today, and we will not claim otherwise. Trace holds the job card reference your ERP already uses, so the join has somewhere to land, but there is no built ERP connector. Data is exportable and the database is yours to query. If ERP posting is essential to your decision, say so early.",
  },
  {
    q: "What happens if the PC dies?",
    a: "A station's spooled events are on its local disk; a replacement station picks up from the edge and no captured record is lost once it has been acknowledged. The edge box holds the database, so that is the machine to back up — and it is an ordinary PostgreSQL backup, on your schedule, to your storage.",
  },
  {
    q: "Who owns the data?",
    a: "You do, on your hardware, in a standard PostgreSQL database you can back up, query and export. There is no hosted service in the runtime path and no clause anywhere that makes your production record dependent on us continuing to exist.",
  },
  {
    q: "What happens if we stop paying?",
    a: "Production capture continues. A lapsed subscription restricts configuration changes and cloud sync — it does not and cannot stop capture, because halting it would destroy the record for units physically on the line, and those units then could not ship at all. There is no state in the software that stops production. Ask any other vendor to put that in writing.",
  },
  {
    q: "Can we start with one line?",
    a: "That is the recommended way in. The schema is multi-plant from the first migration, so growing later is configuration rather than a migration project, and starting small costs you nothing structurally.",
  },
  {
    q: "Is ElectronIx Trace certified to IATF 16949 or ISO 9001?",
    a: "No. Neither the software nor the company holds a certification, and any vendor telling you their software makes you compliant is selling you something. Trace is built to produce the evidence an auditor asks for — per-unit genealogy, captured values against defined limits, operator identity, and proof records have not been altered. The quality system around it stays yours.",
  },
] as const;
