# Code Duplication & Centralization Report

## Overview
This report identifies areas where code is not centralized, including redundant Astro code and hardcoded CSS patterns across the codebase.

## 1. CSS & Styling Issues

### 1.1 Inline Styles (Hardcoded CSS)
**Problem:** Direct style attributes that should use Tailwind classes or CSS variables

**Examples:**
- `about.astro`: `style="font-weight: 375; letter-spacing: 0.002em;"`
- `mono-test.astro`: Multiple inline styles for font testing
- `DropCap.astro`: Dynamic calculations in style attributes

**Solution:** 
- Create Tailwind utilities for common font weights
- Use CSS custom properties for dynamic values
- Move test styles to dedicated test CSS files

### 1.2 Hardcoded Values in Style Blocks
**Problem:** 32 components contain `<style>` tags with hardcoded values

**Common Issues:**
- Pixel values: `2rem`, `1.5rem`, `16px` → Should use `var(--space-*)` tokens
- Custom breakpoints: `@media (max-width: 640px)` → Should use Tailwind responsive utilities
- Repeated focus states, dark mode adjustments, and link styles

**Most Affected Components:**
- BlogPost.astro (custom media queries)
- Series.astro (duplicate panel toggle styles)
- TableOfContents.astro (hardcoded spacing)
- PostPreview.astro (custom hover states)

### 1.3 Duplicate CSS Patterns
**Problem:** Same CSS patterns repeated across multiple components

**Examples:**
1. Link underline animations (5+ components)
2. Focus state styles (10+ components)
3. Dark mode color adjustments (scattered across files)
4. Panel/drawer animations (BlogPost, Series layouts)

## 2. Astro Code Duplication

### 2.1 Date Formatting Functions
**Problem:** 6+ files define identical `formatDate` functions

**Files:**
- `/src/pages/writing/archive.astro`
- `/src/layouts/BlogPost.astro`
- `/src/pages/posts/archive.astro`
- `/src/components/MediaList.astro`
- `/src/components/DocumentEntry.astro`
- `/src/components/MediaEntry.astro`

**Solution:** Use existing `@/utils/date` utility consistently

### 2.2 Identical Page Structures
**Problem:** Collection slug pages have 90% identical code

**Files:**
- `/src/pages/writing/[...slug].astro`
- `/src/pages/projects/[...slug].astro`
- `/src/pages/research/[...slug].astro`

**Duplicated:**
- Import statements
- getStaticPaths logic
- Layout structure
- Header components
- Prose wrappers

### 2.3 Layout Wrapper Pattern
**Problem:** 8+ pages use identical wrapper div

**Pattern:** 
```astro
<div class="measure-base mx-auto px-4b py-8b">
```

**Files:** writing/index, research/index, posts/archive, media/index, about, tags/index, etc.

### 2.4 Component Import Patterns
**Problem:** Same import combinations repeated everywhere

**Common Imports:**
```astro
import PageLayout from "@/layouts/Base.astro"
import PageHeader from "@/components/PageHeader.astro"
import { getCollection } from "astro:content"
import FormattedDate from "@/components/FormattedDate.astro"
```

## 3. Non-Centralized Patterns

### 3.1 Meta Tag Generation
Every page manually creates meta objects instead of using a helper:
```astro
<BaseLayout meta={{ title: "...", description: "..." }}>
```

### 3.2 Collection Handling
getStaticPaths implementations are nearly identical across collection pages

### 3.3 Conditional Rendering
Repeated patterns for draft posts, empty states, and loading states

## 4. Recommended Actions

### Priority 1: Create Shared Utilities
1. **Centralize date formatting** - Use existing utils/date.ts everywhere
2. **Create PageWrapper component** for common layout pattern
3. **Build generic ContentPage component** for collection slug pages

### Priority 2: CSS Centralization
1. **Move duplicate CSS to global.css or create component CSS modules**
2. **Replace hardcoded values with design tokens**
3. **Create Tailwind @apply classes for common patterns**

### Priority 3: Component Abstractions
1. **Generic collection page component**
2. **Shared meta tag helper**
3. **Reusable getStaticPaths utility**

### Priority 4: Style System Updates
1. **Document and enforce CSS variable usage**
2. **Create style guide for common patterns**
3. **Migrate inline styles to utility classes**

## 5. Impact Analysis

### Current Issues:
- **Maintenance burden**: Changes need updates in multiple places
- **Inconsistency risk**: Similar components may diverge over time
- **Bundle size**: Duplicate CSS increases file size
- **Developer experience**: Harder to understand patterns

### Benefits of Centralization:
- **DRY principle**: Single source of truth
- **Easier updates**: Change once, apply everywhere
- **Better consistency**: Enforced patterns
- **Smaller bundle**: Reduced CSS duplication
- **Improved DX**: Clear patterns and utilities

## 6. Quick Wins

1. **Use existing date utility** (6 files, ~30 lines saved)
2. **Create PageWrapper component** (8 files, ~16 lines saved)
3. **Centralize focus states** (10+ components affected)
4. **Extract common media queries** to Tailwind config

## 7. Long-term Improvements

1. **Component library**: Build reusable Astro components
2. **Style system**: Enforce design tokens usage
3. **Linting rules**: Catch hardcoded values
4. **Documentation**: Clear patterns for new components