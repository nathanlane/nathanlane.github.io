# Contributing Guide

This guide helps you work with the codebase effectively, whether you're the original developer or returning after some time away.

## Quick Start

```bash
# Clone and install dependencies
git clone https://github.com/nathanlane/nathanlane.github.io.git
cd nathanlane.github.io
pnpm install

# Start development server
pnpm dev

# Open in browser
# Local: http://localhost:4321
# Network: http://192.168.1.x:4321 (for mobile testing)
```

## Development Workflow

### Before You Start Coding
1. Make sure you're on the right branch:
   ```bash
   git checkout private-dev  # or your feature branch
   git pull origin private-dev
   ```

2. Check that dependencies are up to date:
   ```bash
   pnpm install
   ```

### While Coding
- **Development server**: `pnpm dev` (runs on port 4321)
- **Live reload**: Changes automatically refresh the browser
- **Error reporting**: Build errors appear in the terminal

### Before Committing
Run the validation suite to catch issues early:

```bash
# Run all checks (recommended)
pnpm validate

# Or run individual checks
pnpm lint          # Check code quality
pnpm format        # Format code
pnpm check         # TypeScript + Astro checks
pnpm build         # Test production build
```

**Important checks:**
- [ ] Code passes all linters
- [ ] TypeScript has no errors
- [ ] Site builds successfully
- [ ] Test in both light and dark modes
- [ ] Check mobile responsiveness (viewport 320px-1280px)
- [ ] No console errors in browser

## Configuration Management

### The Site Config Pattern

**Single Source of Truth:** All identity, contact, and site metadata lives in `src/site.config.ts`.

#### What Goes Where

**`src/site.config.ts` (IDENTITY + METADATA):**
- Author name, credentials, job title
- Organization name (full and short)
- Email, CV URL, profile images
- ORCID, Twitter handle, social profiles
- Site metadata (language, locale, description)
- Navigation links (`menuLinks`)
- Social links (`socialLinks`)

**Content files (NARRATIVE ONLY):**
- `src/content/homepage/index.yaml` - Biography prose, custom links
- `src/data/about-config.ts` - Extended biography paragraphs

#### Why This Matters

This pattern ensures:
1. **Update once, propagate everywhere** - Change your email in one place
2. **Clear separation** - Identity data vs. narrative content
3. **Type safety** - TypeScript enforces structure
4. **DRY principle** - No duplicate data maintenance

#### How It Works

```typescript
// src/site.config.ts exports identity data
export const siteConfig: SiteConfig = {
  author: "Nathan Lane",
  email: "n.lane@lse.ac.uk",
  organization: "London School of Economics",
  // ...
};

// Pages import and merge with content
import { siteConfig } from "@/site.config";
const homepageYaml = await getEntry("homepage", "index");

// Merge: config provides identity, YAML provides narrative
const bio = {
  title: siteConfig.fullName,
  tagline: siteConfig.organization,
  narrative: homepageYaml.bio.narrative,
};
```

#### Updating Your Information

**To change identity data** (name, job, org, email, CV):
1. Edit `src/site.config.ts` only
2. Changes automatically propagate to:
   - Homepage (index.astro)
   - About page (about.astro)
   - SEO metadata (BaseHead.astro)
   - Navigation (Header.astro, Footer.astro)

**To change narrative content** (biography text):
1. Edit `src/content/homepage/index.yaml` for homepage bio
2. Edit `src/data/about-config.ts` for about page paragraphs

**Files that should NOT be edited:**
- ❌ `src/config/navigation.config.ts` - DELETED (was duplicate data)
- ❌ Don't add identity fields to YAML files
- ❌ Don't hardcode contact info in components

## Common Tasks

### Adding Blog Posts
1. Create a new file in `src/content/post/`:
   ```bash
   touch src/content/post/my-new-post.md
   ```

2. Add required frontmatter:
   ```yaml
   ---
   title: "Your Post Title"
   description: "SEO description (50-160 chars)"
   publishDate: "2025-01-30"
   tags: ["tag1", "tag2"]
   draft: true  # Remove when ready to publish
   ---
   ```

3. Write your content in Markdown/MDX
4. Preview with `pnpm dev`
5. When ready, set `draft: false`

### Adding Research Papers
Create files in `src/content/research/` with this frontmatter:
```yaml
---
title: "Paper Title"
description: "Abstract or summary"
status: "published"  # or "working-paper", "work-in-progress"
type: "paper"        # or "report", "chapter"
paperDate: "2024"    # Year only
authors: "Your Name, Co-Author Name"
publication: "Journal Name"
download: "https://link-to-pdf"
featured: true       # Show on homepage
tags: ["industrial-policy", "economics"]
---
```

### Updating Site Configuration
Edit these files for different aspects:

| What to Change | File to Edit |
|----------------|--------------|
| Site title, author, email | `src/site.config.ts` |
| Navigation menu | `src/site.config.ts` → `menuLinks` |
| Social links | `src/site.config.ts` → `socialLinks` |
| Homepage content | `src/content/homepage/index.yaml` |
| About page | `src/content/pages/about.mdx` |
| Colors/theme | `src/styles/global.css` |
| Typography | `tailwind.config.ts` |

### Changing Colors
1. Edit CSS variables in `src/styles/global.css`
2. Look for `:root` (light mode) and `[data-theme="dark"]` (dark mode)
3. Update color values using HSL format
4. Test in both modes

### Modifying Typography
1. **Font sizes**: Edit `tailwind.config.ts` → `fluidType` plugin
2. **Font families**: Edit `tailwind.config.ts` → `fontFamily`
3. **Spacing**: Edit `tailwind.config.ts` → `spacing` (uses 6px baseline grid)
4. **Components**: Edit `tailwind.config.ts` → `addComponents`

## Git Workflow

### Branch Strategy
- **main**: Production-ready code (deployed to site)
- **private-dev**: Active development branch

### Merging Changes from Main to Dev
```bash
# On private-dev, merge latest main
git checkout private-dev
git fetch origin
git merge origin/main
git push origin private-dev
```

### Merging Dev to Main (for deployment)
```bash
# Switch to main and merge private-dev
git checkout main
git pull origin main
git merge private-dev
git push origin main

# Return to dev branch
git checkout private-dev
```

## Testing

### Local Testing
```bash
# Development mode
pnpm dev

# Production preview
pnpm build
pnpm preview
```

### What to Test
1. **Content rendering**: All posts/pages display correctly
2. **Navigation**: All links work, no 404s
3. **Responsive design**: Test at 320px, 768px, 1280px
4. **Dark mode**: Toggle and verify all components
5. **Typography**: Check font loading and sizes
6. **Performance**: Run Lighthouse audit
7. **Build**: Ensure `pnpm build` succeeds

### Browser Testing
- Chrome/Edge (primary)
- Firefox
- Safari (if on macOS)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Project Structure

```
nathanlane.github.io/
├── src/
│   ├── content/          # All content (posts, research, etc.)
│   │   ├── post/         # Blog posts
│   │   ├── research/     # Academic papers
│   │   ├── writing/      # Long-form writing
│   │   ├── projects/     # Portfolio projects
│   │   └── pages/        # Static pages (About, etc.)
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Page layouts
│   ├── pages/            # Route pages (file-based routing)
│   ├── styles/           # Global CSS
│   ├── utils/            # Helper functions
│   ├── site.config.ts    # Site metadata & nav
│   └── content.config.ts # Content schemas
├── public/               # Static assets
├── scripts/              # Utility scripts
└── dist/                 # Build output (generated)
```

## Typography System

This site emphasizes excellent typography:

- **Font Stack**: Inter Variable (all text), JetBrains Mono (code)
- **Baseline Grid**: 6px units, 24px baseline rhythm
- **Fluid Typography**: Responsive scaling (320px-1280px viewports)
- **Reading Width**: Optimized 65ch measure for body text
- **Dark Mode**: Weight and contrast adjustments for readability

### Typography Guidelines
- Use semantic spacing: `space-s`, `space-m`, `space-l`
- Maintain baseline grid alignment: use `*b` tokens (1b, 2b, 4b, etc.)
- Test typography changes in both light/dark modes
- Verify fluid scaling across viewport sizes

## Content Management System (Optional)

The site includes Decap CMS for web-based editing:

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Start CMS proxy
pnpm cms
```

Then visit: http://localhost:4321/admin/index.html

**Note**: This is for local use only. The live site admin page shows setup instructions.

## Troubleshooting

### Dev Server Won't Start
- Check if port 4321 is in use: `lsof -ti:4321 | xargs kill -9`
- Clear cache: `pnpm clean && pnpm install`
- Check Node version: requires Node 18+

### Build Fails
1. Run validation: `pnpm validate`
2. Check TypeScript errors: `pnpm check:types`
3. Review error messages in terminal
4. Check that all content files have valid frontmatter

### Linter Errors
- Auto-fix: `pnpm lint:fix`
- Format code: `pnpm format`

### Content Not Showing
- Check frontmatter has required fields
- Verify `draft: false` (drafts are hidden)
- Ensure file is in correct `src/content/` subfolder
- Check content collection schema in `src/content.config.ts`

### Typography Issues
- Clear browser cache (Cmd/Ctrl + Shift + R)
- Check font files loaded in Network tab
- Verify CSS variables in `src/styles/global.css`
- Test in incognito/private browsing mode

## Performance

### Optimization Guidelines
- Keep images optimized (use WebP format)
- Minimize custom CSS (prefer Tailwind utilities)
- Test font loading impact (check CLS in Lighthouse)
- Monitor bundle size after changes

### Performance Targets
- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## Resources

### Documentation
- [Astro Documentation](https://docs.astro.build/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Project-Specific
- `CLAUDE.md` - AI assistant instructions & project context
- `README.md` - Project overview & features
- `context/` - Typography reference materials

### Typography References
- Bringhurst: "The Elements of Typographic Style"
- Butterick: "Butterick's Practical Typography"
- Hochuli: "Detail in Typography"

## Getting Help

1. Check this guide first
2. Review `CLAUDE.md` for detailed context
3. Search existing issues/commits for similar problems
4. Check Astro Discord for framework-specific questions
5. Review component source code for implementation details

## Philosophy

This site prioritizes:
1. **Typography** - Excellent reading experience
2. **Performance** - Fast, optimized builds
3. **Maintainability** - Clear code, good documentation
4. **Accessibility** - Semantic HTML, WCAG compliance
5. **Simplicity** - No unnecessary complexity

