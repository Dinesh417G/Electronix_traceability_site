import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { industries, industryBySlug, industrySlugs } from "@/content/industries";
import { featureBySlug } from "@/content/features";
import { PageHeader } from "@/components/ui/page-header";
import { Related } from "@/components/ui/related";
import { CtaBand } from "@/components/ui/cta-band";
import { Faq } from "@/components/ui/faq";
import { pageMetadata } from "@/lib/seo";
import { graph, serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return industrySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = industryBySlug(slug);
  if (!industry) return {};
  return pageMetadata({
    title: industry.title,
    description: industry.description,
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = industryBySlug(slug);
  if (!industry) notFound();

  const feature = featureBySlug(industry.relatedFeature);
  const others = industries.filter((i) => i.slug !== industry.slug).slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            serviceSchema({
              name: industry.title,
              description: industry.description,
              path: `/industries/${industry.slug}`,
            }),
            faqSchema(industry.faq),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: industry.name, path: `/industries/${industry.slug}` },
            ]),
          ),
        }}
      />

      <PageHeader
        eyebrow="Industry"
        title={industry.h1}
        lede={industry.lede}
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: industry.name, path: `/industries/${industry.slug}` },
        ]}
      />

      <section className="shell">
        <div className="panel p-6 md:p-8">
          <h2 className="data text-[0.6875rem] tracking-wide text-signal">
            THE SITUATION THIS IS FOR
          </h2>
          <p className="prose-measure mt-4 text-base leading-relaxed text-line-050">
            {industry.scenario}
          </p>
        </div>
      </section>

      <section className="shell mt-16">
        <h2 className="text-2xl">What gets captured</h2>
        <ul className="mt-8 border-t border-[var(--rule)]">
          {industry.capturePoints.map((c) => (
            <li
              key={c.point}
              className="reveal grid gap-2 border-b border-[var(--rule)] py-5 md:grid-cols-[16rem_1fr] md:gap-8"
            >
              <span className="data text-sm text-line-050">{c.point}</span>
              <span className="text-sm leading-relaxed text-steel-400">{c.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell mt-16">
        <h2 className="text-2xl">A route for this product</h2>
        <p className="prose-measure mt-3 text-sm leading-relaxed text-steel-400">
          Routes are configuration, so this is a starting point rather than a fixed template.
          Yours is built from your operations at the walkthrough.
        </p>
        <ol className="mt-8 border-t border-[var(--rule)]">
          {industry.routeExample.map((step) => (
            <li
              key={step}
              className="data reveal border-b border-[var(--rule)] py-4 text-sm text-line-050"
            >
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="shell mt-16">
        <h2 className="text-2xl">Questions from this industry</h2>
        <div className="mt-8">
          <Faq items={industry.faq} />
        </div>
      </section>

      <div className="mt-16">
        <CtaBand
          title={`Talk about traceability for ${industry.name.toLowerCase()}`}
          context={industry.name.toLowerCase()}
        />
      </div>

      <Related
        title="Keep reading"
        links={[
          ...(feature
            ? [{ href: `/features/${feature.slug}`, label: feature.name, note: feature.description }]
            : []),
          ...others.map((o) => ({
            href: `/industries/${o.slug}`,
            label: o.name,
            note: o.lede,
          })),
        ]}
      />

      <div className="shell pb-16">
        <p className="text-sm text-steel-500">
          Not sure a full MES is the right answer?{" "}
          <Link
            href="/resources/mes-or-standalone-traceability"
            className="text-line-050 underline underline-offset-4 hover:text-signal"
          >
            Read how to choose between MES and standalone traceability
          </Link>
          .
        </p>
      </div>
    </>
  );
}
