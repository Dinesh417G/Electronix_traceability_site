export type Comparison = {
  slug: string;
  competitor: string;
  category: string;
  title: string;
  description: string;
  h1: string;
  lede: string;
  /** Stated first, deliberately. Conceding buys belief for everything after. */
  theyWin: { point: string; detail: string }[];
  weWin: { point: string; detail: string }[];
  verdict: string;
  chooseThem: string;
  chooseUs: string;
};

export const comparisons: Comparison[] = [
  {
    slug: "siemens-opcenter",
    competitor: "Siemens Opcenter Execution",
    category: "Enterprise MES suite",
    title: "ElectronIx Trace vs Siemens Opcenter — Honest Comparison",
    description:
      "Where Siemens Opcenter Execution is the better choice, where ElectronIx Trace is, and the size of plant each is actually built for.",
    h1: "ElectronIx Trace compared with Siemens Opcenter Execution",
    lede: "Opcenter is the capability benchmark in this category. It is also priced and scoped for a different kind of buyer. Here is the honest split.",
    theyWin: [
      { point: "Certification and validation", detail: "Opcenter carries validated deployments in GxP pharma, semiconductor and aerospace. We have no certifications at all. If your programme requires a validated MES, the comparison ends here." },
      { point: "Breadth", detail: "Scheduling, OEE, quality, batch records, wafer genealogy, resource management. Trace does traceability and deliberately stops there." },
      { point: "ERP integration", detail: "Deep, supported SAP and Oracle connectors. We have a documented seam and a column called external_ref, which is not the same thing and we will not pretend it is." },
      { point: "Global support", detail: "A worldwide partner network and 24/7 support tiers. We are one engineer in Coimbatore." },
      { point: "Reference customers", detail: "Hundreds of named deployments and independent analyst coverage. Trace has none to show yet." },
    ],
    weWin: [
      { point: "Price you can actually reach", detail: "Enterprise traceability platforms in this bracket are quoted per user and per module, with implementation on top, and industry reporting puts comparable IATF-focused systems at USD 50,000+ per year. That is not an MSME budget. Trace is quoted per plant." },
      { point: "Offline is structural", detail: "Trace stations write to durable local storage before any network call and replay idempotently. A suite that assumes uptime is assuming something an Indian plant LAN does not promise." },
      { point: "A licence problem cannot stop your line", detail: "There is no enforcement state in Trace that halts production capture. Not a policy — there is no such state in the code. Ask any vendor to put that in writing." },
      { point: "Deployment measured in weeks", detail: "One line, one edge box, your existing label template. Not a multi-quarter programme with a systems integrator attached." },
      { point: "The engineer who wrote it answers the phone", detail: "No support tier, no ticket queue, no account manager relaying questions to engineering." },
    ],
    verdict:
      "If you are a regulated multinational with an MES budget and a validation requirement, buy Opcenter. If you are a 50–500 person plant that needs a defensible per-unit record next quarter, Opcenter will quote you out of the room and Trace will not.",
    chooseThem: "You need validated MES, deep ERP integration, scheduling and OEE in one suite, and you have the budget and the implementation team.",
    chooseUs: "You need traceability specifically, on your own hardware, working offline, deployed on one line within weeks, at a price an Indian MSME can sign.",
  },
  {
    slug: "sepasoft-mes",
    competitor: "Sepasoft MES",
    category: "MES module on Ignition",
    title: "ElectronIx Trace vs Sepasoft MES Traceability — Comparison",
    description:
      "Sepasoft's traceability module runs on Ignition. Here is where that helps, where it costs, and where ElectronIx Trace fits instead.",
    h1: "ElectronIx Trace compared with Sepasoft MES",
    lede: "Sepasoft is a strong traceability module for plants already standardised on Ignition. That platform dependency is the whole comparison.",
    theyWin: [
      { point: "The Ignition ecosystem", detail: "If you already run Ignition for SCADA, Sepasoft sits inside a platform your team knows, with your tags already defined." },
      { point: "Protocol breadth today", detail: "Ignition brings a mature driver set — OPC UA, Modbus, Siemens, Allen-Bradley — that has been in plants for years." },
      { point: "Integrator network", detail: "A large pool of certified integrators. Trace has one engineer." },
      { point: "Track record", detail: "Independent review coverage and years of installations. We have neither yet." },
    ],
    weWin: [
      { point: "No platform tax", detail: "Sepasoft needs Ignition licensed and running before the traceability module does anything. Trace is one service and one database." },
      { point: "Traceability is the product, not a module", detail: "The recall query, the hash chain and the genealogy schema are the core of Trace, designed around those two queries rather than added to a SCADA platform." },
      { point: "Tamper-evident by construction", detail: "Append-only enforced by database triggers with a per-unit hash chain. A record that can be edited by anyone with a SQL prompt is a weaker record, whatever the UI shows." },
      { point: "Runs without an integrator", detail: "Routes, limits, label templates and stations are configuration. The route simulator lets you validate the whole line before hardware arrives." },
      { point: "Priced for a single plant", detail: "No platform licence, no per-seat cloud tax, no integrator retainer." },
    ],
    verdict:
      "Already committed to Ignition with an integrator on contract? Sepasoft is the low-friction answer. Starting from nothing, buying Ignition to get traceability is a large first step for a small first line.",
    chooseThem: "You run Ignition already, your integrator knows it, and you want traceability inside that platform.",
    chooseUs: "You are not on Ignition, you want traceability without adopting a SCADA platform to get it, and you want the record itself to be tamper-evident.",
  },
  {
    slug: "delmiaworks",
    competitor: "DELMIAWorks (IQMS)",
    category: "ERP/MES suite",
    title: "ElectronIx Trace vs DELMIAWorks Track and Trace",
    description:
      "DELMIAWorks bundles track and trace inside an ERP. Here is what that bundling gives you and what it costs.",
    h1: "ElectronIx Trace compared with DELMIAWorks track and trace",
    lede: "DELMIAWorks puts traceability inside an ERP/MES suite. If you are replacing your ERP anyway, that is an advantage. If you are not, it is the problem.",
    theyWin: [
      { point: "One vendor for ERP and shop floor", detail: "Traceability shares a database with orders, inventory and scheduling. Fewer integrations to own." },
      { point: "Financial and inventory depth", detail: "Trace has no ERP function at all and no plans for one." },
      { point: "Established installed base", detail: "Particularly in plastics and repetitive manufacturing, with references to show." },
      { point: "Support organisation", detail: "A real one, which we do not have." },
    ],
    weWin: [
      { point: "You do not have to replace your ERP", detail: "Traceability inside an ERP suite means adopting the suite. Trace runs beside whatever you already use, including Tally or a spreadsheet." },
      { point: "Process values, not transactions", detail: "ERP-native traceability is strongest at lot and transaction level. Per-fastener torque, grease confirmation and instrument readings are what Trace is built around." },
      { point: "Works when the network does not", detail: "An ERP-backed shop floor terminal usually needs the ERP. A Trace station does not need anything outside itself to keep capturing." },
      { point: "Weeks, not a programme", detail: "An ERP implementation is a year of somebody's life. One line on Trace is not." },
      { point: "Your data stays on your box", detail: "On-premise PostgreSQL you own, no cloud requirement in the runtime path." },
    ],
    verdict:
      "If an ERP replacement is genuinely on your roadmap, evaluate DELMIAWorks as an ERP and take traceability as a bonus. If your ERP is fine and traceability is the gap, do not replace the first to fix the second.",
    chooseThem: "You are replacing your ERP and want shop-floor traceability included in that decision.",
    chooseUs: "Your ERP stays, and you need a defensible per-unit process record beside it.",
  },
  {
    slug: "itac",
    competitor: "iTAC Software",
    category: "On-premise MES",
    title: "ElectronIx Trace vs iTAC Software — Comparison",
    description:
      "iTAC is a strong on-premise MES with traceability depth, especially in electronics. Where it wins and where ElectronIx Trace fits.",
    h1: "ElectronIx Trace compared with iTAC Software",
    lede: "iTAC is the closest philosophical match in the enterprise tier: on-premise, traceability-serious, strong in electronics and automotive. The difference is scale and price, not intent.",
    theyWin: [
      { point: "Depth in electronics manufacturing", detail: "SMT line integration, panel and board level traceability, and years of refinement in that domain." },
      { point: "The highest peer rating of the major MES suites", detail: "iTAC rates 4.6 on Gartner Peer Insights across 39 reviews, ahead of the larger suites. That is real and we will not talk around it." },
      { point: "A complete MES", detail: "Quality, materials, planning integration. Trace is traceability only." },
      { point: "European support and delivery organisation", detail: "Established, with references. We are one engineer." },
    ],
    weWin: [
      { point: "Built for the plant size that gets ignored", detail: "iTAC sells to enterprise electronics and automotive. A 60-person pump plant in Coimbatore is not their customer, and the quote will say so." },
      { point: "Faster to first record", detail: "One line, one box, your label template, weeks. Not a phased enterprise rollout." },
      { point: "Every limit is configuration", detail: "Torque windows, sampling rules and route shapes are rows. No change request, no release cycle." },
      { point: "Dry-run before commissioning", detail: "Simulate the route and the instruments with no hardware present, and find the configuration error before the line is down for it." },
      { point: "Direct engineering access", detail: "Feature requests go to the person who writes the code." },
    ],
    verdict:
      "iTAC is a better product with more behind it. It is also aimed at a plant an order of magnitude larger than the one Trace is built for. Get a quote from both — the quote itself will usually settle it.",
    chooseThem: "You are an electronics or automotive manufacturer at enterprise scale needing full MES depth and a European delivery organisation.",
    chooseUs: "You are an Indian MSME or mid-size plant that needs traceability specifically, quickly, on-premise, at a price you can sign this quarter.",
  },
  {
    slug: "aidc-integrators",
    competitor: "Local AIDC and barcode integrators",
    category: "Systems integrators",
    title: "ElectronIx Trace vs Barcode and AIDC Integrators in India",
    description:
      "Indian barcode and RFID integrators build custom traceability projects. Here is the honest difference between a project and a product.",
    h1: "ElectronIx Trace compared with a barcode integrator project",
    lede: "This is the comparison most Indian plants are actually making, and it is rarely framed honestly by either side. The difference is a bespoke project versus a product, and both have real costs.",
    theyWin: [
      { point: "They will build exactly what you describe", detail: "A custom project bends to your process in ways a product will not. If your requirement is genuinely unusual, that matters." },
      { point: "Hardware supply included", detail: "Most supply the scanners, printers and labels too. Trace is software; you buy hardware yourself or we help you spec it." },
      { point: "Local presence and relationships", detail: "Many are long established with people who will come to site the same week." },
      { point: "ERP integration is their headline", detail: "They often have existing connectors into the ERP you already run. We do not." },
    ],
    weWin: [
      { point: "You are not funding a from-scratch build", detail: "A bespoke project means your money pays for software that has never run anywhere, and its bugs are found in your plant. Trace arrives built and tested." },
      { point: "Process values, not just scan events", detail: "Most AIDC projects record that a code was scanned at a station. Trace records what the operation measured — torque per fastener, grease applied, the actual test readings, with limits." },
      { point: "The record is tamper-evident", detail: "Append-only with a per-unit hash chain, enforced in the database. A custom project's tables are usually ordinary tables that anyone with access can edit." },
      { point: "Recall is a designed query, not a report request", detail: "Forward trace by lot and by machine-and-time-window are indexed lookups. On a custom build, a recall query is usually a change request." },
      { point: "It keeps improving after you pay", detail: "Signed over-the-air updates with automatic rollback. A project is finished when the invoice clears." },
      { point: "It keeps working offline", detail: "Ask any integrator what their station does when the server is unreachable. The answer is usually silence, and it is the question that decides whether you lose a shift of records." },
    ],
    verdict:
      "An integrator is the right call when you need hardware, labels and software from one local supplier, and your requirement is simple scan-point tracking. When you need the process values, a record that survives challenge, and a recall query that works the first time you need it, a product beats a project.",
    chooseThem: "You want one local supplier for hardware and software, and simple scan-point tracking with ERP posting is genuinely enough.",
    chooseUs: "You need captured process values, an audit-grade record, and a recall answer that arrives in seconds rather than as a change request.",
  },
];

export const comparisonSlugs = comparisons.map((c) => c.slug);

export function comparisonBySlug(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}
