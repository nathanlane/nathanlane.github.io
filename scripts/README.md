# Utility Scripts

This directory contains utility scripts for maintaining and managing the nathanlane.github.io website.

## Directory Structure

```
scripts/
├── migration/      # Jekyll to Astro migration scripts
├── content/        # Content validation and fixing scripts
└── maintenance/    # General maintenance and optimization scripts
```

## Migration Scripts (`/migration`)

### `migrate-jekyll-archive.js`
Migrates Jekyll blog posts to Astro format.
- Converts frontmatter from Jekyll to Astro format
- Updates image paths
- Generates descriptions from content if missing
- Preserves tags and categories

**Usage:** `node scripts/migration/migrate-jekyll-archive.js`

### `check-truncated-posts.js`
Compares migrated posts with originals to find truncation issues.
- Identifies posts that may have been cut off during migration
- Generates a detailed report
- Helps ensure content integrity

**Usage:** `node scripts/migration/check-truncated-posts.js`

### `fix-truncated-posts.js`
Fixes posts that were truncated during migration.
- Re-migrates truncated content
- Preserves manual frontmatter edits
- Cleans up after successful fixes

**Usage:** `node scripts/migration/fix-truncated-posts.js`

### `mark-old-posts-draft.js`
Marks posts older than a specified year as drafts.
- Default cutoff year: 2017
- Useful for hiding outdated content
- Preserves all post data

**Usage:** `node scripts/migration/mark-old-posts-draft.js`

### `clean-migrated-posts.js`
Systematically cleans up blog posts migrated from Jekyll/Squarespace.
- Removes Jekyll template variables ({{ site.baseurl }})
- Converts HTML img tags to markdown
- Removes unnecessary `<p>` tags
- Converts HTML tables to markdown
- Updates old iframe embed codes
- Fixes broken image paths
- Cleans up messy formatting

**Usage:** 
```bash
# Clean all posts
node scripts/migration/clean-migrated-posts.js

# Preview changes without saving
node scripts/migration/clean-migrated-posts.js --dry-run

# Clean specific file
node scripts/migration/clean-migrated-posts.js --file=my-post.md
```

**Dependencies:** `npm install gray-matter turndown turndown-plugin-gfm`

### `fix-blog-images.js`
Finds and fixes broken images in blog posts.
- Scans all posts for image references
- Checks if local images exist
- Reports broken image paths
- Suggests fixes for broken paths
- Optionally downloads external images

**Usage:**
```bash
# Check for broken images (report only)
node scripts/migration/fix-blog-images.js --check-only

# Fix broken image paths
node scripts/migration/fix-blog-images.js

# Download external images and fix paths
node scripts/migration/fix-blog-images.js --download
```

**Dependencies:** `npm install gray-matter`

### `clean-html-entities.js`
Cleans up HTML entities and messy content from migrated blog posts.
- Converts HTML entities (&nbsp;, &gt;, &lt;, &amp;, etc.) to proper characters
- Fixes double-encoded entities (like &amp;gt; → &gt; → >)
- Removes zero-width spaces and invisible characters
- Cleans up excessive whitespace
- Converts smart quotes to straight quotes (optional)
- Fixes common OCR/paste artifacts
- Handles special cases like "File: Save As > Image > TIFFs"

**Usage:**
```bash
# Clean all posts
node scripts/migration/clean-html-entities.js

# Preview changes without saving
node scripts/migration/clean-html-entities.js --dry-run

# Clean specific file
node scripts/migration/clean-html-entities.js --file=my-post.md
```

**Dependencies:** `npm install gray-matter`

### `squarespace-url-extractor.js`
Extracts and analyzes URLs from Squarespace sitemap.xml.
- Groups URLs by pattern (blog, portfolio, pages)
- Suggests redirect mappings
- Exports URLs to JSON for processing

**Usage:** `node scripts/migration/squarespace-url-extractor.js path/to/sitemap.xml`

**Dependencies:** `npm install xml2js`

### `squarespace-deep-scan.js`
Scans for additional Squarespace pages beyond sitemap.
- Checks common Squarespace URL patterns
- Identifies redirects and hidden pages
- Generates comprehensive site structure report

**Usage:** `node scripts/migration/squarespace-deep-scan.js`

## Content Scripts (`/content`)

### `validate-content.js`
Validates all content against Astro schema requirements.
- Checks title length (max 60 chars)
- Validates description length (20-300 chars)
- Ensures required fields exist
- Reports all issues before build

**Usage:** `npm run validate`

### `fix-content.js`
Automatically fixes common content validation errors.
- Truncates long titles intelligently
- Fixes description lengths
- Removes HTML from descriptions
- Generates missing descriptions from content

**Usage:** `npm run fix-content`

### `fix-long-titles.js`
Specifically fixes posts with titles exceeding 60 characters.
- Truncates at word boundaries
- Preserves original title in description
- Reports all changes made

**Usage:** `node scripts/content/fix-long-titles.js`

### `find-content-issues.js`
Comprehensive content issue scanner.
- Finds all validation problems
- Generates detailed JSON report
- Helps prioritize fixes

**Usage:** `node scripts/content/find-content-issues.js`

## Maintenance Scripts (`/maintenance`)

### `optimize-descriptions.js`
Optimizes post descriptions for SEO.
- Ensures optimal length for search results
- Removes redundant information
- Improves readability

**Usage:** `node scripts/maintenance/optimize-descriptions.js`

### `seo-audit-simple.js`
Performs basic SEO audit on content.
- Checks meta descriptions
- Validates title formats
- Reports optimization opportunities

**Usage:** `node scripts/maintenance/seo-audit-simple.js`

## Helper Scripts (Root Level)

### `manual-migration-helper.js`
Lists Jekyll posts for manual migration review.
- Shows migration status
- Groups by year
- Identifies missing migrations

**Usage:** `node scripts/migration/manual-migration-helper.js`

### `diagnose-deps.sh`
Diagnoses dependency issues.
- Checks node and pnpm versions
- Identifies problematic packages
- Suggests fixes

**Usage:** `./scripts/maintenance/diagnose-deps.sh`

## Quick Commands

```bash
# Validate all content before building
npm run validate

# Fix common content issues automatically
npm run fix-content

# Run full migration from Jekyll
node scripts/migration/migrate-jekyll-archive.js

# Check for truncated posts
node scripts/migration/check-truncated-posts.js

# Mark old posts as drafts
node scripts/migration/mark-old-posts-draft.js
```

## Adding New Scripts

When adding new utility scripts:
1. Place in appropriate subdirectory
2. Add comprehensive header comments
3. Update this README with usage information
4. Consider adding as npm script if frequently used

## Notes

- All scripts assume execution from project root
- Most scripts use `gray-matter` for frontmatter parsing
- Content scripts respect existing manual edits
- Always backup before running migration scripts