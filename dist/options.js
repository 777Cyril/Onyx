var f=Object.defineProperty;var b=(n,r,e)=>r in n?f(n,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[r]=e;var a=(n,r,e)=>b(n,typeof r!="symbol"?r+"":r,e);import{i as w,a as y,g as m,b as v,d as x,v as S,u as I,c as $,e as z,x as u,r as l}from"./assets/storage-DNQ-ueQ6.js";var U=Object.defineProperty,g=(n,r,e,s)=>{for(var o=void 0,i=n.length-1,t;i>=0;i--)(t=n[i])&&(o=t(r,e,o)||o);return o&&U(r,e,o),o};class d extends w{constructor(){super(...arguments);a(this,"snippets",[]);a(this,"editingId",null);a(this,"newTitle","");a(this,"newContent","");a(this,"errorMessage","");a(this,"storageInfo",null)}async firstUpdated(){this.snippets=await m(),await this.updateStorageInfo(),this.requestUpdate()}async updateStorageInfo(){try{this.storageInfo=await v(),this.requestUpdate()}catch(e){console.error("Error updating storage info:",e)}}async handleDeleteSnippet(e){await x(e),this.snippets=await m(),await this.updateStorageInfo(),this.requestUpdate()}handleEditSnippet(e){const s=this.snippets.find(o=>o.id===e);s&&(this.newTitle=s.title,this.newContent=s.content,this.editingId=e,this.requestUpdate())}async handleSaveSnippet(e){e.preventDefault();const s=this.newTitle.trim(),o=this.newContent.trim();if(!(!s||!o)){this.errorMessage="";try{if(this.editingId){const i={id:this.editingId,title:s,content:o,createdAt:Date.now()},t=await S(i);if(!t.isValid){if(t.projectedSize>t.maxSize){const p=t.projectedSize-t.maxSize;this.errorMessage=`Snippet too large! Exceeds individual item limit by ${p} bytes. Try shortening the content.`}else this.errorMessage=`Cannot update: would exceed maximum number of items (${t.maxItems}).`;this.requestUpdate();return}await I(i),this.snippets=await m(),await this.updateStorageInfo(),this.editingId=null}else{const i={id:crypto.randomUUID(),title:s,content:o,createdAt:Date.now()},t=await $(i);if(!t.isValid){if(t.projectedSize>t.maxSize){const p=t.projectedSize-t.maxSize;this.errorMessage=`Snippet too large! Exceeds individual item limit by ${p} bytes. Try shortening the content.`}else this.errorMessage=`Cannot add snippet: would exceed maximum number of items (${t.maxItems}).`;this.requestUpdate();return}await z(i),this.snippets=await m(),await this.updateStorageInfo()}}catch(i){console.error("Error saving snippet:",i),this.errorMessage="Failed to save snippet. Please try again.",this.requestUpdate();return}this.newTitle="",this.newContent="",setTimeout(()=>{var p,c;const i=(p=this.shadowRoot)==null?void 0:p.querySelector('form input[type="text"]'),t=(c=this.shadowRoot)==null?void 0:c.querySelector("form textarea");i&&(i.value="",i.blur()),t&&(t.value="",t.blur())},0),this.requestUpdate()}}render(){return u`
      <h1>Onyx • Options</h1>
      <p>Manage your saved snippets below:</p>

      <!-- Storage info -->
      ${this.storageInfo?u`
        <div class="storage-info">
          <h3>Storage Information</h3>
          <div class="storage-stats">
            <span>Items used</span>
            <span>${this.storageInfo.itemCount}/${this.storageInfo.maxItems} items (${Math.round(this.storageInfo.percentUsed)}%)</span>
          </div>
          <div class="storage-bar">
            <div class="storage-fill ${this.storageInfo.percentUsed>85?"danger":this.storageInfo.percentUsed>70?"warning":""}"
                 style="width: ${Math.min(this.storageInfo.percentUsed,100)}%"></div>
          </div>
          <div style="color: #666; font-size: 0.75rem; margin-top: 0.5rem;">
            With individual item storage, you can now store up to ${this.storageInfo.maxItems} prompts with virtually unlimited content per prompt.
          </div>
        </div>
      `:""}

      ${this.errorMessage?u`
        <div style="background: #fee; border: 1px solid #f00; padding: 0.75rem; margin-bottom: 1rem; border-radius: 4px; color: #d00;">
          ${this.errorMessage}
        </div>
      `:""}

      <form @submit=${this.handleSaveSnippet}>
        <input
          type="text"
          placeholder="Title"
          .value=${this.newTitle}
          @input=${e=>this.newTitle=e.target.value}
        />
        <br />
        <textarea
          rows="2"
          placeholder="Content"
          .value=${this.newContent}
          @input=${e=>this.newContent=e.target.value}
        ></textarea>
        <br />
        <button type="submit">
          ${this.editingId?"Update Snippet":"Add Snippet"}
        </button>
      </form>

      <ul>
        ${this.snippets.map(e=>u`
            <li>
              <div class="snippet-info">
                <strong>${e.title}</strong> – ${e.content}
              </div>
              <div class="controls">
                <button
                  @click=${()=>this.handleEditSnippet(e.id)}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  @click=${()=>this.handleDeleteSnippet(e.id)}
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
  `);g([l()],d.prototype,"snippets");g([l()],d.prototype,"editingId");g([l()],d.prototype,"newTitle");g([l()],d.prototype,"newContent");g([l()],d.prototype,"errorMessage");g([l()],d.prototype,"storageInfo");customElements.define("onyx-options",d);const h=document.getElementById("app");h&&h.appendChild(document.createElement("onyx-options"));
