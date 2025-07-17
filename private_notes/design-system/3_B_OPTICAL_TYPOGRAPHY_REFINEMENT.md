# Optical Typography Refinement Plan

## 1. Executive Summary

**Objective:** To implement micro-typographic refinements that enhance readability, visual harmony, and the "handcrafted" aesthetic. This plan focuses on optical adjustments for our specific font stack (Newsreader and IBM Plex) while ensuring all changes maintain perfect alignment with the established 6px/24px baseline grid.

**Core Principles Addressed:**
*   **`Calm-editorial` & `Minimal`**: Achieved by reducing visual noise and creating text blocks that are comfortable to read.
*   **`Typographic` & `Handcrafted`**: Achieved by applying detailed, font-specific adjustments that go beyond default browser rendering.
*   **`Accessible`**: Achieved by improving legibility at all sizes and in all themes.

This plan builds directly on the foundational work of the `TYPOGRAPHY_AUDIT.md` and `SPACING_REFINEMENT_PLAN.md`.

---

## 2. Header Text Refinements (Newsreader)

Newsreader is an elegant, high-contrast serif. These refinements will lean into its editorial character.

### 2.1. Optical Size (`opsz`)

*   **Why:** Newsreader is a variable font with an optical size axis. This means it has different designs optimized for different font sizes. Larger text should use the more detailed, higher-contrast "Display" cut, while smaller headings need the sturdier "Text" cut.
*   **How (in `tailwind.config.ts`):** We have already implemented this in the `heading-*` utilities. This note serves to confirm its importance and lock in the strategy.
    ```javascript
    // Example for .heading-1
    ".heading-1": {
      // ...
      fontVariationSettings: '"opsz" 72, "wght" 400',
      "@media (max-width: 640px)": {
        fontVariationSettings: '"opsz" 48, "wght" 400',
      },
    },
    ```

### 2.2. Tracking (Letter-Spacing)

*   **Why:** Large display headlines often look better with slightly negative tracking to create a tighter, more cohesive visual unit. Conversely, smaller subheadings can benefit from a touch more space to maintain clarity.
*   **How (in `tailwind.config.ts`):** The current implementation already specifies tracking. This is a confirmation that the values are appropriate and should be maintained as a core part of the design.
    ```javascript
    // Example values already implemented
    ".heading-1": { letterSpacing: "-0.03em" },
    ".heading-2": { letterSpacing: "-0.02em" },
    ".heading-3": { letterSpacing: "-0.015em" },
    ```

### 2.3. Dark Mode Weight Correction

*   **Why:** White text on a dark background can appear bolder due to an optical effect called "halation" or "glow." To maintain the intended typographic color and texture, we should render the font at a slightly lighter weight in dark mode.
*   **How (in `tailwind.config.ts`):** The current utilities already implement this. This is correct and aligns with best practices for dark mode typography.
    ```javascript
    // Example for .heading-1
    ":root[data-theme='dark'] &": {
      fontWeight: "375", // Lighter than the light-mode weight of 400
      fontVariationSettings: '"opsz" 72, "wght" 375',
    },
    ```

---

## 3. Body Text Refinements (IBM Plex Sans & Serif)

IBM Plex is a workhorse known for its clarity. These refinements focus on maximizing long-form readability.

### 3.1. Subtle Tracking Increase

*   **Why:** For long passages of text, a tiny increase in letter-spacing can improve word-shape recognition and reduce reader fatigue, enhancing the "calm-editorial" feel.
*   **How (in `src/styles/global.css`):**
    ```css
    /* In the body or .prose class definition */
    body {
      /* ... existing styles */
      letter-spacing: 0.005em; /* A very subtle addition */
    }
    ```

### 3.2. OpenType Features

*   **Why:** IBM Plex comes with a rich set of OpenType features. We should ensure the most beneficial ones for readability are enabled.
    *   `kern`: Essential for proper character spacing.
    *   `liga`: Combines common letter pairs (like `fi`, `fl`) into a single glyph.
    *   `calt`: Contextual alternates that adjust glyphs based on surrounding letters.
    *   `ss01`: (For IBM Plex Sans) This stylistic set provides a simpler, single-story "a," which is widely considered more readable in body copy.
*   **How (in `src/styles/global.css`):**
    ```css
    /* This is already implemented, but is confirmed here as correct. */
    body {
      /* ... existing styles */
      font-feature-settings:
        "kern" 1,
        "liga" 1,
        "calt" 1,
        "ss01" 1; /* Enables the single-story 'a' */
    }
    ```

### 3.3. Dark Mode Color & Weight

*   **Why:** Just like headings, pure white (`#FFF`) body text on a black background can cause eye strain. Using a slightly off-white color and a marginally lighter font weight improves reading comfort.
*   **How (in `src/styles/global.css`):** We should define a specific text color for dark mode that isn't pure white.
    ```css
    :root[data-theme="dark"] {
      --theme-text: hsl(30deg 10% 95% / 0.95); /* A very light, slightly warm gray */
    }

    [data-theme="dark"] body {
      /* Optionally, render the font a touch lighter if needed */
      font-weight: 380; /* If base is 400 */
    }
    ```
    *(Note: This needs to be tested visually to find the perfect balance.)*

---

## 4. Decorative & UI Text Refinements

This covers metadata, captions, buttons, and other small text elements.

### 4.1. Uppercase Tracking

*   **Why:** This is a fundamental typographic rule. Small text set in all-caps needs significant extra letter-spacing to be legible. Without it, the letters bunch together and become a blur.
*   **How:** We already created the `.tracking-nav` utility. We must ensure it's applied to *all* small, uppercase text.
    *   **Action:** Audit all components with `text-transform: uppercase` (e.g., `Badge.astro`, `Button.astro`, metadata labels) and ensure they are using a utility that provides at least `letter-spacing: 0.05em`.
    *   **Tailwind Config:** We can create more tracking utilities for this purpose.
        ```javascript
        // tailwind.config.ts
        extend: {
          letterSpacing: {
            'nav': '0.05em',
            'caps-generous': '0.075em',
            'caps-loose': '0.1em',
          }
        }
        ```

### 4.2. True Small Caps

*   **Why:** For a truly "handcrafted" and "typographic-first" feel, we should use the font's designed small caps where appropriate, rather than faking it with `text-transform: uppercase` and a smaller font size.
*   **How (in `tailwind.config.ts` or a new utility class):**
    ```css
    .text-small-caps {
      font-feature-settings: "smcp" 1, "c2sc" 1, "kern" 1;
      /* smcp: Small Caps, c2sc: Small Caps From Capitals */
      text-transform: none; /* Disable uppercase transform */
      letter-spacing: 0.075em; /* Small caps require generous spacing */
    }
    ```
    This class can then be applied to metadata or other labels for a more refined look.

---

## 5. Safeguards: Protecting the Baseline Grid

Optical refinements must not break our hard-won grid alignment.

*   **Safeguard 1: Use Padding, Not Margin.**
    *   If a refinement causes a heading to shift off the baseline, use `padding-top` or `padding-bottom` (e.g., `pt-px`) to nudge it back into place. Padding adjusts the space *inside* the element's box without affecting the layout flow around it.

*   **Safeguard 2: Use Transform for Sub-Pixel Adjustments.**
    *   For very fine optical adjustments that padding can't handle, `transform: translateY(1px)` is an excellent tool. It moves the element visually without disrupting its place in the document flow, meaning it won't affect the spacing of elements above or below it.

*   **Safeguard 3: Encapsulate Fixes in Utility Classes.**
    *   Instead of adding corrective properties directly in multiple places, create a dedicated utility class.
    *   **Example:**
        ```css
        .heading-1- optically-aligned {
          @apply heading-1 pt-px; /* Nudge down by 1px to align with grid */
        }
        ```

*   **Safeguard 4: The Visual Grid Overlay is Non-Negotiable.**
    *   **The ultimate test.** After applying any of these refinements, the `show-baseline` test from the previous plan **must** be used to visually confirm that the text's baseline still kisses the 24px grid lines.

## 6. Implementation Checklist

-   [ ] **Phase 1: Body Text**
    -   [ ] Apply subtle `letter-spacing` to the `body` element in `global.css`.
    -   [ ] Test and refine the dark mode text color to be slightly off-white.

-   [ ] **Phase 2: Decorative Text**
    -   [ ] Create new `letterSpacing` utilities in `tailwind.config.ts` for small caps (`caps-generous`, `caps-loose`).
    -   [ ] Audit all components with `text-transform: uppercase` and apply appropriate generous tracking.
    -   [ ] Create and apply a `.text-small-caps` utility for a key piece of metadata (e.g., post tags) to test the effect.

-   [ ] **Phase 3: Grid Verification**
    -   [ ] Activate the `.show-baseline` grid overlay.
    -   [ ] Review all pages, paying close attention to the elements we've just refined.
    -   [ ] Apply corrective padding or transforms where necessary to maintain perfect grid alignment.
    -   [ ] Document any corrective classes created. 