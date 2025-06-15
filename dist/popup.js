var g=Object.defineProperty;var b=(l,s,e)=>s in l?g(l,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[s]=e;var n=(l,s,e)=>b(l,typeof s!="symbol"?s+"":s,e);import{i as f,a as w,g as h,v as y,u as x,c as v,e as S,d as k,x as d,r as p}from"./assets/storage-DNQ-ueQ6.js";var C=Object.defineProperty,c=(l,s,e,t)=>{for(var i=void 0,r=l.length-1,o;r>=0;r--)(o=l[r])&&(i=o(s,e,i)||i);return i&&C(s,e,i),i};class a extends f{constructor(){super(...arguments);n(this,"snippets",[]);n(this,"newTitle","");n(this,"newContent","");n(this,"editingId",null);n(this,"searchQuery","");n(this,"filteredSnippets",[]);n(this,"errorMessage","");n(this,"showSuccess",!1)}async connectedCallback(){super.connectedCallback(),await this.loadSnippets()}async loadSnippets(){try{this.snippets=await h(),this.filterSnippets(),this.requestUpdate()}catch(e){console.error("Error loading snippets:",e),this.snippets=[],this.filteredSnippets=[]}}filterSnippets(){if(!this.searchQuery.trim()){this.filteredSnippets=[...this.snippets];return}const e=this.searchQuery.toLowerCase();this.filteredSnippets=this.snippets.filter(t=>{const i=(t.title||"").toLowerCase().includes(e),r=(t.content||"").toLowerCase().includes(e);return i||r})}handleSearch(e){const t=e.target;this.searchQuery=t.value,this.filterSnippets(),this.requestUpdate()}clearMessages(){this.errorMessage="",this.showSuccess=!1}showError(e){this.errorMessage=e,this.showSuccess=!1,setTimeout(()=>{this.errorMessage="",this.requestUpdate()},5e3)}showSuccessMessage(){this.showSuccess=!0,this.errorMessage="",setTimeout(()=>{this.showSuccess=!1,this.requestUpdate()},3e3)}clearForm(){this.newTitle="",this.newContent="",this.editingId=null,setTimeout(()=>{var i,r;const e=(i=this.shadowRoot)==null?void 0:i.querySelector('form input[type="text"]'),t=(r=this.shadowRoot)==null?void 0:r.querySelector("form textarea");e&&(e.value="",e.blur()),t&&(t.value="",t.blur())},0),this.scrollToTop(),this.requestUpdate()}scrollToForm(){setTimeout(()=>{var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector("form");e&&e.scrollIntoView({behavior:"smooth",block:"start"})},0)}scrollToTop(){setTimeout(()=>{var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector(".content");e&&e.scrollTo({top:0,behavior:"smooth"})},0)}async handleAddSnippet(e){e.preventDefault();const t=this.newTitle.trim(),i=this.newContent.trim();if(!(!t||!i)){this.clearMessages();try{if(this.editingId){const r={id:this.editingId,title:t,content:i,createdAt:Date.now()},o=await y(r);if(!o.isValid){if(o.projectedSize>o.maxSize){const m=o.projectedSize-o.maxSize;this.showError(`Prompt too large! Exceeds individual item limit by ${m} bytes. Try shortening the content.`)}else this.showError(`Cannot update: would exceed maximum number of items (${o.maxItems}).`);return}await x(r),this.snippets=await h()}else{const r={id:crypto.randomUUID(),title:t,content:i,createdAt:Date.now()},o=await v(r);if(!o.isValid){if(o.projectedSize>o.maxSize){const m=o.projectedSize-o.maxSize;this.showError(`Prompt too large! Exceeds individual item limit by ${m} bytes. Try shortening the content.`)}else this.showError(`Cannot add prompt: would exceed maximum number of items (${o.maxItems}).`);return}await S(r),this.snippets=await h()}this.clearForm(),this.filterSnippets(),this.showSuccessMessage(),this.requestUpdate()}catch(r){console.error("Error saving snippet:",r),this.showError("Failed to save prompt. Please try again.")}}}async handleDeleteSnippet(e){const t=this.snippets.find(r=>r.id===e);if(!(!t||!confirm(`Delete "${t.title}"?`)))try{await k(e),this.snippets=await h(),this.filterSnippets(),this.requestUpdate()}catch(r){console.error("Error deleting snippet:",r)}}handleEditSnippet(e){const t=this.snippets.find(i=>i.id===e);t&&(this.newTitle=t.title,this.newContent=t.content,this.editingId=e,this.requestUpdate(),this.scrollToForm())}handleCancelEdit(){this.clearForm()}render(){return d`
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
        ${this.errorMessage?d`
          <div class="message error">
            ${this.errorMessage}
          </div>
        `:""}
        
        ${this.showSuccess?d`
          <div class="message success">
            Prompt saved
          </div>
        `:""}

        <form @submit=${this.handleAddSnippet} class=${this.editingId?"editing":""}>
          <input
            type="text"
            placeholder="Prompt title"
            .value=${this.newTitle}
            @input=${e=>this.newTitle=e.target.value}
            required
          />
          <div>
            <textarea
              rows="3"
              placeholder="Prompt content"
              .value=${this.newContent}
              @input=${e=>{this.newContent=e.target.value,this.requestUpdate()}}
              required
            ></textarea>
          </div>
          <button type="submit">
            ${this.editingId?"Update Prompt":"Add Prompt"}
          </button>
          ${this.editingId?d`
            <button 
              type="button" 
              @click=${this.handleCancelEdit}
              style="background: transparent; color: #666; margin-top: 0.5rem; border: 1px solid #333;"
            >
              Cancel
            </button>
          `:""}
        </form>
        
        <div class="snippets-section">
          <div class="section-header">
            <h2 class="section-title">My Prompts</h2>
            <span class="snippet-count">${this.filteredSnippets.length}</span>
          </div>
          
          ${this.filteredSnippets.length===0&&this.snippets.length===0?d`
            <div class="empty-state">
              <p class="empty-text">
                No snippets yet.<br>
                Create your first snippet above.
              </p>
            </div>
          `:this.filteredSnippets.length===0&&this.searchQuery?d`
            <div class="empty-state">
              <p class="empty-text">
                No prompts match your search.
              </p>
            </div>
          `:d`
            <ul>
              ${this.filteredSnippets.map(e=>d`
                  <li>
                    <div class="snippet-header">
                      <h3 class="snippet-title">${e.title}</h3>
                      <div class="actions">
                        <button
                          class="action-btn edit"
                          @click=${()=>this.handleEditSnippet(e.id)}
                          title="Edit snippet"
                        >
                          <svg class="icon-edit" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </button>
                        <button
                          class="action-btn delete"
                          @click=${()=>this.handleDeleteSnippet(e.id)}
                          title="Delete snippet"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p class="snippet-content">${e.content}</p>
                  </li>
                `)}
            </ul>
          `}
        </div>
      </div>
    `}}n(a,"styles",w`
    :host {
      display: block;
      background: #1a1a1a;
      color: #e5e5e5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      width: 400px;
      height: 450px;
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
      color: #FF0000;
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
      padding: 1.5rem 1rem;
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
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #e5e5e5;
      font-weight: 500;
      font-size: 0.75rem;
      padding: 0.5rem 0.75rem;
      backdrop-filter: blur(8px);
      animation: slideInSuccess 0.3s ease-out;
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
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shimmer 1.5s ease-in-out;
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


  `);c([p()],a.prototype,"snippets");c([p()],a.prototype,"newTitle");c([p()],a.prototype,"newContent");c([p()],a.prototype,"editingId");c([p()],a.prototype,"searchQuery");c([p()],a.prototype,"filteredSnippets");c([p()],a.prototype,"errorMessage");c([p()],a.prototype,"showSuccess");customElements.define("onyx-popup",a);const u=document.getElementById("app");u&&u.appendChild(document.createElement("onyx-popup"));
