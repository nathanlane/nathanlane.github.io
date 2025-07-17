# Phase 1 – Comprehensive Typography Audit  

Below is a detailed, section-by-section evaluation of the current system as documented in `_MAIN_DESIGN_CONTEXT.md`, `DESIGN_SYSTEM.md`, `global.css`, and `tailwind.config.ts`. Where helpful, I flag critical issues (🚨), moderate issues (⚠️) and quick-wins (💡).  

---

## 1. Type Scale & Hierarchy  

1.1 Scale progression  
• Current base: `clamp(0.8125rem → 0.875rem)` (≈ 13–14 px) for step 0.  
• Ratio: 1.25 (Major Third) across 9 steps (–2…6).  
• Strengths  
  – Musical ratio creates harmonious progression.  
  – Steps map cleanly to headings/body utility classes (`text--2` … `text-6`).  
• Issues  
  🚨 Visual gap between `text-1` (18–21 px) and `text-2` (23–26 px) is perceptible at small viewports; H4/H5 may feel too close to body size.  
  ⚠️ Display sizes (`text-5`, `text-6`) jump in weight/size but share the same letter-spacing settings as smaller headings → cramped appearance on desktop.  

1.2 Hierarchy effectiveness  
• H1–H6 cascade is logical, but:  
  – H4 (class `heading-4` = `text-1`) is only ~7-10 px larger than body; may lack emphasis.  
  – Captions (`text--2`) sometimes render at 10 px on small screens—below recommended a11y minimum (12 px).  

1.3 Fluid responsiveness  
• Clamp functions use identical slope between steps; scale grows predictably 320 → 1280 px.  
• Edge case: >1280 px the scale “locks” and very wide monitors show conservative sizes (might feel undersized).  

1.4 Inconsistencies  
• Some components still rely on Tailwind default sizes (`text-xl`, `text-2xl`) instead of semantic tokens, breaking the hierarchy.  
• Blog post templates use Markdown-generated `<h3>` styled with `heading-3`, but manual headings in MDX often receive vanilla `###` without class → default browser size (🚨).  

---

## 2. Vertical Rhythm & Spacing  

2.1 Line-height ratios  
• Body (`text-0`): 1.6 – solid.  
• Steps –2…–1 use 1.35 – might feel tight for dense meta text.  
• Headings tighten to 1.05–1.2 – good, but H2 (`text-3`) sometimes wraps to 3 lines on mobile, causing uneven rhythm.  

2.2 Paragraph spacing  
• Spec says 24 px baseline (`4b`) between paragraphs, yet many MDX prose blocks inherit default Tailwind `mb-4` (16 px) (⚠️).  
• No automatic half-leading compensation → occasional baseline slippage.  

2.3 Baseline grid adherence  
• Global grid unit 6 px is thoughtful, but utilities `space-5` (30 px) and `space-6` (36 px) are skipped in many components in favour of Tailwind `p-6` (24 px).  
• Components mix CSS variable spacing with raw rem/px.  

2.4 Component relationships  
• Cards, hero, and footer respect larger multiples (`8b`, `10b`), but nav links, badges, and chip components use Tailwind defaults (2/4 px paddings).  

---

## 3. Measure & Readability  

3.1 Line length  
• `.max-w-prose` limits to ≈ 65ch → excellent.  
• Sidebar & note layouts exceed 80ch on 1280 px+.  

3.2 Container widths  
• Blog post body is fixed `max-w-3xl` (~48rem). At 1440 px viewport, combined with serif body the measure grows to 76–78ch (⚠️ borderline).  

3.3 Contrast & a11y  
• Light mode passes WCAG AA for body text (≈ #1a1a1a on #ffffff).  
• Dark mode headings (#e9e9e9 on #090909) meet contrast but thin weight 300 for Newsreader H1 hits 4.2:1 – minimal margin for error.  

3.4 Font weights & legibility  
• Newsreader 300 weight for H1 is elegant at large sizes, but on mobile (≈ 37 px) hairlines weaken (🚨).  
• Body uses IBM Plex Sans 300 – good readability; code blocks default to system mono.  

---

## 4. Typographic Details  

4.1 Letter-spacing / tracking  
• No explicit tracking set; Newsreader default tracking at optical size 48 can be tight → “fi”, “ffl” collisions.  
• Uppercase nav links need +0.05em letter-spacing for readability.  

4.2 Font features  
• `font-feature-settings: "kern" "liga"` not explicitly enabled; many browsers default to on, but Safari requires manual enabling for some OT features.  

4.3 Widows, orphans, rivers  
• CSS property `p { widows: 2; orphans: 2; }` absent. Rivers occasionally visible in left-aligned body paragraphs at 1200 + px width.  

4.4 Hyphenation & wrapping  
• `hyphens: auto;` disabled → long German/CJK words overflow in narrow columns.  

---

## 5. Visual Harmony  

5.1 Type pairing  
• Newsreader + IBM Plex pairing is strong; Plex Serif for long-form prose provides subtle contrast.  

5.2 Consistency  
• Semantic classes embraced in new components but legacy pages still mix Tailwind default utilities.  

5.3 White space & breathing room  
• Generous macro-spacing in hero/footer.  
• Inline elements (Badges, Buttons) feel cramped vertically because padding is smaller than x-height multiples.  

5.4 Alignment & grid  
• Main column aligns to 12-column grid; but pull quotes and images occasionally break outer grid gutters on mobile.  

---

# Critical Issues to Address First  

1. **Hierarchy Gaps** – Strengthen mid-range headings (H4/H5) and ensure all Markdown headings inherit semantic classes.  
2. **Paragraph Spacing Mismatch** – Replace default `mb-4` with baseline-aligned variable (`space-4` / `4b`).  
3. **Newsreader Thin Weight on Mobile** – Raise weight to 400 below 480 px or add text-shadow fallback.  
4. **Letter-spacing for Display Sizes** – Apply –0.015 em tracking for `text-5/6`; add +0.05 em for uppercase nav links.  
5. **Legacy Utility Leakage** – Audit and migrate all `text-xl`, `p-6`, etc., to semantic tokens.  

---

Next step: I’ll draft specific refinement recommendations—updated fluid-type config, spacing tokens, Tailwind overrides, and an implementation checklist—then package them with code snippets and testing steps as requested.

## Phase 2 – Refinement Recommendations  

Below are concrete changes to evolve the audit findings into an improved, unified
typography system. Each subsection explains **why** and then shows **how** with
copy-and-paste-ready snippets.

### 1. Fluid-Type Configuration  
Bump body size to 16→18 px, keep the 1 : 1.25 ratio, and tighten display sizes.  
```ts
// tailwind.config.ts
import { fluidType } from "tailwindcss-fluid-type";

export default {
  theme: {
    /* the plugin will generate font-size utilities from this map */
  },
  plugins: [
    fluidType({
      minScreen: "320px",
      maxScreen: "1280px",
      textSizes: {
        "-2": { minSize: "0.8rem",  maxSize: "0.9rem",   lineHeight: "1.45" },
        "-1": { minSize: "0.9rem",  maxSize: "1rem",    lineHeight: "1.5"  },
        "0" : { minSize: "1rem",    maxSize: "1.125rem", lineHeight: "1.6"  },
        "1" : { minSize: "1.25rem", maxSize: "1.4rem",  lineHeight: "1.5"  },
        "2" : { minSize: "1.56rem", maxSize: "1.75rem", lineHeight: "1.4"  },
        "3" : { minSize: "1.95rem", maxSize: "2.2rem",  lineHeight: "1.3"  },
        "4" : { minSize: "2.34rem", maxSize: "2.6rem",  lineHeight: "1.25" },
        "5" : { minSize: "2.93rem", maxSize: "3.25rem", lineHeight: "1.2"  },
        "6" : { minSize: "3.52rem", maxSize: "4rem",    lineHeight: "1.15" },
      },
    }),
    require("@tailwindcss/typography"),
  ],
};
```

### 2. Spacing Tokens  
Stay on a 6 px micro-grid that nests into the 24 px baseline. Add missing
variables for 30 px (`5b`) and 36 px (`6b`).  
```css
/* src/styles/global.css */
:root {
  --baseline: 1.5rem;        /* 24px */
  --grid-unit: 0.375rem;     /* 6px  */

  /* existing tokens */
  --space-1:  calc(var(--grid-unit) * 1);  /*  6px */
  --space-2:  calc(var(--grid-unit) * 2);  /* 12px */
  --space-3:  calc(var(--grid-unit) * 3);  /* 18px */
  --space-4:  calc(var(--grid-unit) * 4);  /* 24px */
  /* NEW tokens */
  --space-5:  calc(var(--grid-unit) * 5);  /* 30px */
  --space-6:  calc(var(--grid-unit) * 6);  /* 36px */
  /* …keep existing 8/10/12/etc. */
}
```
Then surface them in Tailwind:  
```ts
// tailwind.config.ts
spacing: {
  '1':  'var(--space-1)',  // 6
  '2':  'var(--space-2)',  // 12
  '3':  'var(--space-3)',  // 18
  '4':  'var(--space-4)',  // 24
  '5':  'var(--space-5)',  // 30
  '6':  'var(--space-6)',  // 36
  '8':  'var(--space-8)',  // 48
  '10': 'var(--space-10)', // 60
  '12': 'var(--space-12)', // 72
},
```

### 3. Tailwind Overrides & Optical Tweaks  
```ts
// tailwind.config.ts
extend: {
  letterSpacing: {
    tightest:   "-0.02em",   // captions, Newsreader H1
    tighter:    "-0.015em",  // H2–H3
    wideUpper:  "0.05em",    // uppercase nav links
  },
  fontWeight: {
    h1: 400,   // bump Newsreader weight on mobile
  },
},
```
Apply utilities:  
```html
<h1 class="heading-1 tracking-tightest font-h1">Title</h1>
<nav class="tracking-wideUpper">ABOUT</nav>
```

### 4. Component Migration Map  
| Component | Current util | Replace with |
|-----------|-------------|--------------|
| Badge     | `px-2 py-1` | `px-space-2 py-space-1` |
| Button    | `px-4 py-2` | `px-space-3 py-space-2` |
| NavLink   | `text-sm`   | `text--1 tracking-wideUpper` |
| Card      | `p-6`       | `p-space-6` |

### 5. Implementation Checklist  
- [ ] **Fluid scale**: drop new `fluidType` config & regenerate build.  
- [ ] **Spacing tokens**: update `global.css`, purge rogue 4 px/2 px utilities.  
- [ ] **Optical tweaks**: add letter-spacing & weight utilities, refactor H1–H3.  
- [ ] **Component sweep**: grep for `text-xl|text-2xl|p-6` and migrate.  
- [ ] **Baseline QA**: enable `.baseline-grid` overlay and inspect key pages.  
- [ ] **Accessibility**: run `npm run a11y` (Lighthouse) & verify at ≥ 4.5 : 1.  
- [ ] **Cross-browser**: Safari/Firefox/Chrome, 320 → 1920 px, dark/light.  
- [ ] **Docs**: capture before/after screenshots; update `DESIGN_SYSTEM.md`.

### 6. Testing Steps  
1. `pnpm dev` and visit `/debug/typography` page.  
2. Toggle light/dark; ensure headings remain readable.  
3. Resize to 360 px – captions >= 12 px & H1 weight auto-switches.  
4. Use baseline overlay to verify paragraphs align.  
5. Print preview: confirm 65 ch measure & 1.2 line-height override.  
6. Run Vitest snapshot on affected components.  

💡 **Quick win**: a grep-based lint-rule (`biome`) can block any PR that
introduces non-grid spacing classes like `p-3`, `m-1`, etc.

---
End of Phase 2 recommendations.