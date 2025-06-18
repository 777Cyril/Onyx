function k(){return new Promise(e=>{chrome.storage.sync.get(null,t=>{try{const r=t["onyx-index"]||[],n=[];for(const i of r){const a=`snippet-${i}`,s=t[a];s&&n.push(s)}n.sort((i,a)=>(a.createdAt||0)-(i.createdAt||0)),e(n)}catch(r){console.error("Error loading snippets:",r),e([])}})})}function C(e,t){if(!t)return e;const r=t.toLowerCase();return e.filter(n=>(n.title||"").toLowerCase().includes(r)).sort((n,i)=>{const a=(n.title||"").toLowerCase().indexOf(r),s=(i.title||"").toLowerCase().indexOf(r);return a-s})}function v(e,t){return t.trim()&&e.find(n=>n.title.toLowerCase()===t.toLowerCase().trim())||null}let o={active:!1,target:null,startPosition:0,searchQuery:"",selectedIndex:0,filteredSnippets:[],isAnimating:!1,enterKeyBlocked:!1};function S(){let e=document.getElementById("onyx-picker");if(e)return e;e=document.createElement("div"),e.id="onyx-picker",Object.assign(e.style,{position:"absolute",background:"var(--onyx-bg-secondary)",border:"1px solid var(--onyx-border-secondary)",borderRadius:"8px",padding:"0",fontSize:"14px",boxShadow:"0 8px 24px rgba(0,0,0,0.4)",zIndex:"2147483647",minWidth:"200px",maxWidth:"350px",maxHeight:"280px",overflowY:"auto",overflowX:"hidden"});const t=document.createElement("style");return t.textContent=`
        /* Onyx Coolors.co Palette - Content Script */
        :root {
            --onyx-brand-primary: #5A7D7C;    /* Hooker's green */
            --onyx-brand-secondary: #232C33;  /* Gunmetal */
            --onyx-bg-primary: #232C33;       /* Gunmetal */
            --onyx-bg-secondary: #2a3439;     /* Lighter gunmetal */
            --onyx-bg-tertiary: #313b41;      /* Even lighter */
            --onyx-bg-hover: #3a464d;         /* Hover state */
            --onyx-border-primary: #4a5a61;   /* Muted border */
            --onyx-border-secondary: #5A7D7C; /* Green accent */
            --onyx-text-primary: #DADFF7;     /* Lavender */
            --onyx-text-secondary: #B5B2C2;   /* French gray */
            --onyx-text-muted: #8a9299;       /* Muted */
            --onyx-scrollbar-thumb: #5A7D7C;  /* Green thumb */
            --onyx-scrollbar-thumb-hover: #6a8d8c; /* Lighter green */
        }
        
        #onyx-picker::-webkit-scrollbar {
            width: 8px;
        }
        #onyx-picker::-webkit-scrollbar-track {
            background: var(--onyx-bg-secondary);
        }
        #onyx-picker::-webkit-scrollbar-thumb {
            background: var(--onyx-scrollbar-thumb);
            border-radius: 4px;
        }
        #onyx-picker::-webkit-scrollbar-thumb:hover {
            background: var(--onyx-scrollbar-thumb-hover);
        }
        
        /* Border Trace Effect */
        @keyframes borderTrace {
            0% {
                box-shadow: inset 2px 0 0 var(--onyx-brand-primary), inset 0 0 0 transparent;
            }
            25% {
                box-shadow: inset 2px 0 0 var(--onyx-brand-primary), inset 0 2px 0 var(--onyx-brand-primary);
            }
            50% {
                box-shadow: inset 0 0 0 transparent, inset 0 2px 0 var(--onyx-brand-primary), inset -2px 0 0 var(--onyx-brand-primary);
            }
            75% {
                box-shadow: inset 0 0 0 transparent, inset 0 -2px 0 var(--onyx-brand-primary), inset -2px 0 0 var(--onyx-brand-primary);
            }
            100% {
                box-shadow: inset 0 0 0 transparent;
            }
        }
        
        .onyx-border-trace-effect {
            animation: borderTrace 400ms ease-in-out !important;
        }
        
        
        .onyx-exact-match {
            background: rgba(90, 125, 124, 0.15) !important;
            border-left: 3px solid var(--onyx-brand-primary) !important;
        }
        
        .onyx-ready-indicator {
            position: relative;
        }
        
        .onyx-ready-indicator::after {
            content: "✨ Ready to inject";
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 11px;
            color: var(--onyx-brand-primary);
            opacity: 0.8;
        }
    `,document.head.appendChild(t),document.body.appendChild(e),e}function g(){console.log("🚪 Hiding picker and resetting snippet mode");const e=document.getElementById("onyx-picker");e&&e.remove(),o.target,o.isAnimating&&o.animationController&&o.animationController.abort(),o={active:!1,target:null,startPosition:0,searchQuery:"",selectedIndex:0,filteredSnippets:[],isAnimating:!1,enterKeyBlocked:!1},console.log("✅ Snippet mode reset - Enter key should work normally now"),document.removeEventListener("click",w)}function w(e){const t=document.getElementById("onyx-picker"),r=e.target;t&&!t.contains(r)&&r!==o.target&&g()}function I(e){if(!e)return;console.log("🔳 Applying border trace effect");const t=e.style.boxShadow||"";e.classList.add("onyx-border-trace-effect"),setTimeout(()=>{e.classList.remove("onyx-border-trace-effect"),e.style.boxShadow=t,console.log("✅ Border trace effect completed")},400)}function T(e,t){if(!t)return e;const r=new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return e.replace(r,'<span style="color: var(--onyx-brand-primary); font-weight: 500;">$1</span>')}function b(e,t){const r=t.getBoundingClientRect(),n=e.offsetHeight,a=window.innerHeight-r.bottom,s=r.top;let c=r.bottom+window.scrollY+8,l=r.left+window.scrollX;a<n&&s>a&&(c=r.top+window.scrollY-n-8);const d=e.offsetWidth,p=window.innerWidth;if(l+d>p-20&&(l=p-d-20),t.isContentEditable&&o.startPosition>0){const u=window.getSelection();if(u&&u.rangeCount>0){const x=u.getRangeAt(0).getClientRects();if(x.length>0){const y=x[0];l=y.left+window.scrollX,c=y.bottom+window.scrollY+8,l+d>p-20&&(l=p-d-20)}}}e.style.top=`${c}px`,e.style.left=`${l}px`}function m(e){const t=S();if(t.innerHTML="",e.length===0){const n=document.createElement("div");n.textContent="No matching prompts",Object.assign(n.style,{padding:"12px 16px",color:"var(--onyx-text-secondary)",fontStyle:"italic",textAlign:"center"}),t.appendChild(n),b(t,o.target);return}const r=v(e,o.searchQuery);e.forEach((n,i)=>{const a=document.createElement("div");a.setAttribute("data-snippet-index",i.toString());const s=r&&n.id===r.id,c=T(n.title||`Snippet ${i+1}`,o.searchQuery);a.innerHTML=`<div>${c}</div>`,s&&a.classList.add("onyx-exact-match","onyx-ready-indicator"),Object.assign(a.style,{padding:"10px 16px",cursor:"pointer",backgroundColor:i===o.selectedIndex?"var(--onyx-bg-hover)":"transparent",color:"var(--onyx-text-primary)",borderBottom:i<e.length-1?"1px solid var(--onyx-border-primary)":"none",transition:"background-color 0.15s ease, border-color 0.15s ease",borderRadius:i===0?"8px 8px 0 0":i===e.length-1?"0 0 8px 8px":"0"}),a.addEventListener("mouseenter",()=>{s||(a.style.backgroundColor="var(--onyx-bg-hover)"),o.selectedIndex=i,E()}),a.addEventListener("mouseleave",()=>{i!==o.selectedIndex&&!s&&(a.style.backgroundColor="transparent")}),a.addEventListener("mousedown",l=>{l.preventDefault(),f(n)}),t.appendChild(a)}),b(t,o.target)}function E(){const e=document.getElementById("onyx-picker");if(!e)return;e.querySelectorAll("[data-snippet-index]").forEach((r,n)=>{const i=r;i.style.backgroundColor=n===o.selectedIndex?"var(--onyx-bg-hover)":"transparent"})}function h(e){const t=document.getElementById("onyx-picker");if(!t)return;o.selectedIndex=Math.max(0,Math.min(e,o.filteredSnippets.length-1)),E();const n=t.querySelectorAll("[data-snippet-index]")[o.selectedIndex];n&&n.scrollIntoView({block:"nearest"})}function L(e,t,r){console.log("🔧 Safe contentEditable insertion for Claude.ai");try{if("value"in e&&typeof e.value=="string"){const n=e,i=n.value||"",a=i.length,s=i.slice(0,r),c=i.slice(a),l=s+t+c;if(n.value=l,n.focus&&n.focus(),n.setSelectionRange){const d=s.length+t.length;n.setSelectionRange(d,d)}return n.dispatchEvent(new Event("input",{bubbles:!0})),n.dispatchEvent(new Event("change",{bubbles:!0})),console.log("✅ Used direct value manipulation method"),!0}if(e.textContent!==null){const n=e.textContent||"",i=n.slice(0,r),a=n.slice(Math.max(r+o.searchQuery.length+2,i.length));return e.textContent=i+t+a,e.focus&&e.focus(),e.dispatchEvent(new InputEvent("input",{bubbles:!0,cancelable:!0,inputType:"insertText",data:t})),console.log("✅ Used textContent manipulation method"),!0}if(e.innerHTML!==void 0){const n=e.innerHTML,i=n.slice(0,r),a=n.slice(Math.max(r+o.searchQuery.length+2,i.length));return e.innerHTML=i+t+a,e.focus&&e.focus(),e.dispatchEvent(new InputEvent("input",{bubbles:!0,cancelable:!0,inputType:"insertText",data:t})),console.log("✅ Used innerHTML manipulation method"),!0}return console.log("❌ No suitable insertion method found"),!1}catch(n){return console.error("❌ Error in safe contentEditable insertion:",n),!1}}function f(e,t=!1){if(!o.target)return;const r=o.target,n=o.startPosition,i=e.content||"";console.log("🎯 Inserting snippet:",e.title,t?"(Magic Injection)":"(Manual)");try{if(r.tagName==="INPUT"||r.tagName==="TEXTAREA"){const a=r,s=a.value,c=a.selectionStart||0,l=s.slice(0,n),d=s.slice(c),p=l+i+d;a.value=p;const u=l.length+i.length;a.setSelectionRange(u,u),a.dispatchEvent(new Event("input",{bubbles:!0})),a.dispatchEvent(new Event("change",{bubbles:!0}))}else if(r.isContentEditable&&!L(r,i,n)){console.log("⚠️ Fallback: Using basic textContent replacement");const s=r.textContent||"",c=s.slice(0,n),l=s.slice(n+o.searchQuery.length+2);r.textContent=c+i+l,r.dispatchEvent(new InputEvent("input",{bubbles:!0,cancelable:!0,inputType:"insertText",data:i}))}t&&I(r),console.log("✅ Snippet inserted successfully")}catch(a){console.error("❌ Error inserting snippet:",a)}g()}function P(e){console.log("🪄 Starting magical injection with border trace effect"),f(e,!0)}function A(e){if(e.key==="Escape"){e.preventDefault(),o.isAnimating&&(console.log("🛑 Cancelling magical injection"),o.isAnimating=!1,o.animationController=void 0),o.active&&g();return}if(!(!o.active||o.isAnimating))switch(e.key){case"ArrowDown":e.preventDefault(),e.stopPropagation(),h(o.selectedIndex+1);break;case"ArrowUp":e.preventDefault(),e.stopPropagation(),h(o.selectedIndex-1);break;case"Enter":if(o.filteredSnippets.length>0){e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation();const t=o.filteredSnippets[o.selectedIndex];return t&&f(t),!1}break;case"Tab":if(o.filteredSnippets.length>0){e.preventDefault(),e.stopPropagation();const t=o.filteredSnippets[o.selectedIndex];t&&f(t)}break}}document.addEventListener("input",async e=>{const t=e.target;if(!(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable))return;let n="",i=0;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"){const c=t;n=c.value,i=c.selectionStart||0}else"value"in t&&typeof t.value=="string"?(n=t.value,i=n.length):(n=t.textContent||t.innerText||"",i=n.length);const s=n.slice(0,i).match(/x\/([^\/\s]*)$/);if(s){const c=s[1]||"",l=s.index||0;console.log("🔍 Snippet mode active, query:",c),o.active=!0,o.target=t,o.startPosition=l,o.searchQuery=c,o.selectedIndex=0;try{const d=await k();o.filteredSnippets=C(d,c);const p=v(d,c);if(p&&c.length>0){console.log("🎯 Exact match found for:",c,"-> triggering magical injection"),setTimeout(()=>{console.log("✨ Starting magical injection with border trace"),P(p)},150);return}m(o.filteredSnippets),document.getElementById("onyx-picker")||setTimeout(()=>{document.addEventListener("click",w)},0)}catch(d){console.error("Error loading snippets in content script:",d),o.filteredSnippets=[],m([])}}else o.active&&g()});document.addEventListener("keydown",e=>{A(e)},!0);const M=window.location.hostname.includes("claude.ai");M&&(console.log("🎯 Claude.ai detected - installing smart Enter key blocking"),document.addEventListener("keydown",e=>{if(e.key==="Enter"&&o.active){if(console.log("🚫 [Claude] Blocking Enter - snippet mode active"),e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),o.filteredSnippets.length>0&&document.getElementById("onyx-picker")){const t=o.filteredSnippets[o.selectedIndex];t&&(console.log("🎯 Inserting snippet:",t.title),f(t))}return!1}},!0),document.addEventListener("keypress",e=>{if(e.key==="Enter"&&o.active)return console.log("🚫 [Claude] Backup keypress blocking"),e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),!1},!0),document.addEventListener("submit",e=>{if(o.active)return console.log("🚫 [Claude] Form submission blocking"),e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),!1},!0),document.addEventListener("beforeinput",e=>{if(o.active&&(e.inputType==="insertLineBreak"||e.inputType==="insertParagraph"))return console.log("🚫 [Claude] BeforeInput line break blocking"),e.preventDefault(),e.stopPropagation(),!1},!0));window.addEventListener("beforeunload",()=>{g()});
