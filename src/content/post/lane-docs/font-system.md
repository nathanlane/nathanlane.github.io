---
title: "Font System Documentation"
publishDate: '2025-07-14'
description: "Complete guide to the font implementation, loading strategy, and usage patterns"
seriesId: lane-docs
orderInSeries: 8
tags: ["documentation", "typography", "fonts", "design-systems"]
---

# Font Implementation

## Overview
The site uses a carefully selected font stack optimized for readability and aesthetics:

- **Headlines (H1-H4)**: Newsreader (variable font, 300-700)
- **Body Text**: IBM Plex Sans (default sans-serif)
- **Long-form Prose**: IBM Plex Serif (available via `.prose-serif` class)
- **Small Headings (H5-H6)**: IBM Plex Sans (600 weight)
- **Code/Monospace**: IBM Plex Mono

## Implementation Details

### Font Loading
Fonts are self-hosted using `@fontsource` packages for optimal performance:
- No external font requests
- Subset to Latin characters only
- Using `font-display: swap` for better perceived performance
- Critical fonts preloaded for faster initial render

### Font Files
- **Newsreader**: Variable font supporting weights 300-700
- **IBM Plex Sans**: Individual weight files (400, 500, 600, 700)
- **IBM Plex Serif**: Individual weight files (400, 500, 600, 700)
- **IBM Plex Mono**: Individual weight files (400, 500, 600)

### Font Loading in BaseHead.astro
```html
<!-- Critical font preloading -->
<link rel="preload" href="/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-italic.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin />
```

### Font Stack Configuration
```javascript
// tailwind.config.ts
fontFamily: {
  headline: ["Newsreader", "Georgia", ...fontFamily.serif],
  sans: ["IBM Plex Sans", ...fontFamily.sans],
  serif: ["IBM Plex Serif", ...fontFamily.serif],
  mono: ["IBM Plex Mono", ...fontFamily.mono],
}
```

## Usage in Components

### Headlines
All H1-H4 elements automatically use Newsreader:
```html
<h1>This is in Newsreader</h1>
```

For non-heading elements that need the headline font:
```html
<p class="font-headline">This paragraph uses Newsreader</p>
```

### Body Text
Default font is IBM Plex Sans:
```html
<p>This is in IBM Plex Sans</p>
```

### Long-form Prose
For article content or long-form text:
```html
<article class="prose-serif">
  <p>This content uses IBM Plex Serif for better readability</p>
</article>
```

### Code Blocks
Monospace content automatically uses IBM Plex Mono:
```html
<code>const example = "IBM Plex Mono";</code>
```

## Typography Scale Integration
The fonts work with the tailwindcss-fluid-type plugin:
- Headlines use tighter line heights (1.05-1.2)
- Body text uses 1.6 line height (160%)
- Font sizes scale fluidly between 320px and 1280px viewports

### Heading Typography
```css
/* H1 - Newsreader */
h1 {
  font-family: var(--font-headline);
  font-weight: 400;
  font-variation-settings: "opsz" 72, "wght" 400;
  line-height: 1.1;
}

/* H2 - Newsreader */
h2 {
  font-family: var(--font-headline);
  font-weight: 425;
  font-variation-settings: "opsz" 48, "wght" 425;
  line-height: 1.15;
}
```

## Variable Font Features

### Newsreader Optical Sizing
Newsreader includes optical size axis for better rendering at different sizes:
```css
/* Display size */
.text-5, .text-6 {
  font-variation-settings: "opsz" 72;
}

/* Text size */
.text-3, .text-4 {
  font-variation-settings: "opsz" 48;
}

/* Small text */
.text-1, .text-2 {
  font-variation-settings: "opsz" 32;
}
```

### OpenType Features
All fonts support advanced typography features:
```css
/* Enable kerning and ligatures */
body {
  font-feature-settings: "kern" 1, "liga" 1;
}

/* Headers with additional features */
h1, h2, h3 {
  font-feature-settings: 
    "kern" 1,      /* Kerning */
    "liga" 1,      /* Common ligatures */
    "calt" 1,      /* Contextual alternates */
    "lnum" 1,      /* Lining figures */
    "case" 1;      /* Case-sensitive forms */
}
```

## Dark Mode Optimizations

Fonts render differently on dark backgrounds, so we adjust weights:
```css
/* Light mode */
h1 { font-weight: 400; }

/* Dark mode - slightly heavier */
:root[data-theme="dark"] h1 { 
  font-weight: 450;
  font-variation-settings: "opsz" 72, "wght" 450;
}
```

## Performance Considerations

### Critical Font Loading
1. Only Latin subset loaded (reduces file size by ~70%)
2. Variable font for Newsreader (one file instead of multiple weights)
3. `font-display: swap` prevents invisible text
4. Preload critical fonts in `<head>`

### Font Metrics
```
Newsreader Variable: ~45KB (all weights)
IBM Plex Sans 400: ~23KB
IBM Plex Sans 500: ~23KB
IBM Plex Sans 600: ~23KB
IBM Plex Mono 400: ~21KB
Total critical: ~68KB (Newsreader + Sans 400)
```

## OG Image Generation
Open Graph images use IBM Plex Sans (WOFF format) for consistency:
```typescript
// src/pages/og-image/[slug].png.ts
const fontData = await fetch(
  new URL("../../../public/fonts/ibm-plex-sans-regular.woff", import.meta.url)
).then((res) => res.arrayBuffer());
```

## Customization Guide

### To Change Fonts:

1. **Install new @fontsource packages:**
```bash
npm install @fontsource/new-font-name
```

2. **Import in BaseHead.astro:**
```typescript
import "@fontsource/new-font-name/400.css";
import "@fontsource/new-font-name/700.css";
```

3. **Update Tailwind config:**
```javascript
fontFamily: {
  headline: ["New Font", ...fontFamily.serif],
  sans: ["New Sans Font", ...fontFamily.sans],
}
```

4. **Add preload for critical fonts:**
```html
<link rel="preload" href="/@fontsource/new-font/files/new-font-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
```

### Font Selection Criteria
When choosing fonts, consider:
- Variable font support (reduces requests)
- Latin subset availability
- OpenType features
- x-height compatibility with IBM Plex
- Performance (file size)
- License (open source preferred)

## Troubleshooting

### Font Not Loading
1. Check @fontsource import in BaseHead.astro
2. Verify font name in Tailwind config
3. Check browser console for 404 errors
4. Ensure correct weight is imported

### Variable Font Issues
1. Not all browsers support variable fonts
2. Fallback to static weights automatically
3. Test in Safari for variation axis support

### Performance Issues
1. Remove unused font weights
2. Consider system font stack for body text
3. Use `font-display: optional` for non-critical fonts
4. Subset fonts further if needed

This font system provides excellent typography while maintaining performance and flexibility for future updates.