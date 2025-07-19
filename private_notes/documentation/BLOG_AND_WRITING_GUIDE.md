# Comprehensive Blog & Writing System Guide

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Content Collections](#content-collections)
3. [Blog System Structure](#blog-system-structure)
4. [Writing System](#writing-system)
5. [Content Discovery & Navigation](#content-discovery--navigation)
6. [Creating Blog Posts](#creating-blog-posts)
7. [Visual Design & Typography](#visual-design--typography)
8. [Advanced Features](#advanced-features)
9. [Technical Implementation](#technical-implementation)
10. [Troubleshooting](#troubleshooting)

---

## System Architecture Overview

The blog and writing system is built on Astro's Content Collections API, providing type-safe content management with multiple content types and sophisticated organization features.

### Key Features
- **Multiple content types**: Blog posts, writing pieces, research papers, notes
- **Type-safe validation**: Zod schemas ensure content integrity
- **SEO optimization**: Built-in meta tags, OG images, structured data
- **Multiple discovery paths**: By date, tag, series, category, search
- **Performance focused**: Static generation, pagination, efficient data loading

## Content Collections

### Collection Types (defined in `src/content.config.ts`)

#### Primary Collections
- **`post`**: Main blog posts (MD/MDX) with full feature support
- **`writing`**: Creative writing and storytelling pieces
- **`research`**: Academic papers and research articles (120 char title limit)
- **`projects`**: Project documentation and case studies
- **`note`**: Short notes and snippets
- **`series`**: Metadata for grouping related posts
- **`pages`**: Static page content (e.g., About page)
- **`homepage`**: Homepage content configuration (YAML)

#### Schema Features
- **SEO schema**: Description, OG image, canonical URL for all public content
- **Automatic slug generation**: Using github-slugger
- **Draft support**: Hide content from production with `draft: true`
- **Type validation**: Zod schemas ensure data integrity
- **Flexible limits**: Research papers allow longer titles (120 vs 60 chars)

## Blog System Structure

### File Organization

```
src/
├── content/
│   ├── post/           # Blog posts (*.md, *.mdx)
│   ├── writing/        # Creative writing
│   ├── research/       # Research papers
│   ├── series/         # Series definitions
│   └── config.ts       # Collection schemas
├── pages/
│   └── posts/
│       ├── index.astro      # Main blog page with categories
│       ├── [...page].astro  # Paginated blog listing
│       ├── [...slug].astro  # Individual post pages
│       └── archive.astro    # Full archive view
└── data/
    └── post.ts         # Utility functions for posts
```

### Routes & URLs

#### Blog Routes
- `/posts/` - Main blog index with search and categories
- `/posts/2/`, `/posts/3/` - Paginated listings (10 per page)
- `/posts/[slug]/` - Individual blog posts
- `/posts/archive/` - Complete archive by year
- `/posts/index/` - Category-based browsing

#### Supporting Routes
- `/tags/` - All tags with counts
- `/tags/[tag]/` - Posts filtered by tag
- `/tags/[tag]/2/` - Paginated tag pages
- `/series/[slug]/` - Series overview pages
- `/rss.xml` - RSS feed

### Data Management Functions

Located in `src/data/post.ts`:

```typescript
getAllPosts()           // Gets all non-draft posts
groupPostsByYear()      // Organizes posts by publication year
getUniqueTags()         // Extracts all unique tags
getUniqueTagsWithCount() // Tag frequency analysis
sortPostsByDate()       // Chronological sorting
```

## Writing System

### Separate Collection Features
- **Independent from blog**: Different content type and presentation
- **Simpler layout**: No TOC or webmentions
- **Genre support**: Fiction, non-fiction, poetry categories
- **Word count metadata**: Track piece length

### Routes
- `/writing/` - Writing collection index
- `/writing/[slug]/` - Individual writing pieces

### Key Differences from Blog
- Uses `BaseLayout` instead of `BlogPost` layout
- No series support
- Simpler metadata (no reading time calculation)
- Featured flag for homepage display

## Content Discovery & Navigation

### Multiple Browse Methods

1. **Chronological**
   - Paginated posts (newest first)
   - Archive page by year
   
2. **Categorical**
   - Index page with sections (Economics, Technical, Research)
   - Tag-based filtering
   
3. **Organizational**
   - Series grouping for related posts
   - Featured content highlighting
   
4. **Search**
   - Client-side search on main posts page
   - Searches titles and tags

### Navigation Structure

From `navigation.config.ts`:

```yaml
Header:
  - Home
  - About  
  - Research
  - Writing
  - Media

Footer:
  Explore:
    - About
    - Research
    - Writing
    - Blog
  Browse:
    - Projects
    - Notes
    - Tags
    - Archive
  Connect:
    - Email
    - CV
    - RSS
    - Sitemap
```

### Archive Page Features

The `/posts/archive/` page provides:
- **Statistics dashboard**: Total posts, topics, year range
- **Browse by topic**: Categorized tag groups
- **Year navigation**: Jump links with post counts
- **Sticky headers**: Year markers while scrolling

## Creating Blog Posts

### 1. File Creation

Create a new markdown file in `src/content/post/`:

```markdown
---
title: "Your Post Title"  # Max 60 characters!
description: "Brief description for SEO and social sharing"
publishDate: "2025-01-15"  # YYYY-MM-DD format
updatedDate: "2025-01-16"  # Optional, for revised posts
tags: ["economics", "research", "policy"]  # 3-5 tags recommended
draft: false  # Set to true to hide from production
seriesId: "series-name"  # Optional, for post series
orderInSeries: 2  # Optional, position in series
ogImage: "/images/blog/custom-image.jpg"  # Optional custom social image
canonicalUrl: "https://example.com/original"  # Optional, for cross-posts
---

Your opening paragraph starts here and will get the elegant drop cap treatment automatically.

This is your second paragraph. The typography system will handle all the beautiful spacing and grid alignment.

## Section Headings

Use standard markdown headings for structure.

---

Horizontal rules create gentle section breaks in the Craig Mod style.

> Pull quotes can be created with blockquotes for emphasis and visual interest.

![Alt text for image](/images/blog/your-image.jpg)
*Image captions are automatically styled in italics*
```

### 2. Required Frontmatter Fields

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `title` | string | ≤60 chars | Post title (build fails if too long) |
| `description` | string | 150-160 chars | SEO and social sharing |
| `publishDate` | date | YYYY-MM-DD | Publication date |
| `draft` | boolean | true/false | Hide from production |

### 3. Optional Frontmatter Fields

| Field | Type | Purpose |
|-------|------|---------|
| `updatedDate` | date | Shows "Updated" badge |
| `tags` | string[] | Categorization (lowercase) |
| `seriesId` | string | Groups related posts |
| `orderInSeries` | number | Position in series |
| `ogImage` | string | Custom social image |
| `canonicalUrl` | string | For cross-posted content |

## Visual Design & Typography

### Craig Mod-Inspired Layout

The blog system implements an editorial aesthetic with:

1. **Back Navigation**: "← All Essays" link at top
2. **Essay Title**: Large, prominent heading
3. **Horizontal Separator**: Elegant line under title
4. **Essay Metadata**: "ESSAY • DATE • WORD COUNT • READ TIME"
5. **Drop Cap**: First letter of opening paragraph
6. **Reading Measure**: 65-character line length

### Typography Hierarchy

| Element | Size | Font | Usage |
|---------|------|------|-------|
| Essay Title | 29.3-33.2px | Newsreader | Main post title |
| Opening Paragraph | 18.8-21.3px | IBM Plex Sans | First paragraph |
| Body Text | 15.6-17px | IBM Plex Sans | Regular content |
| Pull Quotes | 23.4-26.6px | IBM Plex Sans | Blockquotes |
| Captions | 12.8-14.4px | IBM Plex Sans | Image captions |
| Metadata | 12.8-14.4px | IBM Plex Sans | Date, word count |

### Spacing System (6px Baseline Grid)

- **Paragraph spacing**: 24px (4 grid units)
- **Section breaks**: 48px (8 grid units)
- **Major sections**: 72px (12 grid units)
- **Essay wrapper**: 48px vertical, 24px horizontal

### Responsive Behavior

#### Mobile (< 768px)
- Wrapper padding: 36px vertical, 18px horizontal
- Drop cap: Smaller size
- Images: Full-bleed with adjusted margins
- Font sizes: Slightly reduced

#### Desktop (≥ 768px)
- Optimal 65ch reading measure
- Generous whitespace
- Larger typography scale
- Side navigation elements

## Advanced Features

### Series Support

Group related posts by adding to frontmatter:

```yaml
seriesId: "industrial-policy-series"
orderInSeries: 3
```

Create series definition in `src/content/series/[series-id].md`:

```markdown
---
title: "Industrial Policy Series"
description: "A deep dive into historical case studies"
---

This series examines the role of state intervention...
```

Series features:
- Automatic navigation panel
- Previous/next post links
- Series overview page at `/series/[series-id]/`
- Order customization with `orderInSeries`

### Table of Contents

Automatically generated for posts with headings:
- Appears as sidebar on desktop
- Mobile toggle button
- Smooth scroll to sections
- Active section highlighting

### WebMentions

Social interactions support:
- Likes and reposts from social media
- Comments via webmention.io
- Automatic display below posts

### Custom Components

#### Pull Quotes
```html
<blockquote class="pull-quote">
This text will be centered with larger typography.
</blockquote>
```

#### Asterisms (Section Breaks)
```astro
import Asterism from "@/components/typography/Asterism.astro";

<Asterism />  <!-- Default: ⁂ -->
<Asterism data-variant="triple">* * *</Asterism>
```

### Image Management

1. **Storage Location**: `/public/images/blog/`
2. **Social Images**: `/public/images/blog/og/`
3. **Optimization**: Automatic WebP conversion
4. **Sizing**: Minimum 1200px width for social
5. **Captions**: Use italics below images

## Technical Implementation

### Build Process

1. **Content Loading**: Collections loaded at build time
2. **Route Generation**: Static pages for all posts
3. **Image Processing**: Automatic optimization
4. **RSS Generation**: Feeds created during build
5. **Sitemap Creation**: All URLs included

### Performance Features

- **Pagination**: 10 posts per page reduces load
- **Static Generation**: No server-side rendering
- **Image Optimization**: WebP with fallbacks
- **Minimal JavaScript**: Only for search and toggles
- **CSS Efficiency**: Reuses existing design system

### SEO Implementation

- **Meta Tags**: Title, description, OG tags
- **Structured Data**: Article and breadcrumb schemas
- **OG Images**: Auto-generated at `/og-image/[slug].png`
- **RSS Feeds**: Multiple feeds for discovery
- **Sitemap**: Comprehensive URL listing

### Data Flow

```
Content Files → Content Collections → Page Generation → Static HTML
     ↓                    ↓                  ↓              ↓
  Markdown            Validation         Routing      Optimized Output
```

## Troubleshooting

### Common Issues & Solutions

**Build fails with title error**
```bash
Error: Post title exceeds 60 characters
```
Solution: Shorten title in frontmatter

**Images not displaying**
- Check file exists in `/public/images/blog/`
- Verify path starts with `/` not `./`
- Ensure proper file extension

**Spacing looks incorrect**
- Verify CSS variables use `--space-*` not `--space-*b`
- Check baseline grid alignment (multiples of 6px)

**Draft posts appearing**
- Ensure `draft: true` in frontmatter
- Clear build cache: `rm -rf dist/`

**Series not linking**
- Verify `seriesId` matches series filename
- Check series file exists in `src/content/series/`

### Development Commands

```bash
# Start development server
pnpm dev

# Validate content
pnpm check

# Build for production
pnpm build

# Preview production build
pnpm preview

# Clear cache and rebuild
rm -rf dist/ && pnpm build
```

### Content Validation

Run validation before committing:

```bash
# Check all content
pnpm validate

# Auto-fix issues
pnpm fix-content
```

Common validation errors:
- Title length (max 60 chars)
- Description length (20-300 chars)
- Missing required fields
- Invalid date formats

## Best Practices

### Content Guidelines

1. **Strong openings**: Hook readers in first paragraph
2. **Clear structure**: Use headings for scannability
3. **Visual variety**: Include images, quotes, breaks
4. **Consistent tagging**: Use existing tags when possible
5. **Series planning**: Outline series before starting

### SEO Optimization

1. **Title optimization**: Include keywords naturally
2. **Meta descriptions**: Compelling 150-160 chars
3. **Internal linking**: Connect related content
4. **Image alt text**: Descriptive for accessibility
5. **URL slugs**: Keep short and readable

### Performance Tips

1. **Image sizing**: Optimize before uploading
2. **Code blocks**: Use syntax highlighting sparingly
3. **External embeds**: Minimize third-party content
4. **Draft management**: Don't accumulate too many
5. **Tag pruning**: Consolidate similar tags

---

This comprehensive system provides a robust, scalable platform for both traditional blog posts and creative writing while maintaining excellent performance, SEO, and user experience.