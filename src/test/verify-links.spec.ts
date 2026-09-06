import { describe, expect, it } from "vitest";
import {
	classifyHref,
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
	it("collects checkable links/images and drops relative or non-web-scheme references", () => {
		const html = `
			<p><a href="https://example.com/a">A</a></p>
			<p><a href="/local/relative">local</a></p>
			<p><a href="mailto:nathan@example.com">email</a></p>
			<img src="https://example.com/pic.png" alt="">
			<img src="/local/pic.png" alt="">
		`;

		const found = collectBodyUrls(html);

		expect(found).toContainEqual({
			url: "https://example.com/a",
			location: "body:a",
			kind: "http",
		});
		expect(found).toContainEqual({
			url: "https://example.com/pic.png",
			location: "body:img",
			kind: "http",
		});
		expect(found).toHaveLength(2);
	});

	it("picks up a malformed href exactly as authored, trailing parenthesis included", () => {
		// Regression: src/content/post/a-basic-tutorial-for-digitizing-historic-tabular-data.md
		// has a literal `<a href="http://www.imagemagick.org/)">` in its raw HTML — the checker
		// must report the href actually in the document, not a "cleaned up" guess at it. `)` is
		// a legal path character, so this is still a checkable http(s) URL, not "malformed".
		const html = `<a href="http://www.imagemagick.org/)">ImageMagick</a>`;
		expect(collectBodyUrls(html)).toEqual([
			{ url: "http://www.imagemagick.org/)", location: "body:a", kind: "http" },
		]);
	});

	it("reports a schemeless domain-shaped href as malformed instead of silently dropping it", () => {
		// Regression: src/content/post/a-basic-tutorial-for-digitizing-historic-tabular-data.md
		// has `<a href="tabula.nerdpower.org">` — no scheme, so a browser resolves it as a
		// same-site relative path and it 404s here, not on nerdpower.org. Previously this
		// failed `isHttpUrl` and was dropped without a trace.
		const html = `<a href="tabula.nerdpower.org">Tabula</a>`;
		const found = collectBodyUrls(html);
		expect(found).toHaveLength(1);
		expect(found[0]).toMatchObject({ url: "tabula.nerdpower.org", kind: "malformed" });
	});
});

describe("classifyHref", () => {
	it("accepts a normal http(s) URL", () => {
		expect(classifyHref("https://example.com/paper")).toEqual({
			kind: "http",
			value: "https://example.com/paper",
		});
	});

	it("ignores site-relative references and non-web schemes", () => {
		expect(classifyHref("/posts/foo/").kind).toBe("ignore");
		expect(classifyHref("#section").kind).toBe("ignore");
		expect(classifyHref("?query=1").kind).toBe("ignore");
		expect(classifyHref("./relative").kind).toBe("ignore");
		expect(classifyHref("mailto:nathan@example.com").kind).toBe("ignore");
		expect(classifyHref("tel:+1234567890").kind).toBe("ignore");
	});

	it("ignores a bare relative filename that merely contains a dot", () => {
		// "app.js" must not be mistaken for a domain named "app" with TLD "js".
		expect(classifyHref("app.js").kind).toBe("ignore");
		expect(classifyHref("images/photo.jpg").kind).toBe("ignore");
	});

	it("flags a schemeless domain-shaped href as malformed", () => {
		expect(classifyHref("tabula.nerdpower.org").kind).toBe("malformed");
		expect(classifyHref("www.gimp.org/").kind).toBe("malformed");
		expect(classifyHref("chieu-hoi.com/").kind).toBe("malformed");
	});

	it("flags a bare email address missing its mailto: scheme as malformed", () => {
		// Regression: src/content/post/historic-aggregate-data-for-korea-1910-1945-and.md
		// has `<a href="nlane@fas.harvard.edu">`.
		const result = classifyHref("nlane@fas.harvard.edu");
		expect(result.kind).toBe("malformed");
		expect(result.reason).toContain("mailto:");
	});

	it("flags a doubled scheme as malformed even though it parses as a URL", () => {
		// Regression: src/content/post/a-basic-tutorial-for-digitizing-historic-tabular-data.md
		// has `<a href="http://http//openrefine.org/">` — `new URL()` happily parses this with
		// hostname "http", which is never what a real link is pointing at.
		const result = classifyHref("http://http//openrefine.org/");
		expect(result.kind).toBe("malformed");
		expect(result.reason).toContain("http");
	});

	it("flags an href containing whitespace as malformed", () => {
		expect(classifyHref("I highly recommend checking out the github for the project").kind).toBe(
			"malformed",
		);
	});

	it("treats localhost and IPv4 hosts as plausible, not malformed", () => {
		expect(classifyHref("http://localhost:3000").kind).toBe("http");
		expect(classifyHref("http://127.0.0.1:8080/").kind).toBe("http");
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
