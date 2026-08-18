---
title: "Design System Documentation"
publishDate: '2025-07-14'
description: "Complete guide to the typography and spacing system built on mathematical foundations"
seriesId: lane-docs
orderInSeries: 4
tags: ["documentation", "design-systems", "typography", "css"]
---

# Design System Documentation

## Recent Updates

### Optical Typography Refinements (January 17, 2025)
Micro-typographic refinements for enhanced readability:
- **Body Text**: Added 0.005em letter-spacing for improved word-shape recognition
- **Dark Mode**: Optimized text color to off-white, reduced font weight to 380
- **Typography Utilities**: New caps-generous, caps-loose, and text-small-caps classes
- **Grid Preservation**: All refinements maintain perfect baseline alignment

### Typography System Grid Alignment (January 17, 2025)
Complete grid alignment of all typography and spacing elements:
- **Visual Development Tools**: Added `.show-baseline` class for 24px grid visualization
- **Typography Quick Wins**: New letter-spacing utilities (tightest, tighter, wideUpper)
- **Component Updates**: All components now use grid-aligned *b tokens
- **Prose Spacing**: @tailwindcss/typography plugin refactored with CSS variables

### Baseline Grid Refactoring (July 14, 2025)
All core layout components have been refactored to strictly enforce the 6px baseline grid:
- **Header**: All spacing now uses grid-aligned values (px-4b, gap-5b, h-5b)
- **Footer**: Consistent padding and gaps (px-4b, gap-3b)
- **Base Layout**: Proper margin alignment (mt-13b, md:mt-5b)

This ensures perfect vertical rhythm throughout the site's main structural elements.

## Current System Overview (2025-07-14)

This design system is built on two mathematical foundations that create a harmonious, scalable design:

### 1. Fluid Typography System
Using the `tailwindcss-fluid-type` plugin, all text smoothly scales between viewport sizes:

| Class | Mobile (320px) | Desktop (1280px) | Usage |
|-------|----------------|------------------|-------|
| `text--2` | 0.64rem (10px) | 0.72rem (12px) | Tiny captions |
| `text--1` | 0.80rem (13px) | 0.90rem (14px) | Small text |
| `text-0` | 0.94rem (15px) | 1.06rem (17px) | **Body text (base)** |
| `text-1` | 1.17rem (19px) | 1.33rem (21px) | Large text |
| `text-2` | 1.46rem (23px) | 1.66rem (27px) | H3 headings |
| `text-3` | 1.83rem (29px) | 2.08rem (33px) | H2 headings |
| `text-4` | 2.29rem (37px) | 2.59rem (41px) | H1 headings |
| `text-5` | 2.86rem (46px) | 3.24rem (52px) | Display |
| `text-6` | 3.58rem (57px) | 4.05rem (65px) | Hero |

### 2. Grid-Based Spacing System
Built on a **6px grid unit** with **24px baseline** for perfect vertical rhythm:

```css
/* Foundation */
--baseline: 1.5rem;     /* 24px = 16px × 1.5 */
--grid-unit: 0.375rem;  /* 6px = 24px ÷ 4 */
```

| Token | Value | Grid Units | Usage |
|-------|-------|------------|-------|
| `space-1` | 6px | 1 unit | Hairline spacing |
| `space-2` | 12px | 2 units | Tight spacing |
| `space-3` | 18px | 3 units | Compact spacing |
| `space-4` | 24px | 4 units | **Base (1 baseline)** |
| `space-6` | 36px | 6 units | Flow (1.5 baselines) |
| `space-8` | 48px | 8 units | Section (2 baselines) |
| `space-10` | 60px | 10 units | Large (2.5 baselines) |
| `space-12` | 72px | 12 units | Huge (3 baselines) |
| `space-16` | 96px | 16 units | Massive (4 baselines) |
| `space-24` | 144px | 24 units | Extreme (6 baselines) |

### Single Sources of Truth

1. **Typography**: Edit `textSizes` in `tailwind.config.ts`
2. **Spacing**: Edit `--grid-unit` in `src/styles/global.css`

Changes cascade through the entire system automatically.

## Utopia Fluid Type & Space Scale

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
| **Base Font Size** | 16px → 18px | More conventional sizing for better readability |
| **Body Line Height** | 1.35 (135%) | Middle of Hochuli's 120-140% range |
| **Heading Line Height** | 1.05–1.2 | Tighter leading for display sizes (Hochuli) |
| **Optimal Line Length** | 65ch | Within Hochuli's 60-70ch recommendation |

### Implementation Details

#### Typography Configuration
```typescript
// tailwind.config.ts
fluidType({
  minScreen: "320px",
  maxScreen: "1280px",
  textSizes: {
    "-2": { minSize: "0.64rem", maxSize: "0.72rem", lineHeight: "1.45" },
    "-1": { minSize: "0.80rem", maxSize: "0.90rem", lineHeight: "1.50" },
     "0": { minSize: "0.94rem", maxSize: "1.06rem", lineHeight: "1.60" },
     "1": { minSize: "1.17rem", maxSize: "1.33rem", lineHeight: "1.45" },
     "2": { minSize: "1.46rem", maxSize: "1.66rem", lineHeight: "1.35" },
     "3": { minSize: "1.83rem", maxSize: "2.08rem", lineHeight: "1.25" },
     "4": { minSize: "2.29rem", maxSize: "2.59rem", lineHeight: "1.15" },
     "5": { minSize: "2.86rem", maxSize: "3.24rem", lineHeight: "1.10" },
     "6": { minSize: "3.58rem", maxSize: "4.05rem", lineHeight: "1.05" }
  }
})
```

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
```

### Spacing Rules

Optimized vertical rhythm based on typography research:

#### Content Spacing
- **Between paragraphs**: `var(--space-paragraph)` → `space-s-m` (16-18px → 24-27px)
  - Uses space pair for proportional scaling
  - Provides comfortable reading rhythm

- **Before headings**: `var(--space-heading-before)` → `space-l-xl` (32-36px → 48-54px)
  - Larger space before = visual hierarchy
  - Follows principles from Matthew Butterick's Practical Typography

- **After headings**: `var(--space-heading-after)` → `space-xs-s` (12-13.5px → 16-18px)
  - Tighter coupling with following content
  - Creates clear content groups

#### Component Spacing
- **Section gaps**: `space-2xl-3xl` (64-72px → 96-108px)
- **Card padding**: `space-m-l` (24-27px → 32-36px)
- **List item gaps**: `space-2xs` (8-9px)

### Mobile Optimizations

The design system automatically adjusts for smaller viewports:

```css
/* Mobile adjustments (320-768px) */
@media (max-width: 768px) {
  :root {
    --space-paragraph: var(--space-s);      /* Tighter on mobile */
    --space-section: var(--space-xl);       /* Reduced sections */
    --reading-measure: 100%;                /* Full width */
  }
}
```

### Dark Mode Typography

Optimized for reduced eye strain:
- **Increased font weights**: +25-50 weight units
- **Adjusted contrast**: 87-93% opacity for headers
- **Warmer tones**: Slight sepia tint in dark mode

## Usage Examples

### Basic Layout
```html
<article class="max-w-prose mx-auto">
  <h1 class="text-4 mb-2">Article Title</h1>
  <p class="text-lead mb-8">Introduction paragraph with larger text.</p>
  
  <h2 class="text-2 mt-12b mb-3b">Section Heading</h2>
  <p class="mb-4">Regular paragraph with standard spacing...</p>
</article>
```

### Component Spacing
```html
<div class="grid gap-8b">
  <section class="p-6 bg-surface rounded-lg">
    <h3 class="text-1 mb-2">Card Title</h3>
    <p class="text-sm">Card content with smaller text.</p>
  </section>
</div>
```

## Design Tokens Reference

### Colors
- See `src/styles/global.css` for complete color system
- CSS variables enable theme switching
- Semantic naming for maintainability

### Typography
- **Headings**: Newsreader (serif)
- **Body**: IBM Plex Sans
- **Code**: IBM Plex Mono

### Breakpoints
- **Mobile**: 320px minimum
- **Tablet**: 768px
- **Desktop**: 1024px
- **Wide**: 1280px maximum

## Maintenance

To modify the design system:

1. **Typography changes**: Update `tailwind.config.ts` fluid type settings
2. **Spacing changes**: Modify CSS variables in `src/styles/global.css`
3. **Component updates**: Use semantic classes, avoid arbitrary values
4. **Testing**: Check at 320px, 768px, and 1280px viewports

Remember: The system is designed to be modified at the source, with changes cascading throughout the site automatically.