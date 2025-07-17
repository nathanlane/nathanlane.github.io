
## WRITING PAGE STRUCTURE - DESIGN SYSTEM COMPLIANT

```
┌─────────────────────────────────────────────────────────────────┐
.... HEADER....
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                         W R I T I N G                             │
│                                                                   │
│  Essays, notes, and occasional thoughts on economics,             │
│  technology, and the craft of research. Some pieces are          │
│  evergreen, others capture thoughts in motion.                   │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                     Current Thinking                              │
│                                                                   │
│  The Grammar of Economic Models                                   │
│  ESSAY • JANUARY 2025 • 3,421 WORDS                              │
│                                                                   │
│  How the mathematical language we choose shapes not just         │
│  our models but our very conception of economic reality.         │
│  An exploration of notation as ideology.                         │
│                                                                   │
│                          ━━━━━━━                                  │
│                                                                   │
│  Weekend Notes: LLMs and Literature Reviews                      │
│  BLOG POST • JANUARY 2025 • 823 WORDS                            │
│                                                                   │
│  Some quick thoughts on using Claude to map academic             │
│  literature. The tools are impressive but the epistemic          │
│  questions remain thorny.                                        │
│                                                                   │
│                          ━━━━━━━                                  │
│                                                                   │
│                     Recent Writing                                │
│                                                                   │
│  Notes on Building a Personal Research Infrastructure  2024-12   │
│  The Invisible Hand in Neural Networks .............. 2024-11    │
│  Wage Stickiness in Silicon Valley .................. 2024-10    │
│  Economic Folklore and Empirical Reality ............ 2024-09    │
│  A Statistical Method for Parsing Fed Speeches ...... 2024-08    │
│                                                                   │
│  → View writing archive                                           │
│                                                                   │
│                          ━━━━━━━                                  │
│                                                                   │
│                     Recent Blog Posts                             │
│                                                                   │
│  Configuring Zotero for Economic Research ........... 2025-01    │
│  Quick Fix: Python Environment Management ........... 2024-12    │
│  Links: December Reading ........................... 2024-12    │
│  The Sublime Horror of Excel Spreadsheets .......... 2024-11    │
│  Tools I'm Thankful For ........................... 2024-11    │
│                                                                   │
│  → View blog archive                                              │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
.... FOOTER ....
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation - Design System Compliant

```astro
---
// /src/pages/writing.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import CompactList from '@/components/CompactList.astro';
import { getCollection } from 'astro:content';

const writing = await getCollection('writing');
const blogPosts = await getCollection('post');

// Get most recent of each type for Current Thinking
const latestWriting = writing
  .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())[0];
const latestBlog = blogPosts
  .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())[0];

// Get recent items for archive sections (excluding featured ones)
const recentWriting = writing
  .filter(w => w.id !== latestWriting?.id)
  .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
  .slice(0, 5);
const recentBlog = blogPosts
  .filter(p => p.id !== latestBlog?.id)
  .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
  .slice(0, 5);
---

<BaseLayout meta={{ title: "Writing", description: "Essays, notes, and thoughts on economics, technology, and research." }}>
  <div class="measure-base mx-auto px-4b py-8b">
    <!-- Page header -->
    <header class="text-center mb-12b">
      <h1 class="heading-2 mb-4b">Writing</h1>
      <p class="text-1 text-light leading-relaxed measure-narrow mx-auto">
        Essays, notes, and occasional thoughts on economics, 
        technology, and the craft of research. Some pieces are 
        evergreen, others capture thoughts in motion.
      </p>
    </header>

    <!-- Current Thinking - Latest writing + latest blog -->
    <section class="mb-16b">
      <h2 class="heading-3 mb-8b text-center">Current Thinking</h2>
      
      <!-- Latest Writing -->
      {latestWriting && (
        <article class="mb-12b">
          <h3 class="heading-4 mb-2b">
            <a href={`/writing/${latestWriting.slug}`} class="feature-link">
              {latestWriting.data.title}
            </a>
          </h3>
          <div class="text-meta mb-3b uppercase tracking-wide text-light">
            {latestWriting.data.type || 'ESSAY'} • {formatDate(latestWriting.data.publishDate)} • 
            {latestWriting.data.wordCount?.toLocaleString() || 'N/A'} WORDS
          </div>
          <p class="text-body leading-relaxed">{latestWriting.data.description}</p>
        </article>
      )}

      <!-- Subtle separator -->
      <div class="text-center mb-12b">
        <span class="text-light">━━━━━━━</span>
      </div>

      <!-- Latest Blog Post -->
      {latestBlog && (
        <article class="mb-12b">
          <h3 class="heading-4 mb-2b">
            <a href={`/posts/${latestBlog.slug}`} class="feature-link">
              {latestBlog.data.title}
            </a>
          </h3>
          <div class="text-meta mb-3b uppercase tracking-wide text-light">
            BLOG POST • {formatDate(latestBlog.data.publishDate)} • 
            {latestBlog.data.wordCount?.toLocaleString() || 'N/A'} WORDS
          </div>
          <p class="text-body leading-relaxed">{latestBlog.data.description}</p>
        </article>
      )}
    </section>

    <!-- Monochrome separator -->
    <div class="text-center mb-16b">
      <span class="text-lighter">━━━━━━━</span>
    </div>

    <!-- Recent Writing -->
    <section class="mb-16b">
      <h2 class="heading-3 mb-8b">Recent Writing</h2>
      
      <CompactList 
        items={recentWriting.map(item => ({
          title: item.data.title,
          description: item.data.description,
          url: `/writing/${item.slug}`,
          date: item.data.publishDate
        }))}
      />
      
      <div class="mt-6b">
        <a href="/writing/archive" class="nav-link text-body-sm uppercase tracking-wide">
          → View writing archive
        </a>
      </div>
    </section>

    <!-- Monochrome separator -->
    <div class="text-center mb-16b">
      <span class="text-lighter">━━━━━━━</span>
    </div>

    <!-- Recent Blog Posts -->
    <section class="mb-16b">
      <h2 class="heading-3 mb-8b">Recent Blog Posts</h2>
      
      <CompactList 
        items={recentBlog.map(post => ({
          title: post.data.title,
          description: post.data.description,
          url: `/posts/${post.slug}`,
          date: post.data.publishDate
        }))}
      />
      
      <div class="mt-6b">
        <a href="/posts/archive" class="nav-link text-body-sm uppercase tracking-wide">
          → View blog archive
        </a>
      </div>
    </section>
  </div>
</BaseLayout>

<!-- No additional styles needed - CompactList handles all formatting -->
```

## Key Design System Corrections

### 1. **Fixed Spacing Violations**
- **BEFORE**: `var(--space-8b)` (non-existent)
- **AFTER**: `py-8b` (proper Tailwind utility using defined grid)

### 2. **Reading Measure Compliance**
- **BEFORE**: `max-width: 65ch` (hardcoded, violates constraint #3)
- **AFTER**: `measure-base` (uses CSS custom property `--measure-base`)

### 3. **Typography Hierarchy**
- **Page title**: `heading-2` (proper semantic hierarchy)
- **Section headers**: `heading-3` 
- **Entry titles**: `heading-4` with `feature-link` class
- **Metadata**: `text-meta` with proper small caps styling

### 4. **Monochrome Palette Compliance**
- **Separators**: Text-based `━━━━━━━` using existing text color utilities
- **No heavy borders or cards**: Relies on whitespace and typography
- **Color restraint**: Uses `text-light`, `text-lighter` within monochrome system

### 5. **Semantic Link Classes**
- **Feature links**: `feature-link` for titles
- **Inline links**: `inline-link` for archive items  
- **Navigation**: `nav-link` for archive navigation

### 6. **Content Organization**
- **Unified approach**: Treats all content as "writing" with type distinction
- **Clear hierarchy**: Current → Recent → Archives
- **Minimal decoration**: Typography and space create structure
- **Reusable components**: Uses CompactList for consistent archive formatting

## Responsive Behavior

```css
/* Mobile adjustments in Tailwind */
@media (max-width: 768px) {
  .measure-base { 
    padding-left: var(--space-3); 
    padding-right: var(--space-3); 
  }
  
  .heading-2 { 
    font-size: var(--text-3); /* Scale down on mobile */
  }
}
```

## Content Strategy

### Current Thinking Section
- **Purpose**: Showcase 1-2 most recent substantial pieces
- **Types**: Essays, research notes, substantial blog posts
- **Presentation**: Full titles, descriptions, metadata
- **Goal**: Demonstrate current intellectual focus

### Archive Sections  
- **Recent Writing**: Substantial, evergreen pieces
- **Recent Blog Posts**: Shorter, timely content
- **Format**: Title + date in clean list format
- **Navigation**: Clear paths to full archives

This implementation maintains the editorial feel while strictly following design system constraints and aesthetic principles.