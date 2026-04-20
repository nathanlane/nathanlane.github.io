# Deployment

## Platform

This site is deployed on GitHub Pages only.

- Build workflow: [deploy.yml](../.github/workflows/deploy.yml)
- Publishing branch: `main`
- Custom domain binding: configured in the repo's **GitHub Pages settings** (Settings → Pages → Custom domain), not in a file in the repo

Because the site is published from a custom GitHub Actions workflow (`actions/deploy-pages`), the custom domain is bound through Pages settings, not through a `CNAME` file in the deployed artifact. A root `CNAME` file may still exist in the repo as historical cleanup, but it is not authoritative and editing it will not fix or break the live binding under this workflow.

Do not add Netlify-specific deployment instructions to the active docs. GitHub Pages is the only active deployment target.

## Domain policy

Two URLs matter:

- Public domain and canonical identity: `https://nathanlane.info`
- Preserved GitHub Pages origin: `https://nathanlane.github.io`

Treat them differently:

- Canonical tags, feeds, and other machine-readable metadata should resolve to the public domain
- The GitHub Pages origin must continue to render the same site without broken navigation or asset paths
- Internal links, image paths, stylesheet paths, and script paths should stay relative or root-relative so the site works from both origins

## Local release check

Before merging to `main`:

```bash
pnpm install
pnpm validate
pnpm preview
```

Confirm at least:

- homepage
- about page
- posts index
- one post
- one research page
- one writing page
- media page

`pnpm validate` is the release gate. It includes linting, format checks, generated-file checks, tests, and build verification.

## GitHub Pages release flow

1. Merge the approved change into `main`.
2. GitHub Actions builds the site and uploads the `dist/` artifact.
3. GitHub Pages deploys that artifact.
4. GitHub serves the site at the Pages origin, and the custom domain continues to point at the same deployment.

If the custom domain stops resolving, check the repo's **GitHub Pages settings** first (Settings → Pages, or `gh api repos/<owner>/<repo>/pages`). That is where the binding lives for this workflow-based setup. A root `CNAME` file is not the control surface.

## Environment variables

Astro documents these optional environment variable names in [astro.config.ts](../astro.config.ts) (examples only; no values are committed to this repo):

- `WEBMENTION_API_KEY`
- `PUBLIC_WEBMENTION_URL`
- `PUBLIC_WEBMENTION_PINGBACK`

These are optional for local development. If they are missing, the site should still build as a static site.

## Deployment guardrails

- Do not introduce base-path assumptions that only work on one origin
- Do not hardcode the custom domain into normal page markup
- Manage the custom domain through GitHub Pages settings, not through the repo's `CNAME` file (workflow-based Pages ignores the file)
- Keep GitHub Pages as the documented deployment target until the platform changes in code and infrastructure, not just in prose
