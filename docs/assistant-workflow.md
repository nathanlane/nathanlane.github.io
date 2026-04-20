# Assistant Workflow

This file is the human-readable reference for assistant behavior in this repository.

## Purpose

Use this document to keep assistant-facing instructions aligned across tools. The root-level instruction files remain the tool entrypoints, but this file should be the concise explanation of how the repo is meant to be worked on.

## Repo assumptions assistants should preserve

- Hosting is GitHub Pages only
- `https://nathanlane.info` is the public-facing domain
- `https://nathanlane.github.io` must keep working as the Pages origin
- The custom domain is bound through GitHub Pages settings; the repo's root `CNAME` file is not authoritative under workflow-based Pages and is not the right thing to edit when the domain misbehaves
- The public visual system is intentionally stable
- Decap CMS is a local contributor workflow, not a production editing surface

## Working style

- Inspect the live repo before making assumptions
- Prefer the repo’s actual commands and paths over historical references
- Keep normal internal links and asset paths relative or root-relative
- Do not introduce Netlify-only operational guidance into active docs
- Update the focused authoritative doc when a workflow changes

## Quick commands

- `pnpm dev` for local development
- `pnpm cms` for the local Decap backend proxy
- `pnpm validate` for the full validation contract
- `pnpm test` for the Vitest suite

## Documentation ownership

Use these files as the default documentation map:

- `README.md` for the short operational overview
- `docs/deployment.md` for hosting and domain behavior
- `docs/content.md` for collections and CMS workflow
- `docs/typography.md` for the visual system
- `scripts/README.md` for supported maintenance scripts

## Sync note

If assistant-facing instructions change, update this file first and then run:

```bash
pnpm run generate:assistant-docs
```

The root `AGENTS.md` and `CLAUDE.md` files are generated outputs and should not be edited by hand.
