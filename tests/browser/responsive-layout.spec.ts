import { expect, test } from "@playwright/test";

// R01 regression: at 390px the shared layout used to expand to ~557px,
// pushing header controls outside the viewport.

const WIDTHS = [320, 390, 640, 768, 1024, 1280] as const;
const THEMES = ["light", "dark"] as const;
const ROUTES: { path: string; label: string }[] = [
	{ path: "/", label: "home" },
	{ path: "/about/", label: "about" },
	{ path: "/research/", label: "research" },
	{ path: "/posts/markdown-elements/", label: "long-form (code + tables)" },
];

function expectWithinViewport(
	box: { x: number; width: number } | null,
	viewportWidth: number,
	name: string,
) {
	if (!box) throw new Error(`${name} should be present and visible`);
	expect(box.x, `${name} left edge should be within the viewport`).toBeGreaterThanOrEqual(0);
	expect(box.x + box.width, `${name} right edge should be within the viewport`).toBeLessThanOrEqual(
		viewportWidth + 1,
	); // +1: sub-pixel layout rounding
}

for (const theme of THEMES) {
	test.describe(`${theme} theme`, () => {
		test.use({ colorScheme: theme });

		for (const { path, label } of ROUTES) {
			for (const width of WIDTHS) {
				test(`${label} at ${width}px: body fits viewport, header controls reachable`, async ({
					page,
				}) => {
					await page.setViewportSize({ width, height: 900 });
					await page.goto(path);

					if (path === "/posts/markdown-elements/" && width >= 1024) {
						await expect(page.locator("#series-panel")).toBeVisible();
					}

					const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
					expect(
						scrollWidth,
						"page should not require horizontal scrolling to read body text",
					).toBeLessThanOrEqual(width);

					expectWithinViewport(await page.locator("body").boundingBox(), width, "body");
					expectWithinViewport(await page.locator("#main").boundingBox(), width, "main content");
					const proseOverflow = await page
						.locator(".prose p")
						.evaluateAll((paragraphs) =>
							paragraphs.filter((p) => p.scrollWidth > p.clientWidth + 1).map((p) => p.textContent),
						);
					expect(proseOverflow, "prose should fit its reading column").toEqual([]);

					const themeSelectBox = await page.locator("theme-toggle select").boundingBox();
					expectWithinViewport(themeSelectBox, width, "theme selector");

					if (width < 768) {
						const menuBox = await page.locator("#toggle-nav-menu-mobile").boundingBox();
						expectWithinViewport(menuBox, width, "mobile menu button");
					} else {
						await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();
					}
				});
			}
		}

		test("long-form page: wide code and tables scroll locally, not the page", async ({ page }) => {
			await page.setViewportSize({ width: 390, height: 900 });
			await page.goto("/posts/markdown-elements/");

			// Supply unbreakable content to exercise scrolling, not just its CSS declaration.
			await page
				.locator("pre code")
				.first()
				.evaluate((code) => {
					code.textContent = "W".repeat(300);
				});
			await page
				.locator("table td")
				.first()
				.evaluate((cell) => {
					cell.textContent = "W".repeat(300);
				});
			for (const selector of ["pre", "table"]) {
				const element = page.locator(selector).first();
				await expect(element).toBeVisible();
				expectWithinViewport(await element.boundingBox(), 390, selector);
				const metrics = await element.evaluate((node) => {
					node.scrollLeft = 100;
					return {
						width: node.clientWidth,
						contentWidth: node.scrollWidth,
						scroll: node.scrollLeft,
					};
				});
				expect(metrics.contentWidth).toBeGreaterThan(metrics.width);
				expect(metrics.scroll).toBeGreaterThan(0);
			}
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
				390,
			);
		});
	});
}
