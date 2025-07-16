# Dependency Fix for parse5/entities Error

## The Problem
The error `Package subpath './escape' is not defined by "exports"` is caused by a version mismatch between parse5 and entities packages.

## Quick Solution

Run these commands in order:

```bash
cd /Users/nathanlane/code/nathanlane.github.io

# 1. Clean everything
rm -rf node_modules pnpm-lock.yaml .pnpm-store

# 2. Clear global pnpm cache
pnpm store prune

# 3. Reinstall dependencies
pnpm install

# 4. Try running dev server
pnpm dev
```

## If That Doesn't Work

Try using npm instead temporarily:

```bash
# Remove pnpm files
rm -rf node_modules pnpm-lock.yaml

# Install with npm
npm install

# Run with npm
npm run dev
```

## Alternative Solution

If you need to work immediately, you can use the working lanewebsite directory:

```bash
cd /Users/nathanlane/code/lanewebsite
pnpm dev
```

The migrated posts can be copied from nathanlane.github.io to lanewebsite:

```bash
# Copy migrated posts
cp /Users/nathanlane/code/nathanlane.github.io/src/content/post/*.md /Users/nathanlane/code/lanewebsite/src/content/post/
```

## Root Cause
This is a known issue with Astro and certain dependency versions. The Astro team is aware and working on fixes in future versions.