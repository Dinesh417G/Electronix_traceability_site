import { test, expect } from "@playwright/test";
import { PUBLIC_ROUTES } from "./routes";

const seenTitles = new Map<string, string>();
const seenDescriptions = new Map<string, string>();

for (const route of PUBLIC_ROUTES) {
  test(`metadata, headings and schema on ${route}`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status(), `${route} must return 200`).toBe(200);

    // Exactly one h1.
    const h1s = page.locator("h1");
    await expect(h1s).toHaveCount(1);
    expect((await h1s.first().innerText()).trim().length).toBeGreaterThan(8);

    // Unique title and description within sensible lengths.
    const title = await page.title();
    expect(title.length, `${route} title length`).toBeGreaterThan(10);
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description, `${route} needs a meta description`).toBeTruthy();
    expect((description ?? "").length, `${route} description is too long`).toBeLessThanOrEqual(165);

    expect(seenTitles.get(title) ?? route, `duplicate title with ${seenTitles.get(title)}`).toBe(
      route,
    );
    seenTitles.set(title, route);
    if (description) {
      expect(
        seenDescriptions.get(description) ?? route,
        `duplicate description with ${seenDescriptions.get(description)}`,
      ).toBe(route);
      seenDescriptions.set(description, route);
    }

    // Canonical present and absolute.
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical, `${route} needs a canonical`).toMatch(/^https?:\/\//);

    // Every JSON-LD block must parse.
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length, `${route} needs JSON-LD`).toBeGreaterThan(0);
    for (const block of blocks) {
      const parsed = JSON.parse(block) as { "@context": string; "@graph": unknown[] };
      expect(parsed["@context"]).toBe("https://schema.org");
      expect(Array.isArray(parsed["@graph"])).toBe(true);
      expect(parsed["@graph"].length).toBeGreaterThan(0);
    }
  });
}

test("internal linking: every page links to at least three others", async ({ page }) => {
  for (const route of PUBLIC_ROUTES) {
    await page.goto(route);
    const hrefs = await page.locator("main a[href^='/']").evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).getAttribute("href") ?? ""),
    );
    const distinct = new Set(hrefs.map((h) => h.split("#")[0]).filter((h) => h && h !== route));
    expect(distinct.size, `${route} has only ${distinct.size} outbound internal links`).toBeGreaterThanOrEqual(3);
  }
});

test("sitemap covers every indexable route and robots points at it", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();

  for (const route of PUBLIC_ROUTES) {
    if (route === "/thank-you") {
      expect(xml, "/thank-you is noindex and must not be in the sitemap").not.toContain(
        "/thank-you",
      );
      continue;
    }
    const suffix = route === "/" ? "" : route;
    expect(xml, `${route} missing from sitemap`).toContain(`${suffix}</loc>`);
  }

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("sitemap.xml");
});

test("llms.txt is served", async ({ request }) => {
  const res = await request.get("/llms.txt");
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain("ElectronIx Trace");
});

test("no page scrolls horizontally at 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  const offenders: string[] = [];

  for (const route of PUBLIC_ROUTES) {
    await page.goto(route);
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return de.scrollWidth - de.clientWidth;
    });
    if (overflow > 1) offenders.push(`${route}: ${overflow}px`);
  }

  expect(offenders, offenders.join("\n")).toEqual([]);
});
