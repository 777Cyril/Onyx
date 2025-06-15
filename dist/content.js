function k(){return new Promise(e=>{chrome.storage.sync.get(null,t=>{try{const i=t["onyx-index"]||[],n=[];for(const r of i){const s=`snippet-${r}`,c=t[s];c&&n.push(c)}n.sort((r,s)=>(s.createdAt||0)-(r.createdAt||0)),e(n)}catch(i){console.error("Error loading snippets:",i),e([])}})})}function S(e,t){if(!t)return e;const i=t.toLowerCase();return e.filter(n=>(n.title||"").toLowerCase().includes(i)).sort((n,r)=>{const s=(n.title||"").toLowerCase().indexOf(i),c=(r.title||"").toLowerCase().indexOf(i);return s-c})}function v(e,t){return t.trim()&&e.find(n=>n.title.toLowerCase()===t.toLowerCase().trim())||null}let o={active:!1,target:null,startPosition:0,searchQuery:"",selectedIndex:0,filteredSnippets:[],isAnimating:!1,enterKeyBlocked:!1};function I(){let e=document.getElementById("onyx-picker");if(e)return e;e=document.createElement("div"),e.id="onyx-picker",Object.assign(e.style,{position:"absolute",background:"#2a2a2a",border:"1px solid #404040",borderRadius:"8px",padding:"0",fontSize:"14px",boxShadow:"0 8px 24px rgba(0,0,0,0.4)",zIndex:"2147483647",minWidth:"200px",maxWidth:"350px",maxHeight:"280px",overflowY:"auto",overflowX:"hidden"});const t=document.createElement("style");return t.textContent=`
        #onyx-picker::-webkit-scrollbar {
            width: 8px;
        }
        #onyx-picker::-webkit-scrollbar-track {
            background: #2a2a2a;
        }
        #onyx-picker::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 4px;
        }
        #onyx-picker::-webkit-scrollbar-thumb:hover {
            background: #666;
        }
        
        /* Border Trace Effect */
        @keyframes borderTrace {
            0% {
                box-shadow: inset 2px 0 0 #ff0000, inset 0 0 0 transparent;
            }
            25% {
                box-shadow: inset 2px 0 0 #ff0000, inset 0 2px 0 #ff0000;
            }
            50% {
                box-shadow: inset 0 0 0 transparent, inset 0 2px 0 #ff0000, inset -2px 0 0 #ff0000;
            }
            75% {
                box-shadow: inset 0 0 0 transparent, inset 0 -2px 0 #ff0000, inset -2px 0 0 #ff0000;
            }
            100% {
                box-shadow: inset 0 0 0 transparent;
            }
        }
        
        .onyx-border-trace-effect {
            animation: borderTrace 400ms ease-in-out !important;
        }
        
        
        .onyx-exact-match {
            background: #1a3a1a !important;
            border-left: 3px solid #ff0000 !important;
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
            color: #ff0000;
            opacity: 0.8;
        }
    `,document.head.appendChild(t),document.body.appendChild(e),e}function g(){console.log("🚪 Hiding picker and resetting snippet mode");const e=document.getElementById("onyx-picker");e&&e.remove(),o.target,o.isAnimating&&o.animationController&&o.animationController.abort(),o={active:!1,target:null,startPosition:0,searchQuery:"",selectedIndex:0,filteredSnippets:[],isAnimating:!1,enterKeyBlocked:!1},console.log("✅ Snippet mode reset - Enter key should work normally now"),document.removeEventListener("click",w)}function w(e){const t=document.getElementById("onyx-picker"),i=e.target;t&&!t.contains(i)&&i!==o.target&&g()}function C(e){if(!e)return;console.log("🔳 Applying border trace effect");const t=e.style.boxShadow||"";e.classList.add("onyx-border-trace-effect"),setTimeout(()=>{e.classList.remove("onyx-border-trace-effect"),e.style.boxShadow=t,console.log("✅ Border trace effect completed")},400)}function T(e,t){if(!t)return e;const i=new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return e.replace(i,'<span style="color: #ff0000; font-weight: 500;">$1</span>')}function x(e,t){const i=t.getBoundingClientRect(),n=e.offsetHeight,s=window.innerHeight-i.bottom,c=i.top;let a=i.bottom+window.scrollY+8,l=i.left+window.scrollX;s<n&&c>s&&(a=i.top+window.scrollY-n-8);const d=e.offsetWidth,p=window.innerWidth;if(l+d>p-20&&(l=p-d-20),t.isContentEditable&&o.startPosition>0){const u=window.getSelection();if(u&&u.rangeCount>0){const m=u.getRangeAt(0).getClientRects();if(m.length>0){const h=m[0];l=h.left+window.scrollX,a=h.bottom+window.scrollY+8,l+d>p-20&&(l=p-d-20)}}}e.style.top=`${a}px`,e.style.left=`${l}px`}function b(e){const t=I();if(t.innerHTML="",e.length===0){const n=document.createElement("div");n.textContent="No matching prompts",Object.assign(n.style,{padding:"12px 16px",color:"#999",fontStyle:"italic",textAlign:"center"}),t.appendChild(n),x(t,o.target);return}const i=v(e,o.searchQuery);e.forEach((n,r)=>{const s=document.createElement("div");s.setAttribute("data-snippet-index",r.toString());const c=i&&n.id===i.id,a=T(n.title||`Snippet ${r+1}`,o.searchQuery);s.innerHTML=`<div>${a}</div>`,c&&s.classList.add("onyx-exact-match","onyx-ready-indicator"),Object.assign(s.style,{padding:"10px 16px",cursor:"pointer",backgroundColor:r===o.selectedIndex?"#404040":"transparent",color:"#e5e5e5",borderBottom:r<e.length-1?"1px solid #333":"none",transition:"background-color 0.15s ease, border-color 0.15s ease",borderRadius:r===0?"8px 8px 0 0":r===e.length-1?"0 0 8px 8px":"0"}),s.addEventListener("mouseenter",()=>{c||(s.style.backgroundColor="#404040"),o.selectedIndex=r,E()}),s.addEventListener("mouseleave",()=>{r!==o.selectedIndex&&!c&&(s.style.backgroundColor="transparent")}),s.addEventListener("mousedown",l=>{l.preventDefault(),f(n)}),t.appendChild(s)}),x(t,o.target)}function E(){const e=document.getElementById("onyx-picker");if(!e)return;e.querySelectorAll("[data-snippet-index]").forEach((i,n)=>{const r=i;r.style.backgroundColor=n===o.selectedIndex?"#404040":"transparent"})}function y(e){const t=document.getElementById("onyx-picker");if(!t)return;o.selectedIndex=Math.max(0,Math.min(e,o.filteredSnippets.length-1)),E();const n=t.querySelectorAll("[data-snippet-index]")[o.selectedIndex];n&&n.scrollIntoView({block:"nearest"})}function L(e,t,i){console.log("🔧 Safe contentEditable insertion for Claude.ai");try{if("value"in e&&typeof e.value=="string"){const n=e,r=n.value||"",s=r.length,c=r.slice(0,i),a=r.slice(s),l=c+t+a;if(n.value=l,n.focus&&n.focus(),n.setSelectionRange){const d=c.length+t.length;n.setSelectionRange(d,d)}return n.dispatchEvent(new Event("input",{bubbles:!0})),n.dispatchEvent(new Event("change",{bubbles:!0})),console.log("✅ Used direct value manipulation method"),!0}if(e.textContent!==null){const n=e.textContent||"",r=n.slice(0,i),s=n.slice(Math.max(i+o.searchQuery.length+2,r.length));return e.textContent=r+t+s,e.focus&&e.focus(),e.dispatchEvent(new InputEvent("input",{bubbles:!0,cancelable:!0,inputType:"insertText",data:t})),console.log("✅ Used textContent manipulation method"),!0}if(e.innerHTML!==void 0){const n=e.innerHTML,r=n.slice(0,i),s=n.slice(Math.max(i+o.searchQuery.length+2,r.length));return e.innerHTML=r+t+s,e.focus&&e.focus(),e.dispatchEvent(new InputEvent("input",{bubbles:!0,cancelable:!0,inputType:"insertText",data:t})),console.log("✅ Used innerHTML manipulation method"),!0}return console.log("❌ No suitable insertion method found"),!1}catch(n){return console.error("❌ Error in safe contentEditable insertion:",n),!1}}function f(e,t=!1){if(!o.target)return;const i=o.target,n=o.startPosition,r=e.content||"";console.log("🎯 Inserting snippet:",e.title,t?"(Magic Injection)":"(Manual)");try{if(i.tagName==="INPUT"||i.tagName==="TEXTAREA"){const s=i,c=s.value,a=s.selectionStart||0,l=c.slice(0,n),d=c.slice(a),p=l+r+d;s.value=p;const u=l.length+r.length;s.setSelectionRange(u,u),s.dispatchEvent(new Event("input",{bubbles:!0})),s.dispatchEvent(new Event("change",{bubbles:!0}))}else if(i.isContentEditable&&!L(i,r,n)){console.log("⚠️ Fallback: Using basic textContent replacement");const c=i.textContent||"",a=c.slice(0,n),l=c.slice(n+o.searchQuery.length+2);i.textContent=a+r+l,i.dispatchEvent(new InputEvent("input",{bubbles:!0,cancelable:!0,inputType:"insertText",data:r}))}t&&C(i),console.log("✅ Snippet inserted successfully")}catch(s){console.error("❌ Error inserting snippet:",s)}g()}function P(e){console.log("🪄 Starting magical injection with border trace effect"),f(e,!0)}function A(e){if(e.key==="Escape"){e.preventDefault(),o.isAnimating&&(console.log("🛑 Cancelling magical injection"),o.isAnimating=!1,o.animationController=void 0),o.active&&g();return}if(!(!o.active||o.isAnimating))switch(e.key){case"ArrowDown":e.preventDefault(),e.stopPropagation(),y(o.selectedIndex+1);break;case"ArrowUp":e.preventDefault(),e.stopPropagation(),y(o.selectedIndex-1);break;case"Enter":if(o.filteredSnippets.length>0){e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation();const t=o.filteredSnippets[o.selectedIndex];return t&&f(t),!1}break;case"Tab":if(o.filteredSnippets.length>0){e.preventDefault(),e.stopPropagation();const t=o.filteredSnippets[o.selectedIndex];t&&f(t)}break}}document.addEventListener("input",async e=>{const t=e.target;if(!(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable))return;let n="",r=0;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"){const a=t;n=a.value,r=a.selectionStart||0}else"value"in t&&typeof t.value=="string"?(n=t.value,r=n.length):(n=t.textContent||t.innerText||"",r=n.length);const c=n.slice(0,r).match(/x\/([^\/\s]*)$/);if(c){const a=c[1]||"",l=c.index||0;console.log("🔍 Snippet mode active, query:",a),o.active=!0,o.target=t,o.startPosition=l,o.searchQuery=a,o.selectedIndex=0;try{const d=await k();o.filteredSnippets=S(d,a);const p=v(d,a);if(p&&a.length>0){console.log("🎯 Exact match found for:",a,"-> triggering magical injection"),setTimeout(()=>{console.log("✨ Starting magical injection with border trace"),P(p)},150);return}b(o.filteredSnippets),document.getElementById("onyx-picker")||setTimeout(()=>{document.addEventListener("click",w)},0)}catch(d){console.error("Error loading snippets in content script:",d),o.filteredSnippets=[],b([])}}else o.active&&g()});document.addEventListener("keydown",e=>{A(e)},!0);const M=window.location.hostname.includes("claude.ai");M&&(console.log("🎯 Claude.ai detected - installing smart Enter key blocking"),document.addEventListener("keydown",e=>{if(e.key==="Enter"&&o.active){if(console.log("🚫 [Claude] Blocking Enter - snippet mode active"),e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),o.filteredSnippets.length>0&&document.getElementById("onyx-picker")){const t=o.filteredSnippets[o.selectedIndex];t&&(console.log("🎯 Inserting snippet:",t.title),f(t))}return!1}},!0),document.addEventListener("keypress",e=>{if(e.key==="Enter"&&o.active)return console.log("🚫 [Claude] Backup keypress blocking"),e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),!1},!0),document.addEventListener("submit",e=>{if(o.active)return console.log("🚫 [Claude] Form submission blocking"),e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),!1},!0),document.addEventListener("beforeinput",e=>{if(o.active&&(e.inputType==="insertLineBreak"||e.inputType==="insertParagraph"))return console.log("🚫 [Claude] BeforeInput line break blocking"),e.preventDefault(),e.stopPropagation(),!1},!0));window.addEventListener("beforeunload",()=>{g()});
