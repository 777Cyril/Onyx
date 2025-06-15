// Background script for HTTP request interception on Claude.ai
// Primary approach: Network-level interception to bypass React event system

import { storageManager } from './utils/storage';

console.log('Onyx background script initialized');

// Parse request body to extract message content
function parseRequestBody(body: string): { message?: string, parsedBody?: any } {
    try {
        // Handle different content types
        if (body.startsWith('{')) {
            // JSON body
            const parsed = JSON.parse(body);
            return { 
                message: parsed.message || parsed.prompt || parsed.text || parsed.content,
                parsedBody: parsed
            };
        } else if (body.includes('&')) {
            // URL-encoded form data
            const params = new URLSearchParams(body);
            const message = params.get('message') || params.get('prompt') || params.get('text') || undefined;
            return { message };
        }
    } catch (error) {
        console.error('Error parsing request body:', error);
    }
    return {};
}

// Modify request body to replace x/ patterns with snippet content (synchronous)
function modifyRequestBody(body: string): string {
    if (!storageManager.isCacheReady()) {
        console.log('Snippet cache not ready, skipping modification');
        return body;
    }

    const { message, parsedBody } = parseRequestBody(body);
    
    if (!message) return body;
    
    // Check for x/ pattern
    const snippetMatch = message.match(/x\/([^\/\s]*)$/);
    if (!snippetMatch) return body;
    
    const searchQuery = snippetMatch[1] || '';
    console.log('Detected snippet pattern in request:', searchQuery);
    
    // Find matching snippet from storage manager
    const matchedSnippet = storageManager.findSnippetMatch(searchQuery);
    
    if (!matchedSnippet) {
        console.log('No matching snippet found for:', searchQuery);
        return body;
    }
    
    console.log('Found matching snippet:', matchedSnippet.title);
    
    // Replace x/query with snippet content
    const newMessage = message.replace(/x\/[^\/\s]*$/, matchedSnippet.content);
    
    // Reconstruct the request body
    if (parsedBody) {
        // JSON body
        const modifiedBody = { ...parsedBody };
        if (modifiedBody.message) modifiedBody.message = newMessage;
        else if (modifiedBody.prompt) modifiedBody.prompt = newMessage;
        else if (modifiedBody.text) modifiedBody.text = newMessage;
        else if (modifiedBody.content) modifiedBody.content = newMessage;
        
        return JSON.stringify(modifiedBody);
    } else {
        // URL-encoded body
        const params = new URLSearchParams(body);
        if (params.has('message')) params.set('message', newMessage);
        else if (params.has('prompt')) params.set('prompt', newMessage);
        else if (params.has('text')) params.set('text', newMessage);
        
        return params.toString();
    }
}

// Set up webRequest listener for Claude.ai (synchronous)
chrome.webRequest.onBeforeRequest.addListener(
    (details): chrome.webRequest.BlockingResponse => {
        // Only intercept POST requests with body content
        if (details.method !== 'POST' || !details.requestBody) {
            return {};
        }

        console.log('Intercepting Claude.ai request:', details.url);

        try {
            let bodyContent = '';
            
            // Extract body content from different formats
            if (details.requestBody.formData) {
                // Form data
                const formData = details.requestBody.formData;
                const params = new URLSearchParams();
                for (const [key, values] of Object.entries(formData)) {
                    if (Array.isArray(values)) {
                        params.set(key, values[0]);
                    }
                }
                bodyContent = params.toString();
            } else if (details.requestBody.raw) {
                // Raw data (usually JSON)
                const decoder = new TextDecoder();
                for (const rawData of details.requestBody.raw) {
                    bodyContent += decoder.decode(rawData.bytes);
                }
            }

            if (!bodyContent) return {};

            // Modify the body content synchronously
            const modifiedBody = modifyRequestBody(bodyContent);
            
            if (modifiedBody === bodyContent) {
                // No changes needed
                return {};
            }

            console.log('Modified request body for snippet injection');

            // Note: onBeforeRequest cannot modify request body in Chrome Extensions
            // This would require a different approach like using redirectUrl with a data URL
            // or using onBeforeSendHeaders to modify headers
            // For now, we'll use console logging to track modifications
            console.log('Would modify body to:', modifiedBody.substring(0, 100) + '...');
            return {};

        } catch (error) {
            console.error('Error intercepting request:', error);
            return {};
        }
    },
    {
        urls: [
            "https://claude.ai/api/*",
            "https://claude.ai/chats/*", 
            "https://claude.ai/chat/*",
            "https://*.anthropic.com/api/*"
        ]
    },
    ["blocking", "requestBody"]
);

// Initialize storage manager when background script loads
storageManager.initializeCache();

console.log('Claude.ai HTTP request interception enabled');