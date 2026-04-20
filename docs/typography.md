# Typography

This site’s visual system is typography-first and intentionally stable. Treat this document as the operating reference for typography work.

## Current system

- Primary typeface: Inter Variable
- Code and metadata typeface: JetBrains Mono
- Scale: fluid type via `tailwindcss-fluid-type`
- Spacing system: 6px grid with baseline-aligned spacing tokens
- Reading measure: `65ch` via `.measure-base`
- Dark mode: class-based and `data-theme="dark"`

## Source files

| Concern | Source |
| --- | --- |
| Fluid scale, spacing tokens, semantic classes | [tailwind.config.ts](../tailwind.config.ts) |
| Global typography and theme variables | [src/styles/global.css](../src/styles/global.css) |
| Link system | [src/styles/links.css](../src/styles/links.css) |
| Font loading | [src/components/BaseHead.astro](../src/components/BaseHead.astro) |

## Working rules

- Preserve the existing visual language unless a change is required for correctness or an explicit redesign is requested
- Prefer existing semantic classes such as `.heading-*`, `.text-body`, `.text-lead`, and the link classes already defined in CSS
- Prefer the spacing and reading-measure utilities already in the Tailwind config over one-off values
- Keep body text comfortable for long-form reading and preserve the current 65ch measure
- Check both light and dark themes before merging typography or layout changes

## Editing guidance

Start in the existing system rather than layering a second one on top:

1. Change tokens or semantic classes in `tailwind.config.ts` if the pattern should be reusable.
2. Change shared CSS in `src/styles/global.css` if the rule belongs to the global typography system.
3. Change component markup only when a local exception is necessary.

## Validation checklist

When typography changes:

- test mobile and desktop widths
- test one long post and one list page
- test light and dark modes
- check code blocks, metadata rows, and headings
- confirm no spacing-token or font regressions were introduced accidentally
