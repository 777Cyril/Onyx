import { LitElement, html, css } from "lit";
import { state } from "lit/decorators.js";
import { getSnippets, addSnippet } from "../storage";



class OnyxPopup extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      font-family: system-ui, sans-serif;
    }
  `;

    @state()
    private snippets: any[] = [];

    @state()
    private newTitle = "";

    @state()
    private newContent = "";


async firstUpdated() {
  this.snippets = await getSnippets();
  console.log("Popup loaded snippets:", this.snippets);
}

private async handleAddSnippet(e: Event) {
    e.preventDefault();
    const newSnippet = {
      id: crypto.randomUUID(),
      title: this.newTitle.trim(),
      content: this.newContent.trim(),
      createdAt: Date.now()
    };
    if (!newSnippet.title || !newSnippet.content) return;
  
    // Save
    await addSnippet(newSnippet);
  
    // Refresh list
    this.snippets = await getSnippets();
  
    // Clear form
    this.newTitle = "";
    this.newContent = "";
  }

  render() {
    return html`
      <h1>Onyx</h1>
      <p>Minimal. Fast. Ready.</p>
  
      <form @submit=${this.handleAddSnippet}>
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
        <button type="submit">Add Snippet</button>
      </form>
  
      <ul>
        ${this.snippets.map(
          (snippet) =>
            html`<li>
              <strong>${snippet.title}</strong>: ${snippet.content}
            </li>`
        )}
      </ul>
    `;
  }
  
  
}

customElements.define("onyx-popup", OnyxPopup);

// Mount into your HTML
const container = document.getElementById("app");
if (container) {
  container.appendChild(document.createElement("onyx-popup"));
}
