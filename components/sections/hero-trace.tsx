/**
 * Hero visual: a marking and verification station, running on a loop.
 *
 * One cycle, 13 seconds: a valve body indexes into the nest, the toggle clamp
 * shuts, the marking head feeds down its Z axis, the galvo rasters a Data
 * Matrix into the pad row by row, the head parks, the DPM reader lights the
 * code and grades it, the unit's record writes itself out of that read, the
 * record holds, then the clamp releases and the part indexes out for the next
 * one. Then it does it again.
 *
 * Why it is built the way it is
 * -----------------------------
 * ONE MASTER TIMELINE. Every animated element carries `.station-anim` (13s,
 * linear, infinite) and an `animationName`, and its phase lives in that
 * keyframe's percentages. This is not a style choice: `animation-delay` applies
 * only to the first iteration, so the previous delay-chained version could run
 * once and never again. The timeline constants below mirror the generator that
 * produced the keyframes in globals.css — change one, change both.
 *
 * REDUCED MOTION TAKES A DIFFERENT PATH. A one-shot sequence can be collapsed
 * onto its last frame; a loop cannot, because a loop's last frame is the empty
 * stage before the next part arrives. So globals.css switches these animations
 * off entirely for reduced motion, and every element's BASE attributes here are
 * the finished diagram — part seated, clamp shut, code marked, record written,
 * beam off. That static state is the design; the motion is the optional part.
 *
 * Elements whose correct resting state is "off" — beam, scan line, sparks,
 * firing indicator, reader illumination, decode flash — carry `data-transient`
 * and a base opacity of 0. tests/a11y.spec.ts uses that attribute to tell
 * "correctly off" from "stranded mid-animation".
 *
 * Every colour is a token. A hardcoded part fill would stay dark on a white page.
 *
 * The part lies down because a marking head is on a Z axis directly above the
 * surface it writes to. Standing it upright put its own flange between the
 * nozzle and the mark, which is a machine that cannot work.
 */

import type { CSSProperties } from "react";

/**
 * The cycle, in ms, mirrored from the keyframe generator. Nothing here is read
 * at runtime — the CSS owns the timing — but the sequence is unreadable without
 * it, and a future edit needs to see what it is editing against.
 */
export const CYCLE = {
  total: 13000,
  partIn: [200, 1000],
  clamp: [1000, 1400],
  headDown: [1500, 1900],
  raster: [2000, 4000],
  headUp: [4150, 4550],
  read: [4300, 4900],
  grade: [5300, 5600],
  record: [6200, 7400],
  torqueLatched: 7500,
  hold: [8000, 11000],
  partOut: [11600, 12500],
} as const;

const CELL = 4;
const MATRIX_X = 98;
const MATRIX_Y = 210;

/** Every animated node is this class plus an animation name. */
function anim(name: string, extra?: CSSProperties) {
  return {
    className: "station-anim",
    style: { animationName: name, ...extra } as CSSProperties,
  };
}

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
          {/* The beam column: bright at the lens, falling off toward the work
              surface, so it reads as light and not as a painted wedge. */}
          <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-signal-solid)" stopOpacity="0.4" />
            <stop offset="70%" stopColor="var(--color-signal-solid)" stopOpacity="0.12" />
            <stop
              offset="100%"
              stopColor="var(--color-signal-solid)"
              stopOpacity="0.03"
            />
          </linearGradient>

          {/* The reader's illumination arrives at an angle, so its falloff runs
              across the cone rather than down it. */}
          <linearGradient id="readGrad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-signal-solid)" stopOpacity="0.3" />
            <stop
              offset="100%"
              stopColor="var(--color-signal-solid)"
              stopOpacity="0.04"
            />
          </linearGradient>

          {/* Applied only to the focal flare. One blurred element is affordable;
              blurring the scene is what makes SVG heroes cost frames. */}
          <filter id="flare" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
        </defs>

        <Frame />
        <Part />
        <Clamp />
        <MarkingHead />
        <Reader />
        <GradeTag />

        {/* The read is what resolves the record — an unread mark resolves
            nothing — so the link leaves the grade tag, not the code. It runs
            below the base plate, clear of the frame. */}
        <line
          x1="170"
          y1="355"
          x2="232"
          y2="355"
          stroke="var(--color-signal)"
          strokeWidth="1.25"
          strokeDasharray="64"
          strokeDashoffset="0"
          {...anim("st-link")}
        />

        {/* The chain the rows hang off. Outside the record group so it can draw
            itself before the rows it carries arrive. */}
        <line
          x1="232"
          y1="57"
          x2="232"
          y2="355"
          stroke="var(--rule-strong)"
          strokeWidth="1.1"
          strokeDasharray="298"
          strokeDashoffset="0"
          {...anim("st-spine")}
        />

        <Record />
      </svg>
    </div>
  );
}

/* --- Machine frame and nest ----------------------------------------------- */

function Frame() {
  return (
    <g>
      {/* Cross rail the Z axis hangs from, and the uprights carrying it down to
          the base plate. Both uprights sit outside the part — the flanges reach
          34 and 202 — so nothing structural crosses the workpiece. */}
      <rect
        x="18"
        y="26"
        width="208"
        height="12"
        fill="var(--color-graphite-800)"
        stroke="var(--rule-strong)"
        strokeWidth="1.2"
      />
      <text
        x="30"
        y="35"
        fill="var(--color-steel-600)"
        fontSize="7"
        fontFamily="var(--font-mono)"
        letterSpacing="0.06em"
      >
        ST-03
      </text>

      {[18, 218].map((x) => (
        <rect
          key={x}
          x={x}
          y="38"
          width="8"
          height="282"
          fill="var(--color-graphite-700)"
          stroke="var(--rule-strong)"
          strokeWidth="1"
        />
      ))}

      {/* Base plate, with the T-slots the fixture is bolted into. */}
      <rect
        x="18"
        y="320"
        width="208"
        height="14"
        fill="var(--color-graphite-800)"
        stroke="var(--rule-strong)"
        strokeWidth="1.2"
      />
      {[46, 86, 126, 166, 206].map((x) => (
        <line
          key={x}
          x1={x}
          y1="322"
          x2={x}
          y2="332"
          stroke="var(--rule-strong)"
          strokeWidth="0.9"
        />
      ))}

      {/* Support blocks the body rests on, notched to cradle a round casting. */}
      {[60, 142].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y="300"
            width="34"
            height="20"
            fill="var(--color-graphite-850)"
            stroke="var(--rule-strong)"
            strokeWidth="1.1"
          />
          <path
            d={`M${x + 5} 300 L${x + 17} 310 L${x + 29} 300`}
            fill="none"
            stroke="var(--rule-strong)"
            strokeWidth="0.9"
          />
        </g>
      ))}

      {/* Datum stop. The flange indexes against this, which is what makes the
          mark land in the same place on every unit. */}
      <path d="M34 314 V296" stroke="var(--color-signal)" strokeWidth="1.6" />

      {/* Z axis guide rail. Fixed — only the carriage travels. */}
      <rect
        x="110"
        y="38"
        width="16"
        height="78"
        fill="var(--color-graphite-850)"
        stroke="var(--rule-strong)"
        strokeWidth="1"
      />
      {[114, 122].map((x) => (
        <line
          key={x}
          x1={x}
          y1="40"
          x2={x}
          y2="114"
          stroke="var(--rule-strong)"
          strokeWidth="0.7"
          opacity="0.9"
        />
      ))}
    </g>
  );
}

/* --- The part, and the code rastered into its pad ------------------------- */

function Part() {
  return (
    <g {...anim("st-part")}>
      {/* Cast body. */}
      <rect
        x="44"
        y="196"
        width="148"
        height="104"
        fill="var(--color-graphite-850)"
        stroke="var(--rule-strong)"
        strokeWidth="1.4"
      />
      {/* End flanges, drawn proud of the body. */}
      {[34, 180].map((x) => (
        <rect
          key={x}
          x={x}
          y="182"
          width="22"
          height="132"
          fill="var(--color-graphite-800)"
          stroke="var(--rule-strong)"
          strokeWidth="1.4"
        />
      ))}
      {/* Machined steps where the body meets each flange. */}
      {[70, 166].map((x) => (
        <line
          key={x}
          x1={x}
          y1="196"
          x2={x}
          y2="300"
          stroke="var(--rule-strong)"
          strokeWidth="0.9"
          opacity="0.75"
        />
      ))}
      {/* Bolt holes on the flange faces. */}
      {[45, 191].map((x) =>
        [191, 305].map((y) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="3.4"
            fill="var(--color-graphite-700)"
            stroke="var(--rule-strong)"
            strokeWidth="0.8"
          />
        )),
      )}
      {/* The bore as hidden lines, with its axis dash-dotted. Both sit below the
          mark pad, so the pad never has to occlude them. */}
      {[262, 286].map((y) => (
        <line
          key={y}
          x1="34"
          y1={y}
          x2="202"
          y2={y}
          stroke="var(--color-steel-600)"
          strokeWidth="0.8"
          strokeDasharray="6 4"
          opacity="0.8"
        />
      ))}
      <line
        x1="40"
        y1="274"
        x2="196"
        y2="274"
        stroke="var(--color-steel-600)"
        strokeWidth="0.8"
        strokeDasharray="14 4 2 4"
        opacity="0.8"
      />

      <MarkPad />
    </g>
  );
}

function MarkPad() {
  return (
    <>
      {/* The prepared flat the code is written on. */}
      <rect
        x="92"
        y="204"
        width="52"
        height="52"
        fill="var(--color-graphite-950)"
        stroke="var(--color-signal)"
        strokeWidth="1"
      />
      {/* Registration ticks at the corners of the machined flat. Neutral and
          fully opaque: they are a machined feature, not an accent, and the
          reduced-motion test rightly refuses anything left part-transparent. */}
      {CORNER_TICKS.map((d, i) => (
        <path key={i} d={d} stroke="var(--rule-strong)" strokeWidth="1" />
      ))}

      {/* The modules are static. The raster is done by the cover below
          retreating, which is one animation instead of a hundred cell delays. */}
      {MATRIX_BITS.map((row, r) =>
        row.map((bit, c) =>
          bit ? (
            <rect
              key={`${r}-${c}`}
              x={MATRIX_X + c * CELL}
              y={MATRIX_Y + r * CELL}
              width={CELL}
              height={CELL}
              fill="var(--color-line-050)"
            />
          ) : null,
        ),
      )}

      {/* Un-marked surface, retreating one galvo row at a time. It rests fully
          retracted, which is why its base transform is scaleY(0). */}
      <rect
        x="96"
        y="208"
        width="44"
        height="44"
        fill="var(--color-graphite-950)"
        {...anim("st-cover", {
          transformBox: "fill-box",
          transformOrigin: "center bottom",
          transform: "scaleY(0)",
        })}
      />

      {/* Scan line, stepped once per row. Wrapped so the beam envelope owns its
          visibility and the steps own only its position. */}
      <g data-transient opacity="0" {...anim("st-beam")}>
        <rect
          x={MATRIX_X}
          y={MATRIX_Y}
          width={CELL * 10}
          height={CELL}
          fill="var(--color-signal-solid)"
          {...anim("st-scan")}
        />
      </g>

      {/* Ablation spatter at the focal point. */}
      {SPARKS.map((s, i) => (
        <circle
          key={i}
          data-transient
          cx={s.x}
          cy={s.y}
          r="1.7"
          opacity="0"
          fill="var(--color-signal-solid)"
          {...anim(`st-spark-${s.burst}`, {
            transformBox: "fill-box",
            transformOrigin: "center",
          })}
        />
      ))}
    </>
  );
}

/* --- Pneumatic hold-down -------------------------------------------------- */

function Clamp() {
  return (
    <g>
      {/* Bracket off the left upright, mirroring the reader's on the right. */}
      <rect
        x="26"
        y="140"
        width="24"
        height="8"
        fill="var(--color-graphite-700)"
        stroke="var(--rule-strong)"
        strokeWidth="1"
      />

      {/* Rod and pad, drawn BEFORE the cylinder so the cylinder occludes the rod
          when it is retracted — which is what a retracted rod does. Travels down
          onto the flange top at 182, and rests extended, because the resting
          diagram is a clamped part. */}
      <g {...anim("st-clamp")}>
        <line
          x1="40"
          y1="160"
          x2="40"
          y2="176"
          stroke="var(--rule-strong)"
          strokeWidth="2.6"
        />
        <rect
          x="32"
          y="174"
          width="16"
          height="8"
          fill="var(--color-graphite-700)"
          stroke="var(--rule-strong)"
          strokeWidth="1"
        />
      </g>

      {/* Cylinder body. Fixed. */}
      <rect
        x="31"
        y="148"
        width="18"
        height="22"
        fill="var(--color-graphite-800)"
        stroke="var(--rule-strong)"
        strokeWidth="1.2"
      />
      {[154, 159, 164].map((y) => (
        <line
          key={y}
          x1="34"
          y1={y}
          x2="46"
          y2={y}
          stroke="var(--rule-strong)"
          strokeWidth="0.7"
          opacity="0.85"
        />
      ))}
      <text
        x="54"
        y="162"
        fill="var(--color-steel-600)"
        fontSize="6.5"
        fontFamily="var(--font-mono)"
        letterSpacing="0.06em"
      >
        HOLD
      </text>
    </g>
  );
}

/* --- Fiber marking head on its Z axis ------------------------------------- */

function MarkingHead() {
  return (
    <>
      <g {...anim("st-head")}>
        {/* Service loop for the fiber. The slack in it is what lets the head
            travel at all, so it is drawn loose rather than taut. */}
        <path
          d="M138 56 C 158 48, 164 70, 182 60"
          fill="none"
          stroke="var(--rule-strong)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Laser body. */}
        <rect
          x="98"
          y="48"
          width="40"
          height="20"
          fill="var(--color-graphite-850)"
          stroke="var(--rule-strong)"
          strokeWidth="1.2"
        />
        {/* Carriage on the rail. */}
        <rect
          x="106"
          y="68"
          width="24"
          height="12"
          fill="var(--color-graphite-700)"
          stroke="var(--rule-strong)"
          strokeWidth="1"
        />
        {/* Galvo box — the wide part, because that is where the mirrors are. */}
        <rect
          x="90"
          y="80"
          width="56"
          height="34"
          fill="var(--color-graphite-800)"
          stroke="var(--rule-strong)"
          strokeWidth="1.3"
        />
        {[88, 95, 102].map((y) => (
          <line
            key={y}
            x1="95"
            y1={y}
            x2="124"
            y2={y}
            stroke="var(--rule-strong)"
            strokeWidth="0.8"
            opacity="0.85"
          />
        ))}
        {/* Firing indicator. Lit only while the beam is on. */}
        <circle
          data-transient
          cx="138"
          cy="87"
          r="2.4"
          opacity="0"
          fill="var(--color-signal-solid)"
          {...anim("st-beam")}
        />
        {/* f-theta lens and its rim. */}
        <path
          d="M104 114 H132 L126 130 H110 Z"
          fill="var(--color-graphite-700)"
          stroke="var(--rule-strong)"
          strokeWidth="1.1"
        />
        <rect
          x="108"
          y="130"
          width="20"
          height="5"
          fill="var(--color-graphite-850)"
          stroke="var(--rule-strong)"
          strokeWidth="1"
        />
      </g>

      {/* Label stays put while the head travels. Inside the head group it rode
          the 16px feed down and collided with the reader's VERIFY label. */}
      <text
        x="150"
        y="96"
        fill="var(--color-steel-600)"
        fontSize="6.5"
        fontFamily="var(--font-mono)"
        letterSpacing="0.06em"
      >
        MARK
      </text>

      {/* Beam column and focal flare, drawn from the lens at its FED position
          (135 plus the head's 16px feed), because that is the only time it is
          on. Rests off. */}
      <g data-transient opacity="0" {...anim("st-beam")}>
        <path d="M112 151 H124 L139 204 H97 Z" fill="url(#beamGrad)" />
        {/* Reaches only as far as the row currently being written. */}
        <line
          x1="118"
          y1="151"
          x2="118"
          y2="248"
          stroke="var(--color-signal-solid)"
          strokeWidth="1.3"
          opacity="0.85"
          {...anim("st-beamlen", {
            transformBox: "view-box",
            transformOrigin: "118px 151px",
          })}
        />
        <circle
          cx="118"
          cy="212"
          r="7"
          fill="var(--color-signal-solid)"
          filter="url(#flare)"
          {...anim("st-focus")}
        />
      </g>
    </>
  );
}

/* --- DPM reader: a separate device, on its own bracket -------------------- */

function Reader() {
  return (
    <>
      {/* Bracket off the upright. */}
      <rect
        x="196"
        y="138"
        width="22"
        height="8"
        fill="var(--color-graphite-700)"
        stroke="var(--rule-strong)"
        strokeWidth="1"
      />
      <text
        x="196"
        y="132"
        textAnchor="end"
        fill="var(--color-steel-600)"
        fontSize="6.5"
        fontFamily="var(--font-mono)"
        letterSpacing="0.06em"
      >
        VERIFY
      </text>

      {/* Strut from the bracket down to the reader body. */}
      <line
        x1="203"
        y1="146"
        x2="190"
        y2="154"
        stroke="var(--rule-strong)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Reader body, canted so its lens actually looks at the pad. A verifier
          aimed straight down at a specular machined surface reads its own
          reflection back, which is why they are mounted off-axis. */}
      <g transform="rotate(-34 178 158)">
        <rect
          x="160"
          y="146"
          width="38"
          height="24"
          fill="var(--color-graphite-800)"
          stroke="var(--rule-strong)"
          strokeWidth="1.2"
        />
        <rect
          x="154"
          y="152"
          width="6"
          height="12"
          fill="var(--color-graphite-700)"
          stroke="var(--rule-strong)"
          strokeWidth="1"
        />
        {[152, 157, 162].map((y) => (
          <line
            key={y}
            x1="166"
            y1={y}
            x2="184"
            y2={y}
            stroke="var(--rule-strong)"
            strokeWidth="0.7"
            opacity="0.85"
          />
        ))}
      </g>

      {/* Illumination, on only long enough to acquire and grade the code. */}
      <path
        data-transient
        d="M162 168 L144 204 L94 204 Z"
        fill="url(#readGrad)"
        opacity="0"
        {...anim("st-readlight")}
      />

      {/* What the reader projects: four corner brackets closing onto the code,
          then a slow pulse while it keeps watching the fixture. */}
      <g
        {...anim("st-reticle", {
          transformBox: "view-box",
          transformOrigin: "118px 230px",
        })}
      >
        {RETICLE.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="var(--color-signal)"
            strokeWidth="1.6"
            fill="none"
          />
        ))}
      </g>

      {/* Decode illumination. One frame, then the verdict. */}
      <rect
        data-transient
        x="92"
        y="204"
        width="52"
        height="52"
        opacity="0"
        fill="var(--color-signal-solid)"
        {...anim("st-flash")}
      />
    </>
  );
}

function GradeTag() {
  return (
    <g {...anim("st-tag")}>
      <rect
        x="34"
        y="344"
        width="136"
        height="22"
        fill="var(--color-graphite-900)"
        stroke="var(--rule)"
        strokeWidth="1"
      />
      <circle cx="46" cy="355" r="3" fill="var(--color-verify)" />
      <text
        x="57"
        y="358"
        fill="var(--color-steel-400)"
        fontSize="8.5"
        fontFamily="var(--font-mono)"
        letterSpacing="0.04em"
      >
        READ · GRADE B
      </text>
    </g>
  );
}

/* --- The record that resolves out of the read ----------------------------- */

function Record() {
  return (
    <g {...anim("st-record")}>
      {ROWS.map((node) => {
        const cy = node.y + 17;
        return (
          <g key={node.label}>
            <path
              d={`M232 ${cy} H236`}
              stroke="var(--rule-strong)"
              strokeWidth="1.1"
              fill="none"
            />
            <rect
              x="229.5"
              y={cy - 2.5}
              width="5"
              height="5"
              fill="var(--color-graphite-950)"
              stroke="var(--rule-strong)"
              strokeWidth="1"
            />
            <rect
              x="236"
              y={node.y}
              width="140"
              height="34"
              fill="var(--color-graphite-900)"
              stroke={node.accent ? "var(--color-verify)" : "var(--rule)"}
              strokeWidth="1"
            />
            <text
              x="245"
              y={node.y + 13}
              fill="var(--color-steel-600)"
              fontSize="7.5"
              fontFamily="var(--font-mono)"
              letterSpacing="0.05em"
            >
              {node.label}
            </text>

            {node.settle ? (
              <TorqueReading y={node.y} />
            ) : (
              <text
                x="245"
                y={node.y + 26}
                fill={node.accent ? "var(--color-verify)" : "var(--color-line-050)"}
                fontSize="10"
                fontFamily="var(--font-mono)"
              >
                {node.value}
              </text>
            )}

            {/* The hash that chains this row to the one before it. */}
            <text
              x="367"
              y={node.y + 26}
              textAnchor="end"
              fill="var(--color-steel-600)"
              fontSize="6.5"
              fontFamily="var(--font-mono)"
            >
              {node.hash}
            </text>
          </g>
        );
      })}

      {/* Who and what produced the readings, hung off the operation rows. */}
      {CONTEXT.map((node) => {
        const cy = node.y + 17;
        return (
          <g key={node.label}>
            <path
              d={`M376 ${cy} H404`}
              stroke="var(--rule-strong)"
              strokeWidth="1.1"
              fill="none"
            />
            <rect
              x="404"
              y={node.y}
              width="128"
              height="34"
              fill="var(--color-graphite-900)"
              stroke="var(--rule)"
              strokeWidth="1"
            />
            <text
              x="413"
              y={node.y + 13}
              fill="var(--color-steel-600)"
              fontSize="7.5"
              fontFamily="var(--font-mono)"
              letterSpacing="0.05em"
            >
              {node.label}
            </text>
            <text
              x="413"
              y={node.y + 26}
              fill="var(--color-line-050)"
              fontSize="10"
              fontFamily="var(--font-mono)"
            >
              {node.value}
            </text>
          </g>
        );
      })}

      {/* The record writing itself in, top-down, one hold per row. Same device
          as the mark pad's cover: a retreating ground beats staggering twenty
          elements, and it cannot drift out of step with itself. */}
      <rect
        x="234"
        y="30"
        width="306"
        height="342"
        fill="var(--color-graphite-950)"
        {...anim("st-reccover", {
          transformBox: "fill-box",
          transformOrigin: "center bottom",
          transform: "scaleY(0)",
        })}
      />
    </g>
  );
}

/**
 * A torque transducer does not produce its answer; it converges on it. Each
 * intermediate sample holds briefly and yields. Only the latched value has a
 * base opacity of 1, so it is also what a reduced-motion visitor sees, alone.
 */
function TorqueReading({ y }: { y: number }) {
  return (
    <>
      {TORQUE_SAMPLES.map((v, i) => (
        <text
          key={v}
          x="245"
          y={y + 26}
          opacity="0"
          fill="var(--color-steel-500)"
          fontSize="10"
          fontFamily="var(--font-mono)"
          {...anim(`st-sample-${i + 1}`)}
        >
          {v}
        </text>
      ))}
      <text
        x="245"
        y={y + 26}
        fill="var(--color-verify)"
        fontSize="10"
        fontFamily="var(--font-mono)"
        {...anim("st-latched")}
      >
        12.1 Nm
      </text>

      {/* The gate the reading was judged against. After the value, because a
          limit window means nothing until there is something in it. */}
      <text
        x="367"
        y={y + 13}
        textAnchor="end"
        fill="var(--color-steel-600)"
        fontSize="7"
        fontFamily="var(--font-mono)"
        {...anim("st-limits")}
      >
        10–14 Nm
      </text>
    </>
  );
}

/* --- Static geometry and content ------------------------------------------ */

/** Reader reticle: four corner brackets, not a closed box. */
const RETICLE = [
  "M84 212 V196 H100",
  "M136 196 H152 V212",
  "M152 248 V264 H136",
  "M100 264 H84 V248",
];

/** Registration ticks at the corners of the machined flat. */
const CORNER_TICKS = [
  "M87 204 H92 M92 199 V204",
  "M144 199 V204 M144 204 H149",
  "M144 256 H149 M144 256 V261",
  "M87 256 H92 M92 256 V261",
];

const SPARKS = [
  { x: 104, y: 218, burst: 1 },
  { x: 131, y: 224, burst: 2 },
  { x: 110, y: 238, burst: 1 },
  { x: 134, y: 244, burst: 2 },
];

const TORQUE_SAMPLES = ["8.4 Nm", "11.3 Nm", "12.0 Nm"];

/** A static Data Matrix-style module grid. Decorative, not a scannable code. */
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

/* The hashes match the event log on /demo. The same unit told the same way in
   two places is worth more than two plausible-looking sets of hex. */
const ROWS: {
  label: string;
  value: string;
  hash: string;
  y: number;
  accent?: boolean;
  settle?: boolean;
}[] = [
  { label: "JOB CARD", value: "JC-2608-0071", hash: "c9b5266a", y: 40 },
  { label: "BOM LOT", value: "GSK-2608-A14", hash: "38328907", y: 98 },
  {
    label: "OP 30 TORQUE",
    value: "12.1 Nm",
    hash: "d913d3cc",
    y: 156,
    accent: true,
    settle: true,
  },
  { label: "OP 40 GREASE", value: "Applied", hash: "11320ce2", y: 214, accent: true },
  { label: "OP 50 EOL TEST", value: "PASS", hash: "7a2f5544", y: 272, accent: true },
  { label: "DISPATCHED", value: "18 Aug 2026", hash: "7c3f2381", y: 330 },
];

const CONTEXT: { label: string; value: string; y: number }[] = [
  { label: "OPERATOR", value: "M. Anand", y: 156 },
  { label: "DEVICE", value: "TW-01", y: 214 },
  { label: "STATION", value: "ST-03", y: 272 },
];
