# Dependency Upgrade Instructions

## Security Vulnerabilities to Fix

Based on the production readiness audit, the following dependencies have known vulnerabilities and need to be upgraded:

### High Priority Vulnerabilities

1. **tar-fs** (2.1.2 → latest)
   - Used by: sharp (for image processing)
   - Vulnerability: Path traversal vulnerability
   
2. **vite** (6.2.1 → latest)
   - Used by: Astro build system
   - Vulnerability: DOM clobbering vulnerability
   
3. **prismjs** (1.29.0 → latest)
   - Used by: Syntax highlighting
   - Vulnerability: Regular expression denial of service (ReDoS)
   
4. **undici** (6.21.1 → latest)
   - Used by: Node.js HTTP client
   - Vulnerability: Multiple security issues

### Upgrade Commands

Run these commands in order:

```bash
# 1. First, upgrade Astro to the latest version (this will likely upgrade vite)
pnpm add astro@latest

# 2. Upgrade sharp to fix tar-fs vulnerability
pnpm add sharp@latest

# 3. Check if prismjs needs direct upgrade or if it's a subdependency
pnpm ls prismjs

# 4. Force update all dependencies to their latest versions
pnpm update --latest

# 5. Run audit to check if vulnerabilities are fixed
pnpm audit

# 6. If issues persist, try removing lock file and reinstalling
rm pnpm-lock.yaml
pnpm install

# 7. Test the build after upgrades
pnpm build
```

### Alternative: Manual Package.json Updates

If automatic upgrades fail, manually update these versions in package.json:

```json
{
  "dependencies": {
    "astro": "^5.11.0",
    "sharp": "^0.34.0"
  }
}
```

Then run:
```bash
pnpm install
```

### Post-Upgrade Testing

After upgrading, test:

1. **Development server**: `pnpm dev`
2. **Production build**: `pnpm build`
3. **Type checking**: `pnpm check`
4. **Linting**: `pnpm lint`
5. **Preview build**: `pnpm preview`

### Rollback Plan

If upgrades cause issues:

```bash
# Restore previous package.json and lock file from git
git checkout package.json pnpm-lock.yaml
pnpm install
```

## Notes

- The vulnerabilities are in sub-dependencies, so upgrading the main packages (Astro, Sharp) should resolve them
- Astro 5.11 includes important security fixes and performance improvements
- Always test thoroughly after major version upgrades
- Consider running upgrades in a separate branch first