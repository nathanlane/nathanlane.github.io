#!/bin/bash

echo "🔧 Fixing parse5/entities dependency issue..."
echo "==========================================="

# Clean everything
echo "🧹 Cleaning all caches and modules..."
rm -rf node_modules
rm -rf .pnpm-store
rm -f pnpm-lock.yaml

# Clear global pnpm cache
echo "🧹 Clearing global pnpm cache..."
pnpm store prune

# Install with specific resolution
echo "📦 Installing dependencies with resolutions..."
pnpm install

echo ""
echo "✅ Dependencies should be fixed!"
echo ""
echo "If the error persists, try:"
echo "1. npm install -g pnpm@latest (update pnpm)"
echo "2. Then run this script again"