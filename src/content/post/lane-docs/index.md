---
title: "Documentation Index"
publishDate: "July 14 2025"
description: "Complete documentation for the website's design system, implementation guides, and technical references"
seriesId: lane-docs
orderInSeries: 0
tags: ["documentation", "index"]
---

# Documentation Index

Welcome to the comprehensive documentation for this website. This documentation covers everything from the design system to implementation details and AI assistant guidelines.

## Core Documentation

### Design System
- **[Design System Overview](/posts/lane-docs/design-system/)** - Complete guide to typography and spacing
- **[Typography System](/posts/lane-docs/typography-system/)** - Implementation phases and current state
- **[Color System](/posts/lane-docs/color-system/)** - Color architecture and usage patterns
- **[Grid System Plan](/posts/lane-docs/grid-optimization-plan/)** - 6px grid implementation guide

### Getting Started
- **[Introduction](/posts/lane-docs/intro/)** - About the Lane website template
- **[Setup Guide](/posts/lane-docs/setup/)** - Installation and configuration
- **[Theme Customization](/posts/lane-docs/theme/)** - Customizing the template
- **[Webmaster Guide](/posts/lane-docs/webmaster-guide/)** - Complete guide for managing and deploying the site

## Recent Updates

### Baseline Grid Refactoring Complete (July 14, 2025)
- **[Baseline Grid Refactoring Complete](/posts/baseline-grid-refactoring-complete/)** - Documentation of the successful enforcement across all core layouts

### Typography & Spacing Blog Post
We've also published a detailed blog post explaining the typography and spacing system:
- **[Understanding the Typography & Spacing System](/posts/design-system-typography-spacing/)** - User-friendly guide with examples

## AI Assistant Guidelines

For AI assistants working with this codebase, please refer to:
- **CLAUDE.md** (in repository root) - Guidelines for Claude AI
- **GEMINI.md** (in repository root) - Guidelines for Gemini AI

These files must remain in the repository root for AI assistants to find them.

## Quick Reference

### Typography Scale
- `text--2` to `text-6`: Fluid type that scales between viewports
- Base size (`text-0`): 15px mobile → 17px desktop

### Spacing Scale
- Based on 6px grid unit
- `space-1` (6px) through `space-24` (144px)
- 24px baseline for vertical rhythm

### Making Changes
1. **Typography**: Edit `tailwind.config.ts` → `textSizes`
2. **Spacing**: Edit `src/styles/global.css` → `--grid-unit`
3. **Colors**: Edit `src/styles/global.css` → `:root` variables

## Contributing

When adding new documentation:
1. Create a new `.md` file in `/src/content/post/citrus-docs/`
2. Add proper frontmatter with `seriesId: lane-docs`
3. Set appropriate `orderInSeries` number
4. Update this index if needed

## External Resources

### Typography References
The `/context/` folder contains typography theory from renowned experts:
- Robert Bringhurst - "The Elements of Typographic Style"
- Matthew Butterick - "Butterick's Practical Typography"
- Jost Hochuli - "Detail in Typography"
- Emil Ruder - "Typography: A Manual of Design"

These provide the theoretical foundation for our design decisions.