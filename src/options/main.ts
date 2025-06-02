import { LitElement, html, css } from "lit";
import { state } from "lit/decorators.js";
import { getSnippets } from "../storage";

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
  `;

  @state()
  snippets: any[] = [];

  @state()
  editingId: string | null = null;

  @state()
  newTitle = "";

  @state()
  newContent = "";

  async firstUpdated() {
    this.snippets = await getSnippets();
    this.requestUpdate();
  }

  private async handleDeleteSnippet(id: string) {
    const all = await getSnippets();
    const updated = all.filter((s) => s.id !== id);
    await chrome.storage.sync.set({ "onyx-snippets": updated });
    this.snippets = updated;
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

    const all = await getSnippets();

    if (this.editingId) {
      // Update existing snippet
      const updated = all.map((s) =>
        s.id === this.editingId ? { ...s, title, content } : s
      );
      await chrome.storage.sync.set({ "onyx-snippets": updated });
      this.snippets = updated;
      this.editingId = null;
    } else {
      // Add new snippet
      const newSnippet = {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: Date.now(),
      };
      const updated = [...all, newSnippet];
      await chrome.storage.sync.set({ "onyx-snippets": updated });
      this.snippets = updated;
    }

    this.newTitle = "";
    this.newContent = "";
    this.requestUpdate();
  }

  render() {
    return html`
      <h1>Onyx • Options</h1>
      <p>Manage your saved snippets below:</p>

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
