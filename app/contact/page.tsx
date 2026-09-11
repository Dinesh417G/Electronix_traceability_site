import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { LeadForm } from "@/components/lead-form";
import { WhatsAppCta } from "@/components/ui/whatsapp-cta";
import { Related } from "@/components/ui/related";
import { site, addressOneLine } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { graph, localBusinessSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Talk to the Engineer — ElectronIx Trace, Coimbatore",
  description:
    "Book a 20-minute line walkthrough with ElectronIx in Coimbatore. We list what each operation should capture and tell you which of your machines can be read.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            localBusinessSchema(),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
          ),
        }}
      />

      <PageHeader
        eyebrow="Contact"
        title="Book a 20-minute line walkthrough"
        lede="We walk one line, list the operations and what each should capture, and tell you plainly which of your machines can be read and which cannot. You get that list either way, whether or not you buy anything."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <section className="shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <div className="panel p-6">
              <h2 className="data text-[0.6875rem] tracking-wide text-steel-600">
                DIRECT
              </h2>
              <dl className="mt-4 space-y-4">
                <div className="border-t border-[var(--rule)] pt-4">
                  <dt className="data text-[0.625rem] tracking-wide text-steel-600">
                    Phone and WhatsApp
                  </dt>
                  <dd>
                    <a
                      href={`tel:${site.phoneDial}`}
                      className="data text-lg text-line-050 hover:text-signal"
                    >
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div className="border-t border-[var(--rule)] pt-4">
                  <dt className="data text-[0.625rem] tracking-wide text-steel-600">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-[0.9375rem] text-line-050 hover:text-signal"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div className="border-t border-[var(--rule)] pt-4">
                  <dt className="data text-[0.625rem] tracking-wide text-steel-600">
                    Workshop
                  </dt>
                  <dd>
                    <address className="mt-1 text-sm leading-relaxed not-italic text-steel-400">
                      {addressOneLine}
                    </address>
                  </dd>
                </div>
              </dl>
              <div className="mt-6">
                <WhatsAppCta context="a line walkthrough" className="btn btn-secondary w-full" />
              </div>
            </div>

            <div className="panel-inset mt-6 p-6">
              <h2 className="data text-[0.6875rem] tracking-wide text-steel-600">
                WHAT TO EXPECT
              </h2>
              <ol className="mt-4 space-y-3">
                {EXPECT.map((e, i) => (
                  <li key={e} className="flex gap-3 text-sm leading-relaxed text-steel-400">
                    <span className="data mt-0.5 shrink-0 text-xs text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{e}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <LeadForm sourcePage="/contact" />
        </div>
      </section>

      <Related
        links={[
          { href: "/pricing", label: "What drives the price", note: "Estimate before you speak to us." },
          { href: "/demo", label: "Live demo", note: "A sample unit's record and the recall query." },
          { href: "/how-it-works", label: "How it works", note: "The six stages and what each captures." },
        ]}
      />
    </>
  );
}

const EXPECT = [
  "A call or a visit, twenty minutes, no slide deck.",
  "We ask about one line: the operations, what is measured, what goes wrong.",
  "You get a written list of capture points and which machines can be read.",
  "If Trace is not the right answer for you, we will say so on that call.",
] as const;
