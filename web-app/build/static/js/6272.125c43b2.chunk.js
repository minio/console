(self.webpackChunkweb_app=self.webpackChunkweb_app||[]).push([[6272],{76272:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>p});var o=n(72791),l=n(95087),s=n(78687),a=n(29945),c=n(44690),r=n(45248),i=n(26824),u=n(10679),d=n(87995),h=n(81207),b=n(79844),f=n(61342),x=n(80184);const p=()=>{const e=(0,c.TL)(),t=(0,s.v9)((e=>e.watch.messages)),[n,p]=(0,o.useState)(!1),[w,g]=(0,o.useState)("Select Bucket"),[m,j]=(0,o.useState)(""),[v,k]=(0,o.useState)(""),[y,S]=(0,o.useState)([]);(0,o.useEffect)((()=>{h.Z.invoke("GET","/api/v1/buckets").then((e=>{let t=[];null!==e.buckets&&(t=e.buckets),S(t)})).catch((e=>{console.error(e)}))}),[]),(0,o.useEffect)((()=>{if(e((0,u.uE)()),n&&y.some((e=>e.name===w))){const t=new URL(window.location.toString()),n=!1?"9090":t.port,o=new URL(document.baseURI).pathname,s=(0,i.x2)(t.protocol),a=new l.w3cwebsocket("".concat(s,"://").concat(t.hostname,":").concat(n).concat(o,"ws/watch/").concat(w,"?prefix=").concat(m,"&suffix=").concat(v));let c=null;if(null!==a)return a.onopen=()=>{console.log("WebSocket Client Connected"),a.send("ok"),c=setInterval((()=>{a.send("ok")}),1e4)},a.onmessage=t=>{let n=JSON.parse(t.data.toString());n.Time=new Date(n.Time.toString()),n.key=Math.random(),e((0,u.pG)(n))},a.onclose=()=>{clearInterval(c),console.log("connection closed by server"),p(!1)},()=>{a.close(1e3),clearInterval(c),console.log("closing websockets")}}else p(!1)}),[e,n,y,w,m,v]);const C=y.map((e=>({label:e.name,value:e.name})));(0,o.useEffect)((()=>{e((0,d.Sc)("watch"))}),[]);const _=C.map((e=>({label:e.label,value:e.value})));return(0,x.jsxs)(o.Fragment,{children:[(0,x.jsx)(b.Z,{label:"Watch",actions:(0,x.jsx)(f.Z,{})}),(0,x.jsx)(a.Xgh,{children:(0,x.jsxs)(a.rjZ,{container:!0,children:[(0,x.jsxs)(a.rjZ,{item:!0,xs:12,sx:{display:"flex",gap:10,marginBottom:15,alignItems:"center"},children:[(0,x.jsxs)(a.xuv,{sx:{flexGrow:1},children:[(0,x.jsx)(a.AZs,{children:"Bucket"}),(0,x.jsx)(a.PhF,{id:"bucket-name",name:"bucket-name",value:w,onChange:e=>{g(e)},disabled:n,options:_,placeholder:"Select Bucket"})]}),(0,x.jsxs)(a.xuv,{sx:{flexGrow:1},children:[(0,x.jsx)(a.AZs,{children:"Prefix"}),(0,x.jsx)(a.Wzg,{id:"prefix-resource",disabled:n,onChange:e=>{j(e.target.value)}})]}),(0,x.jsxs)(a.xuv,{sx:{flexGrow:1},children:[(0,x.jsx)(a.AZs,{children:"Suffix"}),(0,x.jsx)(a.Wzg,{id:"suffix-resource",disabled:n,onChange:e=>{k(e.target.value)}})]}),(0,x.jsx)(a.xuv,{sx:{alignSelf:"flex-end",paddingBottom:4},children:n?(0,x.jsx)(a.zxk,{id:"stop-watch",type:"submit",variant:"callAction",onClick:()=>p(!1),label:"Stop"}):(0,x.jsx)(a.zxk,{id:"start-watch",type:"submit",variant:"callAction",onClick:()=>p(!0),label:"Start"})})]}),(0,x.jsx)(a.rjZ,{item:!0,xs:12,children:(0,x.jsx)(a.wQF,{columns:[{label:"Time",elementKey:"Time",renderFunction:r.zk},{label:"Size",elementKey:"Size",renderFunction:r.ae},{label:"Type",elementKey:"Type"},{label:"Path",elementKey:"Path"}],records:t,entityName:"Watch",customEmptyMessage:"No Changes at this time",idField:"watch_table",isLoading:!1,customPaperHeight:"calc(100vh - 270px)"})})]})})]})}},94210:e=>{var t=function(){if("object"===typeof self&&self)return self;if("object"===typeof window&&window)return window;throw new Error("Unable to resolve global `this`")};e.exports=function(){if(this)return this;if("object"===typeof globalThis&&globalThis)return globalThis;try{Object.defineProperty(Object.prototype,"__global__",{get:function(){return this},configurable:!0})}catch(e){return t()}try{return __global__||t()}finally{delete Object.prototype.__global__}}()},95087:(e,t,n)=>{var o;if("object"===typeof globalThis)o=globalThis;else try{o=n(94210)}catch(c){}finally{if(o||"undefined"===typeof window||(o=window),!o)throw new Error("Could not determine global this")}var l=o.WebSocket||o.MozWebSocket,s=n(51496);function a(e,t){return t?new l(e,t):new l(e)}l&&["CONNECTING","OPEN","CLOSING","CLOSED"].forEach((function(e){Object.defineProperty(a,e,{get:function(){return l[e]}})})),e.exports={w3cwebsocket:l?a:null,version:s}},51496:(e,t,n)=>{e.exports=n(19794).version},19794:e=>{"use strict";e.exports={version:"1.0.34"}}}]);
//# sourceMappingURL=6272.125c43b2.chunk.js.map