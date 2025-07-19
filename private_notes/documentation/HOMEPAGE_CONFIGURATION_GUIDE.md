# Homepage Configuration Guide

This guide covers how to configure and customize the homepage content through YAML configuration.

## Overview

The homepage uses a streamlined, content-focused approach that starts directly with the bio panel and flows through research, writing, and media sections. All content is managed through a single YAML configuration file.

## Primary Configuration File

**Location**: `src/content/homepage/index.yaml`

```yaml
# Bio panel configuration
bio:
  # Section title (optional, defaults to "About")
  title: "Nathan Lane, PhD"
  
  # Primary intro - the hook
  tagline: "Economics professor, University of Oxford"
  
  # Main narrative (supports markdown)
  narrative: |
    Assistant Professor of Economics at the University of Oxford. I am empirical economist and data scientist studying how economies change. I am also co-PI of the Industrial Policy Group lab.
  
  # Brief credentials or affiliations
  affiliations:
    - title: "Oxford Economics"
      role: "Assistant Professor"
    - title: "Industrial Policy Group"
      role: "Co-Principal Investigator"

# Contact section configuration (displays as Important Links)
contact:
  title: "Important Links"
  email: "drnathanlane@gmail.com"
  items:
    - label: "The Industrial Policy Group"
      href: "https://industrialpolicygroup.com"
      text: "industrialpolicygroup.com"
    - label: "Industrial Policy Data"
      href: "https://industrialpolicydata.com"
      text: "industrialpolicydata.com"
    - label: "Email"
      href: "mailto:drnathanlane@gmail.com"
      text: "drnathanlane@gmail.com"
    - label: "CV"
      href: "/cv.pdf"
      text: "Download CV"
    - label: "GitHub"
      href: "https://github.com/nathanlane"
      text: "GitHub"

# Homepage sections configuration
sections:
  research:
    title: "Research"
    itemCount: 3  # Number of papers to show
    viewAllText: "View all papers"
    viewAllUrl: "/research/"
  essays:
    title: "Recent Essays"
    itemCount: 3  # Number of posts to show
    viewAllText: "View all posts"
    viewAllUrl: "/posts/"
  writing:
    title: "Recent Writing"
    itemCount: 2  # Number of writing pieces to show
    viewAllText: "View all writing"
    viewAllUrl: "/writing/"
  media:
    title: "Recent in the News"
    itemCount: 5  # Number of media items to show
    viewAllText: "View all media"
    viewAllUrl: "/media/"
```

## Configuration Structure

### Bio Section
```yaml
bio:
  title: string          # Optional section title
  tagline: string        # Short professional description
  narrative: string      # Main bio content (markdown supported)
  affiliations: array    # Optional institutional connections
```

### Contact Section
```yaml
contact:
  title: string          # Section heading
  email: string          # Primary email (used elsewhere too)
  items: array           # Configurable contact links
```

### Contact Item Structure
```yaml
- label: string          # Left-side label (e.g., "Email")
  href: string          # URL or mailto link
  text: string          # Link text (e.g., "your@email.com")
```

### Section Configuration
```yaml
sectionName:
  title: string          # Section heading
  itemCount: number      # How many items to display
  viewAllText: string    # "View all" link text
  viewAllUrl: string     # "View all" link destination
```

## Customization Examples

### Adding New Contact Item
```yaml
contact:
  items:
    - label: "GitHub"
      href: "https://github.com/username"
      text: "View code"
    - label: "LinkedIn"
      href: "https://linkedin.com/in/username"
      text: "Professional profile"
```

### Customizing Section Display
```yaml
sections:
  research:
    title: "Latest Research"     # Custom title
    itemCount: 5                 # Show more items
    viewAllText: "All papers"    # Custom link text
    viewAllUrl: "/research/"
```

### Minimal Bio Configuration
```yaml
bio:
  narrative: |
    Brief description of who you are and what you do.
```

### Comprehensive Bio with Photo
```yaml
bio:
  title: "About Me"
  tagline: "Your professional title"
  narrative: |
    Multi-paragraph description with [markdown links](/page) supported.
    
    Second paragraph with more details about your work and interests.
  affiliations:
    - title: "Institution"
      role: "Your Role"
  photo:
    src: "/images/bio/profile.jpg"
    alt: "Your Name"
    display: true
```

## Best Practices

### Content Guidelines
1. **Bio narrative**: Keep to 2-3 paragraphs maximum
2. **Tagline**: One clear, descriptive sentence
3. **Contact items**: 4-6 items for optimal layout
4. **Section counts**: Balance between showing enough and avoiding clutter

### Configuration Management
1. **Test changes locally**: Always preview with `pnpm dev`
2. **Check responsive behavior**: Test on mobile and desktop
3. **Validate YAML syntax**: Use proper indentation and formatting
4. **Update regularly**: Keep item counts relevant to your content volume

### Performance Considerations
1. **Item counts**: Higher counts increase build time and page weight
2. **Images**: Optimize bio photos before adding
3. **External links**: Minimize in contact section for faster loading

## Homepage Layout Flow

The current homepage follows this structure:

1. **Bio Panel** (opening section)
   - Optional title
   - Tagline
   - Narrative content
   - Affiliations
   - Optional photo

2. **Research Section**
   - Featured papers only
   - Configurable count
   - "View all" link

3. **Essays Section**
   - Recent blog posts
   - Chronological sorting
   - Configurable count

4. **Writing Section**
   - Creative writing pieces
   - Recent items first
   - Configurable count

5. **Media Section**
   - Latest press coverage
   - Sorted by date
   - Configurable count

6. **Important Links Section**
   - Uses TableOfContents component with dot leaders
   - Displays as elegant link list without numbers
   - Includes professional and project links
   - Typography-focused design

## Troubleshooting

### Bio Panel Not Showing
- Ensure `bio` section exists in YAML
- Check YAML syntax for errors
- Verify required `narrative` field is provided

### Important Links Section Issues
- Check that `contact.items` is properly formatted array
- Ensure each item has `label`, `href`, and `text` fields
- Test all URLs for validity
- Verify TableOfContents component is properly imported in index.astro

### Section Content Missing
- Verify content exists (e.g., featured research papers)
- Check `itemCount` isn't higher than available content
- Ensure section configuration matches implementation

### YAML Syntax Errors
- Use consistent indentation (2 spaces recommended)
- Check for missing colons after keys
- Ensure arrays use proper dash notation
- Validate YAML syntax with online tools

## Related Files

- **Layout Controller**: `src/pages/index.astro`
- **Bio Panel Component**: `src/components/BioPanel.astro`
- **Contact Component**: `src/components/ContactInfo.astro`
- **Document Sections**: `src/components/DocumentSection.astro`

## Migration Notes

### From Previous Hero System
If migrating from a hero-based homepage:

1. **Move hero content to bio**: Transfer hero description to bio narrative
2. **Remove hero configuration**: Delete `hero` section from YAML
3. **Update contact structure**: Convert to new configurable items format
4. **Test thoroughly**: Ensure all links and content display correctly

### Configuration Updates
- `hero` section removed (no longer needed)
- `currentProjects` commented out (preserved for future use)
- `showcase` replaced with simpler `sections` structure
- `contact` enhanced with configurable items array

This streamlined approach reduces complexity while providing more flexibility for content management. 