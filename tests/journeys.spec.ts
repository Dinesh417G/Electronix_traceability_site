import { test, expect } from "@playwright/test";

test.describe("live demo", () => {
  test("searching a sample serial returns that unit's record", async ({ page }) => {
    await page.goto("/demo");

    const firstChip = page.getByRole("button", { name: /^VLV-/ }).first();
    const serial = (await firstChip.innerText()).split(" ")[0] ?? "";
    expect(serial).toMatch(/^VLV-/);

    await page.getByLabel("Scan or type a serial number").fill(serial);
    await page.getByRole("button", { name: /Get this unit/ }).click();

    await expect(page.getByText(serial, { exact: false }).first()).toBeVisible();
    await expect(page.getByRole("table", { name: /Captured process values/ })).toBeVisible();
  });

  test("an unknown serial reports an error rather than failing silently", async ({ page }) => {
    await page.goto("/demo");
    await page.getByLabel("Scan or type a serial number").fill("NOT-A-REAL-SERIAL");
    await page.getByRole("button", { name: /Get this unit/ }).click();
    await expect(page.locator("#unit-search-error")).toContainText(
      "No unit in the sample dataset",
    );
  });

  test("filtering captured values changes what is shown", async ({ page }) => {
    await page.goto("/demo");
    const outOfSpec = page.getByRole("button", { name: /Out of spec/ });
    await outOfSpec.click();
    await expect(outOfSpec).toHaveAttribute("aria-pressed", "true");
  });

  test("expanding a reading reveals the raw device payload", async ({ page }) => {
    await page.goto("/demo");
    await page.getByRole("button", { name: "Show raw" }).first().click();
    await expect(page.getByText("Raw device payload").first()).toBeVisible();
  });
});

test.describe("recall calculator", () => {
  test("a known lot returns affected units, customers and a window", async ({ page }) => {
    await page.goto("/demo");
    await page.getByRole("button", { name: "GSK-2608-A14" }).first().click();

    await expect(page.getByText("Units affected")).toBeVisible();
    await expect(page.getByText("Provably clean")).toBeVisible();
    await expect(page.getByText("Containment window")).toBeVisible();
    await expect(page.getByRole("table", { name: /Customers affected/ })).toBeVisible();
  });

  test("an unknown lot says so rather than returning an empty table", async ({ page }) => {
    await page.goto("/demo");
    await page.getByLabel("Component lot code").fill("LOT-DOES-NOT-EXIST");
    await page.getByRole("button", { name: "Calculate scope" }).click();
    await expect(page.getByText(/No unit in the sample dataset consumed/)).toBeVisible();
  });
});

test.describe("lead form", () => {
  test("submitting valid details reaches the thank-you page", async ({ page }) => {
    await page.goto("/contact");
    // The form rejects submissions faster than a human could type.
    await page.waitForTimeout(2800);

    await page.getByLabel("Your name").fill("R Kumar");
    await page.getByLabel("Company").fill("Southern Pumps");
    await page.getByLabel("Phone or WhatsApp").fill("+91 94882 33115");
    await page.getByLabel("Email").fill("rkumar@example.com");
    await page.getByRole("button", { name: /Request a line walkthrough/ }).click();

    await expect(page).toHaveURL(/\/thank-you/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("reached us");
  });

  test("the server rejects an incomplete submission with field errors", async ({ request }) => {
    const res = await request.post("/api/lead", {
      headers: { "x-forwarded-for": "203.0.113.10" },
      data: { name: "R", company: "", phone: "1", email: "nope", started_at: 0 },
    });
    expect(res.status()).toBe(422);
    const body = (await res.json()) as { errors: Record<string, string> };
    expect(Object.keys(body.errors).length).toBeGreaterThan(2);
  });

  test("a filled honeypot is accepted but stored nowhere", async ({ request }) => {
    const res = await request.post("/api/lead", {
      headers: { "x-forwarded-for": "203.0.113.11" },
      data: {
        name: "Spam Bot",
        company: "Spam Co",
        phone: "+919000000000",
        email: "bot@example.com",
        website: "http://spam.example",
        started_at: Date.now() - 60_000,
      },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  test("a submission faster than a human can type is silently dropped", async ({ request }) => {
    const res = await request.post("/api/lead", {
      headers: { "x-forwarded-for": "203.0.113.12" },
      data: {
        name: "Fast Bot",
        company: "Fast Co",
        phone: "+919000000000",
        email: "fast@example.com",
        started_at: Date.now(),
      },
    });
    expect(res.status()).toBe(200);
  });

  test("repeated submissions from one address are rate limited", async ({ request }, testInfo) => {
    // Its own address, so this test cannot starve the budget of any other.
    const ip = `198.51.100.${testInfo.project.name === "mobile" ? 2 : 1}`;
    const post = () =>
      request.post("/api/lead", {
        headers: { "x-forwarded-for": ip },
        data: {
          name: "Flooder",
          company: "Flood Co",
          phone: "+919000000000",
          email: "flood@example.com",
          started_at: Date.now() - 60_000,
        },
      });

    const statuses: number[] = [];
    for (let i = 0; i < 12; i += 1) statuses.push((await post()).status());

    expect(statuses[0], "the first submission must succeed").toBe(200);
    expect(statuses, "a flood must eventually be refused").toContain(429);
  });
});

test.describe("navigation and contact channels", () => {
  test("mobile menu opens and navigates", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile viewport only");
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Menu" });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle, "the name must stay stable while state is on aria-expanded").toHaveAccessibleName(
      "Menu",
    );

    await page.getByRole("navigation", { name: "Main, mobile" }).getByRole("link", { name: "Pricing" }).click();
    await expect(page).toHaveURL(/\/pricing/);
  });

  test("WhatsApp links carry a prefilled, page-aware message", async ({ page }) => {
    await page.goto("/features/part-genealogy");
    const wa = page.locator('a[href^="https://wa.me/"]').first();
    const href = await wa.getAttribute("href");
    expect(href).toContain("919488233115");
    expect(href).toContain("text=");
    expect(decodeURIComponent(href ?? "")).toContain("part genealogy");
  });

  test("the phone number is dialable everywhere", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator('a[href="tel:+919488233115"]').first()).toBeVisible();
  });
});

test.describe("works without client JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the home page is readable and navigable with JS off", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Reveal-on-scroll content must not be hidden when script never runs.
    await expect(page.getByText("What it costs when the record is not there")).toBeVisible();
    await expect(page.getByRole("link", { name: /Book a 20-minute line walkthrough/ }).first()).toBeVisible();

    // The FAQ uses <details>, so it still opens with no script.
    const firstFaq = page.locator("details").first();
    await firstFaq.locator("summary").click();
    await expect(firstFaq).toHaveAttribute("open", "");
  });

  test("every stage of how-it-works is readable with JS off", async ({ page }) => {
    await page.goto("/how-it-works");
    for (const name of ["Job card issued", "Mark and label", "Scan anywhere, get everything"]) {
      await expect(page.getByRole("heading", { name })).toBeVisible();
    }
  });
});
