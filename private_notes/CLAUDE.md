# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a typography-focused personal website built with Astro. The goal is to create a typography-centric showcase while maintaining all blog functionality. Based on Astro v5, TypeScript, and TailwindCSS with content collections and dark/light themes.

**Developer Context**: Assume the developer is new to this stack (Astro, TypeScript, TailwindCSS). Always provide explanations for concepts, patterns, and usage. Include running documentation and context for decisions made.

## Essential Commands

```bash
# Development
pnpm dev          # Start dev server on localhost:3000
pnpm build        # Build to ./dist/
pnpm preview      # Preview production build

# Code Quality
pnpm lint         # Run Biome linting
pnpm format       # Format code with Biome and Prettier
pnpm check        # Type-check with Astro
```

## Recent Major Improvements (July 17, 2025)

### Media Page Refactoring & Archive System
- **Complete Media page refactoring** following typography masters' principles
- **New reusable components**: `MediaEntry.astro` and `ArchiveEntry.astro` for any content type
- **Writing Archive page**: `/writing/archive/` with chronological organization  
- **Enhanced PageHeader**: HTML link support with professional underline styling
- **Typography refinements**: 65ch reading width, semantic classes, OpenType features
- **Documentation**: `MEDIA_PAGE_REFACTORING_COMPLETE.md` and `ARCHIVE_SYSTEM_GUIDE.md`

See `private_notes/planning/Changelog.md` for complete details.

## Architecture Overview

### Content System
- **Content Collections**: Type-safe content management in `src/content/`
  - `post/`: Blog posts (MD/MDX) with frontmatter validation
  - `note/`: Short notes/snippets
  - `series/`: Metadata for grouping related posts
  - `research/`: Written articles and essays (content displayed at /research/)
  - `projects/`: Project documentation and case studies (content displayed at /projects/)
  - `writing/`: Creative writing and storytelling (content displayed at /writing/)
- **Dynamic Routes**: File-based routing in `src/pages/` generates:
  - Individual post/note pages
  - Tag filtering pages
  - Series collection pages
  - Research, projects, and writing collection pages
  - Dynamic OG images via Satori

### Key Integrations
1. **Rehype Pretty Code**: Syntax highlighting with rose-pine themes
2. **Tailwind Typography**: Prose styling with custom configuration
3. **Webmentions**: Social interactions support

### Component Architecture
- **Layouts** (`src/layouts/`): Base layout wraps all pages, specialized layouts for posts/series
- **Components** (`src/components/`): Organized by feature (blog/, layout/, note/)
- **Utilities** (`src/utils/`): Helper functions for content processing and formatting

### Styling System
- CSS variables for theming in `src/styles/global.css`
- Tailwind configuration with extensive typography customization
- Dark/light mode toggle with system preference detection
- Custom admonition blocks for callouts

### Configuration Points
- `astro.config.ts`: Site URL and integration settings
- `src/site.config.ts`: Site metadata, navigation menu
- `src/components/SocialList.astro`: Social media links
- Public assets: `icon.svg`, `social-card.png` need customization

## Typography Enhancement Focus

### Current Typography System
- **Fonts**: Newsreader (serif headings), IBM Plex Sans (body text), IBM Plex Mono (code)
- **Fluid Typography**: Responsive type scale using `tailwindcss-fluid-type` plugin
- **Grid System**: 6px grid unit with 24px baseline for vertical rhythm
- **Themes**: Both light/dark modes with CSS variables
- **Code Highlighting**: Rehype Pretty Code with rose-pine themes

#### Typography Scale (Fluid)
- `text--2` to `text-6`: Smoothly scales between 320px and 1280px viewports
- Base size (`text-0`): 15px mobile → 17px desktop
- Scale ratio: 1.25 (major third)

#### Spacing System
- **Grid Unit**: 6px (`--grid-unit: 0.375rem`)
- **Baseline**: 24px (`--baseline: 1.5rem`)
- **Scale**: `space-1` (6px) through `space-24` (144px)
- **Usage**: Tailwind utilities (`p-4`, `mt-8`, etc.) map to grid values

### Typography Enhancement Strategy

#### Phase 1: Foundation
1. Audit current typography in `src/styles/global.css`
2. Extend Tailwind config with custom fluid type scale
3. Enhance CSS custom properties for typography control
4. Optimize font loading strategy

#### Phase 2: Component Enhancement
- Enhance `BlogPost.astro` layout for optimal reading (65ch measure)
- Create typography components within existing structure
- Improve prose styling for MDX content
- Enhance code block typography

#### Phase 3: Feature Addition
- Add typography showcase page
- Implement drop caps, pull quotes, sidenotes
- Create custom MDX components for typography
- Enhance mobile typography with fluid scaling

### Key Typography Files
1. **`src/styles/global.css`**: Base typography, CSS variables, fluid type
2. **`src/layouts/BlogPost.astro`**: Reading optimization, spacing, rhythm
3. **`tailwind.config.mjs`**: Typography scale, font families, prose customization
4. **`src/pages/og-image/[slug].png.ts`**: Typography in generated OG images

### Typography Guidelines
- **Reading Measure**: Target 65ch for body text, 45ch narrow, 75ch wide
- **Type Scale**: Use fluid typography with clamp() for responsive scaling
- **Font Loading**: Preload critical fonts, use font-display: swap
- **Dark Mode**: Adjust font weights and contrast for optimal readability
- **Performance**: Minimize CLS, optimize font loading, keep CSS minimal

### Typography Implementation Examples

#### Tailwind Config Extension (tailwind.config.mjs)
```javascript
theme: {
  extend: {
    fontSize: {
      // Custom fluid type scale
      'xs': ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', '1.5'],
      'sm': ['clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', '1.5'],
      'base': ['clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', '1.6'],
      'lg': ['clamp(1.125rem, 1rem + 0.625vw, 1.25rem)', '1.5'],
      'xl': ['clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', '1.4'],
      '2xl': ['clamp(1.5rem, 1.3rem + 1vw, 1.875rem)', '1.3'],
      '3xl': ['clamp(1.875rem, 1.5rem + 1.875vw, 2.25rem)', '1.2'],
      '4xl': ['clamp(2.25rem, 1.75rem + 2.5vw, 3rem)', '1.1'],
    },
    letterSpacing: {
      'tighter': '-0.03em',
      'tight': '-0.02em',
      'normal': '0',
      'wide': '0.02em',
    }
  }
}
```

#### CSS Variables Enhancement (global.css)
```css
:root {
  /* Typography Scale */
  --type-scale-ratio: 1.25;
  --type-base-size: 1.125rem;
  
  /* Reading Measure */
  --measure: 65ch;
  --measure-narrow: 45ch;
  --measure-wide: 75ch;
  
  /* Spacing */
  --space-paragraph: 1.5em;
  --space-section: 3rem;
  
  /* Font Features */
  --font-features-body: "kern", "liga", "clig";
  --font-features-heading: "kern", "liga", "clig", "swsh";
}
```

#### Font Loading Strategy (BaseHead.astro)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/inter-var.woff2" crossorigin>
```

## Development Patterns

### Helper Scripts Policy
When creating utility or helper scripts:
1. **Always place scripts in the `scripts/` directory**:
   - `scripts/migration/` - For content migration tasks
   - `scripts/content/` - For content validation/fixing
   - `scripts/maintenance/` - For general maintenance
2. **Add comprehensive header comments** including:
   - Purpose and what the script does
   - Usage instructions
   - Prerequisites/dependencies
   - Expected output
   - Author and date
3. **Update `scripts/README.md`** with:
   - Script name and location
   - Brief description
   - Usage examples
   - Any important notes
4. **Do NOT leave scripts in the root directory**
5. **Consider adding as npm script** if frequently used

Example header format:
```javascript
#!/usr/bin/env node

/**
 * Script Name
 * ===========
 * 
 * Purpose: What this script does
 * 
 * Usage: node scripts/category/script-name.js [options]
 * 
 * Prerequisites:
 * - List any required dependencies
 * - Environmental requirements
 * 
 * Output:
 * - What the script produces
 * 
 * Author: Claude Assistant
 * Date: Month Year
 */
```

### Educational Approach
When making changes or suggestions:
1. **Explain the Why**: Always explain why a particular approach is chosen
2. **Provide Context**: Give background on Astro/TypeScript/TailwindCSS concepts
3. **Show Examples**: Include before/after code examples when making changes
4. **Document Decisions**: Explain the reasoning behind typography choices
5. **Stack Education**: Teach Astro patterns, TypeScript benefits, TailwindCSS methodology

### Adding Content
1. Create MD/MDX files in appropriate content collections:
   - `src/content/post/` or `src/content/note/` for blog content
   - `src/content/research/` for essays and articles (displayed at /research/)
   - `src/content/projects/` for project documentation and case studies (displayed at /projects/)
   - `src/content/writing/` for creative writing and storytelling (displayed at /writing/)
   - **Why**: Astro's Content Collections provide type safety and automatic routing
   - **Files**: `.md` for basic posts, `.mdx` for interactive components
2. Include required frontmatter (see existing files for schema)
   - **Purpose**: Zod schemas validate metadata at build time
   - **Example**: `title`, `publishDate`, `tags`, `draft` fields
3. Use `draft: true` to hide from production
   - **How**: Build process filters out drafts automatically
4. Test typography rendering in both themes

### Component Development
- Work within existing component structure
  - **Astro Pattern**: `.astro` files for static content, frameworks for interactivity
- Use Tailwind utilities first, custom CSS second
  - **Why**: Utility-first reduces CSS bundle size and ensures consistency
- Ensure dark mode compatibility
  - **Method**: Test with both `dark` and `light` classes on `<html>`
- Test with various content lengths
- Maintain all existing functionality

### Reusable Utilities
- **Panel Toggle Utility** (`src/utils/panelToggle.ts`):
  - TypeScript module for managing show/hide panels (TOC, Series, etc.)
  - Configuration-based initialization with responsive breakpoints
  - Usage: `initializePanelToggle({ panelId, toggleButtonId, breakpoint, visibleClass })`
  - Eliminates duplicate JavaScript across layouts
  - **Why**: DRY principle, type safety, single source of truth for panel behavior

### Custom MDX Components
When creating typography MDX components:
- `<Dropcap>`: Beautiful first letters
  - **Implementation**: Create `.astro` component, import in MDX files
- `<Pullquote>`: Emphasized quotes
  - **Typography**: Larger font size, different styling, proper spacing
- `<Caption>`: Figure and image captions
  - **Accessibility**: Proper semantic HTML with `<figcaption>`
- `<Sidenote>`: Marginal notes
  - **Layout**: CSS Grid or positioned elements for responsive design
- Place in existing component structure
  - **Location**: `src/components/` following existing organization

### Testing Typography Changes
1. Run `pnpm dev` for hot-reload development
   - **What**: Starts Astro dev server with hot module replacement
   - **Why**: Instant feedback on typography changes
2. Test in both light/dark themes
   - **How**: Toggle theme switcher or inspect element and add/remove `dark` class
3. Check all viewports (mobile to desktop)
   - **Tools**: Browser dev tools device simulation
   - **Focus**: Fluid typography scaling with clamp() functions
4. Test long-form posts and short notes
   - **Purpose**: Ensure typography works across different content lengths
5. Verify code blocks and syntax highlighting
   - **Integration**: Rehype Pretty Code with custom themes
7. Test OG image generation
   - **Location**: `src/pages/og-image/[slug].png.ts` uses Satori for dynamic images
8. Review print styles
   - **Method**: Browser print preview, ensure readable typography
9. Monitor performance metrics (CLS, LCP)
   - **Tools**: Lighthouse, Chrome DevTools Performance tab
   - **Focus**: Font loading doesn't cause layout shifts
10. Verify with `pnpm build && pnpm preview`
    - **Purpose**: Test production build with optimizations

## Important Constraints

### DO NOT Change
- Core template structure and file organization
- Existing functionality (webmentions, OG images)
- Content collection schemas
- Build and deployment process

### Typography First Approach
- Every change should enhance typography and readability
- Maintain blog functionality while showcasing typography
- Work within TailwindCSS utility-first philosophy
- Keep customizations maintainable and well-documented

## Context Documentation

### Typography Reference Materials
The `context/` directory contains comprehensive typography references from leading experts:

- **`ambroseharris.md`**: Comprehensive fundamentals from "The Fundamentals of Typography"
- **`bringhurst.md`**: Typographic principles from "The Elements of Typographic Style"
- **`butterick.md`**: Practical typography guidance from "Butterick's Practical Typography"
- **`hochuli.md`**: Detail-oriented approach from "Detail in Typography"
- **`ruder.md`**: Modernist principles from "Typography: A Manual of Design"

**Usage**: Reference these files when making typography decisions or explaining typographic concepts to developers.

### Stack Context for New Developers
When working with this codebase, provide context on:

**Astro Framework**
- **Static Site Generator**: Builds to static HTML/CSS/JS for optimal performance
- **Component Islands**: Only JavaScript needed for interactivity is shipped
- **File-based Routing**: Pages in `src/pages/` become routes automatically
- **Content Collections**: Type-safe content management in `src/content/`

**TypeScript Integration**
- **Strict Mode**: Enabled for better type safety and error catching
- **Zod Schemas**: Content validation (see `src/content/config.ts`)
- **Type Inference**: Astro provides automatic types for content collections

**TailwindCSS Methodology**
- **Utility-First**: Compose designs with utility classes
- **Responsive Design**: Built-in breakpoint system (`sm:`, `md:`, `lg:`, `xl:`)
- **Dark Mode**: Class-based dark mode with `dark:` prefix
- **Typography Plugin**: Extended prose classes for content

### Decision Context
When making changes, document:
1. **Why this approach**: Explain the reasoning behind technical choices
2. **Alternative considered**: What other options were evaluated
3. **Trade-offs**: Performance, maintainability, or complexity considerations
4. **Future implications**: How this affects future development

### Performance Requirements
- Font loading must not impact Core Web Vitals
- CSS additions should be minimal and purposeful
- Maintain excellent Lighthouse scores
- Test build size impact of typography changes

### Git Workflow
- Branch: `feat/typography-enhancement`
- Make incremental, focused commits
- Test all build scripts before committing
- Verify all content collections and URL routes work correctly

### URL Structure Changes (Completed)
1. **Navigation Updates**
   - Changed from Projects/Essays/Experiments to Research/Projects/Writing
   - Updated all navigation links and menu items
   - Consistent branding across all sections

2. **Content Collection Restructure**
   - Renamed collections in `content.config.ts`:
     - `downloads` → `writing` (now displays at /writing/)
     - Collections now match directory names for intuitive structure
   - Updated all page files to use new collection names
   - Migrated existing content to new structure
   - **Content-Collection Alignment**: Collections match their content directories:
     - `/research/` URL shows content from `research` collection (essays/articles)
     - `/projects/` URL shows content from `projects` collection (project documentation)
     - `/writing/` URL shows content from `writing` collection (creative writing)

3. **URL Path Changes**
   - `/downloads/` → `/writing/` (displays creative writing from writing collection)
   - All internal links and references updated
   - SEO-friendly URLs maintained
   - **Content Alignment**: URLs now better match their actual content types

4. **Build Verification**
   - Successful build with all new routes generating correctly
   - OG image generation working for new URL structure

## Recent System Changes

### Jekyll to Astro Migration (January 2025)
- **Successfully migrated ~70 posts** from nathanlane_github_io_archive
- **Migration scripts** now organized in `scripts/migration/`
- **Content validation** integrated into dev workflow:
  - `npm run validate` - Check all posts
  - `npm run fix-content` - Auto-fix issues
  - Automatic validation before `pnpm dev`
- **Enhanced blog navigation**:
  - Search functionality on main posts page
  - Archive page shows all posts by year
  - Index page provides category browsing
- **Script organization**:
  - All utility scripts moved to `scripts/` directory
  - Comprehensive documentation in `scripts/README.md`
  - Clear separation: migration, content, maintenance

### Typography System Overhaul (Completed)
1. **Fluid Typography Migration**
   - Migrated from `src/styles/utopia.css` to `tailwindcss-fluid-type` plugin
   - Base font size reduced from 16-18px to 15-17px using clamp()
   - All header sizes proportionally scaled down
   - Fluid type scale: `text--2` to `text-6` with smooth viewport scaling

2. **Font Updates**
   - Changed from SF Pro Rounded to Newsreader (serif) for headings
   - Changed from SF Pro to IBM Plex Sans for body text
   - Removed old font-face declarations
   - Implemented variable font weights for headers

3. **Blog Layout Improvements**
   - Removed sticky/fixed positioning from blog headers
   - Eliminated overlapping UI elements
   - Reduced icon sizes throughout (h-8 w-8 → h-7 w-7, h-6 w-6 → h-5 w-5)
   - Fixed prose styling removing unwanted hash symbols
   - Changed blog body text from serif to sans-serif

4. **Spacing and Padding Reductions**
   - Inline code: Reduced to `px-1.5 py-0.5`
   - Code block titles: Height reduced from h-10 to h-8
   - Code block lines: Height reduced from h-6 to h-5
   - Aside/admonition blocks: Padding reduced from p-4 to p-3
   - Copy buttons: Size reduced from h-6 to h-5

5. **Header Weight Adjustments**
   - All headers increased by 50-100 font weight
   - h1: 300 → 400, h2: 300 → 350, h3: 350 → 400
   - h4: 400 → 450, h5: 450 → 500, h6: 500 → 550
   - Implemented with font-variation-settings for fine control

### Baseline Grid Enforcement (July 14, 2025)
All core layout components now strictly enforce the 6px baseline grid:
- **Header.astro**: px-4b (24px), gap-5b (30px), h-5b (30px), gap-3b (18px), ml-5b (30px), ms-2b (12px)
- **Footer.astro**: px-4b (24px), gap-3b (18px)
- **Base.astro**: mt-13b (78px), md:mt-5b (30px)

This ensures all spacing values are multiples of the 6px grid unit for perfect vertical rhythm.

6. **Component Fixes**
   - PostPreview: Changed titles from Newsreader to IBM Plex Sans
   - CompactList: Fixed horizontal alignment with `items-baseline`
   - Removed feature-link class from post titles for consistency

### CSS Spacing System (Completed)
**The spacing system has been completely refactored and refined:**

- **Typography-First Approach**: Base spacing now aligns with font metrics (--space-s = --step-0)
- **Semantic Tokens**: Replaced hardcoded values with semantic spacing tokens
- **Moderate Scaling**: Consistent 25-40% progression instead of excessive jumps
- **Line Height**: Improved to 1.6 for optimal readability
- **System Files**: `tailwind.config.ts` (fluid type plugin), component updates
- **Documentation**: Interactive test page at `/spacing-test` and audit files available

### CSS Refactoring Phase 2 (Completed January 30, 2025)
**Major CSS improvements for consistency and maintainability:**

1. **Standardized Focus States**
   - Global `:focus-visible` system with consistent 2px outlines
   - Removed custom focus styles from 15+ components
   - Dark mode and high contrast mode support
   - All interactive elements now use `outline: 2px solid var(--theme-accent)`

2. **Typography Token Migration**
   - Replaced 33 hardcoded font sizes with design tokens
   - Fixed undefined tokens (`var(--text-0)` → `var(--step-0)`)
   - All components now use fluid typography scale
   - Consistent token usage: `--step--2` (smallest) through `--step-6` (largest)

3. **Dead Code Removal**
   - Removed migration comments and obsolete code blocks
   - Cleaned up ~50 lines of commented-out CSS
   - Deleted old import statements and duplicate implementations

### Link Typography System
The codebase uses a context-aware link styling system:
- `inline-link`: For links within prose content
- `nav-link`: For navigation links
- `feature-link`: For featured/prominent links (like headings)
- Regular links: Default styling without special classes

### Header Sizing System (Fixed January 2024)
**Critical Issue Resolved**: Headers appeared as small as body text due to improper theme value references.

#### The Problem
- Headers using `theme('fontSize.4')` tried to access non-existent values
- The `tailwindcss-fluid-type` plugin generates utility classes but doesn't populate the theme object
- Base styles and utility classes conflicted, causing headers to render at incorrect sizes

#### The Solution
1. **Removed fontSize from base h1-h6 styles** - Let utility classes handle all sizing
2. **Updated semantic heading classes** to use proper fluid scale sizes:
   - `.heading-1`: `text-4 sm:text-5` (37-52px)
   - `.heading-2`: `text-3 sm:text-4` (29-41px)  
   - `.heading-3`: `text-2 sm:text-3` (23-33px)
   - `.heading-4`: `text-1 sm:text-2` (18-26px)
   - `.heading-5`: `text-0 sm:text-1` (15-21px)
   - `.heading-6`: Inherits base h6 sizing (12-14px)

#### How Headers Work Now
1. **Raw HTML headers** (`<h1>`, `<h2>`, etc.) without classes:
   - Get font family, weight, and color from base styles
   - Do NOT get explicit font sizes (to avoid conflicts)
   - May appear small without semantic classes

2. **Headers with semantic classes** (`<h1 class="heading-1">`):
   - Get all base styles PLUS fluid type sizing from utility classes
   - Display with proper visual hierarchy
   - Scale responsively between mobile and desktop

3. **Visual Hierarchy** (when using semantic classes):
   - H1: 37-52px (largest, commanding presence)
   - H2: 29-41px (clear section breaks)
   - H3: 23-33px (subsection clarity)
   - H4: 18-26px (detailed structure)
   - H5: 15-21px (same as body on mobile, slightly larger on desktop)
   - H6: 12-14px (smallest, for fine details)

#### Important Usage Notes
- **Always use semantic heading classes** (`.heading-1` through `.heading-6`) for proper sizing
- Raw headers without classes may appear small - this is expected behavior
- The fluid type plugin only generates utilities, it doesn't add theme values
- Headers scale fluidly between 320px (mobile) and 1280px (desktop) viewports

### Button Typography Enhancement (Completed)
1. **New Button Component**
   - Created `src/components/Button.astro` with typography refinements
   - Variable font weights: primary 500→520, secondary 450→480 on hover
   - Dynamic letter-spacing transitions (0.02em→0.045em)
   - Uppercase transformation for small buttons
   - 50ms micro-animations for tactile feedback

2. **Site-wide Button Application**
   - Applied typography refinements to all interactive elements
   - Enhanced navigation links with variable weights
   - Updated icon buttons with consistent styling
   - Improved inline link typography

### Badge Component Updates (Completed)
1. **Typography Refinements**
   - Updated `src/components/Badge.astro` with variable font weights
   - Created `src/components/UpdatedBadge.astro` for "Updated" indicators
   - Uppercase transformation with 0.04em letter-spacing
   - Fixed CSS class errors (removed custom spacing classes)

### ContactBox Transformation (Completed)
1. **From Contact to Navigation**
   - Redesigned from "Get in Touch" to "More" navigation section
   - Vertical list of page links (Research, Projects, Writing, Blog, Documentation, Media)
   - Smaller social links with LinkedIn removed
   - Removed collaboration text for cleaner design

### Media Section Implementation (Completed)
1. **TypeScript Data Structure**
   - Created `src/data/media.ts` with type-safe media items
   - Supports multiple media types (interview, podcast, video, article, press, talk, panel)
   - Year-based organization for easy updates

2. **Media Page and Navigation**
   - Created `/media/` page with icon-based media type indicators
   - Added Media to homepage CompactList (shows latest 3 items)
   - Integrated Media into ContactBox navigation
   - Removed Media from main header navigation

### Homepage Dynamic Content (Completed)
1. **Paper Updates Section**
   - Replaced static projects grid with featured research papers
   - Shows 3 most recent featured papers
   - Dynamic fetching from research collection

2. **Recent Writing Section**
   - Shows latest 2 pieces from writing collection
   - Automatically updates with new content

### Semantic Spacing System (Completed)
1. **Token-based Spacing**
   - Implemented semantic tokens: `space-s`, `space-m`, `space-l`, etc.
   - Typography-aligned spacing (--space-s = --step-0)
   - Moderate scaling with 25-40% progression
   - Replaced hardcoded values throughout codebase

2. **Baseline Grid Utilities**
   - New utilities: `1b` (6px), `2b` (12px), `4b` (24px), etc.
   - All components aligned to 6px grid unit
   - Perfect vertical rhythm maintained

### Typography System Grid Alignment (January 17, 2025)
- **Visual Development Tools**: Added `.show-baseline` class for 24px grid visualization
- **Component Updates**: All components now use grid-aligned *b tokens
- **Prose Spacing**: @tailwindcss/typography plugin refactored with CSS variables
- **Letter-Spacing Utilities**: Added tightest, tighter, wideUpper

### Optical Typography Refinements (January 17, 2025)
- **Body Text**: 0.005em letter-spacing for improved readability
- **Dark Mode**: Off-white text color `hsl(30deg 10% 95% / 0.95)`, reduced font weight (380)
- **Typography Utilities**: caps-generous (0.075em), caps-loose (0.1em), text-small-caps
- **OpenType Features**: Full utilization of font capabilities (kern, liga, calt, ss01)

### JavaScript Optimization (July 17, 2025)
- **Phase 1 - Superfluous Code Removal**:
  - Removed commented-out navigation menu code (24 lines)
  - Removed all console.log and console.error statements from production
  - Deleted scripts that targeted non-existent "buttons-panel" elements
  - Total: ~80 lines of unnecessary JavaScript removed
- **Phase 2 - Panel Toggle Consolidation**:
  - Created reusable `panelToggle.ts` utility with TypeScript configuration
  - Replaced ~236 lines of duplicate toggle code across BlogPost and Series layouts
  - Single source of truth for all panel show/hide functionality
  - Supports responsive breakpoints (md/lg) and visibility classes
- **Impact**: ~270 lines reduced, cleaner production code, better maintainability

### Link System Consolidation (January 30, 2025 - Updated July 21, 2025)
- **Phase 1 - Initial Refactoring** (January):
  - Consolidated from 7 primary link types to 4 in `src/styles/links.css`
  - Primary types: `link-inline`, `link-title`, `link-nav`, `link-footer`
  - Created base classes with inheritance pattern using `@apply`
  - Added utility modifiers with u- prefix
- **Phase 3 - Major Consolidation** (July):
  - Removed all backward compatibility aliases (56 lines)
  - Eliminated unused hover patterns and redundant variables
  - Merged `.link-base` into global `a` rules
  - Removed redundant `data-variant="back"`
  - Updated all components to canonical names (inline-link → link-inline, etc.)
- **Impact**: 30% total reduction in link CSS, zero visual changes, cleaner architecture

## Resources
- [Tailwind Typography Plugin](https://tailwindcss.com/docs/typography-plugin)
- [Fluid Type Scale Calculator](https://www.fluid-type-scale.com/)
- [Modern Font Stacks](https://modernfontstacks.com/)
- [Astro Documentation](https://docs.astro.build/)