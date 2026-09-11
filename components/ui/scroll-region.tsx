/**
 * A horizontally scrollable container that a keyboard can reach.
 *
 * A `div` with `overflow-x: auto` holding a table has no focusable content, so
 * a keyboard user cannot scroll it at all — the content is simply unreachable
 * on a narrow screen. Making it focusable and naming it fixes that, and the
 * label is what stops the extra tab stop being a mystery.
 */
export function ScrollRegion({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`table-scroll ${className}`.trim()}
      tabIndex={0}
      role="group"
      aria-label={label}
    >
      {children}
    </div>
  );
}
