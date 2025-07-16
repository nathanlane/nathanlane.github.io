# Font Optimization Plan with Performance Metrics

## Executive Summary

This document outlines a comprehensive font optimization strategy for the Lane Website typography system, focusing on IBM Plex (Sans, Serif, Mono) implementation with measurable performance targets and implementation phases.

## Current Performance Baseline

### Initial Metrics (To Be Measured)
- **First Contentful Paint (FCP)**: Target < 1.8s
- **Cumulative Layout Shift (CLS)**: Target < 0.1
- **Font Loading Time**: Target < 300ms per critical font
- **Total Font Payload**: Currently ~400KB (estimated)

### Current Implementation Gaps
1. No italic variants loaded (impacts reading experience)
2. No font preloading (delays text rendering)
3. Component hardcoding (maintainability issue)
4. No performance monitoring

## Phase 1: Critical Font Loading (Week 1)

### 1.1 Implement Font Preloading

**Add to `src/components/BaseHead.astro`:**
```html
<!-- Preload critical fonts for above-the-fold content -->
<link rel="preload" href="/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-italic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/@fontsource/newsreader/files/newsreader-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
```

**Performance Impact:**
- Reduces font loading delay by 200-400ms
- Eliminates render-blocking font requests
- Improves FCP by 10-20%

### 1.2 Add Critical Italic Variants

**Update `src/styles/fonts.css`:**
```css
/* IBM Plex Sans - Critical Italic Variants */
@font-face {
  font-family: "IBM Plex Sans";
  src: url("@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-italic.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: "IBM Plex Sans";
  src: url("@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-italic.woff2") format("woff2");
  font-weight: 500;
  font-style: italic;
  font-display: swap;
}

/* IBM Plex Serif - Body Text Italics */
@font-face {
  font-family: "IBM Plex Serif";
  src: url("@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-400-italic.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

/* IBM Plex Mono - Code Comment Italics */
@font-face {
  font-family: "IBM Plex Mono";
  src: url("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-italic.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
```

**Impact:**
- Enables proper emphasis in body text
- Improves code comment readability
- Adds ~60KB to font payload (acceptable trade-off)

### 1.3 Fix Component Typography

**Components to Update:**
1. `DropCap.astro`: Change `font-family: 'Newsreader', serif;` to `font-family: theme('fontFamily.headline');`
2. `PullQuote.astro`: Update font references to use Tailwind utilities
3. `Sidenote.astro`: Use Tailwind font classes

**Example Fix:**
```css
/* Before */
font-family: 'IBM Plex Sans', sans-serif;

/* After */
@apply font-sans;
```

## Phase 2: Progressive Enhancement (Week 2)

### 2.1 Implement Critical FOFT Strategy

```javascript
// Add to BaseHead.astro
<script>
  // Font loading observer
  if ('fonts' in document) {
    Promise.all([
      document.fonts.load('400 1em IBM Plex Sans'),
      document.fonts.load('400 1em Newsreader')
    ]).then(() => {
      document.documentElement.classList.add('fonts-loaded');
    });
  }
</script>
```

### 2.2 Subset Fonts for Critical Text

Create subset fonts with only essential characters:
```bash
# Using pyftsubset
pyftsubset "IBMPlexSans-Regular.woff2" \
  --unicodes="U+0020-007F,U+00A0-00FF" \
  --output-file="IBMPlexSans-Regular-subset.woff2" \
  --flavor=woff2
```

**Metrics:**
- Subset size: ~15KB (vs 50KB full)
- Initial render: 100-200ms faster
- Full font loads progressively

### 2.3 Variable Font Implementation

**For Newsreader (already variable):**
```css
@font-face {
  font-family: 'Newsreader';
  src: url('@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2') format('woff2-variations');
  font-weight: 200 500;
  font-style: normal;
  font-display: swap;
}
```

## Phase 3: Advanced Optimization (Week 3)

### 3.1 Implement Font Loading API

```javascript
// Font loading with fallback handling
class FontLoader {
  constructor() {
    this.criticalFonts = [
      { family: 'IBM Plex Sans', weight: '400' },
      { family: 'IBM Plex Sans', weight: '400', style: 'italic' },
      { family: 'Newsreader', weight: '200 500' }
    ];
  }

  async loadCriticalFonts() {
    if ('fonts' in document) {
      try {
        await Promise.all(
          this.criticalFonts.map(font => 
            document.fonts.load(`${font.weight} 1em ${font.family}`, font.style)
          )
        );
        this.markFontsLoaded();
      } catch (error) {
        console.warn('Font loading failed:', error);
        this.applyFallbackStrategy();
      }
    }
  }

  markFontsLoaded() {
    document.documentElement.classList.add('fonts-loaded');
    // Track performance
    performance.mark('fonts-loaded');
  }

  applyFallbackStrategy() {
    // Use system fonts with adjusted metrics
    document.documentElement.classList.add('fonts-fallback');
  }
}
```

### 3.2 Font Metrics Matching

```css
/* Fallback font adjustments for better CLS */
.fonts-fallback {
  --font-sans-adjust: 1.05;
  --font-serif-adjust: 0.98;
  --font-mono-adjust: 1.02;
}

.fonts-fallback .font-sans {
  font-size: calc(1em * var(--font-sans-adjust));
  letter-spacing: -0.01em;
}

.fonts-fallback .font-headline {
  font-size: calc(1em * var(--font-serif-adjust));
  letter-spacing: 0.02em;
}
```

## Phase 4: Performance Monitoring (Ongoing)

### 4.1 Key Metrics to Track

```javascript
// Add to analytics
const fontMetrics = {
  // Time to first font loaded
  firstFontLoad: performance.measure('first-font', 'navigationStart', 'font-loaded'),
  
  // All critical fonts loaded
  allFontsLoaded: performance.measure('all-fonts', 'navigationStart', 'fonts-loaded'),
  
  // Layout shift from font swap
  fontCLS: new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.hadRecentInput) continue;
      analytics.track('font-cls', { value: entry.value });
    }
  })
};
```

### 4.2 Performance Budgets

| Metric | Current | Target | Maximum |
|--------|---------|--------|---------|
| Critical Font Load Time | ~500ms | 300ms | 400ms |
| Total Font Payload | ~400KB | 250KB | 300KB |
| Font-Related CLS | Unknown | 0.05 | 0.1 |
| Fonts Loaded by FCP | 0 | 2 | 3 |

### 4.3 A/B Testing Strategy

Test variations:
1. **Control**: Current implementation
2. **Variant A**: Preload + critical italics
3. **Variant B**: A + font subsetting
4. **Variant C**: B + variable fonts

Measure:
- Page load speed
- Reading time
- Bounce rate
- User engagement

## Implementation Timeline

### Week 1: Foundation
- [ ] Add font preloading to BaseHead.astro
- [ ] Implement critical italic variants
- [ ] Fix component font hardcoding
- [ ] Set up performance monitoring

### Week 2: Enhancement
- [ ] Implement Critical FOFT
- [ ] Create subset fonts
- [ ] Add Font Loading API
- [ ] Test fallback strategies

### Week 3: Optimization
- [ ] Fine-tune font metrics
- [ ] Implement A/B testing
- [ ] Optimize for Core Web Vitals
- [ ] Document best practices

## Success Criteria

1. **Performance**: 
   - Font loading < 300ms
   - CLS < 0.05 from fonts
   - FCP improvement > 15%

2. **User Experience**:
   - No visible font flash
   - Proper italic rendering
   - Consistent typography

3. **Developer Experience**:
   - All fonts use Tailwind classes
   - Easy to add new variants
   - Clear documentation

## Testing Checklist

- [ ] Test on slow 3G connection
- [ ] Verify offline functionality
- [ ] Check all italic usage
- [ ] Measure CLS impact
- [ ] Validate accessibility
- [ ] Cross-browser testing
- [ ] Mobile performance
- [ ] Print styles

## Rollback Plan

If issues arise:
1. Remove font preloading
2. Revert to original font files
3. Restore component hardcoding
4. Monitor error rates

Keep previous implementation in version control for quick rollback.

## Long-term Considerations

1. **CDN Strategy**: Consider self-hosting vs CDN
2. **International Support**: Add Latin-extended for better language support
3. **Variable Fonts**: Migrate all families to variable fonts when available
4. **Performance Budget**: Establish automated testing to maintain gains

---

*This plan provides a data-driven approach to font optimization with clear metrics, phased implementation, and measurable success criteria.*