import { describe, expect, it } from "vitest";
import {
	createMediaSchema,
	createPostSchema,
	createResearchSchema,
	createWritingSchema,
	pagesSchema,
} from "../content.schemas";
import { isPublishedEntry } from "../utils/content";

describe("content schemas", () => {
	it("parses a representative post entry and generates a slug", () => {
		const parsed = createPostSchema().parse({
			title: "Production Ready Metadata",
			description: "A representative post fixture for validating the shared content schema.",
			publishDate: "2026-03-29",
			tags: ["Astro", "astro", "SEO"],
		});

		expect(parsed.slug).toBe("production-ready-metadata");
		expect(parsed.tags).toEqual(["astro", "seo"]);
		expect(parsed.draft).toBe(false);
	});

	it("parses a representative research entry", () => {
		const parsed = createResearchSchema().parse({
			title: "Industrial Policy Measurement",
			description:
				"A representative research fixture that is long enough to satisfy the abstract length requirement for the collection schema.",
			status: "working-paper",
			type: "paper",
			paperDate: "2026",
			authors: "Nathan Lane, Jane Doe",
			tags: ["Policy", "policy", "Trade"],
		});

		expect(parsed.slug).toBe("industrial-policy-measurement");
		expect(parsed.tags).toEqual(["policy", "trade"]);
	});

	it("parses representative writing, media, and page entries", () => {
		const writing = createWritingSchema().parse({
			title: "A Writing Fixture",
			description: "A representative writing fixture that exercises the writing collection schema.",
			publishDate: "2026-01-01",
			draft: true,
		});
		const media = createMediaSchema().parse({
			title: "Podcast Interview",
			outlet: "Example FM",
			date: "2026-03-29",
			type: "podcast",
			link: "https://example.com/interview",
		});
		const page = pagesSchema.parse({
			title: "About",
			description: "Representative page content.",
			showPhoto: true,
		});

		expect(writing.slug).toBe("a-writing-fixture");
		expect(media.date).toBeInstanceOf(Date);
		expect(page.showPhoto).toBe(true);
	});
});

describe("draft filtering", () => {
	it("treats draft entries as unpublished", () => {
		expect(isPublishedEntry({ data: { draft: false } })).toBe(true);
		expect(isPublishedEntry({ data: { draft: true } })).toBe(false);
		expect(isPublishedEntry({ data: {} })).toBe(true);
	});
});
