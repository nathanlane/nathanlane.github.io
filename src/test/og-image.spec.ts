import { describe, expect, it } from "vitest";
import { ogMarkup } from "../utils/og";

type Node = { props: { children?: unknown } };

/** Every string leaf of the satori node tree, in document order. */
function textNodes(node: Node): string[] {
	const { children } = node.props;

	if (typeof children === "string") return [children];
	if (Array.isArray(children)) {
		return children.flatMap((child) =>
			typeof child === "string" ? [child] : child ? textNodes(child as Node) : [],
		);
	}
	if (children) return textNodes(children as Node);
	return [];
}

const cardText = (title: string, dateLabel = "Monday, 14 July 2025") =>
	textNodes(ogMarkup(title, dateLabel));

describe("ogMarkup", () => {
	// satori-html escapes interpolated values and never decodes them again, so an
	// ampersand in a title used to reach the rendered card as the text "&amp;".
	it("renders an ampersand in the title as an ampersand", () => {
		expect(cardText("Baseline Grid & Semantic Tokens - Complete")).toContain(
			"Baseline Grid & Semantic Tokens - Complete",
		);
	});

	it("renders angle brackets in the title literally", () => {
		expect(cardText("Reading <h2> tags")).toContain("Reading <h2> tags");
	});

	it("leaves an entity written literally in the title alone", () => {
		expect(cardText("Escaping &amp; in prose")).toContain("Escaping &amp; in prose");
	});

	it("decodes the date label too", () => {
		expect(cardText("Title", "Q1 & Q2 2025")).toContain("Q1 & Q2 2025");
	});
});
