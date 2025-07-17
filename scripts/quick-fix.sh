#!/bin/bash

# Quick dependency fix
echo "🔧 Quick dependency fix..."

# Just reinstall with pnpm
pnpm install

# If that doesn't work, try:
# rm -rf node_modules pnpm-lock.yaml
# pnpm install

echo "✅ Done! Try 'pnpm dev' now"