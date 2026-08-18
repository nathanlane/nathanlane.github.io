import { describe, expect, it } from "vitest";
import { feedContent, renderMarkdown } from "../utils/markdown";
import { escapeXml } from "../utils/xml";

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
		const result = await feedContent(raw, "/content/post/foo.mdx", "The description.");
		// Falls back to description — no import statements, no markdown syntax, no JSX
		expect(result).toBe("The description.");
		expect(result).not.toContain("import ");
		expect(result).not.toContain("## ");
	});

	it("treats missing filePath as markdown (renders body)", async () => {
		const html = await feedContent("## Heading", undefined, "fallback");
		expect(html).not.toContain("## ");
		expect(html).toMatch(/<h2/);
	});

	it("renders an absent body as empty content rather than falling back", async () => {
		// Only an .mdx path triggers the description fallback; an empty markdown body
		// must not silently substitute the description.
		const result = await feedContent(undefined, undefined, "fallback description");
		expect(result).not.toContain("fallback description");
		expect(result.trim()).toBe("");
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
