# Content Management Guide

This document explains how to add and manage content across all sections of the website.

## Overview

The website uses Astro's Content Collections for type-safe content management. All content is written in Markdown/MDX format with frontmatter validation.

## Content Collections

### Posts (`src/content/post/`)
Blog posts and articles with full metadata support.

### Notes (`src/content/note/`)
Short-form content and quick thoughts.

### Research

Academic research papers, working papers, and reports organized by publication status.

#### Schema

Research papers use the following frontmatter schema:

```yaml
---
title: "Paper Title"                    # Required, max 60 characters
description: "Detailed description"     # Required, used as excerpt (auto-truncated to 80 chars on cards)
status: "published"                     # Required: work-in-progress | working-paper | published | archived
type: "paper"                          # Required: paper | report | chapter
paperDate: "2024"                      # Required: 4-digit year as string
authors: "John Smith, Jane Doe"         # Required: comma-delimited author names
featured: true                          # Optional: shows in "New Papers" section, defaults to false
download: "https://example.com/paper.pdf"  # Optional: direct download link
link: "https://journal.com/article"     # Optional: external publication link
---
```

#### Publication Status Workflow

Research papers follow this publication workflow:

1. **work-in-progress**: Early stage research, ideas in development
2. **working-paper**: Complete drafts ready for review and feedback
3. **published**: Peer-reviewed and officially published papers
4. **archived**: Older work that's no longer actively maintained

#### Research Page Organization

The `/research/` page automatically organizes papers into sections:

- **New Papers**: Featured papers (any status except archived)
- **Published Papers**: Non-featured papers with `status: "published"`
- **Working Papers**: Papers with `status: "working-paper"`
- **Works in Progress**: Papers with `status: "work-in-progress"`

All sections sort by `paperDate` (newest first).

#### Adding New Research Papers

1. **Create file**: Add new `.md` file in `src/content/research/filename.md`
2. **Add frontmatter**: Include all required fields using the schema above
3. **Write content**: Add your paper content below the frontmatter
4. **Build**: The paper automatically appears on the research page

#### Example Research Paper

```markdown
---
title: "Economic Impact of Digital Transformation"
description: "This paper examines the comprehensive effects of digital transformation on traditional economic models, analyzing data from 50+ companies over a 5-year period. We find significant improvements in productivity metrics alongside unexpected challenges in workforce adaptation."
status: "published"
type: "paper"
paperDate: "2024"
authors: "Nathan Lane, Sarah Johnson, Michael Chen"
featured: true
download: "https://example.com/digital-transformation.pdf"
link: "https://economics-journal.com/articles/2024/digital-transformation"
---

# Economic Impact of Digital Transformation

## Abstract

This study provides a comprehensive analysis...

## Introduction

Digital transformation has become...
```

#### Research Card Display

Papers appear as cards showing:
- **Title**: Linked to full paper page
- **Authors and Year**: "Nathan Lane, Sarah Johnson • 2024"
- **Description**: First 80 characters with ellipsis
- **Links**: "Download PDF" and "View Publication" (if provided)
- **Featured Highlight**: Left border for featured papers

#### Best Practices

- **Titles**: Keep under 60 characters for optimal display
- **Descriptions**: Write detailed descriptions; cards auto-truncate to 80 chars
- **Authors**: Use full names separated by commas
- **Featured**: Use sparingly for your most important recent work
- **Links**: Ensure URLs are accessible and permanent
- **Years**: Use publication year, not completion year
- **Status**: Update status as papers progress through workflow

### Projects (`src/content/projects/`)
Portfolio items and case studies.

### Writing (`src/content/writing/`)
Creative writing and storytelling content.

### Series (`src/content/series/`)
Metadata for grouping related posts.

## File Organization

```
src/content/
├── post/           # Blog posts
├── note/           # Short notes
├── research/       # Research papers
├── projects/       # Portfolio projects
├── writing/        # Creative writing
└── series/         # Series metadata
```

## Content Features

- **Type Safety**: Zod schemas validate all frontmatter
- **Auto-routing**: Files automatically generate pages
- **Dynamic OG Images**: Social cards generated for all content
- **RSS Feeds**: Automatic feed generation
- **Search**: Full-text search across all content
- **Tags**: Automatic tag indexing and filtering

## Build Process

1. Content validation happens at build time
2. Invalid frontmatter causes build failures with helpful errors
3. All content generates static pages for optimal performance
4. OG images are generated dynamically based on content

## Development Workflow

1. Add content files to appropriate collection directories
2. Run `npm run dev` to see changes locally
3. Build with `npm run build` to validate before deployment
4. All content is automatically indexed and routed