# CONTRAINTS AND RULES

- PART I. FORBIDDEN ACTIONS (AND EXCEPTIONS)
- PART II. MANDITORY CONSTRAINTS 

## PART I. : FORBIDDEN ACTIONS (Never Do These)

### Visual Design Prohibitions

#### 1. **NO EXTRANEIOUS DECORATIVE ELEMENTS**
- ❌ No icons (except essential UI like search)
- ❌ No hero images
- ❌ No background
- ❌ No brand logos beyond simple text

#### 2. **NO MORE THAN TWO COLUMNS**

**Exception**: Sidenotes in margins on wide screens only
**Exception**: Navigation boxes
**Exception**: Images and download boxes.

### Typography Violations

#### 3. **MINMIMAL MULTIPLE FONT FAMILIES**
**Rule**: Maximum 4 families (serif/sans + mono for code)

#### 4. **NO ARBITRARY TYPE SIZES**
**Rule**: Strict modular scale only
```css
/* FORBIDDEN */
.random-size { font-size: 17.5px; }
.another-size { font-size: 1.13rem; }
```
### Layout Transgressions

#### 5. **NO CENTERED TEXT BLOCKS**
**Exception**: headings or navigation only or announcements only
```css
/* FORBIDDEN */
.hero { text-align: center; }
article { text-align: center; }
```

#### 6. **NO STICKY/FIXED ELEMENTS**
```css
/* FORBIDDEN */
.sticky-nav { position: sticky; top: 0; }
.fixed-header { position: fixed; }
.floating-button { position: fixed; bottom: 20px; }
```

#### 7. **NO ANIMATIONS OR TRANSITIONS**
```css
/* FORBIDDEN */
@keyframes fadeIn { ... }
.animate { transition: all 0.3s ease; }
.parallax { transform: translateY(calc(var(--scroll) * 0.5)); }
```
**Exception**: Subtle link underline thickness on hover only

### Spacing Crimes

#### 8. **NO ARBITRARY SPACING**
**Rule**: Use baseline grid units
```css
/* FORBIDDEN */
.random-margin { margin-top: 37px; }
.weird-padding { padding: 13px 27px 19px 31px; }
```

#### 9. **NO CRAMPED CONTENT IN BODY**
- ❌ Line height < 1.5 for body text
- ❌ Paragraph spacing < 1 baseline unit
- ❌ Content touching viewport edges

### Interactive Elements
**Exception**: Code, footnotes, margin notes, footer content.

#### 10. **MINIMAL JAVASCRIPT UI LIBRARIES**
```javascript
// FORBIDDEN
import React from 'react';
import Vue from 'vue';
import { Modal, Carousel, Tabs } from 'ui-library';
```

#### 11. **NO MODALS OR OVERLAYS**
- ❌ No popups
- ❌ No lightboxes
- ❌ No toast notifications
- ❌ No dropdown menus


## PARTR II. ✅ MANDATORY CONSTRAINTS

### Typography Requirements

1. **ESTABLISH TYPE HIERARCHY FIRST**
   - Define all text sizes before any layout
   - Test hierarchy with no CSS beyond font-size
   - Ensure readability at every scale

2. **RESPECT THE MEASURE**
   ```css
   p { max-width: 75ch; } /* MANDATORY */
   ```

3. **USE SYSTEM FONTS FALLBACK**
   ```css
   font-family: "Primary Font", system-ui, -apple-system, sans-serif;
   ```

### Layout Constraints

4. **SINGLE COLUMN DEFAULT**
   - Content flows vertically
   - No sidebars or multi-column
   - Sidenotes only on >1200px screens

5. **ENFORCE MAX WIDTH**


### Spacing Discipline

6. **BASELINE GRID ALIGNMENT**

** All vertical spacing must be multiples of baseline**

7. **GENEROUS WHITESPACE**
   - Minimum 10% viewport padding on mobile
   - Section spacing ≥ 72px
   - Paragraph spacing = 1 baseline

### Performance Mandates

8. **PAGE WEIGHT LIMITS**
   - HTML + CSS < 200KB
   - Fonts < 500KB total
   - Limited external dependencies

9. **STATIC FIRST**
    - Generate static HTML
    - No client-side routing
    - Progressive enhancement only

## 🎯 DECISION HIERARCHY

When the agent faces design decisions, follow this priority:

1. **Readability** > Aesthetics
2. **Typography** > Layout
3. **Whitespace** > Elements
4. **Static** > Dynamic
5. **Native** > Custom
6. **Less** > More

## 🔍 VALIDATION CHECKLIST

Before any deployment, verify:

- [ ] Can you remove all CSS except typography and it still works?
- [ ] Are all spacings from the baseline grid?
- [ ] Is every element justified by content needs?
- [ ] Does it load in < 2 second on 3G?
- [ ] Can you read it comfortably for 20 minutes?
- [ ] Does it work without JavaScript?
- [ ] Is the HTML semantically correct?
- [ ] Is anything centered that shouldn't be?
- [ ] Is the color palette monochrome + 1 accent?

## 🚨 IMMEDIATE REJECTION TRIGGERS

Any PR/commit with these gets auto-rejected:

1. Hero sections with background images
2. Carousels, tabs, accordions
3. Animation libraries
4. Icon fonts
5. Gradient backgrounds
6. Drop shadows on containers
7. CSS Grid beyond two columns
8. JavaScript for essential content display

Remember: **If you're adding visual "interest," you're doing it wrong. The content IS the interest.**