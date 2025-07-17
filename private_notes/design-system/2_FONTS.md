# Font Implementation

## Overview
The site uses a carefully selected font stack optimized for readability and aesthetics:

- **Headlines (H1-H4)**: Newsreader (variable font, 300-700)
- **Body Text**: IBM Plex Sans (default sans-serif)
- **Long-form Prose**: IBM Plex Serif (available via `.prose-serif` class)
- **Small Headings (H5-H6)**: IBM Plex Sans (600 weight)
- **Code/Monospace**: System mono stack

## Implementation Details

### Font Loading
Fonts are self-hosted using `@fontsource` packages for optimal performance:
- No external font requests
- Subset to Latin characters only
- Using `font-display: swap` for better perceived performance

### Font Files
- **Newsreader**: Variable font with optimized weight progression 375-625 (light to semibold)
- **IBM Plex Sans**: Individual weight files (400, 500, 600, 700)
- **IBM Plex Serif**: Individual weight files (400, 500, 600, 700)

### Usage in Components

#### Headlines
All H1-H4 elements automatically use Newsreader:
```html
<h1>This is in Newsreader</h1>
```

For non-heading elements that need the headline font:
```html
<p class="font-headline">This paragraph uses Newsreader</p>
```

#### Body Text
Default font is IBM Plex Sans:
```html
<p>This is in IBM Plex Sans</p>
```

#### Long-form Prose
For article content or long-form text:
```html
<article class="prose-serif">
  <p>This content uses IBM Plex Serif for better readability</p>
</article>
```

### Typography Scale
The fonts work with the Utopia fluid type scale:
- Headlines use tighter line heights (1.05-1.2)
- Body text uses 1.5 line height (150%)
- Font sizes scale fluidly between 320px and 1280px viewports

### OG Image Generation
Open Graph images use IBM Plex Sans (WOFF format) for consistency with the site design.

## Customization

To change fonts:
1. Install new `@fontsource` packages
2. Update `/src/styles/fonts.css` with new @font-face declarations
3. Modify `tailwind.config.ts` fontFamily settings
4. Update heading styles in Tailwind config if needed