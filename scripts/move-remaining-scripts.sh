#!/bin/bash

# Clean up script - removes old scripts from root after manual organization

echo "🧹 Cleaning up old script locations..."

# List of scripts that should have been moved
SCRIPTS_TO_REMOVE=(
    "migrate-jekyll-archive.js"
    "check-truncated-posts.js"
    "fix-truncated-posts.js"
    "mark-old-posts-draft.js"
    "manual-migration-helper.js"
    "validate-content.js"
    "fix-content.js"
    "fix-long-titles.js"
    "find-content-issues.js"
    "diagnose-deps.sh"
    "fix-dependencies.sh"
    "fix-parse5-error.sh"
    "check-titles.sh"
    "quick-fix.sh"
    "batch-migrate.sh"
    "run-migration.js"
    "test-migration.js"
    "organize-scripts.sh"
)

# Remove scripts from root if they exist
for script in "${SCRIPTS_TO_REMOVE[@]}"; do
    if [ -f "$script" ]; then
        echo "Removing $script from root..."
        rm "$script"
    fi
done

# Remove truncation report if exists
[ -f "truncation-report.json" ] && rm truncation-report.json

echo "✅ Cleanup complete!"