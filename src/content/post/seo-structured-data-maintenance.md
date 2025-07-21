---
title: SEO & Structured Data Maintenance Guide
description: How to maintain and update the structured data implementation for better SEO
publishDate: '2025-07-16'
tags:
  - seo
  - structured-data
  - maintenance
  - documentation
draft: false
seriesId: lane-docs
orderInSeries: 8
---

This guide explains how to maintain the structured data (JSON-LD) implementation that helps search engines understand your content better.

## Quick Reference: What to Update and When

### 1. Personal/Professional Changes

When your professional information changes, update `/src/site.config.ts`:

```typescript
// SEO and structured data fields
jobTitle: "Assistant Professor of Economics", // Update when job title changes
organization: "University of Oxford", // Update when changing institutions
profileImage: "/headshot.jpg", // Update if you change the filename
twitterHandle: "@straightedge", // Update if Twitter handle changes
orcid: "0000-0003-0884-8418", // Your ORCID ID (rarely changes)
socialProfiles: [ // Add/remove social profiles
  "https://twitter.com/straightedge",
  "https://www.linkedin.com/in/drnathanlane/",
  "https://github.com/nathanlane",
  "https://orcid.org/0000-0003-0884-8418"
],
```

### 2. Adding New Content Types

If you add new types of content beyond blog posts and research papers, you'll need to update `/src/components/StructuredData.astro`.

**Example: Adding structured data for project pages**

```typescript
case 'project':
  schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode", // or "CreativeWork" for non-code projects
  "@id": `${siteConfig.siteUrl}${data.url}#project`,
  "name": data.title,
  "description": data.description,
  "author": personSchema,
  "datePublished": data.publishDate,
  "programmingLanguage": data.technologies, // ["Python", "R", etc.]
  "codeRepository": data.github
  };
  break;
```

### 3. Testing Your Structured Data

After making changes, always test your structured data:

1. **Google's Rich Results Test**: https://search.google.com/test/rich-results
  - Enter your URL or paste your HTML
  - Check for errors or warnings
  - Preview how your content might appear in search

2. **Schema.org Validator**: https://validator.schema.org/
  - More technical validation
  - Shows the complete structured data tree

3. **Local Testing**:
  ```bash
  # Build your site
  pnpm build

  # Preview locally
  pnpm preview

  # View page source and search for "application/ld+json"
  ```

## Common Maintenance Tasks

### Updating After Publishing New Content

No action needed! The structured data is automatically generated for:
- New blog posts (using article schema)
- New research papers (using article schema)
- All pages (using website schema)

### Adding Co-authors to Research Papers

Currently, the system only supports a single author (you). To add co-author support:

1. Update the research schema in `/src/content.config.ts` to parse authors
2. Modify the article schema in `StructuredData.astro` to handle multiple authors

### Changing Image Paths

If you reorganize where images are stored:
1. Update `profileImage` in `site.config.ts`
2. Update any OG image generation logic if paths change

## What Each Schema Does

### Website Schema
- **Purpose**: Tells Google about your site structure
- **Benefits**: Can enable sitelinks search box in Google results
- **Maintenance**: Rarely needs updates

### Article Schema
- **Purpose**: Rich snippets for blog posts and papers
- **Benefits**: Shows publish date, author, reading time in search
- **Maintenance**: Automatic for new content

### Person Schema
- **Purpose**: Establishes your identity as author
- **Benefits**: Knowledge panel potential, author attribution
- **Maintenance**: Update when professional info changes

### Breadcrumb Schema
- **Purpose**: Shows page hierarchy
- **Benefits**: Breadcrumb trail in search results
- **Maintenance**: Automatic based on URL structure

## Troubleshooting

### Structured Data Not Appearing
1. Check browser console for JavaScript errors
2. View page source and search for `application/ld+json`
3. Ensure the component is imported in the layout

### Validation Errors
1. Use Google's Rich Results Test to identify issues
2. Common issues:
  - Missing required fields
  - Invalid date formats (use ISO 8601)
  - Broken image URLs

### Changes Not Reflected
1. Clear your build cache: `rm -rf.astro dist`
2. Rebuild: `pnpm build`
3. Google can take days/weeks to update their index

## Best Practices

1. **Keep it Simple**: Don't over-complicate schemas
2. **Be Accurate**: Only include truthful, accurate information
3. **Stay Current**: Update professional info promptly
4. **Test Changes**: Always validate after updates
5. **Monitor Results**: Use Google Search Console to track performance

## Further Resources

- [Google's Structured Data Documentation](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Schema.org Documentation](https://schema.org/)
- [JSON-LD Playground](https://json-ld.org/playground/)
