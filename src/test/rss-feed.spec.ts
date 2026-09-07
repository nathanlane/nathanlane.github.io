import { describe, expect, it } from "vitest";
import { feedContent, renderMarkdown } from "../utils/markdown";
import { escapeXml } from "../utils/xml";

const ITEM_URL = "https://nathanlane.info/posts/foo/";

// ---------------------------------------------------------------------------
// renderMarkdown — markdown syntax disappears, HTML tags appear
// ---------------------------------------------------------------------------

describe("renderMarkdown", () => {
	it("converts headings to HTML, not raw markdown", async () => {
		const html = await renderMarkdown("## Heading\n\nParagraph.");
		expect(html).not.toContain("## ");
		expect(html).toMatch(/<h2/);
	});

	it("converts bold to HTML, not raw markdown", async () => {
		const html = await renderMarkdown("**bold text**");
		expect(html).not.toContain("**");
		expect(html).toMatch(/<strong/);
	});

	it("converts fenced code blocks to HTML, not backtick syntax", async () => {
		const html = await renderMarkdown("```js\nconst x = 1;\n```");
		expect(html).not.toContain("```");
		expect(html).toMatch(/<code/);
	});
});

// ---------------------------------------------------------------------------
// feedContent — the function used in both RSS pages
// ---------------------------------------------------------------------------

describe("feedContent", () => {
	it("renders markdown body to HTML for .md entries", async () => {
		const html = await feedContent(
			"## Section\n\n**Bold** and `code`.",
			"/content/post/foo.md",
			"fallback",
			ITEM_URL,
		);
		// No raw markdown syntax in output
		expect(html).not.toContain("## ");
		expect(html).not.toContain("**");
		expect(html).not.toContain("```");
		// Real HTML tags present
		expect(html).toMatch(/<h2/);
		expect(html).toMatch(/<strong/);
	});

	it("returns description for .mdx entries instead of raw source", async () => {
		const raw = "import Comp from './Comp.astro'\n\n<Comp />\n\n## Section";
		const result = await feedContent(raw, "/content/post/foo.mdx", "The description.", ITEM_URL);
		// Falls back to description — no import statements, no markdown syntax, no JSX
		expect(result).toBe("The description.");
		expect(result).not.toContain("import ");
		expect(result).not.toContain("## ");
	});

	it("treats missing filePath as markdown (renders body)", async () => {
		const html = await feedContent("## Heading", undefined, "fallback", ITEM_URL);
		expect(html).not.toContain("## ");
		expect(html).toMatch(/<h2/);
	});

	it("renders an absent body as empty content rather than falling back", async () => {
		// Only an .mdx path triggers the description fallback; an empty markdown body
		// must not silently substitute the description.
		const result = await feedContent(undefined, undefined, "fallback description", ITEM_URL);
		expect(result).not.toContain("fallback description");
		expect(result.trim()).toBe("");
	});

	it("HTML-escapes an MDX description so markup and special characters render as text", async () => {
		// content:encoded holds HTML, not plain XML text: an unescaped "<Component />" in
		// the description would be interpreted as a real (if unknown) HTML tag by a feed
		// reader, silently swallowing it, rather than displaying as the literal text it is.
		const description = 'Covers `arr.map()` & <Component prop="x" /> usage, ## not a heading.';
		const result = await feedContent(undefined, "/content/post/foo.mdx", description, ITEM_URL);
		expect(result).toBe(escapeXml(description));
		expect(result).not.toContain("<Component");
	});
});

// ---------------------------------------------------------------------------
// feedContent — link normalization at the feed-rendering seam (R08)
// ---------------------------------------------------------------------------

describe("feedContent: link normalization", () => {
	it("leaves an absolute link untouched", async () => {
		const html = await feedContent(
			"[external](https://example.com/page)",
			"/content/post/foo.md",
			"",
			ITEM_URL,
		);
		expect(html).toContain('href="https://example.com/page"');
	});

	it("preserves a non-web link scheme (mailto:) untouched", async () => {
		const html = await feedContent(
			"[email](mailto:person@example.com)",
			"/content/post/foo.md",
			"",
			ITEM_URL,
		);
		expect(html).toContain('href="mailto:person@example.com"');
	});

	it("resolves a root-relative link against the canonical site", async () => {
		const html = await feedContent(
			"[other post](/posts/other/)",
			"/content/post/foo.md",
			"",
			ITEM_URL,
		);
		expect(html).toContain('href="https://nathanlane.info/posts/other/"');
	});

	it("resolves a document-relative link against the item's own URL", async () => {
		// ITEM_URL ends in "/posts/foo/", so a same-directory relative link resolves
		// beneath it per standard URL rules, not against the site root.
		const html = await feedContent("[sibling](sibling/)", "/content/post/foo.md", "", ITEM_URL);
		expect(html).toContain('href="https://nathanlane.info/posts/foo/sibling/"');
	});

	it("resolves a fragment-only link against the item's own URL", async () => {
		const html = await feedContent("[jump](#quick-start)", "/content/post/foo.md", "", ITEM_URL);
		expect(html).toContain('href="https://nathanlane.info/posts/foo/#quick-start"');
	});

	it("leaves unrelated surrounding text untouched while rewriting a link", async () => {
		const html = await feedContent(
			"Read the [notes](notes/) before continuing.",
			"/content/post/foo.md",
			"",
			ITEM_URL,
		);
		expect(html).toContain("Read the");
		expect(html).toContain("before continuing.");
	});

	it("resolves a root-relative href from raw HTML with a single-quoted attribute", async () => {
		// Author-controlled raw HTML need not match the double-quoted style markdown
		// syntax renders as; the HAST-based walk reads the parsed property either way.
		const html = await feedContent(
			"<a href='/posts/other/'>other post</a>",
			"/content/post/foo.md",
			"",
			ITEM_URL,
		);
		expect(html).toContain('href="https://nathanlane.info/posts/other/"');
	});

	it("resolves a document-relative href from raw HTML with an unquoted attribute", async () => {
		const html = await feedContent(
			"<a href=sibling/>sibling</a>",
			"/content/post/foo.md",
			"",
			ITEM_URL,
		);
		expect(html).toContain('href="https://nathanlane.info/posts/foo/sibling/"');
	});
});

// ---------------------------------------------------------------------------
// feedContent — image normalization at the feed-rendering seam (R08)
// ---------------------------------------------------------------------------

describe("feedContent: image normalization", () => {
	const MARKDOWN_ELEMENTS_PATH = "src/content/post/markdown-elements/index.md";

	it("resolves a root-relative image against the canonical site", async () => {
		const html = await feedContent(
			"![alt text](/images/blog/assets/motorcycle1970s.jpg)",
			"/content/post/foo.md",
			"",
			ITEM_URL,
		);
		expect(html).toContain('src="https://nathanlane.info/images/blog/assets/motorcycle1970s.jpg"');
	});

	it("resolves a source-relative image to its actual published asset URL", async () => {
		// logo.png lives next to this fixture's index.md; the published URL below comes
		// from the real static-asset pipeline (see the `contentImages` glob), not a guess.
		const html = await feedContent(
			"![Astro logo](./logo.png)",
			MARKDOWN_ELEMENTS_PATH,
			"",
			ITEM_URL,
		);
		expect(html).toMatch(/<img[^>]+src="https:\/\/nathanlane\.info\/[^"]*logo[^"]*\.png"/);
	});

	it("omits an image that cannot be resolved, keeping surrounding text", async () => {
		const html = await feedContent(
			"Before text. ![missing](./does-not-exist.png) After text.",
			MARKDOWN_ELEMENTS_PATH,
			"",
			ITEM_URL,
		);
		expect(html).not.toContain("<img");
		expect(html).not.toContain("does-not-exist.png");
		expect(html).toContain("Before text.");
		expect(html).toContain("After text.");
	});

	it("leaves an absolute image URL untouched", async () => {
		const html = await feedContent(
			"![alt](https://cdn.example.com/pic.png)",
			"/content/post/foo.md",
			"",
			ITEM_URL,
		);
		expect(html).toContain('src="https://cdn.example.com/pic.png"');
	});

	it("resolves a root-relative src from raw HTML with a single-quoted attribute", async () => {
		const html = await feedContent(
			"<img src='/images/blog/assets/motorcycle1970s.jpg' alt='old bike'>",
			"/content/post/foo.md",
			"",
			ITEM_URL,
		);
		expect(html).toContain('src="https://nathanlane.info/images/blog/assets/motorcycle1970s.jpg"');
	});

	it("preserves a literal href/src example shown inside a code block as text, not a link", async () => {
		// This site documents its own markdown pipeline and shows raw HTML as an escaped
		// code example; that literal text must not be mistaken for a real reference.
		const html = await feedContent(
			"```html\n<a href='/wiki/Example'>Example</a>\n```",
			"/content/post/foo.md",
			"",
			ITEM_URL,
		);
		expect(html).not.toContain('href="https://nathanlane.info/wiki/Example"');
		expect(html).toContain("/wiki/Example");
	});
});

// ---------------------------------------------------------------------------
// escapeXml — channel metadata is safe for raw XML interpolation
// ---------------------------------------------------------------------------

describe("escapeXml", () => {
	it("escapes ampersand in email addresses", () => {
		expect(escapeXml("Lane & Co")).toBe("Lane &amp; Co");
	});

	it("escapes all XML special characters", () => {
		expect(escapeXml("<>&\"'")).toBe("&lt;&gt;&amp;&quot;&apos;");
	});
});
