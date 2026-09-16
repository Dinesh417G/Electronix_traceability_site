/**
 * Contrast gate. The charter treats contrast as a gate, not a preference, so
 * every foreground/background pair a theme can actually produce is measured
 * here before the tokens land. Run it after touching any colour token.
 *
 *   node scripts/contrast.mjs
 *
 * Exits non-zero on any failure, so it can be wired into `npm run check`.
 */

const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function luminance(hex) {
  const h = hex.replace("#", "");
  const n =
    h.length === 3
      ? [...h].map((c) => parseInt(c + c, 16))
      : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)].map((p) => parseInt(p, 16));
  const [r, g, b] = n.map((v) => lin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/**
 * Flatten a translucent tint over its ground. The chip styles paint the accent
 * at 10% over the surface and then put the SAME accent on top as text, so the
 * real background is never the plain surface — this is exactly the pair axe
 * caught that the first version of this file missed.
 */
function over(fg, bg, alpha) {
  const parse = (hex) => {
    const h = hex.replace("#", "");
    return [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)].map((p) => parseInt(p, 16));
  };
  const [a, b] = [parse(fg), parse(bg)];
  return (
    "#" +
    a
      .map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)))
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

const THEMES = {
  dark: {
    surfaces: {
      "graphite-950": "#0e1013",
      "graphite-900": "#14171c",
      "graphite-850": "#171b21",
      "graphite-800": "#1b1f26",
    },
    text: {
      "line-050": "#f2f4f7",
      "steel-400": "#bac1cb",
      "steel-500": "#9ba3af",
      "steel-600": "#838c99",
      signal: "#ff6b1a",
      verify: "#2ed47a",
      reject: "#ff4d4d",
    },
    ui: { "rule-strong": "#676f7c", "signal-solid": "#ff6b1a" },
    onSolid: "#14100c",
  },
  light: {
    surfaces: {
      "graphite-950": "#ffffff",
      "graphite-900": "#f6f7f9",
      "graphite-850": "#eef0f4",
      "graphite-800": "#e9ecf0",
    },
    text: {
      "line-050": "#12161c",
      "steel-400": "#39414f",
      "steel-500": "#49525f",
      "steel-600": "#59616f",
      signal: "#9e3d0b",
      verify: "#0f6b33",
      reject: "#b3201f",
    },
    ui: { "rule-strong": "#737c8a", "signal-solid": "#ff6b1a" },
    onSolid: "#14100c",
  },
};

const TEXT_MIN = 4.5; // WCAG AA, normal text
const UI_MIN = 3.0; // WCAG 1.4.11, borders that carry meaning
const CHIP_TINT = 0.1; // the accent wash behind .chip-pass / .chip-fail / .chip-signal

let failures = 0;
const rows = [];

for (const [name, t] of Object.entries(THEMES)) {
  for (const [fgName, fg] of Object.entries(t.text)) {
    for (const [bgName, bg] of Object.entries(t.surfaces)) {
      const r = ratio(fg, bg);
      const ok = r >= TEXT_MIN;
      if (!ok) failures++;
      rows.push([name, `${fgName} on ${bgName}`, r, TEXT_MIN, ok]);
    }
  }

  // Borders that a user must be able to see to operate the control.
  for (const [bgName, bg] of Object.entries(t.surfaces)) {
    const r = ratio(t.ui["rule-strong"], bg);
    const ok = r >= UI_MIN;
    if (!ok) failures++;
    rows.push([name, `rule-strong on ${bgName}`, r, UI_MIN, ok]);
  }

  // The primary button keeps the brand orange as a fill in both themes; only
  // its label has to clear AA against it.
  const btn = ratio(t.onSolid, t.ui["signal-solid"]);
  if (btn < TEXT_MIN) failures++;
  rows.push([name, "btn-primary label on signal-solid", btn, TEXT_MIN, btn >= TEXT_MIN]);

  // Focus ring must be visible against every surface it can land on.
  for (const [bgName, bg] of Object.entries(t.surfaces)) {
    const r = ratio(t.text.signal, bg);
    const ok = r >= UI_MIN;
    if (!ok) failures++;
    rows.push([name, `focus ring on ${bgName}`, r, UI_MIN, ok]);
  }

  // Chips: accent text on a 10% wash of that same accent. The wash lightens the
  // ground in the light theme and darkens it in the dark one, so it always eats
  // some of the headroom the plain-surface check measured.
  for (const accent of ["signal", "verify", "reject"]) {
    for (const [bgName, bg] of Object.entries(t.surfaces)) {
      const tinted = over(t.text[accent], bg, CHIP_TINT);
      const r = ratio(t.text[accent], tinted);
      const ok = r >= TEXT_MIN;
      if (!ok) failures++;
      rows.push([name, `chip-${accent} on tinted ${bgName}`, r, TEXT_MIN, ok]);
    }
  }
}

const pad = (s, n) => String(s).padEnd(n);
console.log(
  pad("theme", 7) + pad("pair", 42) + pad("ratio", 9) + pad("min", 6) + "verdict",
);
console.log("-".repeat(70));
for (const [theme, pair, r, min, ok] of rows) {
  console.log(
    pad(theme, 7) +
      pad(pair, 42) +
      pad(r.toFixed(2) + ":1", 9) +
      pad(min.toFixed(1), 6) +
      (ok ? "pass" : "FAIL"),
  );
}
console.log("-".repeat(70));
console.log(
  failures === 0
    ? `all ${rows.length} pairs pass`
    : `${failures} of ${rows.length} pairs FAIL`,
);
process.exit(failures === 0 ? 0 : 1);
