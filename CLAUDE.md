# CLAUDE.md - Onyx Extension Development Guide

This file contains everything needed to work on the Onyx browser extension codebase effectively.

## Project Overview

**Onyx** is a browser extension that provides instant prompt injection across AI platforms like ChatGPT, Claude, and Gemini. Users can save prompts and inject them using the "x/" trigger pattern for maximum productivity.

### Key Features
- **Instant Prompt Injection**: Type "x/" + prompt name to inject saved prompts
- **Cross-Platform Support**: Works on ChatGPT, Claude.ai, Gemini, and all websites
- **Smart Storage**: Individual item storage architecture supporting ~4MB capacity
- **Magical Auto-completion**: Exact-match detection with instant injection
- **Visual Effects**: Border trace animation for injection feedback
- **Popup Management**: Full CRUD operations for prompt management

## Architecture

### Core Components
- **Content Script** (`src/content/inject.ts`): Handles "x/" detection and prompt injection
- **Background Script** (`src/background.ts`): HTTP request interception for Claude.ai
- **Popup UI** (`src/popup/main.ts`): Lit-based prompt management interface
- **Options Page** (`src/options/main.ts`): Extended storage management and analytics

### Storage Architecture
- **Individual Item Storage**: Each prompt stored as `snippet-{id}` key
- **Index Management**: `onyx-index` array tracks all snippet IDs
- **Capacity**: ~4MB total (512 items max, 8KB per item)
- **Sync**: Chrome storage.sync for cross-device synchronization

## Development Setup

### Prerequisites
```bash
# Node.js 18+ required
node --version

# Dependencies
npm install
```

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# TypeScript compilation
npx tsc

# Watch mode
npx tsc --watch
```

### Testing the Extension
1. Build: `npm run build`
2. Load `dist/` folder in Chrome Extensions (Developer Mode)
3. Test "x/" trigger on any text field

## Scripts and Automation

### Chrome Web Store Preparation Script

Create this script at `scripts/prepare-webstore.sh`:

```bash
#!/bin/bash

# Chrome Web Store Preparation Script
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
```

### Usage
```bash
# Make script executable
chmod +x scripts/prepare-webstore.sh

# Increment patch version (1.1.0 → 1.1.1)
./scripts/prepare-webstore.sh patch

# Increment minor version (1.1.0 → 1.2.0)  
./scripts/prepare-webstore.sh minor

# Increment major version (1.1.0 → 2.0.0)
./scripts/prepare-webstore.sh major
```

### Add to package.json
```json
{
  "scripts": {
    "webstore:patch": "./scripts/prepare-webstore.sh patch",
    "webstore:minor": "./scripts/prepare-webstore.sh minor",
    "webstore:major": "./scripts/prepare-webstore.sh major"
  }
}
```

## Codebase Structure

```
Onyx/
├── src/
│   ├── content/
│   │   └── inject.ts          # Content script - core injection logic
│   ├── popup/
│   │   └── main.ts           # Popup UI - Lit components
│   ├── options/
│   │   └── main.ts           # Options page - storage management
│   └── background.ts         # Background script - Claude.ai interception
├── dist/                     # Build output
├── icons/                    # Extension icons (16, 48, 128px)
├── manifest.json            # Extension manifest
├── popup.html              # Popup HTML
├── options.html            # Options page HTML
├── vite.config.ts          # Build configuration
└── CLAUDE.md              # This file
```

### Key Files

**`src/content/inject.ts`** (722 lines)
- Handles "x/" trigger detection
- Manages snippet picker UI
- Implements injection logic for all platforms
- Claude.ai-specific Enter key blocking
- Border trace visual effects

**`src/background.ts`** (152 lines)  
- HTTP request interception for Claude.ai
- Storage management and caching
- Request body modification for snippet injection

**`src/popup/main.ts`**
- Lit-based popup interface
- CRUD operations for prompts
- Real-time validation and feedback
- Glass morphism UI effects

**`manifest.json`**
- Chrome Extension Manifest V3
- Permissions: storage, activeTab, commands, webRequest
- Host permissions: <all_urls>

## Chrome Extension Specifics

### Permissions Required
- **storage**: Chrome sync storage for prompts
- **activeTab**: Access current tab for injection
- **commands**: Keyboard shortcuts (Ctrl+Shift+X)
- **webRequest**: HTTP interception for Claude.ai
- **host_permissions**: <all_urls> for universal injection

### Content Script Behavior
- Injects on all URLs (`<all_urls>`)
- Monitors for "x/" pattern in text inputs
- Creates floating picker UI
- Handles keyboard navigation (Arrow keys, Enter, Tab, Escape)

### Background Script
- Intercepts POST requests to Claude.ai domains
- Modifies request body to replace "x/" patterns
- Maintains snippet cache for synchronous access

### Platform-Specific Handling
- **Claude.ai**: HTTP request interception + event blocking
- **ChatGPT/Gemini**: Direct DOM manipulation
- **Generic sites**: Standard input event handling

## Storage Schema

### Individual Item Storage
```javascript
// Storage keys
"onyx-index": ["id1", "id2", "id3"]  // Array of snippet IDs
"snippet-{id}": {                    // Individual snippet
  id: "unique-id",
  title: "Prompt Name", 
  content: "Prompt content...",
  createdAt: 1234567890
}
```

### Storage Operations
```javascript
// Load all snippets
const index = await chrome.storage.sync.get('onyx-index');
const snippets = await chrome.storage.sync.get(
  index['onyx-index'].map(id => `snippet-${id}`)
);

// Save snippet
await chrome.storage.sync.set({
  [`snippet-${id}`]: snippet,
  'onyx-index': [...existingIndex, id]
});
```

## Development Guidelines

### Code Conventions
- TypeScript for all source files
- Lit framework for UI components  
- Chrome Extension Manifest V3
- ESNext module format
- No external dependencies in content scripts

### Error Handling
- Graceful fallbacks for platform differences
- Console logging with emoji prefixes (🔍, ✅, ❌)
- Try-catch blocks for storage operations
- Safe DOM manipulation with existence checks

### Performance Considerations
- Lazy loading of storage data
- Debounced input handlers
- Minimal DOM manipulation
- Efficient event listener management

### Visual Effects
- Border trace animation for injection feedback
- Glass morphism effects in popup
- Smooth transitions and animations
- Red theme (#FF0000) throughout interface

## Troubleshooting

### Common Issues

**"x/" trigger not working:**
- Check content script injection in DevTools
- Verify manifest permissions
- Test on different input types (input, textarea, contentEditable)

**Claude.ai specific issues:**
- Check webRequest permission is granted
- Verify background script is running
- Monitor network requests in DevTools

**Storage errors:**
- Check Chrome storage quota
- Verify sync is enabled in Chrome
- Test with smaller prompt content

**Build errors:**
- Run `npm install` to update dependencies
- Check TypeScript compilation: `npx tsc`
- Verify Vite config is correct

### Debug Techniques
```javascript
// Content script debugging
console.log('🔍 Snippet mode:', snippetModeState);

// Background script debugging  
console.log('🌐 Intercepting request:', details.url);

// Storage debugging
chrome.storage.sync.get(null, console.log);
```

### Performance Monitoring
- Monitor storage usage in options page
- Check memory usage in Chrome Task Manager
- Profile injection speed with console.time()

## Release Process

1. **Development**
   ```bash
   # Make changes
   npm run dev  # Test locally
   ```

2. **Prepare Release**  
   ```bash
   ./scripts/prepare-webstore.sh patch  # or minor/major
   ```

3. **Chrome Web Store Upload**
   - Upload generated zip file
   - Fill permission justifications:
     - **webRequest**: "Enables seamless prompt injection on Claude.ai by intercepting HTTP requests to replace trigger patterns with prompt content before submission."
     - **host_permissions**: "Required to inject saved prompts into text fields across any website the user visits."

4. **Verification**
   - Test on ChatGPT, Claude.ai, and Gemini
   - Verify "x/" trigger works correctly
   - Check storage operations in options page

## Chrome Web Store Requirements

### Permission Justifications

**webRequest:**
```
The webRequest permission enables Onyx to provide seamless prompt injection on Claude.ai, which uses React's synthetic event system that bypasses standard DOM event handling. When users type "x/" followed by a prompt name on Claude.ai, Onyx intercepts the HTTP request before submission to replace the trigger pattern with the actual prompt content. This allows instant, magical prompt injection without disrupting the user's workflow. The permission is only used for Claude.ai URLs and enhances the core functionality.
```

**host_permissions (<all_urls>):**
```
Onyx requires access to all URLs to support inserting saved prompts into text fields across any site the user may visit. This universal access enables the core "x/" trigger functionality to work seamlessly across different AI platforms (ChatGPT, Claude, Gemini) and any other website where users want to inject their saved prompts for productivity enhancement.
```

---

*This CLAUDE.md file should be updated whenever significant architectural changes are made to the codebase.*