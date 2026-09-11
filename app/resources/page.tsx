import Link from "next/link";
import type { Metadata } from "next";
import { resources } from "@/content/resources";
import { PageHeader } from "@/components/ui/page-header";
import { CtaBand } from "@/components/ui/cta-band";
import { Related } from "@/components/ui/related";
import { pageMetadata } from "@/lib/seo";
import { graph, collectionPageSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Traceability Guides for Plant Engineers",
  description:
    "Practical writing on manufacturing traceability: IATF audits, torque data over RS485, part genealogy, laser marking and recall scope planning.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            collectionPageSchema({
              name: "Traceability guides",
              description: "Practical writing on manufacturing traceability.",
              path: "/resources",
            }),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Resources", path: "/resources" },
            ]),
          ),
        }}
      />

      <PageHeader
        eyebrow="Resources"
        title="Traceability, written by the engineer who built it"
        lede="No gated whitepapers and no vendor gloss. These are the things we had to work out to ship the product, written for the person who has to make it work on a shop floor."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
        ]}
      />

      <section className="shell">
        <ul className="border-t border-[var(--rule)]">
          {resources.map((r) => (
            <li key={r.slug} className="reveal border-b border-[var(--rule)]">
              <Link href={`/resources/${r.slug}`} className="group block py-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="chip">{r.topic}</span>
                  <span className="data text-xs text-steel-600">
                    {r.readingMinutes} min read
                  </span>
                </div>
                <h2 className="mt-3 max-w-3xl text-xl group-hover:text-signal md:text-2xl">
                  {r.title}
                </h2>
                <p className="prose-measure mt-3 text-sm leading-relaxed text-steel-400">
                  {r.lede}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-16">
        <CtaBand
          title="Would you rather just ask?"
          body="If one of these is close to a problem you have, call and ask. We will give you the answer whether or not it leads anywhere commercially."
          context="one of your traceability guides"
        />
      </div>

      <Related
        title="Start here"
        links={[
          { href: "/how-it-works", label: "How ElectronIx Trace works", note: "The six stages, and what each one captures." },
          { href: "/demo", label: "Live demo", note: "A sample unit's full record, and the recall query." },
          { href: "/pricing", label: "Pricing", note: "What actually drives the price of a traceability system." },
        ]}
      />
    </>
  );
}
