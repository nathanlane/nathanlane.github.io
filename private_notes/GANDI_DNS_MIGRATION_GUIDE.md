# Gandi DNS to GitHub Pages Migration Guide

## Step 1: Prepare GitHub Pages

First, let's create the CNAME file in your repository:

```bash
# This tells GitHub Pages which domain to serve
echo "nathanlane.info" > CNAME
echo "www.nathanlane.info" >> CNAME
```

## Step 2: Configure DNS in Gandi

### A. Login to Gandi
1. Go to https://admin.gandi.net
2. Navigate to "Domain" section
3. Click on `nathanlane.info`
4. Go to "DNS Records" tab

### B. Delete Existing Records
Remove any existing records pointing to Squarespace:
- Delete A records pointing to Squarespace IPs
- Delete CNAME records pointing to Squarespace domains

### C. Add GitHub Pages Records

Add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 300 |
| A | @ | 185.199.109.153 | 300 |
| A | @ | 185.199.110.153 | 300 |
| A | @ | 185.199.111.153 | 300 |
| CNAME | www | nathanlane.github.io. | 300 |

**Important**: 
- The `@` symbol represents the root domain (nathanlane.info)
- Include the trailing dot after `nathanlane.github.io.`
- TTL 300 (5 minutes) allows faster updates during migration

### D. Save Changes
Click "Save" or "Apply changes" in Gandi's interface

## Step 3: Configure GitHub Repository

1. Go to your repository settings: https://github.com/nathanlane/nathanlane.github.io/settings
2. Scroll to "Pages" section
3. Under "Custom domain", enter: `nathanlane.info`
4. Check "Enforce HTTPS" (may take a few minutes to become available)

## Step 4: Wait for DNS Propagation

- **Time**: 5 minutes to 48 hours (usually within 1-2 hours)
- **Check progress**: https://www.whatsmydns.net
- **Test**: Try visiting https://nathanlane.info

## Step 5: SEO & Google Migration

### A. Google Search Console

1. **Add new property** for GitHub Pages:
   - Go to https://search.google.com/search-console
   - Add property: `nathanlane.info` (if not already added)
   - Verify ownership (DNS TXT record or HTML file)

2. **Submit new sitemap**:
   - In Search Console, go to "Sitemaps"
   - Submit: `https://nathanlane.info/sitemap.xml`

3. **Monitor for issues**:
   - Check "Coverage" report for any errors
   - Monitor "Core Web Vitals"

### B. Update Your Sitemap

Ensure your sitemap.xml is properly generated:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nathanlane.info/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://nathanlane.info/about/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Add all your pages -->
</urlset>
```

### C. 301 Redirects for SEO

Your `_redirects` file handles old URLs:
```
/home              /                    301
/bio               /about/              301
```

### D. Update External Links

Update links on:
- [ ] Social media profiles
- [ ] Academic profiles
- [ ] Email signatures
- [ ] Business cards
- [ ] CV/Resume

### E. Analytics Setup

1. **Add Google Analytics** to your base layout:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

2. **Set up Google Analytics 4**:
   - Create new GA4 property
   - Link to Search Console

## Step 6: Post-Migration Checklist

### Immediate (After DNS propagates):
- [ ] Test https://nathanlane.info loads correctly
- [ ] Test www.nathanlane.info redirects properly
- [ ] Test old URLs (/home, /bio) redirect
- [ ] Verify HTTPS certificate is active

### Within 1 Week:
- [ ] Cancel Squarespace subscription
- [ ] Monitor Search Console for crawl errors
- [ ] Check that Google is indexing new pages
- [ ] Verify analytics is tracking

### Within 1 Month:
- [ ] Monitor search rankings
- [ ] Check for 404 errors in analytics
- [ ] Ensure all old URLs are redirecting
- [ ] Update any missed external links

## Troubleshooting

### If site doesn't load:
1. Check DNS propagation: https://www.whatsmydns.net
2. Verify CNAME file exists in repo
3. Check GitHub Pages settings
4. Clear browser cache

### If HTTPS doesn't work:
1. Wait 15 minutes after DNS setup
2. Remove and re-add custom domain in GitHub settings
3. Check for mixed content warnings

### If redirects don't work:
1. Ensure `_redirects` file is in `public/` folder
2. Check file is included in build
3. Test with curl: `curl -I https://nathanlane.info/home`

## Timeline

- **Day 1**: Update DNS, configure GitHub
- **Day 1-2**: DNS propagates, test site
- **Day 3-7**: Monitor SEO, fix any issues
- **Week 2**: Cancel Squarespace
- **Month 1**: Monitor search rankings

Remember: Keep Squarespace active until you're 100% sure everything is working!