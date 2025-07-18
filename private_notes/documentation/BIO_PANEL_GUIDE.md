# Bio Panel Component Guide

## Overview

The Bio Panel is an elegant, typography-focused component for displaying personal information on the homepage. It follows the site's document-centric aesthetic with minimal decoration and text as the primary design element.

## Content Structure

The bio panel content is managed through the `src/content/homepage/index.yaml` file:

```yaml
bio:
  # Section title (optional, defaults to "About")
  title: "Nathan Lane, PhD"  # Can be customized: "About Me", "Bio", "Background", etc.
  
  # Primary intro - the hook (1-2 sentences)
  tagline: "Economics professor, University of Oxford"
  
  # Main narrative (supports markdown)
  narrative: |
    I'm an Assistant Professor of Economics at the University of Oxford, where I explore the intersection of industrial policy, economic development, and global manufacturing systems. My research combines rigorous econometric analysis with historical perspective to understand how governments shape economic outcomes.

    Beyond research, I'm passionate about making economic analysis more accessible. I contribute to open-source tools, teach data science methods to graduate students, and occasionally write about the [intersection of economics and technology](/posts).

    I am also co-Principal Investigator of the [Industrial Policy Group](https://www.industrialpolicygroup.com/) lab, where we are building comprehensive datasets and developing new methodologies to evaluate how industrial strategies affect economic transformation.
  
  # Brief credentials or affiliations (optional)
  affiliations:
    - title: "Oxford University"
      role: "Assistant Professor of Economics"
    - title: "Industrial Policy Group"
      role: "Co-Principal Investigator"
  
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
- `title`: Section heading (defaults to "About" if not provided) - can be customized to your name, "About Me", "Bio", etc.
- `tagline`: Short introductory text or professional title
- `affiliations`: Array of institutional affiliations with title and role
- `photo`: Photo configuration object (completely optional)

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
  title: "Nathan Lane, PhD"  # or "About Me", "Bio", "Background", etc.
  tagline: "Economics professor, University of Oxford"
  narrative: |
    I'm an Assistant Professor of Economics at the University of Oxford, where I explore the intersection of industrial policy, economic development, and global manufacturing systems.
    
    Beyond research, I'm passionate about making economic analysis more accessible. I contribute to open-source tools and teach data science methods to graduate students.
  affiliations:
    - title: "Oxford University"
      role: "Assistant Professor of Economics"
    - title: "Industrial Policy Group"
      role: "Co-Principal Investigator"
  photo:
    src: "/images/bio/profile.jpg"
    alt: "Nathan Lane"
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

- [Blog System Guide](./BLOG_GUIDE.md) - Craig Mod-inspired blog management
- [Homepage Configuration Guide](./HOMEPAGE_CONFIGURATION.md)
- [Typography System](./TYPOGRAPHY_SYSTEM.md)
- [Design System Overview](./DESIGN_SYSTEM.md) 

## Asterism Component

The Asterism component provides elegant section breaks for essays and long-form content, following Craig Mod's editorial aesthetic.

### Basic Usage

```astro
---
import Asterism from "@/components/typography/Asterism.astro";
---

Some paragraph content...

<Asterism />

New major section begins here...
```

### Advanced Usage

**Default (Single Asterism Symbol):**
```astro
<Asterism />  <!-- Renders: ⁂ -->
```

**Triple Asterisk Variant:**
```astro
<Asterism data-variant="triple">* * *</Asterism>
```

**Custom Content:**
```astro
<Asterism>• • •</Asterism>
<Asterism>§</Asterism>
```

### Design Features

- **Perfect Optical Centering**: Uses flexbox for precise alignment
- **Grid-Aligned Spacing**: 96px margins (72px on mobile) following baseline grid
- **Responsive Typography**: Scales appropriately across devices
- **Dark Mode Support**: Automatic color adjustments
- **Accessibility**: High contrast mode support and reduced motion compliance
- **Print Optimization**: Clean appearance in print media
- **Subtle Interactivity**: Gentle hover state for engagement

### Typography Details

- **Font**: Newsreader (serif) for editorial feel
- **Size**: `--step-2` (23.4-26.6px desktop scale)
- **Weight**: 300 (light) for elegant appearance
- **Color**: `--theme-color-400` with subtle text shadow for depth
- **Letter Spacing**: 0.2em for the single symbol, 0.75em for triple variant

Use asterisms to mark major transitions, scene changes, or thoughtful pauses in your long-form content. 