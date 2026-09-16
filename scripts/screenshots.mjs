import { chromium } from "@playwright/test";
import { existsSync, mkdirSync } from "node:fs";

const INSTALLED = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const OUT = "screenshots";
const WIDTHS = [360, 768, 1440];
// Light first, because light is the default a visitor gets. Both are captured:
// a width-only sweep stopped being full coverage the moment the site gained a
// second theme, and the palettes are independent — one can regress alone.
const THEMES = ["light", "dark"];
const ROUTES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "/",
      "/demo",
      "/how-it-works",
      "/industries/auto-components",
      "/pricing",
      "/vs/siemens-opcenter",
      "/resources/planning-a-recall-scope-calculation",
      "/contact",
    ];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(
  existsSync(INSTALLED) ? { executablePath: INSTALLED } : {},
);

let mismatches = 0;

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height: Math.round(width * 1.6) },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();

    // Seed the stored preference the way the toggle does, so the page's own
    // inline script applies it before first paint. Driving it through the real
    // mechanism also means this run would catch that mechanism breaking.
    await page.addInitScript((t) => {
      try {
        localStorage.setItem("trace-theme", t);
      } catch {}
    }, theme);

    for (const route of ROUTES) {
      await page.goto(`http://127.0.0.1:3100${route}`, { waitUntil: "networkidle" });

      const applied =
        (await page.evaluate(() =>
          document.documentElement.getAttribute("data-theme"),
        )) ?? "light";
      if (applied !== theme) {
        mismatches++;
        console.log(`THEME ${route} @${width}px: wanted ${theme}, got ${applied}`);
      }

      const name = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
      await page.screenshot({
        path: `${OUT}/${name}-${theme}-${width}.png`,
        fullPage: true,
      });

      // Detect horizontal overflow, which a screenshot hides.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (overflow > 1)
        console.log(`OVERFLOW ${route} @${width}px (${theme}): ${overflow}px`);
    }
    await ctx.close();
  }
}

if (mismatches) console.log(`${mismatches} route(s) did not apply the requested theme`);
await browser.close();
console.log("screenshots written to", OUT);
