import { LitElement, html, css } from "lit";

class OnyxOptions extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      font-family: system-ui, sans-serif;
    }
  `;

  render() {
    return html`
      <h1>Onyx Snippets • Settings</h1>
      <p>Configure your snippet library here.</p>
    `;
  }
}

customElements.define("onyx-options", OnyxOptions);

const container = document.getElementById("app");
if (container) {
  container.appendChild(document.createElement("onyx-options"));
}
