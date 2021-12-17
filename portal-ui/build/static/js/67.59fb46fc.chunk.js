(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[67],{392:function(e,t,a){"use strict";var r=a(2),o=Object(r.createContext)({});t.a=o},393:function(e,t,a){"use strict";a.d(t,"b",(function(){return n}));var r=a(70),o=a(95);function n(e){return Object(r.a)("MuiDialogTitle",e)}var i=Object(o.a)("MuiDialogTitle",["root"]);t.a=i},395:function(e,t,a){"use strict";a.d(t,"b",(function(){return n}));var r=a(70),o=a(95);function n(e){return Object(r.a)("MuiDialog",e)}var i=Object(o.a)("MuiDialog",["root","scrollPaper","scrollBody","container","paper","paperScrollPaper","paperScrollBody","paperWidthFalse","paperWidthXs","paperWidthSm","paperWidthMd","paperWidthLg","paperWidthXl","paperFullWidth","paperFullScreen"]);t.a=i},398:function(e,t,a){"use strict";var r,o=a(16),n=a(1),i=a(2),c=a(40),s=a(387),l=a(380),d=a(413),p=a(414),u=a(415),b=a(307),m=a(319),j=a(122),f=a(32),O=a(48),h=a.n(O),x=a(129),v=a.n(x),g=a(128),C=a.n(g),S=a(125),k=a.n(S),y=a(0),w=function(){clearInterval(r)},M={displayErrorMessage:f.h},W=Object(c.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),M)(Object(m.a)((function(e){return Object(b.a)({modalErrorContainer:{position:"absolute",marginTop:10,width:"80%",backgroundColor:"#fff",border:"#C72C48 1px solid",borderLeftWidth:12,borderRadius:3,zIndex:1e3,padding:"10px 15px",left:"50%",transform:"translateX(-50%)",opacity:0,transitionDuration:"0.2s"},modalErrorShow:{opacity:1},closeButton:{position:"absolute",right:5,fontSize:"small",border:0,backgroundColor:"#fff",cursor:"pointer"},errorTitle:{display:"flex",alignItems:"center"},errorLabel:{color:"#000",fontSize:18,fontWeight:500,marginLeft:5,marginRight:25},messageIcon:{color:"#C72C48",display:"flex","& svg":{width:32,height:32}},detailsButton:{color:"#9C9C9C",display:"flex",alignItems:"center",border:0,backgroundColor:"transparent",paddingLeft:5,fontSize:14,transformDuration:"0.3s",cursor:"pointer"},extraDetailsContainer:{fontStyle:"italic",color:"#9C9C9C",lineHeight:0,padding:"0 10px",transition:"all .2s ease-in-out",overflow:"hidden"},extraDetailsOpen:{lineHeight:1,padding:"3px 10px"},arrowElement:{marginLeft:-5},arrowOpen:{transform:"rotateZ(90deg)",transformDuration:"0.3s"}})}))((function(e){var t=e.classes,a=e.modalSnackMessage,n=e.displayErrorMessage,c=e.customStyle,s=Object(i.useState)(!1),l=Object(o.a)(s,2),d=l[0],p=l[1],u=Object(i.useState)(!1),b=Object(o.a)(u,2),m=b[0],j=b[1],f=Object(i.useCallback)((function(){j(!1)}),[]);Object(i.useEffect)((function(){m||(n({detailedError:"",errorMessage:""}),p(!1))}),[n,m]),Object(i.useEffect)((function(){""!==a.message&&"error"===a.type&&j(!0)}),[f,a.message,a.type]);var O=h()(a,"message",""),x=h()(a,"detailedErrorMsg","");return"error"!==a.type||""===O?null:Object(y.jsx)(i.Fragment,{children:Object(y.jsxs)("div",{className:"".concat(t.modalErrorContainer," ").concat(m?t.modalErrorShow:""),style:c,onMouseOver:w,onMouseLeave:function(){r=setInterval(f,1e4)},children:[Object(y.jsx)("button",{className:t.closeButton,onClick:f,children:Object(y.jsx)(k.a,{})}),Object(y.jsxs)("div",{className:t.errorTitle,children:[Object(y.jsx)("span",{className:t.messageIcon,children:Object(y.jsx)(C.a,{})}),Object(y.jsx)("span",{className:t.errorLabel,children:O})]}),""!==x&&Object(y.jsxs)(i.Fragment,{children:[Object(y.jsx)("div",{className:t.detailsContainerLink,children:Object(y.jsxs)("button",{className:t.detailsButton,onClick:function(){p(!d)},children:["Details",Object(y.jsx)(v.a,{className:"".concat(t.arrowElement," ").concat(d?t.arrowOpen:"")})]})}),Object(y.jsx)("div",{className:"".concat(t.extraDetailsContainer," ").concat(d?t.extraDetailsOpen:""),children:x})]})]})})}))),D=Object(c.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),{setModalSnackMessage:f.i});t.a=Object(m.a)((function(e){return Object(b.a)(Object(n.a)(Object(n.a)({},j.h),{},{root:{"& .MuiPaper-root":{padding:"1rem 2rem 2rem 1rem"}},content:{padding:25,paddingBottom:0},customDialogSize:{width:"100%",maxWidth:765}},j.z))}))(D((function(e){var t=e.onClose,a=e.modalOpen,r=e.title,c=e.children,b=e.classes,m=e.wideLimit,j=void 0===m||m,f=e.modalSnackMessage,O=e.noContentPadding,h=e.setModalSnackMessage,x=Object(i.useState)(!1),v=Object(o.a)(x,2),g=v[0],C=v[1];Object(i.useEffect)((function(){h("")}),[h]),Object(i.useEffect)((function(){if(f){if(""===f.message)return void C(!1);"error"!==f.type&&C(!0)}}),[f]);var S=j?{classes:{paper:b.customDialogSize}}:{maxWidth:"lg",fullWidth:!0},w="";return f&&(w=f.detailedErrorMsg,(""===f.detailedErrorMsg||f.detailedErrorMsg.length<5)&&(w=f.message)),Object(y.jsxs)(d.a,Object(n.a)(Object(n.a)({open:a,classes:b},S),{},{scroll:"paper",onClose:function(e,a){"backdropClick"!==a&&t()},className:b.root,children:[Object(y.jsxs)(p.a,{className:b.title,children:[Object(y.jsx)("div",{className:b.titleText,children:r}),Object(y.jsx)("div",{className:b.closeContainer,children:Object(y.jsx)(s.a,{"aria-label":"close",className:b.closeButton,onClick:t,disableRipple:!0,size:"small",children:Object(y.jsx)(k.a,{})})})]}),Object(y.jsx)(W,{}),Object(y.jsx)(l.a,{open:g,className:b.snackBarModal,onClose:function(){C(!1),h("")},message:w,ContentProps:{className:"".concat(b.snackBar," ").concat(f&&"error"===f.type?b.errorSnackBar:"")},autoHideDuration:f&&"error"===f.type?1e4:5e3}),Object(y.jsx)(u.a,{className:O?"":b.content,children:c})]}))})))},413:function(e,t,a){"use strict";var r=a(5),o=a(4),n=a(3),i=a(2),c=(a(12),a(8)),s=a(94),l=a(314),d=a(11),p=a(381),u=a(363),b=a(28),m=a(386),j=a(14),f=a(9),O=a(395),h=a(392),x=a(383),v=a(0),g=["aria-describedby","aria-labelledby","BackdropComponent","BackdropProps","children","className","disableEscapeKeyDown","fullScreen","fullWidth","maxWidth","onBackdropClick","onClose","open","PaperComponent","PaperProps","scroll","TransitionComponent","transitionDuration","TransitionProps"],C=Object(f.a)(x.a,{name:"MuiDialog",slot:"Backdrop",overrides:function(e,t){return t.backdrop}})({zIndex:-1}),S=Object(f.a)(p.a,{name:"MuiDialog",slot:"Root",overridesResolver:function(e,t){return t.root}})({"@media print":{position:"absolute !important"}}),k=Object(f.a)("div",{name:"MuiDialog",slot:"Container",overridesResolver:function(e,t){var a=e.ownerState;return[t.container,t["scroll".concat(Object(d.a)(a.scroll))]]}})((function(e){var t=e.ownerState;return Object(n.a)({height:"100%","@media print":{height:"auto"},outline:0},"paper"===t.scroll&&{display:"flex",justifyContent:"center",alignItems:"center"},"body"===t.scroll&&{overflowY:"auto",overflowX:"hidden",textAlign:"center","&:after":{content:'""',display:"inline-block",verticalAlign:"middle",height:"100%",width:"0"}})})),y=Object(f.a)(m.a,{name:"MuiDialog",slot:"Paper",overridesResolver:function(e,t){var a=e.ownerState;return[t.paper,t["scrollPaper".concat(Object(d.a)(a.scroll))],t["paperWidth".concat(Object(d.a)(String(a.maxWidth)))],a.fullWidth&&t.paperFullWidth,a.fullScreen&&t.paperFullScreen]}})((function(e){var t=e.theme,a=e.ownerState;return Object(n.a)({margin:32,position:"relative",overflowY:"auto","@media print":{overflowY:"visible",boxShadow:"none"}},"paper"===a.scroll&&{display:"flex",flexDirection:"column",maxHeight:"calc(100% - 64px)"},"body"===a.scroll&&{display:"inline-block",verticalAlign:"middle",textAlign:"left"},!a.maxWidth&&{maxWidth:"calc(100% - 64px)"},"xs"===a.maxWidth&&Object(r.a)({maxWidth:"px"===t.breakpoints.unit?Math.max(t.breakpoints.values.xs,444):"".concat(t.breakpoints.values.xs).concat(t.breakpoints.unit)},"&.".concat(O.a.paperScrollBody),Object(r.a)({},t.breakpoints.down(Math.max(t.breakpoints.values.xs,444)+64),{maxWidth:"calc(100% - 64px)"})),"xs"!==a.maxWidth&&Object(r.a)({maxWidth:"".concat(t.breakpoints.values[a.maxWidth]).concat(t.breakpoints.unit)},"&.".concat(O.a.paperScrollBody),Object(r.a)({},t.breakpoints.down(t.breakpoints.values[a.maxWidth]+64),{maxWidth:"calc(100% - 64px)"})),a.fullWidth&&{width:"calc(100% - 64px)"},a.fullScreen&&Object(r.a)({margin:0,width:"100%",maxWidth:"100%",height:"100%",maxHeight:"none",borderRadius:0},"&.".concat(O.a.paperScrollBody),{margin:0,maxWidth:"100%"}))})),w={enter:b.b.enteringScreen,exit:b.b.leavingScreen},M=i.forwardRef((function(e,t){var a=Object(j.a)({props:e,name:"MuiDialog"}),r=a["aria-describedby"],p=a["aria-labelledby"],b=a.BackdropComponent,f=a.BackdropProps,x=a.children,M=a.className,W=a.disableEscapeKeyDown,D=void 0!==W&&W,N=a.fullScreen,B=void 0!==N&&N,E=a.fullWidth,P=void 0!==E&&E,R=a.maxWidth,T=void 0===R?"sm":R,F=a.onBackdropClick,L=a.onClose,I=a.open,z=a.PaperComponent,A=void 0===z?m.a:z,K=a.PaperProps,H=void 0===K?{}:K,X=a.scroll,Y=void 0===X?"paper":X,J=a.TransitionComponent,q=void 0===J?u.a:J,U=a.transitionDuration,Z=void 0===U?w:U,G=a.TransitionProps,Q=Object(o.a)(a,g),V=Object(n.a)({},a,{disableEscapeKeyDown:D,fullScreen:B,fullWidth:P,maxWidth:T,scroll:Y}),$=function(e){var t=e.classes,a=e.scroll,r=e.maxWidth,o=e.fullWidth,n=e.fullScreen,i={root:["root"],container:["container","scroll".concat(Object(d.a)(a))],paper:["paper","paperScroll".concat(Object(d.a)(a)),"paperWidth".concat(Object(d.a)(String(r))),o&&"paperFullWidth",n&&"paperFullScreen"]};return Object(s.a)(i,O.b,t)}(V),_=i.useRef(),ee=Object(l.a)(p),te=i.useMemo((function(){return{titleId:ee}}),[ee]);return Object(v.jsx)(S,Object(n.a)({className:Object(c.a)($.root,M),BackdropProps:Object(n.a)({transitionDuration:Z,as:b},f),closeAfterTransition:!0,BackdropComponent:C,disableEscapeKeyDown:D,onClose:L,open:I,ref:t,onClick:function(e){_.current&&(_.current=null,F&&F(e),L&&L(e,"backdropClick"))},ownerState:V},Q,{children:Object(v.jsx)(q,Object(n.a)({appear:!0,in:I,timeout:Z,role:"presentation"},G,{children:Object(v.jsx)(k,{className:Object(c.a)($.container),onMouseDown:function(e){_.current=e.target===e.currentTarget},ownerState:V,children:Object(v.jsx)(y,Object(n.a)({as:A,elevation:24,role:"dialog","aria-describedby":r,"aria-labelledby":ee},H,{className:Object(c.a)($.paper,H.className),ownerState:V,children:Object(v.jsx)(h.a.Provider,{value:te,children:x})}))})}))}))}));t.a=M},414:function(e,t,a){"use strict";var r=a(3),o=a(4),n=a(2),i=(a(12),a(8)),c=a(94),s=a(96),l=a(9),d=a(14),p=a(393),u=a(392),b=a(0),m=["className","id"],j=Object(l.a)(s.a,{name:"MuiDialogTitle",slot:"Root",overridesResolver:function(e,t){return t.root}})({padding:"16px 24px",flex:"0 0 auto"}),f=n.forwardRef((function(e,t){var a=Object(d.a)({props:e,name:"MuiDialogTitle"}),s=a.className,l=a.id,f=Object(o.a)(a,m),O=a,h=function(e){var t=e.classes;return Object(c.a)({root:["root"]},p.b,t)}(O),x=n.useContext(u.a).titleId,v=void 0===x?l:x;return Object(b.jsx)(j,Object(r.a)({component:"h2",className:Object(i.a)(h.root,s),ownerState:O,ref:t,variant:"h6",id:v},f))}));t.a=f},415:function(e,t,a){"use strict";var r=a(5),o=a(4),n=a(3),i=a(2),c=(a(12),a(8)),s=a(94),l=a(9),d=a(14),p=a(70),u=a(95);function b(e){return Object(p.a)("MuiDialogContent",e)}Object(u.a)("MuiDialogContent",["root","dividers"]);var m=a(393),j=a(0),f=["className","dividers"],O=Object(l.a)("div",{name:"MuiDialogContent",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,a.dividers&&t.dividers]}})((function(e){var t=e.theme,a=e.ownerState;return Object(n.a)({flex:"1 1 auto",WebkitOverflowScrolling:"touch",overflowY:"auto",padding:"20px 24px"},a.dividers?{padding:"16px 24px",borderTop:"1px solid ".concat(t.palette.divider),borderBottom:"1px solid ".concat(t.palette.divider)}:Object(r.a)({},".".concat(m.a.root," + &"),{paddingTop:0}))})),h=i.forwardRef((function(e,t){var a=Object(d.a)({props:e,name:"MuiDialogContent"}),r=a.className,i=a.dividers,l=void 0!==i&&i,p=Object(o.a)(a,f),u=Object(n.a)({},a,{dividers:l}),m=function(e){var t=e.classes,a={root:["root",e.dividers&&"dividers"]};return Object(s.a)(a,b,t)}(u);return Object(j.jsx)(O,Object(n.a)({className:Object(c.a)(m.root,r),ownerState:u,ref:t},p))}));t.a=h},962:function(e,t,a){"use strict";a.r(t);var r=a(13),o=a(1),n=a(443),i=a(385),c=a(307),s=a(319),l=(a(2),a(398)),d=a(405),p=a(122),u=a(0);t.default=Object(s.a)((function(e){return Object(c.a)(Object(o.a)({buttonContainer:{textAlign:"right"},errorsList:{height:"calc(100vh - 280px)"}},p.q))}))((function(e){var t=e.open,a=e.onCloseFormatErrorsList,o=e.errorsList,c=e.classes;return Object(u.jsx)(l.a,{modalOpen:t,title:"Format Errors",onClose:a,children:Object(u.jsxs)(n.a,{container:!0,children:[Object(u.jsxs)(n.a,{item:!0,xs:12,className:c.modalFormScrollable,children:["There were some issues trying to format the selected CSI Drives, please fix the issues and try again.",Object(u.jsx)("br",{}),Object(u.jsx)(d.a,{columns:[{label:"Node",elementKey:"node"},{label:"Drive",elementKey:"drive"},{label:"Message",elementKey:"error"}],entityName:"Format Errors",idField:"drive",records:o,isLoading:!1,customPaperHeight:c.errorsList,textSelectable:!0,noBackground:!0})]}),Object(u.jsxs)(n.a,{item:!0,xs:12,className:c.modalButtonBar,children:[Object(u.jsx)(i.a,{color:"primary",variant:"outlined",onClick:function(){!function(e,t){var a=document.createElement("a");a.setAttribute("href","data:application/json;charset=utf-8,"+encodeURIComponent(t)),a.setAttribute("download",e),a.style.display="none",document.body.appendChild(a),a.click(),document.body.removeChild(a)}("csiFormatErrors.json",JSON.stringify(Object(r.a)(o)))},children:"Download"}),Object(u.jsx)(i.a,{onClick:a,color:"primary",variant:"contained",autoFocus:!0,children:"Done"})]})]})})}))}}]);
//# sourceMappingURL=67.59fb46fc.chunk.js.map