import { LitElement, html, css } from "lit";
import { getSnippets } from "../storage";
import { state } from "lit/decorators.js";

class OnyxOptions extends LitElement {
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
        console.log("Loaded snippets:", this.snippets);
    }

    render() {
        return html`
          <h1>Onyx Snippets • Settings</h1>
          <p>Configure your snippet library here.</p>
      
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

customElements.define("onyx-options", OnyxOptions);

const container = document.getElementById("app");
if (container) {
  container.appendChild(document.createElement("onyx-options"));
}
