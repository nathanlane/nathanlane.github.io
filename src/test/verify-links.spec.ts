import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	checkUrl,
	classifyHref,
	classifyResult,
	collectBodyUrls,
	collectFrontmatterUrls,
	describeError,
	extractAll,
	extractSurnames,
	isHttpUrl,
} from "../../scripts/validation/verify-links.mjs";

/** A minimal fetch Response stand-in: attemptFetch only reads .status and cancels .body. */
function fakeResponse(status: number) {
	return { status, body: { cancel: async () => {} } };
}

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
			kind: "http",
			reason: undefined,
		});
		expect(found).toContainEqual({
			url: "https://nathanlane.info",
			location: "frontmatter:contactLinks.1.href",
			kind: "http",
			reason: undefined,
		});
		expect(found).not.toContainEqual(
			expect.objectContaining({ url: expect.stringContaining("mailto:") }),
		);
	});

	it("returns nothing for frontmatter with no absolute URLs", () => {
		expect(collectFrontmatterUrls({ title: "Untitled", draft: false })).toEqual([]);
	});

	it("flags a schemeless single-token field as malformed, not just silently dropped", () => {
		// The exact silent-drop failure this tool exists to fix: a `link: www.foo.com`
		// with no scheme previously failed isHttpUrl and vanished without a trace.
		const found = collectFrontmatterUrls({ link: "www.foo.com" });
		expect(found).toEqual([
			expect.objectContaining({
				url: "www.foo.com",
				location: "frontmatter:link",
				kind: "malformed",
			}),
		]);
	});

	it("does not flag a display-label field that mirrors its sibling href as a bare domain", () => {
		// Regression: src/content/pages/homepage.mdx has contactLinks entries like
		// { href: "https://industrialpolicygroup.com", text: "industrialpolicygroup.com" } —
		// `text` is a display label, not a link, even though it's schemeless and
		// domain-shaped. Only `link`/`download`/`href` get the malformed check.
		const found = collectFrontmatterUrls({
			contactLinks: [
				{
					label: "Site",
					href: "https://industrialpolicygroup.com",
					text: "industrialpolicygroup.com",
				},
			],
		});
		expect(found).toEqual([
			{
				url: "https://industrialpolicygroup.com",
				location: "frontmatter:contactLinks.0.href",
				kind: "http",
			},
		]);
	});

	it("does not flag ordinary multi-word prose fields, even ones that mention a domain", () => {
		// Applying the malformed check to every string field would flag nearly every
		// title/description in the collection; only whitespace-free (URL-shaped) values
		// are considered.
		const found = collectFrontmatterUrls({
			title: "A Paper",
			description: "See sodalabs.io for more on this project, a lab I co-founded in 2016.",
			authors: "Nathan Lane, Réka Juhász, and Dani Rodrik",
		});
		expect(found).toEqual([]);
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

	it("ignores a root-relative path containing a space, rather than flagging it malformed", () => {
		// Ordering regression: the whitespace check must not fire before the leading-marker
		// relative-path check. "/files/my paper.pdf" is a legal href.
		expect(classifyHref("/files/my paper.pdf").kind).toBe("ignore");
		expect(classifyHref("#a section").kind).toBe("ignore");
	});

	it("ignores bare relative document/data/code filenames, not just web assets", () => {
		// This is a personal/academic blog: a bare relative reference is at least as likely
		// to be a manuscript or data file as a web asset.
		expect(classifyHref("paper.tex").kind).toBe("ignore");
		expect(classifyHref("notes.md").kind).toBe("ignore");
		expect(classifyHref("data.dta").kind).toBe("ignore");
		expect(classifyHref("deck.pptx").kind).toBe("ignore");
	});
});

describe("checkUrl", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	function stubFetch(respond: (method: string) => number) {
		const methodsCalled: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (_url: string, init: { method: string }) => {
				methodsCalled.push(init.method);
				return fakeResponse(respond(init.method));
			}),
		);
		return methodsCalled;
	}

	it("confirms a HEAD 404 with a GET, and trusts the GET's answer when it differs", async () => {
		// The Medium finding: a server that mishandles HEAD (404ing it while GET serves the
		// real page) must not be reported dead on the strength of HEAD alone.
		const methodsCalled = stubFetch((method) => (method === "HEAD" ? 404 : 200));

		const result = await checkUrl("https://example.com/paper");

		expect(methodsCalled).toEqual(["HEAD", "GET"]);
		expect(result.class).toBe("ok");
	});

	it("classifies as dead only once GET also confirms 404", async () => {
		const methodsCalled = stubFetch(() => 404);

		const result = await checkUrl("https://example.com/gone");

		expect(methodsCalled).toEqual(["HEAD", "GET"]);
		expect(result.class).toBe("dead");
	});

	it("also GET-confirms a HEAD 410, not just 404", async () => {
		const methodsCalled = stubFetch((method) => (method === "HEAD" ? 410 : 200));

		const result = await checkUrl("https://example.com/moved");

		expect(methodsCalled).toEqual(["HEAD", "GET"]);
		expect(result.class).toBe("ok");
	});

	it("falls back to GET when the server doesn't support HEAD (405)", async () => {
		const methodsCalled = stubFetch((method) => (method === "HEAD" ? 405 : 200));

		const result = await checkUrl("https://example.com/head-not-allowed");

		expect(methodsCalled).toEqual(["HEAD", "GET"]);
		expect(result.class).toBe("ok");
	});

	it("does not issue a second request when HEAD succeeds normally", async () => {
		const methodsCalled = stubFetch(() => 200);

		const result = await checkUrl("https://example.com/fine");

		expect(methodsCalled).toEqual(["HEAD"]);
		expect(result.class).toBe("ok");
	});

	it("does not retry or escalate a HEAD 403 — bot-blocking is not a dead-link signal", async () => {
		const methodsCalled = stubFetch(() => 403);

		const result = await checkUrl("https://example.com/blocked");

		expect(methodsCalled).toEqual(["HEAD"]);
		expect(result.class).toBe("unverifiable");
	});
});

describe("extractAll", () => {
	let fixtureRoot: string;

	afterEach(() => {
		if (fixtureRoot) rmSync(fixtureRoot, { recursive: true, force: true });
	});

	it("keeps a schemeless frontmatter URL classified malformed end-to-end, not silently retagged http", async () => {
		// Regression: collectFrontmatterUrls correctly returns kind "malformed" for this,
		// but extractAll used to hardcode `kind: "http"` on every frontmatter occurrence,
		// discarding that classification. The bug lived in extractAll wiring the collector
		// up, not in the collector itself -- a unit test on the collector alone can't catch
		// it, hence exercising the real end-to-end path here.
		fixtureRoot = mkdtempSync(join(tmpdir(), "verify-links-fixture-"));
		mkdirSync(join(fixtureRoot, "research"), { recursive: true });
		writeFileSync(
			join(fixtureRoot, "research", "test-paper.md"),
			["---", "title: Test Paper", "link: www.foo.com", "---", "", "Body text.", ""].join("\n"),
		);

		const { occurrences } = await extractAll(fixtureRoot);
		const entry = occurrences.find((o: { url: string }) => o.url === "www.foo.com");

		expect(entry).toMatchObject({ kind: "malformed", location: "frontmatter:link" });
	});

	it("keeps a well-formed frontmatter URL classified http end-to-end", async () => {
		fixtureRoot = mkdtempSync(join(tmpdir(), "verify-links-fixture-"));
		mkdirSync(join(fixtureRoot, "research"), { recursive: true });
		writeFileSync(
			join(fixtureRoot, "research", "test-paper.md"),
			[
				"---",
				"title: Test Paper",
				"link: https://example.com/paper",
				"---",
				"",
				"Body text.",
				"",
			].join("\n"),
		);

		const { occurrences } = await extractAll(fixtureRoot);
		const entry = occurrences.find((o: { url: string }) => o.url === "https://example.com/paper");

		expect(entry).toMatchObject({ kind: "http", location: "frontmatter:link" });
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
