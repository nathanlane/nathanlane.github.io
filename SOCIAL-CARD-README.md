# Social Card Generation

The site expects a committed `social-card.png` file in the public directory for Open Graph and Twitter cards.

`public/social-card.svg` is the editable source. `public/social-card.png` is generated from that SVG and checked by the validation workflow.

## Generate or check the PNG

```bash
pnpm run generate:social-card
```

To verify that the committed PNG matches the SVG source:

```bash
pnpm run check:social-card
```

## Design Notes
- Dimensions: 1200x630 pixels (standard OG image size)
- Features the site owner’s current name, title, institution, and domain
- Uses site's color scheme (#224d67)
- Keeps the existing visual language without redesigning the card
