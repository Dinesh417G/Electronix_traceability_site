import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { StageSequence } from "@/components/sections/stage-sequence";
import { Related } from "@/components/ui/related";
import { CtaBand } from "@/components/ui/cta-band";
import { stages, hardware } from "@/content/home";
import { pageMetadata } from "@/lib/seo";
import { graph, howToSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "How ElectronIx Trace Works — Job Card to Scan",
  description:
    "The six stages a unit passes through in ElectronIx Trace, what is captured at each one, and what comes back when someone scans the code on the finished product.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            howToSchema(stages.map((s) => ({ name: s.name, text: s.plain }))),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "How it works", path: "/how-it-works" },
            ]),
          ),
        }}
      />

      <PageHeader
        eyebrow="How it works"
        title="From job card to a scan that returns everything"
        lede="A unit is born against a job card, collects a record at every operation, and carries an identity that returns the whole thing when it is scanned. Here is each stage and exactly what it adds."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "How it works", path: "/how-it-works" },
        ]}
      />

      <section className="shell">
        <h2 className="mb-10 text-2xl">The six stages</h2>
        <StageSequence />
      </section>

      <section className="shell mt-20">
        <h2 className="text-2xl">What the operator sees</h2>
        <p className="prose-measure mt-4 text-[0.9375rem] leading-relaxed text-steel-400">
          A station terminal shows one unit, one operation and one list of what must be true
          before that unit can advance. The gates are named, so a blocked unit tells the
          operator which condition failed rather than showing an error code.
        </p>
        <ul className="mt-8 grid gap-px bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-4">
          {GATES.map((g) => (
            <li key={g.name} className="reveal bg-graphite-950 p-5">
              <p className="data text-xs text-signal">{g.name}</p>
              <p className="mt-2.5 text-sm leading-relaxed text-steel-400">{g.what}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-steel-500">
          The interlock is released only after every other gate on that operation is green.
          That ordering is what makes it a poka-yoke rather than a suggestion — more in{" "}
          <Link
            href="/features/route-configuration"
            className="text-line-050 underline underline-offset-4 hover:text-signal"
          >
            route configuration
          </Link>
          .
        </p>
      </section>

      <section className="shell mt-20">
        <h2 className="text-2xl">When something fails</h2>
        <div className="mt-8 grid gap-px bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-4">
          {FAILURES.map((f) => (
            <div key={f.name} className="reveal bg-graphite-950 p-5">
              <p className="data text-xs text-signal">{f.name}</p>
              <p className="mt-2.5 text-sm leading-relaxed text-steel-400">{f.what}</p>
            </div>
          ))}
        </div>
        <p className="prose-measure mt-6 text-sm leading-relaxed text-steel-400">
          A rework loop names the operations it invalidates, and those must be performed again
          before the unit can advance. Both attempts stay in the record. An audit that cannot
          see the loop has not seen the truth, so the software will not hide it for you.
        </p>
      </section>

      <section className="shell mt-20">
        <h2 className="text-2xl">What it runs on</h2>
        <div className="mt-8 grid gap-10 md:grid-cols-3">
          {hardware.map((h) => (
            <div key={h.group} className="reveal">
              <h3 className="data text-xs tracking-wide text-signal">{h.group}</h3>
              <ul className="mt-4 space-y-3">
                {h.items.map((i) => (
                  <li key={i} className="border-t border-[var(--rule)] pt-3 text-sm leading-relaxed text-steel-400">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-20">
        <CtaBand context="how Trace would map onto our line" />
      </div>

      <Related
        links={[
          { href: "/demo", label: "See a sample unit's record", note: "The output of all six stages, on one unit." },
          { href: "/features/route-configuration", label: "Route configuration", note: "Gates, failure paths and validated route graphs." },
          { href: "/pricing", label: "What it costs", note: "What actually drives the price of a traceability system." },
        ]}
      />
    </>
  );
}

const GATES = [
  { name: "IDENTITY", what: "A valid unit identity has been scanned, or read back from the mark on the part." },
  { name: "OPERATOR_AUTH", what: "An operator is logged in and holds the skill certification this operation requires." },
  { name: "PRECONDITION", what: "Every required predecessor operation is complete for this unit." },
  { name: "COMPONENT_VERIFY", what: "Scanned components match the expected BOM lines. A wrong part is a hard stop." },
  { name: "DATA_CAPTURE", what: "All mandatory capture points are recorded and within their configured limits." },
  { name: "TEST_PASS", what: "The named test's verdict is a pass, with its readings behind it." },
  { name: "MARK_VERIFIED", what: "The applied mark was read back and matches the intended identity." },
  { name: "INTERLOCK_OUT", what: "Release signal to the PLC or fixture, emitted only after every other gate is green." },
] as const;

const FAILURES = [
  { name: "RETRY", what: "The operator tries again, up to a bounded number of attempts at this operation." },
  { name: "REWORK", what: "The unit goes back to a named operation, and the operations it invalidates must be redone." },
  { name: "QUARANTINE", what: "The unit is held for a supervisor decision rather than being allowed forward." },
  { name: "SCRAP", what: "Terminal. The identity is retired forever and can never be reissued to another unit." },
] as const;
