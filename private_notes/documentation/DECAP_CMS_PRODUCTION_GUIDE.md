# Decap CMS Production Setup Guide for GitHub Pages

This guide provides comprehensive instructions for setting up Decap CMS (formerly Netlify CMS) in production on GitHub Pages.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [GitHub OAuth App Setup](#github-oauth-app-setup)
4. [Netlify Identity Service Setup](#netlify-identity-service-setup)
5. [Configuration Updates](#configuration-updates)
6. [Deployment Steps](#deployment-steps)
7. [User Management](#user-management)
8. [Security Considerations](#security-considerations)
9. [Troubleshooting](#troubleshooting)
10. [Alternative Authentication Methods](#alternative-authentication-methods)

---

## Overview

Decap CMS requires an authentication backend for production use. Since GitHub Pages is a static hosting service, you'll need to use one of these authentication methods:

1. **Netlify Identity** (free tier available) - Recommended for simplicity
2. **GitHub OAuth with External Service** - More complex but fully self-hosted
3. **Self-hosted OAuth Proxy** - Most control but requires additional infrastructure

This guide covers all three methods with a focus on the Netlify Identity approach.

---

## Prerequisites

- GitHub repository with your Astro site
- GitHub Pages enabled and working
- Admin access to create GitHub OAuth Apps
- (Optional) Netlify account for Identity service

---

## GitHub OAuth App Setup

### Method 1: Using Netlify Identity (Recommended)

1. **Create a Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up for a free account
   - You don't need to deploy your site to Netlify

2. **Enable Identity Service**
   - Create a new Netlify site (even if not deploying there)
   - Go to **Site settings** → **Identity**
   - Click **Enable Identity**

3. **Configure Identity Settings**
   - Under **Registration preferences**, choose:
     - **Open** - Anyone can sign up (not recommended)
     - **Invite only** - You control who can access (recommended)
   - Under **External providers**, enable **GitHub**
   - Configure email templates if desired

4. **Get Your Identity URL**
   - In Identity settings, find your Identity service URL
   - It looks like: `https://your-site-name.netlify.app`
   - Save this for configuration

### Method 2: GitHub OAuth with External Service

1. **Create GitHub OAuth App**
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Click **New OAuth App**
   - Fill in:
     ```
     Application name: Your Site CMS
     Homepage URL: https://yourusername.github.io/repository
     Authorization callback URL: https://yourusername.github.io/repository/admin/
     ```
   - Click **Register application**
   - Save the **Client ID** and **Client Secret**

2. **Set Up OAuth Proxy Service**
   - Option A: Use [Netlify's OAuth provider](https://github.com/vencax/netlify-cms-github-oauth-provider)
   - Option B: Use [Simple OAuth2 proxy](https://github.com/igk1972/netlify-cms-oauth-provider-go)
   - Option C: Deploy your own using Vercel/Heroku

---

## Netlify Identity Service Setup

### Step 1: Install Netlify Identity Widget

Add to your CMS admin page (`public/admin/index.html`):

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Content Manager</title>
    <!-- Add Netlify Identity Widget -->
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  </head>
  <body>
    <!-- Include Decap CMS -->
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

### Step 2: Add Identity Widget to Main Site

Add to your main site's `<head>` (in `src/components/BaseHead.astro`):

```astro
<!-- Netlify Identity Widget -->
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

And add this script before closing `</body>` tag (in `src/layouts/Base.astro`):

```html
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

---

## Configuration Updates

### Update CMS Configuration

Update `public/admin/config.yml`:

```yaml
# Production backend configuration
backend:
  name: git-gateway
  branch: main  # Your default branch
  # Remove or comment out local_backend for production
  # local_backend: true

# If using Netlify Identity, add:
site_url: https://yourusername.github.io/repository

# Rest of your configuration remains the same...
```

### Environment-Specific Configuration

For development/production switching, create `public/admin/config-dev.yml`:

```yaml
# Development configuration
backend:
  name: git-gateway
  branch: main

local_backend: true

# Rest matches production config...
```

Then add a build script to swap configs:

```json
// package.json
{
  "scripts": {
    "build:cms:dev": "cp public/admin/config-dev.yml public/admin/config.yml",
    "build:cms:prod": "cp public/admin/config-prod.yml public/admin/config.yml",
    "build": "npm run build:cms:prod && astro build"
  }
}
```

---

## Deployment Steps

### Step 1: Configure Git Gateway

1. In Netlify Identity settings:
   - Go to **Services** → **Git Gateway**
   - Click **Enable Git Gateway**
   - It will automatically use your Netlify account's GitHub permissions

### Step 2: Update GitHub Actions

Update `.github/workflows/deploy.yml` to ensure CMS files are included:

```yaml
- name: Build site
  run: |
    npm run build:cms:prod
    npm run build
```

### Step 3: Deploy to GitHub Pages

1. Commit all changes:
   ```bash
   git add .
   git commit -m "Configure Decap CMS for production"
   git push origin main
   ```

2. Wait for GitHub Actions to deploy

3. Access your CMS at: `https://yourusername.github.io/repository/admin/`

---

## User Management

### Adding Users (Netlify Identity)

1. **Invite Users**
   - Go to Netlify Identity tab
   - Click **Invite users**
   - Enter email addresses
   - Users receive invitation emails

2. **User Registration**
   - Users click the invitation link
   - Complete registration
   - Can now access the CMS

3. **Managing Roles**
   - In Identity settings, you can assign roles
   - Configure role-based access in CMS config:
   ```yaml
   collections:
     - name: "posts"
       label: "Blog Posts"
       folder: "src/content/post"
       create: true
       # Add role-based permissions
       publish: false  # Require approval
       editor:
         preview: true
   ```

### Self-Service Registration

If you want open registration (not recommended):

1. Update Netlify Identity settings to "Open"
2. Add registration link to your site:
   ```html
   <a href="#" onclick="netlifyIdentity.open('signup'); return false;">Sign Up</a>
   ```

---

## Security Considerations

### 1. Branch Protection

Protect your main branch on GitHub:
- Settings → Branches → Add rule
- Require pull request reviews
- Require status checks to pass
- Include administrators

### 2. Content Security Policy

Update your CSP headers in `public/_headers`:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://identity.netlify.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; connect-src 'self' https://identity.netlify.com https://*.netlify.app; frame-src 'self' https://identity.netlify.com;
```

### 3. API Key Security

Never commit:
- OAuth client secrets
- API keys
- Identity service URLs with embedded tokens

Use environment variables or GitHub Secrets for sensitive data.

### 4. Regular Audits

- Review user access monthly
- Check GitHub audit logs
- Monitor for unauthorized changes
- Keep Decap CMS updated

---

## Troubleshooting

### Common Issues

#### 1. "Failed to load settings"
- Check `config.yml` syntax
- Ensure `site_url` matches your GitHub Pages URL
- Verify Git Gateway is enabled

#### 2. "Authentication Error"
- Clear browser cache/cookies
- Check Identity service is running
- Verify user is invited/registered

#### 3. "Cannot push to repository"
- Check Git Gateway configuration
- Verify GitHub permissions
- Ensure branch protection allows CMS pushes

#### 4. "CORS Errors"
- Add your GitHub Pages domain to Netlify Identity settings
- Check CSP headers allow Identity widget

### Debug Mode

Enable debug mode in config:

```yaml
backend:
  name: git-gateway
  branch: main

# Add debug mode
display_url: https://yourusername.github.io/repository
logo_url: https://yourusername.github.io/repository/logo.png
```

Check browser console for detailed error messages.

---

## Alternative Authentication Methods

### Option 1: Netlify Functions (Free Tier)

Deploy authentication functions to Netlify:

1. Create `netlify/functions/auth.js`
2. Implement OAuth flow
3. Deploy only functions to Netlify
4. Keep site on GitHub Pages

### Option 2: Vercel Functions

Similar to Netlify but using Vercel:

```javascript
// api/auth.js
export default function handler(req, res) {
  // OAuth implementation
}
```

### Option 3: Self-Hosted OAuth Proxy

Using a VPS or cloud service:

1. Deploy [cms-oauth-provider](https://github.com/igk1972/netlify-cms-oauth-provider-go)
2. Configure with your GitHub OAuth app
3. Update CMS config:
   ```yaml
   backend:
     name: github
     repo: yourusername/repository
     base_url: https://your-oauth-server.com
   ```

### Option 4: GitHub App Authentication

More complex but provides fine-grained permissions:

1. Create GitHub App instead of OAuth App
2. Implement authentication flow
3. Use installation tokens for API access

---

## Best Practices

1. **Development Workflow**
   - Use local backend for development
   - Test in staging environment
   - Deploy to production only after verification

2. **Content Backup**
   - Regular Git backups (automatic with CMS)
   - Consider GitHub Actions for additional backups
   - Export content periodically

3. **Performance**
   - Lazy load Identity widget
   - Optimize CMS bundle size
   - Use CDN for CMS assets

4. **Monitoring**
   - Set up alerts for failed deployments
   - Monitor CMS usage
   - Track authentication failures

---

## Migration from Local to Production

1. **Backup Current Content**
   ```bash
   git add .
   git commit -m "Backup before CMS production setup"
   git push
   ```

2. **Test Authentication**
   - Set up staging environment
   - Test with limited users
   - Verify all collections work

3. **Gradual Rollout**
   - Enable for admins first
   - Add editors gradually
   - Monitor for issues

4. **Update Documentation**
   - Document CMS URL
   - Create user guides
   - Note emergency procedures

---

## Next Steps

After setting up production CMS:

1. **Create User Documentation**
   - How to log in
   - Content guidelines
   - Workflow descriptions

2. **Set Up Workflows**
   - Editorial workflow for reviews
   - Scheduled publishing
   - Content versioning

3. **Integrate with CI/CD**
   - Automated tests for content
   - Preview deployments
   - Staging environments

4. **Advanced Features**
   - Custom widgets
   - Editorial workflows
   - Webhook integrations

---

## Resources

- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Netlify Identity Documentation](https://docs.netlify.com/visitor-access/identity/)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Community OAuth Providers](https://decapcms.org/docs/external-oauth-clients/)

---

## Support

For issues specific to:
- **Decap CMS**: [GitHub Issues](https://github.com/decaporg/decap-cms/issues)
- **Netlify Identity**: [Netlify Support](https://www.netlify.com/support/)
- **GitHub Pages**: [GitHub Community](https://github.community/)