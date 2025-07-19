import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { slug as githubSlug } from "github-slugger";

function removeDupsAndLowerCase(array: string[]) {
  return [...new Set(array.map((str) => str.toLowerCase()))];
}

// SEO schema for all public-facing content
const seoSchema = z.object({
  description: z
    .string()
    .min(20, "Description should be at least 20 characters")
    .max(300, "Description must be ≤300 characters"), // Will optimize later
  ogImage: z.string().optional(),
  canonical: z.string().url().optional(),
  draft: z.boolean().default(false),
  lang: z.string().default("en-GB"),
});

// Base schema with title
const baseSchema = z.object({
  title: z.string().max(60, "Title must be ≤60 characters"),
});

// Extended base schema for research with longer titles
const researchBaseSchema = z.object({
  title: z.string().max(120, "Title must be ≤120 characters"),
});

// Slug schema to be merged with others
const slugSchema = z.object({
  slug: z.string().optional(),
});

const post = defineCollection({
  loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    baseSchema
      .merge(seoSchema)
      .merge(slugSchema)
      .extend({
        coverImage: z
          .object({
            alt: z.string(),
            src: image(),
          })
          .optional(),
        tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
        publishDate: z
          .string()
          .or(z.date())
          .transform((val) => new Date(val)),
        updatedDate: z
          .string()
          .optional()
          .transform((str) => (str ? new Date(str) : undefined)),
        // Series
        seriesId: z.string().optional(), // Field for series connection
        orderInSeries: z.number().optional(), // Optional: for sorting within series
        // End
      })
      .transform((data) => ({
        ...data,
        slug: data.slug || githubSlug(data.title),
      })),
});

const _note = defineCollection({
  loader: glob({ base: "./src/content/note", pattern: "**/*.{md,mdx}" }),
  schema: baseSchema
    .merge(slugSchema)
    .extend({
      // Notes can have shorter descriptions since they're brief content
      description: z
        .string()
        .max(160, "Description must be ≤160 characters for SEO")
        .optional(),
      publishDate: z
        .string()
        .datetime({ offset: true }) // Ensures ISO 8601 format with offsets allowed (e.g. "2024-01-01T00:00:00Z" and "2024-01-01T00:00:00+02:00")
        .transform((val) => new Date(val)),
      type: z.string().default("note"),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    })
    .transform((data) => ({
      ...data,
      slug: data.slug || githubSlug(data.title),
    })),
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
    tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
    private: z.boolean().default(true), // Always private - never web accessible
  }),
});

// Series
const series = defineCollection({
  loader: glob({ base: "./src/content/series", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    featured: z.boolean().default(false), // Flag for popular series
  }),
});

// New Portfolio Collections
const research = defineCollection({
  loader: glob({ base: "./src/content/research", pattern: "**/*.{md,mdx}" }),
  schema: researchBaseSchema
    .merge(slugSchema)
    .merge(seoSchema.pick({ ogImage: true, canonical: true, lang: true }))
    .extend({
      // Research abstracts can vary in length
      description: z
        .string()
        .min(50, "Research description should be at least 50 characters")
        .max(
          400,
          "Research description should be ≤400 characters for abstracts",
        ),

      // Publication status
      status: z.enum([
        "work-in-progress",
        "working-paper",
        "published",
        "archived",
      ]),

      // Research type
      type: z.enum(["paper", "report", "chapter"]),

      // Year only (string, not Date)
      paperDate: z.string().regex(/^\d{4}$/, "Must be 4-digit year"), // Validates YYYY format

      // Authors as comma-delimited string
      authors: z.string(), // "John Smith, Jane Doe, Bob Wilson"

      // Publication venue (required for published and working papers)
      publication: z.string().optional(),

      // Optional links
      download: z.string().url().optional(),
      link: z.string().url().optional(),

      // Featured flag
      featured: z.boolean().default(false),

      // Tags for categorization
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
    })
    .transform((data) => ({
      ...data,
      slug: data.slug || githubSlug(data.title),
    })),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: ({ image: _image }) =>
    baseSchema
      .merge(seoSchema)
      .merge(slugSchema)
      .extend({
        publishDate: z
          .string()
          .or(z.date())
          .transform((val) => new Date(val)),
        type: z.string().default("projects"),
        featured: z.boolean().default(false),
        technologies: z.array(z.string()).optional(),
        demo: z.string().url().optional(),
        github: z.string().url().optional(),
      })
      .transform((data) => ({
        ...data,
        slug: data.slug || githubSlug(data.title),
      })),
});

const writing = defineCollection({
  loader: glob({ base: "./src/content/writing", pattern: "**/*.{md,mdx}" }),
  schema: baseSchema
    .merge(seoSchema)
    .merge(slugSchema)
    .extend({
      publishDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      type: z.string().default("writing"),
      featured: z.boolean().default(false),
      genre: z.string().optional(),
      wordCount: z.number().optional(),
    })
    .transform((data) => ({
      ...data,
      slug: data.slug || githubSlug(data.title),
    })),
});

// End

// Pages collection for static page content
const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // About page specific fields
    showPhoto: z.boolean().optional(),
    photoSrc: z.string().optional(),
    photoAlt: z.string().optional(),
    fullSizePhotoLink: z.string().optional(),
  }),
});

// Homepage content collection
const homepage = defineCollection({
  loader: glob({ base: "./src/content/homepage", pattern: "**/*.yaml" }),
  schema: z.object({
    bio: z
      .object({
        title: z.string().optional(),
        tagline: z.string().optional(),
        narrative: z.string(),
        affiliations: z
          .array(
            z.object({
              title: z.string(),
              role: z.string(),
            }),
          )
          .optional(),
        photo: z
          .object({
            src: z.string(),
            alt: z.string(),
            caption: z.string().optional(),
            display: z.boolean(),
          })
          .optional(),
      })
      .optional(),
    contact: z.object({
      title: z.string(),
      email: z.string().email(),
      items: z.array(
        z.object({
          label: z.string(),
          href: z.string(),
          text: z.string(),
        }),
      ),
    }),
    sections: z
      .object({
        research: z
          .object({
            title: z.string(),
            itemCount: z.number(),
            viewAllText: z.string(),
            viewAllUrl: z.string(),
          })
          .optional(),
        essays: z
          .object({
            title: z.string(),
            itemCount: z.number(),
            viewAllText: z.string(),
            viewAllUrl: z.string(),
          })
          .optional(),
        writing: z
          .object({
            title: z.string(),
            itemCount: z.number(),
            viewAllText: z.string(),
            viewAllUrl: z.string(),
          })
          .optional(),
        media: z
          .object({
            title: z.string(),
            itemCount: z.number(),
            viewAllText: z.string(),
            viewAllUrl: z.string(),
          })
          .optional(),
      })
      .optional(),
  }),
});

// Export collections
export const collections = {
  post,
  privateNote,
  series,
  projects,
  research,
  writing,
  pages,
  homepage,
};
