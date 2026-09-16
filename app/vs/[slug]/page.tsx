import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { comparisons, comparisonBySlug, comparisonSlugs } from "@/content/comparisons";
import { PageHeader } from "@/components/ui/page-header";
import { Related } from "@/components/ui/related";
import { CtaBand } from "@/components/ui/cta-band";
import { pageMetadata } from "@/lib/seo";
import { graph, articleSchema, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return comparisonSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = comparisonBySlug(slug);
  if (!c) return {};
  return pageMetadata({ title: c.title, description: c.description, path: `/vs/${c.slug}` });
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = comparisonBySlug(slug);
  if (!c) notFound();

  const others = comparisons.filter((x) => x.slug !== c.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            articleSchema({
              headline: c.h1,
              description: c.description,
              path: `/vs/${c.slug}`,
              published: "2026-09-11",
            }),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: `Trace vs ${c.competitor}`, path: `/vs/${c.slug}` },
            ]),
          ),
        }}
      />

      <PageHeader
        eyebrow={`Comparison · ${c.category}`}
        title={c.h1}
        lede={c.lede}
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: `vs ${c.competitor}`, path: `/vs/${c.slug}` },
        ]}
      />

      <section className="shell">
        <div className="grid gap-px bg-[var(--rule)] lg:grid-cols-2">
          <div className="bg-graphite-950 p-6 md:p-8">
            <h2 className="text-xl">
              Where {c.competitor} is the better choice
            </h2>
            <p className="mt-2 text-xs text-steel-600">
              Stated first, on purpose. A comparison that concedes nothing is an advert.
            </p>
            <ul className="mt-6 border-t border-[var(--rule)]">
              {c.theyWin.map((p) => (
                <li key={p.point} className="border-b border-[var(--rule)] py-4">
                  <h3 className="text-sm font-semibold text-line-050">{p.point}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel-400">{p.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-graphite-900 p-6 md:p-8">
            <h2 className="text-xl text-signal">Where ElectronIx Trace is</h2>
            <p className="mt-2 text-xs text-steel-600">
              Each of these is something you can test before you buy.
            </p>
            <ul className="mt-6 border-t border-[var(--rule)]">
              {c.weWin.map((p) => (
                <li key={p.point} className="border-b border-[var(--rule)] py-4">
                  <h3 className="text-sm font-semibold text-line-050">{p.point}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel-400">{p.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="shell mt-14">
        <div className="panel p-6 md:p-8">
          <h2 className="data text-[0.6875rem] tracking-wide text-steel-600">The verdict</h2>
          <p className="prose-measure mt-4 text-base leading-relaxed text-line-050">
            {c.verdict}
          </p>
          <div className="mt-8 grid gap-px bg-[var(--rule)] sm:grid-cols-2">
            <div className="bg-graphite-850 p-5">
              <h3 className="data text-[0.625rem] tracking-wide text-steel-600">
                Choose {c.competitor} if
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-steel-400">{c.chooseThem}</p>
            </div>
            <div className="bg-graphite-850 p-5">
              <h3 className="data text-[0.625rem] tracking-wide text-signal">
                Choose ElectronIx Trace if
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-line-050">{c.chooseUs}</p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm text-steel-500">
          Want to check the claims rather than read them?{" "}
          <Link href="/demo" className="text-line-050 underline underline-offset-4 hover:text-signal">
            Run the recall query on a sample dataset
          </Link>{" "}
          or{" "}
          <Link href="/pricing" className="text-line-050 underline underline-offset-4 hover:text-signal">
            see what drives our price
          </Link>
          .
        </p>
      </section>

      <div className="mt-16">
        <CtaBand context={`the comparison with ${c.competitor}`} />
      </div>

      <Related
        title="Other comparisons"
        links={others.map((o) => ({
          href: `/vs/${o.slug}`,
          label: `Trace vs ${o.competitor}`,
          note: o.category,
        }))}
      />
    </>
  );
}
