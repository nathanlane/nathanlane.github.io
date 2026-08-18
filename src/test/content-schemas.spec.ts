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

		expect(parsed.tags).toEqual(["astro", "seo"]);
		expect(parsed.draft).toBe(false);
	});

	it("rejects a post tag that is not already a slug", () => {
		// Post tags become URL segments, so a space or slash would produce a broken URL.
		for (const tag of ["best practices", "CI/CD", "trailing-"]) {
			const result = createPostSchema().safeParse({
				title: "Tag Validation",
				description: "A fixture asserting that post tags must be slugs before they become URLs.",
				publishDate: "2026-03-29",
				tags: [tag],
			});

			expect(result.success, `expected "${tag}" to be rejected`).toBe(false);
		}
	});

	it("still allows human-readable research tags", () => {
		// Research tags are display labels and are never used as URLs.
		const parsed = createResearchSchema().parse({
			title: "Semiconductor Policy",
			description:
				"A representative research fixture that is long enough to satisfy the abstract length requirement for the collection schema.",
			status: "working-paper",
			type: "paper",
			paperDate: "2026",
			authors: "Nathan Lane",
			tags: ["CHIPS Act", "South Korea"],
		});

		expect(parsed.tags).toEqual(["chips act", "south korea"]);
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

		expect(media.date).toBeInstanceOf(Date);
		expect(page.showPhoto).toBe(true);
	});
});

describe("date validation", () => {
	it("rejects an out-of-range month", () => {
		// Month 13 is invalid; calendar validation must catch this before any Date construction.
		const result = createPostSchema().safeParse({
			title: "Invalid Date",
			description: "A fixture asserting that a date string with an out-of-range month is rejected.",
			publishDate: "2025-13-01",
		});
		expect(result.success).toBe(false);
	});

	it("rejects an impossible calendar date (day rollover)", () => {
		// "2025-02-30" would silently become 2025-03-02 via new Date() — calendar validation must stop it.
		const result = createPostSchema().safeParse({
			title: "Calendar Rollover",
			description:
				"A fixture asserting that a day beyond the month's length is rejected, not silently rolled over.",
			publishDate: "2025-02-30",
		});
		expect(result.success).toBe(false);
	});

	it("rejects a zone-less timestamp", () => {
		// "2025-07-14T00:30:00" parses in local time, producing different UTC dates on different machines.
		const result = createPostSchema().safeParse({
			title: "Zone-less Timestamp",
			description:
				"A fixture asserting that a timestamp without an explicit timezone offset is rejected.",
			publishDate: "2025-07-14T00:30:00",
		});
		expect(result.success).toBe(false);
	});

	it("rejects a timestamp with out-of-range hours", () => {
		// T99:99:99Z passes a loose shape-only regex but produces Invalid Date — must be caught.
		const result = createPostSchema().safeParse({
			title: "Bad Hours",
			description:
				"A fixture asserting that hour value 99 is rejected rather than producing Invalid Date.",
			publishDate: "2025-01-01T99:99:99Z",
		});
		expect(result.success).toBe(false);
	});

	it("rejects a timestamp with an out-of-range UTC offset", () => {
		// +99:99 is not a valid UTC offset and must not produce Invalid Date silently.
		const result = createPostSchema().safeParse({
			title: "Bad Offset",
			description:
				"A fixture asserting that offset +99:99 is rejected rather than producing Invalid Date.",
			publishDate: "2025-01-01T12:00:00+99:99",
		});
		expect(result.success).toBe(false);
	});

	it("rejects a timestamp with a malformed time field", () => {
		// T.Z matches a loose regex like T[\d:.]+Z but produces Invalid Date — must be caught.
		const result = createPostSchema().safeParse({
			title: "Malformed Time",
			description:
				"A fixture asserting that a timestamp with a malformed time segment is rejected.",
			publishDate: "2025-01-01T.Z",
		});
		expect(result.success).toBe(false);
	});

	it("rejects a non-ISO date string", () => {
		const result = createPostSchema().safeParse({
			title: "Non-ISO Date",
			description:
				"A fixture asserting that a human-readable date string is rejected to prevent timezone shifts.",
			publishDate: "July 14 2025",
		});
		expect(result.success).toBe(false);
	});

	it("accepts updatedDate supplied as a Date object (YAML unquoted date)", () => {
		const parsed = createPostSchema().parse({
			title: "YAML Date Object",
			description:
				"A fixture asserting that an unquoted YAML date, parsed to a Date object, is accepted for updatedDate.",
			publishDate: "2025-07-14",
			updatedDate: new Date("2025-07-14"),
		});
		expect(parsed.updatedDate).toBeInstanceOf(Date);
		expect(parsed.updatedDate?.getUTCFullYear()).toBe(2025);
		expect(parsed.updatedDate?.getUTCMonth()).toBe(6);
		expect(parsed.updatedDate?.getUTCDate()).toBe(14);
	});

	it("normalises an ISO date string to UTC midnight", () => {
		const parsed = createPostSchema().parse({
			title: "UTC Normalisation",
			description:
				"A fixture asserting that an ISO date string resolves to UTC midnight regardless of local timezone.",
			publishDate: "2025-01-01",
		});
		expect(parsed.publishDate.getUTCFullYear()).toBe(2025);
		expect(parsed.publishDate.getUTCMonth()).toBe(0);
		expect(parsed.publishDate.getUTCDate()).toBe(1);
		expect(parsed.publishDate.getUTCHours()).toBe(0);
		expect(parsed.publishDate.getUTCMinutes()).toBe(0);
	});
});

describe("draft filtering", () => {
	it("treats draft entries as unpublished", () => {
		expect(isPublishedEntry({ data: { draft: false } })).toBe(true);
		expect(isPublishedEntry({ data: { draft: true } })).toBe(false);
		expect(isPublishedEntry({ data: {} })).toBe(true);
	});
});
