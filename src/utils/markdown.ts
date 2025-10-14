import { marked } from "marked";

export async function renderMarkdown(markdown: string) {
	return marked.parse(markdown);
}

export function renderMarkdownInline(markdown: string) {
	return marked.parseInline(markdown);
}
