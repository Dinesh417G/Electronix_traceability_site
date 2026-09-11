import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Related } from "@/components/ui/related";
import { CtaBand } from "@/components/ui/cta-band";
import { Faq } from "@/components/ui/faq";
import { LeadForm } from "@/components/lead-form";
import { pageMetadata } from "@/lib/seo";
import { graph, softwareApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Traceability Software Pricing — ElectronIx Trace",
  description:
    "ElectronIx Trace is quoted per plant, not per seat. Here is exactly what drives the price, what is included, and what would make it more expensive.",
  path: "/pricing",
});

const pricingFaqs = [
  {
    q: "Why is there no price on this page?",
    a: "Because a number here would be a guess, and you would find out it was wrong at the worst moment. The honest version is the list above: station count, how many need instrument integration, and whether you need direct part marking. Send those three and you get a number, not a discovery process.",
  },
  {
    q: "Is it a subscription or a one-time licence?",
    a: "A subscription per plant. It covers updates and support. What it does not do is hold your production hostage — if it lapses, capture continues and only configuration changes and cloud sync are restricted.",
  },
  {
    q: "Do you charge per user?",
    a: "No. Operators are not seats. A plant pays for its stations, not for how many people log in to them.",
  },
  {
    q: "What is not included?",
    a: "Hardware. Printers, scanners, terminals, the edge box and any marking equipment are bought by you — we will spec them, and we would rather you buy them from whoever gives you the best price locally than mark them up.",
  },
  {
    q: "Is there a free trial?",
    a: "Not a downloadable one. What we do instead is a walkthrough: we configure your route, simulate it with no hardware attached, and show you the record it would produce for your product. That tells you more than a trial installer would.",
  },
] as const;

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            softwareApplicationSchema(),
            faqSchema(pricingFaqs),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Pricing", path: "/pricing" },
            ]),
          ),
        }}
      />

      <PageHeader
        eyebrow="Pricing"
        title="What drives the price of a traceability system"
        lede="We quote per plant. Rather than publish a number that would be wrong for most plants, here is the honest list of what moves it up and down, so you can estimate before you speak to us."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ]}
      />

      <section className="shell">
        <h2 className="text-2xl">What moves the price</h2>
        <ul className="mt-8 border-t border-[var(--rule)]">
          {DRIVERS.map((d) => (
            <li
              key={d.factor}
              className="reveal grid gap-3 border-b border-[var(--rule)] py-6 md:grid-cols-[15rem_1fr] md:gap-8"
            >
              <div>
                <p className="text-[0.9375rem] text-line-050">{d.factor}</p>
                <p className="data mt-1 text-xs text-signal">{d.effect}</p>
              </div>
              <p className="text-sm leading-relaxed text-steel-400">{d.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell mt-16">
        <div className="grid gap-px bg-[var(--rule)] md:grid-cols-2">
          <div className="bg-graphite-950 p-6 md:p-8">
            <h2 className="text-xl">Included</h2>
            <ul className="mt-5 space-y-3">
              {INCLUDED.map((i) => (
                <li key={i} className="border-t border-[var(--rule)] pt-3 text-sm leading-relaxed text-steel-400">
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-graphite-900 p-6 md:p-8">
            <h2 className="text-xl">Not included</h2>
            <ul className="mt-5 space-y-3">
              {EXCLUDED.map((i) => (
                <li key={i} className="border-t border-[var(--rule)] pt-3 text-sm leading-relaxed text-steel-400">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="shell mt-16">
        <div className="panel p-6 md:p-8">
          <h2 className="text-xl">How this compares</h2>
          <p className="prose-measure mt-4 text-[0.9375rem] leading-relaxed text-steel-400">
            Industry reporting puts enterprise IATF-focused quality and traceability platforms
            at USD 50,000 or more per year, scaling with users, modules and deployment. Those
            systems do far more than Trace does, and for a large regulated manufacturer they
            are worth it. For a 50 to 500 person plant that needs a defensible per-unit record,
            they are not a realistic starting point — which is the gap this product exists in.
          </p>
          <p className="mt-4 text-sm text-steel-500">
            The per-competitor detail is on the comparison pages:{" "}
            <Link href="/vs/siemens-opcenter" className="text-line-050 underline underline-offset-4 hover:text-signal">
              versus Siemens Opcenter
            </Link>
            ,{" "}
            <Link href="/vs/aidc-integrators" className="text-line-050 underline underline-offset-4 hover:text-signal">
              versus a barcode integrator project
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="shell mt-16">
        <h2 className="text-2xl">Pricing questions</h2>
        <div className="mt-8">
          <Faq items={pricingFaqs} />
        </div>
      </section>

      <section className="shell mt-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="text-2xl">Get a quote</h2>
            <p className="prose-measure mt-4 text-[0.9375rem] leading-relaxed text-steel-400">
              Tell us how many lines, roughly how many stations, and which machines or
              instruments you would want read. That is enough for a number. If we need
              anything else we will ask one question, not send a requirements document.
            </p>
          </div>
          <LeadForm sourcePage="/pricing" />
        </div>
      </section>

      <div className="mt-16">
        <CtaBand
          title="Would you rather talk it through?"
          body="Call or message and describe your line. We will give you a range on the phone."
          context="pricing"
        />
      </div>

      <Related
        links={[
          { href: "/demo", label: "See what you would be buying", note: "A sample unit's full record and the recall query." },
          { href: "/how-it-works", label: "How it works", note: "Six stages, and what each captures." },
          { href: "/resources/mes-or-standalone-traceability", label: "MES or standalone traceability", note: "How to avoid over-buying, written honestly." },
        ]}
      />
    </>
  );
}

const DRIVERS = [
  {
    factor: "Number of stations",
    effect: "Largest factor",
    detail:
      "A station is a point where a unit is identified and something is captured. One terminal running your whole route is one station; twelve operations across twelve terminals is twelve. This is the main thing the subscription is sized on.",
  },
  {
    factor: "Instrumented versus manual stations",
    effect: "Moderate",
    detail:
      "A manual station is configuration. A station reading a torque controller, a leak tester or a PLC needs the interface set up and validated against the actual device, which is real engineering time.",
  },
  {
    factor: "Direct part marking",
    effect: "Significant, if needed",
    detail:
      "Laser marking adds the marker itself plus DPM-capable imagers at every downstream station that reads identity. If a printed label survives your process, you do not need any of it — and we will say so.",
  },
  {
    factor: "Number of product routes",
    effect: "Small",
    detail:
      "Routes are configuration, so a second product is not a second project. Very high product variety takes more configuration time up front, but it does not multiply the licence.",
  },
  {
    factor: "Number of plants",
    effect: "Linear",
    detail:
      "One edge box per plant, quoted per plant. Multi-plant is in the schema from the first migration, so a second site is configuration rather than a migration project.",
  },
  {
    factor: "Distance from Coimbatore",
    effect: "Travel only",
    detail:
      "Commissioning is on site. Within Tamil Nadu that is a day. Further afield it is travel cost, quoted at cost and stated up front rather than buried in the licence.",
  },
] as const;

const INCLUDED = [
  "The edge service, station agents and all route, gate and capture configuration",
  "Your label templates loaded, versioned and driving the printer directly",
  "Route and device simulation, so configuration is validated before commissioning",
  "Signed over-the-air updates with automatic rollback, and the offline USB path",
  "Support direct from the engineer who wrote the software",
  "Your data in a standard PostgreSQL database you own and can export at any time",
] as const;

const EXCLUDED = [
  "Hardware: terminals, scanners, printers, the edge box, marking equipment",
  "Network cabling and shop floor infrastructure",
  "ERP integration — there is no built connector, and we will not invoice you for one that does not exist",
  "Your quality system. Software produces evidence; it does not produce compliance",
  "24/7 cover. There is one engineer, and pretending otherwise would be the wrong way to start",
] as const;
