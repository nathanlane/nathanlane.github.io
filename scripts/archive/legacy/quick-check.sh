#!/bin/bash

# Quick validation check focusing on common errors
# Usage: ./scripts/validation/quick-check.sh

echo "🚀 Running quick validation checks..."
echo ""

# Check for empty descriptions
echo "📝 Checking for empty descriptions..."
EMPTY_DESC=$(grep -l "description: ''" src/content/post/*.md 2>/dev/null | wc -l)
if [ "$EMPTY_DESC" -gt 0 ]; then
    echo "❌ Found $EMPTY_DESC posts with empty descriptions:"
    grep -l "description: ''" src/content/post/*.md
    echo ""
fi

# Check for short descriptions
echo "📏 Checking for short descriptions (< 20 chars)..."
node -e "
const fs = require('fs');
const path = require('path');
const postsDir = 'src/content/post';
let found = false;

fs.readdirSync(postsDir).forEach(file => {
  if (!file.endsWith('.md')) return;
  const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const match = content.match(/description:\s*['\"](.*?)['\"]/)
  if (match && match[1].length < 20) {
    if (!found) {
      console.log('❌ Found posts with short descriptions:');
      found = true;
    }
    console.log(\`  \${file}: "\${match[1]}" (\${match[1].length} chars)\`);
  }
});

if (!found) {
  console.log('✅ All descriptions are 20+ characters');
}
"

echo ""

# Quick type check
echo "🔍 Running quick type check..."
pnpm check 2>&1 | grep -E "(error|Error)" || echo "✅ No type errors found"

echo ""
echo "💡 For full validation, run: pnpm run validate"
echo ""