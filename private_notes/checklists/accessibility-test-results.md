# Accessibility Test Results

## Pre-Test Checklist

Before running axe DevTools, make sure:
1. Build your site: `pnpm build`
2. Preview locally: `pnpm preview`
3. Open http://localhost:4321 in Chrome/Edge
4. Install axe DevTools extension if not already installed

## Expected Results After Our Fixes

### ✅ Issues We've Already Fixed

1. **Heading Hierarchy**
   - No more "Heading levels should only increase by one" errors
   - All pages now have proper h1 → h2 → h3 structure

2. **Color Contrast (Dark Mode)**
   - Text colors improved from 65% to 75% brightness
   - Should meet WCAG AA standards (4.5:1 ratio)

3. **Image Lazy Loading**
   - MDX images now have proper lazy loading
   - No missing width/height attributes

4. **ARIA Labels**
   - All icon buttons have proper aria-label attributes
   - Screen reader text provided where needed

### ⚠️ Potential Issues to Watch For

1. **Links**
   - Check for any "Link text is not descriptive" warnings
   - Particularly watch for standalone arrow links (→)

2. **Color Contrast (Light Mode)**
   - Some light gray text might still need adjustment
   - Check buttons and links specifically

3. **Focus Indicators**
   - Ensure all interactive elements have visible focus states
   - Test with keyboard navigation (Tab key)

## How to Test Each Page

### 1. Homepage (/)
1. Open axe DevTools
2. Click "Scan ALL of my page"
3. Expected: 0 violations (maybe 1-2 minor issues)

### 2. Blog Post (/posts/any-post)
1. Navigate to any blog post
2. Run axe scan
3. Check for:
   - Code block contrast
   - Link underlines visible
   - Image alt text present

### 3. Research Page (/research/)
1. Run scan on research listing
2. Check:
   - Paper links are descriptive
   - "link here" text has enough context

### 4. Dark Mode Testing
1. Toggle to dark mode
2. Re-run axe on same pages
3. Look for contrast warnings

## Recording Results

For each issue found:

```
Page: [URL]
Issue: [What axe reports]
Severity: [Critical/Serious/Moderate/Minor]
Element: [The HTML element]
How to fix: [Our solution]
```

## Common Quick Fixes

### If you see contrast errors:
```css
/* Increase text brightness */
--theme-light: hsl(40deg 5% 70%); /* Increase % */
```

### If you see missing alt text:
```html
<!-- Add descriptive alt -->
<img src="photo.jpg" alt="Description of what's in the photo">
```

### If you see link text issues:
```html
<!-- Instead of -->
<a href="/research">→</a>

<!-- Use -->
<a href="/research">View all research →</a>
```

## Next Steps After Testing

1. Fix any Critical/Serious issues first
2. Address Moderate issues if time permits
3. Document any Minor issues for later
4. Re-run tests after fixes
5. Aim for 0 violations on main pages

Remember: The goal is progress, not perfection. Even reducing violations from 20 to 5 is a huge win!