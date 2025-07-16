# Design System Documentation
## Current Implementation: `tailwindcss-fluid-type` Plugin

The design system now uses the `tailwindcss-fluid-type` plugin for all typography scaling. The standalone `src/styles/utopia.css` has been removed.

### Quick Token Reference

| Utility | Output (min→max) | Typical use |
|---------|------------------|-------------|
| `text--2` | 10-11px | Small text, captions |
| `text--1` | 12-14px | Secondary text |
| `text-0` | 15-17px | Body text |
| `text-1` | 18-21px | Large text |
| `text-2` | 23-26px | H4-H5 headings |
| `text-3` | 29-33px | H3 headings |
| `text-4` | 37-41px | H2 headings |
| `text-5` | 46-52px | H1 headings |
| `text-6` | 58-65px | Display text |

### Baseline Grid Utilities

| Utility | Value | Use case |
|---------|-------|----------|
| `1b` | 6px | Micro-spacing |
| `2b` | 12px | Small gaps |
| `3b` | 18px | Component spacing |
| `4b` | 24px | Paragraph/baseline spacing |
| `5b` | 30px | Section spacing |
| `8b` | 48px | Large gaps |
| `10b` | 60px | Major sections |
| `12b` | 72px | Hero/footer spacing |

## Typography System Overview

This design system implements a fluid type scale based on typography principles from:
- **Tim Brown's "Flexible Typesetting"**: Fluid type, modular ratios, baseline grids
- **Jost Hochuli's "Detail in Typography"**: 60-70ch line length, 120-140% leading, optical spacing

### Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Viewport Range** | 320px → 1280px | Mobile-first to desktop range |
| **Type Ratio** | 1.25 (Major Third) | Musical interval per Tim Brown's principles |
| **Type Steps** | -2 to 6 | 9 total steps for comprehensive hierarchy |
| **Space Steps** | 1 to 6 | Consistent spatial rhythm |
| **Base Font Size** | 15px → 17px | Reduced for better readability |
| **Body Line Height** | 1.35 (135%) | Middle of Hochuli's 120-140% range |
| **Heading Line Height** | 1.05–1.2 | Tighter leading for display sizes (Hochuli) |
| **Optimal Line Length** | 65ch | Within Hochuli's 60-70ch recommendation |

### Type Scale

| Step | Min (320px) | Max (1280px) | Usage | Line Height |
|------|-------------|--------------|-------|-------------|
| `-2` | 10.24px | 11.52px | Small text, captions | 1.35 |
| `-1` | 12.80px | 14.40px | Secondary text | 1.35 |
| `0` | 15.00px | 17.00px | Body text (base) | 1.6 |
| `1` | 20.00px | 22.50px | Large text, H4 | 1.2 |
| `2` | 25.00px | 28.13px | H3 headings | 1.2 |
| `3` | 31.25px | 35.16px | H2 headings | 1.15 |
| `4` | 39.06px | 43.95px | H1 headings | 1.1 |
| `5` | 48.83px | 54.93px | Display headings | 1.1 |
| `6` | 61.04px | 68.66px | Hero text | 1.05 |

#### Spacing Configuration
```css
/* src/styles/global.css */
:root {
  /* Grid System Foundation */
  --baseline: 1.5rem; /* 24px = 16px × 1.5 */
  --grid-unit: 0.375rem; /* 6px = 24px ÷ 4 */
  
  /* Spacing Scale */
  --space-1: calc(var(--grid-unit) * 1);   /* 6px */
  --space-2: calc(var(--grid-unit) * 2);   /* 12px */
  --space-3: calc(var(--grid-unit) * 3);   /* 18px */
  --space-4: calc(var(--grid-unit) * 4);   /* 24px */
  --space-6: calc(var(--grid-unit) * 6);   /* 36px */
  --space-8: calc(var(--grid-unit) * 8);   /* 48px */
  --space-10: calc(var(--grid-unit) * 10); /* 60px */
  --space-12: calc(var(--grid-unit) * 12); /* 72px */
  --space-16: calc(var(--grid-unit) * 16); /* 96px */
  --space-24: calc(var(--grid-unit) * 24); /* 144px */
}
```

```typescript
// tailwind.config.ts
spacing: {
  '1': 'var(--space-1)',
  '2': 'var(--space-2)',
  '3': 'var(--space-3)',
  '4': 'var(--space-4)',
  '6': 'var(--space-6)',
  '8': 'var(--space-8)',
  '10': 'var(--space-10)',
  '12': 'var(--space-12)',
  '16': 'var(--space-16)',
  '24': 'var(--space-24)',
}

### Spacing Rules

Optimized vertical rhythm based on typography research:

#### Content Spacing
- **Between paragraphs**: `var(--space-paragraph)` → `space-s-m` (16-18px → 24-27px)
  - Uses space pair for proportional scaling
  - Provides comfortable reading rhythm

- **Before headings**: `var(--space-heading-before)` → `space-l-xl` (32-36px → 48-54px)
  - H1-H3: Full spacing for major section breaks
  - H4-H6: `space-l` (32-36px) for sub-sections
  
- **After headings**: `var(--space-heading-after)` → `space-2xs-xs` (8-9px → 12-13.5px)
  - Tight coupling with following content
  - Clear visual hierarchy

#### Component & Section Spacing
- **Component padding**: `var(--space-component-padding)` → `space-s-m`
- **Between components**: `var(--space-component-gap)` → `space-m-l`
- **Section spacing**: `var(--space-section)` → `space-xl-2xl` (48-54px → 64-72px)
- **Major sections**: `var(--space-section-large)` → `space-2xl-3xl` (64-72px → 96-108px)

#### List & Block Elements
- **List item spacing**: `var(--space-list-item)` → `space-3xs` (4-4.5px)
  - Minimal spacing for better visual grouping
- **Nested lists**: `space-2xs` top/bottom margins
- **Blockquotes**: `space-l` vertical margins, `space-component-padding` internal
- **Code blocks**: `space-m` vertical margins
- **Horizontal rules**: `space-xl` vertical margins for clear section breaks

### Semantic Aliases

Use semantic names for clearer intent:

```css
/* Instead of arbitrary values */
.card { padding: var(--space-s-m); }

/* Use semantic aliases */
.card { padding: var(--space-component-padding); }
```

### Implementation

#### CSS Variables

All fluid values are defined in `/src/styles/utopia.css`:

```css
/* Type scale example */
--step-0: clamp(1.25rem, 1.20rem + 0.21vw, 1.41rem);

/* Space scale example */
--space-1: clamp(1.25rem, 1.20rem + 0.21vw, 1.41rem);
```

#### Tailwind Classes

Access via Tailwind utilities:

```html
<!-- Typography -->
<h1 class="text-4">Main Heading</h1>
<p class="text-0">Body text with optimal line height</p>
<small class="text--2">Small caption text</small>

<!-- Spacing with semantic aliases -->
<article class="py-section">
  <h2 class="mb-heading-after">Section Title</h2>
  <p class="mb-paragraph">First paragraph with automatic spacing.</p>
  <p>Second paragraph inherits spacing from CSS rules.</p>
</article>

<!-- Component examples -->
<div class="p-component gap-component-gap">
  <div class="card">Card with component padding</div>
  <div class="card">Another card with consistent spacing</div>
</div>

<!-- Button with semantic spacing -->
<button class="px-button-x py-button-y">
  Well-spaced button
</button>

<!-- Section variations -->
<section class="py-section">Regular section</section>
<section class="py-section-large">Major section like hero or footer</section>

<!-- Flexible space pairs for responsive components -->
<div class="p-space-s-m">Scales from 16px to 27px padding</div>
<div class="mt-space-l-xl">Scales from 32px to 54px top margin</div>

<!-- Line length constraint -->
<article class="max-w-prose">
  Content constrained to ~65 characters for optimal readability
</article>
```

### How to Modify the Scale

To adjust the type scale:

1. **Change the ratio**: Edit the calculations in `/src/styles/utopia.css`
2. **Add more steps**: Add new CSS variables following the naming pattern
3. **Update Tailwind**: Add corresponding entries in `tailwind.config.ts`

Example of adding a new step:
```css
/* In utopia.css */
--step-7: clamp(5.96rem, 5.72rem + 1.00vw, 6.70rem);

/* In tailwind.config.ts */
fontSize: {
  '7': ['var(--step-7)', '1.05'],
}
```

### Typography Principles Applied

1. **Fluid Scaling** (Tim Brown)
   - Type scales smoothly between breakpoints
   - No jarring jumps at media queries
   - Maintains proportional relationships

2. **Optimal Measure** (Jost Hochuli)
   - `max-w-prose` enforces ~65ch line length
   - Prevents reader fatigue from long lines
   - Improves reading comprehension

3. **Proportional Leading** (Hochuli)
   - Body text: 135% for comfortable reading
   - Headings: 105-120% for visual density
   - Automatically adjusts with font size

4. **Modular Scale** (Brown)
   - 1.25 ratio creates harmonious hierarchy
   - Musical interval (major third) for pleasing proportions
   - Consistent rhythm throughout design

### Baseline Grid

A baseline grid helper is included for development:

```css
/* Enable in utopia.css by uncommenting */
.baseline-grid {
  background-image: linear-gradient(
    to bottom,
    hsla(200, 100%, 50%, 0.3) 0,
    transparent 1px
  );
  background-size: 100% 1.35rem;
}
```

Apply to `<body>` during development to verify vertical rhythm alignment.

### Future Enhancements

- **Hyphenation**: Can be enabled via CSS `hyphens` property or Hyphenopoly.js
- **Optical Sizing**: Variable fonts could provide size-specific adjustments
- **Custom Properties**: Additional ratios for specific content types

## Typography System

### Font Families

- **Headlines**: Newsreader (variable font, weights 300-500)
- **Body**: IBM Plex Sans (weights 300, 400, 600)  
- **Prose**: IBM Plex Serif
- **Code**: System mono stack

### Semantic Typography Classes

The design system now uses semantic typography classes instead of size-based naming. This improves maintainability and provides better semantic meaning.

#### Heading Classes

| Class | Font Size | Font Family | Weight | Use Case |
|-------|-----------|-------------|--------|----------|
| `.heading-1` | `text-fluid-4` | Newsreader | 400 | Page titles, hero headings |
| `.heading-2` | `text-fluid-2` | Newsreader | 400 | Section headings |
| `.heading-3` | `text-fluid-1` | IBM Plex Sans | 500 | Subsection headings |
| `.heading-4` | `text-1` | IBM Plex Sans | 500 | Content headings |
| `.heading-5` | `text-0` | IBM Plex Sans | 500 | Small headings |
| `.heading-6` | `text--1` | IBM Plex Sans | 600 | Micro headings |

#### Body Text Classes

| Class | Font Size | Line Height | Use Case |
|-------|-----------|-------------|----------|
| `.text-body` | `text-0` | 1.6 | Primary body text |
| `.text-body-sm` | `text--1` | 1.5 | Secondary text, captions |
| `.text-lead` | `text-1` | 1.45 | Introduction paragraphs |
| `.text-meta` | `text--1` | 1.5 | Metadata, uppercase |
| `.text-caption` | `text--1` | 1.5 | Image captions, italic |
| `.text-quote` | `text-1` | 1.45 | Pull quotes, serif italic |

#### Reading Measure Classes

Optimal line length based on Jost Hochuli's research:

| Class | Max Width | Character Count | Use Case |
|-------|-----------|-----------------|----------|
| `.measure-narrow` | `45ch` | ~45 characters | Sidebars, narrow columns |
| `.measure-base` | `65ch` | ~65 characters | **Optimal for body text** |
| `.measure-wide` | `80ch` | ~80 characters | Wide layouts, technical content |
| `.measure-full` | `none` | Unlimited | Full-width content |

### Baseline Grid Integration

All typography classes align to a 4px baseline grid for consistent vertical rhythm:

```css
/* Built-in spacing for headings */
.heading-2 {
  margin-top: 2rem; /* 8b - clear section break */
  margin-bottom: 0.5rem; /* 2b - tight coupling with content */
}

/* Paragraph spacing */
p + p {
  margin-top: 1rem; /* 4b - comfortable reading rhythm */
}
```

### Migration Examples

**Before (size-based):**
```html
<h1 class="text-4xl font-bold">Page Title</h1>
<h2 class="text-2xl font-semibold">Section</h2>
<p class="text-lg">Lead paragraph</p>
<p class="text-base">Body text</p>
```

**After (semantic):**
```html
<h1 class="heading-1">Page Title</h1>
<h2 class="heading-2">Section</h2>
<p class="text-lead">Lead paragraph</p>
<p class="text-body">Body text</p>
```

### Typography Best Practices

1. **Use semantic classes** for better maintainability
2. **Apply reading measures** to improve readability
3. **Respect baseline grid** for consistent rhythm
4. **Test across themes** to ensure accessibility

For detailed documentation, see [docs/TYPOGRAPHY.md](docs/TYPOGRAPHY.md).

### Link Typography System

We use a context-aware link typography system that applies appropriate styles based on the link's semantic role:

#### Link Classes

1. **`.inline-link`** - For body text links
   - Used in prose and content
   - Underlined with offset
   - Subtle hover effects
   - Inherits surrounding text properties
   - Maintains readability in dense text

2. **`.nav-link`** - For navigation links
   - Used in headers, footers, menus
   - No underline, medium weight
   - Sans-serif font family
   - Clear hover states
   - Optimized for scannable navigation

3. **`.feature-link`** - For prominent feature links
   - Used for section headers, post titles
   - Newsreader font family
   - Larger size with tight line height
   - No underline by default
   - Creates visual hierarchy

#### Usage Examples

```astro
<!-- Body text links -->
<p>Read more about <a href="/topic" class="inline-link">this topic</a>.</p>

<!-- Navigation links -->
<nav>
  <a href="/posts" class="nav-link">Posts</a>
  <a href="/about" class="nav-link">About</a>
</nav>

<!-- Feature links -->
<h2>
  <a href="/posts" class="feature-link">Latest Posts</a>
</h2>

<!-- In components -->
<PostPreview>
  <h3 class="feature-link">
    <a href={post.url}>{post.title}</a>
  </h3>
</PostPreview>
```

### Headers

Headers use Newsreader with optical sizing and careful weight adjustments:

- **h1**: Weight 300, optical size 72, tight tracking (-0.02em)
- **h2**: Weight 400, optical size 48, medium tracking (-0.015em)
- **h3**: Weight 450, optical size 32, light tracking (-0.01em)
- **h4**: Weight 500, optical size 24, standard tracking
- **h5-h6**: IBM Plex Sans, weight 600, uppercase for h6

Dark mode automatically adjusts weights slightly heavier for better contrast.

All headers include:
- Optimized text rendering
- Balanced text wrapping
- OpenType features (kerning, contextual alternates, lining figures)
- Consistent accent color

## Implementation Notes

### File Structure
- Styles defined in `/src/styles/` directory
- Main configuration in `/tailwind.config.ts`
- Custom utilities use `@apply` for consistency
- Font files loaded via @fontsource packages

### CSS Organization
- `fonts.css`: Font face declarations
- `global.css`: Base styles and rendering optimizations
- `links.css`: Link typography utilities
- `utopia.css`: Fluid type and space scales

### Best Practices
- Always use semantic link classes instead of custom styling
- Maintain consistent hierarchy with feature links
- Test contrast ratios in both light and dark modes
- Use fluid type scale classes for all text sizing