import Link from "next/link";
import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { HeroTrace } from "@/components/sections/hero-trace";
import { StageSequence } from "@/components/sections/stage-sequence";
import { ProductTour } from "@/components/sections/product-tour";
import { DemoExplorer } from "@/components/demo/demo-explorer";
import { RecallCalculator } from "@/components/demo/recall-calculator";
import { WhatsAppCta } from "@/components/ui/whatsapp-cta";
import { LeadForm } from "@/components/lead-form";
import { Faq } from "@/components/ui/faq";
import { scenarios, roles, hardware, rollout, faqs, stages } from "@/content/home";
import { industries } from "@/content/industries";
import { features } from "@/content/features";
import { featuredUnit } from "@/lib/demo-data";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { graph, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema";
import { ScrollRegion } from "@/components/ui/scroll-region";

export const metadata: Metadata = pageMetadata({
  title: "ElectronIx Trace — Product Traceability Software",
  description:
    "Per-unit traceability for manufacturing plants. Capture torque, components and test values at every station, then scan the code for the full history.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            faqSchema(faqs),
            howToSchema(stages.map((s) => ({ name: s.name, text: s.plain }))),
            breadcrumbSchema([{ name: "Home", path: "/" }]),
          ),
        }}
      />

      {/* 1 — Hero */}
      <section className="shell pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <p className="section-index mb-5">ElectronIx Trace · product traceability</p>
            <h1 className="text-[2rem] leading-[1.1] sm:text-[2.5rem] md:text-[3.25rem]">
              Know exactly which units are affected. Then prove it.
            </h1>
            <p className="prose-measure mt-6 text-base leading-relaxed text-steel-400 md:text-lg">
              ElectronIx Trace records what went into every unit you build, what was done to
              it, who did it and what it measured. Scan the code on the product and the whole
              history comes back — in seconds, on your own hardware, with or without a network.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn btn-primary">
                Book a 20-minute line walkthrough
              </Link>
              <a href="#live-demo" className="btn btn-secondary">
                Scan a live sample unit
              </a>
            </div>
            <p className="mt-6 text-sm text-steel-600">
              On-premise. Works with no internet. Quoted per plant, not per seat.
            </p>
          </div>
          <HeroTrace />
        </div>
      </section>

      {/* 2 — The cost of not knowing */}
      <Section
        index="01"
        title="What it costs when the record is not there"
        lede="Four situations that arrive without warning. In each one the difference between a bad day and a bad quarter is whether you can answer at the level of a single unit."
      >
        <div className="grid gap-px bg-[var(--rule)] sm:grid-cols-2">
          {scenarios.map((s) => (
            <div key={s.title} className="reveal bg-graphite-950 p-6 md:p-8">
              <h3 className="text-base">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-steel-400">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 3 — How it works */}
      <Section
        index="02"
        title="From job card to a scan that returns everything"
        lede="Six stages. Each one adds to the record, and the record is what you get back when someone scans the product."
        id="how-it-works"
      >
        <StageSequence />
        <p className="mt-10 text-sm text-steel-500">
          Read the longer version in{" "}
          <Link href="/how-it-works" className="text-line-050 underline underline-offset-4 hover:text-signal">
            how ElectronIx Trace works
          </Link>
          .
        </p>
      </Section>

      {/* 4 — Live demo */}
      <Section
        index="03"
        title="A sample unit, with its real record"
        lede="This is the record, not a picture of one. Search a serial, filter the captured values, open a reading to see the exact bytes the instrument returned, and download the whole history."
        id="live-demo"
      >
        <DemoExplorer initial={featuredUnit} />
        <p className="mt-4 text-xs text-steel-600">
          Sample dataset: 24 units across 3 job cards and several component lots, built on the
          route the product ships as its worked example.
        </p>
      </Section>

      {/* 5 — Recall calculator */}
      <Section
        index="04"
        title="A supplier calls about a lot. How wide is the problem?"
        lede="This is the query the whole system exists to answer. Give it a lot code and it returns the units that consumed it, the customers they went to, the containment window — and how many units are provably clean."
        id="recall"
      >
        <RecallCalculator />
        <p className="mt-4 text-xs text-steel-600">
          Running against the sample dataset above. On your plant it runs against your units,
          as an indexed lookup rather than an overnight report.
        </p>
      </Section>

      {/* 6 — Product tour */}
      <Section
        index="05"
        title="Your data, the way you need to see it"
        lede="The screens a plant actually uses: find a unit, see what is blocking the line, watch a parameter drift before it fails, and manage the templates and stations behind it."
      >
        <ProductTour />
      </Section>

      {/* 7 — Roles */}
      <Section
        index="06"
        title="What changes, depending on where you sit"
      >
        <div className="grid gap-px bg-[var(--rule)] md:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <div key={r.role} className="reveal bg-graphite-950 p-6">
              <h3 className="data text-xs tracking-wide text-signal">{r.role}</h3>
              <ul className="mt-4 space-y-2.5">
                {r.lines.map((l) => (
                  <li key={l} className="text-sm leading-relaxed text-steel-400">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Five roles in a three-column grid leaves a hole. Rather than leave
              an empty cell, the last one earns its place. */}
          <Link
            href="/contact"
            className="reveal group flex flex-col justify-between bg-graphite-900 p-6 transition-colors hover:bg-graphite-800"
          >
            <h3 className="data text-xs tracking-wide text-steel-500">
              None of these quite you?
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-line-050 group-hover:text-signal">
              Describe your line and we will tell you what Trace would capture at each
              station, and what it would not.
            </p>
          </Link>
        </div>
      </Section>

      {/* 8 — Industries */}
      <Section
        index="07"
        title="Built for discrete manufacturing, configured per plant"
        lede="Each of these has its own capture points, its own failure scenario and its own route shape. Pick the one closest to your product."
      >
        <div className="grid gap-px bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <Link
              key={i.slug}
              href={`/industries/${i.slug}`}
              className="reveal group bg-graphite-950 p-6 transition-colors hover:bg-graphite-900"
            >
              <h3 className="text-base group-hover:text-signal">{i.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-steel-400">{i.lede}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* 9 — Hardware and integration */}
      <Section
        index="08"
        title="What it connects to"
        lede="Specificity is the proof here, so this list is deliberately concrete. If something you run is not on it, ask — the answer will be a yes or a no, not a maybe."
      >
        <div className="grid gap-10 md:grid-cols-3">
          {hardware.map((h) => (
            <div key={h.group} className="reveal">
              <h3 className="data text-xs tracking-wide text-signal">{h.group}</h3>
              <ul className="mt-4 space-y-3">
                {h.items.map((item) => (
                  <li
                    key={item}
                    className="border-t border-[var(--rule)] pt-3 text-sm leading-relaxed text-steel-400"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* 10 — Honest comparison */}
      <Section
        index="09"
        title="Where we fit, and where we do not"
        lede="Every vendor comparison is written by the vendor. Here is ours, with the places we lose stated first."
      >
        <ScrollRegion
          label="ElectronIx Trace compared with enterprise MES suites and local AIDC integrators"
          className="panel"
        >
          <table className="data-table">
            <caption className="sr-only">
              ElectronIx Trace compared with enterprise MES suites and local AIDC integrators
            </caption>
            <thead>
              <tr>
                <th scope="col" className="min-w-44">
                  &nbsp;
                </th>
                <th scope="col" className="min-w-48">
                  Enterprise MES suite
                </th>
                <th scope="col" className="min-w-48">
                  Local AIDC integrator
                </th>
                <th scope="col" className="min-w-48 !text-signal">
                  ElectronIx Trace
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.criterion}>
                  <th scope="row" className="!border-b !border-[var(--rule)] !py-3 text-left text-xs font-medium !text-steel-400">
                    {row.criterion}
                  </th>
                  <td className="text-xs leading-relaxed text-steel-400">{row.mes}</td>
                  <td className="text-xs leading-relaxed text-steel-400">{row.aidc}</td>
                  <td className="text-xs leading-relaxed text-line-050">{row.trace}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
        <p className="prose-measure mt-6 text-sm leading-relaxed text-steel-400">
          The three rows at the top are ones we lose, and they are real. If a validated MES,
          deep ERP connectors or a global support organisation is what decides your purchase,
          buy the suite — you will not be happy with us.
        </p>
        <p className="mt-4 text-sm text-steel-500">
          Longer, per-competitor versions:{" "}
          <Link href="/vs/siemens-opcenter" className="text-line-050 underline underline-offset-4 hover:text-signal">
            versus Siemens Opcenter
          </Link>
          ,{" "}
          <Link href="/vs/aidc-integrators" className="text-line-050 underline underline-offset-4 hover:text-signal">
            versus a barcode integrator project
          </Link>
          .
        </p>
      </Section>

      {/* 11 — Deployment */}
      <Section
        index="10"
        title="What the first month looks like"
        lede="One line first. If the record it produces is not what you wanted, you have spent three weeks, not a year."
      >
        <ol className="grid gap-px bg-[var(--rule)] md:grid-cols-2 lg:grid-cols-4">
          {rollout.map((r) => (
            <li key={r.phase} className="reveal bg-graphite-950 p-6">
              <p className="data text-xs text-signal">{r.phase}</p>
              <h3 className="mt-2 text-base">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-steel-400">{r.body}</p>
              <p className="mt-4 border-t border-[var(--rule)] pt-3 text-xs leading-relaxed text-steel-500">
                <span className="text-steel-600">From you: </span>
                {r.fromYou}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 12 — Who builds this */}
      <Section index="11" title="Who builds this">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="prose-measure">
            <p className="text-base leading-relaxed text-line-050">
              ElectronIx is an industrial automation and software business in Coimbatore, run
              by {site.founder}, with nine years in PLC and SCADA work — Siemens TIA Portal,
              Allen Bradley, Omron Sysmac — electrical design in AutoCAD Electrical and EPLAN,
              Fanuc CNC systems, machine vision, special purpose machines and IIoT.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-steel-400">
              Trace is written in Rust, runs on PostgreSQL, and is supported directly by the
              engineer who wrote it. There is no support tier, no ticket queue and no account
              manager relaying your question to a developer in another country. That is a
              genuine limitation when you want 24/7 cover, and a genuine advantage when you
              want a straight answer about whether your controller can be read.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-steel-400">
              The same shop that builds your panels understands why a licence check must never
              stop a line, why a reprint needs an authoriser, and why a dead RTC battery on a
              panel PC quietly corrupts a traceability record. Those decisions are in the
              product because they were learned on a floor, not in a spec.
            </p>
          </div>
          <div className="panel p-6">
            <h3 className="data text-xs tracking-wide text-steel-600">ENGINEERING FACTS</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Backend", "Rust, no unsafe code anywhere"],
                ["Database", "PostgreSQL 16, on your hardware"],
                ["Edge minimum", "4 cores · 8 GB · 128 GB SSD"],
                ["Station OS", "Windows 10/11 or Linux"],
                ["Internet", "Not required, at any point"],
                ["Updates", "Signed, atomic, auto rollback"],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-wrap justify-between gap-2 border-t border-[var(--rule)] pt-3">
                  <dt className="text-steel-600">{k}</dt>
                  <dd className="data text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {/* 13 — FAQ */}
      <Section
        index="12"
        title="The questions plants actually ask"
        id="faq"
      >
        <Faq items={faqs} />
      </Section>

      {/* 14 — Final CTA */}
      <Section index="13" title="Book a 20-minute line walkthrough" id="contact-form">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="prose-measure text-[0.9375rem] leading-relaxed text-steel-400">
              Twenty minutes on a call or a visit if you are near Coimbatore. We walk one line,
              list the operations and what each should capture, and tell you plainly which of
              your machines can be read and which cannot. You get that list either way, whether
              or not you buy anything.
            </p>
            <div className="mt-8 space-y-4">
              <ContactLine label="Phone and WhatsApp" value={site.phone} href={`tel:${site.phoneDial}`} />
              <ContactLine label="Email" value={site.email} href={`mailto:${site.email}`} />
            </div>
            <div className="mt-6">
              <WhatsAppCta context="a line walkthrough" />
            </div>
            <div className="mt-10 border-t border-[var(--rule)] pt-6">
              <p className="data text-[0.625rem] tracking-wide text-steel-600">
                START HERE INSTEAD
              </p>
              <ul className="mt-3 space-y-2">
                {features.slice(0, 3).map((f) => (
                  <li key={f.slug}>
                    <Link
                      href={`/features/${f.slug}`}
                      className="text-sm text-steel-400 underline underline-offset-4 hover:text-line-050"
                    >
                      {f.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-steel-400 underline underline-offset-4 hover:text-line-050"
                  >
                    What drives the price
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <LeadForm sourcePage="/" />
        </div>
      </Section>
    </>
  );
}

function ContactLine({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div className="border-t border-[var(--rule)] pt-4">
      <p className="data text-[0.625rem] tracking-wide text-steel-600">{label}</p>
      <a href={href} className="data mt-1 block text-base text-line-050 hover:text-signal">
        {value}
      </a>
    </div>
  );
}

const COMPARISON_ROWS = [
  {
    criterion: "Certification and validation",
    mes: "Validated deployments in regulated industries",
    aidc: "Some hold ISO certification as a business",
    trace: "None. We are built to produce audit evidence, not certified",
  },
  {
    criterion: "ERP connectors",
    mes: "Deep, supported SAP and Oracle integration",
    aidc: "Often have a connector to the ERP you run",
    trace: "None built. A documented seam, which is not the same thing",
  },
  {
    criterion: "Support organisation",
    mes: "Global, tiered, 24/7 available",
    aidc: "Local, on site within days",
    trace: "One engineer, in one time zone",
  },
  {
    criterion: "Works with the network down",
    mes: "Usually assumes uptime",
    aidc: "Usually stops capturing",
    trace: "Durable local spool first, network second",
  },
  {
    criterion: "If billing lapses",
    mes: "Varies, rarely stated",
    aidc: "Project is bought outright",
    trace: "Production capture continues. There is no state that stops it",
  },
  {
    criterion: "Process values per unit",
    mes: "Yes, with configuration effort",
    aidc: "Usually scan events only",
    trace: "Torque, grease, readings, with limits and the instrument",
  },
  {
    criterion: "Recall query",
    mes: "Supported, often a reporting job",
    aidc: "Frequently a change request",
    trace: "Indexed lookup, by lot and by machine and time window",
  },
  {
    criterion: "Record integrity",
    mes: "Access control, audit logs",
    aidc: "Ordinary editable tables",
    trace: "Append-only in the database, hash chained per unit",
  },
  {
    criterion: "Time to first line live",
    mes: "Months to quarters",
    aidc: "Bespoke build, schedule varies",
    trace: "Two to three weeks from walkthrough",
  },
  {
    criterion: "Commercial model",
    mes: "Per user and per module, plus implementation",
    aidc: "Project fee, then change requests",
    trace: "Quoted per plant. No per-seat charge",
  },
] as const;
