import Link from "next/link";

/**
 * Internal linking. Every page carries at least three descriptive links out,
 * which is the rule the audit script enforces.
 */
export function Related({
  links,
  title = "Related",
}: {
  links: { href: string; label: string; note: string }[];
  title?: string;
}) {
  return (
    <section className="border-t border-[var(--rule)] py-14">
      <div className="shell">
        <h2 className="data mb-6 text-[0.6875rem] tracking-wide text-steel-600">{title}</h2>
        <ul className="grid gap-px bg-[var(--rule)] md:grid-cols-3">
          {links.map((l) => (
            <li key={l.href} className="bg-graphite-950">
              <Link href={l.href} className="group block h-full p-5 hover:bg-graphite-900">
                <span className="block text-[0.9375rem] text-line-050 group-hover:text-signal">
                  {l.label}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-steel-400">
                  {l.note}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
