# IBM Plex Sans Body Font Optimization Plan

## Executive Summary

This plan refines IBM Plex Sans implementation for optimal body text readability within our **6px baseline grid** and **fluid typography system**. Building on our existing `text-0` (15.6-17px) base size and 1.4118 line height, we focus on **micro-optimizations** that enhance reading comfort while maintaining perfect grid alignment and our document-centric aesthetic.

## IBM Plex Sans: Design Intent & Grid Alignment

### Font DNA & System Integration
- **Heritage**: Designed by Mike Abbink & Bold Monday for IBM
- **Concept**: Balance between engineered precision and humanist warmth
- **Grid Harmony**: x-height aligns naturally with our 6px baseline
- **Fluid Integration**: Works perfectly with our clamp() type scale
- **OpenType Rich**: Extensive features for typographic refinement

### Current System Alignment ✅
- **Base Size**: `text-0` → 15.6-17px (clamp formula)
- **Line Height**: 1.4118 → 24px baseline alignment
- **Grid Units**: All spacing uses `--space-*` (6px multiples)
- **Semantic Classes**: `.text-body`, `.text-body-sm` implemented
- **Measure**: `max-w-prose` → 65ch optimal reading width

## Refinement Strategy Within Grid Constraints

### 1. Weight Progression (Maintains Grid)

Our weight adjustments work within the existing fluid system without breaking baseline alignment:

| Context | Current | Proposed | Grid Impact |
|---------|---------|----------|-------------|
| Body text (light) | 400 | 380 | No change - same line height |
| Body text (dark) | 380 | 365 | No change - same line height |
| `.text-body-sm` | 400 | 410 | No change - uses text--1 |
| UI elements | 400 | 400 | No change - maintain clarity |
| Strong/Bold | 600 | 550 | No change - inline emphasis |

### 2. Enhanced OpenType Features (Grid-Aware)

```css
/* Base body text - enhanced features within existing system */
.text-body {
  /* Existing grid-aligned properties unchanged */
  font-size: var(--step-0); /* 15.6-17px fluid */
  line-height: 1.4118; /* 24px baseline alignment */
  
  /* Weight refinement */
  font-weight: 380;
  
  /* Enhanced OpenType features */
  font-feature-settings:
    "kern" 1,      /* Kerning */
    "liga" 1,      /* Standard ligatures */
    "calt" 1,      /* Contextual alternates */
    "ss01" 1,      /* Simplified 'a' */
    "tnum" 0,      /* Proportional numbers for prose */
    "onum" 1;      /* Old-style figures for text */
}

/* Dark mode maintains grid alignment */
[data-theme="dark"] .text-body {
  font-weight: 365; /* Lighter for better contrast */
}

/* Small text using existing text--1 class */
.text-body-sm {
  /* Grid-aligned: 12.8-14.4px, 24px line-height */
  font-weight: 410; /* Slightly heavier at small size */
  letter-spacing: 0.01em; /* More space for legibility */
}
```

### 3. Letter-Spacing Within Baseline Grid

```css
/* Micro-adjustments that preserve vertical rhythm */
.text-body {
  letter-spacing: 0.008em; /* Increased from 0.005em */
}

/* Context-specific adjustments - all maintain grid */
.prose .text-body {
  letter-spacing: 0.006em; /* Tighter for long-form reading */
}

.sidebar .text-body,
.caption .text-body {
  letter-spacing: 0.012em; /* More space for scanning */
}

/* Mobile optimization within fluid system */
@media (max-width: 640px) {
  .text-body {
    letter-spacing: 0.01em; /* Slightly more on small screens */
  }
}
```

### 4. Hyphenation & Word Breaking (Grid-Safe)

```css
/* Enhanced hyphenation - preserves line height */
.text-body,
.prose {
  hyphens: auto;
  hyphenate-limit-chars: 6 3 2; /* min word, before, after */
  hyphenate-limit-lines: 2; /* max consecutive */
  hyphenate-limit-zone: 8%; /* avoid near line end */
  
  /* Ensure proper language support */
  lang: en;
}

/* Conservative hyphenation for narrow measures */
.measure-narrow .text-body {
  hyphenate-limit-chars: 7 4 3; /* Longer minimums */
  hyphenate-limit-lines: 1; /* Only one consecutive */
}
```

### 5. Responsive Reading Comfort (Grid-Aligned)

```css
/* Container query adjustments within existing measure system */
.measure-base {
  /* Uses existing max-w-prose (65ch) */
  container-type: inline-size;
}

@container (min-width: 60ch) {
  .text-body {
    /* Slightly tighter tracking at optimal width */
    letter-spacing: 0.006em;
  }
}

@container (max-width: 45ch) {
  .text-body {
    /* More spacing in narrow contexts */
    letter-spacing: 0.012em;
  }
}

/* High-DPI display optimization */
@media (-webkit-min-device-pixel-ratio: 2) {
  .text-body {
    font-weight: 375; /* Can go lighter on sharp displays */
  }
  
  [data-theme="dark"] .text-body {
    font-weight: 360; /* Further reduced for dark mode */
  }
}
```

### 6. Context-Sensitive Typography Classes

Building on our semantic system:

```css
/* Enhanced semantic classes - all grid-aligned */
.text-lead {
  /* Uses existing text-1 (18.8-21.3px, 30px line-height) */
  font-weight: 375; /* Lighter for prominence */
  letter-spacing: 0.004em; /* Tighter at larger size */
  font-feature-settings:
    "kern" 1, "liga" 1, "calt" 1, "ss01" 1, "onum" 1;
}

.text-meta {
  /* Uses existing text--1 (12.8-14.4px, 24px line-height) */
  font-weight: 425; /* Heavier for small size */
  letter-spacing: 0.05em; /* Wide tracking for caps */
  text-transform: uppercase;
  font-feature-settings:
    "kern" 1, "liga" 0, "case" 1, "lnum" 1;
}

.text-caption {
  /* Uses existing text--1 baseline */
  font-weight: 400;
  font-style: italic;
  letter-spacing: 0.008em;
  color: var(--theme-text-lighter);
}
```

### 7. Performance Optimization (System-Aware)

```css
/* Optimized font loading within @fontsource system */
@font-face {
  font-family: 'IBM Plex Sans';
  font-weight: 100 700;
  font-style: normal;
  font-display: swap;
  src: url('@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-variable-wght-normal.woff2') format('woff2-variations');
}

/* Progressive enhancement for variable fonts */
@supports (font-variation-settings: normal) {
  .text-body {
    font-family: 'IBM Plex Sans Variable', 'IBM Plex Sans', sans-serif;
    font-variation-settings: "wght" 380;
  }
  
  [data-theme="dark"] .text-body {
    font-variation-settings: "wght" 365;
  }
  
  .text-body-sm {
    font-variation-settings: "wght" 410;
  }
}
```

### 8. Accessibility Enhancements (Grid-Compliant)

```css
/* High contrast mode - maintains baseline alignment */
@media (prefers-contrast: high) {
  .text-body {
    font-weight: 425; /* Heavier weight */
    letter-spacing: 0.015em; /* More spacing */
    /* Line height unchanged - preserves grid */
  }
}

/* Reduced motion - preserve grid */
@media (prefers-reduced-motion: reduce) {
  .text-body {
    transition: none;
  }
}

/* Focus improvements within grid system */
:focus-visible {
  outline: 3px solid var(--theme-accent);
  outline-offset: var(--space-1); /* 6px = 1 grid unit */
  border-radius: var(--space-1); /* 6px radius */
}
```

## Implementation Using Existing System

### Phase 1: Weight & Feature Updates (Week 1)
```css
/* Add to existing global.css */
.text-body {
  font-weight: 380; /* Down from 400 */
  letter-spacing: 0.008em; /* Up from 0.005em */
  font-feature-settings:
    "kern" 1, "liga" 1, "calt" 1, "ss01" 1, "onum" 1;
}

[data-theme="dark"] .text-body {
  font-weight: 365;
}
```

### Phase 2: Context Refinements (Week 2)
```css
/* Enhanced semantic classes */
.text-body-sm { font-weight: 410; letter-spacing: 0.01em; }
.text-lead { font-weight: 375; letter-spacing: 0.004em; }
.text-meta { font-weight: 425; letter-spacing: 0.05em; }
.text-caption { font-style: italic; letter-spacing: 0.008em; }
```

### Phase 3: Advanced Features (Week 3)
- Container query optimizations
- Variable font progressive enhancement
- High-DPI display optimizations
- Enhanced hyphenation rules

## Grid Compliance Checklist

### ✅ Baseline Grid Maintained
- [ ] No changes to line-height values
- [ ] All spacing uses `--space-*` tokens
- [ ] Font sizes stay within fluid scale
- [ ] Vertical rhythm preserved

### ✅ Design System Integration
- [ ] Uses existing semantic classes
- [ ] Works with current theme system
- [ ] Maintains measure constraints
- [ ] Preserves accessibility features

### ✅ Performance Considerations
- [ ] No additional font files required
- [ ] Progressive enhancement approach
- [ ] Existing @fontsource integration
- [ ] Browser compatibility maintained

## Success Metrics

### Readability Improvements
- [ ] Improved reading comfort scores
- [ ] Better long-form engagement
- [ ] Reduced eye strain reports
- [ ] Enhanced visual hierarchy

### Technical Performance
- [ ] Zero layout shift (CLS = 0)
- [ ] Same font loading performance
- [ ] Grid alignment verification
- [ ] Cross-browser consistency

### System Integration
- [ ] Perfect baseline alignment
- [ ] Semantic class compatibility
- [ ] Theme system harmony
- [ ] Component integration

## Conclusion

This optimization plan enhances IBM Plex Sans within our existing design constraints. By focusing on **weight refinement**, **OpenType features**, and **micro-spacing adjustments**, we improve readability while maintaining perfect **6px baseline grid alignment** and **fluid typography system** integrity.

The approach respects our design principles:
- **Grid-first**: Every change preserves baseline rhythm
- **System-aware**: Uses existing semantic classes and tokens
- **Typography-forward**: Enhanced features improve reading experience
- **Document-centric**: Optimized for long-form content
- **Minimal**: Invisible improvements that don't break existing design

These refinements create a more comfortable reading experience that maintains perfect harmony with our Newsreader headers and design system architecture, proving that sophisticated typography can work within systematic constraints. 