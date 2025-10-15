# Content Management Consolidation Plan

## 1️⃣ Where MDX/YAML Files Should Live

### **Answer: Create `src/content/pages/` for all static page content**

**Recommended Structure:**
```
src/content/pages/
├── about.mdx         # About page (migrate from about-config.ts)
├── homepage.mdx      # Homepage bio (optional - migrate from index.yaml)
└── ...future pages
```

**Why this location?**
- ✅ Follows Astro content collection pattern
- ✅ Consistent with existing collections (research/, writing/, post/)
- ✅ CMS-friendly (Decap already configured for content/)
- ✅ Industry standard pattern

---

## 2️⃣ Migration Opportunities

### **Current Content Sources (Inconsistent):**

| Content | Current Location | Format | Editing Experience | CMS-Editable |
|---------|-----------------|--------|-------------------|--------------|
| **Homepage Bio** | `src/content/homepage/index.yaml` | YAML | ✅ Good | ✅ Yes |
| **About Page** | `src/data/about-config.ts` | TypeScript | ❌ Poor | ❌ No |
| **Media Items** | `src/data/media.ts` | TypeScript (308 lines) | ❌ Very Poor | ❌ No |
| **Post Utilities** | `src/data/post.ts` | TypeScript | N/A (code) | N/A |

### **Migration Candidates:**

#### **Priority 1: About Page** (Immediate pain point)
- **From**: `src/data/about-config.ts` (42 lines of awkward array strings)
- **To**: `src/content/pages/about.mdx` (natural Markdown prose)
- **Benefit**: Easy editing, Markdown formatting, CMS support
- **Effort**: Low (1 file conversion)

#### **Priority 2: Media Items** (High value)
- **From**: `src/data/media.ts` (308 lines of TypeScript objects)
- **To**: `src/content/media/*.md` (individual media entry files)
- **Benefit**: Add/edit media via CMS, no code editing required
- **Effort**: Medium (need to migrate 50+ media items)

#### **Priority 3: Homepage** (Optional - already good)
- **From**: `src/content/homepage/index.yaml` (already works well)
- **To**: `src/content/pages/homepage.mdx` (for consistency)
- **Benefit**: Unified MDX approach, slightly better Markdown support
- **Effort**: Low, but YAML already works fine

#### **Not Migrating:**
- ✅ `post.ts` - These are utility functions (code, not content)
- ✅ `site.config.ts` - Identity/config data (not prose)

---

## 3️⃣ Detailed Migration Plan

### **Phase 1: Create Pages Collection**
**What**: Set up new `pages` collection for static page content

**Tasks**:
1. Create `src/content/pages/` directory
2. Add `pages` collection schema to `content.config.ts`:
   ```typescript
   const pages = defineCollection({
     loader: glob({ base: "./src/content/pages", pattern: "**/*.mdx" }),
     schema: z.object({
       title: z.string(),
       description: z.string(),
       showPhoto: z.boolean().default(false),
       sections: z.array(z.object({
         title: z.string(),
         id: z.string().optional(),
       })).optional(),
     }),
   });
   ```
3. Export in collections object: `export const collections = { ..., pages }`

4. **Add Decap CMS configuration** to `public/admin/config.yml`:
   ```yaml
   # Static Pages
   - name: "pages"
     label: "Static Pages"
     folder: "src/content/pages"
     create: true
     slug: "{{slug}}"
     extension: "mdx"
     format: "frontmatter"
     fields:
       - { label: "Title", name: "title", widget: "string" }
       - { label: "Description", name: "description", widget: "text" }
       - { label: "Show Photo", name: "showPhoto", widget: "boolean", default: false }
       - label: "Sections"
         name: "sections"
         widget: "list"
         required: false
         fields:
           - { label: "Title", name: "title", widget: "string" }
           - { label: "ID", name: "id", widget: "string", required: false }
       - { label: "Content", name: "body", widget: "markdown" }
   ```

**Effort**: 15 minutes
**Risk**: Low

---

### **Phase 2: Migrate About Page to MDX**
**What**: Convert `about-config.ts` → `about.mdx`

**Tasks**:
1. Create `src/content/pages/about.mdx`:
   ```mdx
   ---
   title: About
   description: About Nathan Lane, PhD
   showPhoto: true
   sections:
     - { title: "Biography", id: "biography" }
     - { title: "Contact", id: "contact" }
   ---

   ## Biography

   **Nathan Lane, PhD** is an Assistant Professor at the London School of Economics
   and co-founder of the empirical economics research lab, the
   [Industrial Policy Group](https://industrialpolicygroup.com/).

   His research interests span:
   - Big data and machine learning
   - Economic development
   - Political economy
   - Industrial economics

   [Content continues naturally in Markdown...]
   ```

2. **Update `src/pages/about.astro`**:
   ```typescript
   // BEFORE
   import { aboutConfig } from "@/data/about-config";
   const { meta, photo, content } = aboutConfig;

   // AFTER
   import { getEntry, render } from "astro:content";
   const aboutPage = await getEntry("pages", "about");
   if (!aboutPage) throw new Error("About page not found");
   const { Content } = await render(aboutPage);
   const { title, description, showPhoto } = aboutPage.data;
   ```

3. **Update about.astro template** to render MDX content:
   ```astro
   <div class="prose prose-lane max-w-none">
     <Content />
   </div>
   ```

4. **⚠️ IMPORTANT: Check for other consumers** of `about-config.ts`:
   - Search codebase for `about-config` imports
   - Verify no components (e.g., BioPanel.astro) depend on it
   - Update any references before deletion

5. Delete `src/data/about-config.ts` (only after verifying no dependencies)

6. Decap CMS already configured (see Phase 1, step 4)

**Effort**: 30 minutes
**Lines Saved**: ~42 lines (about-config.ts)
**Benefit**: Natural prose editing, CMS support

**Verification Checklist**:
- [ ] About page renders correctly at `/about/`
- [ ] Photo displays if `showPhoto: true`
- [ ] MDX content renders with proper typography
- [ ] No broken imports or references to old config
- [ ] CMS can edit `pages/about.mdx` successfully

---

### **Phase 3: Migrate Media to Content Collection**
**What**: Convert `media.ts` → individual media entry files

**Current**: 308-line TypeScript file with 50+ media items
**Target**: Individual markdown files per media item

**Approach A - Individual Files (Recommended)**:

**File Naming Convention** (for ordering):
```
src/content/media/
├── 2025-07-20-industrial-policy-competition.md
├── 2025-03-13-europe-military-defense.md
├── 2024-05-04-financial-times-industrial-policy.md
└── ...
```
Format: `YYYY-MM-DD-slug.md` (date prefix ensures chronological ordering)

Each file:
```md
---
title: "The Relationship Between Competition Policy and Industrial Policy"
outlet: Intereconomics
date: 2025-07-20
type: article
link: https://www.intereconomics.eu/...
description: Analysis of the evolving relationship...
order: 1  # Optional: manual ordering override
featured: false  # Optional: feature on homepage
---

Optional additional content here...
```

**Schema** (`content.config.ts`):
```typescript
const media = defineCollection({
  loader: glob({ base: "./src/content/media", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    outlet: z.string(),
    date: z.string(), // YYYY-MM-DD format
    type: z.enum(["interview", "podcast", "video", "article", "press", "talk", "panel"]),
    link: z.string().url(),
    description: z.string().optional(),
    order: z.number().optional(), // Manual ordering override
    featured: z.boolean().default(false),
  }),
});
```

**Tasks**:
1. Create `media` collection schema in `content.config.ts`
2. Create migration script to convert `media.ts` → individual `.md` files:
   ```typescript
   // scripts/migrate-media.ts
   // - Loop through mediaData object
   // - Generate filename: `${date}-${slugify(title)}.md`
   // - Write frontmatter + empty body
   ```
3. **Update page queries** to handle ordering:
   ```typescript
   // Sort by date (descending), then by optional order field
   const allMedia = await getCollection("media");
   const sortedMedia = allMedia.sort((a, b) => {
     const dateCompare = new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf();
     if (dateCompare !== 0) return dateCompare;
     return (b.data.order || 0) - (a.data.order || 0);
   });
   ```
4. Update `MediaList.astro` and `index.astro` to use `getCollection("media")`
5. **Add Decap CMS collection**:
   ```yaml
   - name: "media"
     label: "Media & Press"
     folder: "src/content/media"
     create: true
     slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
     fields:
       - { label: "Title", name: "title", widget: "string" }
       - { label: "Outlet", name: "outlet", widget: "string" }
       - { label: "Date", name: "date", widget: "date", format: "YYYY-MM-DD" }
       - { label: "Type", name: "type", widget: "select", options: ["interview", "podcast", "video", "article", "press", "talk", "panel"] }
       - { label: "Link", name: "link", widget: "string" }
       - { label: "Description", name: "description", widget: "text", required: false }
       - { label: "Featured", name: "featured", widget: "boolean", default: false }
       - { label: "Content", name: "body", widget: "markdown", required: false }
   ```
6. Delete old `src/data/media.ts` after migration
7. **Update `@/data/media` exports** if used elsewhere (create compatibility layer)

**Effort**: 2-3 hours (includes migration script)
**Lines Saved**: 308 lines from media.ts
**Benefit**:
- Add media via CMS instead of editing code
- Easier to maintain/update individual items
- Can add full content per media item (not just metadata)
- Chronological ordering via filename convention
- Manual override via optional `order` field

**Ordering Strategy Notes**:
- **Primary**: Date-based (filename prefix `YYYY-MM-DD`)
- **Secondary**: Optional `order` field for manual overrides
- **Query pattern**: Sort by date DESC, then by order field
- **CMS slug**: Auto-generates `{{year}}-{{month}}-{{day}}-{{slug}}`

**Approach B - YAML (Simpler but less flexible)**:
Keep single file, convert to YAML like homepage. Less work but doesn't solve the editing problem as well.

---

### **Phase 4: Optional Homepage Migration**
**What**: Convert `homepage/index.yaml` → `pages/homepage.mdx`

**Only do this if you want full MDX consistency**

**Tasks**:
1. Create `src/content/pages/homepage.mdx`
2. Update `index.astro` to use `getEntry("pages", "homepage")`
3. Delete `homepage/` collection
4. Update Decap CMS config

**Effort**: 30 minutes
**Benefit**: Consistency (all pages use MDX)
**Downside**: YAML already works fine, maybe not worth it

---

## 4️⃣ Recommended Implementation Order

### **Option A: Full Migration (Most Consistent)**
1. ✅ Create pages collection
2. ✅ Migrate About → MDX
3. ✅ Migrate Media → Collection
4. ✅ Migrate Homepage → MDX (optional)

**Total Effort**: 4-5 hours
**Lines Saved**: ~350+ lines
**Benefit**: Maximum consistency, best editing experience

---

### **Option B: Pragmatic Approach (Quick Wins)**
1. ✅ Create pages collection
2. ✅ Migrate About → MDX (fixes immediate pain point)
3. ⏸️ Leave Media as-is (or migrate later)
4. ⏸️ Leave Homepage as YAML (already works)

**Total Effort**: 1 hour
**Lines Saved**: ~42 lines
**Benefit**: Solves the About page editing problem now, can do more later

---

## 5️⃣ My Recommendation: **Option B (Pragmatic)**

**Rationale**:
- **About page is the immediate pain point** - fix it now
- **Homepage YAML works fine** - if it ain't broke...
- **Media migration is high effort** - do it when you need to add media frequently

**Start with**: About page migration (Phase 1 + Phase 2)
**Later**: Migrate media when editing pain becomes acute

---

## Summary

### Question 1: Where should MDX/YAML live?
**Answer**: `src/content/pages/` for static pages (about, homepage, etc.)

### Question 2: What else can migrate?
**Answer**:
- ✅ About page (immediate benefit)
- ✅ Media items (high value, medium effort)
- ⏸️ Homepage (low value - already good)

### Question 3: What's the plan?
**Answer**: Start with pages collection + About migration (1 hour), then evaluate if media migration is worth the effort.

---

## Editing Experience Comparison

### Current (TypeScript) - Awkward 😫
```typescript
paragraphs: [
  "His research interests span big data, machine learning, economic development, political economy, and industrial economics. Before joining the LSE, Dr. Lane was an Assistant Professor at the University of Oxford...",
  "Dr. Lane's research agenda focuses on establishing fundamental facts about economic change...",
]
```

### Proposed (MDX) - Natural ✨
```markdown
His research interests span big data, machine learning, economic development,
political economy, and industrial economics. Before joining the LSE, Dr. Lane
was an Assistant Professor at the University of Oxford...

Dr. Lane's research agenda focuses on establishing fundamental facts about
economic change...
```

---

## Next Steps

**Ready to proceed with Option B (About page migration)?**

1. Create pages collection schema
2. Convert about-config.ts to about.mdx
3. Update about.astro page route
4. Configure Decap CMS for pages editing
5. Test and verify
6. Delete old about-config.ts

**Estimated time**: 1 hour
**Impact**: Significantly better content editing experience
