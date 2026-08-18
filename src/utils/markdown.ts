import { createMarkdownProcessor } from "@astrojs/markdown-remark";

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
): Promise<string> {
	if (filePath?.endsWith(".mdx")) {
		return description;
	}
	// No sanitising layer: this content is the site author's own markdown, so there is no
	// untrusted input to defend against. A regex sanitiser was tried and removed -- it
	// deleted legitimate prose (any text containing ` on<word>="..."`) while leaving
	// javascript: URLs untouched, i.e. it corrupted content without providing the
	// protection it implied.
	return renderMarkdown(body ?? "");
}
