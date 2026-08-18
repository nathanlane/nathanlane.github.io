import { z } from "zod";
import {
	mediaTypeOptions,
	researchStatusOptions,
	researchTypeOptions,
	sharedBooleanDefaults,
} from "./content.contract.mjs";

export type ResearchStatus = "work-in-progress" | "working-paper" | "published" | "archived";
export type ResearchType = "paper" | "report" | "chapter";
export type MediaType = "interview" | "podcast" | "video" | "article" | "press" | "talk" | "panel";

const researchStatusValues = researchStatusOptions as [ResearchStatus, ...ResearchStatus[]];
const researchTypeValues = researchTypeOptions as [ResearchType, ...ResearchType[]];
const mediaTypeValues = mediaTypeOptions as [MediaType, ...MediaType[]];

export const seoSchema = z.object({
	description: z
		.string()
		.min(20, "Description should be at least 20 characters")
		.max(300, "Description must be ≤300 characters"),
	ogImage: z.string().optional(),
	draft: z.boolean().default(sharedBooleanDefaults.draft),
});

export const baseSchema = z.object({
	title: z.string().max(60, "Title must be ≤60 characters"),
});

export const researchBaseSchema = z.object({
	title: z.string().max(120, "Title must be ≤120 characters"),
});

const uniqueLowercaseTags = z
	.array(z.string())
	.default([])
	.transform((arr) => [...new Set(arr.map((s) => s.toLowerCase()))]);

/**
 * Post tags are used verbatim as URL segments by /tags/[tag], so they must already be
 * slugs. A tag containing a space produced a URL with a literal space in it, and one
 * containing a slash produced a nested directory that collided with the tag route's own
 * pagination. Enforced rather than silently transformed: rewriting here would leave the
 * frontmatter saying one thing and the site doing another.
 *
 * Research tags are display labels only -- nothing links them -- so they keep
 * uniqueLowercaseTags and stay human readable ("CHIPS Act", "South Korea").
 */
const uniqueSlugTags = uniqueLowercaseTags.superRefine((tags, ctx) => {
	for (const tag of tags) {
		if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Tag "${tag}" must be a slug: lowercase alphanumerics separated by single hyphens.`,
			});
		}
	}
});

const createCoverImageSchema = (image?: () => z.ZodTypeAny) =>
	z
		.object({
			alt: z.string(),
			src: image ? image() : z.string(),
		})
		.optional();

// Returns days in the given 1-indexed month, accounting for leap years.
const daysInMonth = (year: number, month: number) =>
	new Date(Date.UTC(year, month, 0)).getUTCDate();

// Date-only: YYYY-MM-DD with no time component.
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

// Full ISO timestamp with constrained time fields and a required explicit timezone offset.
// Hours 00-23, minutes 00-59, seconds 00-59, optional fractional seconds, then Z or ±HH:MM
// with offset hours 00-23 and offset minutes 00-59.  The tight ranges prevent malformed values
// like T99:99:99Z or T.Z from slipping through to new Date() and producing Invalid Date.
const DATETIME_WITH_OFFSET =
	/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[-+](?:[01]\d|2[0-3]):[0-5]\d)$/;

// Accepts a YYYY-MM-DD string, a full ISO timestamp with an explicit timezone offset (Z or
// ±HH:MM), or a YAML date object.  Rejects non-ISO strings, zone-less timestamps, impossible
// calendar dates (e.g. "2025-02-30"), and malformed time/offset fields.
// Normalises to UTC midnight so the authored calendar day is stable on any build machine.
const isoDate = z
	.string()
	.or(z.date())
	.superRefine((val, ctx) => {
		if (typeof val !== "string") return; // YAML Date objects: pass through
		const dm = DATE_ONLY.exec(val);
		if (dm) {
			const year = Number(dm[1]);
			const month = Number(dm[2]);
			const day = Number(dm[3]);
			if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
				ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Invalid calendar date: "${val}"` });
			}
			return;
		}
		if (DATETIME_WITH_OFFSET.test(val)) {
			const year = Number(val.slice(0, 4));
			const month = Number(val.slice(5, 7));
			const day = Number(val.slice(8, 10));
			if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
				ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Invalid calendar date: "${val}"` });
				return;
			}
			// Belt-and-suspenders: the tight regex should prevent this, but guard against any gap.
			if (Number.isNaN(new Date(val).getTime())) {
				ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Invalid timestamp: "${val}"` });
			}
			return;
		}
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: `Date must be YYYY-MM-DD or a full ISO timestamp with explicit timezone offset: "${val}"`,
		});
	})
	.transform((val) => {
		if (typeof val === "string") {
			if (!val.includes("T")) {
				// Date-only: extract calendar parts from the literal to avoid any timezone influence.
				return new Date(
					Date.UTC(Number(val.slice(0, 4)), Number(val.slice(5, 7)) - 1, Number(val.slice(8, 10))),
				);
			}
			// Offset timestamp: explicit offset makes the UTC date deterministic across machines.
			const d = new Date(val);
			return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
		}
		// YAML Date object: extract UTC components.
		return new Date(Date.UTC(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate()));
	});

export const createPostSchema = (image?: () => z.ZodTypeAny) =>
	baseSchema.merge(seoSchema).extend({
		coverImage: createCoverImageSchema(image),
		tags: uniqueSlugTags,
		publishDate: isoDate,
		updatedDate: isoDate.optional(),
		seriesId: z.string().optional(),
		orderInSeries: z.number().optional(),
	});

export const createResearchSchema = () =>
	researchBaseSchema.merge(seoSchema.pick({ ogImage: true })).extend({
		description: z
			.string()
			.min(50, "Research description should be at least 50 characters")
			.max(400, "Research description should be ≤400 characters for abstracts"),
		status: z.enum(researchStatusValues).transform((value): ResearchStatus => value),
		type: z.enum(researchTypeValues).transform((value): ResearchType => value),
		paperDate: z.string().regex(/^\d{4}$/, "Must be 4-digit year"),
		authors: z.string(),
		publication: z.string().optional(),
		download: z.string().url().optional(),
		link: z.string().url().optional(),
		featured: z.boolean().default(sharedBooleanDefaults.featured),
		tags: uniqueLowercaseTags,
	});

export const createWritingSchema = () =>
	baseSchema.merge(seoSchema).extend({
		publishDate: isoDate,
		type: z.string().default("writing"),
		featured: z.boolean().default(sharedBooleanDefaults.featured),
		genre: z.string().optional(),
		wordCount: z.number().optional(),
	});

export const createMediaSchema = () =>
	z.object({
		title: z.string(),
		outlet: z.string(),
		date: isoDate,
		type: z.enum(mediaTypeValues).transform((value): MediaType => value),
		link: z.string().url(),
		description: z.string().optional(),
	});

export const pagesSchema = z.object({
	title: z.string(),
	description: z.string(),
	headerDescription: z.string().optional(),
	headerAdditionalInfo: z.string().optional(),
	showPhoto: z.boolean().default(sharedBooleanDefaults.showPhoto),
	sections: z
		.array(
			z.object({
				title: z.string(),
				id: z.string().optional(),
			}),
		)
		.optional(),
	secondaryAffiliation: z
		.object({
			title: z.string(),
			role: z.string(),
		})
		.optional(),
	contactLinks: z
		.array(
			z.object({
				label: z.string(),
				href: z.string(),
				text: z.string(),
			}),
		)
		.optional(),
});
