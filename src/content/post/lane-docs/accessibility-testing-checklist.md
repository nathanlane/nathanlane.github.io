---
title: "Accessibility Testing Checklist"
description: "Comprehensive testing checklist for accessibility and performance improvements"
publishDate: "2025-07-16"
tags: ["testing", "accessibility", "performance", "documentation"]
draft: false
seriesId: "lane-docs"
orderInSeries: 11
---

This checklist ensures all accessibility and performance improvements are properly tested and verified.

## Automated Testing

### Lighthouse Scores
Run in Chrome DevTools (F12 → Lighthouse tab)

- [ ] Performance Score: Target 90+
  - [ ] First Contentful Paint (FCP) < 1.8s
  - [ ] Largest Contentful Paint (LCP) < 2.5s
  - [ ] Cumulative Layout Shift (CLS) < 0.1
  - [ ] Time to Interactive (TTI) < 3.8s
- [ ] Accessibility Score: Target 95+
- [ ] Best Practices Score: Target 100
- [ ] SEO Score: Target 100

### axe DevTools
Install browser extension and run on each page type

- [ ] Homepage: 0 violations
- [ ] Blog post page: 0 violations
- [ ] Research page: 0 violations
- [ ] Writing page: 0 violations
- [ ] Projects page: 0 violations
- [ ] About page: 0 violations

### WAVE (WebAIM)
Alternative accessibility testing tool

- [ ] No errors on any page
- [ ] Contrast errors resolved
- [ ] Structural errors resolved

## Manual Testing

### Keyboard Navigation
Test without using mouse/trackpad

- [ ] Tab through all interactive elements
- [ ] Focus indicators clearly visible
- [ ] Skip links work correctly
- [ ] Modal/menu traps focus appropriately
- [ ] Escape key closes modals/menus

### Screen Reader Testing
Use NVDA (Windows) or VoiceOver (Mac)

- [ ] Page structure announced correctly
- [ ] Heading hierarchy makes sense
- [ ] Links have descriptive text
- [ ] Images have appropriate alt text
- [ ] Form labels announced correctly
- [ ] Dynamic content updates announced

### Color Contrast Testing
Use browser DevTools or contrast checker

**Light Mode**
- [ ] Normal text (16px): 4.5:1 ratio minimum
- [ ] Large text (24px+): 3:1 ratio minimum
- [ ] Link text: 4.5:1 ratio minimum
- [ ] Button text: 4.5:1 ratio minimum

**Dark Mode**
- [ ] Normal text: 4.5:1 ratio minimum
- [ ] Light gray text (improved to hsl(40deg 5% 70%)): 4.5:1 ratio
- [ ] Link text: 4.5:1 ratio minimum
- [ ] Secondary button text: 4.5:1 ratio minimum
- [ ] Code syntax highlighting: Readable contrast

### Mobile Testing
Test on actual devices or responsive mode

- [ ] Touch targets at least 44x44px
- [ ] Text readable without zooming
- [ ] No horizontal scrolling
- [ ] Images load lazily below fold
- [ ] Performance on 3G connection

## Specific Improvements Verification

### Font Loading
- [ ] No invisible text during load (font-display: swap working)
- [ ] Fonts load in correct order
- [ ] No layout shift from font loading

### Image Optimization
- [ ] MDX images use lazy loading
- [ ] Images have width/height attributes
- [ ] No layout shift from image loading
- [ ] Alt text present and descriptive

### Heading Hierarchy
- [ ] Every page has exactly one h1
- [ ] No skipped heading levels
- [ ] Headings create logical outline
- [ ] Visual appearance unchanged

### Structured Data
- [ ] JSON-LD validates in Google's tool
- [ ] No errors in Search Console
- [ ] Rich snippets preview correctly

## Performance Metrics

### Core Web Vitals (Field Data)
After deployment, monitor in Google Search Console

- [ ] LCP: Good (< 2.5s) for 75%+ of users
- [ ] FID: Good (< 100ms) for 75%+ of users
- [ ] CLS: Good (< 0.1) for 75%+ of users

### Bundle Size
Check after build

- [ ] CSS < 50KB (gzipped)
- [ ] JS < 100KB (gzipped)
- [ ] Font files optimized

## Browser Compatibility

Test in multiple browsers

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Documentation

- [ ] All changes documented
- [ ] Maintenance guides updated
- [ ] Known issues documented
- [ ] Future improvements noted

## Sign-off

- [ ] All automated tests passing
- [ ] Manual testing complete
- [ ] No regressions identified
- [ ] Performance metrics met
- [ ] Ready for deployment