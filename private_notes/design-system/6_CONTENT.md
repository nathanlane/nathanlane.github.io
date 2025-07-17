# Content Management Guide

This document explains how to add and manage content across all sections of the website using Astro's Content Collections for type-safe content management.

## Overview

The website uses Astro's Content Collections with comprehensive Zod schemas for type-safe validation. All content is written in Markdown/MDX format with frontmatter that is validated at build time, preventing errors and ensuring consistency.

## Content Collections

### Blog Posts (`src/content/post/`)

Blog posts, essays, and articles with full metadata support including series organization.

#### Schema
```yaml
---
title: "Post Title"                    # Required, max 60 characters
description: "SEO description"         # Required, 20-300 characters
publishDate: "2025-01-15"             # Required, ISO 8601 format
updatedDate: "2025-01-20"             # Optional, shows update badge
tags: ["economics", "policy"]          # Optional, auto-lowercased
draft: false                           # Optional, defaults to false
coverImage:                            # Optional
  src: "/images/blog/cover.jpg"
  alt: "Cover image description"
ogImage: "/images/og/custom.jpg"       # Optional, custom social image
canonical: "https://example.com/post"  # Optional, canonical URL
lang: "en-GB"                          # Optional, defaults to en-GB
seriesId: "industrial-policy"          # Optional, for post series
orderInSeries: 1                       # Optional, for series ordering
slug: "custom-slug"                    # Optional, auto-generated from title
---
```

**Special Features:**
- **Series Support**: Group related posts using `seriesId`
- **Automatic Slug Generation**: Uses GitHub-style slugs if not provided
- **SEO Validation**: Description length enforced for optimal SEO
- **Draft Mode**: Set `draft: true` to hide from production

### Research Papers (`src/content/research/`)

Academic research papers with publication workflow and detailed metadata.

#### Schema
```yaml
---
title: "Research Paper Title"          # Required, max 120 characters
description: "Detailed abstract"       # Required, 50-400 characters  
status: "published"                    # Required: work-in-progress | working-paper | published | archived
type: "paper"                         # Required: paper | report | chapter
paperDate: "2024"                     # Required, 4-digit year as string
authors: "Nathan Lane, Co-author"      # Required, comma-delimited
publication: "Journal Name"            # Optional, for published papers
download: "https://paper.pdf"          # Optional, direct download link
link: "https://journal.com/article"    # Optional, external publication
featured: true                         # Optional, shows in homepage sections
tags: ["economics", "industrial-policy"] # Optional, for categorization
ogImage: "/images/research/paper-og.jpg" # Optional, custom social image
canonical: "https://journal.com/canonical" # Optional, canonical URL
slug: "custom-research-slug"           # Optional, auto-generated
---
```

**Publication Workflow:**
1. **work-in-progress**: Early stage research, ideas in development
2. **working-paper**: Complete drafts ready for review and feedback  
3. **published**: Peer-reviewed and officially published papers
4. **archived**: Older work no longer actively maintained

**Page Organization:**
- **Featured Papers**: `featured: true` papers appear in homepage sections
- **Status Sections**: Papers automatically grouped by status on `/research/`
- **Chronological Order**: Sorted by `paperDate` (newest first)

### Projects (`src/content/projects/`)

Portfolio projects, tools, and case studies with technical details.

#### Schema
```yaml
---
title: "Project Name"                  # Required, max 60 characters
description: "Project description"     # Required, 20-300 characters
publishDate: "2025-01-15"             # Required
featured: false                        # Optional, for homepage display
technologies: ["Python", "R", "TypeScript"] # Optional, tech stack
demo: "https://demo-link.com"          # Optional, live demo URL
github: "https://github.com/user/repo" # Optional, source code URL
ogImage: "/images/projects/og.jpg"     # Optional, custom social image
slug: "project-slug"                   # Optional, auto-generated
---
```

### Writing (`src/content/writing/`)

Creative writing, storytelling, and non-academic content.

#### Schema
```yaml
---
title: "Story Title"                   # Required, max 60 characters
description: "Story description"       # Required, 20-300 characters
publishDate: "2025-01-15"             # Required
featured: false                        # Optional, for homepage sections
genre: "short-story"                   # Optional, content genre
wordCount: 2500                        # Optional, word count
ogImage: "/images/writing/story-og.jpg" # Optional, custom social image
slug: "story-slug"                     # Optional, auto-generated
---
```

### Notes (`src/content/note/`)

Short-form content, quick thoughts, and brief observations.

#### Schema
```yaml
---
title: "Note Title"                    # Required, max 60 characters
description: "Brief note description"  # Optional, max 160 characters
publishDate: "2025-01-15T12:00:00Z"   # Required, ISO 8601 with timezone
featured: false                        # Optional, for highlighting
draft: false                           # Optional, defaults to false
slug: "note-slug"                      # Optional, auto-generated
---
```

### Series (`src/content/series/`)

Metadata for organizing related posts into series.

#### Schema
```yaml
---
id: "industrial-policy"               # Required, unique identifier
title: "Industrial Policy Series"     # Required, display name
description: "A deep dive into..."    # Required, series description
featured: false                       # Optional, for popular series
---
```

### Static Pages (`src/content/pages/`)

Static pages like About, Contact, etc.

#### Schema
```yaml
---
title: "About"                        # Required
description: "About page description" # Required
showPhoto: true                       # Optional, for About page
photoSrc: "/headshot.jpg"            # Optional, photo path
photoAlt: "Profile photo"            # Optional, accessibility
fullSizePhotoLink: "/headshot-full.jpg" # Optional, larger version
---
```

### Homepage Content (`src/content/homepage/`)

Structured configuration for homepage sections in YAML format.

#### Structure
```yaml
hero:
  title: "Your Name"
  description: "Professional tagline"
  buttons:
    - text: "Research"
      href: "/research/"
      variant: "primary"

bio:                                   # Optional biographical section
  title: "About"
  tagline: "Professional title"
  narrative: "Markdown-supported bio text"
  affiliations:
    - title: "Institution"
      role: "Position"

currentProjects:
  title: "Current Projects"
  projects:
    - title: "Project Name"
      description: "Project description"
      url: "/projects/project/"

showcase:
  title: "What I'm Working On"
  contentSections:                     # Controls homepage sections
    research:
      title: "Recent Papers"
      itemCount: 3
      viewAllText: "View all research"
      viewAllUrl: "/research/"
    writing:
      title: "Recent Writing"
      itemCount: 2
      viewAllText: "View all writing"
      viewAllUrl: "/writing/"
    media:
      title: "Recent Media"
      itemCount: 5
      viewAllText: "View all media"
      viewAllUrl: "/media/"
```

## Media Data (`src/data/media.ts`)

Media appearances and coverage organized by year with TypeScript interface.

#### Interface
```typescript
interface MediaItem {
  title: string;
  outlet: string;
  date: string;                        // YYYY-MM-DD format
  type: "interview" | "podcast" | "video" | "article" | "press" | "talk" | "panel";
  link: string;
  description?: string;                // Optional description
}
```

#### Usage
```typescript
export const mediaData: Record<number, MediaItem[]> = {
  2025: [
    {
      title: "Article Title",
      outlet: "Publication Name",
      date: "2025-01-15",
      type: "article",
      link: "https://example.com/article",
      description: "Optional description"
    }
  ]
};
```

## Content Features

### Type Safety & Validation
- **Zod Schemas**: All frontmatter validated at build time
- **Build Failures**: Invalid content causes helpful error messages
- **TypeScript Types**: Auto-generated types for all collections
- **SEO Validation**: Description lengths enforced for search optimization

### URL Generation & Routing
- **Automatic Routing**: Collections generate pages at predictable URLs
- **Slug Generation**: GitHub-style slugs auto-generated from titles
- **Collection URLs**: 
  - Posts: `/posts/[slug]/`
  - Research: `/research/[slug]/`
  - Projects: `/projects/[slug]/`
  - Writing: `/writing/[slug]/`
  - Notes: `/notes/[slug]/`

### Content Processing
- **Markdown Support**: Full Markdown with frontmatter validation
- **MDX Support**: React components in Markdown where needed
- **Auto-features**: Reading time, word count, related content
- **RSS Feeds**: Automatic generation for posts and notes
- **OG Images**: Dynamic social sharing images via Satori

### Search & Discovery
- **Tag System**: Automatic indexing and filtering
- **Series Navigation**: Related post discovery
- **Featured Content**: Homepage sections and highlights
- **Archive Pages**: Complete content listings with pagination

## Development Workflow

### Adding New Content
1. Create file in appropriate collection directory
2. Add required frontmatter using schema
3. Write content in Markdown/MDX
4. Run `pnpm dev` to see changes locally
5. Build with `pnpm build` to validate

### Content Validation
- **Real-time**: Validation errors appear during development
- **Build-time**: Invalid content prevents deployment
- **IDE Support**: TypeScript provides autocomplete and error detection

### File Organization
```
src/content/
├── post/           # Blog posts and essays
├── research/       # Academic papers and reports
├── projects/       # Portfolio projects
├── writing/        # Creative writing
├── note/           # Short-form content
├── series/         # Series metadata
├── pages/          # Static pages
├── homepage/       # Homepage configuration
├── docs/           # Documentation (if using lane-docs)
└── private-note/   # Private content (never published)
```

## Best Practices

### Content Creation
1. **Titles**: Keep under character limits for optimal display
2. **Descriptions**: Write for both humans and search engines
3. **Tags**: Use consistently across related content
4. **Slugs**: Let auto-generation handle URL creation
5. **Images**: Use appropriate paths and include alt text

### SEO Optimization
1. **Description Length**: Follow character limits for each collection
2. **Custom OG Images**: Create for featured or important content
3. **Canonical URLs**: Set when content appears elsewhere
4. **Tags**: Use relevant keywords for content discovery

### Series Organization
1. **Consistent Naming**: Use clear, descriptive series IDs
2. **Logical Order**: Set `orderInSeries` for proper sequencing
3. **Series Landing Pages**: Create dedicated pages for series overview

This content management system provides a robust, type-safe foundation for all website content while maintaining flexibility for future growth and changes.