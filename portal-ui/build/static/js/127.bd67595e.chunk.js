(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[127],{411:function(e,t,n){"use strict";var c=n(1),a=n(2),o=n.n(a),i=n(413),s=n(414),r=n(415),l=n(458),u=n(385),d=n(467),j=n(387),b=n(125),f=n.n(b),O=n(307),v=n(319),m=n(122),p=n(0);t.a=Object(v.a)((function(e){return Object(O.a)(Object(c.a)({},m.h))}))((function(e){var t=e.isOpen,n=void 0!==t&&t,a=e.onClose,b=e.onCancel,O=e.onConfirm,v=e.classes,m=void 0===v?{}:v,x=e.title,h=void 0===x?"":x,C=e.isLoading,k=e.confirmationContent,N=e.cancelText,g=void 0===N?"Cancel":N,E=e.confirmText,y=void 0===E?"Confirm":E,B=e.confirmButtonProps,T=void 0===B?{}:B,D=e.cancelButtonProps,M=void 0===D?{}:D;return Object(p.jsxs)(i.a,{open:n,onClose:function(e,t){"backdropClick"!==t&&a()},className:m.root,sx:{"& .MuiPaper-root":{padding:"1rem 2rem 2rem 1rem"}},children:[Object(p.jsxs)(s.a,{className:m.title,children:[Object(p.jsx)("div",{className:m.titleText,children:h}),Object(p.jsx)("div",{className:m.closeContainer,children:Object(p.jsx)(j.a,{"aria-label":"close",className:m.closeButton,onClick:a,disableRipple:!0,size:"small",children:Object(p.jsx)(f.a,{})})})]}),Object(p.jsx)(r.a,{className:m.content,children:k}),Object(p.jsxs)(l.a,{className:m.actions,children:[Object(p.jsx)(u.a,Object(c.a)(Object(c.a)({className:m.cancelButton,onClick:b||a,disabled:C,type:"button"},M),{},{variant:"outlined",color:"primary",children:g})),Object(p.jsx)(d.a,Object(c.a)(Object(c.a)({className:m.confirmButton,type:"button",onClick:O,loading:C,disabled:C,variant:"outlined",color:"secondary",loadingPosition:"start",startIcon:Object(p.jsx)(o.a.Fragment,{}),autoFocus:!0},T),{},{children:y}))]})]})}))},434:function(e,t,n){"use strict";var c=n(16),a=n(2),o=n(52);t.a=function(e,t){var n=Object(a.useState)(!1),i=Object(c.a)(n,2),s=i[0],r=i[1];return[s,function(n,c,a){r(!0),o.a.invoke(n,c,a).then((function(t){r(!1),e(t)})).catch((function(e){r(!1),t(e)}))}]}},907:function(e,t,n){"use strict";n.r(t);var c=n(16),a=(n(2),n(48)),o=n.n(a),i=n(40),s=n(466),r=n(32),l=n(434),u=n(411),d=n(0),j=Object(i.b)(null,{setErrorSnackMessage:r.e});t.default=j((function(e){var t=e.closeDeleteModalAndRefresh,n=e.deleteOpen,a=e.selectedBucket,i=e.bucketEvent,r=e.setErrorSnackMessage,j=Object(l.a)((function(){return t(!0)}),(function(e){return r(e)})),b=Object(c.a)(j,2),f=b[0],O=b[1];if(!a)return null;return Object(d.jsx)(u.a,{title:"Delete Event",confirmText:"Delete",isOpen:n,isLoading:f,onConfirm:function(){if(null!==i){var e=o()(i,"events",[]),t=o()(i,"prefix",""),n=o()(i,"suffix","");O("DELETE","/api/v1/buckets/".concat(a,"/events/").concat(i.arn),{events:e,prefix:t,suffix:n})}},onClose:function(){return t(!1)},confirmationContent:Object(d.jsx)(s.a,{children:"Are you sure you want to delete this event?"})})}))}}]);
//# sourceMappingURL=127.bd67595e.chunk.js.map