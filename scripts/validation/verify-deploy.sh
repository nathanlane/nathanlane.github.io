#!/usr/bin/env bash
#
# verify-deploy.sh — wait for the latest main Pages deploy, then smoke-test prod.
#
# Run this after a merge to main once GitHub Actions has picked up the push. It
# watches the newest `deploy.yml` run on main until it finishes (failing loudly
# if the deploy fails), then runs the live smoke suite (`smoke:prod` followed by
# the Pages-origin redirect smoke). If the run has already completed, `gh run
# watch` returns immediately.
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
	echo "✗ GitHub CLI (gh) is required: https://cli.github.com" >&2
	exit 1
fi

echo "Finding the latest deploy.yml run on main..."
runid=$(gh run list --workflow deploy.yml --branch main --limit 1 --json databaseId -q '.[0].databaseId')

if [ -z "$runid" ]; then
	echo "✗ No deploy.yml run found on main." >&2
	exit 1
fi

echo "Watching deploy run $runid (waits until it finishes)..."
gh run watch "$runid" --exit-status

echo ""
echo "✓ Deploy succeeded. Running live smoke (prod + Pages-origin redirects)..."
pnpm run smoke:live
