"use strict";(self.webpackChunkweb_app=self.webpackChunkweb_app||[]).push([[1705],{71705:(e,t,l)=>{l.r(t),l.d(t,{default:()=>_});var s=l(72791),a=l(26181),n=l.n(a),c=l(29945),o=l(56087),d=l(38442),r=l(87995),i=l(44690),u=l(9505),p=l(75578),x=l(80184);const T=(0,p.Z)(s.lazy((()=>l.e(247).then(l.bind(l,40247))))),h=(0,p.Z)(s.lazy((()=>l.e(2763).then(l.bind(l,22763))))),_=e=>{let{bucketName:t}=e;const l=(0,i.TL)(),[a,p]=(0,s.useState)(null),[_,v]=(0,s.useState)(!1),[b,S]=(0,s.useState)([]),[j,g]=(0,s.useState)(["",""]),[C,G]=(0,s.useState)(!1),[f,k]=(0,u.Z)((e=>{if(e&&null!=(null===e||void 0===e?void 0:e.details)){var t,l;if(e.details.tags)return p(null===e||void 0===e||null===(t=e.details)||void 0===t?void 0:t.tags),void S(Object.keys(null===e||void 0===e||null===(l=e.details)||void 0===l?void 0:l.tags));p([]),S([])}}),(e=>{l((0,r.Ih)(e))})),A=()=>{k("GET","/api/v1/buckets/".concat(t))};return(0,s.useEffect)((()=>{A()}),[t]),(0,x.jsxs)(c.xuv,{children:[f?(0,x.jsx)(c.aNw,{style:{width:16,height:16}}):null,(0,x.jsx)(d.s,{scopes:[o.Ft.S3_GET_BUCKET_TAGGING,o.Ft.S3_GET_ACTIONS],resource:t,children:(0,x.jsx)(c.xuv,{sx:{display:"flex",flexFlow:"column",marginTop:5},children:(0,x.jsxs)(c.xuv,{sx:{display:"flex",gap:8,flexWrap:"wrap"},children:[b&&b.map(((e,l)=>{const s=n()(a,"".concat(e),"");return""!==s?(0,x.jsx)(d.s,{scopes:[o.Ft.S3_PUT_BUCKET_TAGGING,o.Ft.S3_PUT_ACTIONS],resource:t,matchAll:!0,errorProps:{deleteIcon:null,onDelete:null},children:(0,x.jsx)(c.Vp9,{label:"".concat(e," : ").concat(s),id:"tag-".concat(e,"-").concat(s),onDelete:()=>{((e,t)=>{g([e,t]),G(!0)})(e,s)}})},"chip-".concat(l)):null})),(0,x.jsx)(d.s,{scopes:[o.Ft.S3_PUT_BUCKET_TAGGING,o.Ft.S3_PUT_ACTIONS],resource:t,errorProps:{disabled:!0,onClick:null},children:(0,x.jsx)(c.Vp9,{label:"Add tag",icon:(0,x.jsx)(c.dtP,{}),id:"create-tag",variant:"outlined",onClick:()=>{v(!0)},sx:{cursor:"pointer",maxWidth:90}})})]})})}),_&&(0,x.jsx)(T,{modalOpen:_,currentTags:a,bucketName:t,onCloseAndUpdate:e=>{v(!1),e&&A()}}),C&&(0,x.jsx)(h,{deleteOpen:C,currentTags:a,bucketName:t,onCloseAndUpdate:e=>{G(!1),e&&A()},selectedTag:j})]})}}}]);
//# sourceMappingURL=1705.ce6a24f0.chunk.js.map