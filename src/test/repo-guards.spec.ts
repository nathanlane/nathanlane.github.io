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
