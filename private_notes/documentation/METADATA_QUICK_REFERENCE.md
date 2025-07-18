# Metadata System Quick Reference

## Basic Import & Usage

```astro
---
import MetadataLine from '@/components/MetadataLine.astro';
---

<MetadataLine items={[
  { text: "Research" },
  { text: "Dec 2024" },
  { text: "Nathan Lane" }
]} />
```

## Common Patterns

### Research Papers
```astro
<MetadataLine items={[
  { text: "RESEARCH" },
  { text: formatDate(paper.date) },
  { text: paper.status.toUpperCase() },
  { text: paper.authors }
]} />
```

### Media Appearances
```astro
<MetadataLine items={[
  { text: item.outlet, href: item.link },
  { text: item.type.toUpperCase() },
  { text: formatDate(item.date) }
]} variant="light" />
```

### Blog Posts
```astro
<MetadataLine items={[
  { text: "BLOG POST" },
  { text: formatDate(post.publishDate) },
  ...(post.featured ? [{ text: "FEATURED", type: "dark" }] : [])
]} />
```

### Writing with Links
```astro
<MetadataLine items={[
  { text: "ESSAY" },
  { text: formatDate(piece.publishDate) },
  { text: piece.genre?.toUpperCase() },
  { text: "Author Name", href: "/about" }
]} separator="·" />
```

## Props Cheat Sheet

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{text, type?, href?}>` | Required | Metadata items |
| `variant` | `'light' \| 'dark'` | `'light'` | Global styling |
| `separator` | `string` | `'•'` | Between items |
| `class` | `string` | `''` | Additional CSS |

## Item Types

| Type | Usage | Weight | Color |
|------|-------|--------|-------|
| `light` | Default, elegant | 400 | Muted |
| `dark` | Emphasis, featured | 500 | Darker |

## Variants

| Variant | Use Case | Example |
|---------|----------|---------|
| `light` | Regular content | Research papers, blog posts |
| `dark` | Emphasized content | Featured articles, important status |

## Legacy Support

Old classes automatically map to new system:
- `primary` → `dark`
- `secondary` → `light`  
- `tertiary` → `light`

## Separators

| Character | Usage |
|-----------|-------|
| `•` | Default (bullet) |
| `·` | Alternative (middot) |
| `/` | Paths/hierarchies |
| `\|` | Strong separation |

## Responsive Behavior

- **Mobile**: Automatically smaller text (`var(--step--2)`)
- **Wrapping**: Flexbox prevents orphaned separators
- **Long text**: Natural line breaks, separators stay with preceding items

## Performance Tips

✅ **Do:**
- Use MetadataLine component for most metadata (except ResearchEntry which uses custom implementation)
- Keep items array minimal
- Use consistent date formatting
- Link strategically (outlets, authors)

❌ **Avoid:**
- Manual span/div construction (except for specialized cases like ResearchEntry)
- Inline styles
- Excessive linking
- Mixed separator styles within same context

## Component Exceptions

### ResearchEntry.astro
Uses custom `.research-metadata-custom` implementation for precise typography control:
```astro
<div class="research-metadata-custom mb-2b">
  {metadataItems.map((item, index) => (
    <>
      <span class="metadata-item">{item.text}</span>
      {index < metadataItems.length - 1 && (
        <span class="metadata-separator" aria-hidden="true">•</span>
      )}
    </>
  ))}
</div>
``` 