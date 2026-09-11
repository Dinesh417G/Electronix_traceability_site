/**
 * Sample dataset for the in-browser demo and the recall calculator.
 *
 * The spine is real: product EX-VLV-2200 rev A, station ST-01, operator
 * R. Kumar, part SCR-M6-20 and the final_torque point (10-14 Nm, nominal 12)
 * all come from the route simulator's built-in example scenario in the product
 * repository. A recall query needs more than one unit to mean anything, so the
 * spine is extended to 24 units across 3 job cards and 4 component lots.
 *
 * This is sample data. It is labelled as such everywhere it is shown, and it is
 * not production data from any customer.
 */

export type Verdict = "PASS" | "FAIL";
export type Source = "DEVICE" | "MANUAL";

export type Measurement = {
  point: string;
  label: string;
  value: string;
  numeric: number | null;
  unit: string | null;
  min: number | null;
  max: number | null;
  nominal: number | null;
  verdict: Verdict;
  source: Source;
  device: string | null;
  rawPayload: string;
  operationSeq: number;
  station: string;
  operator: string;
  recordedAt: string;
};

export type Component = {
  depth: number;
  item: string;
  kind: "LOT" | "SERIAL";
  partNo: string;
  qty: string;
  operationSeq: number;
  recordedAt: string;
};

export type UnitEvent = {
  kind: string;
  operationSeq: number | null;
  station: string | null;
  operator: string | null;
  detail: string;
  recordedAt: string;
  hash: string;
};

export type TestResult = {
  name: string;
  verdict: Verdict;
  operationSeq: number;
  station: string;
  recordedAt: string;
};

export type DemoUnit = {
  uid: string;
  serial: string;
  model: string;
  revision: string;
  jobCard: string;
  customer: string;
  state: "COMPLETED" | "SHIPPED" | "QUARANTINED";
  builtAt: string;
  dispatchedAt: string | null;
  lots: string[];
  components: Component[];
  measurements: Measurement[];
  tests: TestResult[];
  events: UnitEvent[];
};

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Deterministic generator so the demo renders identically on server and client. */
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function ulidFrom(rand: () => number): string {
  let out = "";
  for (let i = 0; i < 26; i += 1) {
    const idx = Math.floor(rand() * (i === 0 ? 8 : 32));
    out += CROCKFORD[idx] ?? "0";
  }
  return out;
}

function hashFrom(rand: () => number): string {
  const hex = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < 16; i += 1) out += hex[Math.floor(rand() * 16)] ?? "0";
  return out;
}

function round(n: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

export const LOTS = [
  { code: "GSK-2608-A14", part: "Gasket, body, NBR", supplier: "Lot supplied 2026-08-14" },
  { code: "SEAL-2607-B22", part: "Seal, stem, PTFE", supplier: "Lot supplied 2026-07-22" },
  { code: "BRG-2608-C07", part: "Bearing, 6204-2RS", supplier: "Lot supplied 2026-08-07" },
  { code: "CAST-2606-D31", part: "Body casting, CF8M", supplier: "Lot supplied 2026-06-31" },
] as const;

const JOB_CARDS = [
  { number: "JC-2608-0071", customer: "Southern Pumps, Coimbatore", day: "2026-08-18" },
  { number: "JC-2608-0092", customer: "Meridian Fluid Systems, Chennai", day: "2026-08-27" },
  { number: "JC-2609-0118", customer: "Anand Hydraulics, Pune", day: "2026-09-04" },
] as const;

const OPERATORS = ["R. Kumar", "S. Priya", "M. Anand"] as const;
const STATIONS = ["ST-01", "ST-02", "ST-03", "ST-04"] as const;

function at(day: string, minutesIn: number): string {
  const base = new Date(`${day}T06:00:00+05:30`).getTime();
  return new Date(base + minutesIn * 60_000).toISOString();
}

function buildUnit(index: number): DemoUnit {
  const rand = lcg(0x7ace0000 + index * 7919);
  const jc = JOB_CARDS[Math.floor(index / 8)] ?? JOB_CARDS[0];
  const inJob = index % 8;
  const operator = OPERATORS[index % OPERATORS.length] ?? OPERATORS[0];
  const station = STATIONS[index % STATIONS.length] ?? STATIONS[0];
  const startMin = inJob * 23 + 15;

  // Lot allocation. GSK-2608-A14 deliberately spans two job cards, because a
  // supplier lot that respects your job card boundaries is not a realistic
  // containment exercise.
  const lots: string[] = [];
  lots.push(index < 12 ? "GSK-2608-A14" : "GSK-2609-A15");
  lots.push(index % 3 === 0 ? "SEAL-2607-B22" : "SEAL-2608-B31");
  lots.push(index % 2 === 0 ? "BRG-2608-C07" : "BRG-2609-C12");
  lots.push("CAST-2606-D31");

  // Torque: nominal 12 Nm, window 10-14. Two units in the set are genuinely
  // out of spec so the in-spec/out-of-spec states are worth rendering.
  const torqueBase = 11.4 + rand() * 1.6;
  const forcedFail = index === 5 || index === 17;
  const torque = forcedFail ? round(9.2 + rand() * 0.5, 1) : round(torqueBase, 1);
  const torqueVerdict: Verdict = torque >= 10 && torque <= 14 ? "PASS" : "FAIL";

  const leak = round(0.8 + rand() * 1.9, 2);
  const hydro = round(14.2 + rand() * 1.1, 1);
  const greaseApplied = true;

  const measurements: Measurement[] = [
    {
      point: "final_torque",
      label: "Final torque",
      value: `${torque.toFixed(1)} Nm`,
      numeric: torque,
      unit: "Nm",
      min: 10,
      max: 14,
      nominal: 12,
      verdict: torqueVerdict,
      source: "DEVICE",
      device: "TW-01",
      rawPayload: `TQ,${torque.toFixed(2)},NM,OK\\r\\n`,
      operationSeq: 30,
      station,
      operator,
      recordedAt: at(jc.day, startMin + 8),
    },
    {
      point: "grease_applied",
      label: "Grease applied",
      value: greaseApplied ? "Yes" : "No",
      numeric: null,
      unit: null,
      min: null,
      max: null,
      nominal: null,
      verdict: "PASS",
      source: "MANUAL",
      device: null,
      rawPayload: "operator confirmation",
      operationSeq: 40,
      station,
      operator,
      recordedAt: at(jc.day, startMin + 11),
    },
    {
      point: "hydro_pressure",
      label: "Hydro test pressure",
      value: `${hydro.toFixed(1)} bar`,
      numeric: hydro,
      unit: "bar",
      min: 13.5,
      max: 16,
      nominal: 15,
      verdict: hydro >= 13.5 && hydro <= 16 ? "PASS" : "FAIL",
      source: "DEVICE",
      device: "HT-02",
      rawPayload: `PR,${hydro.toFixed(2)},BAR,HOLD=60\\r\\n`,
      operationSeq: 50,
      station,
      operator,
      recordedAt: at(jc.day, startMin + 16),
    },
    {
      point: "leak_rate",
      label: "Leak rate",
      value: `${leak.toFixed(2)} ml/min`,
      numeric: leak,
      unit: "ml/min",
      min: null,
      max: 3,
      nominal: null,
      verdict: leak <= 3 ? "PASS" : "FAIL",
      source: "DEVICE",
      device: "LT-01",
      rawPayload: `LK,${leak.toFixed(3)},MLMIN\\r\\n`,
      operationSeq: 50,
      station,
      operator,
      recordedAt: at(jc.day, startMin + 18),
    },
  ];

  const anyFail = measurements.some((m) => m.verdict === "FAIL");

  const components: Component[] = [
    ...lots.map((code, i) => {
      const meta = LOTS.find((l) => l.code === code);
      return {
        depth: 1,
        item: `${meta?.part ?? "Component"} · ${code}`,
        kind: "LOT" as const,
        partNo: code,
        qty: i === 0 ? "1 ea" : i === 3 ? "1 ea" : "2 ea",
        operationSeq: 20,
        recordedAt: at(jc.day, startMin + 4),
      };
    }),
    {
      depth: 1,
      item: "Screw, M6 x 20 · SCR-M6-20",
      kind: "LOT",
      partNo: "SCR-M6-20",
      qty: "4 ea",
      operationSeq: 30,
      recordedAt: at(jc.day, startMin + 7),
    },
    {
      depth: 2,
      item: `Stem sub-assembly · SA-${String(4100 + index)}`,
      kind: "SERIAL",
      partNo: "SA-STEM-22",
      qty: "1 ea",
      operationSeq: 20,
      recordedAt: at(jc.day, startMin + 5),
    },
  ];

  const tests: TestResult[] = [
    {
      name: "EOL",
      verdict: anyFail ? "FAIL" : "PASS",
      operationSeq: 50,
      station,
      recordedAt: at(jc.day, startMin + 19),
    },
  ];

  const events: UnitEvent[] = [
    { kind: "BORN", operationSeq: null, station: null, operator: null, detail: `Job card ${jc.number}`, recordedAt: at(jc.day, startMin), hash: hashFrom(rand) },
    { kind: "MARK_APPLIED", operationSeq: 10, station, operator, detail: "Label printed, read back grade B", recordedAt: at(jc.day, startMin + 2), hash: hashFrom(rand) },
    { kind: "OP_COMPLETE", operationSeq: 20, station, operator, detail: "Components verified against BOM", recordedAt: at(jc.day, startMin + 6), hash: hashFrom(rand) },
    { kind: "OP_COMPLETE", operationSeq: 30, station, operator, detail: `Torque captured from TW-01`, recordedAt: at(jc.day, startMin + 9), hash: hashFrom(rand) },
    { kind: "OP_COMPLETE", operationSeq: 40, station, operator, detail: "Grease confirmed, cover fitted", recordedAt: at(jc.day, startMin + 12), hash: hashFrom(rand) },
    {
      kind: anyFail ? "QUARANTINED" : "OP_COMPLETE",
      operationSeq: 50,
      station,
      operator,
      detail: anyFail ? "Gate DATA_CAPTURE failed, unit held for supervisor" : "EOL test passed",
      recordedAt: at(jc.day, startMin + 20),
      hash: hashFrom(rand),
    },
  ];

  if (!anyFail) {
    events.push({
      kind: "SHIPPED",
      operationSeq: null,
      station: null,
      operator: null,
      detail: jc.customer,
      recordedAt: at(jc.day, startMin + 240),
      hash: hashFrom(rand),
    });
  }

  return {
    uid: ulidFrom(rand),
    serial: `VLV-${jc.number.slice(3, 7)}-${String(1001 + index)}`,
    model: "EX-VLV-2200",
    revision: "A",
    jobCard: jc.number,
    customer: jc.customer,
    state: anyFail ? "QUARANTINED" : "SHIPPED",
    builtAt: at(jc.day, startMin),
    dispatchedAt: anyFail ? null : at(jc.day, startMin + 240),
    lots,
    components,
    measurements,
    tests,
    events,
  };
}

export const demoUnits: DemoUnit[] = Array.from({ length: 24 }, (_, i) => buildUnit(i));

export const featuredUnit: DemoUnit = demoUnits[0] as DemoUnit;

export function unitByUid(uid: string): DemoUnit | undefined {
  return demoUnits.find((u) => u.uid === uid);
}

export function findUnit(query: string): DemoUnit | undefined {
  const q = query.trim().toUpperCase();
  if (!q) return undefined;
  return demoUnits.find((u) => u.uid === q || u.serial.toUpperCase() === q);
}

export type RecallResult = {
  lot: string;
  known: boolean;
  affected: DemoUnit[];
  clean: number;
  customers: { name: string; units: number }[];
  windowFrom: string | null;
  windowTo: string | null;
  shipped: number;
  held: number;
};

/** The forward trace: lot code in, affected units out. */
export function recallByLot(lotCode: string): RecallResult {
  const lot = lotCode.trim().toUpperCase();
  const affected = demoUnits.filter((u) => u.lots.some((l) => l.toUpperCase() === lot));
  const known =
    affected.length > 0 || demoUnits.some((u) => u.lots.some((l) => l.toUpperCase() === lot));

  const byCustomer = new Map<string, number>();
  for (const u of affected) byCustomer.set(u.customer, (byCustomer.get(u.customer) ?? 0) + 1);

  const times = affected.map((u) => u.builtAt).sort();

  return {
    lot,
    known,
    affected,
    clean: demoUnits.length - affected.length,
    customers: [...byCustomer.entries()]
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units),
    windowFrom: times[0] ?? null,
    windowTo: times[times.length - 1] ?? null,
    shipped: affected.filter((u) => u.state === "SHIPPED").length,
    held: affected.filter((u) => u.state === "QUARANTINED").length,
  };
}

/** Lot codes present in the dataset, for the calculator's suggestion chips. */
export const knownLots: string[] = [
  ...new Set(demoUnits.flatMap((u) => u.lots)),
].sort();

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
