import { LitElement, html, css } from "lit";
import { state } from "lit/decorators.js";
import { getSnippets, addSnippet, updateSnippet, deleteSnippet, validateStorageSize, validateStorageUpdateSize, getStorageInfo } from "../storage";

class OnyxOptions extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      font-family: system-ui, sans-serif;
    }

    h1 {
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }
    p {
      margin-bottom: 1rem;
      color: #555;
    }

    form {
      margin-bottom: 1rem;
    }
    input,
    textarea {
      width: 100%;
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      font-size: 0.9rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    ul {
      list-style: none;
      padding: 0;
    }
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e0e0e0;
    }
    li:last-child {
      border-bottom: none;
    }
    .snippet-info {
      flex: 1;
    }
    .controls {
      display: flex;
      gap: 0.5rem;
    }
    .controls button {
      background: transparent;
      color: #888;
      font-size: 1rem;
    }
    .controls button:hover {
      color: #000;
    }

    /* Storage info styles */
    .storage-info {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      font-size: 0.85rem;
    }

    .storage-info h3 {
      margin: 0 0 0.75rem 0;
      font-size: 1rem;
      color: #333;
    }

    .storage-info .storage-bar {
      width: 100%;
      height: 6px;
      background: #e0e0e0;
      border-radius: 3px;
      margin: 0.75rem 0;
      overflow: hidden;
    }

    .storage-info .storage-fill {
      height: 100%;
      background: #666;
      transition: all 0.3s ease;
      border-radius: 3px;
    }

    .storage-info .storage-fill.warning {
      background: #f59e0b;
    }

    .storage-info .storage-fill.danger {
      background: #ef4444;
    }

    .storage-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #666;
      font-size: 0.8rem;
    }
  `;

  @state()
  snippets: any[] = [];

  @state()
  editingId: string | null = null;

  @state()
  newTitle = "";

  @state()
  newContent = "";

  @state()
  errorMessage = "";

  @state()
  storageInfo: any = null;

  async firstUpdated() {
    this.snippets = await getSnippets();
    await this.updateStorageInfo();
    this.requestUpdate();
  }

  async updateStorageInfo() {
    try {
      this.storageInfo = await getStorageInfo();
      this.requestUpdate();
    } catch (error) {
      console.error('Error updating storage info:', error);
    }
  }

  private async handleDeleteSnippet(id: string) {
    // Delete using new storage method
    await deleteSnippet(id);
    this.snippets = await getSnippets();
    await this.updateStorageInfo();
    this.requestUpdate();
  }

  private handleEditSnippet(id: string) {
    const toEdit = this.snippets.find((s) => s.id === id);
    if (!toEdit) return;
    this.newTitle = toEdit.title;
    this.newContent = toEdit.content;
    this.editingId = id;
    this.requestUpdate();
  }

  private async handleSaveSnippet(e: Event) {
    e.preventDefault();
    const title = this.newTitle.trim();
    const content = this.newContent.trim();
    if (!title || !content) return;

    this.errorMessage = "";

    try {
      if (this.editingId) {
        // Update existing snippet
        const updatedSnippet = {
          id: this.editingId,
          title,
          content,
          createdAt: Date.now(),
        };

        // Validate storage size for update
        const validation = await validateStorageUpdateSize(updatedSnippet);
        if (!validation.isValid) {
          if (validation.projectedSize > validation.maxSize) {
            const sizeDiff = validation.projectedSize - validation.maxSize;
            this.errorMessage = `Snippet too large! Exceeds individual item limit by ${sizeDiff} bytes. Try shortening the content.`;
          } else {
            this.errorMessage = `Cannot update: would exceed maximum number of items (${validation.maxItems}).`;
          }
          this.requestUpdate();
          return;
        }

        // Update using new storage method
        await updateSnippet(updatedSnippet);
        this.snippets = await getSnippets();
        await this.updateStorageInfo();
        this.editingId = null;
      } else {
        // Add new snippet
        const newSnippet = {
          id: crypto.randomUUID(),
          title,
          content,
          createdAt: Date.now(),
        };

        // Validate storage size for new snippet
        const validation = await validateStorageSize(newSnippet);
        if (!validation.isValid) {
          if (validation.projectedSize > validation.maxSize) {
            const sizeDiff = validation.projectedSize - validation.maxSize;
            this.errorMessage = `Snippet too large! Exceeds individual item limit by ${sizeDiff} bytes. Try shortening the content.`;
          } else {
            this.errorMessage = `Cannot add snippet: would exceed maximum number of items (${validation.maxItems}).`;
          }
          this.requestUpdate();
          return;
        }

        // Add using new storage method
        await addSnippet(newSnippet);
        this.snippets = await getSnippets();
        await this.updateStorageInfo();
      }
    } catch (error) {
      console.error('Error saving snippet:', error);
      this.errorMessage = 'Failed to save snippet. Please try again.';
      this.requestUpdate();
      return;
    }

    // Clear state variables
    this.newTitle = "";
    this.newContent = "";
    
    // Force immediate DOM clearing to ensure inputs are visually cleared
    setTimeout(() => {
      // Use more specific selector to target the form inputs
      const titleInput = this.shadowRoot?.querySelector('form input[type="text"]') as HTMLInputElement;
      const contentTextarea = this.shadowRoot?.querySelector('form textarea') as HTMLTextAreaElement;
      
      if (titleInput) {
        titleInput.value = "";
        titleInput.blur(); // Remove focus to prevent cached values
      }
      if (contentTextarea) {
        contentTextarea.value = "";
        contentTextarea.blur(); // Remove focus to prevent cached values
      }
    }, 0);
    
    this.requestUpdate();
  }

  render() {
    return html`
      <h1>Onyx • Options</h1>
      <p>Manage your saved snippets below:</p>

      <!-- Storage info -->
      ${this.storageInfo ? html`
        <div class="storage-info">
          <h3>Storage Information</h3>
          <div class="storage-stats">
            <span>Items used</span>
            <span>${this.storageInfo.itemCount}/${this.storageInfo.maxItems} items (${Math.round(this.storageInfo.percentUsed)}%)</span>
          </div>
          <div class="storage-bar">
            <div class="storage-fill ${this.storageInfo.percentUsed > 85 ? 'danger' : this.storageInfo.percentUsed > 70 ? 'warning' : ''}"
                 style="width: ${Math.min(this.storageInfo.percentUsed, 100)}%"></div>
          </div>
          <div style="color: #666; font-size: 0.75rem; margin-top: 0.5rem;">
            With individual item storage, you can now store up to ${this.storageInfo.maxItems} prompts with virtually unlimited content per prompt.
          </div>
        </div>
      ` : ''}

      ${this.errorMessage ? html`
        <div style="background: #fee; border: 1px solid #f00; padding: 0.75rem; margin-bottom: 1rem; border-radius: 4px; color: #d00;">
          ${this.errorMessage}
        </div>
      ` : ''}

      <form @submit=${this.handleSaveSnippet}>
        <input
          type="text"
          placeholder="Title"
          .value=${this.newTitle}
          @input=${(e: any) => (this.newTitle = e.target.value)}
        />
        <br />
        <textarea
          rows="2"
          placeholder="Content"
          .value=${this.newContent}
          @input=${(e: any) => (this.newContent = e.target.value)}
        ></textarea>
        <br />
        <button type="submit">
          ${this.editingId ? "Update Snippet" : "Add Snippet"}
        </button>
      </form>

      <ul>
        ${this.snippets.map(
          (snippet) => html`
            <li>
              <div class="snippet-info">
                <strong>${snippet.title}</strong> – ${snippet.content}
              </div>
              <div class="controls">
                <button
                  @click=${() => this.handleEditSnippet(snippet.id)}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  @click=${() => this.handleDeleteSnippet(snippet.id)}
                  title="Delete"
                >
                  ✖
                </button>
              </div>
            </li>
          `
        )}
      </ul>
    `;
  }
}

customElements.define("onyx-options", OnyxOptions);

// Mount into options.html
const container = document.getElementById("app");
if (container) {
  container.appendChild(document.createElement("onyx-options"));
}
