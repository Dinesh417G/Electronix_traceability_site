/**
 * Hero visual: a mark is applied to a part, the code resolves, and the unit's
 * genealogy assembles outward from it.
 *
 * No JavaScript. Pure SVG with CSS keyframes, `animation-fill-mode: both`, so
 * under `prefers-reduced-motion` the global duration override lands every
 * element on its final state immediately. The static end state is the design;
 * the motion is the optional part.
 */
export function HeroTrace() {
  return (
    <div className="relative w-full" aria-hidden="true">
      <svg
        viewBox="0 0 560 420"
        className="h-auto w-full"
        role="presentation"
        focusable="false"
      >
        <defs>
          <clipPath id="partClip">
            <rect x="32" y="120" width="172" height="180" rx="4" />
          </clipPath>
          <linearGradient id="sweepGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B1A" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF6B1A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF6B1A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Part silhouette — a valve body, drawn not filled */}
        <g style={{ animation: "trace-fade-in 400ms ease both" }}>
          <path
            d="M52 168 h44 v-26 h48 v26 h44 v104 h-44 v26 h-48 v-26 h-44 z"
            fill="#171B21"
            stroke="#262B34"
            strokeWidth="1.5"
          />
          <circle cx="120" cy="220" r="26" fill="none" stroke="#262B34" strokeWidth="1.5" />
          <circle cx="120" cy="220" r="8" fill="none" stroke="#262B34" strokeWidth="1.5" />
          {[70, 170].map((x) =>
            [186, 254].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="#262B34" />
            )),
          )}
        </g>

        {/* Marking sweep. Runs once, 900ms, then gone. */}
        <g clipPath="url(#partClip)">
          <rect
            x="32"
            y="120"
            width="172"
            height="26"
            fill="url(#sweepGrad)"
            style={{
              animation: "trace-sweep 900ms cubic-bezier(0.45,0,0.55,1) 250ms both",
              transformOrigin: "center",
            }}
          />
        </g>

        {/* The code, resolving after the sweep */}
        <g style={{ animation: "trace-fade-in 420ms ease 980ms both" }}>
          <rect x="96" y="196" width="48" height="48" fill="#0E1013" stroke="#FF6B1A" strokeWidth="1" />
          <DataMatrix x={100} y={200} />
        </g>

        {/* Connector from code to the tree */}
        <path
          d="M150 220 H232"
          stroke="#FF6B1A"
          strokeWidth="1.25"
          strokeDasharray="82"
          strokeDashoffset="82"
          style={{ animation: "trace-draw 380ms ease 1320ms both" }}
        />

        {/* Genealogy tree, assembling outward */}
        <g>
          {TREE.map((node, i) => (
            <g key={node.label}>
              <path
                d={node.path}
                stroke="#3A414D"
                strokeWidth="1.1"
                fill="none"
                strokeDasharray="120"
                strokeDashoffset="120"
                style={{
                  animation: `trace-draw 300ms ease ${1560 + i * 110}ms both`,
                }}
              />
              <g style={{ animation: `trace-fade-in 320ms ease ${1640 + i * 110}ms both` }}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height="30"
                  fill="#14171C"
                  stroke={node.accent ? "#2ED47A" : "#262B34"}
                  strokeWidth="1"
                />
                <text
                  x={node.x + 10}
                  y={node.y + 13}
                  fill="#9BA3AF"
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.03em"
                >
                  {node.label}
                </text>
                <text
                  x={node.x + 10}
                  y={node.y + 24}
                  fill={node.accent ? "#2ED47A" : "#F2F4F7"}
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                >
                  {node.value}
                </text>
              </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

/** A static Data Matrix-style module grid. Decorative, not a scannable code. */
function DataMatrix({ x, y }: { x: number; y: number }) {
  const cells = MATRIX_BITS;
  const size = 4;
  return (
    <g>
      {cells.map((row, r) =>
        row.map((bit, c) =>
          bit ? (
            <rect
              key={`${r}-${c}`}
              x={x + c * size}
              y={y + r * size}
              width={size}
              height={size}
              fill="#F2F4F7"
            />
          ) : null,
        ),
      )}
    </g>
  );
}

const MATRIX_BITS: number[][] = [
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [1, 1, 0, 1, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 1, 1, 0, 1, 0],
  [1, 1, 1, 0, 1, 1, 0, 1, 1, 0],
  [1, 0, 1, 1, 0, 0, 1, 0, 0, 1],
  [1, 1, 0, 0, 1, 0, 1, 1, 1, 0],
  [1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
  [1, 0, 1, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const TREE: {
  label: string;
  value: string;
  x: number;
  y: number;
  w: number;
  path: string;
  accent?: boolean;
}[] = [
  {
    label: "JOB CARD",
    value: "JC-2608-0071",
    x: 236,
    y: 42,
    w: 132,
    path: "M232 220 V57 H236",
  },
  {
    label: "BOM LOT",
    value: "GSK-2608-A14",
    x: 236,
    y: 102,
    w: 132,
    path: "M232 220 V117 H236",
  },
  {
    label: "OP 30 TORQUE",
    value: "12.1 Nm",
    x: 236,
    y: 162,
    w: 132,
    path: "M232 220 V177 H236",
    accent: true,
  },
  {
    label: "OP 40 GREASE",
    value: "Applied",
    x: 236,
    y: 222,
    w: 132,
    path: "M232 220 V237 H236",
    accent: true,
  },
  {
    label: "OP 50 EOL TEST",
    value: "PASS",
    x: 236,
    y: 282,
    w: 132,
    path: "M232 220 V297 H236",
    accent: true,
  },
  {
    label: "DISPATCHED",
    value: "18 Aug 2026",
    x: 236,
    y: 342,
    w: 132,
    path: "M232 220 V357 H236",
  },
  {
    label: "OPERATOR",
    value: "R. Kumar",
    x: 400,
    y: 162,
    w: 128,
    path: "M368 177 H400",
  },
  {
    label: "DEVICE",
    value: "TW-01",
    x: 400,
    y: 222,
    w: 128,
    path: "M368 237 H400",
  },
  {
    label: "STATION",
    value: "ST-01",
    x: 400,
    y: 282,
    w: 128,
    path: "M368 297 H400",
  },
];
