# Typography Documentation

A comprehensive guide to the semantic typography system built on fluid scaling, baseline grid alignment, and typographic best practices.

## Overview

This typography system combines:
- **Fluid Type Scale**: Responsive typography using clamp() functions via `tailwindcss-fluid-type`
- **Semantic Classes**: Intent-based naming instead of size-based naming
- **Baseline Grid**: 4px baseline grid for consistent vertical rhythm
- **Typography Principles**: Based on research from Tim Brown, Jost Hochuli, and Matthew Butterick

## Semantic Heading Classes

### Available Classes

| Class | Font Size | Font Family | Font Weight | Use Case |
|-------|-----------|-------------|-------------|----------|
| `.heading-1` | `text-fluid-4` (2.29–2.59rem) | Newsreader | 400 | Page titles, hero headings |
| `.heading-2` | `text-fluid-2` (1.46–1.66rem) | Newsreader | 400 | Section headings |
| `.heading-3` | `text-fluid-1` (1.17–1.33rem) | IBM Plex Sans | 500 | Subsection headings |
| `.heading-4` | `text-1` (1.17–1.33rem) | IBM Plex Sans | 500 | Content headings |
| `.heading-5` | `text-0` (0.94–1.06rem) | IBM Plex Sans | 500 | Small headings |
| `.heading-6` | `text--1` (0.80–0.90rem) | IBM Plex Sans | 600 | Micro headings, uppercase |

### Spacing System

All heading classes include built-in spacing optimized for readability:

```css
/* Heading 1 */
.heading-1 {
  margin-bottom: 0.5rem; /* 2b - tight coupling with content */
  margin-top: 0; /* No top margin by default */
  scroll-margin-top: 4rem; /* Anchor link offset */
}

/* Heading 2 */
.heading-2 {
  margin-bottom: 0.5rem; /* 2b */
  margin-top: 2rem; /* 8b - clear section break */
  scroll-margin-top: 4rem;
}

/* Heading 3 */
.heading-3 {
  margin-bottom: 0.5rem; /* 2b */
  margin-top: 1.5rem; /* 6b - moderate section break */
  scroll-margin-top: 4rem;
}
```

## Body Text Classes

### Primary Text Classes

| Class | Font Size | Line Height | Use Case |
|-------|-----------|-------------|----------|
| `.text-body` | `text-0` (0.94–1.06rem) | 1.6 | Primary body text |
| `.text-body-sm` | `text--1` (0.80–0.90rem) | 1.5 | Secondary text, captions |
| `.text-lead` | `text-1` (1.17–1.33rem) | 1.45 | Introduction paragraphs |

### Specialized Text Classes

| Class | Font Size | Style | Use Case |
|-------|-----------|-------|----------|
| `.text-meta` | `text--1` | Uppercase, letter-spacing | Metadata, dates, tags |
| `.text-caption` | `text--1` | Italic, light color | Image captions, footnotes |
| `.text-quote` | `text-1` | Serif, italic | Pull quotes, blockquotes |

## Reading Measure Guidelines

Optimal line length for readability based on Jost Hochuli's research:

| Class | Max Width | Character Count | Use Case |
|-------|-----------|-----------------|----------|
| `.measure-narrow` | `45ch` | ~45 characters | Sidebars, narrow columns |
| `.measure-base` | `65ch` | ~65 characters | **Optimal for body text** |
| `.measure-wide` | `80ch` | ~80 characters | Wide layouts, technical content |
| `.measure-full` | `none` | Unlimited | Full-width content |

### Usage Examples

```html
<!-- Optimal reading experience -->
<article class="measure-base">
  <h1 class="heading-1">Article Title</h1>
  <p class="text-lead">Introduction paragraph with larger text...</p>
  <p class="text-body">Regular body content...</p>
</article>

<!-- Narrow sidebar content -->
<aside class="measure-narrow">
  <h3 class="heading-4">Related Links</h3>
  <p class="text-body-sm">Supporting information...</p>
</aside>
```

## Baseline Grid System

All typography aligns to a 4px baseline grid for consistent vertical rhythm:

| Token | Value | Usage |
|-------|-------|-------|
| `1b` | `0.25rem` (4px) | Micro-spacing, fine adjustments |
| `2b` | `0.5rem` (8px) | Small gaps, heading bottom margins |
| `4b` | `1rem` (16px) | Paragraph spacing, component padding |
| `6b` | `1.5rem` (24px) | Medium gaps between sections |
| `8b` | `2rem` (32px) | Large gaps before major headings |

### Spacing Rules

```css
/* Paragraph spacing */
p + p { margin-top: 1rem; } /* 4b */

/* Heading spacing */
h2 { 
  margin-top: 2rem; /* 8b - before */
  margin-bottom: 0.5rem; /* 2b - after */
}

/* Section spacing */
section { 
  padding-top: 3rem; /* 12b */
  padding-bottom: 3rem; /* 12b */
}
```

## Migration Guide

### From Direct HTML Elements

**Before:**
```html
<h1>Page Title</h1>
<h2>Section Heading</h2>
<p>Body text content</p>
```

**After:**
```html
<h1 class="heading-1">Page Title</h1>
<h2 class="heading-2">Section Heading</h2>
<p class="text-body">Body text content</p>
```

### From Size-Based Classes

**Before:**
```html
<h1 class="text-4xl font-bold">Hero Title</h1>
<h2 class="text-2xl font-semibold">Section</h2>
<p class="text-lg">Lead paragraph</p>
<p class="text-base">Body text</p>
```

**After:**
```html
<h1 class="heading-1">Hero Title</h1>
<h2 class="heading-2">Section</h2>
<p class="text-lead">Lead paragraph</p>
<p class="text-body">Body text</p>
```

### From Custom Font Sizing

**Before:**
```css
.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}
```

**After:**
```html
<h1 class="heading-1">Hero Title</h1>
<!-- All styling handled by semantic class -->
```

## Component Usage Examples

### Blog Post Layout

```html
<article class="measure-base">
  <header>
    <p class="text-meta">Published January 15, 2024</p>
    <h1 class="heading-1">Typography in Modern Web Design</h1>
    <p class="text-lead">An exploration of fluid typography and its impact on reading experience.</p>
  </header>
  
  <div class="content-spacing">
    <h2 class="heading-2">The Foundation of Good Typography</h2>
    <p class="text-body">Typography is the cornerstone of effective communication...</p>
    
    <h3 class="heading-3">Fluid Type Scales</h3>
    <p class="text-body">Modern responsive design requires typography that adapts...</p>
    
    <blockquote class="text-quote">
      "Typography is the craft of endowing human language with a durable visual form."
    </blockquote>
  </div>
</article>
```

### Card Component

```html
<div class="card measure-narrow">
  <h3 class="heading-4">Project Title</h3>
  <p class="text-body-sm">Brief description of the project and its key features.</p>
  <p class="text-meta">Design System</p>
</div>
```

### Navigation

```html
<nav>
  <h2 class="heading-5">Table of Contents</h2>
  <ul>
    <li><a href="#intro" class="text-body">Introduction</a></li>
    <li><a href="#principles" class="text-body">Design Principles</a></li>
    <li><a href="#implementation" class="text-body">Implementation</a></li>
  </ul>
</nav>
```

## Best Practices

### 1. Use Semantic Classes

**✅ Do:**
```html
<h2 class="heading-2">Section Title</h2>
<p class="text-lead">Introduction paragraph</p>
<p class="text-body">Regular content</p>
```

**❌ Don't:**
```html
<h2 class="text-2xl font-bold">Section Title</h2>
<p class="text-lg">Introduction paragraph</p>
<p class="text-base">Regular content</p>
```

### 2. Respect Reading Measures

**✅ Do:**
```html
<article class="measure-base">
  <p class="text-body">Optimal line length for reading...</p>
</article>
```

**❌ Don't:**
```html
<p class="text-body">Very long lines that stretch across the entire viewport making it difficult to read and causing eye strain...</p>
```

### 3. Maintain Baseline Grid

**✅ Do:**
```html
<section class="py-8b"> <!-- Uses baseline grid -->
  <h2 class="heading-2">Section</h2> <!-- Built-in spacing -->
  <p class="text-body">Content follows grid...</p>
</section>
```

**❌ Don't:**
```html
<section style="padding: 33px 0;"> <!-- Arbitrary spacing -->
  <h2 style="margin: 17px 0 9px;">Section</h2>
  <p>Content breaks grid alignment...</p>
</section>
```

### 4. Use Context-Appropriate Typography

**✅ Do:**
```html
<!-- Hero section -->
<h1 class="heading-1">Welcome</h1>

<!-- Content section -->
<h2 class="heading-2">About</h2>

<!-- Sidebar -->
<h3 class="heading-4">Quick Links</h3>
```

**❌ Don't:**
```html
<!-- All the same size -->
<h1 class="heading-2">Welcome</h1>
<h2 class="heading-2">About</h2>
<h3 class="heading-2">Quick Links</h3>
```

## Accessibility Features

### Built-in Accessibility

All semantic classes include accessibility improvements:

```css
.heading-1, .heading-2, .heading-3, .heading-4, .heading-5, .heading-6 {
  scroll-margin-top: 4rem; /* Anchor link offset */
}
```

### Screen Reader Optimization

- Semantic HTML elements maintain meaning
- Proper heading hierarchy preserved
- Font features optimized for legibility
- Sufficient color contrast maintained

### Text Rendering Optimization

```css
/* Applied to all heading classes */
text-rendering: optimizeLegibility;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
```

## Development Guidelines

### Component Development

When creating new components:

1. **Start with semantic classes**
2. **Test with various content lengths**
3. **Verify baseline grid alignment**
4. **Check both light and dark themes**

```html
<!-- Good component structure -->
<div class="component-spacing">
  <h3 class="heading-4">Component Title</h3>
  <p class="text-body measure-base">Description content...</p>
  <p class="text-meta">Additional metadata</p>
</div>
```

### Testing Typography

```bash
# Development server
pnpm dev

# Build and preview
pnpm build && pnpm preview
```

Test checklist:
- [ ] All viewport sizes (320px to 1280px)
- [ ] Light and dark themes
- [ ] Long and short content
- [ ] Reading flow and hierarchy
- [ ] Baseline grid alignment (use `.show-grid` utility)

### Debug Helpers

```html
<!-- Show baseline grid during development -->
<body class="show-grid">
  <!-- Content -->
</body>
```

## Technical Implementation

### Fluid Type Scale

Generated using `tailwindcss-fluid-type` plugin:

```javascript
// tailwind.config.ts
fluidType({
  minScreen: "320px",
  maxScreen: "1280px",
  textSizes: {
    "-2": { minSize: "0.64rem", maxSize: "0.72rem", lineHeight: "1.45" },
    "-1": { minSize: "0.80rem", maxSize: "0.90rem", lineHeight: "1.50" },
    "0": { minSize: "0.94rem", maxSize: "1.06rem", lineHeight: "1.60" },
    // ... additional sizes
  }
})
```

### CSS Custom Properties

All classes use CSS custom properties for theme consistency:

```css
.heading-1 {
  color: var(--theme-accent-base);
  font-family: var(--font-headline);
}

.text-body {
  color: var(--theme-text);
  font-family: var(--font-sans);
}
```

### Component Definition

```css
.heading-1 {
  @apply text-fluid-4 font-headline font-normal text-accent-base mb-2b mt-0;
  scroll-margin-top: 4rem;
}
```

## Browser Support

- **Modern browsers**: Full support with fluid scaling
- **Safari**: Optimized font rendering
- **Older browsers**: Graceful degradation with fallback fonts
- **Print**: Optimized print styles maintained

## Performance Considerations

- **Font loading**: Optimized with `font-display: swap`
- **CSS size**: Semantic classes reduce custom CSS
- **Layout shifts**: Prevented with consistent spacing
- **Variable fonts**: Used for Newsreader headlines

## Related Documentation

- [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - Complete design system overview
- [CLAUDE.md](../CLAUDE.md) - Development guidelines and project context
- [tailwind.config.ts](../tailwind.config.ts) - Technical implementation
- [src/styles/global.css](../src/styles/global.css) - Base typography styles