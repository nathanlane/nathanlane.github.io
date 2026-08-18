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
