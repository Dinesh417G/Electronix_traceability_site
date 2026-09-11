import { chromium } from "@playwright/test";
import { existsSync, mkdirSync } from "node:fs";

const INSTALLED = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const OUT = "screenshots";
const WIDTHS = [360, 768, 1440];
const ROUTES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["/", "/demo", "/how-it-works", "/industries/auto-components", "/pricing",
     "/vs/siemens-opcenter", "/resources/planning-a-recall-scope-calculation", "/contact"];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(
  existsSync(INSTALLED) ? { executablePath: INSTALLED } : {},
);

for (const width of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width, height: Math.round(width * 1.6) },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(`http://127.0.0.1:3100${route}`, { waitUntil: "networkidle" });
    const name = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
    await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true });
    // Detect horizontal overflow, which a screenshot hides.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) console.log(`OVERFLOW ${route} @${width}px: ${overflow}px`);
  }
  await ctx.close();
}
await browser.close();
console.log("screenshots written to", OUT);
