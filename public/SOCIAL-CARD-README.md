# Social Card Generation

The site expects a `social-card.png` file in the public directory for social media sharing (Open Graph and Twitter cards).

## Current Status
- Created `social-card.svg` as a template
- PNG version needs to be generated from the SVG

## To Generate the PNG

### Option 1: Use an online converter
1. Open `public/social-card.svg` in a browser
2. Use a tool like https://cloudconvert.com/svg-to-png
3. Set dimensions to 1200x630 pixels
4. Save as `public/social-card.png`

### Option 2: Use ImageMagick (if installed)
```bash
convert -density 150 public/social-card.svg -resize 1200x630 public/social-card.png
```

### Option 3: Use the included script
```bash
node scripts/generate-social-card.js
```
(Note: This requires additional npm packages to be installed)

## Design Notes
- Dimensions: 1200x630 pixels (standard OG image size)
- Features site owner's name and title
- Uses site's color scheme (#224d67)
- Clean, professional design suitable for academic/professional sharing