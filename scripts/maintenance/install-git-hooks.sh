#!/bin/bash

# Install Git Hooks Script
# =======================
# 
# Purpose: Installs the improved pre-commit hook for secret detection
# 
# Usage: ./scripts/maintenance/install-git-hooks.sh
# 
# Prerequisites:
# - Git repository initialized
# - Execute permissions on this script
# 
# Output:
# - Installs pre-commit hook to .git/hooks/
# - Makes hook executable
# 
# Author: Claude Assistant
# Date: July 2025

echo "Installing Git hooks..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy the pre-commit hook
cp .git/hooks/pre-commit .git/hooks/pre-commit.backup 2>/dev/null
echo "✅ Backed up existing pre-commit hook (if any)"

# Install the new hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
# Advanced Pre-commit Hook for Secret Detection
# Supports .gitsecret configuration file for customization

# Default patterns
PATTERNS="api[_-]key|apikey|api[_-]secret|access[_-]token|auth[_-]token|private[_-]key|secret[_-]key"
AWS_PATTERN="AKIA[0-9A-Z]{16}"
REAL_SECRET_PATTERNS='["'"'"'`].*api[_-]?key["'"'"'`]?\s*[:=]\s*["'"'"'`][A-Za-z0-9]|token\s*[:=]\s*["'"'"'`][A-Za-z0-9]{20,}'

# Load exclusions from .gitsecret if it exists
if [ -f .gitsecret ]; then
    EXCLUDE_PATTERNS=$(grep -A20 "exclude_paths:" .gitsecret | grep "^  - " | sed 's/^  - "\(.*\)"$/\1/' | tr '\n' '|' | sed 's/|$//')
else
    EXCLUDE_PATTERNS="CHANGELOG|Changelog|SECURITY|README|CLAUDE\.md|\.test\.|\.spec\.|private_notes/"
fi

# Function to check if content is likely documentation
is_documentation() {
    local content="$1"
    local pattern="$2"
    
    # Check for documentation context words around the pattern
    if echo "$content" | grep -B3 -A3 -iE "$pattern" | grep -iE "detect|pattern|check|scan|audit|document|example|test|sample|guide|prevents|searches for|looks for" > /dev/null; then
        return 0
    fi
    
    # Check if it's in a comment
    if echo "$content" | grep -E "^[[:space:]]*(#|//|/\*|\*)" | grep -iE "$pattern" > /dev/null; then
        return 0
    fi
    
    return 1
}

# Get staged files
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|json|env|astro|md|mdx|yml|yaml|txt|conf|config)$')

FOUND_ISSUES=0

if [ -n "$FILES" ]; then
    for FILE in $FILES; do
        # Skip excluded files
        if [ -n "$EXCLUDE_PATTERNS" ] && echo "$FILE" | grep -E "$EXCLUDE_PATTERNS" > /dev/null; then
            continue
        fi
        
        # Get file content
        CONTENT=$(git show ":$FILE" 2>/dev/null)
        if [ $? -ne 0 ]; then
            continue
        fi
        
        # Check for real AWS keys (high priority)
        if echo "$CONTENT" | grep -E "$AWS_PATTERN" > /dev/null; then
            echo "🚨 ERROR: AWS key pattern detected in $FILE"
            echo "   This appears to be a real AWS access key."
            FOUND_ISSUES=1
            continue
        fi
        
        # Check for real secret patterns
        if echo "$CONTENT" | grep -E "$REAL_SECRET_PATTERNS" > /dev/null; then
            # Double-check it's not in documentation
            if ! is_documentation "$CONTENT" "$REAL_SECRET_PATTERNS"; then
                echo "🚨 ERROR: Likely secret detected in $FILE"
                echo "   Found what appears to be an actual secret value."
                FOUND_ISSUES=1
                continue
            fi
        fi
        
        # Check for common secret patterns
        if echo "$CONTENT" | grep -iE "$PATTERNS" > /dev/null; then
            if is_documentation "$CONTENT" "$PATTERNS"; then
                # It's documentation - just inform
                echo "ℹ️  Info: Documentation about secrets found in $FILE"
            else
                # Could be a real secret
                echo "⚠️  Warning: Possible secret pattern in $FILE"
                echo "   Review the file to ensure no real secrets are present."
                FOUND_ISSUES=1
            fi
        fi
    done
fi

if [ $FOUND_ISSUES -eq 1 ]; then
    echo ""
    echo "❌ Pre-commit check failed. Issues found above."
    echo ""
    echo "Options:"
    echo "  1. Remove any real secrets from the files"
    echo "  2. Add false-positive paths to .gitsecret exclude_paths"
    echo "  3. Use 'git commit --no-verify' to bypass (use with caution)"
    exit 1
fi

exit 0
EOF

# Make the hook executable
chmod +x .git/hooks/pre-commit

echo "✅ Git hooks installed successfully!"
echo ""
echo "The pre-commit hook will now check for secrets before each commit."
echo "Configure exclusions and behavior in .gitsecret file."