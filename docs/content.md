# Content

This repo uses Astro content collections defined in [src/content.config.ts](../src/content.config.ts). This file is the collection source of truth.

## Collection map

| Collection | Folder | Public route | Notes |
| --- | --- | --- | --- |
| `post` | `src/content/post/` | `/posts/` | Blog posts and notes that publish as posts |
| `research` | `src/content/research/` | `/research/` | Research pages |
| `projects` | `src/content/projects/` | `/projects/` | Project pages |
| `writing` | `src/content/writing/` | `/writing/` | Writing pages and `/writing/archive/` |
| `media` | `src/content/media/` | `/media/` | Media appearances and press mentions |
| `pages` | `src/content/pages/` | varies | Singleton page copy such as homepage, about, media, posts, research, writing |
| `series` | `src/content/series/` | `/series/` | Series metadata used by posts |
| `privateNote` | `src/content/private-note/` | none | Private notes, not published |

## Public collection fields

### `post`

Required:

- `title`
- `description`
- `publishDate`

Optional:

- `slug`
- `ogImage`
- `canonical`
- `draft`
- `lang`
- `coverImage`
- `tags`
- `updatedDate`
- `seriesId`
- `orderInSeries`

Note: posts are explicitly filtered by `draft` in production via [src/data/post.ts](../src/data/post.ts).

### `research`

Required:

- `title`
- `description`
- `status`
- `type`
- `paperDate`
- `authors`

Optional:

- `slug`
- `ogImage`
- `canonical`
- `lang`
- `publication`
- `download`
- `link`
- `featured`
- `tags`

`paperDate` is a four-digit year string.

### `projects`

Required:

- `title`
- `description`
- `publishDate`

Optional:

- `slug`
- `ogImage`
- `canonical`
- `draft`
- `lang`
- `type`
- `featured`
- `technologies`
- `demo`
- `github`

### `writing`

Required:

- `title`
- `description`
- `publishDate`

Optional:

- `slug`
- `ogImage`
- `canonical`
- `draft`
- `lang`
- `type`
- `featured`
- `genre`
- `wordCount`

### `media`

Required:

- `title`
- `outlet`
- `date`
- `type`
- `link`

Optional:

- `description`

Allowed `media.type` values:

- `interview`
- `podcast`
- `video`
- `article`
- `press`
- `talk`
- `panel`

## Singleton page content

The `pages` collection currently includes:

- `homepage.mdx`
- `about.mdx`
- `media.mdx`
- `posts.mdx`
- `research.mdx`
- `writing.mdx`
- `writing-archive.mdx`

These files provide page-level copy and structured fields such as:

- `title`
- `description`
- `headerDescription`
- `headerAdditionalInfo`
- `showPhoto`
- `sections`
- `secondaryAffiliation`
- `contactLinks`

## Draft behavior

- `post` entries are filtered by the shared post data helper
- `projects` and `writing` entries with `draft: true` are excluded from public routes and indexes
- `research` and `media` do not currently define a `draft` field

## CMS workflow

The supported CMS workflow is local only:

```bash
pnpm dev
pnpm cms
```

Then open `http://localhost:4321/admin/index.html`.

The CMS config is generated from [src/content.contract.mjs](../src/content.contract.mjs) into [public/admin/config.yml](../public/admin/config.yml).

Do not hand-edit the generated YAML. Update the shared contract and run:

```bash
pnpm run generate:cms
```

## OG images and social cards

- Default site social card: `/social-card.png`
- Per-entry override: `ogImage`
- Dynamic OG image route implementation: [src/pages/og-image/[...slug].[ext].ts](../src/pages/og-image/[...slug].[ext].ts)

When documenting or editing OG behavior, use the catch-all route path above, not the older single-slug path.
