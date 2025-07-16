#!/bin/bash

echo "🔍 Diagnosing dependency issues..."
echo "================================="

# Check node and pnpm versions
echo "📌 Environment:"
echo "Node version: $(node --version)"
echo "pnpm version: $(pnpm --version)"
echo ""

# Check if parse5 is installed
echo "📦 Checking parse5 installation:"
if [ -d "node_modules/.pnpm/parse5@7.3.0" ]; then
    echo "✓ parse5@7.3.0 found"
    echo "Checking entities in parse5:"
    ls -la node_modules/.pnpm/parse5@7.3.0/node_modules/ | grep entities || echo "✗ No entities found"
else
    echo "✗ parse5@7.3.0 not found"
fi
echo ""

# Check entities versions
echo "📦 Checking entities versions:"
find node_modules/.pnpm -name "entities" -type d | head -10
echo ""

# Suggest fix
echo "💡 To fix, run these commands in order:"
echo ""
echo "1. Clean everything:"
echo "   rm -rf node_modules pnpm-lock.yaml"
echo ""
echo "2. Clear pnpm cache:"
echo "   pnpm store prune"
echo ""  
echo "3. Reinstall:"
echo "   pnpm install"
echo ""
echo "4. If still broken, try:"
echo "   pnpm add -D parse5@7.2.1"
echo "   pnpm install"