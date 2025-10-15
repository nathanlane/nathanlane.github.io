# Configuration Consolidation Plan

## Problem

Configuration data is duplicated across multiple files, creating maintenance burden and risk of inconsistency:

1. **`src/site.config.ts`** - TypeScript site config
2. **`src/content/homepage/index.yaml`** - YAML homepage content
3. **`src/data/about-config.ts`** - About page config

### Current Duplication

| Data | site.config.ts | index.yaml | about-config.ts |
|------|---------------|------------|-----------------|
| Name | ✅ "Nathan Lane" | ✅ "Nathan Lane, PhD" | ✅ (via title) |
| Email | ✅ `n.lane@lse.ac.uk` | ✅ `n.lane@lse.ac.uk` | ✅ (referenced) |
| Job Title | ✅ "Assistant Professor" | ✅ "Assistant Professor" | ❌ |
| Organization | ✅ "LSE" | ✅ "LSE" | ❌ |
| CV URL | ✅ `/cv.pdf` | ✅ `/cv.pdf` | ✅ (referenced) |
| Profile Image | ✅ `/headshot.jpg` | ❌ | ✅ `/headshot-full.JPG` |

## Solution: Single Source of Truth Hierarchy

### Phase 1: Extend `site.config.ts` (Primary Source)

**Make `site.config.ts` the authoritative source** for all identity and contact data.

```typescript
// src/site.config.ts
export const siteConfig: SiteConfig = {
  // Identity
  author: "Nathan Lane",
  fullName: "Nathan Lane, PhD",
  jobTitle: "Assistant Professor",
  organization: "London School of Economics",
  organizationShort: "LSE",

  // Contact
  email: "n.lane@lse.ac.uk",

  // Resources
  resumeUrl: "/cv.pdf",
  profileImage: "/headshot.jpg",
  profileImageFull: "/headshot-full.JPG",

  // ... rest of existing config
};
```

### Phase 2: Reference from Other Files

#### Option A: Import in YAML (Recommended for Astro)

Since YAML can't import TypeScript, **consume in the Astro component** instead:

```astro
---
// src/pages/index.astro
import { siteConfig } from "@/site.config";
import { getEntry } from "astro:content";

// Get content-only data from YAML
const homepageContent = await getEntry("homepage", "index");

// Merge with site config
const bio = {
  title: siteConfig.fullName,
  tagline: siteConfig.organization,
  narrative: homepageContent.data.bio.narrative,
  // ... content from YAML
};

const contact = {
  email: siteConfig.email, // From site.config.ts
  items: [
    { label: "Email", href: `mailto:${siteConfig.email}`, text: "Email Me" },
    { label: "CV", href: siteConfig.resumeUrl, text: "Download CV" },
    // ... other links from YAML
  ]
};
---
```

#### Option B: Keep YAML for Content Only

**Simplify `index.yaml`** to contain only **narrative content**, not data:

```yaml
# src/content/homepage/index.yaml
bio:
  narrative: >+
    I'm an economics professor working at the intersection of big data...

sections:
  research:
    title: Research
    itemCount: 3
  # ... other sections
```

Then in `index.astro`, combine:
```astro
const bio = {
  ...siteConfig,                    // Identity from TypeScript
  narrative: yaml.bio.narrative,    // Content from YAML
};
```

### Phase 3: Eliminate Redundant Files

**Option 1: Keep `about-config.ts` as thin wrapper**
```typescript
// src/data/about-config.ts
import { siteConfig } from "@/site.config";

export const aboutConfig = {
  meta: {
    title: "About",
    description: `About ${siteConfig.fullName}`,
  },
  photo: {
    show: true,
    src: siteConfig.profileImageFull,
    alt: `${siteConfig.author} headshot`,
    fullSizeLink: siteConfig.profileImageFull,
  },
  content: {
    intro: "Biography intro...",
    paragraphs: [/* ... */],
    outro: { /* ... */ }
  }
};
```

**Option 2: Inline about content in page component**
```astro
---
// src/pages/about.astro
import { siteConfig } from "@/site.config";
import { getEntry } from "astro:content";

const aboutContent = await getEntry("pages", "about");
---
```

## Recommended Implementation Steps

### ✅ Step 1: Extend SiteConfig Type

```typescript
// src/types.ts
export interface SiteConfig {
  // ... existing fields

  /** Full formal name with credentials (e.g., 'Nathan Lane, PhD') */
  fullName?: string;

  /** Short organization name (e.g., 'LSE') */
  organizationShort?: string;

  /** Path to full-size profile image */
  profileImageFull?: string;
}
```

### ✅ Step 2: Update site.config.ts

Add the new fields:
```typescript
export const siteConfig: SiteConfig = {
  author: "Nathan Lane",
  fullName: "Nathan Lane, PhD",
  jobTitle: "Assistant Professor",
  organization: "London School of Economics",
  organizationShort: "LSE",
  email: "n.lane@lse.ac.uk",
  resumeUrl: "/cv.pdf",
  profileImage: "/headshot.jpg",
  profileImageFull: "/headshot-full.JPG",
  // ... rest
};
```

### ✅ Step 3: Simplify index.yaml

Remove redundant data, keep only content:
```yaml
bio:
  narrative: >+
    I'm an economics professor...

contact:
  title: Important Links
  # Remove email - will come from siteConfig
  items:
    - label: The Industrial Policy Group
      href: https://industrialpolicygroup.com
      text: industrialpolicygroup.com
    # ... other custom links
```

### ✅ Step 4: Update index.astro

```astro
---
import { siteConfig } from "@/site.config";
import { getEntry } from "astro:content";

const homepageYaml = await getEntry("homepage", "index");

// Merge: siteConfig provides identity, YAML provides content
const bio = {
  title: siteConfig.fullName,
  tagline: siteConfig.organization,
  narrative: homepageYaml.data.bio.narrative,
};

const contact = {
  title: "Important Links",
  email: siteConfig.email,
  items: [
    // Auto-generate from siteConfig
    {
      label: "Email",
      href: `mailto:${siteConfig.email}`,
      text: "Email Me"
    },
    {
      label: "CV",
      href: siteConfig.resumeUrl,
      text: "Download CV"
    },
    // Append custom links from YAML
    ...homepageYaml.data.contact.items
  ]
};
---
```

### ✅ Step 5: Update about-config.ts

```typescript
import { siteConfig } from "@/site.config";

export const aboutConfig = {
  meta: {
    title: "About",
    description: `About ${siteConfig.fullName}`,
  },
  photo: {
    show: true,
    src: siteConfig.profileImageFull || siteConfig.profileImage,
    alt: `${siteConfig.author} headshot`,
    fullSizeLink: siteConfig.profileImageFull || siteConfig.profileImage,
  },
  content: {
    // Keep narrative content here (prose)
    intro: "Biography introduction...",
    paragraphs: [/* ... */],
  }
};
```

### ✅ Step 6: Update about.astro References

```astro
---
import { siteConfig } from "@/site.config";
import { aboutConfig } from "@/data/about-config";

// Now email, CV come from siteConfig automatically
const tocSections = [
  { title: "Biography", href: "#biography" },
  { title: "Email", href: `mailto:${siteConfig.email}` },
  { title: "Curriculum Vitae", href: siteConfig.resumeUrl }
];
---
```

## Benefits

### ✅ Single Update Point
- Change email in one place → updates everywhere
- Change job title once → reflects across site
- Update CV link → consistent site-wide

### ✅ Type Safety
- TypeScript validates all references
- Catch missing fields at build time
- IDE autocomplete for config values

### ✅ Reduced Maintenance
- No duplicate entries to keep in sync
- Clear hierarchy: data vs. content
- Less risk of inconsistency

### ✅ Clear Separation
- `site.config.ts` = Identity & SEO data (who you are)
- `index.yaml` = Homepage narrative (what you say)
- `about-config.ts` = Biography prose (your story)

## Migration Checklist

- [ ] Add new fields to `SiteConfig` interface
- [ ] Update `site.config.ts` with extended data
- [ ] Simplify `index.yaml` to content-only
- [ ] Update `index.astro` to merge config + content
- [ ] Update `about-config.ts` to reference siteConfig
- [ ] Update `about.astro` references
- [ ] Test all pages render correctly
- [ ] Verify SEO metadata unchanged
- [ ] Update CONTRIBUTING.md with new pattern
- [ ] Remove redundant data from YAML

## Alternative: Environment Variables

For truly sensitive data (API keys), use `.env`:

```bash
# .env
PUBLIC_AUTHOR_EMAIL=n.lane@lse.ac.uk
PUBLIC_ORCID=0000-0003-0884-8418
```

```typescript
// site.config.ts
import { ORCID } from "astro:env/client";

export const siteConfig = {
  // ... other config
  orcid: ORCID,
};
```

**Note:** Only needed for values that vary by environment (dev/prod/staging).

## Final Recommendation

**Proceed with Phase 1-3** to establish `site.config.ts` as single source of truth:

1. Extend type definition
2. Add fields to site.config
3. Update consuming files to reference it
4. Clean up YAML to content-only
5. Remove redundant data

This creates a **maintainable hierarchy** where identity data lives in one place, and content stays in appropriate format (YAML for prose, TypeScript for data).

---

**Estimated Time:** 1-2 hours
**Risk Level:** Low (no breaking changes, just reorganization)
**Testing Required:** Build + manual verification of homepage and about page

