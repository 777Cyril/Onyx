import type { Snippet } from "./types/snippet";

const STORAGE_KEY = "onyx-snippets";

/** Fetch all snippets from chrome.storage.sync */
export async function getSnippets(): Promise<Snippet[]> {
  const data = await chrome.storage.sync.get(STORAGE_KEY);
  return (data[STORAGE_KEY] as Snippet[]) ?? [];
}

/** Persist the full snippet array */
async function saveSnippets(snippets: Snippet[]): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEY]: snippets });
}

/** Add a new snippet */
export async function addSnippet(snippet: Snippet): Promise<void> {
  const list = await getSnippets();
  list.push(snippet);
  await saveSnippets(list);
}

/** Update an existing snippet by id */
export async function updateSnippet(snippet: Snippet): Promise<void> {
  const list = (await getSnippets()).map((s) =>
    s.id === snippet.id ? snippet : s
  );
  await saveSnippets(list);
}

/** Remove a snippet by id */
export async function deleteSnippet(id: string): Promise<void> {
  const list = (await getSnippets()).filter((s) => s.id !== id);
  await saveSnippets(list);
}
