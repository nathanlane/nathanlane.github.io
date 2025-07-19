# TableOfContents Component Guide

## Overview

The TableOfContents component provides an elegant, typography-focused table of contents with dot leaders and optional sequential numbering. It follows the site's document-centric aesthetic with minimal decoration and text as the primary design element.

## Component Interface

```typescript
export interface Props {
  sections: Array<{
    title: string;
    href: string;
    count?: number;
  }>;
  class?: string;
  headerText?: string;
  showHeader?: boolean;
  showNumbers?: boolean;
}
```

## Props

### Required Props

- **`sections`**: Array of sections to display
  - `title`: The display text for the link
  - `href`: The URL or anchor link destination
  - `count`: Optional count or number to display (not currently used)

### Optional Props

- **`class`**: Additional CSS classes to apply to the container
- **`headerText`**: Custom header text (default: "Table of Contents")
- **`showHeader`**: Whether to display the header section (default: `true`)
- **`showNumbers`**: Whether to display sequential numbers (default: `true`)

## Usage Examples

### Basic Table of Contents (with numbers)

```astro
---
import TableOfContents from "@/components/TableOfContents.astro";

const tocSections = [
  { title: "Introduction", href: "#introduction" },
  { title: "Methods", href: "#methods" },
  { title: "Results", href: "#results" },
  { title: "Conclusion", href: "#conclusion" }
];
---

<TableOfContents sections={tocSections} />
```

**Output:**
```
Table of Contents

Introduction ........................... 1
Methods ................................ 2
Results ................................ 3
Conclusion ............................. 4
```

### Simple Link List (no numbers)

```astro
---
const importantLinks = [
  { title: "Email", href: "mailto:email@example.com" },
  { title: "CV", href: "/cv.pdf" },
  { title: "GitHub", href: "https://github.com/username" }
];
---

<TableOfContents 
  sections={importantLinks}
  headerText="Important Links"
  showNumbers={false}
/>
```

**Output:**
```
Important Links

Email ......................................
CV .........................................
GitHub .....................................
```

### Custom Header

```astro
<TableOfContents 
  sections={navigationSections}
  headerText="Quick Navigation"
  class="mt-8"
/>
```

### No Header

```astro
<TableOfContents 
  sections={links}
  showHeader={false}
  showNumbers={false}
/>
```

## Real-World Examples

### About Page Quick Links

```astro
---
import { siteConfig } from "@/site.config";

const tocSections = [
  { title: "Biography", href: "#biography" },
  { title: "Email", href: `mailto:${siteConfig.email}` },
  { title: "Curriculum Vitae", href: siteConfig.resumeUrl || "/cv.pdf" }
];
---

<TableOfContents 
  sections={tocSections} 
  headerText="Quick Links"
/>
```

### Homepage Important Links

```astro
---
const importantLinksSections = contact?.items?.map((item) => ({
  title: item.text,
  href: item.href
})) || [];
---

<TableOfContents 
  sections={importantLinksSections}
  headerText="Important Links"
  showHeader={true}
  showNumbers={false}
/>
```

### Research Index Navigation

```astro
---
const tocSections = [
  { title: "New and Updated", href: "#featured", count: featuredPapers.length },
  { title: "Published Papers", href: "#published", count: publishedPapers.length },
  { title: "Working Papers", href: "#working", count: workingPapers.length },
  { title: "Works in Progress", href: "#wip", count: worksInProgress.length },
  { title: "Curriculum Vitae", href: siteConfig.resumeUrl || "/cv.pdf" }
];
---

<TableOfContents 
  sections={tocSections}
  headerText="Research Navigation"
/>
```

## Design Features

### Typography
- **Header**: Small caps with `--step-1` size (12.8-14.4px)
- **Links**: `--step-0` size (15.6-17px) for optimal readability
- **Numbers**: Tabular figures for consistent alignment

### Visual Elements
- **Dot Leaders**: Hairline border with flex-grow for consistent spacing
- **Sequential Numbering**: Clean numbering without decorative brackets
- **Hover States**: Subtle color transitions with refined interactions

### Accessibility
- **Semantic Markup**: Proper `<nav>` element with ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Support for high contrast mode preferences
- **Screen Readers**: Properly labeled navigation regions

## Styling Customization

### Custom CSS Classes

```css
/* Custom spacing */
.toc-compact .toc-entry + .toc-entry {
  margin-top: var(--space-0); /* Remove spacing */
}

/* Different dot style */
.toc-traditional .toc-dots {
  border-bottom: none;
  background: radial-gradient(circle, currentColor 1px, transparent 1px);
  background-size: 4px 1px;
  background-repeat: repeat-x;
  background-position: 0 50%;
}
```

### Dark Mode Adaptations

The component automatically adapts to dark mode with:
- Adjusted header colors (`--theme-color-300`)
- Muted dot leaders (`--theme-color-800`)
- Refined hover states (`--theme-accent-light`)

## Best Practices

### Content Guidelines
1. **Link Titles**: Keep concise and descriptive
2. **Section Count**: 3-7 items for optimal usability
3. **Hierarchy**: Use for primary navigation, not detailed subsections
4. **External Links**: Mix internal and external links appropriately

### Accessibility Guidelines
1. **Descriptive Text**: Use clear, actionable link text
2. **Header Text**: Choose headers that describe the link collection
3. **Link Context**: Ensure links make sense out of context
4. **Keyboard Testing**: Test all interactions with keyboard only

### Performance Considerations
1. **Dynamic Content**: Use reactive data for sections array
2. **Large Lists**: Consider pagination for 10+ items
3. **External Links**: Be mindful of too many external references

## Component Integration

### With DocumentSection

```astro
<DocumentSection title="">
  <TableOfContents 
    sections={sections}
    headerText="Chapter Navigation"
    showNumbers={true}
  />
</DocumentSection>
```

### In Page Layouts

```astro
<div class="measure-base mx-auto px-4b py-8b">
  <PageHeader title="Research" />
  
  <TableOfContents sections={tocSections} />
  
  <!-- Main content -->
</div>
```

## Related Components

- **DocumentSection**: Container for homepage sections
- **CompactList**: Alternative for simple link lists
- **ContactInfo**: Alternative for contact information display

## Migration from ContactInfo

When replacing ContactInfo with TableOfContents:

```diff
- <ContactInfo variant="default" items={contact?.items} />
+ <TableOfContents 
+   sections={importantLinksSections}
+   headerText="Important Links"
+   showNumbers={false}
+ />
```

Prepare the data:
```diff
+ const importantLinksSections = contact?.items?.map((item) => ({
+   title: item.text,
+   href: item.href
+ })) || [];
```

The TableOfContents component provides elegant, flexible navigation that maintains the site's typography-first aesthetic while offering powerful customization options for various use cases. 