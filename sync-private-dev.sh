#!/bin/bash

# Script to sync private-dev branch with main while preserving CLAUDE.md
# Usage: ./sync-private-dev.sh

set -e

echo "🔄 Syncing private-dev branch with main..."

# Ensure we're on private-dev branch
git checkout private-dev

# Stash private files if they have changes
PRIVATE_FILES="CLAUDE.md private_notes/"
if git diff --name-only | grep -E "(CLAUDE.md|private_notes/)" > /dev/null; then
    echo "📝 Stashing private files before sync..."
    git stash push -m "Stash private files before sync" $PRIVATE_FILES
    STASHED_PRIVATE=true
else
    STASHED_PRIVATE=false
fi

# Merge main into private-dev
echo "🔀 Merging main into private-dev..."
git merge main --no-edit

# Restore private files if they were stashed
if [ "$STASHED_PRIVATE" = true ]; then
    echo "📝 Restoring private files..."
    git stash pop
fi

echo "✅ Sync complete! private-dev is now up to date with main."
echo "💡 Your private_notes/ and CLAUDE.md are preserved on this branch."
