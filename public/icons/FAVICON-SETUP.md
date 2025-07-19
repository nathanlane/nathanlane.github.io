# Favicon Setup Guide

The site has a base `icon.svg` file but needs additional sizes for comprehensive browser support.

## Current Status
- ✅ `/icon.svg` - Base SVG icon (works in modern browsers)
- ✅ `/favicon-32x32.png` - Generated at build time
- ✅ `/icons/apple-touch-icon.png` - Generated at build time
- ✅ `/manifest.webmanifest` - Generated at build time

## Files That Should Be Created

### For Complete Browser Support:
1. **favicon-16x16.png** - 16x16 pixels (browser tabs)
2. **favicon-32x32.png** - 32x32 pixels (browser tabs, high DPI)
3. **favicon-192x192.png** - 192x192 pixels (Android home screen)
4. **favicon-512x512.png** - 512x512 pixels (PWA splash screens)
5. **apple-touch-icon.png** - 180x180 pixels (iOS home screen)

## How to Generate

### Option 1: Online Tool
Use https://realfavicongenerator.net/:
1. Upload the `icon.svg` file
2. Configure colors and settings
3. Download the generated package
4. Place files in `/public/icons/`

### Option 2: Command Line (ImageMagick)
```bash
# From the project root:
mkdir -p public/icons

# Generate PNG versions from SVG
convert -background none -resize 16x16 public/icon.svg public/icons/favicon-16x16.png
convert -background none -resize 32x32 public/icon.svg public/icons/favicon-32x32.png
convert -background none -resize 192x192 public/icon.svg public/icons/favicon-192x192.png
convert -background none -resize 512x512 public/icon.svg public/icons/favicon-512x512.png
convert -background none -resize 180x180 public/icon.svg public/icons/apple-touch-icon.png
```

### Option 3: Manual Process
1. Open `icon.svg` in a vector graphics editor (Illustrator, Inkscape, etc.)
2. Export as PNG at each required size
3. Save in `/public/icons/` directory

## Notes
- The build process (Astro) automatically generates some favicon files
- The SVG favicon works in modern browsers but PNG fallbacks ensure compatibility
- The manifest.webmanifest file is auto-generated and includes icon references