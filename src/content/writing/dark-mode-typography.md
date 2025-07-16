---
title: "Dark Mode Typography Optimization"
description: "Testing font weight and spacing adjustments needed for optimal readability in dark themes."
publishDate: "2024-02-25"
type: "experiment"
featured: false
---

# Dark Mode Typography Optimization

## Problem Statement

Typography that looks perfect in light mode often appears thin or hard to read in dark mode. This experiment tests various adjustments to optimize readability across themes.

## Variables Tested

### Font Weight Adjustments
- Light mode: `font-weight: 400`
- Dark mode options:
  - `font-weight: 450` (+50)
  - `font-weight: 425` (+25)
  - `font-weight: 475` (+75)

### Letter Spacing
- Light mode: `letter-spacing: -0.02em`
- Dark mode options:
  - `letter-spacing: 0` (neutral)
  - `letter-spacing: 0.01em` (slightly open)
  - `letter-spacing: -0.01em` (slightly tight)

### Line Height
- Light mode: `line-height: 1.55`
- Dark mode options:
  - `line-height: 1.6` (more open)
  - `line-height: 1.65` (most open)

## Results

### Optimal Settings for Dark Mode:
- **Body text**: +25 font weight, neutral letter spacing, +0.05 line height
- **Headings**: +50 font weight, slightly open letter spacing
- **Code**: +50 font weight, maintain tight letter spacing

### Key Insights:
1. Slightly heavier weights prevent the "disappearing text" effect
2. More open line height improves scanning in dark environments
3. Code blocks need the most adjustment due to smaller font sizes

## Implementation

```css
@media (prefers-color-scheme: dark) {
  body {
    font-weight: 425;
    line-height: 1.6;
  }
  
  h1, h2, h3 {
    font-weight: 450;
    letter-spacing: 0;
  }
  
  code {
    font-weight: 500;
  }
}
```

## Conclusion

Dark mode typography requires subtle but important adjustments. The key is maintaining readability without making text appear bold or heavy. These micro-adjustments significantly improve the reading experience in dark environments.