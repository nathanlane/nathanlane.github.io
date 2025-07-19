# Footer Configuration Guide

This guide covers how to manage footer content through the centralized configuration system.

## Overview

The footer content is managed through a TypeScript configuration file, providing type safety, IntelliSense support, and the ability to reference other configuration values dynamically.

## Primary Configuration File

**Location**: `src/config/navigation.config.ts`

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

## Configuration Structure

### Section Object
```typescript
{
  title: string;        // Section heading
  links: LinkObject[];  // Array of links
}
```

### Link Object
```typescript
{
  title: string;        // Link text
  href: string;         // URL or "#" for non-clickable text
}
```

## Advanced Features

### 1. Social Media Integration

Footer automatically pulls from your main social configuration:

```typescript
// Uses socialLinks from src/site.config.ts
links: socialLinks
  .filter(social => ['Github', 'LinkedIn', 'Twitter', 'Bluesky'].includes(social.friendlyName))
  .map(social => ({ title: social.friendlyName, href: social.link }))
```

**Benefits:**
- Single source of truth for social media URLs
- No duplicate entries
- Changes to social media update everywhere

### 2. Dynamic Content References

Reference other configuration values:

```typescript
// Email from site config
{ title: "Email", href: `mailto:${siteConfig.email}` }

// Automatic copyright year (in footer component)
© {currentYear} Nathan Lane
```

### 3. Non-Clickable Descriptive Text

Use `href: "#"` for descriptive text:

```typescript
{ title: "Built with Astro and modern web standards.", href: "#" }
```

## Common Customizations

### Adding a New Section

```typescript
{
  title: "Resources",
  links: [
    { title: "Data Sources", href: "/data" },
    { title: "Publications", href: "/publications" },
    { title: "Tools", href: "/tools" }
  ]
}
```

### Adding External Links

```typescript
{
  title: "External",
  links: [
    { title: "Twitter", href: "https://twitter.com/username" },
    { title: "LinkedIn", href: "https://linkedin.com/in/username" }
  ]
}
```

### Adding Download Links

```typescript
{
  title: "Downloads",
  links: [
    { title: "CV", href: siteConfig.resumeUrl || "/cv.pdf" },
    { title: "Resume", href: "/resume.pdf" }
  ]
}
```

### Current Footer Configuration

As of January 2025, the footer includes:

**Contact Section:**
- Email (using dynamic `siteConfig.email`)
- CV (using dynamic `siteConfig.resumeUrl` for maintainability)

This provides easy access to professional contact information from every page.

## Typography Customization

Footer typography is controlled in `src/components/layout/Footer.astro`:

### Current Font Sizes
- **Footer body text**: `--step--1` (~11.5-13px)
- **Section headers**: `--step-1` (larger than body)
- **Bottom utility links**: `--step--1`

### Adjusting Font Sizes

To change footer text size:

```css
.site-footer {
  font-size: var(--step-0); /* Increase to base size */
}
```

To change section header size:

```css
.footer-section-title {
  font-size: var(--step-2); /* Increase header size */
}
```

## Best Practices

### 1. TypeScript Over YAML
- ✅ Type safety and error catching
- ✅ IntelliSense and auto-completion
- ✅ Refactoring support
- ✅ Dynamic content references
- ❌ YAML lacks these benefits

### 2. Consistent Link Structure
- Keep link titles concise and descriptive
- Use consistent capitalization
- Group related links in logical sections

### 3. Maintenance
- Update social media in `src/site.config.ts` only
- Use dynamic references when possible
- Test all links periodically

## Troubleshooting

### Social Links Not Updating
- Check that `socialLinks` is imported in navigation config
- Verify `friendlyName` matches filter array
- Ensure social link exists in `src/site.config.ts`

### TypeScript Errors
- Ensure all required fields are provided
- Check that href is a valid string
- Verify imports are correct

### Links Not Working
- Test all external URLs
- Ensure internal paths start with `/`
- Check for typos in href values

## Related Files

- **Footer Component**: `src/components/layout/Footer.astro`
- **Site Configuration**: `src/site.config.ts`  
- **Navigation Configuration**: `src/config/navigation.config.ts`
- **CSS Styles**: Within Footer.astro `<style>` block 