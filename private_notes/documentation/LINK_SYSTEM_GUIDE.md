# Unified Link System Guide

## Overview

The site uses a centralized link system that eliminates scattered hover behaviors and provides consistent, predictable interactions across all components. This system prevents common issues like jarring size changes, conflicting animations, and inconsistent timing.

## The Problem We Solved

### Before: Scattered Chaos
- **20+ different hover implementations** across CSS files
- **Conflicting transition timings** (150ms, 200ms, instant, none)
- **Jarring size changes** (e.g., `text--2` to `text-base` = 30% jump)
- **Transform conflicts** (brightness filters vs color changes)
- **Inconsistent underlines** (borders vs text-decoration)
- **Maintenance nightmare** - hover behaviors scattered everywhere

### After: Unified Control
- **Single source of truth** in `src/styles/links.css`
- **Consistent 200ms timing** across all interactions
- **No size changes** on hover (prevented globally)
- **Predictable color transitions** using CSS variables
- **7 semantic link types** for different use cases

## Core Architecture

### CSS Variables
```css
:root {
  --link-transition: color 200ms ease, text-decoration-color 200ms ease, font-variation-settings 200ms ease;
  --link-underline-default: hsl(0deg 0% 60%);
  --link-underline-hover: var(--theme-accent-base);
}
```

### Global Anti-Chaos Rules
```css
/* Prevents jarring size changes */
a {
  font-size: inherit !important;
  transform: none;
  transition: var(--link-transition);
}

/* Overrides conflicting utility classes */
a[class*="hover:text-"]:hover {
  font-size: inherit !important;
}
```

## The 7 Link Types

### 1. `.inline-link` - Prose Links
**Use for**: Body text, article content, reading flow links

```html
<p>Read more about <a href="/topic" class="inline-link">typography principles</a> here.</p>
```

**Behavior**: Underline darkens, slight weight increase

### 2. `.nav-link` - Navigation Links  
**Use for**: Header nav, menu items, navigation elements

```html
<nav>
  <a href="/about" class="nav-link">About</a>
  <a href="/research" class="nav-link">Research</a>
</nav>
```

**Behavior**: Color to accent, weight increase

### 3. `.feature-link` - Feature Links
**Use for**: Headlines, titles, prominent content links

```html
<h2>
  <a href="/post/title" class="feature-link">Important Article Title</a>
</h2>
```

**Behavior**: Color to accent, weight increase, no underline

### 4. `.action-link` - Action Links
**Use for**: CTAs, downloads, external links, buttons

```html
<a href="/file.pdf" class="action-link">Download PDF ↓</a>
<a href="https://external.com" class="action-link">View Project →</a>
```

**Behavior**: Color to accent, weight increase, supports arrows/icons

### 5. `.subtle-link` - Subtle Links
**Use for**: Secondary actions, "View all" links, quiet interactions

```html
<a href="/archive" class="subtle-link">View all posts</a>
```

**Behavior**: Opacity increase, subtle weight change

### 6. `.back-link` - Back Navigation
**Use for**: Navigation back buttons, breadcrumbs

```html
<a href="/posts" class="back-link">← Back to posts</a>
```

**Behavior**: Color to primary text, weight increase

### 7. `.footer-link` - Footer Links
**Use for**: Footer navigation, simple links

```html
<footer>
  <a href="/privacy" class="footer-link">Privacy Policy</a>
</footer>
```

**Behavior**: Underline appears, color change

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

## Implementation Rules

### Do's ✅
- **Use semantic link classes** for all interactive elements
- **Let the system handle hover behavior** - don't override
- **Size with parent classes** (`text-sm`, `text-lg`) not hover utilities
- **Trust the 200ms timing** - consistent across the site
- **Use `action-link`** for downloads and external links

### Don'ts ❌
- **Never use `hover:text-*` size utilities** - causes jarring jumps
- **Avoid custom transitions** - use the unified system
- **Don't add transforms** unless absolutely necessary
- **No brightness filters** on links - conflicts with color changes
- **Don't override font-size in hover states**

## Common Patterns

### Download Links
```html
<!-- Before: jarring size change -->
<a href="/file.pdf" class="text--2 text-light hover:text-base">Download ↓</a>

<!-- After: smooth transition -->
<a href="/file.pdf" class="action-link text--1">Download ↓</a>
```

### Navigation Headers
```html
<!-- Before: conflicting styles -->
<a href="/section" class="text-lg hover:text-accent transition-all">Section</a>

<!-- After: semantic clarity -->
<a href="/section" class="feature-link text-lg">Section</a>
```

### Body Text Links
```html
<!-- Before: custom styling -->
<a href="/more" class="underline hover:no-underline text-blue-600">Read more</a>

<!-- After: prose integration -->
<a href="/more" class="inline-link">Read more</a>
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

- **`src/styles/links.css`** - Main unified link system
- **`src/styles/homepage-links.css`** - Extensions that map to main system
- **`src/styles/global.css`** - Contains global anti-chaos rules

## Future Maintenance

### Adding New Link Types
1. Add to `src/styles/links.css` following the established pattern
2. Include in focus states, dark mode, and high contrast sections
3. Document in this guide with usage examples
4. Update TYPOGRAPHY_EXAMPLES.md

### Preventing Regressions
- The global `a` rules prevent most accidental overrides
- All size-changing utilities are blocked with `!important`
- Code reviews should check for custom hover implementations
- Test suite should verify consistent timing and behavior

---

*Last updated: January 28, 2025* 