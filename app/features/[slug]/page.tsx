import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { features, featureBySlug, featureSlugs } from "@/content/features";
import { industryBySlug } from "@/content/industries";
import { resourceBySlug } from "@/content/resources";
import { PageHeader } from "@/components/ui/page-header";
import { Related } from "@/components/ui/related";
import { CtaBand } from "@/components/ui/cta-band";
import { pageMetadata } from "@/lib/seo";
import { graph, softwareApplicationSchema, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return featureSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const feature = featureBySlug(slug);
  if (!feature) return {};
  return pageMetadata({
    title: feature.title,
    description: feature.description,
    path: `/features/${feature.slug}`,
  });
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = featureBySlug(slug);
  if (!feature) notFound();

  const industry = industryBySlug(feature.relatedIndustry);
  const resource = resourceBySlug(feature.relatedResource);
  const others = features.filter((f) => f.slug !== feature.slug).slice(0, 1);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            softwareApplicationSchema(),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: feature.name, path: `/features/${feature.slug}` },
            ]),
          ),
        }}
      />

      <PageHeader
        eyebrow={`Capability · for ${feature.audience}`}
        title={feature.h1}
        lede={feature.lede}
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: feature.name, path: `/features/${feature.slug}` },
        ]}
      />

      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div className="border-t border-[var(--rule)]">
            {feature.points.map((p) => (
              <div key={p.heading} className="reveal border-b border-[var(--rule)] py-8">
                <h2 className="text-lg md:text-xl">{p.heading}</h2>
                <p className="prose-measure mt-3 text-[0.9375rem] leading-relaxed text-steel-400">
                  {p.body}
                </p>
              </div>
            ))}
          </div>

          <aside className="lg:pt-8">
            <div className="panel sticky top-28 p-6">
              <h2 className="data text-[0.6875rem] tracking-wide text-steel-600">
                AT A GLANCE
              </h2>
              <dl className="mt-4 space-y-3">
                {feature.facts.map((f, i) => (
                  <div key={`${f.label}-${i}`} className="border-t border-[var(--rule)] pt-3">
                    {f.label && (
                      <dt className="data text-[0.625rem] tracking-wide text-steel-600">
                        {f.label}
                      </dt>
                    )}
                    <dd className="data mt-1 text-xs leading-relaxed break-words text-line-050">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <Link href="/demo" className="btn btn-secondary mt-6 w-full !text-sm">
                See it on a sample unit
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <div className="mt-16">
        <CtaBand context={feature.name.toLowerCase()} />
      </div>

      <Related
        title="Where this matters"
        links={[
          ...(industry
            ? [
                {
                  href: `/industries/${industry.slug}`,
                  label: industry.name,
                  note: industry.lede,
                },
              ]
            : []),
          ...(resource
            ? [
                {
                  href: `/resources/${resource.slug}`,
                  label: resource.title,
                  note: resource.description,
                },
              ]
            : []),
          ...others.map((o) => ({
            href: `/features/${o.slug}`,
            label: o.name,
            note: o.description,
          })),
        ]}
      />
    </>
  );
}
