# Scripts

This directory contains a mix of active maintenance utilities and older migration material. Use the active entrypoints below for routine work, and treat `scripts/archive/` as historical reference rather than part of the normal workflow.

## Active entrypoints

| Script | Purpose | Typical use |
| --- | --- | --- |
| `scripts/validation/pre-push-check.js` | Run the current pre-push validation sequence | `pnpm run pre-push` |
| `scripts/validation/smoke-test.mjs` | Smoke-test rendered pages on a local preview server or the canonical production domain | `pnpm smoke:local`, `pnpm smoke:prod`, or `pnpm smoke -- http://localhost:<port>` |
| `scripts/validation/pages-origin-redirect-smoke.mjs` | Verify that `nathanlane.github.io` redirects representative paths to the canonical site without path loss | `pnpm run smoke:pages`; also runs after `smoke:prod` in fail-fast `pnpm run smoke:live` |
| `scripts/maintenance/generate-cms-config.mjs` | Generate or check the Decap CMS config from the shared content contract | `pnpm run generate:cms` or `pnpm run check:cms` |
| `scripts/maintenance/generate-social-card.mjs` | Generate or check `public/social-card.png` from the SVG source | `pnpm run generate:social-card` or `pnpm run check:social-card` |
| `scripts/maintenance/sync-assistant-docs.mjs` | Generate or check the root assistant instruction files from the canonical workflow doc | `pnpm run generate:assistant-docs` or `pnpm run check:assistant-docs` |
| `scripts/diagnose-deps.sh` | Quick dependency and environment diagnostics | `./scripts/diagnose-deps.sh` |
| `scripts/find-content-issues.js` | Scan content for frontmatter or quality issues | `node scripts/find-content-issues.js` |
| `scripts/fix-content.js` | Apply automatic fixes to common content issues | `node scripts/fix-content.js` |
| `scripts/fix-long-titles.js` | Shorten overlong titles in content files | `node scripts/fix-long-titles.js` |
| `scripts/check-truncated-posts.js` | Detect suspiciously truncated migrated posts | `node scripts/check-truncated-posts.js` |
| `scripts/fix-truncated-posts.js` | Repair posts identified as truncated | `node scripts/fix-truncated-posts.js` |
| `scripts/mark-old-posts-draft.js` | Batch-mark older posts as drafts | `node scripts/mark-old-posts-draft.js` |
| `scripts/manual-migration-helper.js` | Inspect migrated content manually | `node scripts/manual-migration-helper.js` |

## Validation commands

For day-to-day work, prefer the package scripts first:

```bash
pnpm validate
pnpm run pre-push
pnpm test
pnpm run smoke:live
```

`pnpm run smoke:live` is fail-fast: it runs the canonical production smoke first, then runs the Pages-origin redirect smoke only if production smoke passes.

## Archive material

`scripts/archive/` contains older migration and import helpers. They are useful for forensic or one-off maintenance work, but they are not part of the standard contributor workflow.

If you reuse one of those scripts, verify paths and assumptions first. Many of them were written for earlier migration phases.
