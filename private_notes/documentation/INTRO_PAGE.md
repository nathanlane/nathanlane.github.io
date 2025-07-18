# Homepage Control Guide

## Overview

The homepage is the primary entry point for your site, following a **document-centric, typography-first aesthetic**. It's built from multiple interconnected components and content sources, all configurable through YAML files and Astro components.

## Architecture Overview

The homepage follows a layered architecture:

1. **Layout Controller**: `src/pages/index.astro`
2. **Content Configuration**: `src/content/homepage/index.yaml`
3. **Component Library**: Various Astro components for different sections
4. **Content Sources**: Research, writing, blog posts, and media data

---

## 1. Main Layout Controller

### `src/pages/index.astro`

This is the primary controller that orchestrates the entire homepage:

```astro
---
// Content fetching
const homepageContent = await getEntry("homepage", "index");
const { bio, contact, sections } = homepageContent.data;

// Data aggregation
const allPosts = await getAllPosts();
const allResearch = await getCollection("research");
const allWriting = await getCollection("writing");
const allMediaItems = Object.entries(mediaData);
---
```

**Key Responsibilities**:
- Fetches configuration from YAML files
- Aggregates content from multiple sources
- Renders components in sequence
- Manages responsive layout and spacing

### Current Section Structure

1. **Bio Panel**: Personal introduction and affiliations (now the opening section)
2. **Research Section**: Featured research papers
3. **Essays Section**: Recent blog posts
4. **Writing Section**: Recent writing pieces
5. **Media Section**: Latest media appearances
6. **Contact Section**: Configurable contact links and information

---

## 2. Content Configuration

### `src/content/homepage/index.yaml`

This YAML file controls all text content and section configuration:

bio:
  title: "Nathan Lane, PhD"
  tagline: "Economics professor, University of Oxford"
  narrative: |
    Assistant Professor of Economics at the University of Oxford. I am empirical economist and data scientist studying how economies change. I am also co-PI of the Industrial Policy Group lab.
  affiliations:
    - title: "Oxford Economics"
      role: "Assistant Professor"
    - title: "Industrial Policy Group"
      role: "Co-Principal Investigator"

contact:
  title: "Contact & Links"
  email: "drnathanlane@gmail.com"
  items:
    - label: "Email"
      href: "mailto:drnathanlane@gmail.com"
      text: "drnathanlane@gmail.com"
    - label: "Research"
      href: "/research/"
      text: "Browse all papers"
    - label: "CV"
      href: "/cv.pdf"
      text: "Download CV"
    - label: "Updates"
      href: "/rss.xml"
      text: "RSS feed"

sections:
  research:
    title: "Research"
    itemCount: 3
    viewAllText: "View all papers"
    viewAllUrl: "/research/"
  essays:
    title: "Recent Essays"
    itemCount: 3
    viewAllText: "View all posts"
    viewAllUrl: "/posts/"
  writing:
    title: "Recent Writing"
    itemCount: 2
    viewAllText: "View all writing"
    viewAllUrl: "/writing/"
  media:
    title: "Recent in the News"
    itemCount: 5
    viewAllText: "View all media"
    viewAllUrl: "/media/"
```

**Configuration Options**:
- **Item counts**: Control how many items appear in each section
- **Section titles**: Customize headings for each area
- **Contact items**: Configurable contact section with flexible links
- **Bio content**: Full markdown support for personal narrative

---

## 3. Component Library

### Layout Components

**`SectionGrid.astro`** - Multi-column grid layouts
```astro
<SectionGrid columns="3" gap="md">
  <!-- Content cards -->
</SectionGrid>
```

**Current column options**:
- `columns="1"`: Single column
- `columns="2"`: Two-column responsive 
- `columns="3"`: Three-column responsive

### Content Components

**`ProjectCard.astro`** - Research paper cards
- Card-based layout with background color
- Title, description, and optional URL
- Uses unified link system for consistent interactions

**`WritingCard.astro`** - Writing piece cards
- Date, title, and excerpt display
- Card-based layout matching project cards
- Responsive typography scaling

**`CompactList.astro`** - Media appearances list
- Minimal list layout
- Title, description, and dates
- Good for dense information display

**`PostPreview.astro`** - Blog post previews
- Two layout modes: compact and with description
- Date and title with optional description
- Consistent with blog system aesthetic

**`ContactBox.astro`** - Contact information
- Boxed layout with page links
- Social media links
- Customizable navigation

---

## 4. Content Sources

### Dynamic Content

**Research Papers** (`src/content/research/`)
```markdown
---
title: "Paper Title"
description: "Brief description"
featured: true  # Shows on homepage
paperDate: "2025"
---
```

**Writing Pieces** (`src/content/writing/`)
```markdown
---
title: "Writing Title"
description: "Description"
publishDate: "2025-01-15"
---
```

**Blog Posts** (`src/content/post/`)
- Automatic sorting by publish date
- Draft filtering
- Configurable display count

**Media Appearances** (`src/data/media.ts`)
```typescript
{
  title: "Interview Title",
  outlet: "Publication Name", 
  date: "2025-01-15",
  link: "https://example.com"
}
```

### Content Filtering

The homepage automatically:
- Shows only `featured: true` research papers
- Sorts writing by publish date (newest first)
- Filters out draft posts
- Limits items based on YAML configuration

---

## 5. Customization Guide

### Adding New Sections

1. **Update YAML Configuration**:
   ```yaml
   sections:
     newSection:
       title: "New Section Title"
       itemCount: 5
       viewAllText: "View all items"
       viewAllUrl: "/new-section/"
   ```

2. **Fetch Content in index.astro**:
   ```astro
   const newSectionData = await getCollection("new-content");
   const filteredItems = newSectionData.slice(0, sections.newSection.itemCount);
   ```

3. **Add Component Rendering**:
   ```astro
   <DocumentSection 
     title={sections.newSection.title}
     viewAllText={sections.newSection.viewAllText}
     viewAllHref={sections.newSection.viewAllUrl}
   >
     {filteredItems.map((item) => (
       <DocumentEntry
         title={item.data.title}
         href={`/new-section/${item.id}/`}
         description={item.data.description}
       />
     ))}
   </DocumentSection>
   ```

### Modifying Layouts

**Single Column Approach** (aligned with aesthetic):
```astro
<!-- Replace SectionGrid with simple div -->
<div class="space-y-6">
  {items.map(item => (
    <article class="border-b border-color-150 pb-4">
      <h4><a href={item.url}>{item.title}</a></h4>
      <p class="text-body-sm">{item.description}</p>
    </article>
  ))}
</div>
```

**Typography-First Cards** (remove backgrounds):
```astro
<article class="space-y-2">
  <h4 class="text-1 font-medium">
    <a href={url} class="inline-link">{title}</a>
  </h4>
  <p class="text-body-sm text-light">{description}</p>
</article>
```

### Responsive Behavior

**Grid Breakpoints**:
- Mobile: Single column (`grid-cols-1`)
- Tablet: Two columns (`sm:grid-cols-2`)
- Desktop: Three columns (`lg:grid-cols-3`)

**Typography Scaling**:
- Uses fluid type scale (`text-0`, `text-1`, etc.)
- Automatic spacing with baseline grid
- Responsive line heights

---

## 6. Aesthetic Alignment

### Current vs. Ideal

**Current Issues**:
- ❌ Multi-column grids break document flow
- ❌ Card backgrounds add visual noise
- ❌ Complex layouts compete with content

**Aligned Approach**:
- ✅ Single-column, typography-first
- ✅ Minimal decoration, maximum content
- ✅ Subtle second column for metadata only

### Typography Hierarchy

**Current System**:
```css
.heading-1  /* 36-41px - Page title */
.heading-2  /* 23-27px - Section titles */
.text-1     /* 19-21px - Feature text */
.text-0     /* 16-17px - Body text */
.text--1    /* 13-14px - Small text */
```

**Spacing System**:
```css
--space-1b  /* 6px - Micro spacing */
--space-2b  /* 12px - Small gaps */
--space-4b  /* 24px - Standard spacing */
--space-6b  /* 36px - Section spacing */
--space-8b  /* 48px - Major sections */
```

---

## 7. Migration Strategy

### To Document-Centric Layout

1. **Replace SectionGrid** with single-column layouts
2. **Remove card backgrounds** from components
3. **Use typography hierarchy** instead of visual decoration
4. **Add margin notes** for secondary information
5. **Implement reading measures** (65ch) for optimal readability

### Example Transformation

**Before** (Card-based):
```astro
<SectionGrid columns="3">
  <ProjectCard title={title} description={description} />
</SectionGrid>
```

**After** (Typography-first):
```astro
<div class="max-w-prose space-y-6">
  <article class="border-b border-color-150 pb-4 last:border-b-0">
    <h4 class="text-1 font-medium mb-2">
      <a href={url} class="inline-link">{title}</a>
    </h4>
    <p class="text-body-sm text-light leading-relaxed">{description}</p>
    <aside class="text-xs text-lightest mt-1">{year}</aside>
  </article>
</div>
```

---

## 8. Performance Considerations

### Content Loading

- **Static content**: YAML configuration loaded at build time
- **Dynamic content**: Collections fetched during SSG
- **Media data**: Static TypeScript file for performance
- **Images**: Optimized through Astro's image pipeline

### Bundle Size

- **Components**: Lightweight, minimal CSS
- **JavaScript**: Only for interactive elements
- **Fonts**: Self-hosted with optimal loading
- **CSS**: Utility-first with minimal custom styles

---

## 9. Maintenance Tasks

### Regular Updates

1. **Content freshness**: Update featured flags on research
2. **Media appearances**: Add new items to `media.ts`
3. **Contact information**: Update contact items in YAML as needed
4. **Bio narrative**: Refresh personal description quarterly

### Configuration Management

1. **Item counts**: Adjust based on content volume in YAML `sections`
2. **Section order**: Modify in `index.astro` template
3. **Contact section**: Easily add/remove items through YAML configuration
4. **Responsive behavior**: Test across device sizes

---

## Related Documentation

- [Bio Panel Guide](./BIO_PANEL_GUIDE.md) - Bio component configuration
- [Blog System Guide](./BLOG_GUIDE.md) - Blog post management
- [Design System](./DESIGN_SYSTEM.md) - Typography and spacing system
- [Webmaster Guide](./WEBMASTER_GUIDE.md) - Deployment and maintenance

---

The homepage system provides flexibility while maintaining design consistency. Focus on content quality and let the typography system handle the visual presentation according to your document-centric aesthetic principles. 