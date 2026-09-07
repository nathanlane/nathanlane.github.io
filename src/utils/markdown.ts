import path from "node:path";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import type { Element } from "hast";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { visit } from "unist-util-visit";
import { siteConfig } from "@/site.config";
import { toAbsoluteUrl } from "@/utils/url";
import { escapeXml } from "@/utils/xml";

let processorPromise: ReturnType<typeof createMarkdownProcessor> | undefined;

async function getProcessor() {
	if (!processorPromise) {
		processorPromise = createMarkdownProcessor();
	}

	return processorPromise;
}

export async function renderMarkdown(markdown: string) {
	const processor = await getProcessor();
	const { code } = await processor.render(markdown);
	return code;
}

// Vite resolves this at build (and test) time to the real URL each asset is published
// under -- the same static-asset pipeline that serves every other image in the site, so a
// resolved reference here is guaranteed to point at a file that exists in the output.
// Keyed by project-root-relative path (e.g. "/src/content/post/foo/logo.png"), matching
// the `filePath` Astro reports on collection entries.
const contentImages = import.meta.glob(
	"/src/content/{post,research,writing}/**/*.{png,jpg,jpeg,gif,svg,webp,avif}",
	{
		eager: true,
		query: "?url",
		import: "default",
	},
) as Record<string, string>;

const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i;

/** True for absolute URLs and non-web schemes (mailto:, tel:, ...) that must pass through untouched. */
function isAbsoluteReference(value: string): boolean {
	return value.startsWith("//") || SCHEME_PATTERN.test(value);
}

function resolveLink(href: string, itemUrl: string): string {
	if (isAbsoluteReference(href)) {
		return href;
	}
	if (href.startsWith("/")) {
		return toAbsoluteUrl(href, siteConfig.canonicalUrl) ?? href;
	}
	// Document-relative and fragment-only references resolve against the item itself.
	return toAbsoluteUrl(href, itemUrl) ?? href;
}

/** Resolves a markdown-source-relative image path to its published asset URL, or undefined if it cannot be found. */
function resolveSourceRelativeImage(src: string, filePath: string | undefined): string | undefined {
	if (!filePath) {
		return undefined;
	}
	const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(filePath), src));
	const url = contentImages[resolved.startsWith("/") ? resolved : `/${resolved}`];
	if (!url) {
		return undefined;
	}
	return isAbsoluteReference(url) ? url : (toAbsoluteUrl(url, siteConfig.canonicalUrl) ?? url);
}

function resolveImage(src: string, filePath: string | undefined): string | undefined {
	if (isAbsoluteReference(src)) {
		return src;
	}
	if (src.startsWith("/")) {
		return toAbsoluteUrl(src, siteConfig.canonicalUrl) ?? src;
	}
	return resolveSourceRelativeImage(src, filePath);
}

/**
 * Rewrites the standalone HTML produced by `renderMarkdown` so its links and images carry
 * enough context to work outside the site: root-relative links resolve against the
 * canonical site, document-relative/fragment links resolve against the item's own URL, and
 * source-relative images resolve to their published asset URL. Unresolvable images are
 * dropped rather than left pointing at a path that only ever existed next to the source
 * file; surrounding text is untouched.
 *
 * Parses the HTML into a HAST tree and walks it with `unist-util-visit` -- the same tree
 * shape and traversal tool the markdown pipeline itself is built from -- rather than
 * matching attributes as text. `href`/`src` come back as already-parsed property values
 * regardless of how they were quoted (or left unquoted) in raw HTML the author embedded
 * directly, and re-serializing through `hast-util-to-html` re-escapes ordinary text
 * exactly as the original renderer did, so a literal `<a href=...>` shown inside a `<code>`
 * example stays literal text, not a rewritten link.
 */
function normalizeFeedHtml(html: string, itemUrl: string, filePath: string | undefined): string {
	const tree = fromHtml(html, { fragment: true });

	visit(tree, "element", (node: Element, index, parent) => {
		if (node.tagName === "a" && typeof node.properties.href === "string") {
			node.properties.href = resolveLink(node.properties.href, itemUrl);
			return;
		}
		if (node.tagName === "img" && typeof node.properties.src === "string") {
			const resolved = resolveImage(node.properties.src, filePath);
			if (resolved) {
				node.properties.src = resolved;
				return;
			}
			if (parent && typeof index === "number") {
				parent.children.splice(index, 1);
				return index;
			}
		}
		return;
	});

	return toHtml(tree);
}

/**
 * Produce the `content:encoded` value for an RSS item.
 *
 * MDX entries cannot be rendered without their component imports, so they fall
 * back to the entry description rather than emitting raw source (import
 * statements, JSX).  This is an intentional choice, not an oversight.
 */
export async function feedContent(
	body: string | undefined,
	filePath: string | undefined,
	description: string,
	itemUrl: string,
): Promise<string> {
	if (filePath?.endsWith(".mdx")) {
		// The description is placed straight into HTML content (`content:encoded`), not
		// plain XML text, so any markup- or entity-looking characters in it must be
		// HTML-escaped here -- otherwise a feed reader treats them as real HTML/JSX rather
		// than the literal text they are.
		return escapeXml(description);
	}
	// No sanitising layer: this content is the site author's own markdown, so there is no
	// untrusted input to defend against. A regex sanitiser was tried and removed -- it
	// deleted legitimate prose (any text containing ` on<word>="..."`) while leaving
	// javascript: URLs untouched, i.e. it corrupted content without providing the
	// protection it implied.
	const html = await renderMarkdown(body ?? "");
	return normalizeFeedHtml(html, itemUrl, filePath);
}
