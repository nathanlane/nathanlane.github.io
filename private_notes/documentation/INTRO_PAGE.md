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
const { hero, bio, currentProjects, contact, showcase, posts } = homepageContent.data;

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

1. **Hero Section**: Title, description, social links, and CTA buttons
2. **Bio Panel**: Personal introduction and affiliations
3. **Current Work & Contact**: Two-column layout with projects and contact info
4. **Component Showcase**: Research papers, writing samples, media appearances
5. **Posts Section**: Recent blog posts list

---

## 2. Content Configuration

### `src/content/homepage/index.yaml`

This YAML file controls all text content and section configuration:

```yaml
hero:
  title: "Nathan Lane, PhD"
  description: "Assistant Professor of Economics..."
  buttons:
    - text: "Research"
      href: "/research/"
      variant: "primary"

bio:
  title: "Nathan Lane, PhD"
  tagline: "Empirical economist, professor..."
  narrative: |
    I'm an Assistant Professor of Economics...
  affiliations:
    - title: "Oxford Economics"
      role: "Assistant Professor"

currentProjects:
  title: "Current Projects"
  projects:
    - title: "Research Papers"
      description: "My research papers."
      url: "/research/"

showcase:
  title: "What I'm Working On"
  contentSections:
    research:
      title: "Recent Papers"
      itemCount: 3
    writing:
      title: "Recent Writing" 
      itemCount: 2
    media:
      title: "Recent Media"
      itemCount: 5

posts:
  title: "Posts"
  maxPosts: 10
```

**Configuration Options**:
- **Item counts**: Control how many items appear in each section
- **Section titles**: Customize headings for each area
- **Button configuration**: Hero CTA buttons with variants
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
- Hover effects and transitions

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
   showcase:
     contentSections:
       newSection:
         title: "New Section Title"
         itemCount: 5
   ```

2. **Fetch Content in index.astro**:
   ```astro
   const newSectionData = await getCollection("new-content");
   const filteredItems = newSectionData.slice(0, newSectionConfig.itemCount);
   ```

3. **Add Component Rendering**:
   ```astro
   <div class="mb-4b">
     <h3>{newSectionConfig.title}</h3>
     <!-- Render items -->
   </div>
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
3. **Project descriptions**: Keep current projects section updated
4. **Bio narrative**: Refresh personal description quarterly

### Configuration Management

1. **Item counts**: Adjust based on content volume
2. **Section order**: Modify in `index.astro` template
3. **Display options**: Toggle sections via YAML configuration
4. **Responsive behavior**: Test across device sizes

---

## Related Documentation

- [Bio Panel Guide](./BIO_PANEL_GUIDE.md) - Bio component configuration
- [Blog System Guide](./BLOG_GUIDE.md) - Blog post management
- [Design System](./DESIGN_SYSTEM.md) - Typography and spacing system
- [Webmaster Guide](./WEBMASTER_GUIDE.md) - Deployment and maintenance

---

The homepage system provides flexibility while maintaining design consistency. Focus on content quality and let the typography system handle the visual presentation according to your document-centric aesthetic principles. 