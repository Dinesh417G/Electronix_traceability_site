import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  lede,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  breadcrumb: { name: string; path: string }[];
}) {
  return (
    <div className="shell pt-10 pb-12 md:pt-14 md:pb-16">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-steel-600">
          {breadcrumb.map((b, i) => (
            <li key={b.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === breadcrumb.length - 1 ? (
                <span aria-current="page" className="text-steel-400">
                  {b.name}
                </span>
              ) : (
                <Link href={b.path} className="hover:text-line-050">
                  {b.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <p className="section-index mb-4">{eyebrow}</p>
      <h1 className="max-w-4xl text-[1.875rem] leading-[1.12] md:text-[2.75rem]">{title}</h1>
      <p className="prose-measure mt-5 text-base leading-relaxed text-steel-400 md:text-lg">
        {lede}
      </p>
    </div>
  );
}
