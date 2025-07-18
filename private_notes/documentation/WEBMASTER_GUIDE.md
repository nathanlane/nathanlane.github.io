# Webmaster Guide - nathanlane.github.io

This guide covers everything you need to know to manage and deploy this website after the production readiness improvements.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Configuration Fields](#configuration-fields)
3. [GitHub Actions & CI/CD](#github-actions--cicd)
4. [Deployment](#deployment)
5. [Content Management](#content-management)
6. [Typography & Metadata System](#typography--metadata-system)
7. [Footer Management & Sitemap System](#footer-management--sitemap-system)
8. [Security Headers](#security-headers)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Quick Start

### Local Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Before Deploying
1. Run `pnpm build` to ensure no errors
2. Check that all required fields in `src/site.config.ts` are filled
3. Commit all changes to git
4. Push to GitHub to trigger automated workflows

---

## Configuration Fields

### Site Configuration (`src/site.config.ts`)

All these fields should be properly configured:

```typescript
export const siteConfig: SiteConfig = {
  // Basic Information
  author: "Your Name",              // Your full name
  title: "Your Site Title",         // Site title (used in meta tags)
  description: "Site description",  // Meta description (150-160 chars)
  
  // Contact & Professional
  email: "your@email.com",         // ✨ NEW - Required for contact links
  resumeUrl: "/cv.pdf",            // Path to your CV/resume PDF
  
  // SEO & Social Media
  jobTitle: "Your Job Title",      // Professional title
  organization: "Your Organization", // Company/Institution
  profileImage: "/headshot.jpg",   // Profile photo for structured data
  twitterHandle: "@yourhandle",    // Twitter username (with @)
  orcid: "0000-0000-0000-0000",   // ORCID identifier
  socialProfiles: [                // Social media URLs for SEO
    "https://twitter.com/yourhandle",
    "https://linkedin.com/in/yourprofile",
    "https://github.com/yourusername"
  ],
  
  // Display Options
  showLogo: false,                 // Show/hide logo in header
  showTitle: false,                // Show/hide site title in header
  footerText: "© 2025 Your Name", // Footer copyright text
  
  // Localization
  lang: "en-GB",                   // HTML language code
  ogLocale: "en_GB",               // Open Graph locale
  date: {
    locale: "en-GB",
    options: {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  }
};
```

### Social Links (`src/site.config.ts`)

Configure which social links appear and where:

```typescript
export const socialLinks = [
  {
    friendlyName: "Github",
    link: "https://github.com/yourusername",
    name: "lucide:github",        // Icon name
    showInHero: true,             // Show on homepage hero
  },
  // Add more as needed...
];
```

### Astro Configuration (`astro.config.ts`)

**Important**: Update the site URL for production:

```typescript
export default defineConfig({
  // Change this to your actual domain!
  site: "https://yourdomain.com/",
  
  // Other settings...
});
```

---

## GitHub Actions & CI/CD

### Understanding the Workflows

Two workflows are automatically set up:

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on: Every push and pull request
   - What it does:
     - Type checks TypeScript
     - Runs linting
     - Builds the site
     - Checks for security vulnerabilities

2. **Deploy Workflow** (`.github/workflows/deploy.yml`)
   - Runs on: Pushes to `main` branch
   - What it does:
     - Builds the site
     - Deploys to GitHub Pages

### How to Use CI/CD

1. **Automatic Checks**
   - Push your code to any branch
   - Go to GitHub → Actions tab
   - Watch the CI workflow run
   - ✅ Green = Good to merge
   - ❌ Red = Fix the errors

2. **Automatic Deployment**
   - Merge/push to `main` branch
   - GitHub Actions builds and deploys automatically
   - Check deployment at: `https://[username].github.io/[repository]/`

### Setting Up GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **Deploy from a branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**
5. Your site will be available at: `https://[username].github.io/[repository]/`

### Monitoring Deployments

1. Go to **Actions** tab in your repository
2. Click on the latest workflow run
3. Check for green checkmarks
4. If deployment fails, click into the logs to see errors

---

## Deployment

### Netlify Deployment (Alternative to GitHub Pages)

If using Netlify instead:

1. **Connect Repository**
   - Log into Netlify
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   ```
   Build command: pnpm build
   Publish directory: dist
   ```

3. **Environment Variables**
   - Add any needed environment variables in Netlify UI

### Security Headers

The `public/_headers` file configures security headers for Netlify:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy
- Permissions Policy

**Note**: These headers only work on Netlify. For other hosts, configure headers differently.

---

## Content Management

### Blog Posts

Create new posts in `src/content/post/`:

```markdown
---
title: "Your Post Title" # Max 60 characters!
description: "Post description"
publishDate: "2025-07-16"
tags: ["tag1", "tag2"]
draft: false
---

Your content here...
```

**Important**: Title must be ≤60 characters or build will fail!

### Media Appearances

Add to `src/data/media.ts`:

```typescript
{
  title: "Interview Title",
  outlet: "Publication Name",
  date: "2025-07-16",
  type: "interview", // or "podcast", "article", etc.
  link: "https://example.com/article",
  description: "Optional description"
}
```

### Research Papers

Create in `src/content/research/`:

```markdown
---
title: "Paper Title"
authors: "You, Co-author"
paperDate: "2025"
status: "published" # or "working-paper", "work-in-progress"
publication: "Journal Name"
featured: true # Shows on homepage
description: "Brief description"
---
```

---

## Typography & Metadata System

### Overview

The site uses a sophisticated metadata system based on classical typography principles from master typographers (Bringhurst, Ruder, Hochuli, and Butterick).

### Key Documentation

- **[Complete Guide](METADATA_SYSTEM_GUIDE.md)** - Comprehensive documentation
- **[Quick Reference](METADATA_QUICK_REFERENCE.md)** - Developer cheat sheet

### MetadataLine Component

The unified component for all metadata display:

```astro
import MetadataLine from '@/components/MetadataLine.astro';

<MetadataLine items={[
  { text: "RESEARCH" },
  { text: "Dec 2024" },
  { text: "Author Name", href: "/about" }
]} variant="light" />
```

### Key Features

- **Real small caps** using OpenType features
- **Flexible line breaking** for long metadata
- **Responsive design** with mobile optimization
- **Accessibility support** including high contrast mode
- **Global reusability** across all content types

### Typography Principles Applied

- **Bringhurst**: Subordinated punctuation, real small caps
- **Ruder**: Systematic grey values, consistent relationships
- **Hochuli**: Optimal spacing, optical adjustments
- **Butterick**: Readability-first approach

### Components Using System

- `DocumentEntry.astro` - Research, writing, projects
- `MediaList.astro` - Homepage media section
- `MediaEntry.astro` - Full media pages
- `Writing index` - All writing sections

---

## Footer Management & Sitemap System

### Footer Content Management

The footer is managed through a centralized configuration system for easy maintenance.

#### Primary Configuration File

All footer content is controlled in `src/config/navigation.config.ts`:

```typescript
export const navigationConfig = {
  footer: {
    sections: [
      {
        title: "Here",
        links: [
          { title: "About", href: "/about" },
          { title: "Research", href: "/research" },
          { title: "Writing", href: "/writing" },
          { title: "Blog", href: "/posts" },
          { title: "CV", href: "/cv" },
          { title: "Sitemap", href: "/sitemap.xml" }
        ]
      },
      {
        title: "Elsewhere", 
        links: socialLinks
          .filter(social => ['Github', 'LinkedIn', 'Twitter', 'Bluesky'].includes(social.friendlyName))
          .map(social => ({ title: social.friendlyName, href: social.link }))
      },
      {
        title: "Contact",
        links: [
          { title: "Email", href: `mailto:${siteConfig.email}` },
          { title: "CV", href: "/cv" }
        ]
      },
      {
        title: "About this site",
        links: [
          { title: "Built by me, Nathan Lane, with care using Astro/Tailwind/GitHub Pages, designed with typography in mind.", href: "#" }
        ]
      }
    ]
  }
};
```

#### Best Practices for Footer Management

1. **Use TypeScript Configuration** (recommended over YAML)
   - Type safety and IntelliSense support
   - Auto-completion in your editor
   - Refactoring support across codebase
   - Can reference other config values dynamically

2. **Social Media Integration**
   - Footer social links automatically use `socialLinks` from `src/site.config.ts`
   - Single source of truth prevents duplicates
   - Changes to social media URLs update everywhere

3. **Dynamic Content Support**
   - Reference other config values: `${siteConfig.email}`
   - Automatically updated copyright year: `© ${currentYear} Nathan Lane`
   - Non-clickable descriptive text using `href: "#"`

#### Common Footer Customizations

**Adding New Section:**
```typescript
{
  title: "Resources",
  links: [
    { title: "Data Sources", href: "/data" },
    { title: "Publications", href: "/publications" }
  ]
}
```

**Adding Social Links:**
Edit `src/site.config.ts` `socialLinks` array - changes automatically appear in footer.

### Sitemap System

The site uses a comprehensive multi-sitemap architecture for optimal SEO.

#### Sitemap Structure

1. **Main Sitemap Index** (`/sitemap-index.xml`)
   - References all other sitemaps
   - Entry point for search engines

2. **Content-Specific Sitemaps**
   - `/sitemap-0.xml` - Static pages (home, about, research, etc.)
   - `/sitemap-posts.xml` - Blog posts
   - `/sitemap-research.xml` - Research papers
   - `/sitemap-notes.xml` - Notes

#### Automatic Generation

Sitemaps are automatically generated during build:

```bash
# Development - view at localhost:4321/sitemap-index.xml
pnpm dev

# Production build - creates sitemaps in dist/
pnpm build

# Preview built sitemaps
pnpm preview
```

#### SEO Configuration

Each sitemap includes proper SEO metadata:

- **Priority**: Home (1.0), Research (0.9), Posts (0.8), etc.
- **Change Frequency**: Daily (posts), Weekly (research), Monthly (static pages)
- **Last Modified**: Automatic timestamps

#### Search Engine Submission

1. **Add to robots.txt** (create in `/public/robots.txt`):
   ```
   Sitemap: https://yourdomain.com/sitemap-index.xml
   ```

2. **Submit to Google Search Console**
   - Add sitemap URL: `https://yourdomain.com/sitemap-index.xml`

3. **Validate Sitemaps**
   - [Google Search Console](https://search.google.com/search-console)
   - [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

---

## Security Headers

### Understanding the Headers

The `_headers` file configures:

1. **Content Security Policy (CSP)**
   - Controls which resources can be loaded
   - Prevents XSS attacks
   - Currently allows:
     - Scripts: Self + inline
     - Styles: Self + inline
     - Images: Self + webmention.io
     - Fonts: Self

2. **Other Security Headers**
   - `X-Frame-Options: DENY` - Prevents clickjacking
   - `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
   - `Referrer-Policy` - Controls referrer information

### Modifying CSP

If you need to add external resources:

```
# Example: Adding Google Analytics
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; ...
```

---

## Monitoring & Maintenance

### Regular Tasks

1. **Weekly**
   - Check GitHub Actions for any failed builds
   - Review security alerts in GitHub

2. **Monthly**
   - Update dependencies: `pnpm update`
   - Check for Astro updates
   - Review Google Search Console (if set up)

3. **Quarterly**
   - Run full accessibility audit
   - Check all external links
   - Review and update content

### Common Issues & Solutions

**Build Fails with TypeScript Error**
- Check that all fields in `site.config.ts` are filled
- Run `pnpm run check` locally

**Images Not Showing**
- Ensure images are in `public/` directory
- Use correct paths (start with `/`)

**Deploy Fails**
- Check GitHub Actions logs
- Ensure `astro.config.ts` has correct site URL
- Verify all dependencies are installed

### Performance Monitoring

1. **Lighthouse**
   - Run in Chrome DevTools
   - Aim for 90+ scores
   - Fix any reported issues

2. **Core Web Vitals**
   - Monitor in Google Search Console
   - Keep CLS < 0.1
   - Keep LCP < 2.5s
   - Keep FID < 100ms

---

## Troubleshooting CI/CD

### CI Workflow Failing?

1. **TypeScript Errors**
   ```bash
   pnpm run check  # Run locally to see errors
   ```

2. **Linting Errors**
   ```bash
   pnpm biome lint .  # See what needs fixing
   pnpm biome lint --apply  # Auto-fix issues
   ```

3. **Build Errors**
   ```bash
   pnpm build  # Test build locally
   ```

### Deploy Not Working?

1. **Check Repository Settings**
   - Settings → Pages → Source should be `gh-pages` branch

2. **Check Workflow Permissions**
   - Settings → Actions → General
   - Ensure "Read and write permissions" is enabled

3. **Manual Deploy**
   ```bash
   pnpm build
   pnpm dlx gh-pages -d dist
   ```

---

## Quick Reference

### Commands
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview build
pnpm check        # TypeScript check
pnpm lint         # Run linter
pnpm format       # Format code
```

### Key Files
- `src/site.config.ts` - Main configuration
- `astro.config.ts` - Astro settings
- `public/_headers` - Security headers (Netlify)
- `.github/workflows/` - CI/CD workflows
- `src/data/media.ts` - Media appearances

### URLs to Remember
- Dev: http://localhost:3000
- GitHub Pages: https://[username].github.io/[repository]/
- GitHub Actions: https://github.com/[username]/[repository]/actions

---

## Need Help?

1. Check the [Astro Documentation](https://docs.astro.build)
2. Review error messages in GitHub Actions logs
3. Test locally with `pnpm dev` before pushing
4. Keep this guide handy for reference!

Remember: The CI/CD pipeline catches most issues automatically. If the build passes locally with `pnpm build`, it should deploy successfully!

---

## Related Documentation

For more detailed guides on specific topics:

- **[Footer Configuration Guide](FOOTER_CONFIGURATION_GUIDE.md)** - Comprehensive guide to managing footer content
- **[Metadata System Guide](METADATA_SYSTEM_GUIDE.md)** - Typography and metadata configuration
- **[Blog and Writing Guide](BLOG_AND_WRITING_GUIDE.md)** - Content creation and management