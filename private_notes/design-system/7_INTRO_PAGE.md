# Homepage Redesign: Document-Centric Implementation Plan

## Executive Summary

This plan transforms the current homepage from a multi-column, card-based layout to a **single-column document** that feels like a carefully curated academic journal or research publication. Following Craig Mod's editorial principles and our established design system, we eliminate all boxes, backgrounds, and decorative elements in favor of pure typography and generous whitespace.

## Design Philosophy Alignment

### Core Principles from 0_AESTHETIC_SITE.md

1. **Document-Centric**: The homepage becomes a single, flowing document rather than a website landing page
2. **Text-First**: Typography and content hierarchy drive all visual decisions
3. **Minimal**: Remove all visual containers, borders, backgrounds, and decorative elements
4. **Calm-Editorial**: Create reading-focused experience with generous whitespace
5. **Typographic**: Use font size, weight, and spacing for all emphasis and organization
6. **Single Column**: Primary content flows vertically with optional margin notes

### Inspiration Sources

- **Craig Mod Essays**: Single-column, typography-first layouts
- **Academic Journals**: Table of contents style organization
- **Swiss Typography**: Mathematical precision in spacing and hierarchy
- **Gwern.net**: Minimalist, content-focused design
- **Linear.app**: Clean, typography-driven interface

## Current State Analysis

### Elements to Remove
- **SectionGrid.astro**: Multi-column card grids
- **ProjectCard.astro**: Box-based project displays
- **WritingCard.astro**: Card layouts for writing pieces
- **ResearchCard.astro**: Research paper cards
- **ContactBox.astro**: Boxed contact information
- All `bg-color-*`, `rounded-lg`, `shadow-*` styling
- Grid-based layouts with visual containers

### Elements to Transform
- **CompactList.astro**: Minimal already, needs typography refinement
- **PostPreview.astro**: Strip boxes, use pure typography
- **BioPanel.astro**: Maintain but ensure single-column integration
- Section headers: Convert to document-style headings

## New Component Architecture

### 1. DocumentEntry.astro
Replace all card components with a unified document entry:

```astro
---
interface Props {
  title: string;
  href: string;
  type: 'research' | 'writing' | 'project' | 'post';
  date?: string;
  status?: 'published' | 'working-paper' | 'in-progress';
  description: string;
  metadata?: string;
}
---

<article class="document-entry">
  <h3 class="entry-title">
    <a href={href} class="feature-link">{title}</a>
  </h3>
  
  <div class="entry-metadata">
    {type.toUpperCase()} • {date} 
    {status && `• ${status.toUpperCase()}`}
    {metadata && `• ${metadata}`}
  </div>
  
  <p class="entry-description">{description}</p>
</article>
```

**CSS Implementation:**
```css
.document-entry {
  margin-bottom: var(--space-8); /* 48px - generous separation */
}

.entry-title {
  font-family: var(--font-newsreader);
  font-size: var(--step-1); /* 18.8-21.3px */
  font-weight: 400;
  letter-spacing: -0.015em;
  margin-bottom: var(--space-1); /* 6px - tight coupling */
  line-height: 1.3;
}

.entry-metadata {
  font-family: var(--font-sans);
  font-size: var(--step--1); /* 12.8-14.4px */
  font-variant: small-caps;
  letter-spacing: 0.075em;
  color: var(--theme-color-600);
  margin-bottom: var(--space-2); /* 12px */
  font-weight: 500;
}

.entry-description {
  font-size: var(--step-0); /* 15.6-17px */
  line-height: 1.6;
  color: var(--theme-text);
  margin-bottom: 0;
}
```

### 2. DocumentSection.astro
Replace section grids with flowing document sections:

```astro
---
interface Props {
  title: string;
  viewAllText?: string;
  viewAllHref?: string;
}
---

<section class="document-section">
  <header class="section-header">
    <h2 class="section-title">{title}</h2>
    {viewAllHref && (
      <a href={viewAllHref} class="section-link">{viewAllText}</a>
    )}
  </header>
  
  <div class="section-content">
    <slot />
  </div>
</section>
```

**CSS Implementation:**
```css
.document-section {
  margin-bottom: var(--space-16); /* 96px - major section break */
}

.section-header {
  margin-bottom: var(--space-8); /* 48px */
}

.section-title {
  font-family: var(--font-newsreader);
  font-size: var(--step-2); /* 23.4-26.6px */
  font-weight: 400;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-3); /* 18px */
  line-height: 1.25;
}

.section-link {
  font-family: var(--font-sans);
  font-size: var(--step--1); /* 12.8-14.4px */
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--theme-color-600);
  text-decoration: none;
  font-weight: 500;
}

.section-content {
  /* Single column flow */
  max-width: none; /* Let content flow naturally */
}
```

### 3. MediaList.astro
Refine media appearances to document style:

```astro
---
interface Props {
  items: Array<{
    title: string;
    outlet: string;
    date: string;
    type: string;
    link: string;
  }>;
}
---

<div class="media-list">
  {items.map(item => (
    <div class="media-entry">
      <h4 class="media-title">
        <a href={item.link} class="inline-link">{item.title}</a>
      </h4>
      <div class="media-source">
        {item.outlet} • {item.type.toUpperCase()} • {item.date}
      </div>
    </div>
  ))}
</div>
```

**CSS Implementation:**
```css
.media-entry {
  margin-bottom: var(--space-4); /* 24px - baseline */
}

.media-title {
  font-family: var(--font-sans);
  font-size: var(--step-0); /* 15.6-17px */
  font-weight: 450;
  margin-bottom: var(--space-1); /* 6px */
  line-height: 1.4;
}

.media-source {
  font-family: var(--font-sans);
  font-size: var(--step--1); /* 12.8-14.4px */
  color: var(--theme-color-600);
  font-variant: small-caps;
  letter-spacing: 0.05em;
}
```

### 4. ContactInfo.astro
Transform contact box to inline information:

```astro
<div class="contact-info">
  <h3 class="contact-title">Contact & Links</h3>
  
  <div class="contact-details">
    <div class="contact-item">
      <span class="contact-label">Email</span>
      <a href="mailto:nathanlane@example.com" class="inline-link">nathanlane@example.com</a>
    </div>
    
    <div class="contact-item">
      <span class="contact-label">Research</span>
      <a href="/research/" class="inline-link">Browse all papers</a>
    </div>
    
    <div class="contact-item">
      <span class="contact-label">Updates</span>
      <a href="/rss.xml" class="inline-link">RSS feed</a>
    </div>
  </div>
</div>
```

**CSS Implementation:**
```css
.contact-info {
  margin-bottom: var(--space-12); /* 72px */
}

.contact-title {
  font-family: var(--font-newsreader);
  font-size: var(--step-1); /* 18.8-21.3px */
  font-weight: 400;
  margin-bottom: var(--space-4); /* 24px */
}

.contact-item {
  margin-bottom: var(--space-2); /* 12px */
  display: flex;
  gap: var(--space-2); /* 12px */
  align-items: baseline;
}

.contact-label {
  font-family: var(--font-sans);
  font-size: var(--step--1); /* 12.8-14.4px */
  font-variant: small-caps;
  letter-spacing: 0.075em;
  color: var(--theme-color-600);
  min-width: 4rem; /* Align labels */
}
```

## Layout Structure Transformation

### New Homepage Layout (index.astro)

```astro
---
// Fetch content collections
const featuredResearch = await getCollection('research', ({ data }) => data.featured);
const recentPosts = await getCollection('post');
const recentWriting = await getCollection('writing');
const mediaData = await getMediaData();
---

<Layout title="Nathan Lane">
  <div class="homepage-document">
    
    <!-- Masthead Introduction -->
    <header class="document-masthead">
      <h1 class="site-title">Nathan Lane</h1>
      <p class="site-description">
        Economist exploring industrial policy, development, and the 
        intersection of technology and institutional change. Based in Oxford, 
        working with data and ideas to understand how societies organize 
        economic transformation.
      </p>
    </header>

    <!-- Research Section -->
    <DocumentSection title="Research" viewAllText="View all papers" viewAllHref="/research/">
      {featuredResearch.map(paper => (
        <DocumentEntry
          title={paper.data.title}
          href={`/research/${paper.slug}/`}
          type="research"
          date={paper.data.paperDate}
          status={paper.data.status}
          description={paper.data.description}
          metadata={paper.data.authors}
        />
      ))}
    </DocumentSection>

    <!-- Recent Essays -->
    <DocumentSection title="Recent Essays" viewAllText="View all posts" viewAllHref="/posts/">
      {recentPosts.slice(0, 3).map(post => (
        <DocumentEntry
          title={post.data.title}
          href={`/posts/${post.slug}/`}
          type="post"
          date={post.data.publishDate}
          description={post.data.description}
        />
      ))}
    </DocumentSection>

    <!-- Writing -->
    <DocumentSection title="Writing" viewAllText="View all writing" viewAllHref="/writing/">
      {recentWriting.slice(0, 2).map(piece => (
        <DocumentEntry
          title={piece.data.title}
          href={`/writing/${piece.slug}/`}
          type="writing"
          date={piece.data.publishDate}
          description={piece.data.description}
        />
      ))}
    </DocumentSection>

    <!-- Media & Appearances -->
    <DocumentSection title="Media & Appearances">
      <MediaList items={mediaData.slice(0, 5)} />
    </DocumentSection>

    <!-- Contact Information -->
    <ContactInfo />
    
  </div>
</Layout>
```

### Master CSS for Homepage Document

```css
/* Homepage document container */
.homepage-document {
  max-width: 65ch; /* Optimal reading measure */
  margin: 0 auto;
  padding: var(--space-8) var(--space-4); /* 48px 24px */
}

/* Document masthead */
.document-masthead {
  margin-bottom: var(--space-16); /* 96px - major break */
}

.site-title {
  font-family: var(--font-newsreader);
  font-size: var(--step-3); /* 29.3-33.2px */
  font-weight: 400;
  letter-spacing: -0.025em;
  margin-bottom: var(--space-4); /* 24px */
  line-height: 1.2;
}

.site-description {
  font-size: var(--step-1); /* 18.8-21.3px */
  line-height: 1.6;
  color: var(--theme-text);
  margin-bottom: 0;
  font-weight: 300;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .homepage-document {
    padding: var(--space-6) var(--space-3); /* 36px 18px */
  }
  
  .site-title {
    font-size: var(--step-2); /* Smaller on mobile */
  }
  
  .site-description {
    font-size: var(--step-0); /* Standard body size */
  }
}

/* Dark mode adjustments */
[data-theme="dark"] .site-title {
  font-weight: 425; /* Slightly heavier for dark mode */
}

[data-theme="dark"] .site-description {
  color: var(--theme-color-100);
}
```

## Implementation Phases

### Phase 1: Component Creation (Week 1)
- [x] Create `DocumentEntry.astro` component
- [x] Create `DocumentSection.astro` component
- [x] Create `MediaList.astro` component
- [x] Create `ContactInfo.astro` component
- [x] Define CSS for all new components

### Phase 2: Homepage Transformation (Week 2)
- [ ] Replace existing `index.astro` layout
- [ ] Remove all card-based components from homepage
- [ ] Implement single-column document flow
- [ ] Update content fetching logic
- [ ] Test responsive behavior

### Phase 3: Integration & Refinement (Week 3)
- [ ] Ensure BioPanel integration
- [ ] Refine typography spacing
- [ ] Test across all breakpoints
- [ ] Optimize performance
- [ ] Document component usage

## Quality Assurance Checklist

### Design Principles Compliance
- [ ] **Single Column**: No multi-column grids or card layouts
- [ ] **Typography-First**: All hierarchy through font size/weight only
- [ ] **No Containers**: Zero background colors, borders, or rounded corners
- [ ] **Document Flow**: Content flows like a single document
- [ ] **Generous Whitespace**: Ample spacing between sections
- [ ] **Reading Optimized**: 65ch measure maintained

### Technical Validation
- [ ] **Grid Alignment**: All spacing uses `--space-*` tokens
- [ ] **Baseline Rhythm**: Typography aligns to 6px grid
- [ ] **Accessibility**: Proper heading hierarchy and contrast
- [ ] **Performance**: No layout shift, fast loading
- [ ] **Responsive**: Works from 320px to 1920px+

### Content Integration
- [ ] **Dynamic Content**: Fetches from content collections correctly
- [ ] **Link Structure**: All internal links work properly
- [ ] **SEO Metadata**: Proper meta tags and structured data
- [ ] **RSS Integration**: Links to feeds work correctly

## Success Metrics

1. **Visual Calm**: Homepage feels like reading a carefully crafted document
2. **Content Focus**: Reader attention goes to text, not visual elements  
3. **Navigation Clarity**: Clear hierarchy guides user through sections
4. **Performance**: No visual containers means faster rendering
5. **Maintainability**: Simple components are easier to update and modify

This transformation creates a homepage that truly embodies the "calm-editorial" aesthetic while providing all necessary functionality through pure typography and thoughtful content organization. 