# WEBSITE DESIGN BASICS: CONTEXT

Give the model everything it needs to “see” both the current state and your goals:

## 1.	Code or URL: 

/@nathanlane.github.io
Current codebase

## 2.	Font stack: 

### Newsreader Header + IBM Plex Sans Body:

* Headlines/emphasis: “Newsreader Variable”, “Playfair Display”, Georgia, “Times New Roman”, serif
* Body text: “IBM Plex Sans”, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif
* Long-form prose (.prose-serif): “IBM Plex Serif”, serif
* Code/monospace: “IBM Plex Mono”, SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace
* Self-hosted via @fontsource, with variable-font optical sizing, kerning/ligature OpenType features, and optimized system fallbacks


## 3. Design intent

### A. Purpose: 
Academic research portfolio and digital garden	•	Core identity: typographic-forward, academic-technologist, thoughtful, document-centered, minimalist

### B. Keywords: 
```document-centric, text-first, minimal, calm-editorial, typographic, content-first, indie-research-lab, technologist/diy, accessible, monochrome, handcrafted```

### Tone & voice: 
Thoughtful, academic but approachable, DIY-craft

### Visual palette: 
monochrome, serif/sans-serif contrast, optimized typographic, generous whitespace, tiny accent icons, minimize cards/boxes

## Elevator pitch:
“An indie economist-technologist running a one-person research lab, publishing document-centric, minimal, typographic-first interface that feels more like a quiet, handcrafted typographic than a modern website.”

## 4. Modular scale rules and baseline grid:

Modular Scale & Baseline Grid:

- Type-ratio: 1.25 (Major Third) across nine steps (–2…6), e.g.  
  –2 → 12.3–13.8 px, –1 → 12.8–14.4 px, 0 → 15.6–17 px, …, 6 → 57.2–64.9 px  
- Base grid unit: `--grid-unit: 0.375rem` (6 px)  
- Baseline: `--baseline: 1.5rem` (24 px)  
- Spacing tokens (`--space-1`…`--space-24`) are multiples of the grid unit (6, 12, 18, 24, 36, 48, 60, 72 px, etc.)

Read file: private_notes/design-system/DESIGN_SYSTEM.md

## 5. Design Stack and Fluid-type plugin settings

### A. Design Stack

- Astro for the component framework  
- Tailwind CSS with:  
  • `tailwindcss-fluid-type` for fluid typography  
  • `@tailwindcss/typography` for prose styles  
  • A custom Tailwind plugin for semantic typography & spacing utilities  
- CSS variables (Utopia-inspired) for type-scale & spacing  
- Self-hosted fonts via `@fontsource`

### B. Fluid-Type Plugin Configuration

```js
fluidType({
  minScreen: "320px",
  maxScreen: "1280px",
  textSizes: {
    "-2": { minSize: "0.768rem", maxSize: "0.864rem", lineHeight: "1.3889" }, // -> 18px LH
    "-1": { minSize: "0.80rem", maxSize: "0.90rem", lineHeight: "1.6667" }, // -> 24px LH
    "0": { minSize: "0.9375rem", maxSize: "1.0625rem", lineHeight: "1.4118" }, // -> 24px LH
    "1": { minSize: "1.172rem", maxSize: "1.328rem", lineHeight: "1.5385" }, // -> 30px LH
    "2": { minSize: "1.465rem", maxSize: "1.66rem", lineHeight: "1.6364" }, // -> 42px LH
    "3": { minSize: "1.831rem", maxSize: "2.075rem", lineHeight: "1.3103" }, // -> 42px LH
    "4": { minSize: "2.289rem", maxSize: "2.594rem", lineHeight: "1.3125" }, // -> 54px LH
    "5": { minSize: "2.861rem", maxSize: "3.242rem", lineHeight: "1.25" }, // -> 66px LH
    "6": { minSize: "3.576rem", maxSize: "4.053rem", lineHeight: "1.1667" }, // -> 78px LH
  },
})
```

## 6. Inspiration: 

  1. Websites: - https://alexanderobenauer.com/- https://craigmod.com/essays/- https://practicaltypography.com/- https://ia.net/writer- https://maggieappleton.com/garden-history- https://linear.app/- https://gwern.net/
  2. Typographers and designers- Tim Brown, Jost Hochuli, Bringhurst, Swiss Modernism, Edward Tufte

## 7. Constraints:

 1. Must follow the baseline grid.
 2. Changes must should within the grid system and typographic hierarchy
 3.  Swapping the primary font is off-limits.
