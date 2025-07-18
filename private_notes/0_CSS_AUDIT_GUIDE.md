# CSS Audit Guide for Astro/Tailwind/Fluid Typography Projects

> **Latest Update**: January 31, 2025 - TypeScript type safety improvements, build system fixes, and CSS-in-JS @apply resolution complete.

## Audit Prompt Template

Use this prompt to generate a comprehensive CSS audit of your codebase:

```
Please audit the CSS/styling in this Astro project that uses Tailwind CSS and fluid typography. Focus on:

1. **Class Duplication Analysis**
   - Find repeated utility class combinations that could be extracted into components
   - Identify patterns like "text-sm font-medium text-gray-600" appearing multiple times
   - Look for component-specific classes that could be generalized

2. **Maintainability Assessment**
   - Check for hardcoded values that should use design tokens
   - Find inline styles that should be utility classes
   - Identify CSS-in-JS that could be simplified to utilities
   - Look for complex class strings that need extraction

3. **Fluid Typography Review**
   - Verify consistent use of fluid type scale (text--2 to text-6)
   - Check for manual clamp() functions that duplicate the system
   - Ensure responsive font sizes follow the established scale

4. **Spacing System Consistency**
   - Audit use of baseline grid units (1b, 2b, 4b, etc.)
   - Find inconsistent spacing patterns (mixing px, rem, spacing units)
   - Check for hardcoded margins/paddings vs. design tokens

5. **Component Styling Patterns**
   - Identify components with similar styling that could share classes
   - Find opportunities for variant-based component patterns
   - Check for proper use of Tailwind's component layer

6. **Performance & Bundle Size**
   - Look for unused CSS classes or utilities
   - Find overly specific selectors that increase specificity
   - Check for duplicate CSS declarations

7. **Dark Mode Implementation**
   - Verify consistent use of CSS variables for theming
   - Check for hardcoded colors vs. theme colors
   - Ensure all components support dark mode properly

8. **Accessibility Concerns**
   - Check color contrast ratios
   - Verify focus states are properly styled
   - Ensure interactive elements have appropriate hover/active states

Please provide:
- Specific file locations and line numbers
- Before/after code examples
- Priority rating (High/Medium/Low) for each issue
- Estimated impact on maintainability and performance
```

## Recent Improvements (Phases 2-4 - January 2025)

### ✅ Standardized Focus States
Implemented a global focus system that provides consistency across all interactive elements:

```css
/* Global focus system in src/styles/global.css */
/* Default focus - hidden for mouse users */
:focus {
  outline: none;
}

/* Keyboard focus - visible and consistent */
:focus-visible {
  outline: 2px solid var(--theme-accent);
  outline-offset: var(--space-0.5); /* 3px = 0.5 grid units */
}

/* Dark mode focus adjustment */
:root[data-theme="dark"] :focus-visible {
  outline-color: var(--theme-accent-light);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :focus-visible {
    outline-width: 3px;
    outline-offset: var(--space-1); /* 6px = 1 grid unit */
  }
}
```

**Components updated**: Button, CompactList, PostSearch, SkipLink, MediaEntry, ArchiveEntry, PageHeader, Sidenote, and all webmentions components now use the global system.

### ✅ TypeScript Type Safety & Build Fixes (Phase 4 - January 31, 2025)

Fixed critical build issues related to CSS-in-JS and TypeScript:

#### CSS @apply Directive Issues
**Problem**: Tailwind's @apply couldn't access custom CSS classes in Astro's scoped components
```css
/* ❌ Failed in Astro components */
.media-link {
  @apply link-title link-underline-thin;
}
```

**Solution**: Move to direct class application in HTML
```html
<!-- ✅ Works everywhere -->
<a href={url} class="link-title link-underline-thin">
```

**Components Fixed**:
- MediaEntry, ArchiveEntry, CompactList
- ResearchEntry, DocumentSection, RecentContent
- MediaCard, Footer

#### TypeScript Improvements
- Fixed 10 type errors with proper optional chaining
- Updated interfaces to handle `Date | undefined`
- Removed `any` types from codebase
- Added proper union type handling

**Impact**: 
- Zero build errors
- Type-safe codebase
- Better developer experience
- Consistent link styling without @apply issues

### ✅ Link System Consolidation (Phase 3 - January 30, 2025)
Consolidated and simplified the link styling system for better maintainability:

#### Before: 7+ Different Link Types
```css
/* Scattered across multiple files */
.inline-link { /* prose links */ }
.nav-link { /* navigation */ }
.feature-link { /* featured content */ }
.media-link { /* media entries */ }
.archive-link { /* archive entries */ }
.research-link { /* research entries */ }
.section-link { /* document sections */ }
/* Plus many component-specific variations */
```

#### After: 4 Primary Link Types with Modifiers
```css
/* Consolidated in src/styles/links.css */

/* 1. INLINE LINKS - For prose and body text */
.link-inline {
  color: var(--theme-accent-base);
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-thickness: 1px;
  font-weight: inherit;
  transition: all 0.2s ease;
}

/* 2. TITLE LINKS - For headings and prominent links */
.link-title {
  color: inherit;
  text-decoration: none;
  font-weight: inherit;
  transition: color 0.2s ease;
}

/* 3. NAVIGATION LINKS - For menus and navigation */
.link-nav {
  color: var(--theme-color-600);
  text-decoration: none;
  font-weight: 450;
  font-variation-settings: "wght" 450;
  transition: all 0.2s ease;
}

/* 4. FEATURE LINKS - For featured content */
.link-feature {
  @apply link-title; /* Inherits from title links */
  font-variation-settings: "wght" 450;
}

/* UTILITY MODIFIERS */
.link-underline-thin { /* 1px underline */ }
.link-underline-thick { /* 2px underline */ }
.link-no-underline { /* Remove underline */ }
.link-accent { /* Force accent color */ }
.link-inherit { /* Inherit parent color */ }
```

#### Component Updates
- **MediaEntry & ArchiveEntry**: Now use `@apply link-title link-underline-thin`
- **ResearchEntry**: Uses `@apply link-title` with custom hover
- **CompactList**: Uses `@apply link-title` with animated underline
- **DocumentSection**: Uses `@apply link-nav` for section links
- **RecentContent**: Uses consolidated classes for both feature and nav links
- **Footer**: Uses `@apply link-nav` for all footer links

#### Impact
- **40% reduction** in link-related CSS
- **Consistent behavior** across all components
- **Single source of truth** for link styling
- **Easier maintenance** with inheritance pattern
- **No visual changes** - all existing behaviors preserved

### ✅ Typography Token Migration
Replaced all hardcoded font sizes with fluid typography tokens:

```css
/* Before */
font-size: 0.75rem;
font-size: 0.875rem;
font-size: 1.46rem;

/* After */
font-size: var(--step--1);  /* Small text */
font-size: var(--step-0);   /* Body text */
font-size: var(--step-2);   /* Large text */
```

**Token mapping**:
- `--step--2`: 0.64-0.72rem (smallest UI text)
- `--step--1`: 0.80-0.90rem (small text, captions)
- `--step-0`: 0.975-1.125rem (base body text)
- `--step-1` through `--step-6`: Larger heading sizes

### ✅ Dead Code Removal
- Removed 6 migration comments
- Deleted old import statements
- Removed duplicate CSS implementations
- Cleaned up ~50 lines of obsolete code

## CSS-in-JS Limitations in Astro

### ⚠️ @apply Directive Constraints

Astro's component scoping prevents @apply from accessing custom CSS classes defined outside the component:

```astro
<!-- ❌ This will fail in .astro files -->
<style>
  .my-link {
    @apply link-title link-underline-thin; /* Error: class not found */
  }
</style>
```

**Solutions**:

1. **Use classes directly in HTML** (Recommended)
   ```html
   <a class="link-title link-underline-thin">
   ```

2. **Define base styles in global CSS**
   ```css
   /* src/styles/global.css or links.css */
   @layer components {
     .link-title { /* styles */ }
   }
   ```

3. **Use CSS custom properties**
   ```css
   /* Component style block */
   .my-link {
     color: var(--link-color);
     font-weight: var(--link-weight);
   }
   ```

### 🎯 Astro-Specific CSS Guidelines

- **Scoped by default**: Styles in `<style>` blocks only affect that component
- **Global styles**: Use `:global()` selector or global CSS files
- **CSS ordering**: Import order matters - later imports override earlier ones
- **Build optimization**: Unused CSS is automatically removed in production

## CSS Best Practices Checklist

### 🎨 Design System Adherence

- [ ] **Use Design Tokens Consistently**
  ```css
  /* ❌ Bad */
  padding: 24px;
  color: #1a1a1a;
  
  /* ✅ Good */
  padding: var(--space-4);
  color: var(--theme-text);
  ```

- [ ] **Follow Fluid Typography Scale**
  ```html
  <!-- ❌ Bad -->
  <h2 class="text-[1.875rem] md:text-[2.25rem]">
  
  <!-- ✅ Good -->
  <h2 class="text-3 heading-2">
  ```

- [ ] **Use Baseline Grid Spacing**
  ```html
  <!-- ❌ Bad -->
  <div class="mb-6 mt-4 px-5">
  
  <!-- ✅ Good -->
  <div class="mb-4b mt-3b px-4b">
  ```

### 🔧 Maintainability

- [ ] **Extract Repeated Utility Combinations**
  ```html
  <!-- ❌ Bad: Repeated everywhere -->
  <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
  
  <!-- ✅ Good: Component class -->
  <button class="btn-primary">
  ```

- [ ] **Use Semantic Class Names**
  ```css
  /* ❌ Bad */
  .mt-24-responsive { }
  
  /* ✅ Good */
  .section-spacing { }
  ```

- [ ] **Organize Custom CSS with @layer**
  ```css
  /* ✅ Good */
  @layer components {
    .card {
      @apply bg-white rounded-lg shadow-md p-4;
    }
  }
  ```

### 🚀 Performance

- [ ] **Avoid Arbitrary Values When Possible**
  ```html
  <!-- ❌ Bad -->
  <div class="w-[437px] h-[259px]">
  
  <!-- ✅ Good -->
  <div class="w-full max-w-md aspect-video">
  ```

- [ ] **Minimize Custom CSS**
  ```css
  /* ❌ Bad: Custom CSS for common patterns */
  .my-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  /* ✅ Good: Use utilities */
  class="flex items-center justify-between"
  ```

- [ ] **Purge Unused Styles**
  - Ensure Tailwind's purge/content config includes all template files
  - Remove commented-out styles
  - Delete unused component variants

### 🎯 Component Patterns

- [ ] **Create Reusable Component Classes**
  ```css
  @layer components {
    /* Typography Components */
    .heading-1 { @apply text-5 font-newsreader font-light; }
    .heading-2 { @apply text-4 font-newsreader font-light; }
    
    /* Button Components */
    .btn { @apply px-4b py-2b rounded-md transition-colors; }
    .btn-primary { @apply btn bg-accent text-white hover:bg-accent-dark; }
  }
  ```

- [ ] **Use Data Attributes for State**
  ```html
  <!-- ✅ Good -->
  <div class="tab-panel" data-state="active">
  ```
  ```css
  .tab-panel[data-state="active"] { @apply block; }
  .tab-panel[data-state="inactive"] { @apply hidden; }
  ```

### 🌓 Theming

- [ ] **Use CSS Variables for Colors**
  ```css
  /* ❌ Bad */
  color: #3B82F6;
  background: rgb(59, 130, 246);
  
  /* ✅ Good */
  color: var(--theme-accent);
  background: var(--theme-accent-bg);
  ```

- [ ] **Implement Proper Dark Mode**
  ```css
  /* ✅ Good: Using CSS variables that change with theme */
  .card {
    background: var(--theme-bg);
    color: var(--theme-text);
    border: 1px solid var(--theme-border);
  }
  ```

### 📐 Typography

- [ ] **Use Fluid Type Scale**
  ```html
  <!-- ✅ Good -->
  <p class="text-0">Body text</p>
  <h3 class="text-2 heading-3">Subheading</h3>
  ```

- [ ] **Apply Consistent Line Heights**
  ```css
  /* Define in system */
  --line-height-tight: 1.2;
  --line-height-base: 1.6;
  --line-height-relaxed: 1.8;
  ```

- [ ] **Use Proper Font Loading**
  ```html
  <!-- ✅ Good -->
  <link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
  ```

### ♿ Accessibility

- [ ] **Ensure Sufficient Color Contrast**
  - Text: 4.5:1 for normal text, 3:1 for large text
  - Use tools to verify contrast ratios

- [ ] **Style Focus States**
  ```css
  /* ✅ Good */
  .btn:focus-visible {
    outline: 2px solid var(--theme-accent);
    outline-offset: 2px;
  }
  ```

- [ ] **Provide Hover/Active Feedback**
  ```css
  .interactive-element {
    @apply transition-colors;
  }
  .interactive-element:hover {
    @apply bg-gray-100;
  }
  ```

### 🧹 Code Quality

- [ ] **Remove Dead Code**
  - Commented-out styles
  - Unused class definitions
  - Old vendor prefixes

- [ ] **Consolidate Similar Styles**
  ```css
  /* ❌ Bad */
  .header-link { color: blue; text-decoration: underline; }
  .footer-link { color: blue; text-decoration: underline; }
  
  /* ✅ Good */
  .link-primary { color: blue; text-decoration: underline; }
  ```

- [ ] **Document Complex Patterns**
  ```css
  /* Card component with elevated shadow on hover
     Uses baseline grid spacing (4b = 24px) */
  .card {
    @apply p-4b shadow-sm hover:shadow-lg transition-shadow;
  }
  ```

## Audit Process & Tools

### 🔍 Quick Audit Commands

Run these commands to quickly identify CSS issues:

```bash
# Find hardcoded colors
grep -r --include="*.astro" --include="*.css" -E "#[0-9a-fA-F]{3,6}|rgb\(|hsl\(" src/

# Find pixel values (should use design tokens)
grep -r --include="*.astro" --include="*.css" -E "[0-9]+px" src/

# Find @apply usage in Astro components (potential issues)
grep -r --include="*.astro" "@apply" src/

# Find repeated class combinations
grep -r --include="*.astro" -E 'class="[^"]{50,}"' src/

# Check for unused CSS classes
pnpm dlx purgecss --content "src/**/*.{astro,jsx,tsx}" --css "dist/**/*.css"
```

### 📊 CSS Metrics to Monitor

1. **File Size**
   ```bash
   # Check CSS bundle size after build
   pnpm build && ls -lh dist/_astro/*.css
   ```

2. **Specificity Issues**
   ```bash
   # Look for overly specific selectors
   grep -r --include="*.css" -E "(\.|#)[a-zA-Z0-9-_]+ (\.|#)[a-zA-Z0-9-_]+ (\.|#)" src/
   ```

3. **Custom CSS vs Utilities Ratio**
   ```bash
   # Count custom CSS rules
   grep -r --include="*.css" --include="*.astro" -c "^[[:space:]]*\." src/ | awk -F: '{sum+=$2} END {print sum}'
   ```

## Automated Audit Script

Create a script to check for common issues:

```javascript
// scripts/audit-css.js
const glob = require('glob');
const fs = require('fs');

// Check for hardcoded colors
const colorPattern = /#[0-9a-fA-F]{3,6}|rgb\(|hsl\(/;

// Check for pixel values
const pixelPattern = /\d+px/;

// Check for repeated class combinations
const findRepeatedClasses = (files) => {
  const classPatterns = new Map();
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const classMatches = content.match(/class="([^"]*)"/g) || [];
    
    classMatches.forEach(match => {
      const classes = match.replace('class="', '').replace('"', '');
      if (classes.split(' ').length > 3) {
        classPatterns.set(classes, (classPatterns.get(classes) || 0) + 1);
      }
    });
  });
  
  return Array.from(classPatterns.entries())
    .filter(([_, count]) => count > 2)
    .sort((a, b) => b[1] - a[1]);
};
```

## Regular Audit Schedule

1. **Weekly**: Quick scan for hardcoded values and repeated patterns
2. **Monthly**: Full audit using the checklist
3. **Before Major Releases**: Complete CSS optimization pass
4. **After Adding Features**: Check for consistency with existing patterns

## Key Metrics to Track

- Number of custom CSS rules vs. utility classes
- Bundle size over time
- Number of unique color values
- Specificity graph (should stay flat)
- Component reuse percentage

## Lessons Learned from Recent Refactoring

### 💡 Key Insights

1. **@apply Limitations in Astro**
   - Custom CSS classes must be defined globally to work with @apply
   - Component-scoped styles can't be referenced by @apply
   - Direct class application in HTML is more reliable

2. **TypeScript Strictness Pays Off**
   - `exactOptionalPropertyTypes` catches potential runtime errors
   - Proper type definitions prevent build failures
   - Optional chaining (`?.`) is essential for undefined values

3. **Content Collection Best Practices**
   - Always clear `.astro` cache when removing collections
   - Update all references (config, validation, pages, RSS)
   - Use proper terminology: "content collection" not "note of content"

4. **CSS Organization Strategy**
   - Consolidate similar patterns (7 link types → 4)
   - Use inheritance with @apply in global CSS only
   - Maintain single source of truth for each pattern

5. **Build Process Understanding**
   - `pnpm check`: TypeScript validation (run before commits)
   - `pnpm lint`: Code quality checks (run during review)
   - `pnpm build`: Production build (run before deploy)

### 🚀 Recommended Workflow

1. **Before Starting Work**
   ```bash
   pnpm check  # Ensure no type errors
   pnpm lint   # Check code quality
   ```

2. **During Development**
   - Use direct classes in HTML, not @apply in components
   - Follow the 4 primary link types
   - Check focus states and dark mode

3. **Before Committing**
   ```bash
   pnpm check && pnpm lint && pnpm build
   ```

4. **Regular Audits**
   - Weekly: Check for hardcoded values
   - Monthly: Full CSS audit
   - Per feature: Verify pattern consistency

This guide provides a structured approach to maintaining clean, efficient CSS in your Astro/Tailwind project while ensuring consistency with your fluid typography system and avoiding common pitfalls discovered during refactoring.