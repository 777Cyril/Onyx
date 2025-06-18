// Claude.ai React Root Hijacking Script
// Injects before React initializes to intercept events at the root level
// Runs at document_start to ensure it executes before React loads

console.log('Claude hijacking script loaded at document_start');

// Store original addEventListener to restore later
const originalAddEventListener = EventTarget.prototype.addEventListener;

// Map to track hijacked elements and their listeners
const hijackedElements = new WeakMap<EventTarget, Map<string, Set<EventListener>>>();

// Snippet mode state (separate from content script to avoid conflicts)
let hijackState = {
    active: false,
    pendingSubmission: false,
    lastInputValue: '',
    targetElement: null as HTMLElement | null
};

// Override addEventListener to intercept React's event attachment
EventTarget.prototype.addEventListener = function(type: string, listener: EventListener, options?: boolean | AddEventListenerOptions) {
    // Check if this is likely a React root element
    const isReactRoot = this instanceof HTMLElement && (
        this.id?.includes('root') || 
        this.className?.includes('App') ||
        this.hasAttribute?.('data-reactroot') ||
        (this as HTMLElement).querySelector?.('[data-reactroot]')
    );

    // For React roots, intercept keydown events
    if (isReactRoot && type === 'keydown') {
        console.log('Hijacking keydown listener on React root');
        
        // Store original listener
        if (!hijackedElements.has(this)) {
            hijackedElements.set(this, new Map());
        }
        const elementListeners = hijackedElements.get(this)!;
        if (!elementListeners.has(type)) {
            elementListeners.set(type, new Set());
        }
        elementListeners.get(type)!.add(listener);

        // Create our intercepting listener
        const interceptingListener = (event: Event) => {
            const keyEvent = event as KeyboardEvent;
            
            // Check if we should intercept this Enter keypress
            if (keyEvent.key === 'Enter' && shouldInterceptEnter(keyEvent)) {
                console.log('Intercepting Enter keypress before React processes it');
                
                // Prevent React from processing this event
                keyEvent.preventDefault();
                keyEvent.stopPropagation();
                keyEvent.stopImmediatePropagation();
                
                // Handle snippet selection
                handleSnippetSelection();
                return;
            }
            
            // Allow other events to proceed to React
            if (typeof listener === 'function') {
                listener.call(this, event);
            } else if (listener && typeof listener === 'object' && 'handleEvent' in listener) {
                (listener as EventListenerObject).handleEvent(event);
            }
        };

        // Attach our intercepting listener
        originalAddEventListener.call(this, type, interceptingListener, options);
        return;
    }

    // For all other cases, use original addEventListener
    originalAddEventListener.call(this, type, listener, options);
};

// Check if we should intercept the Enter keypress
function shouldInterceptEnter(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement;
    
    // Must be an input field
    if (!isInputField(target)) return false;
    
    // Get current input value
    const currentValue = getInputValue(target);
    if (!currentValue) return false;
    
    // Check for x/ pattern at the end
    const snippetMatch = currentValue.match(/x\/([^\/\s]*)$/);
    if (!snippetMatch) return false;
    
    console.log('Snippet pattern detected:', snippetMatch[0]);
    hijackState.active = true;
    hijackState.targetElement = target;
    hijackState.lastInputValue = currentValue;
    
    return true;
}

// Check if element is an input field
function isInputField(element: HTMLElement): boolean {
    return element.tagName === 'INPUT' || 
           element.tagName === 'TEXTAREA' || 
           element.isContentEditable;
}

// Get input value from different types of input elements
function getInputValue(element: HTMLElement): string {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        return (element as HTMLInputElement).value;
    } else if (element.isContentEditable) {
        return element.textContent || '';
    }
    return '';
}

// Handle snippet selection by communicating with content script
async function handleSnippetSelection() {
    if (!hijackState.targetElement || !hijackState.lastInputValue) return;
    
    const snippetMatch = hijackState.lastInputValue.match(/x\/([^\/\s]*)$/);
    if (!snippetMatch) return;
    
    const searchQuery = snippetMatch[1] || '';
    console.log('Processing snippet selection for query:', searchQuery);
    
    try {
        // Get snippets from storage (same logic as background script)
        const snippets = await getSnippetsFromStorage();
        const matchedSnippet = findBestMatch(searchQuery, snippets);
        
        if (matchedSnippet) {
            console.log('Found matching snippet:', matchedSnippet.title);
            
            // Directly modify the input value
            insertSnippetDirectly(hijackState.targetElement, matchedSnippet.content, snippetMatch.index!);
        } else {
            console.log('No matching snippet found');
            // Let the original event proceed
            restoreOriginalBehavior();
        }
    } catch (error) {
        console.error('Error in snippet selection:', error);
        restoreOriginalBehavior();
    }
    
    // Reset state
    hijackState.active = false;
    hijackState.targetElement = null;
    hijackState.lastInputValue = '';
}

// Get snippets from Chrome storage
function getSnippetsFromStorage(): Promise<any[]> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(null, (data) => {
            try {
                const snippetIndex = data['onyx-index'] || [];
                const allSnippets = [];
                
                for (const snippetId of snippetIndex) {
                    const snippetKey = `snippet-${snippetId}`;
                    const snippet = data[snippetKey];
                    if (snippet) {
                        allSnippets.push(snippet);
                    }
                }
                
                allSnippets.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                resolve(allSnippets);
            } catch (error) {
                console.error('Error loading snippets:', error);
                resolve([]);
            }
        });
    });
}

// Find best matching snippet
function findBestMatch(query: string, snippets: any[]): any | null {
    if (!query || !snippets.length) return null;

    const lowerQuery = query.toLowerCase().trim();
    
    // Exact match
    let match = snippets.find(snippet => 
        snippet.title.toLowerCase() === lowerQuery
    );
    if (match) return match;
    
    // Starts with
    match = snippets.find(snippet =>
        snippet.title.toLowerCase().startsWith(lowerQuery)
    );
    if (match) return match;
    
    // Contains
    match = snippets.find(snippet =>
        snippet.title.toLowerCase().includes(lowerQuery)
    );
    return match || null;
}

// Insert snippet content directly into the input
function insertSnippetDirectly(target: HTMLElement, content: string, startPos: number) {
    try {
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            const inputEl = target as HTMLInputElement;
            const currentValue = inputEl.value;
            const beforePattern = currentValue.slice(0, startPos);
            const afterCursor = currentValue.slice(inputEl.selectionStart || currentValue.length);
            
            const newValue = beforePattern + content + afterCursor;
            inputEl.value = newValue;
            
            // Set cursor position after inserted content
            const newCursorPos = beforePattern.length + content.length;
            inputEl.setSelectionRange(newCursorPos, newCursorPos);
            
            // Trigger input events to notify React
            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
            inputEl.dispatchEvent(new Event('change', { bubbles: true }));
            
        } else if (target.isContentEditable) {
            const selection = window.getSelection();
            if (selection && selection.focusNode) {
                const textNode = selection.focusNode as Text;
                const text = textNode.textContent || '';
                const beforePattern = text.slice(0, startPos);
                const afterCursor = text.slice(selection.focusOffset);
                
                textNode.textContent = beforePattern + content + afterCursor;
                
                // Set cursor position
                const newOffset = beforePattern.length + content.length;
                selection.collapse(textNode, newOffset);
                
                // Trigger input event
                target.dispatchEvent(new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: content
                }));
            }
        }
        
        console.log('Snippet inserted successfully via hijack method');
    } catch (error) {
        console.error('Error inserting snippet:', error);
    }
}

// Restore original behavior if snippet insertion fails
function restoreOriginalBehavior() {
    // This would simulate the original Enter keypress, but since we've already
    // prevented it, we might need to trigger form submission manually
    // For now, we'll just log that we're falling back
    console.log('Falling back to original behavior');
}

// Monitor for DOM ready to start intercepting React root
function startReactRootInterception() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;
                    
                    // Look for React root indicators
                    if (element.id?.includes('root') || 
                        element.className?.includes('App') ||
                        element.hasAttribute?.('data-reactroot') ||
                        element.querySelector?.('[data-reactroot]')) {
                        
                        console.log('Detected React root element, hijacking complete');
                        // The addEventListener override is already in place
                    }
                }
            });
        });
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

// Initialize when DOM starts loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        startReactRootInterception();
    });
} else {
    startReactRootInterception();
}

console.log('Claude hijacking script initialized and ready');