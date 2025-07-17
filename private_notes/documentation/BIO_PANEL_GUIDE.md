# Bio Panel Component Guide

## Overview

The Bio Panel is an elegant, typography-focused component for displaying personal information on the homepage. It follows the site's document-centric aesthetic with minimal decoration and text as the primary design element.

## Content Structure

The bio panel content is managed through the `src/content/homepage/index.yaml` file:

```yaml
bio:
  # Section title (optional, defaults to "About")
  title: "About"
  
  # Primary intro - the hook (1-2 sentences)
  tagline: "Empirical economist and data scientist studying how economies transform"
  
  # Main narrative (supports markdown)
  narrative: |
    Your main bio text here. Supports markdown formatting including:
    - Links: [text](url)
    - Bold: **text**
    - Italic: *text*
    - Multiple paragraphs
  
  # Current focus - what you're working on now (optional)
  currently:
    - "First current activity"
    - "Second current activity"
    - "Third current activity"
  
  # Brief credentials or affiliations (optional)
  affiliations:
    - title: "Institution Name"
      role: "Your Role"
    - title: "Another Institution"
      role: "Another Role"
  
  # Photo configuration (completely optional - delete this section if no photo)
  # photo:
  #   src: "/images/bio/your-photo.jpg"
  #   alt: "Your Name"
  #   caption: "Photo by [photographer name](link)"  # optional, supports markdown
  #   display: true  # Must be true to show photo
```

## Usage

The bio panel is automatically included in the homepage when bio content is present in the YAML file. To show/hide the bio panel:

1. **To show**: Ensure the `bio` section exists in `src/content/homepage/index.yaml`
2. **To hide**: Remove or comment out the entire `bio` section

## Customization Options

### Required Fields
- `narrative`: The main bio text (markdown supported)

### Optional Fields
- `title`: Section heading (defaults to "About" if not provided)
- `tagline`: Short introductory text
- `currently`: Array of current activities/projects
- `affiliations`: Array of institutional affiliations
- `photo`: Photo configuration object

### Photo Management

The photo is completely optional. To add a photo:

1. Place your photo in `/public/images/bio/`
2. Add the photo configuration to your bio section:
   ```yaml
   photo:
     src: "/images/bio/nathan-lane.jpg"
     alt: "Nathan Lane"
     caption: "Photo by Jane Doe"  # optional
     display: true  # Must be true to show
   ```

To remove the photo:
- Simply delete or comment out the entire `photo` section
- Or set `display: false`

## Styling & Layout

The bio panel adapts responsively:
- **Desktop**: Full-width with optimal reading measure (65ch)
- **Mobile**: Stacked layout with appropriate spacing
- **Typography**: Uses the site's typography system with Newsreader headings

## Examples

### Minimal Bio
```yaml
bio:
  narrative: |
    I'm a researcher studying economic development at Oxford University.
```

### Full Bio with All Options
```yaml
bio:
  title: "About Me"  # or "Bio", "Background", etc.
  tagline: "Economic researcher and data scientist"
  narrative: |
    I study how economies transform through industrial policy...
    
    My work combines econometric analysis with historical perspective...
  currently:
    - "Writing a book on industrial strategy"
    - "Teaching graduate econometrics"
  affiliations:
    - title: "Oxford University"
      role: "Assistant Professor"
  photo:
    src: "/images/bio/profile.jpg"
    alt: "Your Name"
    display: true
```

## Best Practices

1. **Keep it concise**: 2-3 paragraphs is ideal
2. **Use markdown**: Add links to relevant pages/projects
3. **Update regularly**: Keep the "currently" section fresh
4. **Photo guidelines**: Use a high-quality image, 600px minimum width
5. **Accessibility**: Always include alt text for photos

## Troubleshooting

- **Bio not showing**: Check that the `bio` section exists in the YAML file
- **Photo not displaying**: Ensure `display: true` and the image path is correct
- **Markdown not rendering**: Check for YAML syntax errors in the narrative

## Related Documentation

- [Homepage Configuration Guide](./HOMEPAGE_CONFIGURATION.md)
- [Typography System](./TYPOGRAPHY_SYSTEM.md)
- [Design System Overview](./DESIGN_SYSTEM.md) 