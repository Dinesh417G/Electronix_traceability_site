"use client";

import { useEffect, useRef, useState } from "react";
import { stages } from "@/content/home";

/**
 * The route, stage by stage, with a sticky rail that tracks progress and a
 * payload that visibly grows as the unit moves down the line.
 *
 * All stage content is in the normal document flow, so the section is complete
 * and readable with JavaScript off and with motion disabled. The rail's active
 * state is the only thing script adds.
 */
export function StageSequence() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-stage"));
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const el of refs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-16">
      {/* Progress rail */}
      <div className="hidden lg:block">
        <ol className="sticky top-28 flex flex-col gap-0.5" aria-hidden="true">
          {stages.map((s, i) => (
            <li
              key={s.seq}
              className={`flex items-baseline gap-3 border-l-2 py-2.5 pl-4 transition-colors duration-300 ${
                i <= active
                  ? "border-signal text-line-050"
                  : "border-[var(--rule)] text-steel-600"
              }`}
            >
              <span className="data text-xs">{s.seq}</span>
              <span className="text-sm">{s.name}</span>
            </li>
          ))}
          <li className="mt-6 border-l-2 border-[var(--rule)] py-2 pl-4">
            <span className="data text-[0.625rem] tracking-wide text-steel-600">
              PAYLOAD SO FAR
            </span>
            <span className="data mt-1.5 block text-2xl text-signal">
              {cumulative(active)}
            </span>
            <span className="data text-[0.625rem] text-steel-600">fields captured</span>
          </li>
        </ol>
      </div>

      {/* Stages */}
      <ol className="flex flex-col">
        {stages.map((s, i) => (
          <li
            key={s.seq}
            data-stage={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="reveal border-t border-[var(--rule)] py-9 first:border-t-0 first:pt-0"
          >
            <div className="flex items-baseline gap-4">
              <span className="data text-sm text-signal">{s.seq}</span>
              <h3 className="text-lg md:text-xl">{s.name}</h3>
            </div>
            <p className="prose-measure mt-3 text-[0.9375rem] leading-relaxed text-line-050">
              {s.plain}
            </p>
            <p className="prose-measure mt-3 text-sm leading-relaxed text-steel-400">
              {s.detail}
            </p>
            <div className="mt-5">
              <p className="data mb-2.5 text-[0.625rem] tracking-wide text-steel-600">
                CAPTURED HERE
              </p>
              <ul className="flex flex-wrap gap-2">
                {s.captured.map((c) => (
                  <li key={c} className="chip">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function cumulative(upTo: number): number {
  return stages.slice(0, upTo + 1).reduce((n, s) => n + s.captured.length, 0);
}
