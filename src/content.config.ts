import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import {
	baseSchema,
	createMediaSchema,
	createPostSchema,
	createResearchSchema,
	createWritingSchema,
	pagesSchema,
} from "./content.schemas";

const post = defineCollection({
	loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) => createPostSchema(image),
});

// Private notes collection - for personal documentation only, never web-accessible
const privateNote = defineCollection({
	loader: glob({
		base: "./src/content/private-note",
		pattern: "**/*.{md,mdx}",
	}),
	schema: baseSchema.extend({
		description: z.string().optional(),
		publishDate: z
			.string()
			.datetime({ offset: true })
			.transform((val) => new Date(val)),
		tags: z
			.array(z.string())
			.default([])
			.transform((arr) => [...new Set(arr.map((s) => s.toLowerCase()))]),
		private: z.boolean().default(true), // Always private - never web accessible
	}),
});

// Series
const series = defineCollection({
	loader: glob({ base: "./src/content/series", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		// No `id` here: every consumer keys off the file-derived entry id
		// (SeriesPanel, the series route, Series layout), so a frontmatter id was
		// a second source of truth that could silently disagree with the filename.
		title: z.string(),
		description: z.string(),
		featured: z.boolean().default(false), // Flag for popular series
	}),
});

// New Portfolio Collections
const research = defineCollection({
	loader: glob({ base: "./src/content/research", pattern: "**/*.{md,mdx}" }),
	schema: createResearchSchema(),
});

const writing = defineCollection({
	loader: glob({ base: "./src/content/writing", pattern: "**/*.{md,mdx}" }),
	schema: createWritingSchema(),
});

const media = defineCollection({
	loader: glob({ base: "./src/content/media", pattern: "**/*.{md,mdx}" }),
	schema: createMediaSchema(),
});

// End

// Pages collection for static page content (about, homepage, etc.)
const pages = defineCollection({
	loader: glob({ base: "./src/content/pages", pattern: "**/*.mdx" }),
	schema: pagesSchema,
});

// Export collections
export const collections = {
	post,
	privateNote,
	series,
	research,
	writing,
	pages,
	media,
};
