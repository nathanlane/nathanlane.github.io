---
title: "Comprehensive Site Maintenance Guide"
description: "Complete guide for maintaining and updating all aspects of your Lane website"
publishDate: "2025-07-16"
tags: ["maintenance", "documentation", "guide"]
draft: false
seriesId: "lane-docs"
orderInSeries: 2
---

This is your comprehensive guide for maintaining all aspects of your Lane website. This guide covers everything from daily content updates to advanced configuration changes.

## Quick Start: Common Tasks

### Adding New Content

#### Blog Posts
1. Create a new `.md` or `.mdx` file in `/src/content/post/`
2. Include required frontmatter:
   ```yaml
   ---
   title: "Your Post Title"
   description: "Brief description for SEO"
   publishDate: "2025-07-16"
   tags: ["tag1", "tag2"]
   draft: false
   ---
   ```
3. Write your content using Markdown

#### Research Papers
1. Create a new `.md` file in `/src/content/research/`
2. Include research-specific frontmatter:
   ```yaml
   ---
   title: "Paper Title"
   description: "Abstract or summary"
   authors: "You, Co-author Name"
   paperDate: "2025"
   status: "working-paper" # or "published", "work-in-progress"
   type: "paper"
   publication: "Journal Name (optional)"
   link: "https://link-to-paper.com"
   download: "https://download-link.pdf"
   featured: false
   tags: ["economics", "research-topic"]
   ---
   ```

### Updating Personal Information

All personal/professional information is centralized in `/src/site.config.ts`:

```typescript
export const siteConfig = {
  // Basic info
  author: "Nathan Lane",
  title: "Nathan Lane, PhD",
  description: "Nathan Lane, PhD, Economist and Data Scientist",
  
  // Professional info (for SEO/structured data)
  jobTitle: "Assistant Professor of Economics",
  organization: "University of Oxford",
  profileImage: "/headshot.jpg",
  twitterHandle: "@straightedge",
  orcid: "0000-0003-0884-8418",
  
  // Social profiles
  socialProfiles: [
    "https://twitter.com/straightedge",
    "https://www.linkedin.com/in/drnathanlane/",
    "https://github.com/nathanlane",
    "https://orcid.org/0000-0003-0884-8418"
  ],
  
  // Display options
  showLogo: false,
  showTitle: false,
  footerText: "🚀 Astro Theme by Nathan Lane",
};
```

### Updating Homepage Content

Homepage sections are configured in `/src/content/homepage/index.yaml`:

```yaml
showcase:
  title: "What I'm Working On"
  contentSections:
    research:
      title: "Recent Papers"
      itemCount: 3
      viewAllText: "View all research papers"
      viewAllUrl: "/research/"
    writing:
      title: "Recent Writing"
      itemCount: 3
      viewAllText: "View all writing"
      viewAllUrl: "/writing/"
    media:
      title: "Recent Media"
      itemCount: 5
      viewAllText: "View all media"
      viewAllUrl: "/media/"
```

## Site Structure Overview

### Content Collections
- `/src/content/post/` - Blog posts and articles
- `/src/content/research/` - Research papers and academic work
- `/src/content/projects/` - Project documentation
- `/src/content/writing/` - Creative writing
- `/src/content/note/` - Short notes/thoughts
- `/src/content/series/` - Series metadata for grouping content
- `/src/content/pages/` - Static pages (About, etc.)

### Key Configuration Files
- `/src/site.config.ts` - Main site configuration
- `/src/content.config.ts` - Content collection schemas
- `/astro.config.ts` - Astro framework configuration
- `/tailwind.config.ts` - Tailwind CSS configuration
- `/.env` - Environment variables (API keys, etc.)

### Component Locations
- `/src/components/` - Reusable UI components
- `/src/layouts/` - Page layouts (Base, BlogPost, Series)
- `/src/pages/` - Route pages
- `/src/styles/` - Global CSS and typography

## SEO and Structured Data

See the dedicated [SEO & Structured Data Maintenance Guide](./seo-structured-data-maintenance) for:
- Updating structured data schemas
- Testing SEO implementations
- Managing meta tags
- Troubleshooting search appearance

## Typography System

### Font Stack
- **Headings**: Newsreader (serif)
- **Body**: IBM Plex Sans
- **Code**: IBM Plex Mono

### Customizing Typography
Typography settings are in:
1. `/src/styles/global.css` - CSS variables and base styles
2. `/src/styles/utopia.css` - Fluid type scale
3. `/tailwind.config.ts` - Tailwind typography configuration

## Media Appearances

Update media appearances in `/src/data/media.ts`:

```typescript
export const mediaData: Record<number, MediaItem[]> = {
  2025: [
    {
      title: "Article Title",
      outlet: "Publication Name",
      date: "2025-07-16",
      type: "article", // or "podcast", "video", "interview"
      link: "https://link-to-article.com",
      description: "Brief description (optional)"
    },
  ]
};
```

## Development Workflow

### Local Development
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Code quality checks
pnpm lint
pnpm format
pnpm check
```

### Git Workflow
1. Create feature branch: `git checkout -b feat/your-feature`
2. Make changes and test locally
3. Commit with descriptive message
4. Push to GitHub
5. Create pull request if using GitHub workflow

## Troubleshooting Common Issues

### Content Not Appearing
1. Check frontmatter is valid (no syntax errors)
2. Ensure `draft: false` for published content
3. Clear build cache: `rm -rf .astro dist`
4. Restart dev server

### Styling Issues
1. Check Tailwind classes are correct
2. Verify dark mode classes if applicable
3. Check browser console for CSS errors
4. Use browser dev tools to inspect elements

### Build Errors
1. Run `pnpm check` for TypeScript errors
2. Check for missing dependencies
3. Verify all imports are correct
4. Check console output for specific errors

## Advanced Configuration

### Adding New Routes
1. Create new file in `/src/pages/`
2. File path becomes URL route
3. Use `.astro` for static pages
4. Can use `.ts` for API routes

### Extending Content Collections
1. Update schema in `/src/content.config.ts`
2. Add new collection folder in `/src/content/`
3. Create corresponding page routes
4. Update navigation if needed

### Custom Components
1. Create component in `/src/components/`
2. Use `.astro` for static components
3. Import and use in pages/layouts
4. Follow existing naming conventions

## Performance Optimization

### Image Optimization
- Use Astro's Image component
- Provide alt text for accessibility
- Use appropriate formats (WebP, AVIF)
- Lazy load non-critical images

### Font Loading
- Critical fonts are preloaded
- Use `font-display: swap`
- Subset fonts if possible
- Monitor CLS (Cumulative Layout Shift)

### Build Optimization
- Use static generation where possible
- Minimize JavaScript usage
- Enable compression
- Use CDN for assets

## Backup and Recovery

### Regular Backups
1. Git commits serve as version control
2. GitHub stores complete history
3. Consider automated backups of:
   - Media files
   - Generated content
   - Environment variables

### Recovery Process
1. Clone repository: `git clone [repo-url]`
2. Install dependencies: `pnpm install`
3. Restore environment variables
4. Build and deploy

## Getting Help

### Documentation Resources
- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Project-Specific Guides
- [Adding Documentation Pages](./adding-documentation-pages)
- [Understanding the Design System](./design-system)
- [SEO & Structured Data](./seo-structured-data-maintenance)

### Support Channels
- GitHub Issues for bug reports
- Astro Discord for framework questions
- Stack Overflow for general web dev help

Remember: This site is built with maintainability in mind. Most common tasks only require editing content files or configuration, not code changes.