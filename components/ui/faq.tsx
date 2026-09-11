export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="border-t border-[var(--rule)]">
      {items.map((item) => (
        <details key={item.q} className="group border-b border-[var(--rule)]">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[0.9375rem] font-medium text-line-050 [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden="true"
              className="mt-1 shrink-0 text-steel-500 transition-transform duration-200 group-open:rotate-45"
            >
              <svg width="14" height="14" viewBox="0 0 14 14">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </summary>
          <p className="prose-measure pb-6 text-sm leading-relaxed text-steel-400">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
