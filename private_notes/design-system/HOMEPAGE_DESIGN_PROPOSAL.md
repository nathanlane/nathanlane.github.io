# Homepage Design Concept: "The Curated Document"

## 1. Core Philosophy: Resisting the "Box"

The central challenge of designing a "digital garden" homepage is presenting a variety of content types (essays, notes, works-in-progress) without resorting to a grid of cards or boxes. Your design DNA explicitly states to "minimize cards/boxes."

Therefore, the homepage should not be a dashboard. It should be **a single, beautifully typeset document**. It should feel less like a website's landing page and more like the curated table of contents or introductory essay of an academic journal. The structure is defined by typography and vertical space, not by containers with borders or background colors.

---

## 2. Structure & Layout: A Calm, Single Stream

The homepage will be a single, flowing column of content, respecting the `max-w-prose` or a slightly wider `75ch` measure to maintain optimal line length.

The page flow would be:

1.  **Personal Introduction (The Masthead):**
    *   A brief, one-paragraph statement of purpose. Not a flashy hero, but a quiet introduction. Uses the `text-lead` style (`text-1`) to be slightly larger than the body.
    *   This sets the `calm-editorial` and `indie-research-lab` tone immediately.

2.  **Curated Sections (The Chapters):**
    *   Instead of a chronological firehose, the content is grouped into thematic sections. This curation adds to the "handcrafted" feel.
    *   Each section is introduced by a proper heading (e.g., `<h2 class="heading-2 mt-12b mb-6b">`). The large top margin is crucial for signaling a new major part of the "document."
    *   **Example Sections:**
        *   `New & Noteworthy` (for featured items)
        *   `From the Garden` (for recent notes and fledgling ideas)
        *   `Recent Essays` (for long-form published work)
        *   `Active Research` (for working papers)

---

## 3. Content Presentation: The "Anti-Card"

This is how we present individual items without using boxes. Each entry in a section is a self-contained "stanza" of text, separated from the next by generous whitespace (`margin-bottom: var(--space-8b)`), not a line or a box.

### The Anatomy of a Garden Entry:

Instead of a `<div>` with a `border` and `background-color`, each entry is a semantic `<article>` tag with a clear typographic hierarchy.

*   **1. The Title (`heading-4`):**
    *   The entry point. It's the primary link. Uses the `heading-4` or `heading-5` class for a clear but not overpowering presence.
    *   On hover, the text color could shift, or a subtle, custom underline could appear (as defined in our link system).

*   **2. The Metadata (`text--1`):**
    *   **Crucial for the garden concept.** This line, set directly below the title, provides context. It uses the `text--1` style (smaller, lighter text color).
    *   **Content:** "Note • May 2024 • 🌱 Seeding" or "Essay • 2,400 words • 🌿 Growing"
    *   **Refinement:** This is a perfect place for **true small caps** (`font-feature-settings: "smcp" 1;`) to create that classic, `handcrafted` typographic feel for the status (`SEEDLING`, `EVERGREEN`).

*   **3. The Excerpt (`text-body`):**
    *   A one- or two-sentence summary of the content in the standard body text style. It provides just enough scent for the reader to decide whether to click.

### Visual Example of an "Anti-Card":

> ## A Note on Typographic Grids (← `heading-4`)
>
> NOTE • JULY 2024 • 🌱 SEEDING (← `text--1` with small caps)
>
> A brief exploration into the historical use of baseline grids in Swiss Modernism, and how they can be adapted for flexible web layouts without sacrificing rhythmic harmony. (← `text-body`)

---

## 4. Optical Refinements in Action

This is where the `OPTICAL_TYPOGRAPHY_REFINEMENT.md` plan comes to life.

*   **For Body/Excerpt Text (IBM Plex):**
    *   The subtle increase in tracking (`letter-spacing: 0.005em`) will make these excerpts feel airy and readable.
    *   The use of the single-story `a` (`ss01`) enhances the clean, minimalist aesthetic.

*   **For Decorative/Metadata Text:**
    *   The generous tracking on the uppercase metadata (`letter-spacing: 0.075em`) is critical. It turns a potentially clunky line of text into an intentional design element.
    *   This is the perfect application for our new `.text-small-caps` utility.

*   **For Header/Title Text (Newsreader):**
    *   The tight, negative tracking on the entry titles gives them a professional, editorial look, distinguishing them clearly from the body text.

---

## 5. Safeguards: Grid & System Compliance

This design rigorously adheres to the system we've built.

1.  **Vertical Rhythm is Paramount:**
    *   The space *between sections* (`margin-top` on the `<h2>`) will be a large baseline multiple (e.g., `mt-12b` or `mt-16b`).
    *   The space *between entries* within a section will be a smaller, but still generous, multiple (e.g., `mb-8b`).
    *   The space *within an entry* (between title, metadata, and excerpt) will be tight (e.g., `mb-1b` or `mb-2b`).
    *   This creates a clear, multi-level spatial hierarchy that is 100% compliant with the 24px baseline grid.

2.  **No Rogue Spacing:**
    *   The entire layout is composed using our `*b` spacing tokens. There are no magic numbers or `px`/`rem` values.

3.  **Interaction without Disruption:**
    *   Hover effects will use `transform` or `background-color` changes, not `margin` or `border`, ensuring that interacting with one entry does not cause any other element on the page to reflow. This maintains the `calm` feel.

## 6. Astro Component Implementation

This design would be implemented as a new, reusable component:

**`src/components/GardenEntry.astro`**

```astro
---
interface Props {
  title: string;
  href: string;
  metadata: string;
  status?: 'seeding' | 'growing' | 'evergreen';
}
const { title, href, metadata, status } = Astro.props;
---
<article class="mb-8b">
  <h4 class="heading-4">
    <a href={href} class="feature-link">{title}</a>
  </h4>
  <p class="text--1 text-color-600 mt-1b mb-2b">
    <span class="text-small-caps">{metadata}</span>
    {status && <span class="ml-2b">🌱</span>}
  </p>
  <div class="text-body">
    <slot /> <!-- The excerpt goes here -->
  </div>
</article>
```

This component could then be used on the homepage to render each item in the stream, ensuring perfect consistency and adherence to the design system. 