import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="section-index mb-5">404</p>
        <h1 className="text-[2rem] leading-tight md:text-[2.5rem]">
          That page is not here
        </h1>
        <p className="prose-measure mt-5 text-base leading-relaxed text-steel-400">
          The link may be old, or we may have moved something. These are the pages people
          usually want.
        </p>
        <ul className="mt-8 border-t border-[var(--rule)]">
          {[
            { href: "/", label: "Home", note: "What ElectronIx Trace is, in one page." },
            { href: "/demo", label: "Live demo", note: "A sample unit's record and the recall query." },
            { href: "/how-it-works", label: "How it works", note: "Six stages and what each captures." },
            { href: "/pricing", label: "Pricing", note: "What drives the price." },
            { href: "/contact", label: "Contact", note: "Book a 20-minute line walkthrough." },
          ].map((l) => (
            <li key={l.href} className="border-b border-[var(--rule)] py-4">
              <Link
                href={l.href}
                className="text-[0.9375rem] text-line-050 underline underline-offset-4 hover:text-signal"
              >
                {l.label}
              </Link>
              <p className="mt-1 text-sm text-steel-500">{l.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
