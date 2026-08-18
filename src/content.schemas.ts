import { slug as githubSlug } from "github-slugger";
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
	canonical: z.string().url().optional(),
	draft: z.boolean().default(sharedBooleanDefaults.draft),
	lang: z.string().default("en-GB"),
});

export const baseSchema = z.object({
	title: z.string().max(60, "Title must be ≤60 characters"),
});

export const researchBaseSchema = z.object({
	title: z.string().max(120, "Title must be ≤120 characters"),
});

export const slugSchema = z.object({
	slug: z.string().optional(),
});

const uniqueLowercaseTags = z
	.array(z.string())
	.default([])
	.transform((arr) => [...new Set(arr.map((s) => s.toLowerCase()))]);

const createCoverImageSchema = (image?: () => z.ZodTypeAny) =>
	z
		.object({
			alt: z.string(),
			src: image ? image() : z.string(),
		})
		.optional();

export const createPostSchema = (image?: () => z.ZodTypeAny) =>
	baseSchema
		.merge(seoSchema)
		.merge(slugSchema)
		.extend({
			coverImage: createCoverImageSchema(image),
			tags: uniqueLowercaseTags,
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			updatedDate: z
				.string()
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
			seriesId: z.string().optional(),
			orderInSeries: z.number().optional(),
		})
		.transform((data) => ({
			...data,
			slug: data.slug || githubSlug(data.title),
		}));

export const createResearchSchema = () =>
	researchBaseSchema
		.merge(slugSchema)
		.merge(seoSchema.pick({ ogImage: true, canonical: true, lang: true }))
		.extend({
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
		})
		.transform((data) => ({
			...data,
			slug: data.slug || githubSlug(data.title),
		}));

export const createWritingSchema = () =>
	baseSchema
		.merge(seoSchema)
		.merge(slugSchema)
		.extend({
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			type: z.string().default("writing"),
			featured: z.boolean().default(sharedBooleanDefaults.featured),
			genre: z.string().optional(),
			wordCount: z.number().optional(),
		})
		.transform((data) => ({
			...data,
			slug: data.slug || githubSlug(data.title),
		}));

export const createMediaSchema = () =>
	z.object({
		title: z.string(),
		outlet: z.string(),
		date: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
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
