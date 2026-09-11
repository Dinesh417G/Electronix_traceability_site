"use client";

import { useState } from "react";
import { recallByLot, knownLots, formatTime, type RecallResult } from "@/lib/demo-data";
import { track } from "@/lib/analytics";
import { ScrollRegion } from "@/components/ui/scroll-region";

export function RecallCalculator() {
  const [lot, setLot] = useState("");
  const [qty, setQty] = useState("");
  const [result, setResult] = useState<RecallResult | null>(null);

  function run(code: string) {
    const r = recallByLot(code);
    setResult(r);
    setLot(code);
    track("calculator_use", { lot: code, affected: r.affected.length });
  }

  return (
    <div className="panel">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (lot.trim()) run(lot);
        }}
        className="border-b border-[var(--rule)] p-5 md:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
          <div>
            <label htmlFor="lot-code" className="mb-2 block text-sm text-steel-400">
              Component lot code
            </label>
            <input
              id="lot-code"
              type="text"
              value={lot}
              onChange={(e) => setLot(e.target.value)}
              placeholder="GSK-2608-A14"
              autoComplete="off"
              spellCheck={false}
              className="data w-full border border-[var(--rule-strong)] bg-graphite-950 px-3.5 py-3 text-line-050 placeholder:text-steel-600"
            />
          </div>
          <div>
            <label htmlFor="lot-qty" className="mb-2 block text-sm text-steel-400">
              Qty received <span className="text-steel-600">(optional)</span>
            </label>
            <input
              id="lot-qty"
              type="text"
              inputMode="numeric"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="500"
              autoComplete="off"
              className="data w-full border border-[var(--rule-strong)] bg-graphite-950 px-3.5 py-3 text-line-050 placeholder:text-steel-600"
            />
          </div>
          <button type="submit" className="btn btn-primary max-sm:w-full">
            Calculate scope
          </button>
        </div>

        <div className="mt-5">
          <p className="data mb-2.5 text-[0.625rem] tracking-wide text-steel-600">
            LOTS IN THE SAMPLE DATASET
          </p>
          <div className="flex flex-wrap gap-2">
            {knownLots.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => run(l)}
                className={`chip cursor-pointer ${result?.lot === l ? "chip-signal" : ""}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </form>

      <div className="p-5 md:p-6" aria-live="polite">
        {!result ? (
          <p className="py-8 text-center text-sm text-steel-500">
            Enter a lot code to see which units consumed it, who they shipped to, and the
            containment window.
          </p>
        ) : result.affected.length === 0 ? (
          <div className="py-6">
            <p className="text-sm">
              No unit in the sample dataset consumed{" "}
              <span className="data text-line-050">{result.lot}</span>.
            </p>
            <p className="mt-2 text-sm text-steel-500">
              In a real containment that is the answer you want, and it is the half most
              systems cannot give you: proof of what is clean.
            </p>
          </div>
        ) : (
          <Result result={result} qty={qty} />
        )}
      </div>
    </div>
  );
}

function Result({ result, qty }: { result: RecallResult; qty: string }) {
  const qtyNum = Number.parseInt(qty, 10);
  const unaccounted =
    Number.isFinite(qtyNum) && qtyNum > 0 ? Math.max(qtyNum - result.affected.length, 0) : null;

  return (
    <div>
      <div className="grid grid-cols-2 gap-px border border-[var(--rule)] bg-[var(--rule)] lg:grid-cols-4">
        <Stat label="Units affected" value={String(result.affected.length)} tone="reject" />
        <Stat label="Provably clean" value={String(result.clean)} tone="verify" />
        <Stat label="Already shipped" value={String(result.shipped)} />
        <Stat label="Still held in plant" value={String(result.held)} />
      </div>

      {result.windowFrom && result.windowTo && (
        <p className="mt-4 text-sm text-steel-400">
          Containment window{" "}
          <span className="data text-line-050">{formatTime(result.windowFrom)}</span> to{" "}
          <span className="data text-line-050">{formatTime(result.windowTo)}</span>. Everything
          outside it is out of scope.
        </p>
      )}

      {unaccounted !== null && (
        <p className="mt-2 text-sm text-steel-400">
          You received <span className="data text-line-050">{qtyNum}</span> of this lot and{" "}
          <span className="data text-line-050">{result.affected.length}</span> are accounted for
          in finished units. The remaining{" "}
          <span className="data text-line-050">{unaccounted}</span> are in stock, in WIP, or
          scrapped — a stock check closes that gap.
        </p>
      )}

      <h4 className="mt-8 mb-3 text-sm font-semibold">Customers to notify</h4>
      <ScrollRegion label={`Customers affected by lot ${result.lot}`}>
        <table className="data-table">
          <caption className="sr-only">Customers affected by lot {result.lot}</caption>
          <thead>
            <tr>
              <th scope="col">Customer</th>
              <th scope="col">Units</th>
            </tr>
          </thead>
          <tbody>
            {result.customers.map((c) => (
              <tr key={c.name}>
                <td>{c.name}</td>
                <td className="data">{c.units}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollRegion>

      <h4 className="mt-8 mb-3 text-sm font-semibold">Affected units</h4>
      <ScrollRegion
        label={`Units that consumed lot ${result.lot}`}
        className="max-h-96 overflow-y-auto"
      >
        <table className="data-table">
          <caption className="sr-only">Units that consumed lot {result.lot}</caption>
          <thead>
            <tr>
              <th scope="col">Serial</th>
              <th scope="col">Job card</th>
              <th scope="col">Built</th>
              <th scope="col">State</th>
              <th scope="col">Customer</th>
            </tr>
          </thead>
          <tbody>
            {result.affected.map((u) => (
              <tr key={u.uid}>
                <td className="data">{u.serial}</td>
                <td className="data text-steel-400">{u.jobCard}</td>
                <td className="data whitespace-nowrap text-steel-400">{formatTime(u.builtAt)}</td>
                <td>
                  <span className={`chip ${u.state === "QUARANTINED" ? "chip-fail" : ""}`}>
                    {u.state}
                  </span>
                </td>
                <td className="text-steel-400">{u.customer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollRegion>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "verify" | "reject";
}) {
  return (
    <div className="bg-graphite-900 p-4">
      <p className="data text-[0.625rem] tracking-wide text-steel-600">{label}</p>
      <p
        className={`data mt-1.5 text-2xl ${
          tone === "verify" ? "verdict-pass" : tone === "reject" ? "verdict-fail" : "text-line-050"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
