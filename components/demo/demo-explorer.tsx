"use client";

import { useState } from "react";
import { demoUnits, findUnit, type DemoUnit } from "@/lib/demo-data";
import { UnitRecord } from "@/components/demo/unit-record";
import { track } from "@/lib/analytics";

const SAMPLES = demoUnits.slice(0, 5);

export function DemoExplorer({ initial }: { initial: DemoUnit }) {
  const [unit, setUnit] = useState<DemoUnit>(initial);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = findUnit(query);
    if (!found) {
      setError(
        `No unit in the sample dataset matches “${query.trim()}”. Try one of the sample serials below.`,
      );
      return;
    }
    setError(null);
    setUnit(found);
    track("sample_unit_open", { serial: found.serial, via: "search" });
  }

  return (
    <div>
      <div className="panel-inset mb-6 p-5 md:p-6">
        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="unit-search" className="mb-2 block text-sm text-steel-400">
              Scan or type a serial number
            </label>
            <input
              id="unit-search"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError(null);
              }}
              placeholder={SAMPLES[0]?.serial ?? ""}
              autoComplete="off"
              spellCheck={false}
              aria-describedby={error ? "unit-search-error" : "unit-search-help"}
              {...(error ? { "aria-invalid": true as const } : {})}
              className="data w-full border border-[var(--rule-strong)] bg-graphite-950 px-3.5 py-3 text-line-050 placeholder:text-steel-600"
            />
          </div>
          <button type="submit" className="btn btn-primary self-end max-sm:w-full">
            Get this unit&rsquo;s history
          </button>
        </form>

        {error ? (
          <p id="unit-search-error" role="alert" className="mt-3 text-sm verdict-fail">
            {error}
          </p>
        ) : (
          <p id="unit-search-help" className="mt-3 text-xs text-steel-600">
            A real scanner types the code and presses enter, which is exactly this field.
          </p>
        )}

        <div className="mt-5">
          <p className="data mb-2.5 text-[0.625rem] tracking-wide text-steel-600">
            SAMPLE UNITS
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((u) => (
              <button
                key={u.uid}
                type="button"
                onClick={() => {
                  setUnit(u);
                  setQuery(u.serial);
                  setError(null);
                  track("sample_unit_open", { serial: u.serial, via: "chip" });
                }}
                aria-pressed={unit.uid === u.uid}
                className={`chip cursor-pointer ${unit.uid === u.uid ? "chip-signal" : ""} ${
                  u.state === "QUARANTINED" ? "!text-reject" : ""
                }`}
              >
                {u.serial}
                {u.state === "QUARANTINED" ? " · held" : ""}
              </button>
            ))}
          </div>
        </div>
      </div>

      <UnitRecord unit={unit} />
    </div>
  );
}
