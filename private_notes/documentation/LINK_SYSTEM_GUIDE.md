# Unified Link System Guide

## Overview

The site uses a centralized link system that eliminates scattered hover behaviors and provides consistent, predictable interactions across all components. This system prevents common issues like jarring size changes, conflicting animations, and inconsistent timing.

**Latest Update (July 21, 2025)**: Consolidated from 7 types to 4 canonical types with 30% code reduction while maintaining all visual behaviors.

## The Problem We Solved

### Before: Scattered Chaos
- **20+ different hover implementations** across CSS files
- **Conflicting transition timings** (150ms, 200ms, instant, none)
- **Jarring size changes** (e.g., `text--2` to `text-base` = 30% jump)
- **Transform conflicts** (brightness filters vs color changes)
- **Inconsistent underlines** (borders vs text-decoration)
- **Maintenance nightmare** - hover behaviors scattered everywhere

### After: Unified Control (Consolidated July 2025)
- **Single source of truth** in `src/styles/links.css`
- **Consistent 200ms timing** across all interactions
- **No size changes** on hover (prevented globally)
- **Predictable color transitions** using CSS variables
- **4 canonical link types** (reduced from 7)
- **Data-attribute variant system** for flexible extensions
- **Utility classes with u- prefix** for common modifiers
- **30% smaller CSS footprint** with zero visual changes

## Core Architecture

### Semantic CSS Variables (20+ tokens)
```css
:root {
  /* Transition timing */
  --link-transition: color 200ms ease, text-decoration-color 200ms ease, 
                     font-variation-settings 200ms ease, border-color 200ms ease, 
                     opacity 200ms ease;
  
  /* Link colors */
  --link-color-default: inherit;
  --link-color-nav: var(--theme-color-600);
  --link-color-hover: var(--theme-accent-base);
  --link-color-editorial: var(--theme-accent-base); /* Enhanced prominence */
  
  /* Underline properties */
  --link-underline-color-default: hsl(0deg 0% 60%);
  --link-underline-color-hover: var(--theme-accent-base);
  --link-underline-thickness-default: 1px;
  --link-underline-thickness-hover: 1.5px;
  
  /* Font weights - no changes on hover */
  --link-weight-default: 400;
  --link-weight-nav: 450;
  --link-weight-title: 500;
  --link-weight-hover: 450; /* deprecated - no longer used */
  --link-weight-nav-hover: 500; /* deprecated - no longer used */
  --link-weight-title-hover: 550; /* deprecated - no longer used */
}
```

### Global Anti-Chaos Rules
```css
/* Single source of truth for ALL links */
a {
  font-size: inherit !important;
  transform: none;
  transition: var(--link-transition);
  position: relative;
  min-height: 24px;
  text-underline-offset: var(--link-underline-offset-default);
  text-decoration-thickness: var(--link-decoration-thickness-default);
  text-decoration-skip-ink: auto;
}

/* Unified focus states */
a:focus-visible {
  outline: 2px solid var(--theme-accent);
  outline-offset: var(--space-0 0.5);
  border-radius: 2px;
}

/* Overrides conflicting utility classes */
a[class*="hover:text-"]:hover {
  font-size: inherit !important;
}
```

## The 4 Canonical Link Types

*Consolidated from 7 types in July 2025, removing action-link, subtle-link, back-link, and merging their functionality into data-variants*

### 1. `.link-inline` - Prose & Body Text Links
**Use for**: Body text, article content, reading flow links

```html
<p>Read more about <a href="/topic" class="link-inline">typography principles</a> here.</p>
```

**Behavior**: 
- Always underlined (default gray → accent on hover)
- Font weight: 400 (no change on hover)
- Underline thickness increases: 1px → 1.5px
- Color changes to accent on hover

### 2. `.link-nav` - Navigation & UI Links  
**Use for**: Header nav, menu items, navigation elements, CTAs, actions

```html
<nav>
  <a href="/about" class="link-nav">About</a>
  <a href="/research" class="link-nav">Research</a>
</nav>

<!-- With variants -->
<a href="/archive" class="link-nav" data-variant="subtle">View all posts</a>
<a href="/posts" class="link-nav" data-variant="back">← Back to posts</a>
<a href="/download.pdf" class="link-nav" data-variant="action">Download PDF ↓</a>
```

**Behavior**: 
- No underline (clean UI appearance)
- Font weight: 450 (no change on hover)
- Color: theme-color-600 → accent on hover
- Letter spacing: 0.02em for improved readability

**Data Variants**:
- `data-variant="subtle"`: Lower opacity (0.8), lighter weight (400)
- `data-variant="back"`: Standard nav behavior, often paired with arrows
- `data-variant="action"`: Flex container for icons/arrows

### 3. `.link-title` - Headings & Featured Content
**Use for**: Headlines, titles, prominent content links

```html
<h2>
  <a href="/post/title" class="link-title">Important Article Title</a>
</h2>
```

**Behavior**: 
- No underline by default (clean headlines)
- Shows underline on hover (0.05em thick, 0.2em offset)
- Font weight: 500 (no change on hover)
- Color: inherit → accent on hover
- Maintains heading typography while adding clear hover feedback

### 4. `.link-footer` - Footer Links with Border Effect
**Use for**: Footer navigation, links needing border-bottom effect

```html
<footer>
  <a href="/privacy" class="link-footer">Privacy Policy</a>
</footer>
```

**Behavior**: 
- Border-bottom instead of text-decoration
- Border: transparent → currentColor on hover
- Font weight: 400 (no change on hover)
- Unique visual treatment for footer context

### 5. `.link-inline[data-variant="editorial"]` - Editorial Prose Links
**Use for**: Prominent links in editorial content, special prose contexts

```html
<!-- In prose where you want editorial style -->
<p>
  Read more about <a href="/research" class="link-inline" data-variant="editorial">my research</a> 
  in economics and technology.
</p>
```

**Behavior**: 
- Hair-thin underline (0.05em) with generous offset (0.2em)
- Bold accent color for prominence
- Fixed font weight: 450 (no animation or size changes)
- Subtle underline thickening on hover (0.05em → 0.075em)
- Follows Jason Santa Maria's approach: color + refined underlines

**Note**: PageHeader component applies this style to all links by default, so no need to add the variant class within PageHeader.

## Migration Guide

### ❌ Old Problematic Patterns
```html
<!-- Size changes on hover -->
<a href="#" class="text-sm hover:text-base">Bad Link</a>

<!-- Conflicting transitions -->
<a href="#" class="transition-all transform hover:scale-105">Bad Link</a>

<!-- Brightness filters -->
<a href="#" class="filter hover:brightness-110">Bad Link</a>

<!-- Mixed approaches -->
<a href="#" class="border-b hover:border-accent transition-colors">Bad Link</a>
```

### ✅ New Unified Patterns
```html
<!-- Clean semantic classes -->
<a href="#" class="action-link text-sm">Good Link</a>
<a href="#" class="feature-link">Good Link</a>
<a href="#" class="inline-link">Good Link</a>
<a href="#" class="subtle-link">Good Link</a>
```

## Utility Modifiers (u- prefix)

### Available Utilities
```html
<!-- Underline variations -->
<a href="#" class="link-nav u-underline-thin">Thin underline</a>
<a href="#" class="link-nav u-hover-underline">Underline on hover only</a>

<!-- External links with icons -->
<a href="https://external.com" class="link-nav u-with-icon">
  External Link
  <svg>...</svg>
</a>

<!-- Size modifiers -->
<a href="#" class="link-nav" data-size="small">Small navigation link</a>
```

### Utility Classes:
- `.u-underline-thin`: Thin underline with accent color
- `.u-hover-underline`: No underline until hover
- `.u-with-icon`: Flex container with icon gap
- `[data-size="small"]`: Smaller font size for compact contexts

## Implementation Rules

### Do's ✅
- **Use canonical link classes** (link-inline, link-nav, link-title, link-footer)
- **Apply data-variant attributes** for nav link variations
- **Use utility classes with u- prefix** for additional behaviors
- **Let the system handle hover behavior** - don't override
- **Size with parent classes** (`text-sm`, `text-lg`) not hover utilities
- **Trust the 200ms timing** - consistent across the site

### Don'ts ❌
- **Never use `hover:text-*` size utilities** - causes jarring jumps
- **Avoid custom transitions** - use the unified system
- **Don't add transforms** unless absolutely necessary
- **No brightness filters** on links - conflicts with color changes
- **Don't override font-size in hover states**
- **Don't mix old class names** with new canonical ones

## Common Patterns

### Download Links
```html
<!-- Before: jarring size change -->
<a href="/file.pdf" class="text--2 text-light hover:text-base">Download ↓</a>

<!-- After: smooth transition with action variant -->
<a href="/file.pdf" class="link-nav text--1" data-variant="action">Download ↓</a>
```

### Navigation Headers
```html
<!-- Before: conflicting styles -->
<a href="/section" class="text-lg hover:text-accent transition-all">Section</a>

<!-- After: semantic clarity -->
<a href="/section" class="link-title text-lg">Section</a>
```

### Body Text Links
```html
<!-- Before: custom styling -->
<a href="/more" class="underline hover:no-underline text-blue-600">Read more</a>

<!-- After: prose integration -->
<a href="/more" class="link-inline">Read more</a>
```

### Subtle Secondary Links
```html
<!-- Before: custom opacity handling -->
<a href="/archive" class="opacity-70 hover:opacity-100">View all</a>

<!-- After: semantic variant -->
<a href="/archive" class="link-nav" data-variant="subtle">View all</a>
```

### Back Navigation
```html
<!-- Before: mixed approaches -->
<a href="/posts" class="flex items-center gap-2 hover:text-primary">← Back</a>

<!-- After: clear intent -->
<a href="/posts" class="link-nav" data-variant="back">← Back to posts</a>
```

## Debugging Link Issues

### Size Changes on Hover
**Problem**: Link text jumps in size
**Solution**: Remove `hover:text-*` utilities, use semantic classes

### Conflicting Animations  
**Problem**: Multiple transition effects fighting
**Solution**: Remove custom transitions, let unified system handle

### Inconsistent Timing
**Problem**: Some links feel faster/slower than others
**Solution**: All links now use 200ms - check for custom overrides

### Color Not Changing
**Problem**: Hover color not working
**Solution**: Ensure CSS variables are defined, check dark mode

## Testing Checklist

- [ ] No size changes on any hover interactions
- [ ] All links use 200ms transition timing
- [ ] Colors follow consistent accent progression
- [ ] Focus states work for keyboard navigation
- [ ] Dark mode colors are appropriate
- [ ] No transform effects unless intentional
- [ ] Mobile interactions feel natural

## Benefits

### User Experience
- **Predictable interactions** - no surprising behavior
- **Smooth performance** - optimized transitions
- **Accessible focus states** - WCAG compliant
- **Consistent timing** - no jarring speed differences

### Developer Experience  
- **Single source of truth** - all link behavior in one file
- **Conflict prevention** - global rules prevent issues
- **Easy maintenance** - change once, applies everywhere
- **Clear semantics** - obvious which class to use

### Performance
- **Reduced CSS complexity** - fewer conflicting rules
- **Faster rendering** - optimized transition properties
- **Smaller bundle** - eliminated redundant styles
- **Better caching** - centralized system

## Architecture Files

- **`src/styles/links.css`** - Main unified link system with all canonical types
- **`src/styles/global.css`** - Contains global anti-chaos rules for all `<a>` elements

## Harmonized Behaviors (Phase 2B)

### Consistent Hover Colors
- **All links** now hover to `--theme-accent-base` color
- Previously inconsistent: some to `--theme-text`, some to `--theme-accent`
- Creates unified brand experience across all link types

### No Weight Changes on Hover
- **All links** maintain consistent weight on hover
- Prevents jarring size shifts during interaction
- Better reading experience without text reflow

### Four Distinct Underline Patterns
1. **Always underlined**: `.link-inline` (prose links)
2. **Never underlined**: `.link-nav` (navigation links)
3. **Underline on hover**: `.link-title` (headers/titles), `.u-hover-underline` utility
4. **Border effect**: `.link-footer` (uses border-bottom)

## Consolidation Details (July 2025)

### What Was Removed
- **56 lines of backward compatibility aliases**
- **25 lines of unused hover pattern classes**
- **Redundant CSS variables**: `--link-color-active`, `--link-decoration-thickness-default`
- **`.link-base` class**: Functionality merged into global `a` rules
- **`data-variant="back"`**: Now uses default hover behavior

### What Was Preserved
- **All visual behaviors remain identical**
- **Minimal aliases kept temporarily for build compatibility**
- **All 4 underline patterns maintained**
- **No weight changes on hover**

## Future Maintenance

### Adding New Link Types
1. Define new class in `@layer components` section
2. Use semantic CSS variables for all properties
3. Follow the +50 weight hover pattern
4. Include focus states and dark mode support
5. Document with usage examples

### Preventing Regressions
- Global `a` rules prevent most accidental overrides
- All size-changing utilities blocked with `!important`
- Consistent use of CSS variables ensures theme coherence
- Test all 4 underline patterns when making changes

---

*Last updated: July 21, 2025 - Major consolidation from 7 to 4 types* 