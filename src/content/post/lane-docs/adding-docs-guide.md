---
title: "Guide: Adding Documentation Pages"
publishDate: "2025-01-14"
description: "Step-by-step guide for adding new pages to the documentation"
seriesId: lane-docs
orderInSeries: 10
tags: ["documentation", "guide", "tutorial"]
---

# Adding New Documentation Pages

This guide explains how to add new pages to the Lane Docs documentation system.

## Quick Start

1. Create a new `.md` file in `/src/content/post/lane-docs/`
2. Add the required frontmatter
3. Write your content in Markdown
4. The page automatically appears in the docs sidebar

## Step-by-Step Instructions

### 1. Create the File

Create a new markdown file in the docs folder:
```
src/content/post/lane-docs/your-new-page.md
```

### 2. Add Frontmatter

Every documentation page needs this frontmatter at the top:

```yaml
---
title: "Your Page Title"
publishDate: "2025-01-14"
description: "Brief description of what this page covers"
seriesId: lane-docs
orderInSeries: 15
tags: ["documentation", "your-topic"]
---
```

#### Frontmatter Fields Explained:
- **title**: Appears in the sidebar and as the page heading
- **publishDate**: Publication date (YYYY-MM-DD format)
- **description**: Used in SEO and page previews
- **seriesId**: Must be `lane-docs` to appear in documentation
- **orderInSeries**: Controls position in sidebar (lower numbers appear first)
- **tags**: Optional tags for categorization

### 3. Write Your Content

Use standard Markdown syntax:

```markdown
# Main Heading

Introduction paragraph explaining the topic.

## Section Heading

Your content here with **bold** and *italic* text.

### Subsection

- Bullet points
- More points

1. Numbered lists
2. Also work

\`\`\`javascript
// Code blocks with syntax highlighting
const example = "Hello docs!";
\`\`\`
```

### 4. Sidebar Order

The `orderInSeries` number determines the position in the sidebar:
- 0-9: Getting Started section
- 10-19: Guides and tutorials
- 20-29: Reference documentation
- 30+: Advanced topics

Current ordering:
- 0: Documentation Index
- 1: Introduction
- 2: Setup Guide
- 3: Theme Customization
- 4: Design System Overview
- 5: Typography System
- 6: Grid System Plan
- 7: Color System
- 8: Font System
- 10: This guide

### 5. Preview Your Changes

1. Run the development server: `pnpm dev`
2. Navigate to your new page at `/posts/lane-docs/your-new-page/`
3. Check that it appears in the sidebar when viewing any docs page

### 6. Advanced Features

#### Adding Code Examples
Use triple backticks with language specification:
\`\`\`typescript
interface Props {
  title: string;
  description?: string;
}
\`\`\`

#### Including Images
Place images in `/public/images/docs/` and reference them:
```markdown
![Alt text](/images/docs/your-image.png)
```

#### Creating Admonitions
Use the built-in admonition syntax:
```markdown
:::note
Important information here
:::

:::warning
Warning message here
:::
```

#### Internal Links
Link to other docs pages:
```markdown
See the [Typography System](/posts/lane-docs/typography-system/) for more details.
```

## Best Practices

1. **Keep titles concise** - They appear in the sidebar
2. **Use descriptive file names** - They become part of the URL
3. **Order thoughtfully** - Group related content with similar order numbers
4. **Include examples** - Show, don't just tell
5. **Cross-reference** - Link to related documentation

## Troubleshooting

### Page Not Appearing
- Check that `seriesId: lane-docs` is in frontmatter
- Ensure file is in `/src/content/post/lane-docs/`
- Restart dev server if needed

### Wrong Order in Sidebar
- Adjust `orderInSeries` number
- Remember: lower numbers appear first

### Formatting Issues
- Check markdown syntax
- Ensure code blocks are properly closed
- Validate frontmatter YAML syntax

## Next Steps

After adding your documentation:
1. Update the index page if it's a major section
2. Add cross-references from related pages
3. Test all links work correctly
4. Commit your changes