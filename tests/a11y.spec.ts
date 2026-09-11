import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PUBLIC_ROUTES } from "./routes";

/**
 * Audited with reduced motion, which is the state the design promises: every
 * animation has a static end state and nothing stays hidden waiting for a
 * scroll. It is also the configuration a real user with vestibular sensitivity
 * browses in, so it is the honest thing to audit.
 */
test.use({ reducedMotion: "reduce" });

for (const route of PUBLIC_ROUTES) {
  test(`no accessibility violations on ${route}`, async ({ page }) => {
    await page.goto(route);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const detail = results.violations
      .flatMap((v) =>
        v.nodes.slice(0, 6).map((n) => {
          const why = [...n.any, ...n.all, ...n.none].map((c) => c.message).join("; ");
          return `${v.id} @ ${n.target.join(" ")} :: ${why}`;
        }),
      )
      .join("\n");

    expect(
      results.violations.map((v) => v.id),
      detail,
    ).toEqual([]);
  });
}

test("reduced motion leaves every reveal element fully visible", async ({ page }) => {
  await page.goto("/");
  const hidden = await page.locator(".reveal").evaluateAll((els) =>
    els
      .filter((el) => Number(getComputedStyle(el).opacity) < 0.99)
      .map((el) => el.className),
  );
  expect(hidden, "reveal elements must not stay transparent under reduced motion").toEqual([]);
});

test("the hero resolves to its full static state under reduced motion", async ({ page }) => {
  await page.goto("/");

  // Every node of the genealogy tree must be painted, not waiting on a delay.
  const faded = await page.locator("svg g, svg path, svg rect").evaluateAll((els) =>
    els
      .filter((el) => Number(getComputedStyle(el).opacity) < 0.99)
      .map((el) => el.tagName),
  );
  expect(faded, "hero elements must not stay transparent under reduced motion").toEqual([]);

  // And the labels the tree exists to show must actually be on the page.
  for (const text of ["JOB CARD", "OP 30 TORQUE", "DISPATCHED"]) {
    await expect(page.locator("svg text", { hasText: text }).first()).toBeAttached();
  }
});
