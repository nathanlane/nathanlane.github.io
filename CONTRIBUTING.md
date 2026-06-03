# Contributing

This repository is maintained as a static Astro site deployed on GitHub Pages. Keep changes small, verify them locally, and prefer updating the focused doc for a topic instead of duplicating instructions across multiple files.

## Setup

```bash
pnpm install
git config core.hooksPath .githooks
pnpm dev
```

The dev server runs at `http://localhost:4321/`.

The `git config` step activates the hooks in `.githooks/` — a pre-push validation hook and
a pre-commit hook that blocks accidental commits of local-only agentic files (`AGENTS.md`,
`CLAUDE.md`, `.claude/`). This is a per-clone local setting; it is not stored in the repo.

## Branching and deployment

- `main` is the deploy branch for GitHub Pages.
- Use a feature branch for discrete work. If you maintain a long-lived personal branch such as `private-dev`, rebase or merge it regularly from `main`.
- Do not document or add Netlify-specific deployment steps. GitHub Pages is the active platform.

## Before you merge

Run the checks that apply to your change:

```bash
pnpm validate
pnpm preview
```

At minimum:

- `pnpm validate` should pass
- `pnpm preview` should be used for visual checks when layout, content, or metadata changes
- UI or content changes should be checked in both light and dark themes
- Typography changes should be checked on mobile and desktop widths

## Content work

- Add or edit entries in `src/content/`
- Follow the collection rules in [docs/content.md](./docs/content.md)
- Use root-relative links for internal navigation and assets
- Do not hardcode `nathanlane.info` or `nathanlane.github.io` into normal page body copy unless the URL itself is the subject of the content

## CMS workflow

The supported CMS workflow is local only:

```bash
pnpm dev
pnpm cms
```

Then open `http://localhost:4321/admin/index.html`.

Do not treat `/admin/` on the deployed site as a production editing surface.

## Documentation rules

- Keep [README.md](./README.md) short and operational
- Internal docs (deployment, content, typography, assistant workflow) live in `.private/docs/`
- Update the relevant doc in `.private/docs/` when a workflow or convention changes
- `AGENTS.md` and `CLAUDE.md` are generated from `.private/docs/assistant-workflow.md` — run `pnpm run generate:assistant-docs` after updating that source

If a file path, command, or workflow changes, update the authoritative doc in the same change.
