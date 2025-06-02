var f=Object.defineProperty;var b=(i,n,t)=>n in i?f(i,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[n]=t;var a=(i,n,t)=>b(i,typeof n!="symbol"?n+"":n,t);import{i as g,a as y,g as h,x as m,r as l}from"./assets/storage-mOLm7AdV.js";var w=Object.defineProperty,c=(i,n,t,s)=>{for(var e=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(e=r(n,t,e)||e);return e&&w(n,t,e),e};class d extends g{constructor(){super(...arguments);a(this,"snippets",[]);a(this,"editingId",null);a(this,"newTitle","");a(this,"newContent","")}async firstUpdated(){this.snippets=await h(),this.requestUpdate()}async handleDeleteSnippet(t){const e=(await h()).filter(o=>o.id!==t);await chrome.storage.sync.set({"onyx-snippets":e}),this.snippets=e,this.requestUpdate()}handleEditSnippet(t){const s=this.snippets.find(e=>e.id===t);s&&(this.newTitle=s.title,this.newContent=s.content,this.editingId=t,this.requestUpdate())}async handleSaveSnippet(t){t.preventDefault();const s=this.newTitle.trim(),e=this.newContent.trim();if(!s||!e)return;const o=await h();if(this.editingId){const r=o.map(p=>p.id===this.editingId?{...p,title:s,content:e}:p);await chrome.storage.sync.set({"onyx-snippets":r}),this.snippets=r,this.editingId=null}else{const r={id:crypto.randomUUID(),title:s,content:e,createdAt:Date.now()},p=[...o,r];await chrome.storage.sync.set({"onyx-snippets":p}),this.snippets=p}this.newTitle="",this.newContent="",this.requestUpdate()}render(){return m`
      <h1>Onyx • Options</h1>
      <p>Manage your saved snippets below:</p>

      <form @submit=${this.handleSaveSnippet}>
        <input
          type="text"
          placeholder="Title"
          .value=${this.newTitle}
          @input=${t=>this.newTitle=t.target.value}
        />
        <br />
        <textarea
          rows="2"
          placeholder="Content"
          .value=${this.newContent}
          @input=${t=>this.newContent=t.target.value}
        ></textarea>
        <br />
        <button type="submit">
          ${this.editingId?"Update Snippet":"Add Snippet"}
        </button>
      </form>

      <ul>
        ${this.snippets.map(t=>m`
            <li>
              <div class="snippet-info">
                <strong>${t.title}</strong> – ${t.content}
              </div>
              <div class="controls">
                <button
                  @click=${()=>this.handleEditSnippet(t.id)}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  @click=${()=>this.handleDeleteSnippet(t.id)}
                  title="Delete"
                >
                  ✖
                </button>
              </div>
            </li>
          `)}
      </ul>
    `}}a(d,"styles",y`
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
  `);c([l()],d.prototype,"snippets");c([l()],d.prototype,"editingId");c([l()],d.prototype,"newTitle");c([l()],d.prototype,"newContent");customElements.define("onyx-options",d);const u=document.getElementById("app");u&&u.appendChild(document.createElement("onyx-options"));
