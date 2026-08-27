import { describe, expect, it } from "vitest";
import { findBuildIdentityProblem } from "../../scripts/validation/smoke-test.mjs";

describe("smoke test", () => {
	it("accepts a server that references the current build stylesheet", () => {
		const builtHtml = '<link rel="stylesheet" href="/_astro/site-new.css">';
		const servedHtml = '<link rel="stylesheet" href="/_astro/site-new.css">';

		expect(findBuildIdentityProblem(builtHtml, servedHtml)).toBeNull();
	});

	it("rejects a server that references a different build stylesheet", () => {
		const builtHtml = '<link rel="stylesheet" href="/_astro/site-new.css">';
		const servedHtml = '<link rel="stylesheet" href="/_astro/site-old.css">';

		expect(findBuildIdentityProblem(builtHtml, servedHtml)).toBe(
			'served homepage is missing current build stylesheet "/_astro/site-new.css"',
		);
	});

	it("rejects a current build with no stylesheet identity", () => {
		const builtHtml = "<main>Nathan Lane</main>";
		const servedHtml = "<main>Nathan Lane</main>";

		expect(findBuildIdentityProblem(builtHtml, servedHtml)).toBe(
			"current dist/index.html has no stylesheet reference",
		);
	});
});
