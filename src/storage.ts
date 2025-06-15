import type { Snippet } from "./types/snippet";

// Storage keys
const SNIPPET_INDEX_KEY = "onyx-index";
const SNIPPET_KEY_PREFIX = "snippet-";
const LEGACY_STORAGE_KEY = "onyx-snippets";

// Chrome storage.sync limits
const CHROME_SYNC_QUOTA_BYTES_PER_ITEM = 8192; // 8KB limit per storage item
const CHROME_SYNC_MAX_ITEMS = 512; // Max items in sync storage
const WARNING_THRESHOLD_ITEM = 7000; // Warn when individual item approaches limit (85% of max)
const WARNING_THRESHOLD_TOTAL = 400; // Warn when approaching max items (80% of 512)

/** Migrate legacy data from array-based storage to individual items */
async function migrateLegacyData(): Promise<void> {
  try {
    const legacyData = await chrome.storage.sync.get(LEGACY_STORAGE_KEY);
    const legacySnippets = legacyData[LEGACY_STORAGE_KEY] as Snippet[];
    
    if (legacySnippets && Array.isArray(legacySnippets) && legacySnippets.length > 0) {
      console.log(`Migrating ${legacySnippets.length} snippets from legacy storage...`);
      
      // Create individual items for each snippet
      const storageUpdates: Record<string, any> = {};
      const snippetIds: string[] = [];
      
      for (const snippet of legacySnippets) {
        const snippetKey = `${SNIPPET_KEY_PREFIX}${snippet.id}`;
        storageUpdates[snippetKey] = snippet;
        snippetIds.push(snippet.id);
      }
      
      // Store the index
      storageUpdates[SNIPPET_INDEX_KEY] = snippetIds;
      
      // Save all at once
      await chrome.storage.sync.set(storageUpdates);
      
      // Remove legacy storage
      await chrome.storage.sync.remove(LEGACY_STORAGE_KEY);
      
      console.log('Migration completed successfully');
    }
  } catch (error) {
    console.error('Error during migration:', error);
    // Don't throw - fallback to empty state
  }
}

/** Get snippet index (list of all snippet IDs) */
async function getSnippetIndex(): Promise<string[]> {
  const data = await chrome.storage.sync.get(SNIPPET_INDEX_KEY);
  return (data[SNIPPET_INDEX_KEY] as string[]) ?? [];
}

/** Update snippet index */
async function updateSnippetIndex(snippetIds: string[]): Promise<void> {
  await chrome.storage.sync.set({ [SNIPPET_INDEX_KEY]: snippetIds });
}

/** Fetch all snippets using individual item storage */
export async function getSnippets(): Promise<Snippet[]> {
  try {
    // First check if we need to migrate legacy data
    await migrateLegacyData();
    
    // Get the snippet index
    const snippetIds = await getSnippetIndex();
    
    if (snippetIds.length === 0) {
      return [];
    }
    
    // Create keys for all snippets
    const snippetKeys = snippetIds.map(id => `${SNIPPET_KEY_PREFIX}${id}`);
    
    // Fetch all snippets at once
    const data = await chrome.storage.sync.get(snippetKeys);
    
    // Convert to array and filter out any missing snippets
    const snippets: Snippet[] = [];
    for (const id of snippetIds) {
      const snippetKey = `${SNIPPET_KEY_PREFIX}${id}`;
      const snippet = data[snippetKey] as Snippet;
      if (snippet) {
        snippets.push(snippet);
      }
    }
    
    // Sort by creation date (newest first)
    return snippets.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    
  } catch (error) {
    console.error('Error loading snippets:', error);
    return [];
  }
}

/** Calculate the storage size in bytes for a single snippet */
export function calculateSnippetSize(snippet: Snippet): number {
  const snippetKey = `${SNIPPET_KEY_PREFIX}${snippet.id}`;
  const dataString = JSON.stringify({ [snippetKey]: snippet });
  return new TextEncoder().encode(dataString).length;
}

/** Add a new snippet using individual item storage */
export async function addSnippet(snippet: Snippet): Promise<void> {
  const snippetKey = `${SNIPPET_KEY_PREFIX}${snippet.id}`;
  
  // Store the snippet
  await chrome.storage.sync.set({ [snippetKey]: snippet });
  
  // Update the index
  const currentIndex = await getSnippetIndex();
  const newIndex = [snippet.id, ...currentIndex.filter(id => id !== snippet.id)];
  await updateSnippetIndex(newIndex);
}

/** Update an existing snippet by id */
export async function updateSnippet(snippet: Snippet): Promise<void> {
  const snippetKey = `${SNIPPET_KEY_PREFIX}${snippet.id}`;
  
  // Update the snippet
  await chrome.storage.sync.set({ [snippetKey]: snippet });
  
  // Ensure it's in the index (in case of any inconsistencies)
  const currentIndex = await getSnippetIndex();
  if (!currentIndex.includes(snippet.id)) {
    const newIndex = [snippet.id, ...currentIndex];
    await updateSnippetIndex(newIndex);
  }
}

/** Remove a snippet by id */
export async function deleteSnippet(id: string): Promise<void> {
  const snippetKey = `${SNIPPET_KEY_PREFIX}${id}`;
  
  // Remove the snippet
  await chrome.storage.sync.remove(snippetKey);
  
  // Update the index
  const currentIndex = await getSnippetIndex();
  const newIndex = currentIndex.filter(snippetId => snippetId !== id);
  await updateSnippetIndex(newIndex);
}

/** Check if adding a new snippet would exceed storage limits */
export async function validateStorageSize(newSnippet: Snippet): Promise<{
  isValid: boolean;
  currentSize: number;
  projectedSize: number;
  maxSize: number;
  warningThreshold: number;
  itemCount: number;
  maxItems: number;
}> {
  const snippetSize = calculateSnippetSize(newSnippet);
  const currentIndex = await getSnippetIndex();
  const currentItemCount = currentIndex.length + 1; // +1 for the index itself
  
  return {
    isValid: snippetSize <= CHROME_SYNC_QUOTA_BYTES_PER_ITEM && currentItemCount < CHROME_SYNC_MAX_ITEMS,
    currentSize: 0, // Not applicable for individual items
    projectedSize: snippetSize,
    maxSize: CHROME_SYNC_QUOTA_BYTES_PER_ITEM,
    warningThreshold: WARNING_THRESHOLD_ITEM,
    itemCount: currentItemCount,
    maxItems: CHROME_SYNC_MAX_ITEMS
  };
}

/** Check if updating an existing snippet would exceed storage limits */
export async function validateStorageUpdateSize(updatedSnippet: Snippet): Promise<{
  isValid: boolean;
  currentSize: number;
  projectedSize: number;
  maxSize: number;
  warningThreshold: number;
  itemCount: number;
  maxItems: number;
}> {
  const snippetSize = calculateSnippetSize(updatedSnippet);
  const currentIndex = await getSnippetIndex();
  const currentItemCount = currentIndex.length + 1; // +1 for the index itself
  
  return {
    isValid: snippetSize <= CHROME_SYNC_QUOTA_BYTES_PER_ITEM,
    currentSize: 0, // Not applicable for individual items
    projectedSize: snippetSize,
    maxSize: CHROME_SYNC_QUOTA_BYTES_PER_ITEM,
    warningThreshold: WARNING_THRESHOLD_ITEM,
    itemCount: currentItemCount,
    maxItems: CHROME_SYNC_MAX_ITEMS
  };
}

/** Get current storage usage information */
export async function getStorageInfo(): Promise<{
  currentSize: number;
  maxSize: number;
  warningThreshold: number;
  percentUsed: number;
  isNearLimit: boolean;
  itemCount: number;
  maxItems: number;
}> {
  const snippetIds = await getSnippetIndex();
  const itemCount = snippetIds.length + 1; // +1 for the index itself
  const percentUsed = (itemCount / CHROME_SYNC_MAX_ITEMS) * 100;
  
  return {
    currentSize: itemCount,
    maxSize: CHROME_SYNC_MAX_ITEMS,
    warningThreshold: WARNING_THRESHOLD_TOTAL,
    percentUsed,
    isNearLimit: itemCount >= WARNING_THRESHOLD_TOTAL,
    itemCount,
    maxItems: CHROME_SYNC_MAX_ITEMS
  };
}
