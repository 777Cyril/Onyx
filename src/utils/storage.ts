// Centralized storage utility for Onyx extension
// Handles snippet loading, caching, and synchronization

export interface Snippet {
    id: string;
    title: string;
    content: string;
    createdAt: number;
}

export class StorageManager {
    private static instance: StorageManager;
    private snippetCache: Snippet[] = [];
    private cacheReady = false;
    private cachePromise: Promise<void> | null = null;

    private constructor() {}

    static getInstance(): StorageManager {
        if (!StorageManager.instance) {
            StorageManager.instance = new StorageManager();
        }
        return StorageManager.instance;
    }

    // Initialize cache - can be called multiple times safely
    async initializeCache(): Promise<void> {
        if (this.cachePromise) {
            return this.cachePromise;
        }

        this.cachePromise = new Promise((resolve, reject) => {
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
                    
                    this.snippetCache = allSnippets;
                    this.cacheReady = true;
                    console.log('Snippet cache initialized with', allSnippets.length, 'snippets');
                    resolve();
                } catch (error) {
                    console.error('Error loading snippets:', error);
                    this.cacheReady = true; // Mark as ready even on error
                    reject(error);
                }
            });
        });

        return this.cachePromise;
    }

    // Get all snippets (returns cached version if available)
    async getSnippets(): Promise<Snippet[]> {
        if (!this.cacheReady) {
            await this.initializeCache();
        }
        return [...this.snippetCache]; // Return copy to prevent mutations
    }

    // Get snippets synchronously (for background script usage)
    getSnippetsSync(): Snippet[] {
        if (!this.cacheReady) {
            console.warn('Snippet cache not ready, returning empty array');
            return [];
        }
        return [...this.snippetCache];
    }

    // Check if cache is ready
    isCacheReady(): boolean {
        return this.cacheReady;
    }

    // Filter snippets based on search query
    filterSnippets(query: string): Snippet[] {
        const snippets = this.getSnippetsSync();
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

    // Find exact match by title
    findExactMatch(query: string): Snippet | null {
        if (!query.trim()) return null;
        
        const snippets = this.getSnippetsSync();
        const exactMatch = snippets.find(snippet => 
            snippet.title.toLowerCase() === query.toLowerCase().trim()
        );
        return exactMatch || null;
    }

    // Find snippet by fuzzy matching (exact, starts with, contains)
    findSnippetMatch(query: string): Snippet | null {
        if (!query) return null;

        const snippets = this.getSnippetsSync();
        const lowerQuery = query.toLowerCase().trim();
        
        // First try exact match
        const exactMatch = snippets.find(snippet => 
            snippet.title.toLowerCase() === lowerQuery
        );
        if (exactMatch) return exactMatch;
        
        // Then try starts with match
        const startsWithMatch = snippets.find(snippet =>
            snippet.title.toLowerCase().startsWith(lowerQuery)
        );
        if (startsWithMatch) return startsWithMatch;
        
        // Finally try contains match
        const containsMatch = snippets.find(snippet =>
            snippet.title.toLowerCase().includes(lowerQuery)
        );
        return containsMatch || null;
    }

    // Invalidate cache (call when storage changes)
    invalidateCache(): void {
        this.cacheReady = false;
        this.cachePromise = null;
        this.snippetCache = [];
        console.log('Snippet cache invalidated');
    }

    // Refresh cache immediately
    async refreshCache(): Promise<void> {
        this.invalidateCache();
        await this.initializeCache();
    }
}

// Export singleton instance
export const storageManager = StorageManager.getInstance();

// Setup storage change listener
if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.onChanged.addListener((_changes, namespace) => {
        if (namespace === 'sync') {
            console.log('Storage changed, invalidating cache');
            storageManager.invalidateCache();
        }
    });
}