# Decap CMS Guide

## Overview

This site uses Decap CMS (formerly Netlify CMS) for web-based content editing. The CMS is configured for **local-only access** - no authentication or cloud services required. This provides a simple, secure way to edit content through a user-friendly interface while maintaining full control over your files.

## Quick Start

### 1. Start the Development Environment

You need to run two servers simultaneously:

```bash
# Terminal 1: Start Astro dev server
pnpm dev

# Terminal 2: Start CMS proxy server
pnpm cms
# Or: npx decap-server
```

### 2. Access the CMS

1. Open your browser to `http://localhost:4321/admin/index.html`
   - Note: You must include `index.html` in the URL
   - If port 4321 is in use, check the terminal for the actual port (e.g., 4322)
2. Click the "Login" button (any credentials work locally)
3. You're now in the CMS interface!

### 3. Stop the Servers

When done editing:
- Press `Ctrl+C` in both terminal windows
- Changes are already saved to your local files

## What You Can Edit

### Blog Posts (`/posts/`)
- Create new posts with the rich text editor
- Edit existing posts with live preview
- Manage frontmatter fields:
  - Title, description, publish date
  - Tags (comma-separated)
  - Draft status
  - Featured flag
  - Updated date
- Upload images directly in the editor

### Research Papers (`/research/`)
- Add academic papers and essays
- Fields include:
  - Title, description, publication info
  - Journal name, volume, DOI
  - Co-authors list
  - Featured status for homepage display

### Projects (`/projects/`)
- Document your projects with:
  - Title, description, dates
  - Technology stack
  - External links (GitHub, demo, etc.)
  - Rich content with images

### Creative Writing (`/writing/`)
- Manage creative writing pieces
- Optional genre/type field
- Full markdown support

### Homepage Content
- Edit the main bio text
- Update tagline
- Modify contact links
- All through simple form fields

### Media Uploads
- Drag-and-drop image uploads
- Automatically saved to `/public/images/uploads/`
- Insert into content with one click

## CMS Features

### Rich Text Editor
- **Visual editing**: See formatted text as you type
- **Markdown shortcuts**: Use `**bold**`, `*italic*`, etc.
- **Image management**: Upload and insert images
- **Code blocks**: Syntax highlighting for code
- **Lists and quotes**: Easy formatting tools

### Content Management
- **Search**: Find posts quickly
- **Filters**: View by status, collection
- **Drafts**: Save work without publishing
- **Metadata**: Edit all frontmatter fields

### Workflow
- **Auto-save**: Changes save to files immediately
- **No deploy needed**: Edit files directly
- **Git-friendly**: See changes in git diff
- **Preview**: Live preview as you type

## Production Behavior

When visitors access `/admin/` on your live site:

```
CMS Access
==========
The content management system is only available for local development.

To edit content, clone the repository and run:
pnpm dev
pnpm cms
```

This ensures:
- No authentication system exposed online
- Clear instructions for contributors
- Security through local-only access

## Configuration Details

### File Structure
```
public/admin/
├── config.yml    # CMS configuration
└── index.html    # CMS entry point

src/pages/admin/
└── index.astro   # Production redirect page
```

### Key Configuration (`public/admin/config.yml`)
```yaml
backend:
  name: git-gateway
  branch: main

# Always use local backend
local_backend: true

# Content collections
collections:
  - name: "posts"
    folder: "src/content/post"
    create: true
    fields: [...]
    
  # Additional collections...
```

### Adding New Fields

To add a field to a collection:

1. Edit `public/admin/config.yml`
2. Add to the `fields` array:
```yaml
- { label: "New Field", name: "newField", widget: "string", required: false }
```

3. Update the content schema in `src/content.config.ts` if needed

### Widget Types

Common widgets for fields:
- `string`: Single line text
- `text`: Multi-line text
- `markdown`: Rich text editor
- `datetime`: Date picker
- `boolean`: Checkbox
- `select`: Dropdown menu
- `list`: Array of values
- `image`: File upload

## Troubleshooting

### "Error loading the CMS configuration"
- Ensure both servers are running
- Check you're on `http://localhost:4321/admin/` (with trailing slash)
- Verify `config.yml` has no syntax errors

### Port 8081 Already in Use
```bash
# Find what's using the port
lsof -i :8081

# Kill the process
kill <PID>

# Or use a different port
npx decap-server -p 8082
```

### Changes Not Showing
- Refresh the CMS page
- Check the file was saved (look at git status)
- Ensure no validation errors in console

### Can't See Images
- Images must be in `public/` folder
- Use paths like `/images/uploads/myimage.jpg`
- Don't include `public` in the path

## Best Practices

1. **Commit Regularly**: The CMS edits files directly, so commit often
2. **Use Drafts**: Set `draft: true` for work-in-progress
3. **Image Organization**: Create subfolders in `/images/uploads/` by year/month
4. **Consistent Tagging**: Reuse existing tags when possible
5. **Preview First**: Check the preview before saving
6. **Git Workflow**: Review changes with `git diff` before committing

## Advanced Usage

### Custom Preview Styles

Add custom CSS for the preview pane:
1. Create `/public/admin/preview.css`
2. Register in `config.yml`:
```yaml
editor:
  preview_styles:
    - /admin/preview.css
```

### Extending the CMS

1. **Custom widgets**: Add React components for special fields
2. **Preview templates**: Customize how content appears in preview
3. **Validation**: Add field validation rules
4. **Workflows**: Set up editorial review processes

## Security Notes

- **Local Only**: No cloud services or external authentication
- **Git Integration**: All changes tracked in version control
- **No Secrets**: No API keys or credentials needed
- **Production Safety**: CMS code doesn't load on live site

## Integration with Development Workflow

The CMS integrates seamlessly with the development process:

1. **Validation**: Content validated by Zod schemas
2. **Type Safety**: TypeScript types from content collections
3. **Hot Reload**: See changes instantly in dev server
4. **Build Checks**: Content validated during build
5. **Git Hooks**: Use pre-push validation (see below)

## Pre-Push Validation

Before pushing to GitHub, run validation:

```bash
pnpm run pre-push
# Or
pnpm run validate
```

This checks:
- ✅ Linting (Biome)
- ✅ Formatting (Biome + Prettier)
- ✅ TypeScript types
- ✅ Build success

## Summary

Decap CMS provides a user-friendly interface for content editing while maintaining the simplicity and security of local file management. No accounts, no cloud services, no complexity - just a better editing experience for your static site.