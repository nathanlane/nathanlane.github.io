---
title: "Homepage Configuration Guide"
description: "How to easily customize the homepage content sections, including item counts and text"
publishDate: "2025-01-15"
tags: ["documentation", "guide", "configuration"]
series: "lane-docs"
seriesOrder: 10
draft: false
---

The homepage content sections (Recent Papers, Recent Writing, Recent Media) can be easily customized through a single configuration file without touching any code.

## Configuration File Location

Edit the following file to customize the homepage sections:
```
src/content/homepage/index.yaml
```

## Configuration Options

### Content Sections

The `contentSections` configuration controls three main areas on the homepage:

```yaml
showcase:
  title: "What I'm Working On"
  contentSections:
    research:
      title: "Recent Papers"           # Section heading
      itemCount: 3                     # Number of papers to display
      viewAllText: "View all research papers"  # Link text
      viewAllUrl: "/research/"         # Link destination
    
    writing:
      title: "Recent Writing"          # Section heading
      itemCount: 2                     # Number of writing pieces
      viewAllText: "View all writing"  # Link text
      viewAllUrl: "/writing/"          # Link destination
    
    media:
      title: "Recent Media"            # Section heading
      itemCount: 5                     # Number of media items
      viewAllText: "View all media coverage"  # Link text
      viewAllUrl: "/media/"            # Link destination
```

### What Each Setting Controls

- **title**: The heading displayed above each section
- **itemCount**: How many items to show in that section
- **viewAllText**: The text for the "view all" link at the bottom of each section
- **viewAllUrl**: Where the "view all" link goes

## Examples

### Show More Research Papers
To display 5 research papers instead of 3:
```yaml
research:
  title: "Recent Papers"
  itemCount: 5  # Changed from 3
  viewAllText: "View all research papers"
  viewAllUrl: "/research/"
```

### Change Section Titles
To rename "Recent Media" to "Press Coverage":
```yaml
media:
  title: "Press Coverage"  # Changed from "Recent Media"
  itemCount: 5
  viewAllText: "View all press coverage"
  viewAllUrl: "/media/"
```

### Customize Link Text
To change the "view all" link text:
```yaml
writing:
  title: "Recent Writing"
  itemCount: 2
  viewAllText: "Browse all essays →"  # Custom text
  viewAllUrl: "/writing/"
```

## Other Homepage Settings

The same file also controls:

- **Hero Section**: Title, description, and buttons
- **Current Projects**: List of featured projects
- **Posts Section**: Number of blog posts to display

After making changes, restart the development server or rebuild the site to see your updates.