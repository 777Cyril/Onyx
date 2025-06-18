// Theme definitions for content script
const THEME_COLORS = {
    light: {
        brandPrimary: '#e85a4f',
        brandSecondary: '#495057',
        bgPrimary: '#ffffff',
        bgSecondary: '#f8f9fa',
        bgTertiary: '#e9ecef',
        bgHover: '#dee2e6',
        borderPrimary: '#dee2e6',
        borderSecondary: '#e85a4f',
        textPrimary: '#212529',
        textSecondary: '#6c757d',
        textMuted: '#adb5bd',
        scrollbarThumb: '#e85a4f',
        scrollbarThumbHover: '#dc3545'
    },
    dark: {
        brandPrimary: '#ff0000',
        brandSecondary: '#000000',
        bgPrimary: '#121212',
        bgSecondary: '#2d2d2d',
        bgTertiary: '#1a1a1a',
        bgHover: '#3a3a3a',
        borderPrimary: '#444444',
        borderSecondary: '#ff0000',
        textPrimary: '#ffffff',
        textSecondary: '#cccccc',
        textMuted: '#888888',
        scrollbarThumb: '#666666',
        scrollbarThumbHover: '#777777'
    }
};

// Snippet interface
interface Snippet {
    id: string;
    title: string;
    content: string;
    createdAt: number;
}

// Get current theme from storage
async function getCurrentTheme(): Promise<string> {
    try {
        const result = await chrome.storage.sync.get('onyx-theme');
        return result['onyx-theme'] || 'dark';
    } catch (error) {
        console.error('Error getting theme in content script:', error);
        return 'dark';
    }
}

// Update content script theme styles
function updateContentScriptTheme(styleElement: HTMLStyleElement, themeName: string): void {
    const colors = THEME_COLORS[themeName as keyof typeof THEME_COLORS] || THEME_COLORS.light;
    
    styleElement.textContent = `
        /* Onyx ${themeName === 'dark' ? 'Dark' : 'Light'} Theme - Content Script */
        :root {
            --onyx-brand-primary: ${colors.brandPrimary};
            --onyx-brand-secondary: ${colors.brandSecondary};
            --onyx-bg-primary: ${colors.bgPrimary};
            --onyx-bg-secondary: ${colors.bgSecondary};
            --onyx-bg-tertiary: ${colors.bgTertiary};
            --onyx-bg-hover: ${colors.bgHover};
            --onyx-border-primary: ${colors.borderPrimary};
            --onyx-border-secondary: ${colors.borderSecondary};
            --onyx-text-primary: ${colors.textPrimary};
            --onyx-text-secondary: ${colors.textSecondary};
            --onyx-text-muted: ${colors.textMuted};
            --onyx-scrollbar-thumb: ${colors.scrollbarThumb};
            --onyx-scrollbar-thumb-hover: ${colors.scrollbarThumbHover};
        }
        
        #onyx-picker::-webkit-scrollbar {
            width: 8px;
        }
        #onyx-picker::-webkit-scrollbar-track {
            background: var(--onyx-bg-secondary);
        }
        #onyx-picker::-webkit-scrollbar-thumb {
            background: var(--onyx-scrollbar-thumb);
            border-radius: 4px;
        }
        #onyx-picker::-webkit-scrollbar-thumb:hover {
            background: var(--onyx-scrollbar-thumb-hover);
        }
        
        /* Border Trace Effect - Dynamic theme colors */
        @keyframes borderTrace {
            0% {
                box-shadow: inset 2px 0 0 ${colors.brandPrimary}, inset 0 0 0 transparent;
            }
            25% {
                box-shadow: inset 2px 0 0 ${colors.brandPrimary}, inset 0 2px 0 ${colors.brandPrimary};
            }
            50% {
                box-shadow: inset 0 0 0 transparent, inset 0 2px 0 ${colors.brandPrimary}, inset -2px 0 0 ${colors.brandPrimary};
            }
            75% {
                box-shadow: inset 0 0 0 transparent, inset 0 -2px 0 ${colors.brandPrimary}, inset -2px 0 0 ${colors.brandPrimary};
            }
            100% {
                box-shadow: inset 0 0 0 transparent;
            }
        }
        
        .onyx-border-trace-effect {
            animation: borderTrace 400ms ease-in-out !important;
        }
        
        .onyx-ready-indicator {
            position: relative;
        }
        
        .onyx-ready-indicator::after {
            content: "✨ Ready to inject";
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 11px;
            color: var(--onyx-brand-primary);
            opacity: 0.8;
            animation: magicPulse 2s ease-in-out infinite;
        }
        
        /* Magic Pulse Animation */
        @keyframes magicPulse {
            0%, 100% {
                opacity: 0.8;
                text-shadow: 0 0 3px var(--onyx-brand-primary);
            }
            50% {
                opacity: 1;
                text-shadow: 0 0 6px var(--onyx-brand-primary), 0 0 12px var(--onyx-brand-primary);
            }
        }
        
        /* Enhanced Exact Match Styling */
        .onyx-exact-match {
            background: rgba(${themeName === 'dark' ? '255, 0, 0' : '232, 90, 79'}, 0.1) !important;
            border-left: 3px solid var(--onyx-brand-primary) !important;
            position: relative;
            overflow: hidden;
        }
        
        .onyx-exact-match::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(${themeName === 'dark' ? '255, 0, 0' : '232, 90, 79'}, 0.2),
                rgba(${themeName === 'dark' ? '255, 255, 255' : '255, 255, 255'}, 0.3),
                rgba(${themeName === 'dark' ? '255, 0, 0' : '232, 90, 79'}, 0.2),
                transparent
            );
            animation: magicSweep 3s ease-in-out infinite;
        }
        
        @keyframes magicSweep {
            0% {
                left: -100%;
            }
            50% {
                left: 100%;
            }
            100% {
                left: 100%;
            }
        }
    `;
}

// Initialize content script theme and listen for changes
async function initializeContentScriptTheme(styleElement: HTMLStyleElement): Promise<void> {
    try {
        // Get current theme from storage
        const currentTheme = await getCurrentTheme();
        updateContentScriptTheme(styleElement, currentTheme);
        
        // Listen for theme changes
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === 'sync' && changes['onyx-theme']) {
                const newTheme = changes['onyx-theme'].newValue;
                if (newTheme) {
                    updateContentScriptTheme(styleElement, newTheme);
                }
            }
        });
    } catch (error) {
        console.error('Error initializing content script theme:', error);
        // Fallback to dark theme
        updateContentScriptTheme(styleElement, 'dark');
    }
}

// Storage utility functions
function getSnippetsFromStorage(): Promise<Snippet[]> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(null, (data) => {
            try {
                const snippetIndex = data['onyx-index'] || [];
                const allSnippets: Snippet[] = [];
                
                for (const snippetId of snippetIndex) {
                    const snippetKey = `snippet-${snippetId}`;
                    const snippet = data[snippetKey];
                    if (snippet) {
                        allSnippets.push(snippet);
                    }
                }
                
                // Sort by creation date (newest first)
                allSnippets.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                
                resolve(allSnippets);
            } catch (error) {
                console.error('Error loading snippets:', error);
                resolve([]);
            }
        });
    });
}

function filterSnippets(snippets: Snippet[], query: string): Snippet[] {
    if (!query) return snippets;
    
    const lowerQuery = query.toLowerCase();
    return snippets.filter(snippet => {
        const title = (snippet.title || '').toLowerCase();
        return title.includes(lowerQuery);
    }).sort((a, b) => {
        // Sort by how early the match occurs
        const aIndex = (a.title || '').toLowerCase().indexOf(lowerQuery);
        const bIndex = (b.title || '').toLowerCase().indexOf(lowerQuery);
        return aIndex - bIndex;
    });
}

function findExactMatch(snippets: Snippet[], query: string): Snippet | null {
    if (!query.trim()) return null;
    
    const exactMatch = snippets.find(snippet => 
        snippet.title.toLowerCase() === query.toLowerCase().trim()
    );
    return exactMatch || null;
}

// Global state for snippet mode
let snippetModeState: {
    active: boolean;
    target: HTMLElement | null;
    startPosition: number;
    searchQuery: string;
    selectedIndex: number;
    filteredSnippets: any[];
    textNode?: Node;
    isAnimating?: boolean;
    animationController?: AbortController;
    enterKeyBlocked?: boolean;
} = {
    active: false,
    target: null,
    startPosition: 0,
    searchQuery: '',
    selectedIndex: 0,
    filteredSnippets: [],
    isAnimating: false,
    enterKeyBlocked: false
};

// Create or reuse a floating overlay element
function getPicker(): HTMLElement {
    let picker = document.getElementById("onyx-picker");
    if (picker) return picker;
  
    picker = document.createElement("div");
    picker.id = "onyx-picker";
    Object.assign(picker.style, {
        position: "absolute",
        background: "var(--onyx-bg-secondary)",
        border: "1px solid var(--onyx-border-secondary)",
        borderRadius: "8px",
        padding: "0",
        fontSize: "14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        zIndex: "2147483647",
        minWidth: "200px",
        maxWidth: "350px",
        maxHeight: "280px",
        overflowY: "auto",
        overflowX: "hidden",
    });
    
    // Initialize theme-aware styles
    const style = document.createElement('style');
    style.id = 'onyx-theme-styles';
    
    // Get current theme and apply styles
    initializeContentScriptTheme(style);
    document.head.appendChild(style);
    
    document.body.appendChild(picker);
    return picker;
}

// Hide the picker and reset snippet mode
function hidePicker() {
    console.log('🚪 Hiding picker and resetting snippet mode');
    
    const picker = document.getElementById("onyx-picker");
    if (picker) {
        picker.remove();
    }
    
    // Reset visual indicators (remove subtle visual cues)
    if (snippetModeState.target) {
        // No background color changes to keep it minimal
    }
    
    // Cancel any ongoing animation
    if (snippetModeState.isAnimating && snippetModeState.animationController) {
        snippetModeState.animationController.abort();
    }
    
    // Reset state
    snippetModeState = {
        active: false,
        target: null,
        startPosition: 0,
        searchQuery: '',
        selectedIndex: 0,
        filteredSnippets: [],
        isAnimating: false,
        enterKeyBlocked: false
    };
    
    console.log('✅ Snippet mode reset - Enter key should work normally now');
    
    // Remove event listeners
    document.removeEventListener('click', handleOutsideClick);
}

// Handle clicks outside the picker
function handleOutsideClick(e: Event) {
    const picker = document.getElementById("onyx-picker");
    const target = e.target as HTMLElement;
    
    if (picker && !picker.contains(target) && target !== snippetModeState.target) {
        hidePicker();
    }
}


// Apply border trace effect to input element
function applyBorderTraceEffect(target: HTMLElement) {
    if (!target) return;
    
    console.log('🔳 Applying border trace effect');
    
    // Store original box-shadow to restore later
    const originalBoxShadow = target.style.boxShadow || '';
    
    // Add border trace class
    target.classList.add('onyx-border-trace-effect');
    
    // Remove border trace effect after animation completes
    setTimeout(() => {
        target.classList.remove('onyx-border-trace-effect');
        // Restore original box-shadow if any
        target.style.boxShadow = originalBoxShadow;
        console.log('✅ Border trace effect completed');
    }, 400);
}


// Highlight matching text in snippet title
function highlightMatch(text: string, query: string): string {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span style="color: var(--onyx-brand-primary); font-weight: 500;">$1</span>');
}

// Calculate optimal position for picker
function positionPicker(picker: HTMLElement, target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    const pickerHeight = picker.offsetHeight;
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // Position below the cursor/caret position
    let top = rect.bottom + window.scrollY + 8;
    let left = rect.left + window.scrollX;
    
    // If not enough space below and more space above, position above
    if (spaceBelow < pickerHeight && spaceAbove > spaceBelow) {
        top = rect.top + window.scrollY - pickerHeight - 8;
    }
    
    // Ensure picker stays within viewport horizontally
    const pickerWidth = picker.offsetWidth;
    const viewportWidth = window.innerWidth;
    if (left + pickerWidth > viewportWidth - 20) {
        left = viewportWidth - pickerWidth - 20;
    }
    
    // For contenteditable, try to position near the cursor
    if (target.isContentEditable && snippetModeState.startPosition > 0) {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const rects = range.getClientRects();
            if (rects.length > 0) {
                const caretRect = rects[0];
                left = caretRect.left + window.scrollX;
                top = caretRect.bottom + window.scrollY + 8;
                
                // Adjust if it would go off screen
                if (left + pickerWidth > viewportWidth - 20) {
                    left = viewportWidth - pickerWidth - 20;
                }
            }
        }
    }
    
    picker.style.top = `${top}px`;
    picker.style.left = `${left}px`;
}

// Update the picker display
function updatePicker(snippets: any[]) {
    const picker = getPicker();
    picker.innerHTML = '';
    
    if (snippets.length === 0) {
        const noResults = document.createElement('div');
        noResults.textContent = 'No matching prompts';
        Object.assign(noResults.style, {
            padding: '12px 16px',
            color: 'var(--onyx-text-secondary)',
            fontStyle: 'italic',
            textAlign: 'center'
        });
        picker.appendChild(noResults);
        positionPicker(picker, snippetModeState.target!);
        return;
    }
    
    // Check for exact match
    const exactMatch = findExactMatch(snippets, snippetModeState.searchQuery);
    
    // Create snippet items (no header for minimal design)
    snippets.forEach((snippet, index) => {
        const item = document.createElement('div');
        item.setAttribute('data-snippet-index', index.toString());
        
        // Check if this is the exact match
        const isExactMatch = exactMatch && snippet.id === exactMatch.id;
        
        // Create highlighted title
        const highlightedTitle = highlightMatch(snippet.title || `Snippet ${index + 1}`, snippetModeState.searchQuery);
        item.innerHTML = `<div>${highlightedTitle}</div>`;
        
        // Add exact match styling
        if (isExactMatch) {
            item.classList.add('onyx-exact-match', 'onyx-ready-indicator');
        }
        
        Object.assign(item.style, {
            padding: '10px 16px',
            cursor: 'pointer',
            backgroundColor: index === snippetModeState.selectedIndex ? 'var(--onyx-bg-hover)' : 'transparent',
            color: 'var(--onyx-text-primary)',
            borderBottom: index < snippets.length - 1 ? '1px solid var(--onyx-border-primary)' : 'none',
            transition: 'background-color 0.15s ease, border-color 0.15s ease',
            borderRadius: index === 0 ? '8px 8px 0 0' : (index === snippets.length - 1 ? '0 0 8px 8px' : '0')
        });
        
        // Hover effects
        item.addEventListener('mouseenter', () => {
            if (!isExactMatch) {
                item.style.backgroundColor = 'var(--onyx-bg-hover)';
            }
            // Update selected index on hover
            snippetModeState.selectedIndex = index;
            updateSelectionVisuals();
        });
        
        item.addEventListener('mouseleave', () => {
            if (index !== snippetModeState.selectedIndex && !isExactMatch) {
                item.style.backgroundColor = 'transparent';
            }
        });
        
        // Fix: Add mousedown instead of click to handle selection before blur
        item.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent focus loss
            insertSnippet(snippet, true);
        });
        
        picker.appendChild(item);
    });
    
    // Position the picker
    positionPicker(picker, snippetModeState.target!);
}

// Update visual selection
function updateSelectionVisuals() {
    const picker = document.getElementById('onyx-picker');
    if (!picker) return;
    
    const items = picker.querySelectorAll('[data-snippet-index]');
    items.forEach((item, i) => {
        const el = item as HTMLElement;
        el.style.backgroundColor = i === snippetModeState.selectedIndex ? 'var(--onyx-bg-hover)' : 'transparent';
    });
}

// Select a snippet by index
function selectSnippet(index: number) {
    const picker = document.getElementById('onyx-picker');
    if (!picker) return;
    
    snippetModeState.selectedIndex = Math.max(0, Math.min(index, snippetModeState.filteredSnippets.length - 1));
    updateSelectionVisuals();
    
    // Scroll into view
    const items = picker.querySelectorAll('[data-snippet-index]');
    const selectedItem = items[snippetModeState.selectedIndex] as HTMLElement;
    if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
    }
}

// Safe contentEditable insertion that handles Claude.ai's complex DOM structure
function insertIntoContentEditable(target: HTMLElement, content: string, startPos: number) {
    console.log('🔧 Safe contentEditable insertion for Claude.ai');
    
    try {
        // Method 1: Try direct value manipulation if it exists
        if ('value' in target && typeof (target as any).value === 'string') {
            const inputEl = target as any;
            const currentValue = inputEl.value || '';
            const currentPos = currentValue.length; // Use end position as fallback
            
            const before = currentValue.slice(0, startPos);
            const after = currentValue.slice(currentPos);
            const newValue = before + content + after;
            
            inputEl.value = newValue;
            
            // Focus and set cursor
            if (inputEl.focus) inputEl.focus();
            if (inputEl.setSelectionRange) {
                const newPos = before.length + content.length;
                inputEl.setSelectionRange(newPos, newPos);
            }
            
            // Dispatch events
            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
            inputEl.dispatchEvent(new Event('change', { bubbles: true }));
            
            console.log('✅ Used direct value manipulation method');
            return true;
        }
        
        // Method 2: Try textContent manipulation
        if (target.textContent !== null) {
            const currentText = target.textContent || '';
            const before = currentText.slice(0, startPos);
            const after = currentText.slice(Math.max(startPos + snippetModeState.searchQuery.length + 2, before.length)); // +2 for "x/"
            
            target.textContent = before + content + after;
            
            // Try to set focus and cursor
            if (target.focus) target.focus();
            
            // Dispatch events
            target.dispatchEvent(new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: content
            }));
            
            console.log('✅ Used textContent manipulation method');
            return true;
        }
        
        // Method 3: Try innerHTML as last resort
        if (target.innerHTML !== undefined) {
            const currentHTML = target.innerHTML;
            // Simple text replacement for innerHTML
            const before = currentHTML.slice(0, startPos);
            const after = currentHTML.slice(Math.max(startPos + snippetModeState.searchQuery.length + 2, before.length));
            
            target.innerHTML = before + content + after;
            
            if (target.focus) target.focus();
            
            target.dispatchEvent(new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: content
            }));
            
            console.log('✅ Used innerHTML manipulation method');
            return true;
        }
        
        console.log('❌ No suitable insertion method found');
        return false;
        
    } catch (error) {
        console.error('❌ Error in safe contentEditable insertion:', error);
        return false;
    }
}

// Insert the selected snippet (enhanced for Claude.ai)
function insertSnippet(snippet: any, isMagicInjection: boolean = false) {
    if (!snippetModeState.target) return;
    
    const target = snippetModeState.target;
    const startPos = snippetModeState.startPosition;
    const content = snippet.content || '';
    
    console.log('🎯 Inserting snippet:', snippet.title, isMagicInjection ? '(Magic Injection)' : '(Manual)');
    
    try {
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            const inputEl = target as HTMLInputElement | HTMLTextAreaElement;
            const currentValue = inputEl.value;
            const currentPos = inputEl.selectionStart || 0;
            
            // Remove x/ and search query
            const before = currentValue.slice(0, startPos);
            const after = currentValue.slice(currentPos);
            const newValue = before + content + after;
            
            inputEl.value = newValue;
            const newPos = before.length + content.length;
            inputEl.setSelectionRange(newPos, newPos);
            
            // Dispatch events
            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
            inputEl.dispatchEvent(new Event('change', { bubbles: true }));
            
        } else if (target.isContentEditable) {
            // Use safe contentEditable insertion for Claude.ai
            const success = insertIntoContentEditable(target, content, startPos);
            if (!success) {
                console.log('⚠️ Fallback: Using basic textContent replacement');
                const currentText = target.textContent || '';
                const before = currentText.slice(0, startPos);
                const after = currentText.slice(startPos + snippetModeState.searchQuery.length + 2); // +2 for "x/"
                target.textContent = before + content + after;
                
                target.dispatchEvent(new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: content
                }));
            }
        }
        
        // Apply border trace effect for magic injections
        if (isMagicInjection) {
            applyBorderTraceEffect(target);
        }
        
        console.log('✅ Snippet inserted successfully');
    } catch (error) {
        console.error('❌ Error inserting snippet:', error);
    }
    
    // Hide picker and reset
    hidePicker();
}

// Magic injection with border trace effect
function magicallyInjectSnippet(snippet: any) {
    console.log('🪄 Starting magical injection with border trace effect');
    
    // Insert snippet immediately with magic flag
    insertSnippet(snippet, true);
}

// Handle keyboard events in snippet mode
function handleSnippetModeKeyboard(e: KeyboardEvent) {
    // Handle escape key for both snippet mode and glow pulse mode
    if (e.key === 'Escape') {
        e.preventDefault();
        
        // Cancel magical injection if active
        if (snippetModeState.isAnimating) {
            console.log('🛑 Cancelling magical injection');
            snippetModeState.isAnimating = false;
            snippetModeState.animationController = undefined;
        }
        
        // Hide picker if active
        if (snippetModeState.active) {
            hidePicker();
        }
        return;
    }
    
    // Only handle other keys if snippet mode is active and not animating
    if (!snippetModeState.active || snippetModeState.isAnimating) return;
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            e.stopPropagation();
            selectSnippet(snippetModeState.selectedIndex + 1);
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            e.stopPropagation();
            selectSnippet(snippetModeState.selectedIndex - 1);
            break;
            
        case 'Enter':
            if (snippetModeState.filteredSnippets.length > 0) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                const selectedSnippet = snippetModeState.filteredSnippets[snippetModeState.selectedIndex];
                if (selectedSnippet) {
                    insertSnippet(selectedSnippet, true);
                }
                return false;
            }
            break;
            
        case 'Tab':
            if (snippetModeState.filteredSnippets.length > 0) {
                e.preventDefault();
                e.stopPropagation();
                
                const selectedSnippet = snippetModeState.filteredSnippets[snippetModeState.selectedIndex];
                if (selectedSnippet) {
                    insertSnippet(selectedSnippet, true);
                }
            }
            break;
    }
}

// Main input handler
document.addEventListener('input', async (e) => {
    const target = e.target as HTMLElement;
    const isTextInput = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;
    
    if (!isTextInput) return;
    
    let currentText = '';
    let cursorPosition = 0;
    
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const inputEl = target as HTMLInputElement | HTMLTextAreaElement;
        currentText = inputEl.value;
        cursorPosition = inputEl.selectionStart || 0;
    } else {
        // For contentEditable, try multiple methods to get text
        if ('value' in target && typeof (target as any).value === 'string') {
            currentText = (target as any).value;
            cursorPosition = currentText.length;
        } else {
            currentText = target.textContent || target.innerText || '';
            cursorPosition = currentText.length; // Fallback to end position
        }
    }
    
    // Check if we should enter snippet mode
    const beforeCursor = currentText.slice(0, cursorPosition);
    const snippetMatch = beforeCursor.match(/x\/([^\/\s]*)$/);
    
    if (snippetMatch) {
        // Enter or update snippet mode
        const searchQuery = snippetMatch[1] || '';
        const startPosition = snippetMatch.index || 0;
        
        console.log('🔍 Snippet mode active, query:', searchQuery);
        
        // Update state
        snippetModeState.active = true;
        snippetModeState.target = target;
        snippetModeState.startPosition = startPosition;
        snippetModeState.searchQuery = searchQuery;
        snippetModeState.selectedIndex = 0;
        
        // Get and filter snippets from storage
        try {
            // Load all snippets from storage
            const allSnippets = await getSnippetsFromStorage();
            
            // Filter snippets based on search query
            snippetModeState.filteredSnippets = filterSnippets(allSnippets, searchQuery);
            
            // Check for exact match and trigger magical injection
            const exactMatch = findExactMatch(allSnippets, searchQuery);
            if (exactMatch && searchQuery.length > 0) {
                console.log('🎯 Exact match found for:', searchQuery, '-> triggering magical injection');
                
                // Trigger magical injection with border trace effect
                setTimeout(() => {
                    console.log('✨ Starting magical injection with border trace');
                    magicallyInjectSnippet(exactMatch);
                }, 150);
                return;
            }
            
            // Update display
            updatePicker(snippetModeState.filteredSnippets);
            
            // Add event listeners if not already added
            if (!document.getElementById('onyx-picker')) {
                setTimeout(() => {
                    document.addEventListener('click', handleOutsideClick);
                }, 0);
            }
        } catch (error) {
            console.error('Error loading snippets in content script:', error);
            snippetModeState.filteredSnippets = [];
            updatePicker([]);
        }
        
    } else if (snippetModeState.active) {
        // Exit snippet mode if x/ is no longer present
        hidePicker();
    }
});

// Global keyboard handler
document.addEventListener('keydown', (e) => {
    handleSnippetModeKeyboard(e);
}, true);

// CLAUDE.AI SPECIFIC: Smart Enter key blocking
const isClaudeAI = window.location.hostname.includes('claude.ai');

if (isClaudeAI) {
    console.log('🎯 Claude.ai detected - installing smart Enter key blocking');
    
    // Primary blocking layer - highest priority
    document.addEventListener('keydown', (e) => {
        // Block Enter when snippet mode is active (whether picker is visible or not)
        if (e.key === 'Enter' && snippetModeState.active) {
            console.log('🚫 [Claude] Blocking Enter - snippet mode active');
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // If we have snippets and a picker, handle selection
            if (snippetModeState.filteredSnippets.length > 0 && document.getElementById('onyx-picker')) {
                const selectedSnippet = snippetModeState.filteredSnippets[snippetModeState.selectedIndex];
                if (selectedSnippet) {
                    console.log('🎯 Inserting snippet:', selectedSnippet.title);
                    insertSnippet(selectedSnippet, true);
                }
            }
            return false;
        }
    }, true);
    
    // Secondary blocking - keypress events
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && snippetModeState.active) {
            console.log('🚫 [Claude] Backup keypress blocking');
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
    }, true);
    
    // Tertiary blocking - form submission
    document.addEventListener('submit', (e) => {
        if (snippetModeState.active) {
            console.log('🚫 [Claude] Form submission blocking');
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
    }, true);
    
    // Input event blocking for line breaks
    document.addEventListener('beforeinput', (e) => {
        if (snippetModeState.active && (e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph')) {
            console.log('🚫 [Claude] BeforeInput line break blocking');
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    hidePicker();
});