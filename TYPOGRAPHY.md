# Typography System Documentation

This document covers the comprehensive typography system implemented across Phases 1-4, including fluid typography, semantic components, baseline grid alignment, and dark mode optimizations.

## Overview

The typography system is built on several key principles:
- **Fluid Typography**: Using the `tailwindcss-fluid-type` plugin for smooth responsive scaling
- **Semantic Classes**: Component-based typography classes for consistency
- **Baseline Grid**: 4px grid system for vertical rhythm
- **Dark Mode Optimization**: Reduced weights and adjusted contrast for dark backgrounds
- **Mobile-First**: Optimized for small screens with progressive enhancement

## Core Configuration

### Fluid Type Scale (tailwind.config.ts)

```javascript
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

## Semantic Typography Components

### Headings
- `.heading-1`: Display large (text-4, Newsreader)
- `.heading-2`: Display medium (text-2, Newsreader)
- `.heading-3`: Title large (text-1, IBM Plex Sans)
- `.heading-4`: Title medium (text-1, IBM Plex Sans)
- `.heading-5`: Title small (text-0, IBM Plex Sans)
- `.heading-6`: Label (text--1, uppercase, IBM Plex Sans)

### Body Text
- `.text-body`: Standard paragraph text (text-0)
- `.text-body-sm`: Secondary text (text--1)
- `.text-lead`: Introductory text (text-1)

### Special Purpose
- `.text-meta`: Uppercase labels with tracking
- `.text-caption`: Italic captions with lighter color
- `.text-quote`: Serif italic for quotes

## Enhanced Prose Configuration

### Baseline Grid Alignment
All prose elements are aligned to a 4px baseline grid:

```css
/* Paragraphs */
p: {
  marginBottom: '0.875rem', // 3.5b mobile
  '@screen sm': {
    marginBottom: '1rem', // 4b desktop
  }
}

/* Headings */
h1: { marginTop: '2rem', marginBottom: '0.75rem' }  // 8b top, 3b bottom
h2: { marginTop: '1.75rem', marginBottom: '0.5rem' } // 7b top, 2b bottom
```

### Dark Mode Prose
```css
invert: {
  css: {
    '--tw-prose-body': 'hsl(0deg 0% 88%)',
    '--tw-prose-headings': 'hsl(0deg 0% 95%)',
    'h1': { opacity: '0.95', fontWeight: '425' },
    'h2': { opacity: '0.93', fontWeight: '450' },
  }
}
```

## Reading Measures

Utility classes for optimal line length:

- `.measure-narrow`: 45ch (sidebars, captions)
- `.measure-base`: 65ch (default body text)
- `.measure-wide`: 80ch (code blocks, tables)
- `.measure-mobile`: Full width with padding on mobile

## Mobile Typography Optimization

### Responsive Utilities
- `.text-mobile-sm`: 0.875rem → 1rem
- `.text-mobile-base`: 1rem → 1.125rem
- `.text-mobile-lg`: 1.25rem → 1.5rem

### Mobile-Specific Adjustments
```css
@media (max-width: 640px) {
  /* Tighter line height */
  body { line-height: 1.65; }
  
  /* Smaller optical sizes for headers */
  h1 { font-variation-settings: "opsz" 48, "wght" 400; }
  
  /* Better tap targets */
  a { min-height: 44px; }
}
```

## Code Block Typography

### Enhanced Styling
- Font: IBM Plex Mono at 0.8125rem (13px)
- Line height: 1.5 for baseline grid alignment
- Horizontal scrolling with touch support
- Syntax highlighting with rose-pine themes

### Features
- Line numbers with proper alignment
- Highlighted lines with accent borders
- Copy button on hover
- Language badges
- Dark mode optimizations

## Dark Mode Typography

### Font Weight Adjustments
```css
/* Newsreader headers */
h1 { font-weight: 425; } /* Reduced from 400 */
h2 { font-weight: 450; } /* Reduced from 400 */
h3 { font-weight: 500; } /* Increased from 450 */

/* Body text */
body { color: hsl(0deg 0% 92%); } /* Not pure white */
strong { font-weight: 500; } /* Reduced from 600 */
```

### Contrast Optimizations
- Body text: 92% brightness (not pure white)
- Headings: Slight opacity reduction (0.95-0.87)
- Links: Brightness filter (1.1) with glow on hover
- Code blocks: Enhanced contrast with darker backgrounds

### Dark Mode Utilities
- `.dark-text-enhanced`: Optimized body text
- `.dark-heading-enhanced`: Lighter weight headers
- `.dark-contrast-high`: High contrast elements
- `.dark-code-optimized`: Code-specific adjustments

## Typography Components

### Drop Cap Component
Three variants with baseline grid alignment:
- `classic`: Background and padding
- `modern`: Color accent with weight
- `outline`: Border treatment

### Pull Quote Component
Flexible alignment and styling:
- Alignments: left, center, right
- Variants: default, accent, large
- Responsive stacking on mobile

### Sidenote Component
Margin notes with responsive behavior:
- Desktop: Positioned in margin
- Mobile: Inline display
- Numbered or hover variants

## Usage Examples

### Basic Semantic Typography
```astro
<h1 class="heading-1">Main Title</h1>
<p class="text-lead">Introduction paragraph with emphasis.</p>
<p class="text-body">Regular body text optimized for reading.</p>
<p class="text-meta">CATEGORY LABEL</p>
```

### Reading Measures
```astro
<article class="measure-base mx-auto">
  <!-- Content constrained to 65ch -->
</article>

<aside class="measure-narrow">
  <!-- Sidebar content at 45ch -->
</aside>
```

### Mobile-Responsive Text
```astro
<p class="text-mobile-base">
  Scales from 16px to 18px between mobile and desktop.
</p>
```

### Dark Mode Optimization
```astro
<h1 class="heading-1 dark-heading-enhanced">
  Automatically adjusts weight in dark mode
</h1>
```

## Performance Considerations

1. **Font Loading**: Fonts are loaded via @fontsource for optimal performance
2. **CSS Size**: Semantic classes reduce repetition and CSS size
3. **Variable Fonts**: Newsreader uses variable weights for smooth transitions
4. **Fluid Scaling**: No JavaScript required for responsive typography

## Accessibility Features

- Proper heading hierarchy maintained
- Sufficient color contrast in both themes
- Focus states for all interactive elements
- Semantic HTML with ARIA labels where needed
- Text remains readable at all zoom levels

## Future Enhancements

1. **Typography Showcase Page**: Fix and enhance the showcase page for visual testing
2. **Additional Components**: Numbered lists, definition lists, tables
3. **Print Styles**: Optimize typography for print media
4. **Custom Font Features**: Explore OpenType features for enhanced typography
5. **Performance Monitoring**: Track Core Web Vitals impact of typography choices