"use client";

import { useState } from "react";
import type { DemoUnit, Measurement } from "@/lib/demo-data";
import { formatTime, formatDate } from "@/lib/demo-data";
import { track } from "@/lib/analytics";
import { ScrollRegion } from "@/components/ui/scroll-region";

type Filter = "all" | "pass" | "fail";

export function UnitRecord({ unit }: { unit: DemoUnit }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const measurements = unit.measurements.filter((m) =>
    filter === "all" ? true : filter === "pass" ? m.verdict === "PASS" : m.verdict === "FAIL",
  );
  const failures = unit.measurements.filter((m) => m.verdict === "FAIL").length;

  function download() {
    track("demo_interaction", { action: "download_history", unit: unit.serial });
    const blob = new Blob([JSON.stringify(unit, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${unit.serial}-history.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="panel">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--rule)] p-5 md:flex-row md:items-start md:justify-between md:p-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-[family-name:var(--font-display)] text-lg">{unit.model}</h3>
            <span
              className={`chip ${unit.state === "QUARANTINED" ? "chip-fail" : "chip-pass"}`}
            >
              {unit.state}
            </span>
            <span className="chip">rev {unit.revision}</span>
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-sm xs:grid-cols-2">
            <Field label="Serial" value={unit.serial} mono />
            <Field label="Unit id" value={unit.uid} mono small />
            <Field label="Job card" value={unit.jobCard} mono />
            <Field label="Built" value={formatDate(unit.builtAt)} />
            <Field
              label="Dispatched"
              value={unit.dispatchedAt ? formatDate(unit.dispatchedAt) : "Held, not dispatched"}
            />
            <Field label="Customer" value={unit.customer} />
          </dl>
        </div>
        <button type="button" onClick={download} className="btn btn-secondary shrink-0 !py-2.5 !text-sm">
          Download this unit&rsquo;s history
        </button>
      </div>

      {/* Measurements */}
      <div className="border-b border-[var(--rule)] p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-sm font-semibold">Captured values</h4>
          <div role="group" aria-label="Filter captured values" className="flex gap-2">
            {(["all", "pass", "fail"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  track("demo_interaction", { action: "filter", value: f });
                }}
                aria-pressed={filter === f}
                className={`chip ${filter === f ? "chip-signal" : ""} cursor-pointer`}
              >
                {f === "all" ? `All ${unit.measurements.length}` : f === "pass" ? "In spec" : `Out of spec ${failures}`}
              </button>
            ))}
          </div>
        </div>

        {measurements.length === 0 ? (
          <p className="py-6 text-sm text-steel-500">
            No captured values match this filter for {unit.serial}.
          </p>
        ) : (
          <ScrollRegion label={`Captured process values for unit ${unit.serial}`}>
            <table className="data-table stack">
              <caption className="sr-only">
                Captured process values for unit {unit.serial}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Point</th>
                  <th scope="col">Value</th>
                  <th scope="col">Limits</th>
                  <th scope="col">Verdict</th>
                  <th scope="col">Source</th>
                  <th scope="col">When</th>
                  <th scope="col">
                    <span className="sr-only">Detail</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((m) => (
                  <MeasurementRow
                    key={m.point}
                    m={m}
                    open={expanded === m.point}
                    onToggle={() => {
                      setExpanded(expanded === m.point ? null : m.point);
                      track("demo_interaction", { action: "expand_measurement", point: m.point });
                    }}
                  />
                ))}
              </tbody>
            </table>
          </ScrollRegion>
        )}
      </div>

      {/* Components */}
      <div className="border-b border-[var(--rule)] p-5 md:p-6">
        <h4 className="mb-4 text-sm font-semibold">Components consumed</h4>
        <ScrollRegion label={`Components consumed by unit ${unit.serial}`}>
          <table className="data-table stack">
            <caption className="sr-only">Components consumed by unit {unit.serial}</caption>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Depth</th>
                <th scope="col">Kind</th>
                <th scope="col">Qty</th>
                <th scope="col">Op</th>
              </tr>
            </thead>
            <tbody>
              {unit.components.map((c) => (
                <tr key={`${c.partNo}-${c.operationSeq}-${c.depth}`}>
                  <td data-stack-title className="data">{c.item}</td>
                  <td data-label="Depth" className="data text-steel-500">{c.depth}</td>
                  <td data-label="Kind">
                    <span className="chip">{c.kind}</span>
                  </td>
                  <td data-label="Qty" className="data text-steel-400">{c.qty}</td>
                  <td data-label="Op" className="data text-steel-400">{c.operationSeq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
      </div>

      {/* Events */}
      <div className="p-5 md:p-6">
        <h4 className="mb-4 text-sm font-semibold">Event history</h4>
        <ScrollRegion label={`Event history for unit ${unit.serial}`}>
          <table className="data-table stack">
            <caption className="sr-only">Event history for unit {unit.serial}</caption>
            <thead>
              <tr>
                <th scope="col">Event</th>
                <th scope="col">When</th>
                <th scope="col">Op</th>
                <th scope="col">Station</th>
                <th scope="col">Operator</th>
                <th scope="col">Chain hash</th>
              </tr>
            </thead>
            <tbody>
              {unit.events.map((e) => (
                <tr key={e.hash}>
                  <td data-stack-title>
                    <span className="data">{e.kind}</span>
                    <span className="mt-1 block text-xs text-steel-500">{e.detail}</span>
                  </td>
                  <td data-label="When" className="data whitespace-nowrap text-steel-400">{formatTime(e.recordedAt)}</td>
                  <td data-label="Op" className="data text-steel-400">{e.operationSeq ?? "—"}</td>
                  <td data-label="Station" className="data text-steel-400">{e.station ?? "—"}</td>
                  <td data-label="Operator" className="text-steel-400">{e.operator ?? "—"}</td>
                  <td data-label="Chain hash" className="data text-xs break-all text-steel-600">{e.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
        <p className="mt-4 text-xs text-steel-600">
          Every row is append-only and chained to the one before it. Changing a historical
          value breaks every hash after it.
        </p>
      </div>
    </div>
  );
}

function MeasurementRow({
  m,
  open,
  onToggle,
}: {
  m: Measurement;
  open: boolean;
  onToggle: () => void;
}) {
  const limits =
    m.min !== null && m.max !== null
      ? `${m.min} – ${m.max}${m.unit ? ` ${m.unit}` : ""}`
      : m.max !== null
        ? `≤ ${m.max}${m.unit ? ` ${m.unit}` : ""}`
        : "—";

  return (
    <>
      <tr>
        <td data-stack-title className="data">{m.label}</td>
        <td
          data-label="Value"
          className={`data font-medium ${m.verdict === "FAIL" ? "verdict-fail" : ""}`}
        >
          {m.value}
        </td>
        <td data-label="Limits" className="data text-steel-400">{limits}</td>
        <td data-label="Verdict">
          <span className={`chip ${m.verdict === "PASS" ? "chip-pass" : "chip-fail"}`}>
            {m.verdict}
          </span>
        </td>
        <td data-label="Source">
          <span className="chip">{m.source}</span>
        </td>
        <td data-label="When" className="data whitespace-nowrap text-steel-400">{formatTime(m.recordedAt)}</td>
        <td data-label="">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="btn-ghost text-xs underline underline-offset-2"
          >
            {open ? "Hide raw" : "Show raw"}
          </button>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={7} data-stack-full className="!border-b-0 bg-graphite-850 !p-0">
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <RawField label="Raw device payload" value={m.rawPayload} />
              <RawField label="Device" value={m.device ?? "Manual entry, no device"} />
              <RawField label="Station / operator" value={`${m.station} · ${m.operator}`} />
              <RawField label="Operation" value={`Seq ${m.operationSeq}`} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function RawField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="data text-[0.625rem] tracking-wide text-steel-600">{label}</p>
      <p className="data mt-1 text-xs break-all text-line-050">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
  small,
}: {
  label: string;
  value: string;
  mono?: boolean;
  small?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-steel-600">{label}</dt>
      <dd className={`min-w-0 break-all ${mono ? "data" : ""} ${small ? "text-xs" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
