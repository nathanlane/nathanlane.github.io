#!/usr/bin/env bash
#
# sync-main.sh — sync local `main` with origin and prune merged feature branches.
#
# Run this after a PR is merged on GitHub. It fast-forwards local main, prunes
# stale remote-tracking refs, and deletes local branches whose upstream was
# deleted on the remote (the reliable signal after a squash-merge + branch
# delete). Squash-merged branches aren't recognized as "merged" by `git -d`, so
# gone branches are force-deleted — the deleted SHA is printed for reflog
# recovery. Branches that still track a live remote (e.g. origin/main) are left
# untouched.
#
# Written for bash 3.2 (macOS default): no mapfile/readarray.
set -euo pipefail

if [ -n "$(git status --porcelain)" ]; then
	echo "✗ Working tree not clean. Commit or stash your changes first." >&2
	exit 1
fi

git switch main
git pull --ff-only
git fetch --prune

gone=$(git for-each-ref --format '%(refname:short) %(upstream:track)' refs/heads |
	awk '$2 == "[gone]" { print $1 }')

if [ -z "$gone" ]; then
	echo "✓ main up to date. No branches with a deleted upstream to prune."
	exit 0
fi

count=0
echo "Pruning branch(es) whose remote was deleted:"
while IFS= read -r b; do
	[ -z "$b" ] && continue
	sha=$(git rev-parse --short "$b")
	git branch -D "$b" >/dev/null
	echo "  ✓ deleted $b (was $sha — recover with: git branch $b $sha)"
	count=$((count + 1))
done <<<"$gone"
echo "✓ Done. Pruned $count branch(es)."
