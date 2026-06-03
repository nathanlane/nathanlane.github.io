# nathanlane.github.io

A personal site built with Astro, TypeScript, and TailwindCSS. The site is published on GitHub Pages, uses `https://nathanlane.info` as the public domain, and preserves `https://nathanlane.github.io` as the GitHub Pages origin via equivalent redirects to the canonical site.

## Operating model

- Hosting: GitHub Pages only
- Public domain: `https://nathanlane.info`
- Preserved origin: `https://nathanlane.github.io`
- CMS: Decap CMS for local development only
- Dynamic OG image route: `src/pages/og-image/[...slug].[ext].ts`

## Stack

- Astro v5
- TypeScript
- TailwindCSS with `tailwindcss-fluid-type`
- Astro content collections in `src/content/`
- Biome + Prettier
- Vitest

## Quick start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:4321/`.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local Astro dev server on port 4321 |
| `pnpm build` | Build the static site into `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run Biome linting |
| `pnpm format` | Format code with Biome and Prettier |
| `pnpm format:check` | Check formatting without rewriting files |
| `pnpm check` | Run Astro type and content checks |
| `pnpm validate` | Run lint, format checks, generated-file checks, tests, and build |
| `pnpm test` | Run Vitest in non-watch mode |
| `pnpm cms` | Start the Decap local backend proxy |

## Content and CMS

Public content lives in these collections:

- `src/content/post/` for blog posts
- `src/content/research/` for research pages
- `src/content/projects/` for projects
- `src/content/writing/` for essays and other writing
- `src/content/media/` for media appearances
- `src/content/pages/` for singleton page copy
- `src/content/series/` for post-series metadata

Non-public content lives in `src/content/private-note/`.

For local CMS editing:

```bash
pnpm dev
pnpm cms
```

Then open `http://localhost:4321/admin/index.html`.

The CMS workflow is local-only. The deployed site should not be treated as a production editing surface.

## Documentation

- [Contributing](./CONTRIBUTING.md)
- [Scripts](./scripts/README.md)

Internal docs (deployment, content, typography, assistant workflow) live in the private companion repo at `.private/docs/`.

## Deployment summary

Deployment is GitHub Pages only. `main` is the publishing branch and `.github/workflows/deploy.yml` performs the build. The `nathanlane.info` custom domain is bound through the repo's **GitHub Pages settings** (Settings → Pages), not through a `CNAME` file — the workflow-based Pages setup ignores a root `CNAME`. See `.private/docs/deployment.md` for details.

The custom domain is the public-facing canonical identity. The GitHub Pages origin still matters operationally and should preserve equivalent paths by redirecting to the canonical site. Keep normal page links and assets relative or root-relative rather than hardcoding either domain into page content.
