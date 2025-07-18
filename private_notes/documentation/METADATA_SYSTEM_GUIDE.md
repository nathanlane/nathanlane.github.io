# Metadata System Guide

## Overview

The site uses a unified metadata system based on classical typography principles from master typographers (Bringhurst, Ruder, Hochuli, and Butterick). This system provides consistent, elegant metadata styling across all content types while maintaining excellent readability and accessibility.

## Core Philosophy

### Typography Masters' Principles Applied

**Robert Bringhurst:**
- Real small caps instead of uppercase transformation
- Subordinated punctuation (bullets at reduced opacity)
- Proper kerning and OpenType features

**Emil Ruder:**
- Systematic grey values for visual hierarchy
- Consistent spacing relationships
- Function-driven design decisions

**Jost Hochuli:**
- Optimal letter-spacing for small text readability
- Proper optical adjustments for metadata sizes
- Counter-balance considerations

**Matthew Butterick:**
- Readability-first approach
- Practical sizing for sustained reading
- Technical excellence in implementation

## Component Architecture

### MetadataLine Component

**File:** `src/components/MetadataLine.astro`

A reusable component that handles all metadata display with sophisticated typography and flexible configuration.

#### Basic Usage

```astro
<MetadataLine 
  items={[
    { text: "Research" },
    { text: "Dec 2024" },
    { text: "Nathan Lane" }
  ]}
/>
```

#### Advanced Usage

```astro
<MetadataLine 
  items={[
    { text: "Nature", href: "https://nature.com" },
    { text: "Important", type: "dark" },
    { text: "Regular info" }
  ]}
  variant="light"
  separator="·"
  class="mb-4"
/>
```

### Props Interface

```typescript
interface Props {
  items: Array<{
    text: string;
    type?: 'light' | 'dark' | 'primary' | 'secondary' | 'tertiary'; // Legacy support
    href?: string;
  }>;
  class?: string;
  separator?: string;
  variant?: 'light' | 'dark'; // Global variant override
}
```

## Styling System

### CSS Classes

**Base Class:**
```css
.text-meta {
  /* Enhanced metadata typography following the masters' principles */
  font-feature-settings:
    "kern" 1,       /* Kerning essential at small sizes */
    "smcp" 1,       /* Real small caps */
    "c2sc" 1,       /* Caps to small caps */
    "case" 1,       /* Case-sensitive forms */
    "lnum" 1;       /* Lining figures for metadata */
    
  font-size: var(--step--1); /* 12.8-14.4px */
  font-weight: 450;
  letter-spacing: 0.03em; /* Reduced from 0.05em for readability */
  color: var(--theme-color-500);
  line-height: 1.4;
}
```

**Variants:**
```css
.text-meta--light {
  font-weight: 400;
  color: var(--theme-color-400); /* Lighter, elegant */
}

.text-meta--dark {
  font-weight: 500;
  color: var(--theme-color-600); /* Darker, emphasis */
}
```

**Separators:**
```css
.text-meta__separator {
  opacity: 0.6; /* Subordinate the bullets */
  margin: 0 0.4em; /* Hair space equivalent */
  font-weight: 300; /* Lighter for punctuation */
}
```

## Implementation Examples

### Research Papers

```astro
<MetadataLine items={[
  { text: "RESEARCH" },
  { text: "Dec 2024" },
  { text: "WORKING PAPER" },
  { text: "Réka Juhász, Nathan Lane, Emily Oehlsen, and Verónica C. Pérez" }
]} />
```

### Media Appearances

```astro
<MetadataLine items={[
  { text: "Wall Street Journal", href: "https://wsj.com/article" },
  { text: "INTERVIEW" },
  { text: "Jan 15, 2024" }
]} variant="light" />
```

### Writing with Featured Status

```astro
<MetadataLine items={[
  { text: "ESSAY" },
  { text: "Dec 2024" },
  { text: "FEATURED", type: "dark" } // Override to dark for emphasis
]} variant="light" />
```

### Blog Posts

```astro
<MetadataLine items={[
  { text: "BLOG POST" },
  { text: "Nov 2024" },
  { text: "TECHNICAL" }
]} />
```

## Components Using the System

### DocumentEntry.astro
Used for research papers, writing pieces, and project entries on homepage and archive pages.

### MediaList.astro
Homepage media section with clickable outlet links.

### MediaEntry.astro
Full media page entries with enhanced navigation.

### Writing Index
Current Thinking section with streamlined metadata display.

## Responsive Behavior

### Mobile Optimization
- **Smaller text**: `var(--step--2)` (12.3-13.8px) on screens < 640px
- **Tighter spacing**: Reduced separator margins for mobile
- **Natural wrapping**: Flexbox layout prevents orphaned separators

### Line Breaking Solution
- **Flexbox layout**: `display: flex; flex-wrap: wrap`
- **Semantic grouping**: Separators stay with preceding items
- **No orphaned bullets**: Proper text flow for long metadata

## Accessibility Features

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  .text-meta--light {
    font-weight: 500;
    color: var(--theme-color-600);
  }
  
  .text-meta--dark {
    font-weight: 600;
    color: var(--theme-text);
  }
}
```

### Screen Reader Support
- Semantic HTML structure
- `aria-hidden="true"` for decorative separators
- Proper link structure for connected metadata

### Dark Mode
- Automatic brightness adjustment
- Proper contrast ratios maintained
- Enhanced visibility for metadata elements

## Best Practices

### When to Use Light vs Dark

**Light Variant (Default):**
- Regular content metadata
- Most publication information
- Author lists and dates
- Subtle hierarchy needs

**Dark Variant:**
- Featured content indicators
- Important status information
- Primary navigation elements
- Strong emphasis requirements

### Content Guidelines

**Consistent Formatting:**
- Always use UPPERCASE for document types
- Format dates consistently (e.g., "Dec 2024")
- Use standard separators ("•" default, "·" for alternatives)

**Link Integration:**
- Link outlets in media metadata
- Link author names when profiles exist
- Avoid over-linking (focus on primary navigation)

### Performance Considerations

**OpenType Features:**
- Only essential features enabled
- Optimal for small text rendering
- Cross-browser compatibility maintained

**CSS Efficiency:**
- Single source of truth for all metadata
- Minimal CSS footprint
- No redundant styles across components

## Migration from Old System

### Legacy Support
The new system maintains backwards compatibility with existing type hierarchy:

```css
/* Legacy classes automatically mapped */
.text-meta--primary { @apply text-meta--dark; }
.text-meta--secondary { @apply text-meta--light; }
.text-meta--tertiary { @apply text-meta--light; }
```

### Gradual Adoption
Components can be migrated individually without breaking existing functionality.

## Troubleshooting

### Common Issues

**Long metadata breaking poorly:**
- Ensure using MetadataLine component (not manual spans)
- Check flexbox implementation is active
- Verify separator grouping

**Typography inconsistencies:**
- Confirm OpenType features are supported
- Check font loading and fallbacks
- Verify CSS custom properties are defined

**Accessibility concerns:**
- Test with screen readers
- Verify high contrast mode appearance
- Check keyboard navigation flow

### Browser Support

**Full Support:**
- Modern browsers with OpenType feature support
- CSS custom properties support
- Flexbox implementation

**Fallback Behavior:**
- Graceful degradation for older browsers
- Standard small caps fallback if OpenType unavailable
- Basic flex layout or inline display as fallback

## Future Enhancements

### Planned Features
- Additional separator options
- More granular spacing controls
- Enhanced mobile responsiveness
- Custom variant system

### Extensibility
The system is designed for easy extension while maintaining typography quality and consistency. 