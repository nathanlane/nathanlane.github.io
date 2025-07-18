# MEDIA PAGE REFACTORING PLAN

## Current Issues & Design System Violations

### 1. **Typography Issues**
- **Non-semantic classes**: Using `text-lg`, `text-sm` instead of semantic typography system
- **Inconsistent font weights**: `font-medium` instead of proper variable font weights
- **Poor hierarchy**: Year headers use generic sizing instead of proper heading hierarchy
- **Line height violations**: No explicit line-height control for optimal readability

### 2. **Spacing & Grid Violations**  
- **Non-grid spacing**: `space-y-8` (32px) not aligned to 6px grid
- **Incorrect margins**: `mb-8b` header margin, but `space-y-3` (12px) for list items
- **Container width**: `max-w-3xl` instead of proper reading measure (`measure-base`)
- **Hover padding**: `-mx-3b px-3b py-2b` creates misaligned hover states

### 3. **Component Architecture**
- **Missing reusable header**: Should use `PageHeader` component
- **Ad-hoc icon sizing**: `w-3 h-3` instead of systematic icon scale
- **Inline styles**: Hover effects in `<style>` block instead of utility classes

### 4. **Aesthetic Violations**
- **Box/card pattern**: Hover effect creates boxes, violating document-centric aesthetic
- **Heavy decoration**: Icon + external link arrow is redundant
- **Inconsistent link styling**: Not using established link typography system

## Refactoring Plan

### Phase 1: Typography Alignment

#### 1.1 **Implement Proper Type Hierarchy**
```astro
<!-- CURRENT -->
<h1 class="heading-1 mb-4b">Media</h1>
<h2 class="text-lg font-medium text-light mb-4b">{year}</h2>

<!-- REFACTORED -->
<PageHeader 
  title="Media"
  description="Interviews, podcasts, talks, and press coverage exploring economics, technology, and digital transformation"
  additionalInfo="Subscribe to podcast RSS • Request speaking engagement • Media kit"
/>
<h2 class="heading-3 mb-6b">{year}</h2>
```

**Rationale** (Bringhurst): *"Choose a basic leading that suits the typeface, text, and measure"* - heading-3 provides proper visual hierarchy without overwhelming the content.

#### 1.2 **Semantic Text Classes**
```astro
<!-- CURRENT -->
<div class="text-sm text-light mt-0.5">
<p class="text-sm text-textColor mt-1b">

<!-- REFACTORED -->
<div class="text-meta uppercase tracking-wide text-light mt-1b">
<p class="text-body leading-relaxed mt-2b">
```

**Rationale** (Hochuli): *"The goal is a consistent, even grey tonality"* - semantic classes ensure consistent text color across the page.

### Phase 2: Grid & Spacing Compliance

#### 2.1 **Baseline Grid Alignment**
```astro
<!-- All spacing must use grid units (6px base) -->
Section spacing: 12b (72px) - major sections
Year header margin: 6b (36px) - subsection spacing  
List item spacing: 4b (24px) - comfortable reading rhythm
Description margins: 2b (12px) - tight element coupling
```

**Rationale** (Ruder): *"Add and delete vertical space in measured intervals"* - maintains baseline grid throughout.

#### 2.2 **Reading Measure**
```astro
<!-- CURRENT -->
<div class="max-w-3xl mx-auto">

<!-- REFACTORED -->
<div class="measure-base mx-auto px-4b py-8b">
```

**Rationale**: Aligns with `--measure-base: 75ch` for optimal readability (Hochuli: 60-70 characters).

### Phase 3: Component Architecture

#### 3.1 **Media Entry Component**
Create reusable `MediaEntry.astro`:
```astro
---
interface Props {
  item: MediaItem;
  showIcon?: boolean;
}
const { item, showIcon = true } = Astro.props;
---

<article class="media-entry">
  <div class="flex gap-4b">
    {showIcon && (
      <div class="media-icon" aria-hidden="true">
        <Icon name={mediaIcons[item.type]} class="w-4 h-4 text-light opacity-60" />
      </div>
    )}
    <div class="flex-grow">
      <h3 class="heading-4 mb-1b">
        <a href={item.link} class="feature-link media-link" target="_blank" rel="noopener noreferrer">
          {item.title}
          <span class="sr-only">(opens in new window)</span>
        </a>
      </h3>
      <div class="text-meta mb-2b">
        {item.outlet} • <time datetime={item.date}>{formatDate(item.date)}</time>
      </div>
      {item.description && (
        <p class="text-body text-light leading-relaxed">{item.description}</p>
      )}
    </div>
  </div>
</article>

<style>
  .media-entry {
    position: relative;
    padding-bottom: var(--space-4); /* 24px */
  }
  
  /* Subtle left border on hover - no boxes */
  .media-entry::before {
    content: '';
    position: absolute;
    left: -12px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: transparent;
    transition: background-color 0.2s ease;
  }
  
  .media-entry:hover::before {
    background: var(--theme-color-300);
  }
  
  /* External link indicator - subtle */
  .media-link::after {
    content: '↗';
    font-size: 0.75em;
    margin-left: 0.25em;
    opacity: 0.5;
  }
</style>
```

### Phase 4: Document-Centric Layout

#### 4.1 **Remove Box Patterns**
- **No hover backgrounds**: Use subtle left border instead
- **No rounded corners**: Maintain document aesthetic
- **Minimal decoration**: Single icon per entry, integrated external link indicator

#### 4.2 **Enhanced Information Hierarchy**
```astro
<!-- Group by media type within year for better scanning -->
{years.map(year => {
  const yearItems = mediaData[Number(year)];
  const groupedByType = groupByType(yearItems);
  
  return (
    <section class="mb-12b">
      <h2 class="heading-3 mb-6b">{year}</h2>
      
      {Object.entries(groupedByType).map(([type, items]) => (
        <div class="mb-8b last:mb-0">
          <h3 class="text-meta uppercase text-light mb-4b">{type}</h3>
          <div class="space-y-4b">
            {items.map(item => <MediaEntry item={item} showIcon={false} />)}
          </div>
        </div>
      ))}
    </section>
  );
})}
```

### Phase 5: Typography Refinements

#### 5.1 **Optical Adjustments**
- **Year headers**: Use lining figures for years (OpenType feature)
- **Dates**: Old-style figures in running text
- **Metadata**: True small caps for outlet names (if available)

#### 5.2 **Link Typography**
```css
/* Following Butterick's link principles */
.media-link {
  text-decoration: none;
  color: var(--theme-accent-base);
  font-variation-settings: 'wght' 450;
}

.media-link:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.125em;
  font-variation-settings: 'wght' 500;
}
```

### Phase 6: Progressive Enhancement

#### 6.1 **Filtering System** (Optional)
```astro
<!-- Simple, typography-based filters -->
<nav class="mb-8b text-center">
  <span class="text-meta">Filter by type:</span>
  <button class="filter-link">All</button>
  <button class="filter-link">Podcasts</button>
  <button class="filter-link">Talks</button>
  <button class="filter-link">Press</button>
</nav>

<style>
  .filter-link {
    @apply text-0 text-light hover:text-accent;
    padding: 0 var(--space-3);
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .filter-link[aria-current="true"] {
    @apply text-accent-base;
    font-variation-settings: 'wght' 500;
  }
</style>
```

## Implementation Checklist

### Typography
- [ ] Replace all size-based classes with semantic typography
- [ ] Implement proper heading hierarchy (heading-3 for years)
- [ ] Use text-meta for metadata, text-body for descriptions
- [ ] Apply proper OpenType features (lining figures for years)
- [ ] Ensure consistent link typography throughout

### Spacing & Grid
- [ ] All spacing aligned to 6px baseline grid
- [ ] Section separation: 12b (72px)
- [ ] Element spacing: 4b (24px) 
- [ ] Consistent margins throughout
- [ ] Container uses measure-base

### Components
- [ ] Implement PageHeader component
- [ ] Create reusable MediaEntry component
- [ ] Remove inline styles
- [ ] Use systematic icon sizing

### Aesthetic Compliance
- [ ] Remove all box/card patterns
- [ ] Eliminate hover backgrounds
- [ ] Reduce visual decoration
- [ ] Maintain document-centric feel
- [ ] Use typography for hierarchy, not boxes

### Accessibility
- [ ] Proper heading structure
- [ ] Semantic HTML (time, nav elements)
- [ ] Screen reader announcements
- [ ] Keyboard navigation support
- [ ] ARIA labels where needed

## Expected Outcome

A clean, document-centric media page that:
- Uses typography to create hierarchy and rhythm
- Maintains perfect baseline grid alignment
- Provides excellent readability and scanning
- Feels integrated with the overall site aesthetic
- Loads quickly with minimal decoration
- Scales beautifully across devices

The refactored page will embody Ruder's principle: *"Typography has one plain duty: to convey information in writing"* - with every design decision supporting this goal. 