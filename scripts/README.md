# Scripts

This directory contains active maintenance and validation utilities. Everything here is invoked through `package.json` commands — use those rather than calling scripts directly.

Older one-shot migration tools live in `scripts/archive/` and are not part of the standard workflow.

One exception to "runs from a clean clone": `sync-assistant-docs.mjs` reads its source from the
gitignored `.private/` overlay, so `generate:assistant-docs` and `check:assistant-docs` only work
for contributors who have that companion repo checked out. This is why they are deliberately not
part of `validate` or CI.

`check:social-card` is also deliberately kept out of `validate`, `check:generated`, and CI. The
card's SVG uses system fonts (`Georgia`, `Arial`) that a stock Linux runner lacks, so `resvg`
renders different bytes there than on the committer's machine. The generated PNG is therefore not
byte-reproducible across platforms and a drift check would produce false failures. Regenerate and
review `public/social-card.png` by hand when the SVG source changes.

## Active entrypoints

| Script | Purpose | Command |
| --- | --- | --- |
| `scripts/validation/pre-push-check.js` | Run the full pre-push validation sequence | `pnpm run validate` |
| `scripts/validation/smoke-test.mjs` | Smoke-test rendered pages on a local server or production | `pnpm smoke:local`, `pnpm smoke:prod`, `pnpm smoke -- <url>` |
| `scripts/validation/pages-origin-redirect-smoke.mjs` | Verify `nathanlane.github.io` redirects to the canonical domain without path loss | `pnpm run smoke:pages` |
| `scripts/validation/verify-deploy.sh` | Wait for the latest Pages deploy, then run the live smoke suite | `pnpm run verify:deploy` |
| `scripts/maintenance/generate-cms-config.mjs` | Generate or check the Decap CMS config from the content contract | `pnpm run generate:cms` / `pnpm run check:cms` |
| `scripts/maintenance/generate-katex-assets.mjs` | Generate or check the KaTeX font and CSS assets | `pnpm run generate:katex` / `pnpm run check:katex` |
| `scripts/maintenance/generate-social-card.mjs` | Generate or check `public/social-card.png` from the SVG source | `pnpm run generate:social-card` / `pnpm run check:social-card` |
| `scripts/maintenance/sync-assistant-docs.mjs` | Generate or check the root assistant instruction files from the canonical workflow doc | `pnpm run generate:assistant-docs` / `pnpm run check:assistant-docs` |
| `scripts/maintenance/sync-main.sh` | Fast-forward local `main` and prune branches whose remote was deleted | `pnpm run sync` |

## Validation commands

For day-to-day work, prefer the package scripts:

```bash
pnpm validate
pnpm test
pnpm run smoke:live
```

`pnpm run smoke:live` is fail-fast: it runs the canonical production smoke first, then the Pages-origin redirect smoke only if production passes.

## Archive material

`scripts/archive/` contains historical migration and import helpers. `scripts/archive/legacy/` specifically holds one-shot tools that are no longer maintained — **do not run them** without reading them carefully first.
