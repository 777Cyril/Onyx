# 🧪 Testing Form Clearing Functionality

## Quick Local Testing Guide

### 1. Build the Extension
```bash
npm run build
```

### 2. Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `/dist` folder from your project
5. The Onyx extension should appear in your extensions list

### 3. Test the Form Clearing

#### Manual Testing:
1. **Click the Onyx extension icon** in the Chrome toolbar
2. **Fill in the form** with a title and content
3. **Click "Add Prompt"**
4. **Verify**: Both input fields should be completely empty after submission

#### Test Both Interfaces:
- **Popup Interface**: Click the extension icon
- **Options Interface**: Right-click extension icon → "Options" or go to `chrome://extensions/` → Onyx → "Extension options"

### 4. Run Automated Tests (Optional)

#### In Browser Console:
1. Open the extension popup
2. Open DevTools (F12)
3. Go to Console tab
4. Run: `runFormClearingTests()`

#### Expected Output:
```
🧪 Starting Form Clearing Tests...
📊 Test Results:
================
✅ PASS Popup clearForm method: Form state cleared successfully
✅ PASS DOM input clearing: DOM inputs cleared successfully  
✅ PASS Form submission clearing: Form cleared after submission
📈 Summary: 3/3 tests passed
🎉 All tests passed! Form clearing is working correctly.
```

## Development Workflow

### Watch Mode for Development:
```bash
npm run dev
```
This will watch for file changes and rebuild automatically.

### Reload Extension After Changes:
1. Go to `chrome://extensions/`
2. Click the refresh icon on the Onyx extension
3. Test your changes

## What to Look For

### ✅ Success Indicators:
- Form inputs are completely empty after clicking "Add Prompt"
- No placeholder text or cached values remain
- Focus is removed from the input fields
- You can immediately start typing a new prompt

### ❌ Failure Indicators:
- Text remains in input fields after submission
- Inputs show previous values when clicked
- Form appears cleared but still has cached values
- Browser autocomplete shows previous entries

## Troubleshooting

### If form doesn't clear:
1. Check browser console for JavaScript errors
2. Verify the build completed successfully (`npm run build`)
3. Make sure you refreshed the extension after changes
4. Try in an incognito window to avoid browser caching

### If tests fail:
1. Ensure you're running tests in the extension context (not a regular webpage)
2. Check that the components are properly loaded
3. Verify no other extensions are interfering

## Test Scenarios

### Basic Form Clearing:
1. Add a prompt with title "Test" and content "Hello world"
2. Click "Add Prompt" 
3. Both fields should be empty

### Edit Mode Clearing:
1. Create a prompt
2. Click edit button on the prompt
3. Modify the content
4. Click "Update Prompt"
5. Form should clear and exit edit mode

### Cancel Edit Clearing:
1. Start editing a prompt
2. Click "Cancel" 
3. Form should clear and exit edit mode

## Performance Notes

The enhanced clearing implementation uses:
- `setTimeout(0)` to ensure DOM updates after the render cycle
- `.blur()` to remove focus and prevent cached values
- Direct DOM manipulation for immediate visual feedback
- State clearing for component consistency

This ensures reliable form clearing across all browser scenarios.