# Link System Usage Guide

## Overview

The nathanlane.github.io link system provides a consistent, harmonized approach to link styling with 4 primary types and several utility modifiers. All links share consistent hover behaviors while maintaining distinct visual patterns for different contexts.

## Link Types

### 1. `link-inline` - Prose and Body Text
**When to use**: Links within paragraphs, articles, or any flowing text content.

```html
<a href="#" class="link-inline">Learn more about typography</a>
```

**Behavior**:
- Always underlined (gray by default)
- Hover: Accent color, thicker underline, weight 400→450
- Best for: Blog content, descriptions, documentation

### 2. `link-nav` - Navigation and UI Elements
**When to use**: Navigation menus, buttons, action links, and UI controls.

```html
<a href="/about" class="link-nav">About</a>
<a href="/posts" class="link-nav" data-variant="back">← Back</a>
<a href="/download" class="link-nav" data-variant="action">Download PDF ↓</a>
```

**Behavior**:
- No underline
- Hover: Accent color, weight 450→500
- Variants:
  - `data-variant="subtle"`: Lower opacity, for secondary navigation
  - `data-variant="back"`: Back navigation links
  - `data-variant="action"`: Action buttons with icons

### 3. `link-title` - Headings and Featured Content
**When to use**: Article titles, card headings, prominent links that need emphasis.

```html
<h2><a href="/post" class="link-title">Article Title</a></h2>
```

**Behavior**:
- No underline by default
- Hover: Accent color, weight 500→550
- Heavier weight for visual hierarchy

### 4. `link-footer` - Footer Links
**When to use**: Footer navigation and links that need subtle separation.

```html
<a href="/privacy" class="link-footer">Privacy Policy</a>
```

**Behavior**:
- Transparent bottom border
- Hover: Accent color, visible border, weight 400→450
- Unique border effect instead of underline

## Utility Modifiers

### `.u-underline-thin`
Adds a thin underline that thickens on hover.

```html
<a href="#" class="link-title u-underline-thin">Featured Article</a>
```

### `.u-hover-underline`
No underline by default, shows underline on hover.

```html
<a href="#" class="u-hover-underline">Hover to reveal underline</a>
```

### `.u-with-icon`
For links with inline icons, provides proper spacing.

```html
<a href="#" class="link-nav u-with-icon">
  <span>External Link</span>
  <span>→</span>
</a>
```

## Harmonized Hover Behaviors

All links follow these consistent patterns:

| Property | Change on Hover |
|----------|----------------|
| **Color** | → `--theme-accent-base` |
| **Weight** | +50 units |
| **Transition** | 200ms ease |

## Examples by Context

### Blog Post List
```html
<!-- Post title -->
<h3 class="text-0">
  <a href="/post" class="u-hover-underline">Post Title</a>
</h3>
```

### Article Content
```html
<p>
  Read more about <a href="#" class="link-inline">typography principles</a> 
  in our comprehensive guide.
</p>
```

### Navigation Menu
```html
<nav>
  <a href="/" class="link-nav">Home</a>
  <a href="/research" class="link-nav" aria-current="page">Research</a>
  <a href="/contact" class="link-nav">Contact</a>
</nav>
```

### Card Components
```html
<article class="card">
  <h3><a href="/project" class="link-title">Project Name</a></h3>
  <a href="/project" class="link-nav" data-variant="action">
    View Project →
  </a>
</article>
```

## Best Practices

1. **Choose the Right Type**: Use semantic link types based on context, not visual preference
2. **Avoid Mixing**: Don't combine multiple primary link classes
3. **Use Utilities Sparingly**: Only add utility modifiers when needed
4. **Maintain Hierarchy**: Use heavier weights (link-title) for more important links
5. **Consider Context**: Footer links in footers, nav links in navigation

## Dark Mode

All link types automatically adapt to dark mode with adjusted colors and opacity. No additional classes needed.

## Backward Compatibility

Legacy class names are supported through aliases:
- `.inline-link` → `.link-inline`
- `.nav-link` → `.link-nav`
- `.feature-link` → `.link-title`
- `.footer-link` → `.link-footer`

However, prefer using the canonical `link-*` classes for consistency.