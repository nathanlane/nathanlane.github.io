# Webmaster Guide - nathanlane.github.io

This guide covers everything you need to know to manage and deploy this website after the production readiness improvements.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Configuration Fields](#configuration-fields)
3. [Content Management System (CMS)](#content-management-system-cms)
4. [GitHub Actions & CI/CD](#github-actions--cicd)
5. [Deployment](#deployment)
6. [Content Management](#content-management)
7. [Typography & Metadata System](#typography--metadata-system)
8. [Typography System Guide](#typography-system-guide)
9. [Footer Management & Sitemap System](#footer-management--sitemap-system)
10. [Security Headers](#security-headers)
11. [Secret Detection & Security](#secret-detection--security)
12. [Monitoring & Maintenance](#monitoring--maintenance)

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
3. Update homepage content in `src/content/homepage/index.yaml` as needed
4. Commit all changes to git
5. Push to GitHub to trigger automated workflows

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

## Content Management System (CMS)

The site now includes Decap CMS (formerly Netlify CMS) for easy web-based content editing without touching code.

### Local Development with CMS

To use the CMS locally:

1. **Start the development server**:
   ```bash
   pnpm dev
   ```

2. **Start the CMS proxy server** (in a separate terminal):
   ```bash
   npx decap-server
   ```
   This starts a local server on port 8081 that allows the CMS to read/write your files.

3. **Access the CMS**:
   - Navigate to `http://localhost:4323/admin/`
   - Click "Login" (any email/password works for local development)
   - You'll see all your content collections

### Using the CMS

The CMS provides forms for editing:

- **Blog Posts**: Create/edit posts with title, description, tags, and markdown content
- **Research Papers**: Manage academic publications with authors, status, and abstracts
- **Projects**: Document projects with descriptions and tech stacks
- **Writing**: Creative writing pieces with genre and word count
- **Homepage**: Edit bio, tagline, affiliations, and contact links
- **Series**: Create collections of related posts

### CMS Features

- **Rich Text Editor**: Markdown editing with toolbar for formatting
- **Media Management**: Upload and manage images (saved to `public/images/uploads/`)
- **Draft Support**: Save posts as drafts before publishing
- **Real-time Preview**: See changes as you type
- **Automatic Saving**: Changes are saved to your local files immediately

### Content Structure

All content edits through the CMS follow the same structure as manual edits:
- Blog posts save to `src/content/post/`
- Research papers save to `src/content/research/`
- Homepage content saves to `src/content/homepage/index.yaml`
- Media uploads save to `public/images/uploads/`

### Production Setup

For production deployment on GitHub Pages, comprehensive instructions are available in the **[Decap CMS Production Setup Guide](DECAP_CMS_PRODUCTION_GUIDE.md)**.

The guide covers:
- GitHub OAuth App setup
- Netlify Identity configuration (recommended)
- Security considerations
- User management
- Alternative authentication methods
- Troubleshooting common issues

Currently, the CMS is configured for local development only. Follow the production guide to enable web-based editing on your live site.

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

You can manage content in two ways:
1. **Using the CMS** (recommended for non-technical users) - See [Content Management System](#content-management-system-cms) section above
2. **Editing files directly** (for developers) - Details below

### Homepage Content

Homepage content is managed through `src/content/homepage/index.yaml` (or via the CMS):

```yaml
bio:
  title: "Your Name"
  tagline: "Your professional title"
  narrative: |
    Your bio content here...

contact:
  title: "Important Links"
  items:
    - label: "The Industrial Policy Group"
      href: "https://industrialpolicygroup.com"
      text: "industrialpolicygroup.com"
    - label: "Email"
      href: "mailto:your@email.com"
      text: "your@email.com"
```

**Key Features:**
- Configurable contact section with flexible links
- Bio panel with markdown support
- Section display controls (item counts, titles)
- No hero section (simplified, content-focused approach)

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
- **[Typography System Guide](TYPOGRAPHY_SYSTEM_GUIDE.md)** - Global CSS classes and typography principles

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

## Typography System Guide

### Overview

The typography system has been centralized and refined based on principles from typography masters including Ambrose & Harris, Hochuli, Santa Maria, Bringhurst, Ruder, and Butterick. This system provides:

- **Global CSS classes** for consistent typography patterns
- **Baseline grid alignment** using 6px units
- **Enhanced OpenType features** for professional appearance
- **Accessibility support** including high contrast modes
- **Performance optimization** through reduced CSS duplication

### Key Global Classes

#### Research-Specific Typography
- `.text-publication` - Publication and journal name styling
- `.text-research-description` - Optimized description typography
- `.link-research-action` - Consistent research action links
- `.entry-divider` - Semantic content separation

#### Layout Utilities
- `.featured-title` - Lightweight titles for featured sections
- `.list-none` - Clean list styling removal

### Implementation Examples

**Research Entry Component:**
```astro
<article class="entry-divider">
  <h3 class="research-title">
    <a href={href} class="link-title">{title}</a>
  </h3>
  
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

**Minimal Featured Section:**
```astro
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
```

### Benefits

- **Consistency**: Unified typography patterns across all research components
- **Maintainability**: Single source of truth for styling decisions
- **Performance**: Reduced CSS duplication and improved caching
- **Accessibility**: Built-in support for high contrast and dark modes
- **Scalability**: Easy to extend and modify system-wide

For complete documentation, see **[Typography System Guide](TYPOGRAPHY_SYSTEM_GUIDE.md)**.

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
          { title: "CV", href: siteConfig.resumeUrl || "/cv.pdf" }
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

## Secret Detection & Security

**Added July 19, 2025**

### Git Pre-commit Hook

The repository includes an advanced pre-commit hook that prevents accidental commits of secrets:

#### Features
- **Automatic Secret Detection**: Scans for API keys, tokens, passwords before commits
- **Pattern Detection**: 
  - Common patterns: `api_key`, `apikey`, `access_token`, `auth_token`, `private_key`
  - AWS keys: `AKIA[0-9A-Z]{16}`
  - Real secret patterns: `"api_key": "actual_value"`
- **Smart False Positive Handling**:
  - Excludes documentation files by default
  - Detects context (documentation vs actual secrets)
  - Configurable via `.gitsecret` file

#### Installation
```bash
# Install the pre-commit hook
./scripts/maintenance/install-git-hooks.sh
```

#### Configuration (.gitsecret)
Create a `.gitsecret` file to customize behavior:

```yaml
exclude_paths:
  - "private_notes/"
  - "docs/"
  - "*.test.js"
  
doc_context_words:
  - "example"
  - "documentation"
  - "detects"
```

#### Handling False Positives
If the hook detects a false positive (e.g., documentation about secrets):

```bash
# One-time bypass
git commit --no-verify -m "Your commit message"

# Check what's triggering
git diff --cached | grep -iE "api_key|secret|token"
```

### Security Best Practices

1. **Never Commit Secrets**
   - Use environment variables for all secrets
   - Add sensitive files to `.gitignore`
   - Use `.env` files locally (already in .gitignore)

2. **Environment Variables**
   ```javascript
   // Good - using environment variable
   const apiKey = import.meta.env.WEBMENTION_API_KEY;
   
   // Bad - hardcoded secret
   const apiKey = "sk_live_abc123";
   ```

3. **Regular Security Audits**
   ```bash
   # Check for npm vulnerabilities
   npm audit
   
   # Manual secret scan
   git grep -iE "api[_-]key|secret|token" | grep -v "pattern\|detect\|example"
   
   # Check git history (careful - this loads entire history)
   git log -p | grep -iE "api[_-]key|secret|token"
   ```

### Security Headers Configuration

The site includes comprehensive security headers via `public/_headers`:

- **X-XSS-Protection**: `1; mode=block` - XSS protection
- **X-Frame-Options**: `DENY` - Prevents clickjacking
- **X-Content-Type-Options**: `nosniff` - Prevents MIME sniffing
- **CSP**: Configured for self-hosted resources + CDN
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: Restricts browser features

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

- **[Homepage Configuration Guide](HOMEPAGE_CONFIGURATION_GUIDE.md)** - Complete guide to managing homepage content and layout
- **[Footer Configuration Guide](FOOTER_CONFIGURATION_GUIDE.md)** - Comprehensive guide to managing footer content
- **[Metadata System Guide](METADATA_SYSTEM_GUIDE.md)** - Typography and metadata configuration
- **[Blog and Writing Guide](BLOG_AND_WRITING_GUIDE.md)** - Content creation and management
- **[Decap CMS Production Setup Guide](DECAP_CMS_PRODUCTION_GUIDE.md)** - Complete guide for setting up CMS on GitHub Pages