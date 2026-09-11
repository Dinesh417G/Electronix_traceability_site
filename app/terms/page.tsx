import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { site, addressOneLine } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { Related } from "@/components/ui/related";

export const metadata: Metadata = pageMetadata({
  title: "Terms — ElectronIx Trace",
  description: "Terms covering the use of this website and what it does and does not promise.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terms"
        title="Terms of use for this website"
        lede="These cover the website. The terms of an actual ElectronIx Trace deployment are in the quotation and agreement you sign, and those take precedence over anything written here."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ]}
      />
      <div className="shell max-w-[46rem] pb-16">
        <Block title="Who these terms are with">
          <p>
            ElectronIx, a GST-registered sole proprietorship at {addressOneLine}. Contact{" "}
            <a href={`mailto:${site.email}`} className="text-line-050 underline underline-offset-2">
              {site.email}
            </a>
            .
          </p>
        </Block>
        <Block title="What this site is">
          <p>
            Product and company information. Nothing on it is a contractual commitment, a
            quotation, or a warranty of fitness for a particular purpose. A quotation is a
            document we send you with your name on it.
          </p>
        </Block>
        <Block title="The demo and calculator">
          <p>
            The live demo and the recall scope calculator run against a generated sample
            dataset. The units, serials, lot codes and customer names in them are invented for
            illustration. They are not production data from any customer, and no output from
            them should be used for an actual containment decision.
          </p>
        </Block>
        <Block title="Certification">
          <p>
            ElectronIx Trace is not certified to any standard, and neither ElectronIx nor this
            software can make your plant compliant with IATF 16949, ISO 9001 or any other
            standard. The software is designed to produce evidence an auditor asks for. Your
            quality system remains yours.
          </p>
        </Block>
        <Block title="Capability descriptions">
          <p>
            This site describes the ElectronIx Trace product as designed, including
            capabilities at different stages of release. If a specific capability is decisive
            for your purchase, ask us to confirm its current state in writing before you
            commit, and we will.
          </p>
        </Block>
        <Block title="Links out">
          <p>
            Where we name other vendors or link to third-party sites, we are not responsible
            for their content and naming them is not an endorsement or a partnership.
          </p>
        </Block>
        <Block title="Governing law">
          <p>
            These terms are governed by the laws of India, and the courts at Coimbatore, Tamil
            Nadu have jurisdiction.
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
