import { LitElement, html, css } from "lit";

class OnyxPopup extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      font-family: system-ui, sans-serif;
    }
  `;

  render() {
    return html`<h1>Onyx Snippets</h1>
      <p>Minimal. Fast. Ready.</p>`;
  }
}

customElements.define("onyx-popup", OnyxPopup);

// Mount into your HTML
const container = document.getElementById("app");
if (container) {
  container.appendChild(document.createElement("onyx-popup"));
}
