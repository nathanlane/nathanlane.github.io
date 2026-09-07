import { expect, test } from "@playwright/test";

// R07 regression: blocked storage threw before the theme-change listener was
// registered (leaving the page without a working switch), and the accessible
// control only refreshed its own state on click, so a system color-scheme
// change left it reporting the wrong value.

type Page = import("@playwright/test").Page;

const themeSelect = (page: Page) => page.locator("#theme-preference");
const rootTheme = (page: Page) =>
	page.evaluate(() => document.documentElement.getAttribute("data-theme"));
const themeColorMeta = (page: Page) =>
	page.locator("meta[name='theme-color']").getAttribute("content");

// Simulates storage whose accessor itself throws (e.g. SecurityError in a
// privacy mode), which is stricter than a getItem() that merely returns null.
const blockStorageAccessor = (page: Page) =>
	page.addInitScript(() => {
		Object.defineProperty(window, "localStorage", {
			get() {
				throw new DOMException("blocked", "SecurityError");
			},
			configurable: true,
		});
	});

// Overrides one Storage method on the prototype, so it fails for the real
// localStorage object rather than a stand-in property on the instance.
const overrideStorageMethod = (page: Page, method: "getItem" | "setItem" | "removeItem") =>
	page.addInitScript((methodName) => {
		Object.defineProperty(Storage.prototype, methodName, {
			configurable: true,
			value: () => {
				throw new DOMException("blocked", "SecurityError");
			},
		});
	}, method);

const storageMethodThrows = (page: Page, method: "getItem" | "setItem" | "removeItem") =>
	page.evaluate((methodName) => {
		try {
			(localStorage[methodName] as (...args: string[]) => unknown)("probe", "x");
			return false;
		} catch {
			return true;
		}
	}, method);

test.describe("theme preference", () => {
	test("defaults to System and follows the device scheme", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/");
		await expect(themeSelect(page)).toHaveValue("system");
		expect(await rootTheme(page)).toBe("dark");

		await page.emulateMedia({ colorScheme: "light" });
		await expect.poll(() => rootTheme(page)).toBe("light");
		await expect(themeSelect(page)).toHaveValue("system");
	});

	for (const preference of ["light", "dark"] as const) {
		const deviceChange = preference === "light" ? "dark" : "light";

		test(`an explicit ${preference} selection ignores a later device change`, async ({ page }) => {
			// Start the device already matching the explicit choice, so the only
			// observable transition below is the (ignored) device change.
			await page.emulateMedia({ colorScheme: preference });
			await page.goto("/");

			await themeSelect(page).selectOption(preference);
			expect(await rootTheme(page)).toBe(preference);

			await page.emulateMedia({ colorScheme: deviceChange });
			// Give a pending "change" handler a turn to run before asserting it didn't.
			await page.waitForTimeout(50);
			expect(await rootTheme(page)).toBe(preference);
			await expect(themeSelect(page)).toHaveValue(preference);
		});
	}

	test("choosing System after an override resumes following the device", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto("/");

		await themeSelect(page).selectOption("dark");
		expect(await rootTheme(page)).toBe("dark");

		await themeSelect(page).selectOption("system");
		expect(await rootTheme(page)).toBe("light");

		await page.emulateMedia({ colorScheme: "dark" });
		await expect.poll(() => rootTheme(page)).toBe("dark");
	});

	test("selecting System removes the saved override", async ({ page }) => {
		await page.goto("/");
		await themeSelect(page).selectOption("light");
		expect(
			await page.evaluate(() => localStorage.getItem("theme")),
			"explicit selection is saved",
		).toBe("light");

		await themeSelect(page).selectOption("system");
		expect(
			await page.evaluate(() => localStorage.getItem("theme")),
			"System clears the saved override",
		).toBeNull();
	});

	for (const legacyValue of ["light", "dark"] as const) {
		// The device is set to the opposite scheme so the assertion proves the
		// saved value is honored, not just coincidentally matching the device.
		const deviceScheme = legacyValue === "light" ? "dark" : "light";

		test(`a legacy saved '${legacyValue}' value is honored and reflected in the selector`, async ({
			page,
		}) => {
			await page.emulateMedia({ colorScheme: deviceScheme });
			await page.addInitScript((value) => localStorage.setItem("theme", value), legacyValue);
			await page.goto("/");

			expect(await rootTheme(page)).toBe(legacyValue);
			await expect(themeSelect(page)).toHaveValue(legacyValue);
		});
	}

	test("an invalid saved value falls back to System", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "dark" });
		await page.addInitScript(() => localStorage.setItem("theme", "sepia"));
		await page.goto("/");

		expect(await rootTheme(page)).toBe("dark");
		await expect(themeSelect(page)).toHaveValue("system");
	});

	test("a blocked storage accessor does not prevent initial appearance or current-page switching", async ({
		page,
	}) => {
		await page.emulateMedia({ colorScheme: "dark" });
		await blockStorageAccessor(page);
		await page.goto("/");

		// Initial appearance still applies even though storage access throws.
		expect(await rootTheme(page)).toBe("dark");
		await expect(themeSelect(page)).toHaveValue("system");

		// The current page can still switch even though nothing can persist.
		await themeSelect(page).selectOption("light");
		expect(await rootTheme(page)).toBe("light");
	});

	test("a getItem failure does not prevent initial appearance", async ({ page }) => {
		await overrideStorageMethod(page, "getItem");
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/");

		expect(await storageMethodThrows(page, "getItem")).toBe(true);
		expect(await rootTheme(page)).toBe("dark");
		await expect(themeSelect(page)).toHaveValue("system");
	});

	test("a failed write still lets an explicit selection ignore later device changes", async ({
		page,
	}) => {
		await overrideStorageMethod(page, "setItem");
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/");

		await themeSelect(page).selectOption("dark");
		expect(await rootTheme(page)).toBe("dark");
		expect(await storageMethodThrows(page, "setItem")).toBe(true);

		// A real device transition away from the explicit choice: if the write's
		// failure caused the preference to be forgotten, this would flip to light.
		await page.emulateMedia({ colorScheme: "light" });
		await page.waitForTimeout(50);
		expect(await rootTheme(page)).toBe("dark");
		await expect(themeSelect(page)).toHaveValue("dark");
	});

	test("a failed removal still lets System resume following the device", async ({ page }) => {
		await page.addInitScript(() => localStorage.setItem("theme", "dark"));
		await overrideStorageMethod(page, "removeItem");
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto("/");
		expect(await rootTheme(page)).toBe("dark");

		await themeSelect(page).selectOption("system");
		expect(await storageMethodThrows(page, "removeItem")).toBe(true);
		expect(await rootTheme(page)).toBe("light");

		// If the failed removal left the stale "dark" override looking saved,
		// this device change would be (wrongly) ignored instead of followed.
		await page.emulateMedia({ colorScheme: "dark" });
		await expect.poll(() => rootTheme(page)).toBe("dark");
	});

	test("a saved preference survives reload", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto("/");

		await themeSelect(page).selectOption("dark");
		await page.reload();

		expect(await rootTheme(page)).toBe("dark");
		await expect(themeSelect(page)).toHaveValue("dark");
	});

	test("the selector is a labeled, accessible native control", async ({ page }) => {
		await page.goto("/");
		const select = themeSelect(page);
		await expect(select).toHaveRole("combobox");
		await expect(page.locator("label[for='theme-preference']")).toHaveText("Theme");
		expect(await select.locator("option").allTextContents()).toEqual(["System", "Light", "Dark"]);
	});

	test("theme-color metadata tracks the applied appearance", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto("/");
		const lightColor = await themeColorMeta(page);

		await themeSelect(page).selectOption("dark");
		const darkColor = await themeColorMeta(page);

		expect(darkColor).not.toBe(lightColor);
		expect(darkColor).toBe(
			await page.evaluate(
				() => `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--theme-bg")})`,
			),
		);
	});
});
