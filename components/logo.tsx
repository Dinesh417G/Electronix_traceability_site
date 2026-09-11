export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <OrbitMark />
      <span className="font-[family-name:var(--font-display)] text-[0.9375rem] font-semibold tracking-tight">
        <span className="text-line-050">Electron</span>
        <span className="text-signal">Ix</span>
        <span className="ml-1.5 font-medium text-steel-500">Trace</span>
      </span>
    </span>
  );
}

/** Atom / electron-orbit mark, carried over from the ElectronIx brand family. */
function OrbitMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <ellipse cx="12" cy="12" rx="10.2" ry="4.4" stroke="#9BA3AF" strokeWidth="1.1" />
      <ellipse
        cx="12"
        cy="12"
        rx="10.2"
        ry="4.4"
        stroke="#9BA3AF"
        strokeWidth="1.1"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10.2"
        ry="4.4"
        stroke="#9BA3AF"
        strokeWidth="1.1"
        transform="rotate(120 12 12)"
      />
      <circle cx="12" cy="12" r="2.6" fill="#FF6B1A" />
    </svg>
  );
}
