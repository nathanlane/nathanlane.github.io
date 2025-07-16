#!/bin/bash

# Script to sync private-dev branch with main while preserving CLAUDE.md
# Usage: ./sync-private-dev.sh

set -e

echo "🔄 Syncing private-dev branch with main..."

# Ensure we're on private-dev branch
git checkout private-dev

# Stash CLAUDE.md if it has changes
if git diff --name-only | grep -q "CLAUDE.md"; then
    echo "📝 Stashing CLAUDE.md changes..."
    git stash push -m "Stash CLAUDE.md before sync" CLAUDE.md
    STASHED_CLAUDE=true
else
    STASHED_CLAUDE=false
fi

# Merge main into private-dev
echo "🔀 Merging main into private-dev..."
git merge main --no-edit

# Restore CLAUDE.md if it was stashed
if [ "$STASHED_CLAUDE" = true ]; then
    echo "📝 Restoring CLAUDE.md changes..."
    git stash pop
fi

echo "✅ Sync complete! private-dev is now up to date with main."
echo "💡 Your CLAUDE.md is preserved on this branch."
