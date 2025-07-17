# Blog System Guide - Craig Mod-Inspired Design

## Overview

The blog system implements Craig Mod's editorial aesthetic with a 65-character reading measure, generous whitespace, and typography-first design. All spacing follows the 6px baseline grid and uses the established design system.

## Blog Post Structure

### URL Pattern
```
/posts/[slug]/
```

### File Location
```
src/content/post/[slug].md
```

## Creating New Blog Posts

### 1. Content File Structure

Create a new markdown file in `src/content/post/`:

```markdown
---
title: "Your Post Title"  # Max 60 characters!
description: "Brief description for SEO and social sharing"
publishDate: "2025-01-15"  # YYYY-MM-DD format
updatedDate: "2025-01-16"  # Optional, for revised posts
tags: ["economics", "research", "policy"]  # 3-5 tags recommended
draft: false  # Set to true to hide from production
seriesId: "series-name"  # Optional, for post series
ogImage: "/images/blog/custom-image.jpg"  # Optional custom social image
---

Your opening paragraph starts here and will get the elegant drop cap treatment automatically.

This is your second paragraph. The typography system will handle all the beautiful spacing and grid alignment.

## Section Headings

Use standard markdown headings for structure.

---

Horizontal rules create gentle section breaks in the Craig Mod style.

> Pull quotes can be created with blockquotes for emphasis and visual interest.

![Alt text for image](/images/blog/your-image.jpg)
*Image captions are automatically styled in italics*

### Subsection Heading

More content here...
```

### 2. Required Fields

- **title**: Must be ≤60 characters (build will fail if longer)
- **description**: 150-160 characters optimal for SEO
- **publishDate**: YYYY-MM-DD format
- **draft**: false for published posts

### 3. Optional Fields

- **updatedDate**: Shows update badge if different from publishDate
- **tags**: Array of strings for categorization
- **seriesId**: Groups related posts together
- **ogImage**: Custom social sharing image

## Visual Features

### Automatic Styling

The Craig Mod design system automatically applies:

1. **Back Navigation**: "← All Essays" link at top
2. **Essay Title**: Uses heading-3 typography (29.3-33.2px)
3. **Horizontal Separator**: Elegant line under title
4. **Essay Metadata**: "ESSAY • DATE • WORD COUNT • READ TIME"
5. **Drop Cap**: First letter of opening paragraph
6. **Reading Measure**: 65-character line length for optimal readability

### Typography Hierarchy

| Element | Size | Usage |
|---------|------|-------|
| Essay Title | 29.3-33.2px | Main post title |
| Opening Paragraph | 18.8-21.3px | First paragraph (with drop cap) |
| Body Text | 15.6-17px | Regular content |
| Pull Quotes | 23.4-26.6px | Blockquotes for emphasis |
| Captions | 12.8-14.4px | Image captions |
| Metadata | 12.8-14.4px | Date, word count, etc. |

### Spacing System

All spacing uses the 6px baseline grid:

- **Paragraph spacing**: 24px (1 baseline)
- **Section breaks**: 48px (2 baselines)  
- **Major sections**: 72px (3 baselines)
- **Essay wrapper**: 48px vertical, 24px horizontal padding

## Advanced Features

### Series Support

Group related posts using the `seriesId` field:

```yaml
seriesId: "industrial-policy-series"
```

Create the series definition in `src/content/series/`:

```markdown
---
title: "Industrial Policy Series"
description: "A deep dive into historical industrial policy case studies"
---

This series examines...
```

### Custom Images

1. **Blog Images**: Place in `/public/images/blog/`
2. **Social Images**: Use `/public/images/blog/og/` for custom social sharing
3. **Image Sizing**: Minimum 1200px width recommended

### Pull Quotes

Use blockquotes with special CSS class:

```markdown
> This is a regular blockquote.

<blockquote class="pull-quote">
This is a centered pull quote with larger typography and special spacing.
</blockquote>
```

### Section Breaks

#### Horizontal Rules
```markdown
---
```
Creates a subtle 30% width line for gentle section breaks.

#### Asterisms
```astro
import Asterism from "@/components/typography/Asterism.astro";

<Asterism />  <!-- Default: ⁂ -->
<Asterism data-variant="triple">* * *</Asterism>  <!-- Alternative -->
```

## Responsive Design

### Mobile Behavior

- **Wrapper padding**: Reduces to 36px vertical, 18px horizontal
- **Drop cap**: Smaller size for mobile screens
- **Images**: Full-bleed with adjusted margins
- **Navigation**: Maintained for easy browsing

### Desktop Enhancements

- **Reading measure**: Optimal 65-character lines
- **Generous spacing**: Proper baseline grid alignment
- **Typography scaling**: Larger sizes for better readability

## Content Guidelines

### Writing Style

1. **Opening hook**: Strong first paragraph to engage readers
2. **Clear structure**: Use headings to break up content
3. **Visual breaks**: Include images, quotes, or horizontal rules
4. **Conclusion**: End with clear takeaway or call to action

### SEO Best Practices

1. **Title length**: Stay under 60 characters
2. **Description**: 150-160 characters with keywords
3. **Tags**: Use 3-5 relevant tags
4. **Internal links**: Link to related posts and pages
5. **Alt text**: Always include for images

### Image Guidelines

1. **File size**: Optimize for web (WebP preferred)
2. **Dimensions**: Minimum 800px width
3. **Alt text**: Descriptive for accessibility
4. **Captions**: Use italics for image descriptions

## Managing Posts

### Drafts

Set `draft: true` to hide posts from production:

```yaml
draft: true  # Post won't appear in builds
```

### Updates

Add `updatedDate` to show update badge:

```yaml
publishDate: "2025-01-15"
updatedDate: "2025-01-20"  # Shows "Updated" badge
```

### Archives

All posts automatically appear in:
- `/posts/` - Paginated list
- `/posts/archive/` - Complete archive
- `/tags/[tag]/` - Tagged posts

### Series Navigation

Posts in a series automatically show:
- Series panel with related posts
- Previous/next navigation
- Series overview

## Technical Implementation

### File Processing

1. **Markdown**: Standard markdown with frontmatter
2. **Code highlighting**: Automatic syntax highlighting
3. **Reading time**: Auto-calculated from word count
4. **Word count**: Extracted for metadata display

### URL Generation

- **Post URLs**: `/posts/[filename]/`
- **Tag URLs**: `/tags/[tag-name]/`
- **Series URLs**: `/series/[series-id]/`

### Performance

- **Image optimization**: Automatic WebP conversion
- **CSS**: Zero additional weight, uses existing system
- **Typography**: Fluid scaling for all devices
- **Grid alignment**: All spacing follows baseline grid

## Troubleshooting

### Common Issues

**Build fails with title error**
- Solution: Ensure title is ≤60 characters

**Images not showing**
- Solution: Check file path and ensure images are in `/public/images/blog/`

**Spacing looks wrong**
- Solution: Verify CSS variables are correct (no `-b` suffix)

**Drop cap not working**
- Solution: Ensure opening paragraph is first `<p>` element

### Development Testing

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Check for errors
pnpm check
```

## Related Documentation

- [Design System](./DESIGN_SYSTEM.md)
- [Typography Guide](./TYPOGRAPHY_GUIDE.md)
- [Content Management](./CONTENT_GUIDE.md)
- [Deployment Guide](./WEBMASTER_GUIDE.md)

---

The Craig Mod-inspired blog system provides an elegant, readable, and maintainable platform for long-form writing while staying true to your established design system. 