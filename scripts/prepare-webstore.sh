#!/bin/bash

# Chrome Web Store Preparation Script for Onyx Extension
# Usage: ./scripts/prepare-webstore.sh [patch|minor|major]

set -e

VERSION_TYPE=${1:-patch}

echo "🚀 Preparing Onyx for Chrome Web Store release..."

# Parse current version
CURRENT_VERSION=$(node -p "require('./manifest.json').version")
echo "Current version: $CURRENT_VERSION"

# Calculate new version
case $VERSION_TYPE in
  patch)
    NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{$NF = $NF + 1;} 1' | sed 's/ /./g')
    ;;
  minor)
    NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{$(NF-1) = $(NF-1) + 1; $NF = 0} 1' | sed 's/ /./g')
    ;;
  major)
    NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{$1 = $1 + 1; $2 = 0; $3 = 0} 1' | sed 's/ /./g')
    ;;
  *)
    echo "❌ Invalid version type. Use: patch, minor, or major"
    exit 1
    ;;
esac

echo "New version: $NEW_VERSION"

# Update manifest.json
sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" manifest.json
echo "✅ Updated manifest.json"

# Build extension
echo "🔨 Building extension..."
npm run build

# Clean unnecessary files
find dist/ -name ".DS_Store" -delete 2>/dev/null || true
rm -f dist/vite.svg 2>/dev/null || true
echo "✅ Cleaned build artifacts"

# Create Chrome Web Store package
PACKAGE_NAME="onyx-v$NEW_VERSION-webstore.zip"
cd dist && zip -r "../$PACKAGE_NAME" . && cd ..
echo "✅ Created package: $PACKAGE_NAME"

# Git operations
git add manifest.json icons/
git commit -m "chore: Update version to $NEW_VERSION for Chrome Web Store release

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
echo "✅ Pushed to GitHub"

echo "🎉 Chrome Web Store package ready: $PACKAGE_NAME"
echo "📤 Upload this file to Chrome Web Store Developer Console"
echo ""
echo "Permission justifications:"
echo "webRequest: Enables seamless prompt injection on Claude.ai by intercepting HTTP requests to replace trigger patterns with prompt content."
echo "host_permissions: Required to inject saved prompts into text fields across any website the user visits."