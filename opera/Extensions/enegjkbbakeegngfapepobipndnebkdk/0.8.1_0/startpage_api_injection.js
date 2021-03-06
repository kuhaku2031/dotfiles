(()=>{"use strict";var e={879:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DisplayTargetedSDSectionFunctionMessage=t.CallTestStartpageFunctionMessage=t.ACS_CallStartpageFunctionMessage=t.ACS_UseApiMessage=t.ContentScriptMessageWithApiType=t.ACS_ErrorMessage=t.CSA_StartpageAPIEventMessage=t.CSA_CallStartpageFunctionResponseMessage=t.ApiToContentScriptMessage=t.ContentScriptToApiMessage=t.ContentScriptConnectionMessage=void 0;class s{constructor(e,t){this.type=e,this.requestId=t,this.id=s.nextId++}}t.ContentScriptConnectionMessage=s,s.nextId=0;class r extends s{}t.ContentScriptToApiMessage=r;class n extends s{}t.ApiToContentScriptMessage=n;class o extends r{constructor(e,t,s){super("CSA_CallStartpageFunctionResponse",t),this.result=e,this.data=s}static fromRawMessage(e){if("CSA_CallStartpageFunctionResponse"!==e.type||"boolean"!=typeof e.result||"number"!=typeof e.requestId||"object"!=typeof e.data)throw new Error("Unparseable message");return new o(e.result,e.requestId,e.data)}}t.CSA_CallStartpageFunctionResponseMessage=o;class a extends r{constructor(e,t,s){super("CSA_StartpageAPIEvent"),this.result=e,this.name=t,this.data=s}static fromRawMessage(e){if("CSA_StartpageAPIEvent"!==e.type||"string"!=typeof e.name||"object"!=typeof e.data)throw new Error("Unparseable message");return new a(e.result,e.name,e.data)}}t.CSA_StartpageAPIEventMessage=a,t.ACS_ErrorMessage=class extends n{constructor(e){super("ACS_Error"),this.message=e}};class i extends n{constructor(e,t,s){super(e,s),this.functionName=t}}t.ContentScriptMessageWithApiType=i;class c extends i{constructor(e,t,s,r){super(e,t,s),this.params=r}}t.ACS_UseApiMessage=c;class l extends c{constructor(e,t,s,r){super(l.MESSAGE_TYPE,e,t,r),this.windowId=s}}t.ACS_CallStartpageFunctionMessage=l,l.MESSAGE_TYPE="ACS_CallStartpageFunction";class p extends l{constructor(e,t,s,r){super("TestStartpageFunction",e,t,{boxColour:s,text:r})}get boxColour(){return this.params.boxColour}get text(){return this.params.text}static fromParams(e,t,s){const r=s.get("colour");if("string"!=typeof r)throw new Error(`Bad colour ${r}`);const n=s.get("text");if("string"!=typeof r)throw new Error(`Bad colour ${r}`);return new p(e,t,r,n)}static fromRawMessage(e){if("object"!=typeof e.params)throw new Error("params not an object");if("string"!=typeof e.params.boxColour)throw new Error("boxColour not a string");if("string"!=typeof e.params.text)throw new Error("text not a string");return new p(e.requestId,e.windowId,e.params.boxColour,e.params.text)}}t.CallTestStartpageFunctionMessage=p;class u extends l{constructor(e,t,s,r,n,o){super("DisplayTargetedSDSection",e,t,{tiles:s,sectionTitle:r,menuOptionTitle:n,folded:o}),this.tiles=s,this.sectionTitle=r,this.menuOptionTitle=n,this.folded=o}static createTilesFromArray(e){let t=[];for(let s of e){if("string"!=typeof s.clickUrl)throw new Error("tiles[i].clickUrl must be a string");if("string"!=typeof s.imageUrl)throw new Error("tiles[i].imageUrl must be a string");if("string"!=typeof s.title)throw new Error("tiles[i].title must be a string");t.push({clickUrl:s.clickUrl,imageUrl:s.imageUrl,title:s.title})}return t}static fromParams(e,t,s){const r=s.get("tiles");if(!(r instanceof Array))throw new Error("tiles should be an array");const n=s.get("sectionTitle");if("string"!=typeof n)throw new Error("sectionTitle should be a string");const o=s.get("menuOptionTitle");if("string"!=typeof o)throw new Error("menuOptionTitle should be a string");const a=s.get("folded");if("boolean"!=typeof a)throw new Error("folded should be a boolean");return new u(e,t,u.createTilesFromArray(r),n,o,a)}static fromRawMessage(e){if("object"!=typeof e.params)throw new Error("params not an object");if(!(e.params.tiles instanceof Array))throw new Error("params.tiles not an array");if("string"!=typeof e.params.sectionTitle)throw new Error("sectionTitle should be a string");if("string"!=typeof e.params.menuOptionTitle)throw new Error("menuOptionTitle should be a string");if("boolean"!=typeof e.params.folded)throw new Error("folded should be a boolean");return new u(e.requestId,e.windowId,u.createTilesFromArray(e.tiles),e.params.sectionTitle,e.params.menuOptionTitle,e.params.folded)}}t.DisplayTargetedSDSectionFunctionMessage=u}},t={};function s(r){var n=t[r];if(void 0!==n)return n.exports;var o=t[r]={exports:{}};return e[r](o,o.exports,s),o.exports}(()=>{const e=s(879),t=chrome.runtime.connect({name:"sd_cs"});class r{static async injectScriptOfType(e){await new Promise((t=>{var s;const r=document.createElement("script");r.src=chrome.extension.getURL(e),(null!==(s=document.head)&&void 0!==s?s:document.documentElement).appendChild(r),r.onload=()=>t()}))}}class n extends r{constructor(){super(),this.currentRequestId=-1,window.addEventListener("message",(e=>{"show_box_done"===e.data.type&&(t.postMessage({type:"CSA_CallStartpageFunctionResponse",result:!0,requestId:this.currentRequestId,data:{}}),this.currentRequestId=-1)}))}static async inject(){return await r.injectScriptOfType("startpage_test_function.js"),new n}callShowBox(e){this.currentRequestId=e.requestId,window.postMessage({type:"show_box",boxColour:e.boxColour,text:e.text},"chrome://startpage")}}class o extends r{constructor(){super(),this.currentRequestId=-1,window.addEventListener("message",(e=>{switch(e.data.type){case"show_section_done":return void this.onShowSectionDone();case"show_section_event":return void this.onShowSectionEvent(e)}}))}callShowSection(e){this.currentRequestId=e.requestId,window.postMessage({type:"show_section",tiles:e.tiles,sectionTitle:e.sectionTitle,menuOptionTitle:e.menuOptionTitle,folded:e.folded},"chrome://startpage")}onShowSectionDone(){t.postMessage({type:"CSA_CallStartpageFunctionResponse",result:!0,requestId:this.currentRequestId,data:{}}),this.currentRequestId=-1}onShowSectionEvent(e){t.postMessage({type:"CSA_StartpageAPIEvent",name:e.data.name,data:e.data.data})}static async inject(){return await r.injectScriptOfType("targeted_sd_section.js"),new o}}let a=new class{constructor(){this.liveInjections=new Map}async getScriptPort(e,t){return this.liveInjections.has(e)||this.liveInjections.set(e,await t()),this.liveInjections.get(e)}async getTestStartpageFunctionScriptPort(){return await this.getScriptPort("startpage_test_function.js",(()=>n.inject()))}async getTargetedSDSectionScriptPort(){return await this.getScriptPort("targeted_sd_section.js",(()=>o.inject()))}};t.onDisconnect.addListener((()=>{window.postMessage({type:"agent_disconnected"},"chrome://startpage")})),t.onMessage.addListener((async t=>{const s=function(t){try{switch(t.functionName){case"TestStartpageFunction":return e.CallTestStartpageFunctionMessage.fromRawMessage(t);case"DisplayTargetedSDSection":return e.DisplayTargetedSDSectionFunctionMessage.fromRawMessage(t);default:return}}catch(e){return}}(t);if(s)switch(s.functionName){case"TestStartpageFunction":(await a.getTestStartpageFunctionScriptPort()).callShowBox(s);break;case"DisplayTargetedSDSection":(await a.getTargetedSDSectionScriptPort()).callShowSection(s)}else console.error("Bad message received from agent")}))})()})();