import { LitElement, html, css } from "lit";
import { state } from "lit/decorators.js";
import { getSnippets, addSnippet, updateSnippet, deleteSnippet, validateStorageSize, validateStorageUpdateSize } from "../storage";


class OnyxPopup extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: #1a1a1a;
      color: #e5e5e5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      width: 400px;
      height: 600px;
      margin: 0;
      position: relative;
      overflow: hidden;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #404040;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    /* Header */
    .header {
      background: #2a2a2a;
      padding: 1rem 1rem 0.75rem;
      border-bottom: 1px solid #333;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #fff;
      letter-spacing: -0.02em;
    }

    .tagline {
      margin: 0.125rem 0 0;
      font-size: 0.75rem;
      color: #999;
      font-weight: 400;
    }

    /* Main content area */
    .content {
      padding: 1rem;
      overflow-y: auto;
      height: calc(100% - 80px);
      background: #1a1a1a;
    }

    /* Search bar - now at the top */
    .search-container {
      margin-bottom: 1rem;
    }

    .search-input {
      width: 100%;
      background: #2a2a2a;
      border: 1px solid #333;
      color: #e5e5e5;
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
      border-radius: 6px;
      outline: none;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .search-input:focus {
      border-color: #000;
      background: #222;
    }

    .search-input::placeholder {
      color: #666;
    }

    /* Form styling */
    form {
      background: #2a2a2a;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
      transition: border-color 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    form:focus-within {
      border-color: #404040;
    }

    input,
    textarea {
      width: 100%;
      background: #1a1a1a;
      border: 1px solid #333;
      color: #e5e5e5;
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
      border-radius: 6px;
      outline: none;
      transition: all 0.2s ease;
      font-family: inherit;
      resize: none;
      box-sizing: border-box;
      margin: 0;
    }

    input:focus,
    textarea:focus {
      border-color: #000;
      background: #222;
    }

    input::placeholder,
    textarea::placeholder {
      color: #666;
    }

    /* Button styling */
    button[type="submit"] {
      background: #000;
      color: #fff;
      border: none;
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
      font-weight: 500;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      font-family: inherit;
      margin: 0;
    }

    button[type="submit"]:hover {
      background: #222;
      transform: translateY(-1px);
    }

    button[type="submit"]:active {
      transform: translateY(0);
    }

    /* Snippets list */
    .snippets-section {
      margin-top: 1rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .section-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #666;
      font-weight: 600;
    }

    .snippet-count {
      font-size: 0.75rem;
      color: #666;
      background: #2a2a2a;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      background: #2a2a2a;
      border: 1px solid #333;
      border-radius: 6px;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    li:hover {
      border-color: #404040;
      background: #2d2d2d;
    }

    .snippet-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.25rem;
    }

    .snippet-title {
      font-weight: 500;
      color: #fff;
      font-size: 0.875rem;
      margin: 0;
      flex: 1;
    }

    .snippet-content {
      font-size: 0.75rem;
      color: #999;
      line-height: 1.4;
      margin: 0;
      word-break: break-word;
      max-height: 2.5rem;
      overflow: hidden;
      position: relative;
    }

    .snippet-content::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 1.5rem;
      background: linear-gradient(to bottom, transparent, #2a2a2a);
    }

    li:hover .snippet-content::after {
      background: linear-gradient(to bottom, transparent, #2d2d2d);
    }

    /* Action buttons */
    .actions {
      display: flex;
      gap: 0.25rem;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    li:hover .actions {
      opacity: 1;
    }

    .action-btn {
      background: transparent;
      border: 1px solid transparent;
      color: #666;
      padding: 0.375rem;
      font-size: 0.875rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
    }

    .action-btn:hover {
      color: #e5e5e5;
      background: #333;
      border-color: #404040;
    }

    .action-btn.edit:hover {
      color: #000;
      border-color: #000;
      background: #e5e5e5;
    }

    .action-btn.delete:hover {
      color: #ef4444;
      border-color: #ef4444;
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 2rem 1rem;
      color: #666;
    }

    .empty-text {
      font-size: 0.8125rem;
      line-height: 1.4;
    }

    /* Edit mode indicator */
    form.editing {
      border-color: #000;
      background: #1a1a1a;
    }


    /* SVG icon styles */
    .icon-edit {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
    }

    /* Message styles */
    .message {
      padding: 0.75rem;
      margin-bottom: 1rem;
      border-radius: 6px;
      font-size: 0.8125rem;
      line-height: 1.4;
    }

    .message.error {
      background: #2d1b1b;
      border: 1px solid #ef4444;
      color: #fca5a5;
    }

    .message.success {
      background: #1b2d1b;
      border: 1px solid #22c55e;
      color: #86efac;
    }


  `;

  @state()
  snippets: any[] = [];

  @state()
  private newTitle = "";

  @state()
  private newContent = "";

  @state()
  editingId: string | null = null;

  @state()
  private searchQuery = "";

  @state()
  private filteredSnippets: any[] = [];

  @state()
  private errorMessage = "";

  @state()
  private showSuccess = false;


  async connectedCallback() {
    super.connectedCallback();
    await this.loadSnippets();
  }

  async loadSnippets() {
    try {
      this.snippets = await getSnippets();
      this.filterSnippets();
      this.requestUpdate();
    } catch (error) {
      console.error('Error loading snippets:', error);
      this.snippets = [];
      this.filteredSnippets = [];
    }
  }

  filterSnippets() {
    if (!this.searchQuery.trim()) {
      this.filteredSnippets = [...this.snippets];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredSnippets = this.snippets.filter(snippet => {
      const titleMatch = (snippet.title || '').toLowerCase().includes(query);
      const contentMatch = (snippet.content || '').toLowerCase().includes(query);
      return titleMatch || contentMatch;
    });
  }

  private handleSearch(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.filterSnippets();
    this.requestUpdate();
  }


  private clearMessages() {
    this.errorMessage = "";
    this.showSuccess = false;
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.showSuccess = false;
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      this.errorMessage = "";
      this.requestUpdate();
    }, 5000);
  }

  private showSuccessMessage() {
    this.showSuccess = true;
    this.errorMessage = "";
    // Auto-clear success after 3 seconds
    setTimeout(() => {
      this.showSuccess = false;
      this.requestUpdate();
    }, 3000);
  }

  private clearForm() {
    // Clear state variables
    this.newTitle = "";
    this.newContent = "";
    this.editingId = null;
    
    // Force immediate DOM clearing to ensure inputs are visually cleared
    setTimeout(() => {
      // Use more specific selector to target the form title input, not the search input
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

  private scrollToForm() {
    setTimeout(() => {
      const form = this.shadowRoot?.querySelector('form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  private async handleAddSnippet(e: Event) {
    e.preventDefault();
    const title = this.newTitle.trim();
    const content = this.newContent.trim();
    if (!title || !content) return;

    this.clearMessages();

    try {
      if (this.editingId) {
        // Update existing snippet
        const updatedSnippet = {
          id: this.editingId,
          title,
          content,
          createdAt: Date.now()
        };

        // Validate storage size for update
        const validation = await validateStorageUpdateSize(updatedSnippet);
        if (!validation.isValid) {
          if (validation.projectedSize > validation.maxSize) {
            const sizeDiff = validation.projectedSize - validation.maxSize;
            this.showError(`Prompt too large! Exceeds individual item limit by ${sizeDiff} bytes. Try shortening the content.`);
          } else {
            this.showError(`Cannot update: would exceed maximum number of items (${validation.maxItems}).`);
          }
          return;
        }

        // Update using new storage method
        await updateSnippet(updatedSnippet);
        this.snippets = await getSnippets();
      } else {
        // Add new snippet
        const newSnippet = {
          id: crypto.randomUUID(),
          title,
          content,
          createdAt: Date.now()
        };

        // Validate storage size for new snippet
        const validation = await validateStorageSize(newSnippet);
        if (!validation.isValid) {
          if (validation.projectedSize > validation.maxSize) {
            const sizeDiff = validation.projectedSize - validation.maxSize;
            this.showError(`Prompt too large! Exceeds individual item limit by ${sizeDiff} bytes. Try shortening the content.`);
          } else {
            this.showError(`Cannot add prompt: would exceed maximum number of items (${validation.maxItems}).`);
          }
          return;
        }

        // Add using new storage method
        await addSnippet(newSnippet);
        this.snippets = await getSnippets();
      }

      // Clear form fields using dedicated method
      this.clearForm();
      
      // Update filtered list
      this.filterSnippets();
      
      // Show success message
      this.showSuccessMessage();
      
      this.requestUpdate();
    } catch (error) {
      console.error('Error saving snippet:', error);
      this.showError('Failed to save prompt. Please try again.');
    }
  }

  private async handleDeleteSnippet(id: string) {
    const snippet = this.snippets.find(s => s.id === id);
    if (!snippet) return;

    const confirmed = confirm(`Delete "${snippet.title}"?`);
    if (!confirmed) return;

    try {
      // Delete using new storage method
      await deleteSnippet(id);
      this.snippets = await getSnippets();
      this.filterSnippets();
      this.requestUpdate();
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  }

  private handleEditSnippet(id: string) {
    const toEdit = this.snippets.find(s => s.id === id);
    if (!toEdit) return;
    this.newTitle = toEdit.title;
    this.newContent = toEdit.content;
    this.editingId = id;
    this.requestUpdate();
    this.scrollToForm();
  }

  private handleCancelEdit() {
    this.clearForm();
  }

  render() {
    return html`
      <div class="header">
        <h1>Onyx</h1>
        <p class="tagline">Minimal. Fast. Ready.</p>
      </div>
      
      <div class="content">
        <!-- Search bar now always at the top -->
        <div class="search-container">
          <input
            type="text"
            class="search-input"
            placeholder="Search prompts..."
            .value=${this.searchQuery}
            @input=${this.handleSearch}
          />
        </div>


        <!-- Error/Success messages -->
        ${this.errorMessage ? html`
          <div class="message error">
            ${this.errorMessage}
          </div>
        ` : ''}
        
        ${this.showSuccess ? html`
          <div class="message success">
            ✅ Prompt saved successfully!
          </div>
        ` : ''}

        <form @submit=${this.handleAddSnippet} class=${this.editingId ? 'editing' : ''}>
          <input
            type="text"
            placeholder="Prompt title"
            .value=${this.newTitle}
            @input=${(e: any) => (this.newTitle = e.target.value)}
            required
          />
          <div>
            <textarea
              rows="3"
              placeholder="Prompt content"
              .value=${this.newContent}
              @input=${(e: any) => {
                this.newContent = e.target.value;
                this.requestUpdate(); // Force real-time updates
              }}
              required
            ></textarea>
          </div>
          <button type="submit">
            ${this.editingId ? "Update Prompt" : "Add Prompt"}
          </button>
          ${this.editingId ? html`
            <button 
              type="button" 
              @click=${this.handleCancelEdit}
              style="background: transparent; color: #666; margin-top: 0.5rem; border: 1px solid #333;"
            >
              Cancel
            </button>
          ` : ''}
        </form>
        
        <div class="snippets-section">
          <div class="section-header">
            <h2 class="section-title">My Prompts</h2>
            <span class="snippet-count">${this.filteredSnippets.length}</span>
          </div>
          
          ${this.filteredSnippets.length === 0 && this.snippets.length === 0 ? html`
            <div class="empty-state">
              <p class="empty-text">
                No snippets yet.<br>
                Create your first snippet above.
              </p>
            </div>
          ` : this.filteredSnippets.length === 0 && this.searchQuery ? html`
            <div class="empty-state">
              <p class="empty-text">
                No prompts match your search.
              </p>
            </div>
          ` : html`
            <ul>
              ${this.filteredSnippets.map(
                (snippet) => html`
                  <li>
                    <div class="snippet-header">
                      <h3 class="snippet-title">${snippet.title}</h3>
                      <div class="actions">
                        <button
                          class="action-btn edit"
                          @click=${() => this.handleEditSnippet(snippet.id)}
                          title="Edit snippet"
                        >
                          <svg class="icon-edit" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </button>
                        <button
                          class="action-btn delete"
                          @click=${() => this.handleDeleteSnippet(snippet.id)}
                          title="Delete snippet"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p class="snippet-content">${snippet.content}</p>
                  </li>
                `
              )}
            </ul>
          `}
        </div>
      </div>
    `;
  }
}

customElements.define("onyx-popup", OnyxPopup);

// Mount into your HTML
const container = document.getElementById("app");
if (container) {
  container.appendChild(document.createElement("onyx-popup"));
}