"use client";

import { useState } from "react";
import { demoUnits } from "@/lib/demo-data";
import { ScrollRegion } from "@/components/ui/scroll-region";

const TABS = [
  { id: "unit", label: "Unit search" },
  { id: "line", label: "Line status" },
  { id: "trend", label: "Parameter trend" },
  { id: "pareto", label: "Defect Pareto" },
  { id: "template", label: "Label templates" },
  { id: "station", label: "Station setup" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ProductTour() {
  const [tab, setTab] = useState<TabId>("unit");

  return (
    <div>
      <div role="tablist" aria-label="Product screens" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`border px-3.5 py-2.5 text-sm transition-colors ${
              tab === t.id
                ? "border-signal bg-graphite-800 text-line-050"
                : "border-[var(--rule)] text-steel-400 hover:text-line-050"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="panel mt-5 overflow-hidden"
      >
        <Chrome title={TABS.find((t) => t.id === tab)?.label ?? ""} />
        <div className="p-4 md:p-6">
          {tab === "unit" && <UnitSearch />}
          {tab === "line" && <LineStatus />}
          {tab === "trend" && <ParameterTrend />}
          {tab === "pareto" && <DefectPareto />}
          {tab === "template" && <LabelTemplates />}
          {tab === "station" && <StationSetup />}
        </div>
      </div>

      <p className="mt-4 text-xs text-steel-600">
        Interface renderings of the ElectronIx Trace screens, drawn to the station design
        constraints: large hit targets, no hover states and no right-click, because a
        gloved hand on a touchscreen has neither.
      </p>
    </div>
  );
}

function Chrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--rule)] bg-graphite-850 px-4 py-2.5">
      <span className="flex gap-1.5">
        <Dot /> <Dot /> <Dot />
      </span>
      <span className="data text-[0.6875rem] text-steel-500">{title}</span>
    </div>
  );
}

function Dot() {
  return <span className="block h-2 w-2 rounded-full bg-graphite-700" />;
}

function UnitSearch() {
  const u = demoUnits[3];
  if (!u) return null;
  return (
    <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
      <div className="panel-inset p-4">
        <p className="data text-[0.625rem] text-steel-600">SCAN OR SEARCH</p>
        <div className="data mt-2 border border-[var(--rule-strong)] bg-graphite-950 px-3 py-2.5 text-sm">
          {u.serial}
        </div>
        <dl className="mt-4 space-y-2 text-xs">
          {[
            ["Model", u.model],
            ["Revision", u.revision],
            ["Job card", u.jobCard],
            ["State", u.state],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="text-steel-600">{k}</dt>
              <dd className="data">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="panel-inset p-4">
        <p className="data text-[0.625rem] text-steel-600">CAPTURED VALUES</p>
        <ul className="mt-3 space-y-2">
          {u.measurements.map((m) => (
            <li key={m.point} className="flex items-center justify-between gap-3 text-xs">
              <span className="data text-steel-400">{m.label}</span>
              <span className="flex items-center gap-2">
                <span className="data">{m.value}</span>
                <span className={`chip ${m.verdict === "PASS" ? "chip-pass" : "chip-fail"}`}>
                  {m.verdict}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LineStatus() {
  const rows = [
    { station: "ST-01", op: "10 · Mark and verify", unit: "VLV-2608-1004", state: "RUNNING" },
    { station: "ST-02", op: "20 · Sub-assembly", unit: "VLV-2608-1003", state: "RUNNING" },
    { station: "ST-03", op: "30 · Torque", unit: "VLV-2608-1002", state: "BLOCKED" },
    { station: "ST-04", op: "50 · Hydro and leak", unit: "VLV-2608-1001", state: "RUNNING" },
  ];
  return (
    <ScrollRegion label="Line status by station">
      <table className="data-table">
        <caption className="sr-only">Line status by station</caption>
        <thead>
          <tr>
            <th scope="col">Station</th>
            <th scope="col">Operation</th>
            <th scope="col">Unit in fixture</th>
            <th scope="col">State</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.station}>
              <td className="data">{r.station}</td>
              <td className="data text-steel-400">{r.op}</td>
              <td className="data">{r.unit}</td>
              <td>
                <span className={`chip ${r.state === "BLOCKED" ? "chip-fail" : "chip-pass"}`}>
                  {r.state}
                </span>
                {r.state === "BLOCKED" && (
                  <span className="data mt-1 block text-[0.625rem] text-steel-500">
                    gate DATA_CAPTURE
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  );
}

function ParameterTrend() {
  const values = demoUnits.slice(0, 16).map((u) => u.measurements[0]?.numeric ?? 12);
  const min = 9;
  const max = 15;
  const h = 140;
  const w = 560;
  const step = w / (values.length - 1);
  const y = (v: number) => h - ((v - min) / (max - min)) * h;
  const path = values.map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${y(v)}`).join(" ");

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="data text-xs text-steel-400">final_torque · EX-VLV-2200 rev A</p>
        <p className="data text-xs text-steel-600">limits 10.0 – 14.0 Nm, nominal 12.0</p>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Torque readings for sixteen consecutive units, two below the lower limit of ten newton metres">
        <rect x="0" y={y(14)} width={w} height={y(10) - y(14)} fill="var(--color-verify)" opacity="0.07" />
        <line x1="0" y1={y(14)} x2={w} y2={y(14)} stroke="var(--color-verify)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
        <line x1="0" y1={y(10)} x2={w} y2={y(10)} stroke="var(--color-verify)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
        <line x1="0" y1={y(12)} x2={w} y2={y(12)} stroke="var(--color-steel-600)" strokeWidth="1" strokeDasharray="2 6" />
        <path d={path} fill="none" stroke="var(--color-steel-500)" strokeWidth="1.5" />
        {values.map((v, i) => (
          <circle
            key={i}
            cx={i * step}
            cy={y(v)}
            r="3.5"
            fill={v < 10 || v > 14 ? "var(--color-reject)" : "var(--color-line-050)"}
          />
        ))}
      </svg>
      <p className="mt-3 text-xs text-steel-500">
        Two units below the lower limit. Both were blocked at the torque gate and held, not
        shipped.
      </p>
    </div>
  );
}

function DefectPareto() {
  const bars = [
    { code: "DATA_CAPTURE", n: 14 },
    { code: "COMPONENT_VERIFY", n: 9 },
    { code: "TEST_PASS", n: 5 },
    { code: "MARK_VERIFIED", n: 3 },
    { code: "OPERATOR_AUTH", n: 1 },
  ];
  const top = bars[0]?.n ?? 1;
  return (
    <ul className="space-y-3">
      {bars.map((b) => (
        <li key={b.code} className="grid grid-cols-[10.5rem_1fr_2rem] items-center gap-3">
          <span className="data truncate text-xs text-steel-400">{b.code}</span>
          <span className="h-5 bg-graphite-800">
            <span
              className="block h-5 bg-signal"
              style={{ width: `${(b.n / top) * 100}%` }}
            />
          </span>
          <span className="data text-right text-xs">{b.n}</span>
        </li>
      ))}
    </ul>
  );
}

function LabelTemplates() {
  const rows = [
    { code: "LBL-VLV-CUST-A", name: "Southern Pumps, 100 x 50 mm", version: 4, from: "2026-08-01" },
    { code: "LBL-VLV-CUST-B", name: "Meridian Fluid, 75 x 50 mm", version: 2, from: "2026-07-14" },
    { code: "LBL-DPM-RAW", name: "Data Matrix, raw casting", version: 1, from: "2026-06-20" },
  ];
  return (
    <ScrollRegion label="Label templates and their versions">
      <table className="data-table">
        <caption className="sr-only">Label templates and their versions</caption>
        <thead>
          <tr>
            <th scope="col">Template</th>
            <th scope="col">Name</th>
            <th scope="col">Version</th>
            <th scope="col">Effective from</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.code}>
              <td className="data">{r.code}</td>
              <td className="text-steel-400">{r.name}</td>
              <td className="data">v{r.version}</td>
              <td className="data text-steel-400">{r.from}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  );
}

function StationSetup() {
  const ops = [
    { seq: "10", name: "label_and_verify", gates: "IDENTITY · MARK_VERIFIED", fail: "RETRY ×3" },
    { seq: "20", name: "assemble", gates: "IDENTITY · OPERATOR_AUTH · COMPONENT_VERIFY", fail: "QUARANTINE" },
    { seq: "30", name: "torque", gates: "PRECONDITION · DATA_CAPTURE", fail: "REWORK → 20" },
    { seq: "50", name: "eol_test", gates: "TEST_PASS · INTERLOCK_OUT", fail: "QUARANTINE" },
  ];
  return (
    <ScrollRegion label="Route operations, gates and failure paths">
      <table className="data-table">
        <caption className="sr-only">Route operations, gates and failure paths</caption>
        <thead>
          <tr>
            <th scope="col">Seq</th>
            <th scope="col">Operation</th>
            <th scope="col">Gates</th>
            <th scope="col">On failure</th>
          </tr>
        </thead>
        <tbody>
          {ops.map((o) => (
            <tr key={o.seq}>
              <td className="data text-signal">{o.seq}</td>
              <td className="data">{o.name}</td>
              <td className="data text-xs text-steel-400">{o.gates}</td>
              <td className="data text-xs text-steel-400">{o.fail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  );
}
