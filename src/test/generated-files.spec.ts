import fs from "node:fs";
import path from "node:path";
import { load } from "js-yaml";
import { describe, expect, it } from "vitest";
import { buildCmsConfigYaml } from "../../scripts/maintenance/generate-cms-config.mjs";

const repoRoot = process.cwd();

describe("generated files", () => {
	it("keeps the CMS config in sync with the shared content contract", async () => {
		const actual = fs.readFileSync(path.join(repoRoot, "public/admin/config.yml"), "utf8");

		await expect(buildCmsConfigYaml()).resolves.toBe(actual);
	});

	it("exposes both markdown and mdx blog post collections in the generated CMS config", async () => {
		const parsed = load(await buildCmsConfigYaml()) as {
			collections: Array<{ create?: boolean; extension?: string; name: string }>;
		};
		const postCollections = parsed.collections.filter(({ name }) => name.startsWith("posts"));

		expect(postCollections).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ create: true, extension: "md", name: "posts" }),
				expect.objectContaining({ create: false, extension: "mdx", name: "posts_mdx" }),
			]),
		);
	});
});
