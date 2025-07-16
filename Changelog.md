# Changelog

## Jekyll to Astro Migration & Blog Navigation (January 2025)

### Jekyll Archive Migration
- **Successfully migrated ~70 Jekyll posts** from nathanlane_github_io_archive to Astro format
- **Created comprehensive migration script** (`scripts/migration/migrate-jekyll-archive.js`):
  - Converts Jekyll frontmatter to Astro-compatible format
  - Updates image paths from `/uploads/` and `/assets/` to `/images/blog/`
  - Generates descriptions from content if missing
  - Preserves tags and categories (normalized to lowercase)
  - Copies all images to public directory
- **Fixed truncated posts** with detection and repair scripts
- **Marked pre-2017 posts as drafts** for content curation

### Content Validation System
- **Created pre-flight validation** (`scripts/content/validate-content.js`):
  - Checks title length (max 60 chars)
  - Validates description length (20-300 chars)
  - Ensures required fields exist
  - Reports all issues before build fails
- **Auto-fix script** (`scripts/content/fix-content.js`):
  - Intelligently truncates long titles
  - Fixes description lengths
  - Removes HTML from descriptions
  - Generates missing descriptions from content
- **npm scripts integration**:
  - `npm run validate` - Check all content
  - `npm run fix-content` - Auto-fix issues
  - `predev` hook runs validation automatically

### Enhanced Blog Navigation
- **Main Posts Page** (`/posts`):
  - Increased posts per page from 5 to 10
  - Added client-side search functionality
  - Shows popular tags on first page
  - Links to archive and tags pages
- **Blog Archive Page** (`/posts/archive`):
  - Shows ALL posts on single page (no pagination)
  - Quick stats dashboard (total posts, topics, years)
  - Browse by topic with categorized tags
  - Jump links to specific years
  - Sticky year headers for easy navigation
- **Blog Index Page** (`/posts/index`):
  - Category-based navigation (Economics, Technical, Research)
  - Recent posts section
  - Multiple browsing options

### Script Organization
- **Created organized script structure**:
  - `scripts/migration/` - Jekyll to Astro migration tools
  - `scripts/content/` - Content validation and fixing
  - `scripts/maintenance/` - General maintenance scripts
- **Comprehensive documentation** in `scripts/README.md`
- **Added detailed headers** to all scripts explaining:
  - Purpose and functionality
  - Usage instructions
  - Prerequisites and dependencies
  - Expected output
- **Shell scripts for common tasks**:
  - `batch-migrate.sh` - Run full migration
  - `fix-dependencies.sh` - Resolve npm issues
  - `check-titles.sh` - Find long titles

### Documentation Updates
- **Updated CLAUDE.md** with Jekyll migration information
- **Created scripts README** with detailed usage for all utilities
- **Added migration notes** to development documentation

## Production Readiness Improvements - Technical Debt (July 2025)

### Security & Build Improvements
- **Disabled source maps** for production builds to prevent source code exposure
- **Added Netlify security headers** with Content Security Policy, X-Frame-Options, and other security headers
- **Fixed TypeScript errors** by adding missing `email` field to SiteConfig interface
- **Resolved all security vulnerabilities** (0 vulnerabilities):
  - Upgraded Astro from 5.1.2 to 5.11.0
  - Upgraded Sharp from 0.33.5 to 0.34.0
  - Upgraded @astrojs/mdx from 4.0.3 to 4.0.6
  - Added pnpm overrides for tar-fs, prismjs, undici, and brace-expansion
  - Fixed high severity tar-fs path traversal vulnerability
  - Fixed moderate severity prismjs DOM clobbering vulnerability

### SEO & Metadata Enhancements
- **Added page numbers to pagination titles** for Posts and Tags pages to avoid duplicate titles
- **Fixed structured data** by replacing non-existent `siteConfig.siteUrl` with `Astro.site`
- **Canonical URLs** already properly implemented using `Astro.url`
- **JSON-LD structured data** already implemented for articles and breadcrumbs

### CI/CD Implementation
- **Created GitHub Actions workflow** for continuous integration with type checking, linting, and build verification
- **Added GitHub Pages deployment workflow** with proper caching and artifact handling
- **Security audit** integrated into CI pipeline with moderate severity threshold

### Documentation & Process
- **Created production readiness checklist** as PRIVATE_PRODUCTION_CHECKLIST.md
- **Updated .gitignore** to exclude private documentation files (PRIVATE_*.md)
- **Fixed content validation error** by shortening blog post title exceeding 60 character limit
- **Created comprehensive Webmaster Guide** (WEBMASTER_GUIDE.md) covering:
  - Complete configuration field documentation
  - Step-by-step CI/CD usage instructions
  - GitHub Pages deployment guide
  - Content management instructions
  - Troubleshooting and maintenance tasks
- **Integrated Webmaster Guide into website documentation** at `/series/lane-docs/webmaster-guide/`
- **Updated README** with documentation section linking to all guides
- **Updated Documentation Index** to include webmaster guide in Getting Started section

### Code Quality
- **Assets directory structure** confirmed as intentional for future image optimization workflow
- **Biome linting** configuration reviewed and ready for automated fixes
- **WCAG contrast improvements** in dark mode CSS variables (increased lightness values for better readability)

### Dark Mode Visibility Fixes
- **Research page links grid** improved contrast with lighter background and gray text colors
- **Hero buttons** updated to use lighter backgrounds in dark mode for better visibility
- **Media page icons** made more subtle with smaller size and reduced opacity

## Recent Updates - Typography System Overhaul

### Detail Page Styling Standardization
- **Unified page layouts** across Projects and Writing detail pages to match Research page design
- **Fixed header hierarchy**: Changed from h2 to h1 with proper `heading-1` class
- **Added content constraints**: Applied `max-w-prose mx-auto measure-base content-spacing` for optimal reading width
- **Improved metadata display**: Consistent styling with bullet separators and refined typography
- **Fixed oversized tags**: Reduced padding from 18px/12px to 12px/4px with `text-xs font-medium rounded-full`
- **Removed excessive spacing**: Streamlined vertical rhythm and removed redundant elements

### Table of Contents and Badge Refinements
- **Fixed TOC scrolling issue**: Removed `max-h-[calc(100vh-11rem)]` constraint that forced unnecessary scrollbars
- **Natural TOC height**: TOC now expands to show all headings without scrolling
- **Cleaned up spacing tokens**: Replaced semantic spacing classes (`space-s`, `space-xs`) with standard Tailwind utilities
- **Reduced TOC padding**: Changed from `px-space-s py-space-xs` to `px-4 py-2` for cleaner presentation
- **Badge dark mode fix**: Updated muted variant with proper dark mode colors and borders

### Media Section Implementation
- **Created Media section** for interviews, podcasts, and press coverage
- **TypeScript data structure** in `src/data/media.ts` for type-safe media items
- **Media listing page** at `/media/` with icon-based type indicators
- **Homepage integration** showing latest 3 media appearances
- **Navigation updates**: Added to ContactBox, removed from main header

### Button and Component Typography Enhancements
- **New Button component** with variable font weights and micro-animations
  - Primary buttons: 500→520 weight on hover
  - Secondary buttons: 450→480 weight on hover
  - Dynamic letter-spacing transitions (0.02em→0.045em)
  - 50ms active state micro-animations
- **Badge component updates** with uppercase transformation and refined spacing
- **ContactBox redesign** from contact info to navigation hub
  - Vertical list of page links
  - Smaller social links with LinkedIn removed

### Homepage Dynamic Content
- **Paper Updates section** replacing static projects grid
- **Recent Writing section** showing latest 2 pieces from writing collection
- **Media appearances** in CompactList showing latest 3 items

### Fluid Typography Migration
- **Migrated from `utopia.css` to `tailwindcss-fluid-type` plugin**
- **Updated all documentation** removing references to deprecated CSS file
- **Type scale**: text--2 through text-6 with smooth viewport scaling
- **Base font size**: 15-17px (reduced from 16-18px)

### Semantic Spacing System
- **Implemented semantic tokens**: space-s, space-m, space-l, etc.
- **Typography-aligned spacing**: --space-s = --step-0
- **Moderate scaling**: 25-40% progression between sizes
- **Line height improved** to 1.6 for optimal readability

## July 14, 2025 - Baseline Grid Refactoring

### Changes Made
- **Header.astro**: Refactored all spacing to align with 6px grid (px-4b, gap-5b, h-5b, etc.)
- **Footer.astro**: Updated padding and gaps to grid-aligned values (px-4b, gap-3b)
- **Base.astro**: Aligned margins with baseline grid (mt-13b, md:mt-5b)
- **Documentation**: Updated all documentation to reflect new spacing values

### Impact
All core layout components now strictly enforce the 6px baseline grid, ensuring perfect vertical rhythm throughout the site.

---

# Previous: Utopia Fluid Type Implementation

## Overview

Implemented a comprehensive fluid type and spacing system based on:
- **Tim Brown's "Flexible Typesetting"** principles
- **Jost Hochuli's "Detail in Typography"** guidelines

## Changes Made

### 1. **Created Utopia Fluid Scale** (`/src/styles/utopia.css`)
- Viewport range: 320px → 1280px
- Type ratio: 1.25 (major third - musical interval)
- Type steps: -2 to 6 (9 total steps)
- Space steps: 1 to 6 (consistent spatial rhythm)
- Base font size scales from 16px to 18px (updated to more conventional sizing)
- All values use `clamp()` for smooth responsive scaling

### 2. **Updated Tailwind Configuration** (`tailwind.config.ts`)
- Replaced hardcoded `fontSize` with Utopia scale variables
- Replaced fixed `spacing` with fluid space scale
- Added `maxWidth: { prose: "65ch" }` for optimal line length (Hochuli)
- Added heading styles plugin with appropriate line heights:
  - H1: `text-4` with `line-height: 1.1`
  - H2: `text-3` with `line-height: 1.15`
  - H3: `text-2` with `line-height: 1.2`
  - H4-H6: Progressive smaller sizes
- Maintained legacy class mappings for compatibility

### 3. **Global Styles Updates** (`/src/styles/global.css`)
- Imported Utopia CSS
- Removed hardcoded heading sizes
- HTML base font-size now uses `var(--step-0)`
- Line height set to 1.35 (135% - middle of Hochuli's range)

### 4. **Typography Enhancements**
- Enabled `smartypants: true` in `astro.config.ts` for better typography
- Added `max-w-prose` to article containers for ~65ch line length
- Implemented tighter leading for display sizes (Hochuli principle)

### 5. **Component Updates**
- Homepage hero: Changed from `text-3xl` to `text-4` (fluid)
- BlogPost layout: Added `max-w-prose` for optimal reading

## Typography Principles Applied

### Tim Brown's Principles:
1. **Fluid Type**: Smooth scaling between breakpoints using `clamp()`
2. **Modular Scale**: 1.25 ratio creates harmonious hierarchy
3. **Baseline Grid**: Helper class included (commented out) for vertical rhythm

### Hochuli's Principles:
1. **Line Length**: 65ch maximum via `max-w-prose`
2. **Leading**: 120-140% for body (we use 135%), tighter for headings
3. **Optical Spacing**: Headings use progressively tighter line heights

## Recent Updates

### Font System Replacement (Latest)
- Replaced starter fonts with professional typography stack:
  - **Headlines (H1-H4)**: Newsreader (variable font, 300-700)
  - **Body text**: IBM Plex Sans (weights: 400, 500, 600, 700)
  - **Long-form prose**: IBM Plex Serif (available via `.prose-serif` class)
  - **Small headings (H5-H6)**: IBM Plex Sans (600 weight)
- Self-hosted using `@fontsource` packages (no external requests)
- Optimized font loading with `font-display: swap`
- Created `/src/styles/fonts.css` for font declarations
- Updated Tailwind config with new font families
- Removed old font files (SF Pro Rounded, Cascadia Code)
- OG images use IBM Plex Sans for consistency

### Optimized Spacing System
- Changed base line height from 1.35 to 1.5 (150%) for better readability with 16-18px text
- Implemented Utopia standard naming convention (space-3xs through space-3xl)
- Added semantic spacing aliases for clearer intent:
  - `--space-paragraph`, `--space-heading-before`, `--space-heading-after`
  - `--space-component-padding`, `--space-section`, etc.
- Optimized vertical rhythm rules:
  - Paragraphs: space-s-m (16→27px) for comfortable reading
  - Before headings: space-l-xl (32→54px) for clear sections
  - After headings: space-2xs-xs (8→13.5px) for tight coupling
  - List items: space-3xs (4→4.5px) for visual grouping
- Added responsive line heights for typography scale
- Enhanced heading styles with optical adjustments and letter-spacing

## How to Adjust the Scale

### Change the Ratio:
1. Generate new values at utopia.fyi with desired ratio
2. Update CSS variables in `/src/styles/utopia.css`
3. Maintain the same viewport range for consistency

### Add New Steps:
```css
/* In utopia.css */
--step-7: clamp(5.96rem, 5.72rem + 1.00vw, 6.70rem);

/* In tailwind.config.ts */
fontSize: {
  '7': ['var(--step-7)', '1.05'],
}
```

### Adjust Base Size:
- Modify `--step-0` calculation in `utopia.css`
- All other sizes will scale proportionally

## Legacy Support

Original Tailwind classes still work:
- `text-sm` → `var(--step--1)`
- `text-base` → `var(--step-0)`
- `text-lg` → `var(--step-1)`
- etc.

Spacing utilities maintain compatibility:
- `p-4` → calculated from `var(--space-1)`
- `mt-8` → `calc(var(--space-1) * 1.6)`

## Testing Checklist

- [x] Fluid scaling works at 320px viewport
- [x] Fluid scaling works at 1280px viewport
- [x] Line length constrained to ~65ch
- [x] Headings have appropriate line heights
- [x] No Tailwind compilation errors
- [x] Legacy classes still function
- [x] Smartypants enabled for better quotes/dashes

## Future Considerations

1. **Hyphenation**: Can be enabled with CSS `hyphens` property or Hyphenopoly.js
2. **Variable Fonts**: Could leverage optical sizing axis
3. **Dark Mode**: Current implementation works in both themes
4. **Performance**: Minimal impact - only CSS variables added

## Link Typography Optimization

### Context-Aware Link System
- Created `/src/styles/links.css` with three semantic link utilities:
  - `.inline-link`: For body text links with underline and subtle hover
  - `.nav-link`: For navigation with no underline, medium weight
  - `.feature-link`: For section headers and post titles using Newsreader
- Updated Tailwind config to apply `.inline-link` to prose links automatically
- Applied appropriate classes throughout components:
  - Header/Footer navigation uses `.nav-link`
  - Section headers and post titles use `.feature-link`
  - Body content uses `.inline-link` via prose styling
- Updated DESIGN_SYSTEM.md with link typography documentation
- Ensures visual hierarchy and semantic clarity across all link contexts

## Blog Post Layout Improvements

### Fixed Header and Icon Refinements
- **Removed fixed header behavior** from BlogPost layout
  - Deleted the fixed overlay div that was causing sticky header issues
  - Removed script that added fixed positioning to buttons panel
  - Headers now scroll naturally with content for better reading experience
- **Removed sticky positioning** from Masthead component
  - Title and icon buttons no longer stick while scrolling
  - Provides cleaner, less cluttered interface
- **Made icons more elegant**
  - Reduced button sizes from h-8 w-8 to h-7 w-7 (desktop)
  - Reduced icon sizes from h-6 w-6 to h-5 w-5
  - Changed hover effects from opacity to background color transitions
  - Updated button shapes from rounded-lg to rounded-md for subtler appearance
  - Reduced mobile button sizes from size-12 to size-10
  - Updated "back to top" button to match new styling
- **Fixed TOC panel positioning**
  - Adjusted from top-16 to top-8 to work without fixed header
  - Maintains sticky functionality for easy navigation

### Reduced Excessive Padding
- **Inline code elements**
  - Reduced padding from `px-2 py-1` to `px-1.5 py-0.5`
  - Changed from `rounded-lg` to `rounded-md` for subtler appearance
  - Updated in both Tailwind config and global.css
- **Table of Contents component**
  - Reduced header padding from `pt-4 ps-8 pb-2` to `pt-2 ps-4 pb-2`
  - Reduced content padding from `px-8` to `px-4`
  - Reduced bottom padding from `pb-6` to `pb-3`
  - Made close button smaller (h-6 w-6) with smaller icon (h-4 w-4)
  - Adjusted button position from `top-4 right-4` to `top-2 right-2`
- **Series Panel component**
  - Reduced horizontal padding from `px-8` to `px-4`
  - Reduced top padding from `pt-8` to `pt-6` on desktop
  - Made close button consistent with TOC styling

### Additional Padding Reductions
- **Copy buttons in code blocks**
  - Reduced button height from `h-6` to `h-5`
  - Added `py-0.5` padding to button text
  - Changed text size to `text-xs` for better proportions
- **Code block title bars**
  - Reduced height from `h-10` to `h-8`
  - Reduced horizontal padding from `px-4` to `px-3`
- **Aside/Admonition blocks**
  - Reduced padding from `p-4` to `p-3` (16px to 12px)
  - Reduced vertical margin from `my-4` to `my-3`
  - Changed border width from `0.625rem` to `0.375rem`
  - Changed from `rounded-lg` to `rounded-md`
- **Code block lines**
  - Reduced line height from `h-6` to `h-5`
  - Reduced horizontal padding from `px-4` to `px-3`
  - Reduced pre block vertical padding from `py-2` to `py-1`
- **Header navigation buttons**
  - Reduced height from `h-8` to `h-7`
  - Reduced padding from `px-4` to `px-3`
  - Changed from `rounded-lg` to `rounded-md`
  - Added `text-sm` for consistent sizing