import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();

describe("public post consumers", () => {
	it("routes public-facing post lookups through the shared helper", () => {
		for (const relativePath of [
			"src/pages/writing/index.astro",
			"src/components/SeriesPanel.astro",
		]) {
			const source = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

			expect(source).toContain("getAllPosts");
			expect(source).not.toMatch(/getCollection\((["'])post\1\)/);
		}
	});
});

describe("page header markup", () => {
	it("does not wrap rendered html fragments in paragraph tags", () => {
		const source = fs.readFileSync(path.join(repoRoot, "src/components/PageHeader.astro"), "utf8");

		expect(source).not.toContain("<p set:html={processedDescription}");
		expect(source).not.toContain("<p set:html={processedAdditionalInfo}");
		expect(source).toContain("<div set:html={processedDescription} />");
		expect(source).toContain("<div set:html={processedAdditionalInfo} />");
	});
});

describe("public link hygiene", () => {
	it("does not point footer utility links at missing generated routes", () => {
		const source = fs.readFileSync(
			path.join(repoRoot, "src/components/layout/Footer.astro"),
			"utf8",
		);

		expect(source).not.toContain('href="/privacy"');
		expect(source).not.toContain('href="/sitemap.xml"');
		expect(source).toContain('href="/sitemap-index.xml"');
	});

	it("filters archive topic links to generated tag routes", () => {
		const source = fs.readFileSync(path.join(repoRoot, "src/pages/posts/archive.astro"), "utf8");

		expect(source).toContain("const visibleTagCategories = Object.entries(tagCategories)");
		expect(source).toContain("tags: tags.filter((tag) => uniqueTags.includes(tag))");
		expect(source).toContain("visibleTagCategories.map");
		expect(source).not.toContain("Object.entries(tagCategories).map(([category, tags])");
	});

	it("does not contain known malformed public content links", () => {
		const checkedFiles = [
			"src/content/post/industrial-policy-a-round-up-of-historical-case-studies-and-beyond.md",
			"src/content/writing/a-flight-plan-that-fails-boston-review.md",
			"src/content/post/transfonter.md",
		];
		const source = checkedFiles
			.map((relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8"))
			.join("\n");

		expect(source).not.toContain("https://doi.org/https://doi.org/");
		expect(source).not.toContain("(walkerhanlon.com/papers/hanlon_shipbuilding.pdf)");
		expect(source).not.toContain("(eh.net/eha/images/blog/Lane.pdf)");
		expect(source).not.toContain("(www.giorcellimichela.com/");
		expect(source).not.toContain("]((https://www.bostonreview.net/");
		expect(source).not.toContain("](posts/social-image/)");
		expect(source).toContain("(https://walkerhanlon.com/papers/hanlon_shipbuilding.pdf)");
		expect(source).toContain("(https://eh.net/eha/images/blog/Lane.pdf)");
		expect(source).toContain("(https://www.giorcellimichela.com/");
		expect(source).toContain("](/posts/social-image/)");
	});
});
