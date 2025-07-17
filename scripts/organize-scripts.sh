#!/bin/bash

# Script to organize all utility scripts into proper directories

echo "📁 Organizing scripts..."

# Create directories if they don't exist
mkdir -p scripts/migration
mkdir -p scripts/content  
mkdir -p scripts/maintenance

# Move migration scripts
echo "📦 Moving migration scripts..."
[ -f migrate-jekyll-archive.js ] && mv migrate-jekyll-archive.js scripts/migration/
[ -f check-truncated-posts.js ] && mv check-truncated-posts.js scripts/migration/
[ -f fix-truncated-posts.js ] && mv fix-truncated-posts.js scripts/migration/
[ -f mark-old-posts-draft.js ] && mv mark-old-posts-draft.js scripts/migration/
[ -f manual-migration-helper.js ] && mv manual-migration-helper.js scripts/migration/

# Move content scripts
echo "📝 Moving content scripts..."
[ -f validate-content.js ] && mv validate-content.js scripts/content/
[ -f fix-content.js ] && mv fix-content.js scripts/content/
[ -f fix-long-titles.js ] && mv fix-long-titles.js scripts/content/
[ -f find-content-issues.js ] && mv find-content-issues.js scripts/content/

# Move maintenance scripts
echo "🔧 Moving maintenance scripts..."
[ -f diagnose-deps.sh ] && mv diagnose-deps.sh scripts/maintenance/
[ -f fix-dependencies.sh ] && mv fix-dependencies.sh scripts/maintenance/
[ -f fix-parse5-error.sh ] && mv fix-parse5-error.sh scripts/maintenance/
[ -f check-titles.sh ] && mv check-titles.sh scripts/maintenance/
[ -f quick-fix.sh ] && mv quick-fix.sh scripts/maintenance/

# Move other helper scripts
[ -f batch-migrate.sh ] && mv batch-migrate.sh scripts/migration/
[ -f run-migration.js ] && mv run-migration.js scripts/migration/
[ -f test-migration.js ] && mv test-migration.js scripts/migration/

# Clean up .gitkeep files
rm -f scripts/migration/.gitkeep
rm -f scripts/content/.gitkeep
rm -f scripts/maintenance/.gitkeep

echo "✅ Scripts organized!"
echo ""
echo "📂 Script structure:"
echo "scripts/"
echo "├── migration/      # Jekyll to Astro migration scripts"
echo "├── content/        # Content validation and fixing scripts"
echo "└── maintenance/    # General maintenance scripts"