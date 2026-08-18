---
title: "Color System Documentation"
publishDate: '2025-07-14'
description: "Complete guide to the refined color system with warm neutrals and sophisticated palette"
seriesId: lane-docs
orderInSeries: 7
tags: ["documentation", "color", "design-systems", "css"]
---

# Color System Documentation

## Overview

The color system uses CSS custom properties (variables) defined in `src/styles/global.css` as the single source of truth. All colors cascade from these root definitions.

## Architecture

### 1. Base Color Definitions

Located in `src/styles/global.css`:

```css
:root {
  /* Core parameters */
  --hue: 0deg;              /* Base hue (0 = neutral) */
  --saturation: 0%;         /* Color intensity (0% = grayscale) */
  --bg-brightness: 100%;    /* Background brightness (100% = white) */
  --fg-brightness: 10%;     /* Text brightness (10% = near black) */
}
```

### 2. Color Scale Generation

The system generates a 19-step opacity scale from the base foreground color:

```css
--theme-color-900: hsl(var(--theme-fg) / 1.0);     /* 100% opacity */
--theme-color-850: hsl(var(--theme-fg) / 0.9675);  /* 96.75% opacity */
--theme-color-800: hsl(var(--theme-fg) / 0.935);   /* 93.5% opacity */
/* ... continues to ... */
--theme-color-50:  hsl(var(--theme-fg) / 0.0225);  /* 2.25% opacity */
```

### 3. Semantic Color Tokens

```css
/* Backgrounds */
--theme-bg: 0deg 0% 100%;              /* Pure white #ffffff */
--theme-special-lightest: 0deg 0% 99%; /* Near white #fcfcfc */
--theme-special-lighter: 0deg 0% 97%;  /* Light gray #f7f7f7 */
--theme-special-light: 0deg 0% 95%;    /* Gray #f2f2f2 */

/* Text */
--theme-text: hsl(30deg 2% 10%);       /* Subtle warm black #1a1918 */
--theme-accent-base: 0deg 0% 15%;      /* Near black #262626 */
--theme-lightest: 0deg 0% 45%;         /* Medium gray #737373 */
--theme-lighter: 0deg 0% 35%;          /* Dark gray #595959 */
--theme-light: 0deg 0% 30%;            /* Darker gray #4d4d4d */

/* Links & Accents */
--theme-link: 220deg 35% 40%;          /* Sophisticated blue #365880 */
--theme-quote: hsl(40deg 5% 35%);      /* Warm quote color */
```

## Current Implementation (Refined Neutrals)

### Light Mode
- **Background**: Pure white (#ffffff) for maximum clarity
- **Text**: Subtle warm black (hsl(30deg 2% 10%)) - adds warmth without being noticeable
- **Grays**: Pure neutral scale (0% saturation) for versatility

### Dark Mode
```css
:root[data-theme="dark"] {
  --bg-brightness: 8%;       /* Very dark #141414 */
  --fg-brightness: 90%;      /* Bright text #e6e6e6 */
  
  /* Warm tints for comfort */
  --bg-hue: 40deg;
  --bg-saturation: 5%;       /* Subtle warmth */
  
  /* Enhanced opacity for readability */
  --theme-text: hsl(40deg 5% 88% / 0.90);
}
```

## Usage Patterns

### Text Hierarchy
```css
/* Primary text */
color: var(--theme-text);

/* Secondary text */
color: var(--theme-lighter);

/* Tertiary text */
color: var(--theme-lightest);

/* Disabled/subtle */
color: var(--theme-color-400);
```

### Backgrounds
```css
/* Main background */
background: var(--theme-bg);

/* Card/elevated surface */
background: var(--theme-special-lightest);

/* Hover state */
background: var(--theme-special-lighter);

/* Active/pressed */
background: var(--theme-special-light);
```

### Borders
```css
/* Strong border */
border-color: var(--theme-color-200);

/* Default border */
border-color: var(--theme-color-150);

/* Subtle border */
border-color: var(--theme-color-100);

/* Faint border */
border-color: var(--theme-color-75);
```

## Tailwind Integration

The color system is integrated with Tailwind through custom color definitions:

```javascript
// tailwind.config.ts
colors: {
  bgColor: "hsl(var(--theme-bg) / <alpha-value>)",
  textColor: "hsl(var(--theme-text) / <alpha-value>)",
  accent: {
    base: "hsl(var(--theme-accent-base) / <alpha-value>)",
    one: "hsl(var(--theme-accent-one) / <alpha-value>)",
    two: "hsl(var(--theme-accent-two) / <alpha-value>)",
  },
  // Opacity scale
  color: {
    900: "hsl(var(--theme-color-900) / <alpha-value>)",
    800: "hsl(var(--theme-color-800) / <alpha-value>)",
    // ... etc
  }
}
```

### Using in HTML
```html
<!-- Text colors -->
<p class="text-textColor">Primary text</p>
<p class="text-light">Secondary text</p>
<p class="text-lighter">Tertiary text</p>

<!-- Backgrounds -->
<div class="bg-bgColor">Main background</div>
<div class="bg-special-light">Card background</div>

<!-- Borders -->
<div class="border border-color-150">Default border</div>
<div class="border-2 border-color-200">Strong border</div>
```

## Micro-Contrast Adjustments

The system includes specific adjustments for different text sizes:

### Light Mode
```css
/* Headers need slightly lighter color for optical balance */
h1, h2 { color: hsl(0deg 0% 12%); }
h3, h4, h5, h6 { color: hsl(0deg 0% 15%); }

/* Small text needs higher contrast */
.text-sm, .caption { color: hsl(0deg 0% 30%); }
```

### Dark Mode
```css
/* Headers brighter than body */
h1, h2 { color: hsl(40deg 5% 92%); }

/* Small text muted for hierarchy */
.text-sm { color: hsl(40deg 5% 75%); }
```

## Special States

### Selection Colors
```css
::selection {
  background: hsl(220deg 40% 92%);  /* Light blue */
  color: hsl(0deg 0% 10%);
}

/* Dark mode */
:root[data-theme="dark"] ::selection {
  background: hsl(220deg 30% 25%);
  color: hsl(0deg 0% 95%);
}
```

### Focus States
```css
:focus {
  outline: 1.5px solid hsl(220deg 35% 40%);
  outline-offset: 3px;
}

/* Dark mode */
:root[data-theme="dark"] :focus {
  outline-color: hsl(220deg 25% 70%);
}
```

## Code Syntax Highlighting

```css
/* Inline code */
--code-inline-bg: var(--theme-color-100);

/* Code blocks */
--code-bg: var(--theme-special);
--code-title-bg: var(--theme-color-200);
--code-line-highlight: hsl(40deg 10% 0% / 0.04);
```

## Making Changes

### To adjust the entire color system:
1. Change base parameters in `:root`
2. All derived colors update automatically
3. Test in both light and dark modes

### To add warmth:
```css
:root {
  --hue: 30deg;        /* Warm hue */
  --saturation: 2%;    /* Subtle warmth */
}
```

### To increase contrast:
```css
:root {
  --fg-brightness: 5%;  /* Darker text */
}
```

## Accessibility

The color system maintains WCAG AAA compliance:
- Normal text: 16.5:1 contrast ratio
- Large text: Exceeds requirements
- UI elements: Minimum 3:1 contrast

## Performance

- Single source of truth reduces CSS size
- CSS variables enable runtime theming
- No JavaScript required for theme switching
- Efficient cascade minimizes overrides

## Debug Helpers

Add to any element to visualize the color scale:
```html
<div class="bg-color-900">900 - Full opacity</div>
<div class="bg-color-800">800 - 93.5% opacity</div>
<div class="bg-color-700">700 - 87% opacity</div>
<!-- etc... -->
```

This color system provides a sophisticated, maintainable foundation for the entire design system while ensuring excellent readability and visual harmony.