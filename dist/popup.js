var x=Object.defineProperty;var w=(o,r,e)=>r in o?x(o,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[r]=e;var n=(o,r,e)=>w(o,typeof r!="symbol"?r+"":r,e);import{i as k,a as S,g as m,v as T,u as C,b as E,c as z,d as $,x as p,r as l}from"./assets/storage-Do-FYhGn.js";const h="onyx-theme",u={light:{id:"light",name:"light",displayName:"Light Mode",icon:"",cssVariables:{"--brand-primary":"#e85a4f","--brand-secondary":"#495057","--bg-primary":"#ffffff","--bg-secondary":"#f8f9fa","--bg-tertiary":"#e9ecef","--bg-hover":"#dee2e6","--border-primary":"#dee2e6","--border-secondary":"#e85a4f","--border-hover":"#dc3545","--text-primary":"#212529","--text-secondary":"#6c757d","--text-muted":"#adb5bd","--scrollbar-track":"transparent","--scrollbar-thumb":"#e85a4f","--scrollbar-thumb-hover":"#dc3545","--success-bg":"rgba(232, 90, 79, 0.1)","--success-border":"rgba(232, 90, 79, 0.25)","--error-bg":"#f8d7da","--error-border":"#dc3545","--error-text":"#721c24","--glass-bg":"rgba(255, 255, 255, 0.8)","--glass-border":"rgba(232, 90, 79, 0.2)","--glass-shimmer":"rgba(232, 90, 79, 0.4)"}},dark:{id:"dark",name:"dark",displayName:"Dark Mode",icon:"",cssVariables:{"--brand-primary":"#ff0000","--brand-secondary":"#000000","--bg-primary":"#1a1a1a","--bg-secondary":"#1a1a1a","--bg-tertiary":"#2a2a2a","--bg-hover":"#333333","--border-primary":"#404040","--border-secondary":"#ff0000","--border-hover":"#ff3333","--text-primary":"#d0d0d0","--text-secondary":"#b0b0b0","--text-muted":"#888888","--scrollbar-track":"#2a2a2a","--scrollbar-thumb":"#555555","--scrollbar-thumb-hover":"#666666","--success-bg":"rgba(255, 0, 0, 0.1)","--success-border":"rgba(255, 0, 0, 0.25)","--error-bg":"#2d1b1b","--error-border":"#ff0000","--error-text":"#ffcccc","--glass-bg":"rgba(42, 42, 42, 0.8)","--glass-border":"rgba(255, 0, 0, 0.2)","--glass-shimmer":"rgba(255, 0, 0, 0.4)"}}},f="light";async function v(){try{return(await chrome.storage.sync.get(h))[h]||f}catch(o){return console.error("Error getting current theme:",o),f}}async function M(o){try{if(!u[o])throw new Error(`Theme "${o}" not found`);await chrome.storage.sync.set({[h]:o})}catch(r){throw console.error("Error setting theme:",r),r}}function P(o){const r=u[o];return r?r.cssVariables:(console.warn(`Theme "${o}" not found, falling back to default`),u[f].cssVariables)}async function U(){const r=await v()==="light"?"dark":"light";return await M(r),r}function g(o,r){const e=P(r);for(const[t,s]of Object.entries(e))o.style.setProperty(t,s)}function q(o){chrome.storage.onChanged.addListener((r,e)=>{if(e==="sync"&&r[h]){const t=r[h].newValue;t&&o(t)}})}var I=Object.defineProperty,d=(o,r,e,t)=>{for(var s=void 0,a=o.length-1,i;a>=0;a--)(i=o[a])&&(s=i(r,e,s)||s);return s&&I(r,e,s),s};class c extends k{constructor(){super(...arguments);n(this,"snippets",[]);n(this,"newTitle","");n(this,"newContent","");n(this,"editingId",null);n(this,"searchQuery","");n(this,"filteredSnippets",[]);n(this,"errorMessage","");n(this,"showSuccess",!1);n(this,"originalScrollPosition",0);n(this,"showSpaceWarning",!1);n(this,"currentTheme","light")}async connectedCallback(){super.connectedCallback(),await this.loadSnippets(),await this.initializeTheme()}async initializeTheme(){try{this.currentTheme=await v(),g(this,this.currentTheme),q(e=>{this.currentTheme=e,g(this,e),this.requestUpdate()}),this.requestUpdate()}catch(e){console.error("Error initializing theme:",e),this.currentTheme="light",g(this,"light")}}async handleThemeToggle(){try{const e=await U();this.currentTheme=e,g(this,e),this.requestUpdate()}catch(e){console.error("Error toggling theme:",e)}}async loadSnippets(){try{this.snippets=await m(),this.filterSnippets(),this.requestUpdate()}catch(e){console.error("Error loading snippets:",e),this.snippets=[],this.filteredSnippets=[]}}filterSnippets(){if(!this.searchQuery.trim()){this.filteredSnippets=[...this.snippets];return}const e=this.searchQuery.toLowerCase();this.filteredSnippets=this.snippets.filter(t=>{const s=(t.title||"").toLowerCase().includes(e),a=(t.content||"").toLowerCase().includes(e);return s||a})}handleSearch(e){const t=e.target;this.searchQuery=t.value,this.filterSnippets(),this.requestUpdate()}handleTitleInput(e){const t=e.target;this.newTitle=t.value,t.value.includes(" ")?this.showSpaceWarning=!0:this.showSpaceWarning=!1,this.requestUpdate()}clearMessages(){this.errorMessage="",this.showSuccess=!1}showError(e){this.errorMessage=e,this.showSuccess=!1,setTimeout(()=>{this.errorMessage="",this.requestUpdate()},5e3)}showSuccessMessage(){this.showSuccess=!0,this.errorMessage="",setTimeout(()=>{this.showSuccess=!1,this.requestUpdate()},3e3)}clearForm(){this.newTitle="",this.newContent="",this.editingId=null,this.showSpaceWarning=!1,setTimeout(()=>{var s,a;const e=(s=this.shadowRoot)==null?void 0:s.querySelector('form input[type="text"]'),t=(a=this.shadowRoot)==null?void 0:a.querySelector("form textarea");e&&(e.value="",e.blur()),t&&(t.value="",t.blur())},0),this.requestUpdate()}scrollToForm(){setTimeout(()=>{var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector("form");e&&e.scrollIntoView({behavior:"smooth",block:"start"})},0)}scrollToOriginalPosition(){setTimeout(()=>{var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector(".content");e&&e.scrollTo({top:this.originalScrollPosition,behavior:"smooth"})},0)}async handleAddSnippet(e){e.preventDefault();const t=this.newTitle.trim(),s=this.newContent.trim();if(!(!t||!s)){if(this.clearMessages(),t.includes(" ")){this.showError('Prompt titles cannot contain spaces. Use underscores or hyphens instead (e.g., "task_management" or "task-management").');return}try{if(this.editingId){const a={id:this.editingId,title:t,content:s,createdAt:Date.now()},i=await T(a);if(!i.isValid){if(i.projectedSize>i.maxSize){const b=i.projectedSize-i.maxSize;this.showError(`Prompt too large! Exceeds individual item limit by ${b} bytes. Try shortening the content.`)}else this.showError(`Cannot update: would exceed maximum number of items (${i.maxItems}).`);return}await C(a),this.snippets=await m()}else{const a={id:crypto.randomUUID(),title:t,content:s,createdAt:Date.now()},i=await E(a);if(!i.isValid){if(i.projectedSize>i.maxSize){const b=i.projectedSize-i.maxSize;this.showError(`Prompt too large! Exceeds individual item limit by ${b} bytes. Try shortening the content.`)}else this.showError(`Cannot add prompt: would exceed maximum number of items (${i.maxItems}).`);return}await z(a),this.snippets=await m()}this.clearForm(),this.filterSnippets(),this.showSuccessMessage(),this.requestUpdate(),setTimeout(()=>{this.scrollToOriginalPosition()},150)}catch(a){console.error("Error saving snippet:",a),this.showError("Failed to save prompt. Please try again.")}}}async handleDeleteSnippet(e){const t=this.snippets.find(a=>a.id===e);if(!(!t||!confirm(`Delete "${t.title}"?`)))try{await $(e),this.snippets=await m(),this.filterSnippets(),this.requestUpdate()}catch(a){console.error("Error deleting snippet:",a)}}handleEditSnippet(e){var a;const t=this.snippets.find(i=>i.id===e);if(!t)return;const s=(a=this.shadowRoot)==null?void 0:a.querySelector(".content");s&&(this.originalScrollPosition=s.scrollTop),this.newTitle=t.title,this.newContent=t.content,this.editingId=e,this.requestUpdate(),this.scrollToForm()}handleCancelEdit(){this.clearForm(),setTimeout(()=>{this.scrollToOriginalPosition()},100)}render(){return p`
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
              title="Switch to ${this.currentTheme==="light"?"dark":"light"} mode"
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
        ${this.errorMessage?p`
          <div class="message error">
            ${this.errorMessage}
          </div>
        `:""}
        
        ${this.showSuccess?p`
          <div class="message success">
            Prompt saved
          </div>
        `:""}

        <form @submit=${this.handleAddSnippet} class=${this.editingId?"editing":""}>
          <input
            type="text"
            placeholder="Prompt title"
            .value=${this.newTitle}
            @input=${this.handleTitleInput}
            required
          />
          ${this.showSpaceWarning?p`
            <div class="space-warning">
              Prompt titles cannot contain spaces. Use underscores or hyphens instead
            </div>
          `:""}
          <div>
            <textarea
              rows="3"
              placeholder="Prompt content"
              .value=${this.newContent}
              @input=${e=>{this.newContent=e.target.value,this.requestUpdate()}}
              required
            ></textarea>
          </div>
          <button type="submit" style="color: var(--brand-primary);">
            ${this.editingId?"Update Prompt":"Add Prompt"}
          </button>
          ${this.editingId?p`
            <button 
              type="button" 
              @click=${this.handleCancelEdit}
              style="background: transparent; color: var(--text-muted); margin-top: 0.5rem; border: 1px solid var(--border-primary);"
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
          
          ${this.filteredSnippets.length===0&&this.snippets.length===0?p`
            <div class="empty-state">
              <p class="empty-text">
                No snippets yet.<br>
                Create your first snippet above.
              </p>
            </div>
          `:this.filteredSnippets.length===0&&this.searchQuery?p`
            <div class="empty-state">
              <p class="empty-text">
                No prompts match your search.
              </p>
            </div>
          `:p`
            <ul>
              ${this.filteredSnippets.map(e=>p`
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
    `}}n(c,"styles",S`
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


  `);d([l()],c.prototype,"snippets");d([l()],c.prototype,"newTitle");d([l()],c.prototype,"newContent");d([l()],c.prototype,"editingId");d([l()],c.prototype,"searchQuery");d([l()],c.prototype,"filteredSnippets");d([l()],c.prototype,"errorMessage");d([l()],c.prototype,"showSuccess");d([l()],c.prototype,"originalScrollPosition");d([l()],c.prototype,"showSpaceWarning");d([l()],c.prototype,"currentTheme");customElements.define("onyx-popup",c);const y=document.getElementById("app");y&&y.appendChild(document.createElement("onyx-popup"));
