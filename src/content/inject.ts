// Global state for snippet mode
let snippetModeState: {
    active: boolean;
    target: HTMLElement | null;
    startPosition: number;
    searchQuery: string;
    selectedIndex: number;
    filteredSnippets: any[];
    textNode?: Node;
} = {
    active: false,
    target: null,
    startPosition: 0,
    searchQuery: '',
    selectedIndex: 0,
    filteredSnippets: []
};

// Create or reuse a floating overlay element
function getPicker(): HTMLElement {
    let picker = document.getElementById("onyx-picker");
    if (picker) return picker;
  
    picker = document.createElement("div");
    picker.id = "onyx-picker";
    Object.assign(picker.style, {
        position: "absolute",
        background: "#2a2a2a",
        border: "1px solid #404040",
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
    
    // Custom scrollbar for dark mode
    const style = document.createElement('style');
    style.textContent = `
        #onyx-picker::-webkit-scrollbar {
            width: 8px;
        }
        #onyx-picker::-webkit-scrollbar-track {
            background: #2a2a2a;
        }
        #onyx-picker::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 4px;
        }
        #onyx-picker::-webkit-scrollbar-thumb:hover {
            background: #666;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(picker);
    return picker;
}

// Hide the picker and reset snippet mode
function hidePicker() {
    const picker = document.getElementById("onyx-picker");
    if (picker) {
        picker.remove();
    }
    
    // Reset visual indicators (remove subtle visual cues)
    if (snippetModeState.target) {
        // No background color changes to keep it minimal
    }
    
    // Reset state
    snippetModeState = {
        active: false,
        target: null,
        startPosition: 0,
        searchQuery: '',
        selectedIndex: 0,
        filteredSnippets: []
    };
    
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

// Filter snippets based on search query
function filterSnippets(snippets: any[], query: string): any[] {
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

// Highlight matching text in snippet title
function highlightMatch(text: string, query: string): string {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span style="color: #ff0000; font-weight: 500;">$1</span>');
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
            color: '#999',
            fontStyle: 'italic',
            textAlign: 'center'
        });
        picker.appendChild(noResults);
        positionPicker(picker, snippetModeState.target!);
        return;
    }
    
    // Create snippet items (no header for minimal design)
    snippets.forEach((snippet, index) => {
        const item = document.createElement('div');
        item.setAttribute('data-snippet-index', index.toString());
        
        // Create highlighted title
        const highlightedTitle = highlightMatch(snippet.title || `Snippet ${index + 1}`, snippetModeState.searchQuery);
        item.innerHTML = `<div>${highlightedTitle}</div>`;
        
        Object.assign(item.style, {
            padding: '10px 16px',
            cursor: 'pointer',
            backgroundColor: index === snippetModeState.selectedIndex ? '#404040' : 'transparent',
            color: '#e5e5e5',
            borderBottom: index < snippets.length - 1 ? '1px solid #333' : 'none',
            transition: 'background-color 0.15s ease',
            borderRadius: index === 0 ? '8px 8px 0 0' : (index === snippets.length - 1 ? '0 0 8px 8px' : '0')
        });
        
        // Hover effects
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#404040';
            // Update selected index on hover
            snippetModeState.selectedIndex = index;
            updateSelectionVisuals();
        });
        
        item.addEventListener('mouseleave', () => {
            if (index !== snippetModeState.selectedIndex) {
                item.style.backgroundColor = 'transparent';
            }
        });
        
        // Fix: Add mousedown instead of click to handle selection before blur
        item.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent focus loss
            insertSnippet(snippet);
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
        el.style.backgroundColor = i === snippetModeState.selectedIndex ? '#404040' : 'transparent';
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

// Insert the selected snippet
function insertSnippet(snippet: any) {
    if (!snippetModeState.target) return;
    
    const target = snippetModeState.target;
    const startPos = snippetModeState.startPosition;
    const content = snippet.content || '';
    
    console.log('🎯 Inserting snippet:', snippet.title);
    
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
            // Handle contenteditable
            const sel = window.getSelection();
            if (!sel || !sel.focusNode) return;
            
            const textNode = sel.focusNode as Text;
            const text = textNode.textContent || '';
            const currentPos = sel.focusOffset;
            
            // Remove x/ and search query
            const before = text.slice(0, startPos);
            const after = text.slice(currentPos);
            
            textNode.textContent = before + content + after;
            
            // Set cursor position
            const newOffset = before.length + content.length;
            sel.collapse(textNode, newOffset);
            
            // Dispatch events
            target.dispatchEvent(new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: content
            }));
        }
        
        console.log('✅ Snippet inserted successfully');
    } catch (error) {
        console.error('❌ Error inserting snippet:', error);
    }
    
    // Hide picker and reset
    hidePicker();
}

// Handle keyboard events in snippet mode
function handleSnippetModeKeyboard(e: KeyboardEvent) {
    if (!snippetModeState.active) return;
    
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
                    insertSnippet(selectedSnippet);
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
                    insertSnippet(selectedSnippet);
                }
            }
            break;
            
        case 'Escape':
            e.preventDefault();
            hidePicker();
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
        const sel = window.getSelection();
        if (!sel || !sel.focusNode || sel.focusNode.nodeType !== Node.TEXT_NODE) return;
        
        currentText = sel.focusNode.textContent || '';
        cursorPosition = sel.focusOffset;
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
        
        // Get and filter snippets using new storage architecture
        chrome.storage.sync.get(null, async (data) => {
            try {
                // Get the snippet index
                const snippetIndex = data['onyx-index'] || [];
                const allSnippets = [];
                
                // Load each snippet individually
                for (const snippetId of snippetIndex) {
                    const snippetKey = `snippet-${snippetId}`;
                    const snippet = data[snippetKey];
                    if (snippet) {
                        allSnippets.push(snippet);
                    }
                }
                
                // Sort by creation date (newest first)
                allSnippets.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                
                snippetModeState.filteredSnippets = filterSnippets(allSnippets, searchQuery);
                
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
        });
        
    } else if (snippetModeState.active) {
        // Exit snippet mode if x/ is no longer present
        hidePicker();
    }
});

// Global keyboard handler
document.addEventListener('keydown', (e) => {
    handleSnippetModeKeyboard(e);
}, true);

// Special handling for Enter key to prevent form submission in snippet mode
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && snippetModeState.active && snippetModeState.filteredSnippets.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }
}, true);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    hidePicker();
});