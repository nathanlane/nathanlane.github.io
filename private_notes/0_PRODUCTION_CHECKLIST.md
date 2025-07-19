# Pre-Launch Website Audit Prompt & Checklist

## Audit Prompt for Claude/AI Assistant

```
I need a comprehensive pre-launch audit of my typographic-centric Astro website. Please analyze the following and provide specific, actionable feedback:

1. **Typography & Hierarchy Audit**
   - Check all text elements follow the modular scale (1.25 ratio, steps -2 to 6)
   - Verify baseline grid alignment (6px grid unit, 24px baseline)
   - Confirm font loading strategy is implemented
   - Check line lengths are 50-75 characters for optimal reading
   - Validate all OpenType features are enabled (kerning, ligatures)

2. **Design System Compliance**
   - Verify spacing uses only defined tokens (--space-1 through --space-24)
   - Check that minimal boxes/containers are used (typography-first approach)
   - Confirm generous whitespace implementation
   - Validate monochrome color scheme adherence

3. **Content Structure Review**
   - Garden entries follow specified templates (standard/compact)
   - Movement titles use correct typography (Newsreader, -0.025em tracking)
   - Archive items maintain consistent formatting
   - Methods interludes properly styled (italic, borders)

4. **Technical Implementation**
   - All fonts self-hosted via @fontsource
   - Fluid typography working across 320px-1280px range
   - No heavy dependencies beyond core stack
   - CSS variables properly scoped and named

5. **Navigation & IA**
   - Simple text links, no hamburger menus
   - Clear content hierarchy
   - Breadcrumbs only where necessary
   - 2-3 essential header links maximum

Please provide:
- Critical issues that must be fixed before launch
- Medium priority improvements
- Nice-to-have enhancements
- Any accessibility concerns
```

## Manual Pre-Deployment Checklist

### 🔧 Build & Technical Checks

- [ ] **Clean Build Test**
  ```bash
  rm -rf dist/ node_modules/ .astro/
  pnpm install
  pnpm run build
  ```

- [ ] **Linting Passes**
  ```bash
  pnpm run lint        # ESLint for JS/TS
  pnpm run format      # Prettier formatting
  pnpm run check       # Astro checker
  # If the steps required editing, run again.
  ```

- [ ] **Bundle Size Check**
  ```bash
  pnpm run build
  # Check dist/ folder size < 1MB for fonts
  # Check JS bundle < 100KB
  ```

- [ ] **Lighthouse Audit**
  ```bash
  pnpm run preview
  # Run Lighthouse: Performance > 95, Accessibility = 100
  ```

### 📐 Typography & Design System

- [ ] **Font Loading**
  - [ ] FOUT/FOIT strategy implemented
  - [ ] Fallback fonts match metrics
  - [ ] Variable fonts subset properly
  - [ ] woff2 format prioritized

- [ ] **Modular Scale Verification**
  - [ ] All type sizes match scale (0.64rem to 2.80rem)
  - [ ] No arbitrary font sizes
  - [ ] Line heights follow spec (1.2-1.6)

- [ ] **Baseline Grid**
  - [ ] All vertical spacing = multiples of 6px
  - [ ] Text blocks align to 24px baseline
  - [ ] Images/media respect grid

- [ ] **Content Width**
  - [ ] Max line length ~65ch for body text
  - [ ] Consistent margins/padding
  - [ ] Mobile-first responsive behavior

### 🎨 Visual QA

- [ ] **Cross-Browser Testing**
  - [ ] Chrome/Edge latest
  - [ ] Firefox latest
  - [ ] Safari latest
  - [ ] Mobile Safari (iOS)
  - [ ] Chrome Mobile (Android)

- [ ] **Responsive Behavior**
  - [ ] 320px minimum (iPhone SE)
  - [ ] 768px tablet
  - [ ] 1280px desktop
  - [ ] 1920px large screens
  - [ ] No horizontal scroll at any size

- [ ] **Dark Mode** (if implemented)
  - [ ] Contrast ratios maintained
  - [ ] No color bleeding
  - [ ] System preference respected

### ♿ Accessibility

- [ ] **WCAG 2.1 AA Compliance**
  - [ ] Color contrast > 4.5:1 (normal text)
  - [ ] Color contrast > 3:1 (large text)
  - [ ] Focus indicators visible
  - [ ] Keyboard navigation works

- [ ] **Screen Reader Testing**
  - [ ] Semantic HTML structure
  - [ ] ARIA labels where needed
  - [ ] Skip navigation link
  - [ ] Heading hierarchy logical

- [ ] **Performance Accessibility**
  - [ ] No autoplay media
  - [ ] Reduced motion respected
  - [ ] Images have alt text
  - [ ] Links have descriptive text

### 📝 Content Audit

- [ ] **Metadata**
  - [x] Page titles unique and descriptive (≤60 chars)
  - [x] Meta descriptions written
  - [x] Homepage has specific description
  - [x] OG tags for social sharing configured
  - [ ] social-card.png generated from SVG template
  - [ ] Favicon in multiple sizes (16x16, 32x32, 192x192, 512x512)

- [ ] **Content Review**
  - [x] No Lorem ipsum (removed from 3 files)
  - [ ] No broken links
  - [ ] Images optimized (77 images >100KB, 9 critical >1MB)
  - [x] No placeholder content

- [ ] **Error Pages**
  - [x] 404 page professionally styled
  - [x] Error messages helpful and friendly
  - [x] Clear navigation back to home
  - [x] "Go Back" button functionality

### 🖼️ Asset Optimization (Remaining Tasks)

- [ ] **Social Card Generation**
  - [ ] Convert social-card.svg to social-card.png (1200x630px)
  - [ ] Place in public/ directory
  - [ ] Test with social media validators
  - [ ] Instructions: See `public/SOCIAL-CARD-README.md`

- [ ] **Favicon Generation**
  - [ ] Generate from icon.svg: 16x16, 32x32, 192x192, 512x512
  - [ ] Create apple-touch-icon.png (180x180)
  - [ ] Place in public/icons/ directory
  - [ ] Instructions: See `public/icons/FAVICON-SETUP.md`

- [ ] **Image Optimization**
  - [ ] Optimize 9 critical images >1MB
  - [ ] Compress 77 images >100KB
  - [ ] Target: <100KB for web images
  - [ ] Priority files:
    - microfilmhistory.jpg (5.8MB)
    - bigbox.jpg (5.3MB)
    - annamcochinchina.png (2.4MB)
    - ibm360.png (1.9MB)
    - teletype2.jpg (1.4MB)

### 🚀 GitHub Pages Specific

- [ ] **Configuration**
  - [ ] `base` in astro.config.mjs matches repo name
  - [ ] `.nojekyll` file in public/
  - [ ] GitHub Actions workflow configured
  - [ ] CNAME file if custom domain

- [ ] **Build Output**
  - [ ] All URLs relative or use proper base
  - [ ] Assets fingerprinted
  - [ ] No absolute localhost URLs
  - [ ] Sitemap generated

- [ ] **Security**
  - [ ] No API keys in code
  - [ ] No sensitive data exposed
  - [ ] CSP headers considered
  - [ ] HTTPS enforced

### 🎯 Final Checks

- [ ] **Performance Metrics**
  - [ ] First Paint < 1.5s
  - [ ] TTI < 3.5s
  - [ ] No layout shifts
  - [ ] Critical CSS inlined

- [ ] **SEO Basics**
  - [ ] robots.txt present
  - [ ] Sitemap.xml generated
  - [ ] Canonical URLs set
  - [ ] No duplicate content
  - [ ] Test with [metatags.io](https://metatags.io/)
  - [ ] Run [seochecker.io](https://www.seochecker.io/) analysis
  - [ ] [Google Rich Results Test](https://search.google.com/test/rich-results)

- [ ] **User Testing**
  - [ ] Test on real device (not just devtools)
  - [ ] Ask someone to navigate site
  - [ ] Check all interactive elements
  - [ ] Verify form submissions (if any)

## Post-Deployment Verification

Once deployed to GitHub Pages:

1. **Check live URL works**: `https://[username].github.io/[repo]/`
2. **Verify all assets load** (check Network tab)
3. **Test all internal links** (no 404s)
4. **Confirm fonts render correctly**
5. **Mobile check on actual device**
6. **Share link for external feedback**

### Social Media Validation
After deployment, validate social sharing:

- [ ] **Facebook**: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] **Twitter/X**: [Card Validator](https://cards-dev.twitter.com/validator)
- [ ] **LinkedIn**: [Post Inspector](https://www.linkedin.com/post-inspector/)

### SEO Validation Tools
- [ ] **Check meta tags rendering**: View page source for proper tags
- [ ] **Validate structured data**: Inspect JSON-LD scripts
- [ ] **Test OG image**: Ensure social-card.png loads properly

### Quick Manual Validation
- [ ] Homepage loads with correct meta description
- [ ] Navigate to `/nonexistent` to test 404 page
- [ ] All main navigation links work
- [ ] Dark/light theme toggle functions
- [ ] No console errors in browser DevTools

## Emergency Rollback Plan

If issues found post-deployment:
```bash
git revert HEAD
git push origin main
# GitHub Pages will rebuild with previous version
```

---

Remember: Your typography-first, document-centric design means
**content quality and readability are paramount**.
Every technical decision should serve the reading experience.
