import { expect, type Locator, type Page, test } from "@playwright/test";

// R03: the contents panel used to have three competing `!important` visibility
// overrides in global.css that disagreed with the toggle module's own classes,
// so computed `display` and `aria-hidden` could contradict each other.
// R04: the series-navigation openers used non-complementary breakpoints
// (mobile button hidden from 640px, desktop button visible from 768px),
// leaving no opener at all between 640 and 767px.

const BLOG_WITH_SERIES = "/posts/lane-docs/setup/"; // has headings (blog TOC) and a series (series nav)
const SERIES_WITH_TOC = "/series/lane-docs/"; // series-introduction TOC (headings present)
const SERIES_WITHOUT_TOC = "/series/markdown-elements/"; // series intro with no headings

async function expectAriaMatchesVisibility(panel: Locator, expectedVisible: boolean) {
	// A resize's matchMedia "change" event and the resulting class update are async relative
	// to Playwright's setViewportSize, so poll instead of reading computed state once.
	await expect
		.poll(
			async () => {
				const { display, ariaHidden } = await panel.evaluate((el) => ({
					display: getComputedStyle(el).display,
					ariaHidden: el.getAttribute("aria-hidden"),
				}));
				return { visible: display !== "none", ariaHidden };
			},
			{
				message: "computed display and aria-hidden should both agree with the expected visibility",
			},
		)
		.toEqual({ visible: expectedVisible, ariaHidden: String(!expectedVisible) });
}

async function isReachable(locator: Locator): Promise<boolean> {
	return locator.evaluate((el) => (el as HTMLElement).offsetParent !== null);
}

test.describe("blog TOC (1281px breakpoint)", () => {
	for (const width of [1024, 1100, 1280]) {
		test(`below 1281px (${width}px): TOC and its opener are both hidden`, async ({ page }) => {
			await page.setViewportSize({ width, height: 900 });
			await page.goto(BLOG_WITH_SERIES);

			await expectAriaMatchesVisibility(page.locator("#toc-panel"), false);
			expect(
				await isReachable(page.locator("#toggle-toc")),
				"TOC opener must not be reachable below 1281px",
			).toBe(false);
		});
	}

	test("at 1281px: TOC opens by default with a reachable opener", async ({ page }) => {
		await page.setViewportSize({ width: 1281, height: 900 });
		await page.goto(BLOG_WITH_SERIES);

		await expectAriaMatchesVisibility(page.locator("#toc-panel"), true);
		const toggle = page.locator("#toggle-toc");
		await expect(toggle).toBeVisible();
		await expect(toggle).toHaveAttribute("aria-expanded", "true");
	});

	test("toggling closed hides the panel, matches ARIA, and returns focus on close", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1400, height: 900 });
		await page.goto(BLOG_WITH_SERIES);

		const panel = page.locator("#toc-panel");
		const toggle = page.locator("#toggle-toc");
		await expectAriaMatchesVisibility(panel, true);

		await page.locator("#close-toc").click();
		await expectAriaMatchesVisibility(panel, false);
		await expect(toggle).toHaveAttribute("aria-expanded", "false");
		await expect(toggle).toBeFocused();
		expect(await isReachable(page.locator("#close-toc"))).toBe(false);

		await toggle.click();
		await expectAriaMatchesVisibility(panel, true);
		await expect(toggle).toHaveAttribute("aria-expanded", "true");
	});

	test("crossing the breakpoint resets to the new range's default, not the prior toggle", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1400, height: 900 });
		await page.goto(BLOG_WITH_SERIES);

		await page.locator("#close-toc").click();
		await expectAriaMatchesVisibility(page.locator("#toc-panel"), false);

		// Cross below 1281px and back above it.
		await page.setViewportSize({ width: 1024, height: 900 });
		await expectAriaMatchesVisibility(page.locator("#toc-panel"), false);
		await page.setViewportSize({ width: 1400, height: 900 });
		await expectAriaMatchesVisibility(page.locator("#toc-panel"), true);
	});

	test("reload uses the default, not a persisted prior toggle", async ({ page }) => {
		await page.setViewportSize({ width: 1400, height: 900 });
		await page.goto(BLOG_WITH_SERIES);

		await page.locator("#close-toc").click();
		await expectAriaMatchesVisibility(page.locator("#toc-panel"), false);

		await page.reload();
		await expectAriaMatchesVisibility(page.locator("#toc-panel"), true);
	});
});

test.describe("series-introduction TOC (768px breakpoint)", () => {
	test("below 768px: TOC and its opener are hidden", async ({ page }) => {
		await page.setViewportSize({ width: 767, height: 900 });
		await page.goto(SERIES_WITH_TOC);

		await expectAriaMatchesVisibility(page.locator("#toc-panel"), false);
		expect(await isReachable(page.locator("#toggle-toc"))).toBe(false);
	});

	test("at 768px and above: TOC opens by default with a reachable opener", async ({ page }) => {
		for (const width of [768, 1024]) {
			await page.setViewportSize({ width, height: 900 });
			await page.goto(SERIES_WITH_TOC);
			await expectAriaMatchesVisibility(page.locator("#toc-panel"), true);
			await expect(page.locator("#toggle-toc")).toBeVisible();
		}
	});

	test("close/focus return, same-range resize, 767-768 crossing, and reload default", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 768, height: 900 });
		await page.goto(SERIES_WITH_TOC);

		const panel = page.locator("#toc-panel");
		const toggle = page.locator("#toggle-toc");
		await expectAriaMatchesVisibility(panel, true);

		await page.locator("#close-toc").click();
		await expectAriaMatchesVisibility(panel, false);
		await expect(toggle).toBeFocused();

		// Resizing within the same >=768px range keeps the user's toggle.
		await page.setViewportSize({ width: 900, height: 900 });
		await expectAriaMatchesVisibility(panel, false);

		// Crossing down below 768px and back up resets to that range's default (open).
		await page.setViewportSize({ width: 767, height: 900 });
		await expectAriaMatchesVisibility(panel, false);
		expect(await isReachable(toggle)).toBe(false);
		await page.setViewportSize({ width: 768, height: 900 });
		await expectAriaMatchesVisibility(panel, true);

		// Reload uses the default, not a persisted prior toggle.
		await page.locator("#close-toc").click();
		await expectAriaMatchesVisibility(panel, false);
		await page.reload();
		await expectAriaMatchesVisibility(page.locator("#toc-panel"), true);
	});

	test("no headings means no TOC controls at all", async ({ page }) => {
		for (const width of [768, 1024, 1400]) {
			await page.setViewportSize({ width, height: 900 });
			await page.goto(SERIES_WITHOUT_TOC);
			await expect(page.locator("#toggle-toc")).toHaveCount(0);
			await expect(page.locator("#toc-panel")).toHaveCount(0);
		}
	});
});

test.describe("series navigation opener (no 640-767px gap)", () => {
	for (const width of [320, 480, 639, 640, 700, 767, 768, 900, 1023]) {
		test(`at ${width}px an opener is reachable while the panel is collapsed by default`, async ({
			page,
		}) => {
			await page.setViewportSize({ width, height: 900 });
			await page.goto(BLOG_WITH_SERIES);

			await expectAriaMatchesVisibility(page.locator("#series-panel"), false);
			const desktopOpener = page.locator("#toggle-panel");
			const mobileOpener = page.locator("#toggle-panel-mobile");
			const reachable = (await isReachable(desktopOpener)) || (await isReachable(mobileOpener));
			expect(reachable, `an opener should be reachable at ${width}px`).toBe(true);
		});
	}

	test("at 1024px and above: panel opens by default", async ({ page }) => {
		await page.setViewportSize({ width: 1024, height: 900 });
		await page.goto(BLOG_WITH_SERIES);
		await expectAriaMatchesVisibility(page.locator("#series-panel"), true);
	});

	test("opening below 1024px, then closing from inside, returns focus to the visible opener", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 700, height: 900 });
		await page.goto(BLOG_WITH_SERIES);

		const mobileOpener = page.locator("#toggle-panel-mobile");
		await mobileOpener.click();
		await expectAriaMatchesVisibility(page.locator("#series-panel"), true);

		await page.locator("#close-panel").click();
		await expectAriaMatchesVisibility(page.locator("#series-panel"), false);
		await expect(mobileOpener).toBeFocused();
		expect(await isReachable(page.locator("#close-panel"))).toBe(false);
	});

	test("crossing 1024px resets to the new range's default", async ({ page }) => {
		await page.setViewportSize({ width: 1200, height: 900 });
		await page.goto(BLOG_WITH_SERIES);

		await page.locator("#toggle-panel").click(); // close the default-open panel
		await expectAriaMatchesVisibility(page.locator("#series-panel"), false);

		await page.setViewportSize({ width: 900, height: 900 });
		await expectAriaMatchesVisibility(page.locator("#series-panel"), false);

		await page.setViewportSize({ width: 1200, height: 900 });
		await expectAriaMatchesVisibility(page.locator("#series-panel"), true);
	});
});
