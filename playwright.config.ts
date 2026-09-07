import { defineConfig, devices } from "@playwright/test";

// Runs against a production build served by `astro preview`, started and
// stopped by scripts/validation/browser-check.mjs. See CONTRIBUTING.md for
// the local Chromium install step.
const PORT = process.env.PLAYWRIGHT_PORT ?? "4322";
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
	testDir: "./tests/browser",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? "line" : "list",
	use: {
		baseURL: BASE_URL,
		trace: "retain-on-failure",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
