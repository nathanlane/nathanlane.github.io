# Visual Elements Audit - Citrus Theme

This document identifies all non-monochromatic visual elements in the Astro Citrus theme that need to be addressed for full minimalist conversion.

## Summary

The theme currently has **monochromatic CSS variables** but contains **hardcoded colorful elements** in components that break the minimalist aesthetic. Priority should be given to removing gradient backgrounds and colorful accent elements.

## Detailed Findings

| file_path | visual_pattern_found | CSS_class_or_token_name | change_priority |
|-----------|---------------------|-------------------------|----------------|
| **GRADIENT BACKGROUNDS (Major Issue)** | | | |
| src/layouts/Base.astro | Colorful gradient orbs | `bg-gradient-to-b from-blue-300 via-pink-300 to-transparent` | **HIGH** |
| src/layouts/Base.astro | Colorful gradient orbs | `bg-gradient-to-b from-purple-300 via-blue-300 to-transparent` | **HIGH** |
| src/layouts/Base.astro | Colorful gradient orbs | `bg-gradient-to-b from-indigo-300 via-orange-300 to-transparent` | **HIGH** |
| src/layouts/Base.astro | Colorful gradient orbs | `bg-gradient-to-b from-orange-300 via-indigo-300 to-transparent` | **HIGH** |
| src/components/layout/Header.astro | Colorful gradient orbs | `bg-gradient-to-b from-blue-300 via-pink-300 to-transparent` | **HIGH** |
| src/components/layout/Header.astro | Colorful gradient orbs | `bg-gradient-to-b from-purple-300 via-blue-300 to-transparent` | **HIGH** |
| src/components/layout/Header.astro | Colorful gradient orbs | `bg-gradient-to-b from-indigo-300 via-orange-300 to-transparent` | **HIGH** |
| src/components/layout/Header.astro | Colorful gradient orbs | `bg-gradient-to-b from-orange-300 via-indigo-300 to-transparent` | **HIGH** |
| src/pages/notes/[...slug].astro | Colorful gradient orbs | `bg-gradient-to-b from-blue-300 via-pink-300 to-transparent` | **HIGH** |
| src/pages/notes/[...slug].astro | Colorful gradient orbs | `bg-gradient-to-b from-purple-300 via-blue-300 to-transparent` | **HIGH** |
| src/pages/notes/[...slug].astro | Colorful gradient orbs | `bg-gradient-to-b from-indigo-300 via-orange-300 to-transparent` | **HIGH** |
| src/pages/notes/[...slug].astro | Colorful gradient orbs | `bg-gradient-to-b from-orange-300 via-indigo-300 to-transparent` | **HIGH** |
| src/pages/index.astro | Colorful gradient orbs | `bg-gradient-to-b from-blue-300 via-pink-300 to-transparent` | **HIGH** |
| src/pages/index.astro | Colorful gradient orbs | `bg-gradient-to-b from-purple-300 via-blue-300 to-transparent` | **HIGH** |
| src/pages/index.astro | Colorful gradient orbs | `bg-gradient-to-b from-indigo-300 via-orange-300 to-transparent` | **HIGH** |
| src/pages/index.astro | Colorful gradient orbs | `bg-gradient-to-b from-orange-300 via-indigo-300 to-transparent` | **HIGH** |
| src/components/SeriesPanel.astro | Colorful gradient orbs | `bg-gradient-to-b from-orange-300 via-pink-300 to-purple-300` | **HIGH** |
| **GRADIENT TEXT AND BUTTONS** | | | |
| src/pages/index.astro | Gradient title text | `bg-gradient-to-r from-accent-two/85 via-accent-one/85 to-accent-two/85` | **HIGH** |
| src/pages/index.astro | Gradient button background | `bg-gradient-to-r from-accent-one to-accent-two` | **HIGH** |
| src/pages/index.astro | Gradient button text | `bg-gradient-to-r from-accent-one to-accent-two bg-clip-text` | **HIGH** |
| src/components/layout/Header.astro | Gradient site name | `bg-gradient-to-r from-accent-one to-accent-two bg-clip-text` | **HIGH** |
| **BADGE/TAG PILLS** | | | |
| src/components/Badge.astro | Colored badge variants | `bg-accent-base`, `bg-accent-one`, `bg-accent-two` | **HIGH** |
| src/components/blog/Masthead.astro | Colored tag badges | `Badge variant="accent-two"` | **HIGH** |
| src/components/blog/Masthead.astro | Colored series badges | `Badge variant="accent-base"` | **HIGH** |
| src/components/blog/Masthead.astro | Updated date badge | `bg-accent-two/5 text-accent-two` | **HIGH** |
| **CARD/BOXED ELEMENTS** | | | |
| src/components/note/Note.astro | Note preview card | `rounded-lg bg-color-75` | **LOW** |
| src/components/blog/TOC.astro | TOC card background | `rounded-t-lg bg-color-75 border-special-light` | **LOW** |
| src/components/blog/TOC.astro | TOC card background | `rounded-b-lg bg-color-75 border-special-light` | **LOW** |
| src/components/SeriesPanel.astro | Series panel card | `bg-accent-base/5 border-special-light` | **MEDIUM** |
| src/components/SeriesPanel.astro | Series panel card | `rounded-lg bg-color-100` | **LOW** |
| **INTERACTIVE ELEMENTS** | | | |
| src/components/layout/Header.astro | Search button background | `bg-accent-base/5 hover:bg-accent-base/10` | **MEDIUM** |
| src/components/layout/Header.astro | Language button background | `bg-accent-base/5 hover:bg-accent-base/10` | **MEDIUM** |
| src/components/layout/Header.astro | Dropdown panel | `border-special-lighter bg-special-light shadow-[0px_10px_25px_rgba(0,0,0,0.15)]` | **LOW** |
| src/components/blog/Masthead.astro | Toggle buttons | `bg-accent-base/10 hover:brightness-110` | **MEDIUM** |
| **AVATARS AND PROFILE ELEMENTS** | | | |
| src/components/blog/webmentions/Likes.astro | Profile image rings | `ring-2 ring-textColor hover:ring-4 hover:ring-link` | **LOW** |
| src/components/blog/webmentions/Comments.astro | Comment avatar rings | `ring-2 ring-textColor hover:ring-4 hover:ring-link` | **LOW** |
| **HARDCODED BRAND COLORS** | | | |
| src/pages/og-image/[...slug].[ext].ts | OG image colors | `#f2f2f2`, `#6b6b6b`, `#8e8e8e`, `#224d67` | **LOW** |
| astro.config.ts | Manifest colors | `background_color: "#1d1f21"`, `theme_color: "#2bbc8a"` | **LOW** |
| **CUSTOM FONTS** | | | |
| src/styles/global.css | SF Pro Rounded fonts | `font-family: "SFProRounded"` | **LOW** |
| src/styles/global.css | CascadiaCode fonts | `font-family: "CascadiaCode"` | **LOW** |
| tailwind.config.ts | Font definitions | `sans: ["SFProRounded", ...]`, `serif: ["CascadiaCode", ...]` | **LOW** |
| **DEMONSTRATION ELEMENTS** | | | |
| src/pages/index.astro | Color scale demo | `bg-color-50` through `bg-color-900` | **LOW** |

## Priority Recommendations

### **HIGH Priority (Immediate Action)**
1. **Remove all gradient backgrounds** - Replace with solid grayscale backgrounds
2. **Eliminate gradient text effects** - Use solid text colors
3. **Simplify badge/tag colors** - Use monochromatic variants only
4. **Remove colorful accent usage** - Replace with grayscale equivalents

### **MEDIUM Priority (Secondary)**
1. **Simplify interactive hover states** - Remove brightness effects
2. **Reduce accent-based backgrounds** - Use neutral backgrounds

### **LOW Priority (Cosmetic)**
1. **Card backgrounds** - Already using grayscale, may need minor adjustments
2. **Brand colors** - OG images and manifest colors (affect SEO/branding)
3. **Font definitions** - Custom fonts are fine for typography focus

## Action Items

1. **Create search-and-replace script** to convert gradient classes to solid equivalents
2. **Update Badge component** to use only grayscale variants
3. **Remove decorative gradient orbs** from all layout files
4. **Simplify hover effects** to use opacity/scale instead of color changes
5. **Test both light and dark modes** after changes

## Notes

- The CSS variable system is already monochromatic (good!)
- Main issue is hardcoded Tailwind color classes in components
- Focus on removing `from-*`, `via-*`, `to-*` gradient classes
- Replace `accent-one`, `accent-two` usage with `accent-base` or grayscale alternatives