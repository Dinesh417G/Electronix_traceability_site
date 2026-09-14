/**
 * Sample the hero's 13s station loop at fixed points, and prove it actually
 * loops.
 *
 *   npx next start -p 3100
 *   node scripts/hero-frames.mjs [theme]
 *
 * A looping animation is close to unreviewable by hand — you cannot hold it
 * still, and the interesting frames are 200ms wide. This pauses every animation
 * on the page and scrubs the whole document timeline to an exact millisecond,
 * which is the only way to look at one frame properly.
 *
 * It also checks the thing that is easy to get wrong and impossible to see:
 * that frame t and frame t + 13000ms are byte-identical. If they are not, the
 * cycle does not close — some element ends where it did not start and the loop
 * will visibly jump every time round.
 */
import { chromium } from "@playwright/test";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const INSTALLED = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE = process.env.HERO_BASE ?? "http://127.0.0.1:3100";
const OUT = "screenshots/hero";
const CYCLE = 13000;
const theme = process.argv[2] ?? "light";

/** The beats worth looking at, named so a failure says which one broke. */
const FRAMES = [
  [400, "01-part-indexing-in"],
  [1200, "02-clamped"],
  [2100, "03-raster-first-rows"],
  [3200, "04-raster-most"],
  [4000, "05-raster-complete"],
  [4700, "06-reader-acquiring"],
  [5050, "07-decode-flash"],
  [5800, "08-graded-and-linked"],
  [6800, "09-record-writing"],
  [7000, "10-torque-settling"],
  [9000, "11-hold"],
  [11300, "12-record-clearing"],
  [12100, "13-part-indexing-out"],
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(
  existsSync(INSTALLED) ? { executablePath: INSTALLED } : {},
);
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.addInitScript((t) => {
  try {
    localStorage.setItem("trace-theme", t);
  } catch {}
}, theme);
await page.goto(BASE + "/", { waitUntil: "networkidle" });

const hero = page.locator("section").first();

/**
 * Seek the whole document to `ms` on the STATION timeline.
 *
 * `currentTime` is LOCAL time. The effect's active phase runs from `delay`
 * onward, so progress into the iteration is `currentTime - delay`; to show
 * timeline position t you therefore set `currentTime = t + delay`.
 *
 * Two traps, both silent. Getting that sign wrong does not error, it just
 * mislabels every frame by the delay. And because the station opens mid-cycle
 * on a NEGATIVE delay, `t + delay` goes negative for most of the cycle, where
 * Chrome clamps it — which reads as the loop drifting when it is only the
 * sampler. Adding one whole cycle keeps local time positive and lands on the
 * same frame, since the animation repeats forever.
 */
async function frameAt(ms) {
  await page.evaluate(
    ({ t, cycle }) => {
      for (const a of document.getAnimations()) {
        // Only the station. Seeking everything on the page also drags the short
        // `.reveal` transitions around, which makes two frames one cycle apart
        // differ for a reason that has nothing to do with the loop.
        if (!String(a.animationName ?? "").startsWith("st-")) continue;
        a.pause();
        try {
          a.currentTime = t + (a.effect.getTiming().delay ?? 0) + cycle;
        } catch {}
      }
    },
    { t: ms, cycle: CYCLE },
  );
  return hero.screenshot();
}

// A quick sanity check that these are loops at all, not one-shots that happen
// to have finished. A one-shot here is the exact bug this rewrite fixed.
const timings = await page.evaluate(() =>
  [...document.getAnimations()]
    .filter((a) => String(a.animationName ?? "").startsWith("st-"))
    .map((a) => `${a.effect.getTiming().iterations}/${a.effect.getTiming().duration}`),
);
const distinct = [...new Set(timings)];
console.log(`station animations: ${timings.length}, timings: ${distinct.join(", ")}`);
if (distinct.length !== 1 || distinct[0] !== `Infinity/${CYCLE}`) {
  console.log(`FAIL: expected every station animation to be Infinity/${CYCLE}`);
  process.exitCode = 1;
}

for (const [ms, name] of FRAMES) {
  const shot = await frameAt(ms);
  writeFileSync(`${OUT}/${theme}-${name}.png`, shot);
}
console.log(`${FRAMES.length} frames written to ${OUT}`);

// The cycle must close: t and t + CYCLE have to be the same picture.
let drift = 0;
for (const [ms, name] of FRAMES) {
  const a = await frameAt(ms);
  const b = await frameAt(ms + CYCLE);
  if (!a.equals(b)) {
    drift++;
    console.log(`LOOP DRIFT at ${ms}ms (${name}): frame differs one cycle later`);
  }
}
console.log(
  drift === 0 ? "loop closes cleanly at every sampled frame" : `${drift} frame(s) drift`,
);
if (drift) process.exitCode = 1;

await ctx.close();

// The reduced-motion render is a genuinely separate code path — animations off,
// base attributes only — so it needs looking at, not just asserting on. A test
// that checks opacity would pass on a diagram that is missing half its parts.
const still = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const stillPage = await still.newPage();
await stillPage.addInitScript((t) => {
  try {
    localStorage.setItem("trace-theme", t);
  } catch {}
}, theme);
await stillPage.goto(BASE + "/", { waitUntil: "networkidle" });

const running = await stillPage.evaluate(
  () =>
    [...document.getAnimations()].filter((a) =>
      String(a.animationName ?? "").startsWith("st-"),
    ).length,
);
console.log(
  running === 0
    ? "reduced motion: station animations are off, as intended"
    : `FAIL: ${running} station animation(s) still running under reduced motion`,
);
if (running !== 0) process.exitCode = 1;

await stillPage
  .locator("section")
  .first()
  .screenshot({ path: `${OUT}/${theme}-00-reduced-motion.png` });

await still.close();
await browser.close();
