Based on the Craig Mod essay structure and your design system, here's a comprehensive guide for formatting blog posts that captures the full essence:

I want to refactor and adjust the blog post layouts to look like the following

## Comprehensive Essay Formatting Instructions

Format this essay following Craig Mod's typographic essay style:

### Core Structure Elements:

1. **Navigation Bar**
   - Minimal top nav: site name (left) + 2-3 links (right)
   - Subtle horizontal rule below (1px, 10% opacity)
   - Fixed or static, never sticky scrolling

2. **Essay Header Block**
   ```
   [Subtle back link - text--1, uppercase, tracked]
   
   TITLE IN NEWSREADER
   [Large, commanding presence]
   
   ─────────────── [thin horizontal rule] ───────────────
   
   ESSAY TYPE • MONTH YEAR • X,XXX WORDS • X MIN READ
   [Small caps metadata]
   ```

3. **Opening Flourish**
   - First paragraph: Larger size (text-1), light weight
   - Drop cap: First letter spans 3-4 lines
   - Optional: Opening epigraph or scene-setting in italics

4. **Body Rhythm**
   - Paragraphs separated by space-4b (24px)
   - Section breaks: thin horizontal rule + space-8b
   - Occasional pull quotes breaking the flow
   - Images as breathing moments (full-bleed)

5. **Horizontal Rules as Punctuation**
   - Thin lines (1px, 15% opacity) for minor breaks
   - Centered "* * *" or "• • •" for major transitions
   - Never heavy or decorative

6. **Footer Coda**
   ```
   ─────────────── [thin rule] ───────────────
   
   [Author bio or essay metadata]
   [Related essays]
   [Simple newsletter signup]
   ```

### Specific Formatting Rules:

**Typography Cascade:**
- Title: heading-4 or heading-5 (2.43–2.80rem)
- Opening: text-1 (0.975–1.125rem, light)
- Body: text-0 (0.8125–0.875rem)
- Captions: text--1 (0.80–0.90rem)
- Footnotes: text--2 (0.64–0.72rem)

**Spacing Rhythm:**
- Use multiples of baseline (6px)
- Paragraph breaks: 24px (space-4b)
- Section breaks: 48px (space-8b) 
- Around images: 72px (space-12b)
- Pull quotes: 60px (space-10b) above/below

**Special Elements:**
- Pull quotes: Centered, text-2, italic, generous margins
- Images: Edge-to-edge on mobile, generous margins on desktop
- Footnotes: Superscript numbers, notes at bottom
- Code blocks: IBM Plex Mono, subtle background

**Constraints:**
- Max line length: 65-70 characters
- No sidebars, no cards, no boxes
- Let typography breathe with whitespace
- Horizontal rules are thin whispers, not shouts
```

## Detailed Agent Command Structure

```yaml
Task: Format essay in Craig Mod style
Input: Raw markdown or text
Output: Formatted Astro/MDX component

Process:
  1. Structure Analysis
     - Identify natural section breaks
     - Find quotable moments for pull quotes
     - Determine essay type (narrative/technical/hybrid)
  
  2. Header Construction
     - Generate metadata (word count, read time)
     - Create subtle navigation structure
     - Add thin horizontal separator
  
  3. Opening Treatment
     - First paragraph gets special sizing
     - Add drop cap to first letter
     - Consider epigraph if appropriate
  
  4. Body Formatting
     - Insert horizontal rules at transitions
     - Create pull quotes from key insights
     - Ensure images have breathing room
     - Add thin rules between major sections
  
  5. Micro-typography
     - Smart quotes and proper dashes
     - Hanging punctuation for quotes
     - Careful justification (no rivers)
     - Widow/orphan control

Visual Markers:
  - Horizontal rules: 1px solid rgb(0 0 0 / 0.1)
  - Section breaks: <hr class="section-break" />
  - Major breaks: <div class="asterism">* * *</div>
  - Pull quotes: <blockquote class="pull-quote">
```

## Complete Essay Template

```astro
---
// /src/layouts/EssayLayout.astro
import BaseLayout from './BaseLayout.astro';
import { formatDate, calculateReadTime } from '../utils';

const { title, date, wordCount, type = "ESSAY", status } = Astro.props;
const readingTime = calculateReadTime(wordCount);
---

<BaseLayout>
  <!-- Subtle top navigation -->
  <nav class="essay-nav">
    <a href="/" class="site-name">Nathan Lane</a>
    <div class="nav-links">
      <a href="/essays">Essays</a>
      <a href="/research">Research</a>
      <a href="/about">About</a>
    </div>
  </nav>
  <hr class="nav-separator" />

  <article class="essay-wrapper">
    <!-- Back link -->
    <div class="back-link">
      <a href="/essays">← All Essays</a>
    </div>

    <!-- Essay header -->
    <header class="essay-header">
      <h1 class="essay-title">{title}</h1>
      <hr class="title-separator" />
      <div class="essay-metadata">
        {type} • {formatDate(date)} • {wordCount.toLocaleString()} WORDS • {readingTime} MIN READ
      </div>
    </header>

    <!-- Essay content with special first paragraph -->
    <div class="essay-content">
      <div class="opening-paragraph">
        <slot name="opening" />
      </div>
      
      <div class="essay-body">
        <slot />
      </div>
    </div>

    <!-- Essay footer -->
    <footer class="essay-footer">
      <hr class="footer-separator" />
      <div class="essay-endnote">
        <slot name="endnote" />
      </div>
    </footer>
  </article>
</BaseLayout>

<style>
  /* Navigation */
  .essay-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4b) var(--space-6b);
    font-family: var(--font-sans);
    font-size: var(--text--1);
  }

  .nav-links {
    display: flex;
    gap: var(--space-6b);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 500;
  }

  .nav-separator {
    border: none;
    border-top: 1px solid rgb(0 0 0 / 0.1);
    margin: 0;
  }

  /* Essay wrapper */
  .essay-wrapper {
    max-width: 65ch;
    margin: 0 auto;
    padding: var(--space-8b) var(--space-4b);
  }

  /* Back link */
  .back-link {
    margin-bottom: var(--space-8b);
    font-family: var(--font-sans);
    font-size: var(--text--1);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  /* Header */
  .essay-header {
    margin-bottom: var(--space-8b);
  }

  .essay-title {
    font-family: var(--font-newsreader);
    font-size: var(--text-5);
    font-weight: 400;
    line-height: 1.2;
    letter-spacing: -0.025em;
    margin-bottom: var(--space-4b);
  }

  .title-separator {
    border: none;
    border-top: 1px solid rgb(0 0 0 / 0.15);
    margin: var(--space-4b) 0;
  }

  .essay-metadata {
    font-family: var(--font-sans);
    font-size: var(--text--1);
    font-variant: small-caps;
    letter-spacing: 0.075em;
    color: var(--text-secondary);
  }

  /* Opening paragraph with drop cap */
  .opening-paragraph {
    font-family: var(--font-serif);
    font-size: var(--text-1);
    font-weight: 300;
    line-height: 1.6;
    text-align: justify;
    margin-bottom: var(--space-6b);
  }

  .opening-paragraph::first-letter {
    float: left;
    font-family: var(--font-newsreader);
    font-size: calc(var(--text-6) * 1.2);
    line-height: 0.8;
    margin-right: var(--space-1b);
    margin-top: 0.1em;
  }

  /* Essay body */
  .essay-body {
    font-family: var(--font-serif);
    font-size: var(--text-0);
    line-height: 1.6;
    text-align: justify;
    letter-spacing: 0.005em;
  }

  /* Spacing for body elements */
  .essay-body p {
    margin-bottom: var(--space-4b);
  }

  .essay-body hr {
    border: none;
    border-top: 1px solid rgb(0 0 0 / 0.1);
    margin: var(--space-8b) auto;
    width: 30%;
  }

  /* Pull quotes */
  .essay-body blockquote.pull-quote {
    margin: var(--space-10b) 0;
    padding: 0 var(--space-8b);
    text-align: center;
    font-style: italic;
    font-size: var(--text-2);
    line-height: 1.4;
    font-weight: 300;
    border: none;
  }

  /* Asterism for major breaks */
  .asterism {
    text-align: center;
    margin: var(--space-12b) 0;
    font-size: var(--text-1);
    letter-spacing: 0.5em;
    color: var(--text-secondary);
  }

  /* Images */
  .essay-body img {
    margin: var(--space-12b) calc(-1 * var(--space-4b));
    max-width: calc(100% + 2 * var(--space-4b));
    height: auto;
  }

  /* Footer */
  .footer-separator {
    border: none;
    border-top: 1px solid rgb(0 0 0 / 0.1);
    margin: var(--space-12b) 0 var(--space-6b);
  }

  .essay-endnote {
    font-family: var(--font-sans);
    font-size: var(--text--1);
    color: var(--text-secondary);
  }
</style>
```

## Natural Language Instructions for Agents

```
Transform this content into a Craig Mod-style essay with these characteristics:

STRUCTURE:
1. Minimal navigation bar with thin separator line below
2. Subtle "← All Essays" back link
3. Large, commanding title in Newsreader
4. Thin horizontal rule under title
5. Metadata in small caps (type, date, word count, read time)
6. Opening paragraph with drop cap, slightly larger text
7. Body text in justified serif with generous spacing
8. Thin horizontal rules as section breaks (centered, 30% width)
9. Use "* * *" for major transitions
10. Footer with thin rule and related content

TYPOGRAPHY RHYTHM:
- Let the text breathe with ample whitespace
- Use horizontal rules as gentle punctuation, not barriers
- Pull quotes should float in space, centered and italic
- Images need massive breathing room (12 grid units)
- Every element should feel considered and placed

MOOD:
- Quiet confidence without ostentation
- Editorial elegance meets digital craft
- The page should feel like holding a beautifully printed essay
- Horizontal rules are whispers, not shouts
- Everything in service of readability and contemplation

The goal is to create a reading experience that feels both timeless and contemporary, where every typographic choice enhances rather than distracts from the content.
```

This captures the full essence of Craig Mod's essay style—the careful use of horizontal rules as breathing marks, the rhythm of spacing, and the overall sense of crafted editorial design.