export function Section({
  index,
  title,
  lede,
  children,
  id,
  bordered = true,
}: {
  index?: string;
  title?: string;
  lede?: string;
  children: React.ReactNode;
  id?: string;
  bordered?: boolean;
}) {
  return (
    <section
      {...(id ? { id } : {})}
      className={`${bordered ? "border-t border-[var(--rule)]" : ""} py-16 md:py-24`}
    >
      <div className="shell">
        {(index ?? title) && (
          <div className="reveal mb-10 md:mb-14">
            {index && <p className="section-index mb-3">{index}</p>}
            {title && (
              <h2 className="max-w-3xl text-2xl leading-tight md:text-[2rem]">{title}</h2>
            )}
            {lede && (
              <p className="prose-measure mt-4 text-[0.9375rem] leading-relaxed text-steel-400">
                {lede}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
