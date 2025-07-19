# Link Behavior Analysis - nathanlane.github.io

## Current Link System Overview

The site uses a consolidated link system with 4 primary link types, each with distinct hover behaviors. The system was refactored from 7 types down to 4 in Phase 1 (January 30, 2025), further enhanced in Phase 2A (July 18, 2025), and harmonized in Phase 2B (July 19, 2025).

## Link Type Behaviors

### 1. **link-inline** - For prose and body text

| Property | Default State | Hover State |
|----------|--------------|-------------|
| **Color** | `inherit` (uses parent text color) | `var(--theme-accent-base)` |
| **Underline** | ✅ Yes | ✅ Yes |
| **Underline Color** | `hsl(0deg 0% 60%)` (gray) | `var(--theme-accent-base)` |
| **Underline Thickness** | `1px` | `1.5px` |
| **Font Weight** | `400` | `450` |
| **Transition** | - | 200ms ease (all properties) |

**Light Mode Colors:**
- Default: Inherits text color (near black)
- Hover: `#e8e6e3` (warm white)

**Dark Mode Colors:**
- Default: Inherits text color (off-white)
- Hover: `#262626` (near black)

### 2. **link-nav** - For navigation, actions, and UI elements

| Property | Default State | Hover State |
|----------|--------------|-------------|
| **Color** | `var(--theme-color-600)` | `var(--theme-accent-base)` |
| **Underline** | ❌ No | ❌ No |
| **Font Weight** | `450` | `500` |
| **Letter Spacing** | `0.02em` | `0.02em` (unchanged) |
| **Transition** | - | 200ms ease |

**Variants:**
- `data-variant="subtle"`: Opacity 0.8 → 1 on hover, lighter initial weight
- `data-variant="back"`: Color changes to `--theme-text` on hover
- `data-variant="action"`: Includes icon gap, flex display

### 3. **link-title** - For headings, titles, and featured content

| Property | Default State | Hover State |
|----------|--------------|-------------|
| **Color** | `inherit` | `var(--theme-accent-base)` |
| **Underline** | ❌ No | ❌ No |
| **Font Weight** | `500` | `550` |
| **Transition** | - | 200ms ease |

**Special Usage:**
- Used with `link-underline-thin` modifier in MediaEntry and ArchiveEntry components
- When combined with `u-underline-thin`:
  - Has underline by default (color: `var(--link-color-hover)`)
  - Thickness: `1px` → `2px` on hover

### 4. **link-footer** - Unique border-bottom behavior

| Property | Default State | Hover State |
|----------|--------------|-------------|
| **Color** | `var(--theme-color-600)` | `var(--theme-text)` |
| **Underline** | ❌ No (transparent border) | ✅ Yes (colored border) |
| **Border Bottom** | `1px solid transparent` | `1px solid currentColor` |
| **Font Weight** | `400` | `450` |
| **Transition** | - | 200ms ease + border transition |

## Custom Component Behaviors

### PostPreview Component
- Uses raw `<a>` tags with inline `hover:underline` class
- No specific link class applied
- Text color: `text-accent-base` (always accent color)

### CompactList Component
- Uses `link-title` class
- Custom hover effect on parent `.entry-link:hover .entry-title`
- Adds micro-expansion animation (scale transform)

### Header Component
- Navigation links use `nav-link` class
- Custom styles override with:
  - Default: `var(--color-text)`
  - Hover: `var(--color-text-muted)`
- Site title has separate hover behavior

### Global.css Overrides

1. **Prose Links** (`.prose a:not(.nav-link):not(.footer-link)`)
   - Custom underline color: `var(--theme-color-300)`
   - Custom thickness: `0.06em`
   - Visited state changes color to `var(--theme-color-700)`

2. **Research Action Links** (`.link-research-action`)
   - Complete custom implementation
   - Font size: `var(--step--1)` (smaller)
   - Weight: 450 → 500 on hover
   - Opacity: variable based on theme

3. **Dark Mode Specific**
   - Content links in dark mode get brightness filter
   - `.content a:not(.no-filter)`: brightness(1.1) → brightness(1.15) on hover

## Inconsistencies Identified

1. **Color System Confusion**
   - Some components use `--color-text` while others use `--theme-text`
   - Accent colors vary between `--theme-accent-base` and `--accent-base`

2. **Weight Variations**
   - Inconsistent hover weight increases (450→500 vs 400→450 vs 450→480)
   - Some use font-variation-settings, others use font-weight

3. **Underline Behaviors**
   - link-inline: Always underlined, changes thickness
   - link-title + u-underline-thin: Always underlined, changes thickness
   - link-footer: No underline → border-bottom on hover
   - PostPreview: No underline → underline on hover

4. **Custom Overrides**
   - Header nav links completely override link-nav behavior
   - Prose links have custom styling that doesn't match link-inline
   - Multiple competing hover behaviors in global.css

## Proposed Harmonization

### Consistent Hover Patterns

1. **Color Changes**
   - All links should hover to `--theme-accent-base` for consistency
   - Remove custom color overrides unless semantically necessary

2. **Weight Changes**
   - Standardize on +50 weight increase on hover
   - Use font-variation-settings consistently for smooth transitions

3. **Underline Behavior Options**
   - **Always Underlined**: Thickness increase on hover (link-inline pattern)
   - **Never Underlined**: No underline on hover (link-nav, link-title)
   - **Hover Underline**: No underline → underline on hover (new pattern)

4. **Unified Variables**
   - Consolidate `--color-*` and `--theme-*` variables
   - Use semantic tokens from links.css consistently

5. **Component-Specific Needs**
   - Preserve footer border-bottom pattern (unique and effective)
   - Keep navigation subtle variant for secondary links
   - Maintain research action links as specialized type

## Phase 2B Harmonization (July 19, 2025)

### Changes Implemented

1. **Header Component Fixed** ✅
   - Removed custom overrides that prevented proper link-nav behavior
   - Now uses `link-nav` class properly with custom padding/font-size only
   - Site title uses consistent hover to `--theme-accent-base`

2. **Hover Colors Standardized** ✅
   - All links now hover to `--theme-accent-base` for consistency
   - Fixed nav variants (subtle, back) to use accent hover color
   - Footer links updated to use accent color on hover

3. **Hover Underline Utility Created** ✅
   - Added `.u-hover-underline` utility class
   - Applied to PostPreview component links
   - Provides consistent "no underline → underline on hover" pattern

4. **Weight Changes Harmonized** ✅
   - All links now use consistent +50 weight units on hover
   - Updated CSS variables with clear comments
   - Fixed active state to use proper nav weight

### Harmonized Link Behaviors

| Link Type | Default | Hover | Underline Pattern |
|-----------|---------|-------|-------------------|
| **link-inline** | Weight 400, underlined | Weight 450, accent color, thicker underline | Always underlined |
| **link-nav** | Weight 450, no underline | Weight 500, accent color | Never underlined |
| **link-title** | Weight 500, no underline | Weight 550, accent color | Never underlined |
| **link-footer** | Weight 400, transparent border | Weight 450, accent color, visible border | Border effect |

### Utility Modifiers
- `.u-underline-thin`: Always thin underline, thickens on hover
- `.u-hover-underline`: No underline → underline on hover
- `.u-with-icon`: Flex display with icon gap