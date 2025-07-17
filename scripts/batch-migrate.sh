#!/bin/bash

# Jekyll to Astro Batch Migration Script

echo "🚀 Starting Jekyll to Astro migration..."
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the nathanlane.github.io directory"
    echo "Please run this script from the root of your Astro project"
    exit 1
fi

# Check if gray-matter is installed
if ! npm list gray-matter >/dev/null 2>&1; then
    echo "📦 gray-matter is already installed"
fi

# Run the migration
echo ""
echo "📄 Running migration script..."
node migrate-jekyll-archive.js

echo ""
echo "✅ Migration attempt complete!"
echo ""
echo "Next steps:"
echo "1. Check src/content/post/ for migrated posts"
echo "2. Check public/images/blog/ for migrated images" 
echo "3. Run 'pnpm dev' to test the site"
echo "4. Review and update any posts as needed"