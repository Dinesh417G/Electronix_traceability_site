import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

const PORT = 3117;

/**
 * This environment ships a pre-installed Chromium that may not match the build
 * number Playwright expects, and downloading browsers is disabled here. Point
 * at the installed binary when it exists and let Playwright resolve its own
 * otherwise, so the suite runs both here and on a normal machine.
 */
const INSTALLED_CHROMIUM = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const executablePath = existsSync(INSTALLED_CHROMIUM) ? INSTALLED_CHROMIUM : undefined;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [["list"]],
  timeout: 45_000,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], launchOptions: { executablePath } },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    // Never reuse a server. A long-lived `next start` from an earlier build
    // silently turns the whole suite into a test of stale output — which is
    // exactly what happened twice while writing these tests.
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
