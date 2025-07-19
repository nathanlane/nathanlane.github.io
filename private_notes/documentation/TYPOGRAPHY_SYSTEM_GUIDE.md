# Typography System Guide

This guide covers the refined typography system implemented across the site, focusing on the global CSS classes and typographic principles applied to research components and pages.

## Overview

The typography system has been centralized and refined based on principles from typography masters including Ambrose & Harris, Hochuli, Santa Maria, Bringhurst, Ruder, and Butterick. The system emphasizes:

- **Baseline Grid**: 6px unit system for consistent vertical rhythm
- **OpenType Features**: Enhanced kerning, ligatures, and contextual alternates
- **Semantic Classes**: Reusable global classes instead of component-specific styles
- **Accessibility**: High contrast mode support and semantic markup
- **Performance**: Reduced CSS duplication through centralization

## Global Typography Classes

### Research-Specific Classes

#### `.text-publication`
Used for publication information and journal names.
```css
.text-publication {
  font-size: var(--step--1); /* 13-14.4px */
  font-weight: 450;
  line-height: 1.4;
  font-style: italic;
  color: var(--theme-text-light);
  /* OpenType features and spacing */
}
```

**Usage:**
```astro
<div class="text-publication">
  Journal of Economics, Vol. 45, No. 2 (2024)
</div>
```

#### `.link-research-action`
Consistent styling for research action links (View, Download, etc.).
```css
.link-research-action {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--step--1);
  font-weight: 450;
  color: var(--theme-accent-base);
  /* Hover and transition effects */
}
```

**Usage:**
```astro
<a href="/research/paper/" class="link-research-action">
  <span>View Details</span>
  <span aria-hidden="true">→</span>
</a>
```

#### `.text-research-description`
Optimized typography for research paper descriptions.
```css
.text-research-description {
  font-size: var(--step-0); /* 14.4-16px */
  line-height: 1.5;
  color: var(--theme-text);
  max-width: 65ch; /* Optimal reading width */
  /* Enhanced readability features */
}
```

#### `.entry-divider`
Semantic content separation between research entries.
```css
.entry-divider {
  border-bottom: 1px solid var(--theme-color-150);
  padding-bottom: var(--space-4); /* 24px */
  margin-bottom: var(--space-6); /* 36px */
}
```

### Layout and Utility Classes

#### `.featured-title`
Used in the simplified "New and Updated" section.
```css
.featured-title {
  font-size: var(--step-1); /* 15.6-18px */
  font-weight: 400; /* Lighter for minimal appearance */
  line-height: 1.3;
  /* OpenType features for refined display */
}
```

#### `.list-none`
Removes default list styling for custom layouts.
```css
.list-none {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}
```

## Typography Principles Applied

### 1. Hierarchy and Scale
- **Modular Scale**: Using CSS custom properties (`--step-1`, `--step-0`, etc.)
- **Clear Hierarchy**: Different font sizes and weights for different content types
- **Consistent Relationships**: Proportional scaling across all text elements

### 2. Baseline Grid Alignment
- **6px Grid System**: All spacing uses multiples of 6px
- **Vertical Rhythm**: Line heights and margins maintain consistent spacing
- **Grid-Aware Components**: All typography components respect the baseline grid

### 3. OpenType Feature Enhancement
```css
font-feature-settings:
  "kern" 1,      /* Kerning for better character spacing */
  "liga" 1,      /* Ligatures for professional appearance */
  "calt" 1,      /* Contextual alternates */
  "smcp" 1;      /* Small caps for specific elements */
```

### 4. Readability Optimization
- **Optimal Line Length**: Max-width of 65-75 characters for body text
- **Appropriate Line Height**: 1.4-1.6 for body text, tighter for headings
- **Color Contrast**: Meeting WCAG AA standards with theme variables

## Component-Specific Applications

### ResearchEntry.astro
The `ResearchEntry` component has been refactored to use global classes:

```astro
<article class="entry-divider">
  <h3 class="research-title">
    <a href={href} class="link-title">{title}</a>
  </h3>
  
  <div class="text-meta text-meta--light">
    <!-- Metadata with consistent styling -->
  </div>
  
  {publication && (
    <div class="text-publication">{publication}</div>
  )}
  
  {description && (
    <p class="text-research-description">{description}</p>
  )}
  
  <a href={href} class="link-research-action">
    <span>View Details</span>
    <span aria-hidden="true">→</span>
  </a>
</article>
```

### Research Index Page
The "New and Updated" section uses minimal styling:

```astro
<section id="featured" class="mb-16b">
  <h2 class="heading-2 mb-8b">New and Updated</h2>
  <ul class="space-y-3b list-none">
    {papers.map((paper) => (
      <li class="flex items-baseline justify-between gap-4b">
        <span class="featured-title flex-1">{paper.data.title}</span>
        <a href={`/research/${paper.id}/`} class="link-research-action">
          <span>View</span>
          <span aria-hidden="true">→</span>
        </a>
      </li>
    ))}
  </ul>
</section>
```

## Dark Mode Support

All typography classes include dark mode variants:

```css
.text-publication {
  color: var(--theme-text-light);
}

@media (prefers-color-scheme: dark) {
  .text-publication {
    color: var(--theme-text-light-dark);
  }
}
```

## High Contrast Mode

Enhanced accessibility for high contrast preferences:

```css
@media (prefers-contrast: high) {
  .featured-title {
    font-weight: 600;
  }
  
  .link-research-action {
    font-weight: 500;
  }
}
```

## Best Practices

### When to Use Global Classes
- ✅ **Consistent patterns**: Typography that appears across multiple components
- ✅ **Semantic meaning**: Classes that represent content types (publication, description)
- ✅ **Reusable utilities**: Layout helpers like `.list-none`

### When to Use Component-Specific Styles
- ✅ **Unique layouts**: Component-specific positioning and spacing
- ✅ **Interactive states**: Complex hover or focus states specific to one component
- ✅ **Performance-critical**: Styles that need to be co-located with components

### Naming Conventions
- **Content-based**: `.text-publication`, `.text-research-description`
- **Action-based**: `.link-research-action`
- **Utility-based**: `.list-none`, `.entry-divider`
- **Semantic**: Names describe what the content is, not how it looks

## Maintenance

### Adding New Typography Classes
1. **Identify the pattern**: Is this typography used in multiple places?
2. **Choose semantic naming**: Name based on content type or function
3. **Include all variants**: Base, dark mode, high contrast
4. **Document usage**: Add examples to this guide
5. **Test accessibility**: Verify contrast ratios and screen reader compatibility

### Updating Existing Classes
1. **Check usage**: Search codebase for all usages before changes
2. **Maintain backward compatibility**: Don't break existing implementations
3. **Update documentation**: Keep this guide current with changes
4. **Test across contexts**: Verify changes work in all usage scenarios

## Performance Considerations

The centralized typography system provides:
- **Reduced CSS payload**: Less duplicate styles across components
- **Better caching**: Global styles cached once across page loads
- **Faster rendering**: Consistent styles applied efficiently
- **Easier maintenance**: Single source of truth for typography decisions

## Future Enhancements

Planned improvements to the typography system:
- **Variable font support**: When browser support improves
- **Advanced OpenType features**: Stylistic sets and alternates
- **Responsive typography**: Fluid scaling based on viewport
- **Reading preferences**: Support for reduced motion and dyslexia-friendly fonts 