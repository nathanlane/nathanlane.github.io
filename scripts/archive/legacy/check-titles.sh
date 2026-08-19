#!/bin/bash

echo "🔍 Checking for posts with long titles..."
echo "========================================"
echo ""

cd /Users/nathanlane/code/nathanlane.github.io/src/content/post

# Find posts with titles longer than 60 chars
for file in *.md *.mdx; do
  if [ -f "$file" ]; then
    # Extract title using grep and sed
    title=$(grep -m1 "^title:" "$file" | sed 's/^title: *//' | sed 's/^"//' | sed 's/"$//' | sed "s/^'//" | sed "s/'$//")
    
    # Check if multiline title
    if [ -z "$title" ] || [[ "$title" == ">-" ]] || [[ "$title" == ">" ]]; then
      # Try to get multiline title
      title=$(awk '/^title:/{flag=1; next} flag && /^[^ ]/{exit} flag{print}' "$file" | tr '\n' ' ' | sed 's/^ *//' | sed 's/ *$//')
    fi
    
    # Calculate length
    length=${#title}
    
    if [ $length -gt 60 ]; then
      echo "❌ $file"
      echo "   Title: $title"
      echo "   Length: $length characters"
      echo ""
    fi
  fi
done

echo ""
echo "✅ Check complete!"