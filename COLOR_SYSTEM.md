# Color System Documentation

## Overview

The color system uses CSS custom properties (variables) defined in `src/styles/global.css` as the single source of truth. All colors cascade from these root definitions.

## Architecture

### 1. Base Color Definitions

Located in `src/styles/global.css` (lines 19-166):

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

/* Interactive */
--theme-link: 220deg 35% 40%;          /* Sophisticated blue #365880 */
```

## How to Modify Colors

### To Change the Background Color:
```css
/* In src/styles/global.css */
:root {
  --bg-brightness: 98%;  /* Change from 100% to make slightly gray */
}
```

### To Add Warmth to the Palette:
```css
:root {
  --hue: 30deg;          /* Add subtle warmth */
  --saturation: 2%;      /* Very subtle color */
}
```

### To Change Link Colors:
```css
:root {
  --theme-link: 210deg 70% 50%;  /* Brighter blue */
  /* or */
  --theme-link: 0deg 0% 20%;     /* Match text for minimal look */
}
```

## Usage in Components

### Tailwind Classes
```html
<!-- Using the color scale -->
<div class="text-color-700">Dark text</div>
<div class="bg-color-100">Light background</div>

<!-- Using semantic colors -->
<h1 class="text-accent-base">Heading</h1>
<a class="text-link">Link</a>
```

### Direct CSS
```css
.custom-element {
  color: var(--theme-text);
  background: hsl(var(--theme-bg));
  border-color: var(--theme-color-200);
}
```

## Current Color Values

### Light Mode
- **Background**: `#ffffff` (pure white)
- **Text Primary**: `#1a1918` (very subtle warm black, 98% neutral)
- **Text Secondary**: `#595959` (neutral gray)
- **Accent**: `#262626` (near black)
- **Links**: `#365880` (sophisticated blue)

### Dark Mode
- **Background**: `#0d0c0b` (warm black)
- **Text Primary**: `#e8e6e3` (warm white)
- **Links**: Muted blue variant

## Micro-Adjustments

The system includes optical corrections:

1. **Headers**: Slightly lighter than body text for visual balance
2. **Small Text**: Higher contrast for readability
3. **Selection**: Light blue background instead of default
4. **Focus States**: Matches link color for consistency

## Files That Define Colors

1. **`src/styles/global.css`** - Main color definitions (single source of truth)
2. **`src/styles/links.css`** - Link-specific color overrides
3. **`tailwind.config.ts`** - Maps CSS variables to Tailwind utilities

## Quick Changes

### Make Background Pure White (Current Setting)
```css
--bg-brightness: 100%;  /* Pure white #ffffff */
```

### Make Background Slightly Gray
```css
--bg-brightness: 98%;   /* Very light gray #fafafa */
```

### Add Subtle Warmth
```css
--hue: 30deg;          /* Warm tint */
--saturation: 1%;      /* Barely visible */
```

### Remove All Warmth (Pure Grayscale)
```css
--hue: 0deg;           /* No color */
--saturation: 0%;      /* Pure gray */
```