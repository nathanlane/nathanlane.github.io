import { visit } from "unist-util-visit";

/**
 * Sets `hasMath` on the page frontmatter when the document contains LaTeX math.
 * Consumed by layouts (via `remarkPluginFrontmatter`) to load the self-hosted
 * KaTeX stylesheet only on pages that render math.
 *
 * NOTE: only BlogPost.astro (post) and ContentPage.astro (research/writing/
 * projects) thread this flag to the head. Math added to the `pages` (about,
 * homepage) or `series` collections would render UNSTYLED — thread
 * `remarkPluginFrontmatter.hasMath` into those render paths if that changes.
 *
 * Must run AFTER remark-math, which produces the `math` / `inlineMath` nodes.
 */
export function remarkMathDetect() {
	// @ts-expect-error:next-line
	return (tree, { data }) => {
		let hasMath = false;
		visit(tree, (node) => {
			if (node.type === "math" || node.type === "inlineMath") {
				hasMath = true;
			}
		});
		if (hasMath) {
			data.astro.frontmatter.hasMath = true;
		}
	};
}
