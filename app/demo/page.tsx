import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { DemoExplorer } from "@/components/demo/demo-explorer";
import { RecallCalculator } from "@/components/demo/recall-calculator";
import { Related } from "@/components/ui/related";
import { CtaBand } from "@/components/ui/cta-band";
import { featuredUnit, demoUnits } from "@/lib/demo-data";
import { pageMetadata } from "@/lib/seo";
import { graph, softwareApplicationSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Live Traceability Demo — Scan a Sample Unit",
  description:
    "Search a sample unit for its full record: components, torque and test values with limits, and raw device payloads. Then run a recall query on a lot code.",
  path: "/demo",
});

export default function DemoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            softwareApplicationSchema(),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Live demo", path: "/demo" },
            ]),
          ),
        }}
      />

      <PageHeader
        eyebrow="Live demo"
        title="Scan a sample unit"
        lede="This runs the same two queries the product exists for. Backward: one unit, its complete history. Forward: one lot code, every unit that consumed it. Nothing here is a screenshot — it is the record, rendered."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Live demo", path: "/demo" },
        ]}
      />

      <section className="shell">
        <h2 className="mb-6 text-xl">Backward trace — one unit, everything about it</h2>
        <DemoExplorer initial={featuredUnit} />
      </section>

      <section className="shell mt-20">
        <h2 className="text-xl">Forward trace — one lot, every unit affected</h2>
        <p className="prose-measure mt-3 mb-6 text-sm leading-relaxed text-steel-400">
          This is the recall query. Two of the lots below span more than one job card, because
          a supplier lot that politely respects your job card boundaries is not a realistic
          containment exercise.
        </p>
        <RecallCalculator />
      </section>

      <section className="shell mt-16">
        <div className="panel-inset p-6">
          <h2 className="data text-[0.6875rem] tracking-wide text-steel-600">
            ABOUT THIS DATASET
          </h2>
          <p className="prose-measure mt-3 text-sm leading-relaxed text-steel-400">
            {demoUnits.length} units across 3 job cards and 8 component lots, built on the
            route that ships with the product as its worked example: a valve body marked at
            operation 10, assembled at 20, torqued at 30 against a 10–14 Nm window, greased at
            40, and hydro and leak tested at 50. It is sample data, not production data from a
            customer, and it is generated so that two units genuinely fail their torque gate —
            because a demo where everything passes teaches you nothing about the software.
          </p>
        </div>
      </section>

      <div className="mt-16">
        <CtaBand
          title="Want this running on your own units?"
          body="Twenty minutes, one line. We list your operations and what each should capture, and tell you which of your machines can be read."
          context="the live demo"
        />
      </div>

      <Related
        links={[
          { href: "/how-it-works", label: "How the record is built", note: "The six stages behind everything on this page." },
          { href: "/features/recall-and-forward-trace", label: "Recall and forward trace", note: "How the containment query stays a lookup as data grows." },
          { href: "/resources/planning-a-recall-scope-calculation", label: "Planning a recall scope calculation", note: "How to run this drill on your own records before you need to." },
        ]}
      />
    </>
  );
}
