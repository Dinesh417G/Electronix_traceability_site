export type Industry = {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  lede: string;
  /** The specific thing that goes wrong in this industry without traceability. */
  scenario: string;
  capturePoints: { point: string; detail: string }[];
  routeExample: string[];
  faq: { q: string; a: string }[];
  relatedFeature: string;
};

export const industries: Industry[] = [
  {
    slug: "auto-components",
    name: "Auto components and Tier 1/2",
    title: "Traceability Software for Auto Component Manufacturers",
    description:
      "Per-unit traceability built for Tier 1 and Tier 2 auto component suppliers: torque records, component genealogy, recall scope and an audit-ready record.",
    h1: "Traceability for auto component suppliers",
    lede: "Your OEM customer can ask for the build record of a single part number from eight months ago and expects it the same week. Trace keeps that record per unit, in a form that holds up when it is challenged.",
    scenario:
      "A Tier 1 customer raises a warranty claim on a part you shipped in March. They want the torque records for the four mounting bolts, the lot numbers of the bearings, and the end-of-line test result. Without per-unit capture, the honest answer is a shift log and an apology.",
    capturePoints: [
      { point: "Torque per fastener", detail: "Every bolt, with the limit that applied at that moment and the instrument that read it" },
      { point: "Component lots", detail: "Bearings, seals, castings — lot codes tied to the BOM line they satisfied" },
      { point: "Sub-assembly serials", detail: "Serialised sub-assemblies carry their own history into the parent" },
      { point: "End-of-line test", detail: "Verdict plus the underlying readings, not just a pass stamp" },
      { point: "Operator and certification", detail: "Who built it, and whether they held the skill the operation required" },
    ],
    routeExample: [
      "10 · Mark and verify — identity applied to the raw casting and read back",
      "20 · Sub-assembly — bearing and seal lots scanned against the BOM",
      "30 · Torque — four fasteners captured from the instrument",
      "40 · Leak test — verdict plus pressure readings",
      "50 · Final label and dispatch",
    ],
    faq: [
      {
        q: "Our customer audits us against IATF 16949. Does Trace make us compliant?",
        a: "No software makes you compliant, and treat any vendor who says otherwise with suspicion. Trace gives you the record an auditor asks for: per-unit genealogy, captured process values against defined limits, operator identity, and evidence that records have not been altered since capture. The quality system around it is still yours.",
      },
      {
        q: "We supply the same part to three customers. Can we trace by customer?",
        a: "Yes. Units are tied to a job card, and dispatch is recorded, so a forward trace returns which customers received the affected units rather than only how many units there were.",
      },
    ],
    relatedFeature: "recall-and-forward-trace",
  },
  {
    slug: "pumps-and-valves",
    name: "Pumps and valves",
    title: "Traceability for Pump and Valve Manufacturers",
    description:
      "Capture torque, grease, pressure test and leak test data per unit, with full component genealogy from casting to dispatch.",
    h1: "Traceability for pump and valve assembly",
    lede: "A pump that leaks in the field is traced back to one gasket lot or one under-torqued flange. Trace keeps the values that tell you which, per unit.",
    scenario:
      "Field failures start arriving from one region. The common factor turns out to be a gasket lot that was fine on paper. You need every unit that used it — and just as importantly, proof of which units did not.",
    capturePoints: [
      { point: "Flange torque", detail: "Per fastener, against the window for that revision" },
      { point: "Grease applied", detail: "A boolean capture point is still a capture point, and it is the one that gets skipped" },
      { point: "Gasket and seal lots", detail: "Lot codes at the operation they were fitted" },
      { point: "Hydro / pressure test", detail: "Reading, hold time and verdict" },
      { point: "Leak test", detail: "Measured rate against the limit, not a pass sticker" },
    ],
    routeExample: [
      "10 · Body identification — mark applied and verified on the casting",
      "20 · Seat and seal assembly — lots scanned against the BOM",
      "30 · Flange torque — captured per fastener",
      "40 · Grease and cover — boolean confirmation recorded",
      "50 · Hydro test — pressure and hold time captured",
      "60 · Label and dispatch",
    ],
    faq: [
      {
        q: "Half our stations have no instrument. Does that break the record?",
        a: "No. A manual station captures the same points against the same limits with the same audit fields — only the source flag differs. Plants are never uniformly instrumented, and the manual half is exactly where data normally goes missing.",
      },
      {
        q: "We assemble in batches, not on a moving line. Does that work?",
        a: "Yes. A route is a graph of operations, not a conveyor. Batch assembly, cell assembly and line assembly are all just different route shapes and station configurations.",
      },
    ],
    relatedFeature: "process-data-capture",
  },
  {
    slug: "switchgear-and-electricals",
    name: "Switchgear and electricals",
    title: "Traceability for Switchgear and Electrical Panel Manufacturing",
    description:
      "Component genealogy, electrical test results and per-unit build records for switchgear, panels and electrical assemblies.",
    h1: "Traceability for switchgear and electrical assembly",
    lede: "Electrical assemblies fail on components you did not make. When a contactor batch turns out to be bad, the question is which panels have it inside them.",
    scenario:
      "A component supplier issues a field notice on a contactor date code. You have shipped four hundred panels this quarter. Which ones contain it, and which customers have them?",
    capturePoints: [
      { point: "Component serials and date codes", detail: "Contactors, relays, breakers — serialised or lot tracked as appropriate" },
      { point: "Wiring and continuity checks", detail: "Captured as test results with the underlying readings" },
      { point: "Insulation resistance and hipot", detail: "Measured values against limits, with the instrument identified" },
      { point: "Terminal torque", detail: "The one that causes field failures nobody can explain later" },
      { point: "Functional test", detail: "Verdict tied to the operation and operator" },
    ],
    routeExample: [
      "10 · Enclosure identification and label",
      "20 · Component mounting — serials and date codes scanned",
      "30 · Wiring — terminal torque captured",
      "40 · Continuity and insulation resistance",
      "50 · Functional test — verdict and readings",
      "60 · Final inspection and dispatch",
    ],
    faq: [
      {
        q: "Our panels are configured per order. Every unit is different.",
        a: "That is a route and BOM per product revision, which is how Trace is modelled anyway. A configured-to-order panel gets its own revision, its own BOM and its own route, and the genealogy records what actually went in.",
      },
      {
        q: "Can we trace components a customer supplied to us?",
        a: "Yes. A free-issue component is a BOM line like any other; scan its lot or serial at the operation that consumes it.",
      },
    ],
    relatedFeature: "part-genealogy",
  },
  {
    slug: "ev-components",
    name: "EV components",
    title: "Traceability for EV Component Manufacturing",
    description:
      "Cell and module genealogy, torque and electrical test capture, and forward trace for EV component manufacturers under OEM traceability mandates.",
    h1: "Traceability for EV component manufacturing",
    lede: "EV programmes arrive with traceability written into the contract. Cell lots, module serials and busbar torque have to be recorded per unit from the first production part.",
    scenario:
      "Your OEM asks for a cell-lot-to-vehicle mapping for a containment action, and they want it in days. A batch record does not answer it; a per-unit genealogy does.",
    capturePoints: [
      { point: "Cell and module lots", detail: "Every cell lot consumed, tied to the module it went into" },
      { point: "Busbar and terminal torque", detail: "Per joint, where a bad joint becomes a thermal event" },
      { point: "Insulation and isolation tests", detail: "Measured values, limits, instrument" },
      { point: "Capacity and EOL test", detail: "Readings retained, not just the verdict" },
      { point: "Serialised sub-assemblies", detail: "Modules carry their own genealogy into the pack" },
    ],
    routeExample: [
      "10 · Module identification — mark applied and read back",
      "20 · Cell loading — cell lots scanned against the BOM",
      "30 · Busbar welding or bolting — torque captured per joint",
      "40 · Isolation test — measured value and verdict",
      "50 · Capacity test — readings retained",
      "60 · Pack assembly — module serials linked into the parent",
    ],
    faq: [
      {
        q: "We need multi-level genealogy: cell to module to pack. Is that supported?",
        a: "Yes. A serialised sub-assembly carries its own complete history, and the parent inherits the tree. The trace page shows depth so you can see how far the record goes.",
      },
      {
        q: "Our OEM requires data retention for years. Where does that data live?",
        a: "On your own edge box, in PostgreSQL, partitioned by month. Retention is your configuration, and nothing is automatically dropped.",
      },
    ],
    relatedFeature: "route-configuration",
  },
  {
    slug: "precision-machining",
    name: "Precision machining and export engineering",
    title: "Traceability for Precision Machining and Export Engineering",
    description:
      "Per-part marking, dimensional capture and machine-linked traceability for precision machining and export engineering shops.",
    h1: "Traceability for precision machining and export work",
    lede: "Export customers ask for material certificates, dimensional records and the machine a part was made on. The parts are often bare metal, so identity has to survive handling, wash and heat.",
    scenario:
      "A CMM check finds a dimension drifting. You need every part that machine cut between the last good check and now — before the container ships.",
    capturePoints: [
      { point: "Material lot and heat number", detail: "Tied to the raw bar or casting at first operation" },
      { point: "Dimensional readings", detail: "Captured from the gauge with the limit that applied" },
      { point: "Machine and tool", detail: "Which machine cut it, which lets you trace by machine and time window" },
      { point: "Surface treatment batch", detail: "Plating or coating batch as a lot link" },
      { point: "Direct part mark", detail: "Data Matrix marked on the raw part, read back before it advances" },
    ],
    routeExample: [
      "10 · Raw part marking — Data Matrix applied and verified",
      "20 · Machining — machine identity and tool recorded",
      "30 · In-process gauge — dimensions captured against limits",
      "40 · Surface treatment — batch recorded as a lot link",
      "50 · Final inspection — dimensional record retained",
    ],
    faq: [
      {
        q: "A printed label will not survive our process. What then?",
        a: "That is exactly what direct part marking is for. A Data Matrix is marked onto the raw part at the first operation and read back before the unit advances, so identity survives wash, heat and handling. Stations downstream need a DPM-capable imager with the right illumination — budget for that at the start rather than discovering it at commissioning.",
      },
      {
        q: "Can we trace which machine made a part?",
        a: "Yes, and you can query it in reverse: give Trace a machine and a time window and it returns every unit that machine touched. That is the query that bounds a containment when a machine drifts.",
      },
    ],
    relatedFeature: "marking-and-labels",
  },
  {
    slug: "general-assembly",
    name: "General assembly",
    title: "Assembly Line Traceability System for Manufacturers",
    description:
      "A traceability system for line and batch assembly: configurable routes, per-station capture, component genealogy and a scannable per-unit record.",
    h1: "Traceability for line and batch assembly",
    lede: "Most plants do not fit a template. Some lines move, some cells batch, some stations have instruments and some have an operator with a spanner. Trace is configured to the line you actually have.",
    scenario:
      "You run three products across two lines with shared stations. A customer complaint arrives naming a serial number. You need that unit's build record without first working out which line it was on that week.",
    capturePoints: [
      { point: "Whatever your process defines", detail: "Capture points are configuration: torque, gap, weight, temperature, a boolean, a scanned code" },
      { point: "Component consumption", detail: "Serialised or lot tracked, per BOM line" },
      { point: "Operator and station", detail: "Every event carries both" },
      { point: "Rework and scrap", detail: "Loops stay visible in the final record rather than being tidied away" },
    ],
    routeExample: [
      "10 · Identify and label",
      "20 · Sub-assembly — components scanned against the BOM",
      "30 · Assembly stations — capture points per operation",
      "40 · Test — sub-assembly and final",
      "50 · Pack and dispatch",
    ],
    faq: [
      {
        q: "Can one terminal run our whole route?",
        a: "Yes. A station serves a set of operations and the route decides what is valid for the unit in front of it. A small line can run an entire route on one terminal, and a busy line can duplicate one operation across several stations for capacity. Neither needs a code change.",
      },
      {
        q: "Can we start with one line?",
        a: "That is the recommended way to start. One line, prove the record, then widen. The schema is multi-plant from the first migration, so growing later is configuration rather than a migration project.",
      },
    ],
    relatedFeature: "offline-first-stations",
  },
];

export const industrySlugs = industries.map((i) => i.slug);

export function industryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
