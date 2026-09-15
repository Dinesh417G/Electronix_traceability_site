import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { resources, resourceBySlug, resourceSlugs, type Block } from "@/content/resources";
import { featureBySlug } from "@/content/features";
import { industryBySlug } from "@/content/industries";
import { Related } from "@/components/ui/related";
import { CtaBand } from "@/components/ui/cta-band";
import { pageMetadata } from "@/lib/seo";
import { graph, articleSchema, breadcrumbSchema } from "@/lib/schema";
import { ScrollRegion } from "@/components/ui/scroll-region";

export function generateStaticParams() {
  return resourceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = resourceBySlug(slug);
  if (!r) return {};
  return pageMetadata({
    title: r.metaTitle,
    description: r.description,
    path: `/resources/${r.slug}`,
    ogTitle: r.title,
  });
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = resourceBySlug(slug);
  if (!r) notFound();

  const feature = featureBySlug(r.relatedFeature);
  const industry = industryBySlug(r.relatedIndustry);
  const next = resources.find((x) => x.slug !== r.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            articleSchema({
              headline: r.title,
              description: r.description,
              path: `/resources/${r.slug}`,
              published: r.published,
            }),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Resources", path: "/resources" },
              { name: r.title, path: `/resources/${r.slug}` },
            ]),
          ),
        }}
      />

      <article className="shell pt-10 pb-16 md:pt-14">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-steel-600">
            <li>
              <Link href="/" className="hover:text-line-050">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/resources" className="hover:text-line-050">
                Resources
              </Link>
            </li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <span className="chip">{r.topic}</span>
          <span className="data text-xs text-steel-600">{r.readingMinutes} min read</span>
          <time dateTime={r.published} className="data text-xs text-steel-600">
            {new Date(r.published).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </time>
        </div>

        <h1 className="mt-5 max-w-4xl text-[1.875rem] leading-[1.15] md:text-[2.5rem]">
          {r.title}
        </h1>
        <p className="prose-measure mt-5 text-base leading-relaxed text-steel-400 md:text-lg">
          {r.lede}
        </p>

        <div className="mt-12 max-w-[46rem]">
          {r.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </div>

        <div className="mt-14 border-t border-[var(--rule)] pt-6">
          <p className="text-sm text-steel-500">
            Written by Dinesh Kumar G, ElectronIx, Coimbatore. If something here is wrong or
            incomplete for your process,{" "}
            <Link href="/contact" className="text-line-050 underline underline-offset-4 hover:text-signal">
              tell us
            </Link>{" "}
            — we would rather fix it.
          </p>
        </div>
      </article>

      <CtaBand context={r.title.toLowerCase()} />

      <Related
        title="Related"
        links={[
          ...(feature
            ? [{ href: `/features/${feature.slug}`, label: feature.name, note: feature.description }]
            : []),
          ...(industry
            ? [{ href: `/industries/${industry.slug}`, label: industry.name, note: industry.lede }]
            : []),
          ...(next
            ? [{ href: `/resources/${next.slug}`, label: next.title, note: next.description }]
            : []),
        ]}
      />
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-11 mb-4 text-xl md:text-2xl">{block.text}</h2>;
    case "h3":
      return <h3 className="mt-8 mb-3 text-lg">{block.text}</h3>;
    case "p":
      return <p className="mb-5 text-[0.9375rem] leading-[1.75] text-steel-400">{block.text}</p>;
    case "ul":
      return (
        <ul className="mb-6 space-y-3 border-l border-[var(--rule)] pl-5">
          {block.items.map((i) => (
            <li key={i} className="text-[0.9375rem] leading-[1.7] text-steel-400">
              {i}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mb-6 space-y-3">
          {block.items.map((item, n) => (
            <li key={item} className="flex gap-4 text-[0.9375rem] leading-[1.7] text-steel-400">
              <span className="data mt-0.5 shrink-0 text-xs text-signal">
                {String(n + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "note":
      return (
        <aside className="panel-inset mb-6 border-l-2 !border-l-signal p-4">
          <p className="text-sm leading-relaxed text-steel-400">{block.text}</p>
        </aside>
      );
    case "code":
      return (
        <figure className="mb-6">
          <ScrollRegion label={block.caption} className="panel-inset">
            <pre className="p-4">
            <code className="data block text-xs leading-relaxed whitespace-pre text-line-050">
              {block.lines.join("\n")}
              </code>
            </pre>
          </ScrollRegion>
          <figcaption className="mt-2 text-xs text-steel-600">{block.caption}</figcaption>
        </figure>
      );
    case "table":
      return (
        <figure className="mb-8">
          <ScrollRegion label={block.caption} className="panel">
            <table className={`data-table${block.head.length > 2 ? " stack" : ""}`}>
              <caption className="sr-only">{block.caption}</caption>
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h} scope="col">
                      {h || <span className="sr-only">Row label</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row.join("|")}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        {...(ci === 0
                          ? { "data-stack-title": true }
                          : { "data-label": block.head[ci] ?? "" })}
                        className={ci === 0 ? "text-line-050" : "text-steel-400"}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollRegion>
          <figcaption className="mt-2 text-xs text-steel-600">{block.caption}</figcaption>
        </figure>
      );
  }
}
