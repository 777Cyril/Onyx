import { LitElement, html, css } from "lit";
import { state } from "lit/decorators.js";
import { getSnippets, addSnippet, updateSnippet, deleteSnippet, validateStorageSize, validateStorageUpdateSize } from "../storage";
import { getCurrentTheme, toggleTheme, applyThemeVariables, onThemeChange } from "../utils/theme";


class OnyxPopup extends LitElement {
  static styles = css`
    /* Dynamic Theme-Aware Styles */
    :host {
      /* CSS variables will be set dynamically by theme system */
      display: block;
      background: var(--bg-primary);
      color: var(--text-primary);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      width: 400px;
      height: 450px;
      margin: 0;
      position: relative;
      overflow: hidden;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    /* Global transitions for theme changes */
    *, *::before, *::after {
      transition: 
        background-color 0.3s ease,
        border-color 0.3s ease,
        color 0.3s ease,
        box-shadow 0.3s ease;
    }

    /* Preserve interactive element transitions */
    button, input, textarea, .action-btn, .theme-toggle {
      transition: 
        background-color 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease,
        opacity 0.2s ease !important;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--scrollbar-thumb-hover);
    }

    /* Header */
    .header {
      background: var(--bg-secondary);
      padding: 1rem 1rem 0.75rem;
      border-bottom: 1px solid var(--border-primary);
      position: sticky;
      top: 0;
      z-index: 10;
      position: relative;
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-left {
      flex: 1;
    }

    h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--brand-primary);
      letter-spacing: -0.02em;
    }

    .tagline {
      margin: 0.125rem 0 0;
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 400;
    }

    /* Apple-style Theme Toggle */
    .theme-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 1rem;
      flex-shrink: 0;
    }

    .theme-label {
      font-size: 0.625rem;
      font-weight: 500;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .theme-toggle {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      cursor: pointer;
      flex-shrink: 0;
      outline: none;
      position: relative;
      transition: all 0.15s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .theme-toggle.light {
      background: #6c757d; /* Neutral gray for light mode */
      border: 1px solid #dee2e6;
    }

    .theme-toggle.dark {
      background: #555555; /* Neutral darker gray for dark mode */
      border: 1px solid #404040;
    }

    .theme-toggle:hover {
      transform: scale(1.15);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .theme-toggle:active {
      transform: scale(0.95);
    }

    .theme-toggle:focus {
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3), 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    /* Main content area */
    .content {
      padding: 1rem;
      overflow-y: auto;
      height: calc(100% - 80px);
      background: var(--bg-primary);
    }

    /* Search bar - now at the top */
    .search-container {
      margin-bottom: 1rem;
    }

    .search-input {
      width: 100%;
      background: var(--bg-tertiary);  /* Very dark background to match form inputs */
      border: 1px solid var(--border-primary);
      color: var(--text-primary);
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
      border-radius: 6px;
      outline: none;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .search-input:focus {
      border-color: var(--brand-primary);
      background: var(--bg-tertiary);  /* Keep dark background on focus */
      box-shadow: 0 0 0 2px rgba(232, 90, 79, 0.1);
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    /* Form styling */
    form {
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
      transition: border-color 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    form:focus-within {
      border-color: var(--border-secondary);
    }

    input,
    textarea {
      width: 100%;
      background: var(--bg-tertiary);  /* Very dark background for inputs */
      border: 1px solid var(--border-primary);
      color: var(--text-primary);
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
      border-color: var(--brand-primary);
      background: var(--bg-tertiary);  /* Keep dark background on focus */
      box-shadow: 0 0 0 2px rgba(232, 90, 79, 0.1);
      color: var(--text-primary);
    }

    input::placeholder,
    textarea::placeholder {
      color: var(--text-muted);
    }

    /* Button styling */
    button[type="submit"] {
      background: var(--brand-secondary);
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
      color: var(--text-muted);
      font-weight: 600;
    }

    .snippet-count {
      font-size: 0.75rem;
      color: var(--text-muted);
      background: var(--bg-secondary);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: 6px;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    li:hover {
      border-color: var(--border-secondary);
      background: var(--bg-tertiary);
    }

    .snippet-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.25rem;
    }

    .snippet-title {
      font-weight: 500;
      color: var(--brand-primary);
      font-size: 0.875rem;
      margin: 0;
      flex: 1;
    }

    .snippet-content {
      font-size: 0.75rem;
      color: var(--text-secondary);
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
      background: linear-gradient(to bottom, transparent, var(--bg-secondary));
    }

    li:hover .snippet-content::after {
      background: linear-gradient(to bottom, transparent, var(--bg-tertiary));
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
      color: var(--text-muted);
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
      color: var(--text-primary);
      background: var(--border-primary);
      border-color: var(--border-secondary);
    }

    .action-btn.edit:hover {
      color: var(--brand-secondary);
      border-color: var(--brand-secondary);
      background: var(--text-primary);
    }

    .action-btn.delete:hover {
      color: #ef4444;
      border-color: #ef4444;
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 1.5rem 1rem;
      color: var(--text-muted);
    }

    .empty-text {
      font-size: 0.8125rem;
      line-height: 1.4;
    }

    /* Edit mode indicator */
    form.editing {
      border-color: var(--brand-secondary);
      background: var(--bg-primary);
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
      background: var(--error-bg);
      border: 1px solid var(--error-border);
      color: var(--error-text);
    }

    .message.success {
      background: var(--success-bg);
      border: 1px solid var(--success-border);
      color: var(--text-primary);
      font-weight: 500;
      font-size: 0.75rem;
      padding: 0.5rem 0.75rem;
      backdrop-filter: blur(8px);
      animation: slideInSuccess 0.3s ease-out, successGlow 2s ease-in-out;
      position: relative;
      overflow: hidden;
    }

    .message.success::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--brand-primary),
        var(--glass-shimmer),
        var(--brand-primary),
        transparent
      );
      animation: shimmer 1.5s ease-in-out;
    }
    
    @keyframes successGlow {
      0%, 100% {
        box-shadow: 0 0 5px rgba(232, 90, 79, 0.3);
      }
      50% {
        box-shadow: 0 0 15px rgba(232, 90, 79, 0.5), 
                    0 0 25px rgba(232, 90, 79, 0.2);
      }
    }

    @keyframes slideInSuccess {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    /* Space restriction warning */
    .space-warning {
      font-size: 0.6875rem;
      color: var(--error-border);
      margin-top: 0.25rem;
      line-height: 1.3;
      padding: 0.25rem 0.5rem;
      background: var(--error-bg);
      border: 1px solid var(--error-border);
      border-radius: 4px;
      animation: slideInWarning 0.2s ease-out;
    }

    @keyframes slideInWarning {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }


    /* Subtle trigger hint in tagline */
    .tagline .trigger-hint {
      color: var(--text-muted);
      font-size: 0.6875rem;
      margin-left: 0.5rem;
    }

    .tagline .trigger-hint code {
      background: var(--border-primary);
      padding: 0.125rem 0.25rem;
      border-radius: 3px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      font-size: 0.6rem;
      color: var(--brand-primary);
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

  @state()
  private originalScrollPosition = 0;

  @state()
  private showSpaceWarning = false;

  @state()
  private currentTheme = 'dark';


  async connectedCallback() {
    super.connectedCallback();
    await this.loadSnippets();
    await this.initializeTheme();
  }

  async initializeTheme() {
    try {
      // Get current theme from storage
      this.currentTheme = await getCurrentTheme();
      
      // Apply theme variables to the host element
      applyThemeVariables(this, this.currentTheme);
      
      // Listen for theme changes from other parts of extension
      onThemeChange((newTheme) => {
        this.currentTheme = newTheme;
        applyThemeVariables(this, newTheme);
        this.requestUpdate();
      });
      
      this.requestUpdate();
    } catch (error) {
      console.error('Error initializing theme:', error);
      // Fallback to dark theme
      this.currentTheme = 'dark';
      applyThemeVariables(this, 'dark');
    }
  }

  async handleThemeToggle() {
    try {
      const newTheme = await toggleTheme();
      this.currentTheme = newTheme;
      applyThemeVariables(this, newTheme);
      this.requestUpdate();
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
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

  private handleTitleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.newTitle = input.value;
    
    // Check if user entered a space and show warning
    if (input.value.includes(' ')) {
      this.showSpaceWarning = true;
    } else {
      this.showSpaceWarning = false;
    }
    
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
    this.showSpaceWarning = false;
    
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

  private scrollToOriginalPosition() {
    setTimeout(() => {
      const content = this.shadowRoot?.querySelector('.content');
      if (content) {
        // Restore to the exact scroll position before edit mode
        content.scrollTo({ 
          top: this.originalScrollPosition, 
          behavior: 'smooth' 
        });
      }
    }, 0);
  }

  private async handleAddSnippet(e: Event) {
    e.preventDefault();
    const title = this.newTitle.trim();
    const content = this.newContent.trim();
    if (!title || !content) return;

    this.clearMessages();

    // Validate that title doesn't contain spaces (for x/ trigger compatibility)
    if (title.includes(' ')) {
      this.showError('Prompt titles cannot contain spaces. Use underscores or hyphens instead (e.g., "task_management" or "task-management").');
      return;
    }

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
      
      // Restore original scroll position after all updates are complete
      setTimeout(() => {
        this.scrollToOriginalPosition();
      }, 150);
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
    
    // Capture current scroll position before entering edit mode
    const content = this.shadowRoot?.querySelector('.content');
    if (content) {
      this.originalScrollPosition = content.scrollTop;
    }
    
    this.newTitle = toEdit.title;
    this.newContent = toEdit.content;
    this.editingId = id;
    this.requestUpdate();
    this.scrollToForm();
  }

  private handleCancelEdit() {
    this.clearForm();
    // Restore original scroll position after clearing form when canceling edit
    setTimeout(() => {
      this.scrollToOriginalPosition();
    }, 100);
  }

  render() {
    return html`
      <div class="header">
        <div class="header-content">
          <div class="header-left">
            <h1>Onyx</h1>
            <p class="tagline">
              Minimal. Fast. Ready.
              <span class="trigger-hint">Use <code>x/</code> to trigger</span>
            </p>
          </div>
          <div class="theme-container">
            <div class="theme-label">THEME</div>
            <button 
              class="theme-toggle ${this.currentTheme}"
              @click=${this.handleThemeToggle}
              title="Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} mode"
              aria-label="Theme toggle - currently ${this.currentTheme} mode"
            ></button>
          </div>
        </div>
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
            Prompt saved
          </div>
        ` : ''}

        <form @submit=${this.handleAddSnippet} class=${this.editingId ? 'editing' : ''}>
          <input
            type="text"
            placeholder="Prompt title"
            .value=${this.newTitle}
            @input=${this.handleTitleInput}
            required
          />
          ${this.showSpaceWarning ? html`
            <div class="space-warning">
              Prompt titles cannot contain spaces. Use underscores or hyphens instead
            </div>
          ` : ''}
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
          <button type="submit" style="color: var(--brand-primary);">
            ${this.editingId ? "Update Prompt" : "Add Prompt"}
          </button>
          ${this.editingId ? html`
            <button 
              type="button" 
              @click=${this.handleCancelEdit}
              style="background: transparent; color: var(--text-muted); margin-top: 0.5rem; border: 1px solid var(--border-primary);"
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