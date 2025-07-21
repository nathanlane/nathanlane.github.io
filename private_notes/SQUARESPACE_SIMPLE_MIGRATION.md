# Simple Squarespace to GitHub Pages Migration

Since your Squarespace site only has 2 pages and the content already exists on your GitHub Pages site, this is a straightforward domain migration.

## Migration Steps

### 1. GitHub Pages Setup (One-time)

Create a CNAME file in your repository:
```bash
echo "nathanlane.info" > CNAME
```

### 2. Domain Transfer Steps

#### A. In GitHub Repository Settings:
1. Go to Settings > Pages
2. Under "Custom domain", enter: `nathanlane.info`
3. Check "Enforce HTTPS"

#### B. In your Domain Registrar (not Squarespace):
1. Update DNS records:
   ```
   Type  Name    Value
   A     @       185.199.108.153
   A     @       185.199.109.153
   A     @       185.199.110.153
   A     @       185.199.111.153
   CNAME www     nathanlane.github.io
   ```

2. Remove any existing A or CNAME records pointing to Squarespace

#### C. Wait for DNS Propagation:
- Usually takes 24-48 hours
- Check status at: https://www.whatsmydns.net/

### 3. Verify Redirects Work

The `_redirects` file I created will handle:
- `/home` → `/`
- `/bio` → `/about/`

### 4. Squarespace Shutdown Checklist

Before cancelling Squarespace:
- [ ] Download your headshot image (if you don't have it locally)
- [ ] Export any analytics data you want to keep
- [ ] Save any custom CSS (if any)
- [ ] Note down any SEO settings

### 5. Post-Migration

After domain is working on GitHub Pages:
1. Cancel Squarespace subscription
2. Set up Google Analytics on new site
3. Update any external links pointing to nathanlane.info
4. Submit new sitemap to Google Search Console

## Quick Domain Setup

If you want to set this up right now:

1. **Create CNAME file** (I'll do this for you)
2. **Update DNS** at your registrar
3. **Wait** for propagation
4. **Test** the redirects

## Notes

- No content migration needed since bio content already exists
- Your GitHub Pages site is much more comprehensive
- The redirects will ensure old links don't break
- HTTPS will be automatically enabled by GitHub

Would you like me to create the CNAME file now?