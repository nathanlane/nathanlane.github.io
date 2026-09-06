import { describe, expect, it } from "vitest";
import {
	classifyResult,
	collectBodyUrls,
	collectFrontmatterUrls,
	describeError,
	extractSurnames,
	isHttpUrl,
} from "../../scripts/validation/verify-links.mjs";

describe("isHttpUrl", () => {
	it("accepts absolute http(s) URLs", () => {
		expect(isHttpUrl("https://example.com")).toBe(true);
		expect(isHttpUrl("http://example.com")).toBe(true);
	});

	it("rejects everything else a frontmatter or href value could be", () => {
		expect(isHttpUrl("/local/path")).toBe(false);
		expect(isHttpUrl("mailto:nathan@example.com")).toBe(false);
		expect(isHttpUrl("#anchor")).toBe(false);
		expect(isHttpUrl(42)).toBe(false);
		expect(isHttpUrl(undefined)).toBe(false);
	});
});

describe("collectFrontmatterUrls", () => {
	it("finds a URL nested in an array of objects, tagged by its key path", () => {
		const data = {
			title: "A paper",
			link: "https://example.com/paper",
			contactLinks: [
				{ label: "Email", href: "mailto:nathan@example.com", text: "Email" },
				{ label: "Site", href: "https://nathanlane.info", text: "Site" },
			],
		};

		const found = collectFrontmatterUrls(data);

		expect(found).toContainEqual({
			url: "https://example.com/paper",
			location: "frontmatter:link",
		});
		expect(found).toContainEqual({
			url: "https://nathanlane.info",
			location: "frontmatter:contactLinks.1.href",
		});
		expect(found).not.toContainEqual(
			expect.objectContaining({ url: expect.stringContaining("mailto:") }),
		);
	});

	it("returns nothing for frontmatter with no absolute URLs", () => {
		expect(collectFrontmatterUrls({ title: "Untitled", draft: false })).toEqual([]);
	});
});

describe("collectBodyUrls", () => {
	it("collects link hrefs and image srcs, ignoring relative and non-http URLs", () => {
		const html = `
			<p><a href="https://example.com/a">A</a></p>
			<p><a href="/local/relative">local</a></p>
			<p><a href="mailto:nathan@example.com">email</a></p>
			<img src="https://example.com/pic.png" alt="">
			<img src="/local/pic.png" alt="">
		`;

		const found = collectBodyUrls(html);

		expect(found).toContainEqual({ url: "https://example.com/a", location: "body:a" });
		expect(found).toContainEqual({ url: "https://example.com/pic.png", location: "body:img" });
		expect(found).toHaveLength(2);
	});

	it("picks up a malformed href exactly as authored, trailing parenthesis included", () => {
		// Regression: src/content/post/a-basic-tutorial-for-digitizing-historic-tabular-data.md
		// has a literal `<a href="http://www.imagemagick.org/)">` in its raw HTML — the checker
		// must report the href actually in the document, not a "cleaned up" guess at it.
		const html = `<a href="http://www.imagemagick.org/)">ImageMagick</a>`;
		expect(collectBodyUrls(html)).toEqual([
			{ url: "http://www.imagemagick.org/)", location: "body:a" },
		]);
	});
});

describe("classifyResult", () => {
	it("treats 2xx/3xx as ok", () => {
		expect(classifyResult({ ok: true, status: 200 }).class).toBe("ok");
		expect(classifyResult({ ok: true, status: 301 }).class).toBe("ok");
	});

	it("treats 404 and 410 as dead — the origin server confirming the resource is gone", () => {
		expect(classifyResult({ ok: true, status: 404 }).class).toBe("dead");
		expect(classifyResult({ ok: true, status: 410 }).class).toBe("dead");
	});

	it("treats bot-blocking and rate-limiting as unverifiable, not dead", () => {
		expect(classifyResult({ ok: true, status: 403 }).class).toBe("unverifiable");
		expect(classifyResult({ ok: true, status: 429 }).class).toBe("unverifiable");
		expect(classifyResult({ ok: true, status: 401 }).class).toBe("unverifiable");
	});

	it("treats server errors and unlisted statuses as unverifiable rather than assuming dead", () => {
		expect(classifyResult({ ok: true, status: 500 }).class).toBe("unverifiable");
		expect(classifyResult({ ok: true, status: 400 }).class).toBe("unverifiable");
	});

	it("treats a persistent network failure as unverifiable, not dead", () => {
		const result = classifyResult({ ok: false, error: new Error("ENOTFOUND") });
		expect(result.class).toBe("unverifiable");
		expect(result.detail).toContain("ENOTFOUND");
	});
});

describe("describeError", () => {
	it("reports a timeout by name, since AbortError alone isn't a useful message", () => {
		const error = new Error("The operation was aborted");
		error.name = "AbortError";
		expect(describeError(error)).toBe("timeout");
	});

	it("prefers a system error code over the generic message", () => {
		const error = new Error("fetch failed");
		error.cause = { code: "ENOTFOUND" };
		expect(describeError(error)).toBe("ENOTFOUND");
	});

	it("falls back to the error message when there is no code", () => {
		expect(describeError(new Error("boom"))).toBe("boom");
	});
});

describe("extractSurnames", () => {
	it("splits a comma/and-joined author list into surnames", () => {
		expect(extractSurnames("Nathan Lane, Réka Juhász, and Dani Rodrik")).toEqual([
			"Lane",
			"Juhász",
			"Rodrik",
		]);
	});

	it("handles a single author", () => {
		expect(extractSurnames("Nathan Lane")).toEqual(["Lane"]);
	});

	it("returns an empty list for missing or blank authors", () => {
		expect(extractSurnames(undefined)).toEqual([]);
		expect(extractSurnames("")).toEqual([]);
	});
});
