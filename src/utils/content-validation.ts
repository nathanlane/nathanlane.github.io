import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { CollectionItemBase } from "@/types";

type AnyCollectionEntry =
  | CollectionEntry<"post">
  | CollectionEntry<"research">
  | CollectionEntry<"projects">
  | CollectionEntry<"writing">;

/**
 * Check for duplicate slugs across all content collections
 * @throws Error if duplicate slugs are found
 */
export async function validateSlugUniqueness() {
  const slugMap = new Map<string, { collection: string; title: string }[]>();

  // Collections to check
  const collections = [
    "post",
    "research",
    "projects",
    "writing",
  ] as const;

  for (const collectionName of collections) {
    const entries = await getCollection(collectionName);

    entries.forEach((entry) => {
      const slug = entry.data.slug || entry.id;
      const key = `${collectionName}/${slug}`;

      if (!slugMap.has(key)) {
        slugMap.set(key, []);
      }

      const entries = slugMap.get(key);
      if (entries) {
        entries.push({
          collection: collectionName,
          title: entry.data.title,
        });
      }
    });
  }

  // Check for duplicates
  const duplicates: string[] = [];

  slugMap.forEach((entries, slug) => {
    if (entries.length > 1) {
      duplicates.push(
        `Duplicate slug "${slug}" found in:\n${entries.map((e) => `  - ${e.collection}: "${e.title}"`).join("\n")}`,
      );
    }
  });

  if (duplicates.length > 0) {
    throw new Error(`Duplicate slugs detected:\n\n${duplicates.join("\n\n")}`);
  }
}

/**
 * Validate that all public content has proper SEO fields
 */
export async function validateSEOFields() {
  const errors: string[] = [];

  // Check posts
  const posts = await getCollection("post", ({ data }) => !data.draft);
  posts.forEach((post) => {
    if (!post.data.description || post.data.description.length < 50) {
      errors.push(
        `Post "${post.data.title}" has description shorter than 50 characters`,
      );
    }
    if (post.data.description && post.data.description.length > 160) {
      errors.push(
        `Post "${post.data.title}" has description longer than 160 characters`,
      );
    }
  });

  // Check other collections...
  // Add similar checks for research, projects, writing

  if (errors.length > 0) {
    console.warn(`SEO validation warnings:\n${errors.join("\n")}`);
  }
}

/**
 * Run all content validations
 */
export async function validateContent() {
  await validateSlugUniqueness();
  await validateSEOFields();
}
