import { expect, test } from "@playwright/test";

// R06 regression: search used to examine only the current paginated page's ten
// posts, so an older published post ("Baseline Grid Refactoring Complete") was
// unreachable from the default `/posts/` search field. Search now lives on the
// full archive, which renders every published post.
//
// R10 regression: the research page's table of contents linked to a "Works in
// Progress" section that was never rendered because the collection currently has
// no work-in-progress entries. TOC links must be derived from the same nonempty
// groups the page actually renders.

const KNOWN_OLDER_POST = "Baseline Grid Refactoring Complete";
const KNOWN_TAG = "grid-system";
const KNOWN_DRAFT_POST = "A Hunt for the Oldest Government Computer";

test.describe("archive search", () => {
	test("finds a known older post by title, case-insensitively and trimmed", async ({ page }) => {
		await page.goto("/posts/archive/");
		const entry = page.locator("[data-post-item]", { hasText: KNOWN_OLDER_POST });
		await expect(entry).toHaveCount(1);

		const search = page.getByLabel("Search by title or tag…");
		await search.fill("  BASELINE grid refactoring  ");
		await expect(entry).toBeVisible();

		const hiddenCount = await page.locator("[data-post-item].hidden").count();
		const totalCount = await page.locator("[data-post-item]").count();
		expect(hiddenCount).toBeGreaterThan(0);
		expect(hiddenCount).toBeLessThan(totalCount);
	});

	test("finds the same post by a tag substring", async ({ page }) => {
		await page.goto("/posts/archive/");
		const search = page.getByLabel("Search by title or tag…");
		await search.fill(KNOWN_TAG);

		const entry = page.locator("[data-post-item]", { hasText: KNOWN_OLDER_POST });
		await expect(entry).toBeVisible();
	});

	test("reports no results for a query that matches nothing", async ({ page }) => {
		await page.goto("/posts/archive/");
		const search = page.getByLabel("Search by title or tag…");
		await search.fill("zzz-no-such-post-or-tag-zzz");

		await expect(page.locator("[data-post-item]:not(.hidden)")).toHaveCount(0);
		await expect(page.getByRole("status")).toContainText(/no posts found/i);
	});

	test("hides year headings whose groups have no matches", async ({ page }) => {
		await page.goto("/posts/archive/");
		const totalYearHeadings = await page.locator("[data-year-group]").count();
		expect(totalYearHeadings).toBeGreaterThan(1);

		const search = page.getByLabel("Search by title or tag…");
		await search.fill(KNOWN_OLDER_POST);

		const visibleHeadings = page.locator("[data-year-group]:not(.hidden)");
		await expect(visibleHeadings).toHaveCount(1);
		await expect(page.locator('section[id^="year-"]:visible')).toHaveCount(1);
	});

	test("clearing the query restores all entries and year headings", async ({ page }) => {
		await page.goto("/posts/archive/");
		const totalPosts = await page.locator("[data-post-item]").count();
		const totalYearHeadings = await page.locator("[data-year-group]").count();

		const search = page.getByLabel("Search by title or tag…");
		await search.fill(KNOWN_OLDER_POST);
		await expect(page.locator("[data-post-item]:not(.hidden)")).not.toHaveCount(totalPosts);

		await search.fill("");
		await expect(page.locator("[data-post-item]:not(.hidden)")).toHaveCount(totalPosts);
		await expect(page.locator("[data-year-group]:not(.hidden)")).toHaveCount(totalYearHeadings);
		await expect(page.getByRole("status")).toHaveText("");
	});

	test("excludes drafts from the rendered archive, even when searched for directly", async ({
		page,
	}) => {
		await page.goto("/posts/archive/");
		await expect(page.locator("[data-post-item]", { hasText: KNOWN_DRAFT_POST })).toHaveCount(0);

		const search = page.getByLabel("Search by title or tag…");
		await search.fill(KNOWN_DRAFT_POST);
		await expect(page.locator("[data-post-item]:not(.hidden)")).toHaveCount(0);
		await expect(page.getByRole("status")).toContainText(/no posts found/i);
	});

	test.describe("without JavaScript", () => {
		test.use({ javaScriptEnabled: false });

		test("archive entries remain readable and linkable; the nonfunctional search field stays hidden", async ({
			page,
		}) => {
			await page.goto("/posts/archive/");
			await expect(page.locator("#archive-search")).toBeHidden();

			const entry = page
				.locator("[data-post-item]", { hasText: KNOWN_OLDER_POST })
				.getByRole("link");
			await expect(entry).toBeVisible();
			const href = await entry.getAttribute("href");
			expect(href).toBeTruthy();
			if (!href) throw new Error("expected the entry link to have an href");

			await page.goto(new URL(href, page.url()).toString());
			await expect(page.locator("h1", { hasText: KNOWN_OLDER_POST })).toBeVisible();
		});
	});
});

test.describe("paginated posts page", () => {
	test("page one links to archive search instead of embedding a search field", async ({ page }) => {
		await page.goto("/posts/1/");
		await expect(page.locator("#post-search")).toHaveCount(0);

		const link = page.getByRole("link", { name: "Search the full archive →" });
		await expect(link).toBeVisible();
		await expect(link).toHaveAttribute("href", "/posts/archive/#archive-search");
	});

	test("later pages have no leftover search field either", async ({ page }) => {
		await page.goto("/posts/2/");
		await expect(page.locator("#post-search")).toHaveCount(0);
		await expect(page.getByRole("link", { name: "Search the full archive →" })).toHaveCount(0);
	});
});

test.describe("research navigation", () => {
	test("every table-of-contents anchor link resolves to a rendered section", async ({ page }) => {
		await page.goto("/research/");

		const tocLinks = page.locator(".table-of-contents .toc-link");
		const hrefs = await tocLinks.evaluateAll((links) =>
			links.map((link) => link.getAttribute("href")),
		);
		expect(hrefs.length).toBeGreaterThan(0);

		for (const href of hrefs) {
			expect(href).toBeTruthy();
			if (href?.startsWith("#")) {
				await expect(page.locator(href)).toHaveCount(1);
			}
		}
	});

	test("empty status groups produce no dangling anchor, and the CV link survives", async ({
		page,
	}) => {
		await page.goto("/research/");

		// This site's current content collection has no work-in-progress or
		// archived research entries; both sections and their TOC links should be
		// absent together, not just one or the other.
		for (const [sectionId] of [["#wip"], ["#archived"]] as const) {
			const sectionExists = (await page.locator(sectionId).count()) > 0;
			const linkExists = (await page.locator(`.toc-link[href="${sectionId}"]`).count()) > 0;
			expect(linkExists).toBe(sectionExists);
		}

		const cvLink = page.locator(".toc-link", { hasText: "Curriculum Vitae" });
		await expect(cvLink).toBeVisible();
		const cvHref = await cvLink.getAttribute("href");
		expect(cvHref).toBeTruthy();
		expect(cvHref?.startsWith("#")).toBe(false);
	});
});
