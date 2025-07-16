#!/bin/bash

echo "🔧 Fixing dependency issues..."
echo "=============================="

# Remove node_modules and lock files
echo "📦 Cleaning up old dependencies..."
rm -rf node_modules
rm -f pnpm-lock.yaml
rm -f package-lock.json

# Clear pnpm cache
echo "🧹 Clearing pnpm cache..."
pnpm store prune

# Reinstall dependencies
echo "📥 Reinstalling dependencies with pnpm..."
pnpm install

echo ""
echo "✅ Dependencies fixed!"
echo ""
echo "Now try running:"
echo "  pnpm dev"