# Grid-First Spacing & Alignment Refinement Plan

With the typography and baseline grid now functioning correctly, the next step is to ensure all components and layouts rigorously adhere to this grid. This will create a calmer, more harmonious, and visually consistent experience.

## Phase 1: Global Layout and Prose Refinements

This phase focuses on the main content areas, establishing the core vertical rhythm.

*   **Step 1.1: Visual Baseline Grid Test.**
    *   **Action:** Add a temporary CSS class to a global layout (e.g., `src/layouts/Base.astro`) to render a repeating 24px background gradient. This allows us to "see" the grid and verify alignment.
    *   **CSS:** `.show-baseline { background-image: repeating-linear-gradient(transparent, transparent 23px, hsla(204, 8%, 76%, 0.25) 24px); }`

*   **Step 1.2: Refactor `@tailwindcss/typography` (`prose`) Spacing.**
    *   **Problem:** The default `prose` styles from Tailwind add their own opinionated margins to elements like paragraphs, headings, and lists, which do not align with our `*b` grid system.
    *   **Action:** Extend the typography plugin in `tailwind.config.ts` to override its default spacing. Replace all `em`-based margins with our `var(--space-*b)` variables.
    *   **Example:**
        ```javascript
        // tailwind.config.ts
        typography: (theme) => ({
          DEFAULT: {
            css: {
              'h2, h3': {
                marginTop: 'var(--space-8b)',
                marginBottom: 'var(--space-4b)',
              },
              p: {
                marginTop: 'var(--space-4b)',
                marginBottom: 'var(--space-4b)',
              },
              // ... and so on for ul, ol, blockquote, etc.
            },
          },
        }),
        ```

## Phase 2: Component-Level Spacing Audit & Correction

This phase involves a systematic review of every component to ensure its internal padding and external margins conform to the grid.

*   **Step 2.1: Audit Component Spacing.**
    *   **Action:** Go through each component file in `src/components/`. For each one, document its current spacing and identify any values that are not using our `*b` tokens.
    *   **Example Checklist Item:**
        *   `src/components/Card.astro`: `padding` is `p-5`. **Incorrect.** Should be `p-4b` (24px) or `p-6b` (36px).

*   **Step 2.2: Fix Internal Padding.**
    *   **Action:** Correct all internal `padding` values within components to use `*b` tokens. The goal is for the component's "breathing room" to respect the grid.

*   **Step 2.3: Fix External Margins & Gaps.**
    *   **Action:** Correct all `margin` and `gap` utilities used when composing components in layouts (`src/pages/` and `src/layouts/`) to use `*b` tokens. This ensures the space *between* components also follows the grid.

## Phase 3: Fine-Tuning and Edge Cases

The final phase addresses more nuanced alignment issues that become visible once the main structure is correct.

*   **Step 3.1: Icon and Text Alignment.**
    *   **Problem:** Icons placed next to text often need minor vertical adjustment to appear optically centered with the text's x-height.
    *   **Action:** Review all instances of icons next to text (e.g., in buttons, links, lists). Apply small, targeted adjustments where needed, such as `translate-y-px` or a utility class like `.optical-align { margin-top: 0.125em; }`.

*   **Step 3.2: Form Element Alignment.**
    *   **Action:** If forms are added later, ensure all form inputs, labels, and buttons have consistent vertical and horizontal spacing that adheres to the baseline grid.

*   **Step 3.3: Re-evaluate Negative Margins.**
    *   **Action:** Search the codebase for any negative margins (e.g., `-mt-1`). These are often used to counteract unwanted spacing and may no longer be necessary with the new, consistent system. Evaluate each one and remove it if possible.

By following this step-by-step plan, we will systematically bring the entire website into alignment with its core design principles, resulting in a polished, professional, and visually coherent final product. 