import { expect, test } from "@playwright/test";

// R05 regression: the mobile drawer let Tab escape into the covered page,
// left background content interactive/scrollable, and stayed open (with a
// now-hidden opener) after resizing past the desktop breakpoint.

const MOBILE_WIDTH = 390;
const DESKTOP_WIDTH = 1024;

const openDrawer = async (page: import("@playwright/test").Page) => {
	await page.setViewportSize({ width: MOBILE_WIDTH, height: 800 });
	await page.goto("/");
	await page.locator("#toggle-nav-menu-mobile").click();
	await expect(page.locator("#drawer")).toHaveAttribute("aria-hidden", "false");
};

const isMainOrFooterInert = (page: import("@playwright/test").Page) =>
	page.evaluate(() => {
		const main = document.getElementById("main");
		const footer = document.querySelector("footer");
		return [main, footer].some(
			(el) => !!el && (el.hasAttribute("inert") || !!el.closest("[inert]")),
		);
	});

const focusedElementIsInsideBackground = (page: import("@playwright/test").Page) =>
	page.evaluate(() => {
		const main = document.getElementById("main");
		const footer = document.querySelector("footer");
		const active = document.activeElement;
		return !!active && [main, footer].some((el) => !!el && el.contains(active));
	});

test.describe("mobile navigation drawer", () => {
	test("opening moves focus into the drawer", async ({ page }) => {
		await openDrawer(page);
		await expect(page.locator("#nav-menu-mobile a").first()).toBeFocused();
	});

	test("Tab cycles through the overlay's controls without reaching the covered page", async ({
		page,
	}) => {
		await openDrawer(page);

		const seen: (string | null)[] = [];
		let wrapped = false;
		for (let i = 0; i < 20 && !wrapped; i++) {
			const marker = await page.evaluate(() => {
				const el = document.activeElement;
				if (!el) return null;
				if (!el.hasAttribute("data-tab-marker")) {
					el.setAttribute("data-tab-marker", `m${Math.random().toString(36).slice(2)}`);
				}
				return el.getAttribute("data-tab-marker");
			});
			if (seen.includes(marker)) {
				wrapped = true;
				break;
			}
			seen.push(marker);

			expect(await focusedElementIsInsideBackground(page)).toBe(false);

			await page.keyboard.press("Tab");
		}

		expect(
			wrapped,
			"Tab should cycle back to an already-visited control instead of escaping the overlay",
		).toBe(true);
		// More than just the single drawer link: the trap spans multiple controls.
		expect(seen.length).toBeGreaterThan(1);
	});

	test("Shift+Tab from the first control wraps backward without reaching the covered page", async ({
		page,
	}) => {
		await openDrawer(page);
		await page.keyboard.press("Shift+Tab");

		expect(await focusedElementIsInsideBackground(page)).toBe(false);
		const focusedSomething = await page.evaluate(() => document.activeElement !== document.body);
		expect(focusedSomething).toBe(true);
	});

	test("background is inert and scrolling is locked while the drawer is open", async ({ page }) => {
		await page.setViewportSize({ width: MOBILE_WIDTH, height: 800 });
		await page.goto("/");
		const scrollBefore = await page.evaluate(() => window.scrollY);

		await page.locator("#toggle-nav-menu-mobile").click();
		await expect(page.locator("#drawer")).toHaveAttribute("aria-hidden", "false");

		expect(await isMainOrFooterInert(page)).toBe(true);

		// The page scrolls smoothly, so give an attempted scroll time to take
		// effect before confirming it was blocked while the drawer is open.
		await page.mouse.wheel(0, 600);
		await page.waitForTimeout(300);
		expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);

		await page.keyboard.press("Escape");
		await expect(page.locator("#drawer")).toHaveAttribute("aria-hidden", "true");
		expect(await isMainOrFooterInert(page)).toBe(false);

		await page.mouse.wheel(0, 600);
		await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore);
	});

	test("Escape closes the drawer and returns focus to the toggle button", async ({ page }) => {
		await openDrawer(page);
		await page.keyboard.press("Escape");
		await expect(page.locator("#drawer")).toHaveAttribute("aria-hidden", "true");
		await expect(page.locator("#toggle-nav-menu-mobile")).toBeFocused();
	});

	test("the toggle button remains keyboard-reachable and closes the drawer", async ({ page }) => {
		await openDrawer(page);
		await page.locator("#toggle-nav-menu-mobile").focus();
		await page.keyboard.press("Enter");
		await expect(page.locator("#drawer")).toHaveAttribute("aria-hidden", "true");
	});

	test("activating a drawer link closes the drawer and navigates normally", async ({ page }) => {
		await openDrawer(page);
		const link = page.locator("#nav-menu-mobile a").first();
		const href = await link.getAttribute("href");
		expect(href).toBeTruthy();
		await link.click();
		await expect(page).toHaveURL(new RegExp(`${href?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));
	});

	test("resizing to desktop closes the drawer, clears background restrictions, and focuses desktop nav", async ({
		page,
	}) => {
		await openDrawer(page);
		await page.setViewportSize({ width: DESKTOP_WIDTH, height: 800 });

		await expect(page.locator("#drawer")).toHaveAttribute("aria-hidden", "true");
		expect(await isMainOrFooterInert(page)).toBe(false);
		await expect(page.locator('nav[aria-label="Main navigation"] a').first()).toBeFocused();
	});

	test("repeated open/close cycles do not accumulate handlers or leave content inert", async ({
		page,
	}) => {
		await page.setViewportSize({ width: MOBILE_WIDTH, height: 800 });
		await page.goto("/");

		for (let i = 0; i < 4; i++) {
			await page.locator("#toggle-nav-menu-mobile").click();
			await expect(page.locator("#drawer")).toHaveAttribute("aria-hidden", "false");
			await expect(page.locator("#nav-menu-mobile a").first()).toBeFocused();
			await page.keyboard.press("Escape");
			await expect(page.locator("#drawer")).toHaveAttribute("aria-hidden", "true");
			await expect(page.locator("#toggle-nav-menu-mobile")).toBeFocused();
		}

		expect(await isMainOrFooterInert(page)).toBe(false);
	});
});
