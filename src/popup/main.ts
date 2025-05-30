import { LitElement, html, css } from "lit";
import { state } from "lit/decorators.js";
import { getSnippets } from "../storage";


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

async firstUpdated() {
  this.snippets = await getSnippets();
  console.log("Popup loaded snippets:", this.snippets);
}

render() {
    return html`
      <h1>Onyx by LLMx</h1>
      <p>Minimal. Fast. Ready.</p>
  
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
