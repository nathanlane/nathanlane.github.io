# Secret Detection False Positive Guide

## Overview

This guide explains how to handle false positives from the git pre-commit secret detection hook.

## Understanding False Positives

False positives occur when the secret scanner detects patterns that look like secrets but are actually:
- Documentation about security features
- Example code showing what NOT to do
- Variable names or comments discussing security
- Test data or mock credentials

## Protection Strategies

### 1. Enhanced Pre-commit Hook (Already Implemented)

The improved hook includes:
- **Exclude patterns**: Automatically skips documentation files and private_notes
- **Context detection**: Checks if secret patterns appear near words like "detect", "pattern", "example"
- **Real secret patterns**: More specific regex for actual secrets vs documentation
- **Severity levels**: INFO for documentation, WARNING for unclear cases, ERROR for likely secrets

### 2. Configuration File (.gitsecret)

Create a `.gitsecret` file to customize behavior:

```yaml
exclude_paths:
  - "private_notes/"
  - "docs/"
  - "*.test.js"
  
doc_context_words:
  - "example"
  - "documentation"
  - "detects"
```

### 3. Bypass Methods

For legitimate false positives:

```bash
# One-time bypass
git commit --no-verify -m "Your message"

# Check what's triggering the hook
git diff --cached | grep -iE "api_key|secret|token"
```

### 4. Best Practices

1. **Use environment variables** for real secrets:
   ```javascript
   // Good
   const apiKey = process.env.API_KEY;
   
   // Bad
   const apiKey = "sk_live_abc123";
   ```

2. **Document security patterns clearly**:
   ```markdown
   <!-- Good: Clear documentation context -->
   The security scanner detects patterns like api_key and access_token
   
   <!-- Risky: Could trigger scanner -->
   api_key=your_key_here
   ```

3. **Use example prefixes**:
   ```javascript
   // Clear it's an example
   const EXAMPLE_API_KEY = "this-is-not-real";
   const MOCK_TOKEN = "test-token-for-demo";
   ```

## Common False Positive Scenarios

### Scenario 1: Security Documentation
- **Issue**: Documenting what patterns the scanner looks for
- **Solution**: These files are auto-excluded in private_notes/

### Scenario 2: Code Comments
- **Issue**: Comments explaining security features
- **Solution**: Hook detects comment syntax and reduces severity

### Scenario 3: Test Files
- **Issue**: Mock credentials in tests
- **Solution**: Add test files to exclude_paths in .gitsecret

### Scenario 4: Migration Scripts
- **Issue**: Scripts that process or clean up old secrets
- **Solution**: Use --no-verify when committing these specific changes

## Troubleshooting

### See what's being detected:
```bash
# Check specific file
git show :path/to/file | grep -iE "api_key|secret|token"

# See detection with context
git show :path/to/file | grep -B2 -A2 -iE "api_key|secret|token"
```

### Update the hook:
```bash
# Run the installer script
./scripts/maintenance/install-git-hooks.sh
```

### Temporarily disable:
```bash
# Rename the hook
mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled

# Re-enable later
mv .git/hooks/pre-commit.disabled .git/hooks/pre-commit
```

## Security Philosophy

The hook is intentionally cautious. It's better to have occasional false positives than to accidentally commit real secrets. When in doubt:

1. Review the flagged content carefully
2. If it's documentation or examples, use --no-verify
3. If unsure, ask for a second opinion
4. Never commit real secrets, even temporarily

## Additional Tools

Consider adding these tools for defense in depth:
- **truffleHog**: Deep git history scanning
- **gitleaks**: More sophisticated secret detection
- **GitHub secret scanning**: Automatic detection in GitHub repos

Remember: The pre-commit hook is your first line of defense, not your only one.