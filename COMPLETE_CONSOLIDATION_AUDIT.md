# Complete Configuration Consolidation Audit

**Date:** October 15, 2025
**Purpose:** Identify ALL duplicate configuration across the codebase

## Executive Summary

You currently have **8 configuration files** with overlapping responsibilities:

| File | Purpose | Lines | Duplicates |
|------|---------|-------|------------|
| `src/site.config.ts` | Main site config | 126 | Identity, nav, social |
| `src/content/homepage/index.yaml` | Homepage content | 65 | Identity, contact, email, CV |
| `src/data/about-config.ts` | About page | 28 | Images, meta, CV |
| `src/config/navigation.config.ts` | Nav structure | 88 | Menu links, social links |
| `astro.config.ts` | Framework config | 194 | Site URL, metadata |
| `src/content.config.ts` | Content schemas | 294 | ❌ No duplication |
| `src/data/post.ts` | Post utilities | 49 | ❌ No duplication |
| `public/admin/config.yml` | CMS config | ~100 | ❌ No duplication |

**Recommendation:** Consolidate to **3 core files** + schemas

---

## Part 1: Identity & Contact Data

### Current State: Scattered Across 3 Files

#### Duplicated Fields

| Field | site.config.ts | index.yaml | about-config.ts |
|-------|---------------|------------|-----------------|
| **Name/Title** | ✅ "Nathan Lane" | ✅ "Nathan Lane, PhD" | ✅ (in meta) |
| **Email** | ✅ `n.lane@lse.ac.uk` | ✅ `n.lane@lse.ac.uk` | ❌ |
| **Job Title** | ✅ "Assistant Professor" | ✅ "Assistant Professor" | ✅ (in content.intro) |
| **Organization** | ✅ "London School of Economics" | ✅ "London School of Economics" | ✅ (in content.intro) |
| **CV URL** | ✅ `/cv.pdf` | ✅ `/cv.pdf` | ✅ (in content.outro) |
| **Profile Image** | ✅ `/headshot.jpg` | ❌ | ✅ `/headshot.jpg` |
| **Full Image** | ❌ | ❌ | ✅ `/headshot-full.JPG` |
| **ORCID** | ✅ `0000-0003-0884-8418` | ❌ | ❌ |
| **Twitter** | ✅ `@straightedge` | ❌ | ❌ |

**Issue:** Update email in one place → Must update 2+ other files

---

## Part 2: Navigation Links

### Current State: Duplicated Across 2 Files

#### Menu Links (Header Navigation)

**`src/site.config.ts`:**
```typescript
export const menuLinks: { path: string; title: string }[] = [
  { path: "/", title: "Home" },
  { path: "/research/", title: "Research" },
  { path: "/about/", title: "About" },
  { path: "/projects/", title: "Projects" },
];
```

**`src/config/navigation.config.ts`:**
```typescript
header: {
  primary: [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Research", href: "/research" },
    { title: "Writing", href: "/writing" },
    { title: "Media", href: "/media" },
  ],
},
```

**Issue:**
- Different structures: `path` vs `href`
- Different items: `Projects` vs `Writing + Media`
- Unclear which is authoritative

---

## Part 3: Social Links

### Current State: Duplicated Across 2 Files

**`src/site.config.ts`:**
```typescript
export const socialLinks: {
  friendlyName: string;
  isWebmention?: boolean;
  link: string;
  name: string;  // Icon name
  showInHero?: boolean;
  isDownload?: boolean;
}[] = [
  { friendlyName: "Github", link: "...", name: "lucide:github", showInHero: true },
  // ... 8 total links
];
```

**`src/config/navigation.config.ts`:**
```typescript
footer: {
  sections: [
    {
      title: "Elsewhere",
      links: socialLinks
        .filter(social => ["Github", "LinkedIn", "Twitter", "Bluesky"].includes(social.friendlyName))
        .map(social => ({ title: social.friendlyName, href: social.link })),
    },
  ]
}
```

**Status:** ✅ `navigation.config.ts` already imports from `site.config.ts`
**Issue:** Duplication in logic, not data

---

## Part 4: Homepage Content

### Current State: Mix of Data and Content

**`src/content/homepage/index.yaml`:**
```yaml
bio:
  title: Nathan Lane, PhD                     # DUPLICATE (site.config.ts)
  tagline: London School of Economics         # DUPLICATE (site.config.ts)
  narrative: >+                               # ✅ CONTENT ONLY
    I'm an economics professor...
  affiliations:                               # DUPLICATE (site.config.ts)
    - title: London School of Economics
      role: Assistant Professor

contact:
  title: Important Links
  email: n.lane@lse.ac.uk                     # DUPLICATE (site.config.ts)
  items:
    - label: Email
      href: mailto:n.lane@lse.ac.uk           # DUPLICATE
      text: Email Me
    - label: CV
      href: /cv.pdf                           # DUPLICATE
      text: Download CV
    - label: GitHub
      href: https://github.com/nathanlane     # Custom links (OK)
```

**Issue:** Mixing identity data (should be in config) with content (belongs in YAML)

---

## Part 5: About Page Content

### Current State: Some Duplication

**`src/data/about-config.ts`:**
```typescript
export const aboutConfig = {
  meta: {
    title: "About",                          // Generic, OK
    description: "About Nathan Lane, PhD",   // Uses name from...?
  },
  photo: {
    show: true,
    src: "/headshot.jpg",                    // DUPLICATE (site.config.ts)
    alt: "Profile photo",                    // Generic
    fullSizeLink: "/headshot-full.JPG",      // Should be in site.config.ts
  },
  content: {
    intro: "Nathan Lane is an Assistant Professor...",  // DUPLICATE IDENTITY
    paragraphs: [/* Biography prose - OK */],
    outro: {
      linkUrl: "/cv.pdf",                    // DUPLICATE (site.config.ts)
    },
  },
};
```

---

## Part 6: Framework Configuration

### Current State: Minimal Duplication

**`astro.config.ts`:**
```typescript
import { siteConfig } from "./src/site.config";

export default defineConfig({
  site: "https://nathanlane.github.io/",     // ✅ Framework-specific, OK

  webmanifest({
    name: siteConfig.title,                  // ✅ References site.config
    description: siteConfig.description,      // ✅ References site.config
    lang: siteConfig.lang,                    // ✅ References site.config
  }),
});
```

**Status:** ✅ Already consolidated - imports from `site.config.ts`

---

## Consolidation Strategy

### Recommended File Structure

```
┌─────────────────────────────────────────────────────────────┐
│ src/site.config.ts                                          │
│ Single Source of Truth for ALL identity & structure data   │
│ ─────────────────────────────────────────────────────────── │
│ ✅ Identity: name, email, job, org, ORCID, Twitter         │
│ ✅ Resources: CV, images (headshot, full-size)             │
│ ✅ Navigation: menu links, social links                    │
│ ✅ SEO: title, description, locale                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
    ┌─────────────────────┼─────────────────────┐
    ↓                     ↓                     ↓
┌─────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ index.yaml  │  │ about-config.ts  │  │ astro.config.ts  │
│ CONTENT ONLY│  │ BIOGRAPHY PROSE  │  │ FRAMEWORK CONFIG │
│ ────────────│  │ ────────────────│  │ ────────────────│
│ ✅ Bio prose│  │ ✅ Bio paragraphs│  │ ✅ Build settings│
│ ✅ Section  │  │ ✅ Biography     │  │ ✅ Integrations  │
│    config   │  │    narrative     │  │ ✅ Plugins       │
└─────────────┘  └──────────────────┘  └──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ELIMINATE                                                   │
│ ─────────────────────────────────────────────────────────── │
│ ❌ src/config/navigation.config.ts                          │
│    → Move to site.config.ts or eliminate entirely          │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Consolidation Plan

### Phase 1: Extend `site.config.ts`

Add all missing identity and structure fields:

```typescript
// src/site.config.ts
export interface SiteConfig {
  // === IDENTITY ===
  author: string;                    // "Nathan Lane"
  fullName: string;                  // "Nathan Lane, PhD"
  jobTitle: string;                  // "Assistant Professor"
  organization: string;              // "London School of Economics"
  organizationShort: string;         // "LSE"

  // === CONTACT ===
  email: string;                     // "n.lane@lse.ac.uk"

  // === RESOURCES ===
  resumeUrl: string;                 // "/cv.pdf"
  profileImage: string;              // "/headshot.jpg"
  profileImageFull: string;          // "/headshot-full.JPG"

  // === PROFESSIONAL ===
  orcid: string;
  twitterHandle: string;
  socialProfiles: string[];

  // === SITE STRUCTURE ===
  // Keep existing fields...
}

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

  // ... existing fields
};

// Keep navigation in site.config.ts
export const menuLinks = [
  { path: "/", title: "Home" },
  { path: "/research/", title: "Research" },
  { path: "/writing/", title: "Writing" },
  { path: "/about/", title: "About" },
  { path: "/projects/", title: "Projects" },
  { path: "/media/", title: "Media" },
];

export const socialLinks = [
  // ... existing social links
];
```

### Phase 2: Simplify `index.yaml`

Remove ALL identity/contact data, keep ONLY content:

```yaml
# src/content/homepage/index.yaml

# Bio section - CONTENT ONLY
bio:
  narrative: >+
    I'm an economics professor and empirical economist working at the
    intersection of big data, economic development, political economy,
    and industrial economics. Find my [research here](/research/).

    My work has appeared in [The New York Times](...), [The Economist](...),
    and [more](/media/).

    See my work with The [Industrial Policy Group](...), an empirical
    research lab. I'm an affiliate of CESifo research network and a
    cofounder of [Sodalabs.io](https://sodalabs.io).

# Important Links - CUSTOM LINKS ONLY
contact:
  title: Important Links
  items:
    # DO NOT include email, CV, GitHub - auto-generated from site.config
    - label: The Industrial Policy Group
      href: https://industrialpolicygroup.com
      text: industrialpolicygroup.com
    - label: Industrial Policy Data
      href: https://industrialpolicydata.com
      text: industrialpolicydata.com

# Section configuration
sections:
  research:
    title: Research
    itemCount: 3
    viewAllText: View all papers
    viewAllUrl: /research/
  # ... other sections
```

### Phase 3: Update `index.astro`

Merge config + content:

```astro
---
// src/pages/index.astro
import { siteConfig, socialLinks } from "@/site.config";
import { getEntry } from "astro:content";

const homepageYaml = await getEntry("homepage", "index");

// MERGE: Config provides identity, YAML provides content
const bio = {
  title: siteConfig.fullName,              // From TypeScript
  tagline: siteConfig.organization,         // From TypeScript
  narrative: homepageYaml.data.bio.narrative, // From YAML
  affiliations: [
    {
      title: siteConfig.organization,       // From TypeScript
      role: siteConfig.jobTitle,            // From TypeScript
    },
  ],
};

// Auto-generate contact from siteConfig
const contact = {
  title: "Important Links",
  email: siteConfig.email,
  items: [
    // Auto-generated from siteConfig
    {
      label: "GitHub",
      href: socialLinks.find(l => l.friendlyName === "Github")?.link,
      text: "GitHub",
    },
    {
      label: "Email",
      href: `mailto:${siteConfig.email}`,
      text: "Email Me",
    },
    {
      label: "CV",
      href: siteConfig.resumeUrl,
      text: "Download CV",
    },
    // Append custom links from YAML
    ...(homepageYaml.data.contact?.items || []),
  ],
};
---
```

### Phase 4: Simplify `about-config.ts`

Reference siteConfig for ALL identity data:

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
    src: siteConfig.profileImage,
    alt: `${siteConfig.author} headshot`,
    fullSizeLink: siteConfig.profileImageFull,
  },
  content: {
    // Keep ONLY biography prose here
    intro: `${siteConfig.fullName} is an ${siteConfig.jobTitle} at the ${siteConfig.organization} and co-founder of the empirical economics research lab, the Industrial Policy Group, with Dr. Réka Juhász (University of British Columbia).`,

    paragraphs: [
      // Biography paragraphs - pure content
      "His research interests span big data, machine learning...",
      "Dr. Lane's research agenda focuses on establishing...",
      "Dr. Lane is passionate about computational methods...",
    ],

    outro: {
      text: "More info:",
      linkText: "CV",
      linkUrl: siteConfig.resumeUrl,
      suffix: `or get in touch via email at ${siteConfig.email}.`,
    },
  },
};
```

### Phase 5: Eliminate `navigation.config.ts`

This file is redundant - all its data should be in `site.config.ts`:

**Current usage:**
```bash
$ grep -r "navigation.config" src/
src/config/navigation.config.ts:export const navigationConfig = {
# No other files import it!
```

**Action:** Delete `src/config/navigation.config.ts` entirely

**Rationale:**
- Not imported anywhere in codebase
- Duplicates `menuLinks` and `socialLinks` from `site.config.ts`
- Footer already uses `socialLinks` from `site.config.ts`

---

## Migration Checklist

### Step 1: Extend Types
- [ ] Add new fields to `SiteConfig` interface in `src/types.ts`
- [ ] Add `fullName`, `organizationShort`, `profileImageFull`

### Step 2: Update site.config.ts
- [ ] Add new identity fields
- [ ] Consolidate menu links (add Media, Writing if missing)
- [ ] Verify social links are complete

### Step 3: Simplify index.yaml
- [ ] Remove `bio.title` field
- [ ] Remove `bio.tagline` field
- [ ] Remove `bio.affiliations` field
- [ ] Remove `contact.email` field
- [ ] Remove email/CV items from `contact.items`
- [ ] Keep only custom links

### Step 4: Update index.astro
- [ ] Import `siteConfig`
- [ ] Merge bio object from config + YAML
- [ ] Auto-generate contact items from siteConfig
- [ ] Append custom links from YAML

### Step 5: Update about-config.ts
- [ ] Import `siteConfig`
- [ ] Reference `siteConfig` for all identity data
- [ ] Update `content.intro` to use template string
- [ ] Update `content.outro` to reference siteConfig.resumeUrl

### Step 6: Update about.astro
- [ ] Verify references to `siteConfig.email`
- [ ] Verify references to `siteConfig.resumeUrl`

### Step 7: Delete Redundant Files
- [ ] Delete `src/config/navigation.config.ts` (unused)
- [ ] Update any imports (none found in search)

### Step 8: Testing
- [ ] Build site: `pnpm build`
- [ ] Verify homepage renders correctly
- [ ] Verify about page renders correctly
- [ ] Check all links work
- [ ] Verify SEO metadata unchanged
- [ ] Check mobile responsiveness

### Step 9: Documentation
- [ ] Update CONTRIBUTING.md with new pattern
- [ ] Add comments in site.config.ts explaining structure
- [ ] Update relevant documentation files

---

## Benefits Summary

### ✅ Single Source of Truth
**Before:** Change email in 3 places (site.config, index.yaml, contact links)
**After:** Change email in 1 place (site.config)

### ✅ Type Safety
**Before:** YAML has no type checking
**After:** TypeScript validates all references at build time

### ✅ Reduced Maintenance
**Before:** 8 config files with overlapping data
**After:** 3 core files with clear responsibilities

### ✅ Clear Hierarchy
```
site.config.ts     → Identity & structure data
index.yaml         → Homepage narrative content
about-config.ts    → Biography prose
astro.config.ts    → Framework configuration
content.config.ts  → Content schemas (no change)
```

---

## Estimated Impact

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Config files | 8 | 4 | -50% |
| Duplicate fields | 12+ | 0 | -100% |
| Update points for email | 3 | 1 | -66% |
| Lines of config code | ~400 | ~250 | -37% |
| Type safety | Partial | Full | +100% |

---

## Next Steps

1. Review this audit
2. Decide consolidation scope (all at once or phased?)
3. Create implementation tasks
4. Test in development branch
5. Deploy to production

**Estimated Time:** 3-4 hours for complete consolidation
**Risk Level:** Low (no breaking changes, just reorganization)
**Testing Required:** Build + manual verification of all pages

