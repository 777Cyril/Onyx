const x={light:{brandPrimary:"#e85a4f",brandSecondary:"#495057",bgPrimary:"#ffffff",bgSecondary:"#f8f9fa",bgTertiary:"#e9ecef",bgHover:"#dee2e6",borderPrimary:"#dee2e6",borderSecondary:"#e85a4f",textPrimary:"#212529",textSecondary:"#6c757d",textMuted:"#adb5bd",scrollbarThumb:"#e85a4f",scrollbarThumbHover:"#dc3545"},dark:{brandPrimary:"#ff0000",brandSecondary:"#000000",bgPrimary:"#121212",bgSecondary:"#2d2d2d",bgTertiary:"#1a1a1a",bgHover:"#3a3a3a",borderPrimary:"#444444",borderSecondary:"#ff0000",textPrimary:"#ffffff",textSecondary:"#cccccc",textMuted:"#888888",scrollbarThumb:"#666666",scrollbarThumbHover:"#777777"}};async function T(){try{return(await chrome.storage.sync.get("onyx-theme"))["onyx-theme"]||"light"}catch(e){return console.error("Error getting theme in content script:",e),"light"}}function b(e,t){const n=x[t]||x.light;e.textContent=`
        /* Onyx ${t==="dark"?"Dark":"Light"} Theme - Content Script */
        :root {
            --onyx-brand-primary: ${n.brandPrimary};
            --onyx-brand-secondary: ${n.brandSecondary};
            --onyx-bg-primary: ${n.bgPrimary};
            --onyx-bg-secondary: ${n.bgSecondary};
            --onyx-bg-tertiary: ${n.bgTertiary};
            --onyx-bg-hover: ${n.bgHover};
            --onyx-border-primary: ${n.borderPrimary};
            --onyx-border-secondary: ${n.borderSecondary};
            --onyx-text-primary: ${n.textPrimary};
            --onyx-text-secondary: ${n.textSecondary};
            --onyx-text-muted: ${n.textMuted};
            --onyx-scrollbar-thumb: ${n.scrollbarThumb};
            --onyx-scrollbar-thumb-hover: ${n.scrollbarThumbHover};
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
        
        /* Border Trace Effect - Dynamic theme colors */
        @keyframes borderTrace {
            0% {
                box-shadow: inset 2px 0 0 ${n.brandPrimary}, inset 0 0 0 transparent;
            }
            25% {
                box-shadow: inset 2px 0 0 ${n.brandPrimary}, inset 0 2px 0 ${n.brandPrimary};
            }
            50% {
                box-shadow: inset 0 0 0 transparent, inset 0 2px 0 ${n.brandPrimary}, inset -2px 0 0 ${n.brandPrimary};
            }
            75% {
                box-shadow: inset 0 0 0 transparent, inset 0 -2px 0 ${n.brandPrimary}, inset -2px 0 0 ${n.brandPrimary};
            }
            100% {
                box-shadow: inset 0 0 0 transparent;
            }
        }
        
        .onyx-border-trace-effect {
            animation: borderTrace 400ms ease-in-out !important;
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
            animation: magicPulse 2s ease-in-out infinite;
        }
        
        /* Magic Pulse Animation */
        @keyframes magicPulse {
            0%, 100% {
                opacity: 0.8;
                text-shadow: 0 0 3px var(--onyx-brand-primary);
            }
            50% {
                opacity: 1;
                text-shadow: 0 0 6px var(--onyx-brand-primary), 0 0 12px var(--onyx-brand-primary);
            }
        }
        
        /* Enhanced Exact Match Styling */
        .onyx-exact-match {
            background: rgba(${t==="dark"?"255, 0, 0":"232, 90, 79"}, 0.1) !important;
            border-left: 3px solid var(--onyx-brand-primary) !important;
            position: relative;
            overflow: hidden;
        }
        
        .onyx-exact-match::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(${t==="dark"?"255, 0, 0":"232, 90, 79"}, 0.2),
                rgba(255, 255, 255, 0.3),
                rgba(${t==="dark"?"255, 0, 0":"232, 90, 79"}, 0.2),
                transparent
            );
            animation: magicSweep 3s ease-in-out infinite;
        }
        
        @keyframes magicSweep {
            0% {
                left: -100%;
            }
            50% {
                left: 100%;
            }
            100% {
                left: 100%;
            }
        }
    `}async function C(e){try{const t=await T();b(e,t),chrome.storage.onChanged.addListener((n,r)=>{if(r==="sync"&&n["onyx-theme"]){const i=n["onyx-theme"].newValue;i&&b(e,i)}})}catch(t){console.error("Error initializing content script theme:",t),b(e,"light")}}function P(){return new Promise(e=>{chrome.storage.sync.get(null,t=>{try{const n=t["onyx-index"]||[],r=[];for(const i of n){const a=`snippet-${i}`,c=t[a];c&&r.push(c)}r.sort((i,a)=>(a.createdAt||0)-(i.createdAt||0)),e(r)}catch(n){console.error("Error loading snippets:",n),e([])}})})}function I(e,t){if(!t)return e;const n=t.toLowerCase();return e.filter(r=>(r.title||"").toLowerCase().includes(n)).sort((r,i)=>{const a=(r.title||"").toLowerCase().indexOf(n),c=(i.title||"").toLowerCase().indexOf(n);return a-c})}function k(e,t){return t.trim()&&e.find(r=>r.title.toLowerCase()===t.toLowerCase().trim())||null}let o={active:!1,target:null,startPosition:0,searchQuery:"",selectedIndex:0,filteredSnippets:[],isAnimating:!1,enterKeyBlocked:!1};function $(){let e=document.getElementById("onyx-picker");if(e)return e;e=document.createElement("div"),e.id="onyx-picker",Object.assign(e.style,{position:"absolute",background:"var(--onyx-bg-secondary)",border:"1px solid var(--onyx-border-secondary)",borderRadius:"8px",padding:"0",fontSize:"14px",boxShadow:"0 8px 24px rgba(0,0,0,0.4)",zIndex:"2147483647",minWidth:"200px",maxWidth:"350px",maxHeight:"280px",overflowY:"auto",overflowX:"hidden"});const t=document.createElement("style");return t.id="onyx-theme-styles",C(t),document.head.appendChild(t),document.body.appendChild(e),e}function g(){console.log("🚪 Hiding picker and resetting snippet mode");const e=document.getElementById("onyx-picker");e&&e.remove(),o.target,o.isAnimating&&o.animationController&&o.animationController.abort(),o={active:!1,target:null,startPosition:0,searchQuery:"",selectedIndex:0,filteredSnippets:[],isAnimating:!1,enterKeyBlocked:!1},console.log("✅ Snippet mode reset - Enter key should work normally now"),document.removeEventListener("click",E)}function E(e){const t=document.getElementById("onyx-picker"),n=e.target;t&&!t.contains(n)&&n!==o.target&&g()}function L(e){if(!e)return;console.log("🔳 Applying border trace effect");const t=e.style.boxShadow||"";e.classList.add("onyx-border-trace-effect"),setTimeout(()=>{e.classList.remove("onyx-border-trace-effect"),e.style.boxShadow=t,console.log("✅ Border trace effect completed")},400)}function M(e,t){if(!t)return e;const n=new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return e.replace(n,'<span style="color: var(--onyx-brand-primary); font-weight: 500;">$1</span>')}function h(e,t){const n=t.getBoundingClientRect(),r=e.offsetHeight,a=window.innerHeight-n.bottom,c=n.top;let s=n.bottom+window.scrollY+8,l=n.left+window.scrollX;a<r&&c>a&&(s=n.top+window.scrollY-r-8);const d=e.offsetWidth,p=window.innerWidth;if(l+d>p-20&&(l=p-d-20),t.isContentEditable&&o.startPosition>0){const u=window.getSelection();if(u&&u.rangeCount>0){const y=u.getRangeAt(0).getClientRects();if(y.length>0){const m=y[0];l=m.left+window.scrollX,s=m.bottom+window.scrollY+8,l+d>p-20&&(l=p-d-20)}}}e.style.top=`${s}px`,e.style.left=`${l}px`}function v(e){const t=$();if(t.innerHTML="",e.length===0){const r=document.createElement("div");r.textContent="No matching prompts",Object.assign(r.style,{padding:"12px 16px",color:"var(--onyx-text-secondary)",fontStyle:"italic",textAlign:"center"}),t.appendChild(r),h(t,o.target);return}const n=k(e,o.searchQuery);e.forEach((r,i)=>{const a=document.createElement("div");a.setAttribute("data-snippet-index",i.toString());const c=n&&r.id===n.id,s=M(r.title||`Snippet ${i+1}`,o.searchQuery);a.innerHTML=`<div>${s}</div>`,c&&a.classList.add("onyx-exact-match","onyx-ready-indicator"),Object.assign(a.style,{padding:"10px 16px",cursor:"pointer",backgroundColor:i===o.selectedIndex?"var(--onyx-bg-hover)":"transparent",color:"var(--onyx-text-primary)",borderBottom:i<e.length-1?"1px solid var(--onyx-border-primary)":"none",transition:"background-color 0.15s ease, border-color 0.15s ease",borderRadius:i===0?"8px 8px 0 0":i===e.length-1?"0 0 8px 8px":"0"}),a.addEventListener("mouseenter",()=>{c||(a.style.backgroundColor="var(--onyx-bg-hover)"),o.selectedIndex=i,S()}),a.addEventListener("mouseleave",()=>{i!==o.selectedIndex&&!c&&(a.style.backgroundColor="transparent")}),a.addEventListener("mousedown",l=>{l.preventDefault(),f(r,!0)}),t.appendChild(a)}),h(t,o.target)}function S(){const e=document.getElementById("onyx-picker");if(!e)return;e.querySelectorAll("[data-snippet-index]").forEach((n,r)=>{const i=n;i.style.backgroundColor=r===o.selectedIndex?"var(--onyx-bg-hover)":"transparent"})}function w(e){const t=document.getElementById("onyx-picker");if(!t)return;o.selectedIndex=Math.max(0,Math.min(e,o.filteredSnippets.length-1)),S();const r=t.querySelectorAll("[data-snippet-index]")[o.selectedIndex];r&&r.scrollIntoView({block:"nearest"})}function A(e,t,n){console.log("🔧 Safe contentEditable insertion for Claude.ai");try{if("value"in e&&typeof e.value=="string"){const r=e,i=r.value||"",a=i.length,c=i.slice(0,n),s=i.slice(a),l=c+t+s;if(r.value=l,r.focus&&r.focus(),r.setSelectionRange){const d=c.length+t.length;r.setSelectionRange(d,d)}return r.dispatchEvent(new Event("input",{bubbles:!0})),r.dispatchEvent(new Event("change",{bubbles:!0})),console.log("✅ Used direct value manipulation method"),!0}if(e.textContent!==null){const r=e.textContent||"",i=r.slice(0,n),a=r.slice(Math.max(n+o.searchQuery.length+2,i.length));return e.textContent=i+t+a,e.focus&&e.focus(),e.dispatchEvent(new InputEvent("input",{bubbles:!0,cancelable:!0,inputType:"insertText",data:t})),console.log("✅ Used textContent manipulation method"),!0}if(e.innerHTML!==void 0){const r=e.innerHTML,i=r.slice(0,n),a=r.slice(Math.max(n+o.searchQuery.length+2,i.length));return e.innerHTML=i+t+a,e.focus&&e.focus(),e.dispatchEvent(new InputEvent("input",{bubbles:!0,cancelable:!0,inputType:"insertText",data:t})),console.log("✅ Used innerHTML manipulation method"),!0}return console.log("❌ No suitable insertion method found"),!1}catch(r){return console.error("❌ Error in safe contentEditable insertion:",r),!1}}function f(e,t=!1){if(!o.target)return;const n=o.target,r=o.startPosition,i=e.content||"";console.log("🎯 Inserting snippet:",e.title,t?"(Magic Injection)":"(Manual)");try{if(n.tagName==="INPUT"||n.tagName==="TEXTAREA"){const a=n,c=a.value,s=a.selectionStart||0,l=c.slice(0,r),d=c.slice(s),p=l+i+d;a.value=p;const u=l.length+i.length;a.setSelectionRange(u,u),a.dispatchEvent(new Event("input",{bubbles:!0})),a.dispatchEvent(new Event("change",{bubbles:!0}))}else if(n.isContentEditable&&!A(n,i,r)){console.log("⚠️ Fallback: Using basic textContent replacement");const c=n.textContent||"",s=c.slice(0,r),l=c.slice(r+o.searchQuery.length+2);n.textContent=s+i+l,n.dispatchEvent(new InputEvent("input",{bubbles:!0,cancelable:!0,inputType:"insertText",data:i}))}t&&L(n),console.log("✅ Snippet inserted successfully")}catch(a){console.error("❌ Error inserting snippet:",a)}g()}function H(e){console.log("🪄 Starting magical injection with border trace effect"),f(e,!0)}function B(e){if(e.key==="Escape"){e.preventDefault(),o.isAnimating&&(console.log("🛑 Cancelling magical injection"),o.isAnimating=!1,o.animationController=void 0),o.active&&g();return}if(!(!o.active||o.isAnimating))switch(e.key){case"ArrowDown":e.preventDefault(),e.stopPropagation(),w(o.selectedIndex+1);break;case"ArrowUp":e.preventDefault(),e.stopPropagation(),w(o.selectedIndex-1);break;case"Enter":if(o.filteredSnippets.length>0){e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation();const t=o.filteredSnippets[o.selectedIndex];return t&&f(t,!0),!1}break;case"Tab":if(o.filteredSnippets.length>0){e.preventDefault(),e.stopPropagation();const t=o.filteredSnippets[o.selectedIndex];t&&f(t,!0)}break}}document.addEventListener("input",async e=>{const t=e.target;if(!(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable))return;let r="",i=0;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"){const s=t;r=s.value,i=s.selectionStart||0}else"value"in t&&typeof t.value=="string"?(r=t.value,i=r.length):(r=t.textContent||t.innerText||"",i=r.length);const c=r.slice(0,i).match(/x\/([^\/\s]*)$/);if(c){const s=c[1]||"",l=c.index||0;console.log("🔍 Snippet mode active, query:",s),o.active=!0,o.target=t,o.startPosition=l,o.searchQuery=s,o.selectedIndex=0;try{const d=await P();o.filteredSnippets=I(d,s);const p=k(d,s);if(p&&s.length>0){console.log("🎯 Exact match found for:",s,"-> triggering magical injection"),setTimeout(()=>{console.log("✨ Starting magical injection with border trace"),H(p)},150);return}v(o.filteredSnippets),document.getElementById("onyx-picker")||setTimeout(()=>{document.addEventListener("click",E)},0)}catch(d){console.error("Error loading snippets in content script:",d),o.filteredSnippets=[],v([])}}else o.active&&g()});document.addEventListener("keydown",e=>{B(e)},!0);const R=window.location.hostname.includes("claude.ai");R&&(console.log("🎯 Claude.ai detected - installing smart Enter key blocking"),document.addEventListener("keydown",e=>{if(e.key==="Enter"&&o.active){if(console.log("🚫 [Claude] Blocking Enter - snippet mode active"),e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),o.filteredSnippets.length>0&&document.getElementById("onyx-picker")){const t=o.filteredSnippets[o.selectedIndex];t&&(console.log("🎯 Inserting snippet:",t.title),f(t,!0))}return!1}},!0),document.addEventListener("keypress",e=>{if(e.key==="Enter"&&o.active)return console.log("🚫 [Claude] Backup keypress blocking"),e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),!1},!0),document.addEventListener("submit",e=>{if(o.active)return console.log("🚫 [Claude] Form submission blocking"),e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),!1},!0),document.addEventListener("beforeinput",e=>{if(o.active&&(e.inputType==="insertLineBreak"||e.inputType==="insertParagraph"))return console.log("🚫 [Claude] BeforeInput line break blocking"),e.preventDefault(),e.stopPropagation(),!1},!0));window.addEventListener("beforeunload",()=>{g()});
