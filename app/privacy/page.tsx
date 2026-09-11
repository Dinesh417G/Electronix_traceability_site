import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { site, addressOneLine } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { Related } from "@/components/ui/related";

export const metadata: Metadata = pageMetadata({
  title: "Privacy — ElectronIx Trace",
  description:
    "What ElectronIx collects from this website, why, how long it is kept and how to have it removed.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="What we collect, and what we do with it"
        lede="Short, because there is not much of it. This covers this website only — it says nothing about data inside a Trace installation, which lives on your own hardware and which we never see."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ]}
      />
      <div className="shell max-w-[46rem] pb-16">
        <Block title="Who we are">
          <p>
            ElectronIx, a GST-registered sole proprietorship at {addressOneLine}. Contact{" "}
            <a href={`mailto:${site.email}`} className="text-line-050 underline underline-offset-2">
              {site.email}
            </a>{" "}
            or {site.phone}.
          </p>
        </Block>
        <Block title="What the enquiry form collects">
          <p>
            Your name, company, phone, email and whatever you choose to tell us about your
            plant: city, what you make, how many lines, which machines, and your message. We
            also record which page you submitted from and, if you arrived through a campaign
            link, the campaign parameters in that link and the referring site.
          </p>
        </Block>
        <Block title="Why">
          <p>
            To reply to you and to prepare for the walkthrough you asked for. That is the only
            purpose. We do not sell it, share it with a partner network, or add you to a
            newsletter you did not ask for.
          </p>
        </Block>
        <Block title="Where it is stored">
          <p>
            In a Supabase-hosted PostgreSQL database. The table is configured so that the
            public web key can insert an enquiry and cannot read any enquiry back — including
            yours. Reading requires a server-side credential that is never sent to a browser.
          </p>
        </Block>
        <Block title="Analytics">
          <p>
            If analytics is enabled on this site it is Google Analytics 4 with IP anonymisation,
            measuring page views and a small number of interaction events — a form submission, a
            WhatsApp click, using the demo or the calculator. It is not used to build a profile
            of you, and the site is fully usable with it blocked.
          </p>
        </Block>
        <Block title="How long we keep it">
          <p>
            Enquiries are kept while there is an active conversation and for two years after,
            so that we can pick up a thread when a plant comes back to a project. After that
            they are deleted.
          </p>
        </Block>
        <Block title="Having it removed">
          <p>
            Email or message us and ask. We will delete your enquiry and confirm that it is
            done. You do not need to give a reason and it will not affect anything else.
          </p>
        </Block>
        <Block title="Your production data">
          <p>
            Nothing an ElectronIx Trace installation captures reaches this website or us. It
            lives in a PostgreSQL database on hardware you own, in your plant. There is no
            hosted service in the runtime path and no telemetry back to us.
          </p>
        </Block>
        <p className="mt-10 border-t border-[var(--rule)] pt-5 text-xs text-steel-600">
          Last updated 11 September 2026.
        </p>
      </div>

      <Related
        links={[
          { href: "/", label: "ElectronIx Trace", note: "Per-unit traceability for manufacturing plants." },
          { href: "/contact", label: "Contact us", note: "Ask a question, or have your enquiry deleted." },
          { href: "/demo", label: "Live demo", note: "A sample unit's record, using no data of yours." },
        ]}
      />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[var(--rule)] py-6">
      <h2 className="text-lg">{title}</h2>
      <div className="mt-3 text-[0.9375rem] leading-[1.75] text-steel-400">{children}</div>
    </section>
  );
}
