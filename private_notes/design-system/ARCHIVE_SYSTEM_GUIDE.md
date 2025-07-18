# Archive System Guide

## Overview

A reusable archive system that extracts the excellent typography and design patterns from the Media page for use across different content types (writing, research, projects, etc.).

## Components

### `ArchiveEntry.astro`
Reusable component for individual archive entries with refined typography.

**Features:**
- Document-centric design without boxes or heavy decoration
- Semantic HTML structure with proper heading hierarchy
- Baseline grid alignment (6px system)
- Advanced OpenType features
- 65ch description width for optimal readability
- Responsive typography scaling
- Print optimization

### `PageHeader.astro` (Existing)
Already optimized header component for consistent page headers.

## Usage Examples

### Writing Archive
```astro
<ArchiveEntry 
  title="The Future of Typography"
  primaryMeta="Essay"
  secondaryMeta="March 2024"
  tertiaryMeta="Design Systems"
  link="/writing/future-typography"
  description="Exploring how digital typography continues to evolve..."
/>
```

### Research Archive  
```astro
<ArchiveEntry 
  title="Industrial Policy in East Asia"
  primaryMeta="Research Paper"
  secondaryMeta="January 2024"
  tertiaryMeta="Economics"
  link="/research/industrial-policy"
  description="Quantitative analysis of state-led development..."
/>
```

### Project Archive
```astro
<ArchiveEntry 
  title="Design System Architecture"
  primaryMeta="Project"
  secondaryMeta="2023-2024"
  tertiaryMeta="In Progress"
  link="/projects/design-system"
  description="Building scalable design systems..."
/>
```

## Typography Hierarchy

### Sizes
- **Title**: `var(--step-0)` (13-14px) - Medium weight (500)
- **Metadata**: `var(--step--2)` (10.2-11.5px) - Normal weight (400)
- **Description**: `var(--step--2)` (10.2-11.5px) - Normal weight (400)

### Spacing (Baseline Grid)
- **Entry padding**: `var(--space-4b)` (24px = 4 baseline units)
- **Title margin**: `var(--space-2b)` (12px = 2 baseline units)
- **Meta margin**: `var(--space-3b)` (18px = 3 baseline units)
- **Year sections**: `var(--space-12b)` (72px = 12 baseline units)

### Colors
- **Title links**: `var(--theme-accent-base)` → `var(--theme-accent-dark)` on hover
- **Metadata**: `var(--theme-color-500)`
- **Description**: `var(--theme-color-700)`
- **Separators**: 60% opacity

### Reading Measure
- **Description width**: `65ch` (perfect balance of readability and contrast)
- **Container**: `measure-base` (75ch)

## Implementation Pattern

```astro
---
import { getCollection } from "astro:content";
import PageLayout from "@/layouts/Base.astro";
import PageHeader from "@/components/PageHeader.astro";
import ArchiveEntry from "@/components/ArchiveEntry.astro";

// Get and sort content
const allContent = await getCollection("content-type");
const sortedContent = allContent.sort((a, b) => 
  new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime()
);

// Group by year
const contentByYear: Record<number, typeof allContent> = {};
// ... grouping logic

// Helper functions for metadata
const getContentType = (post: any) => { /* logic */ };
const formatDate = (date: Date) => { /* formatting */ };
const getTertiaryMeta = (post: any) => { /* logic */ };
---

<PageLayout meta={meta}>
  <div class="measure-base mx-auto px-4b py-8b">
    <PageHeader 
      title="Archive Title"
      description="Archive description..."
      additionalInfo="Additional info..."
    />

    <div class="space-y-12b">
      {years.map(year => (
        <section>
          <h2 class="heading-3 text-light mb-6b">{year}</h2>
          <div class="space-y-6b">
            {contentByYear[Number(year)]?.map(item => (
              <ArchiveEntry 
                title={item.data.title}
                primaryMeta={getContentType(item)}
                secondaryMeta={formatDate(new Date(item.data.publishDate))}
                tertiaryMeta={getTertiaryMeta(item)}
                link={`/content-type/${item.id}/`}
                description={item.data.description}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  </div>
</PageLayout>
```

## Metadata Guidelines

### Primary Meta (Required)
Content type classification:
- Writing: "Essay", "Tutorial", "Review", "Analysis"
- Research: "Research Paper", "Working Paper", "Policy Brief"
- Projects: "Project", "Case Study", "Tool"

### Secondary Meta (Required)
Time information:
- Writing: "March 2024"
- Research: "January 2024"
- Projects: "2023-2024" or "Ongoing"

### Tertiary Meta (Optional)
Additional context:
- Genre/Category: "Design Systems", "Economics", "Technology"
- Status: "Featured", "In Progress", "Updated"

## Created Pages

### ✅ Writing Archive
- **URL**: `/writing/archive/`
- **File**: `src/pages/writing/archive.astro`
- **Features**: Chronological organization, essay type classification

### 🔄 Future Archive Pages
- Research Archive (`/research/archive/`)
- Projects Archive (`/projects/archive/`)
- Media Archive (already exists as `/media/`)

## Typography Masters Applied

- **Bringhurst**: Optimal character counts (65ch), hierarchy principles
- **Ruder**: Systematic spacing intervals, baseline grid alignment
- **Hochuli**: Restraint, even grey tonality, document-centric design
- **Butterick**: Web accessibility, refined link styling
- **Ambrose-Harris**: Information hierarchy, visual organization

## Benefits

1. **Consistency**: Same excellent design across all archive pages
2. **Maintainability**: Single component to update for all archives
3. **Flexibility**: Easy customization for different content types
4. **Typography**: Professional, readable, accessible design
5. **Performance**: Optimized rendering and responsive behavior

This system ensures that every archive page maintains the same high-quality typography and user experience that made the Media page so successful. 