(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[44],{336:function(e,t,a){"use strict";var o=a(0),r=Object(o.createContext)({});t.a=r},343:function(e,t,a){"use strict";a.d(t,"b",(function(){return n}));var o=a(68),r=a(90);function n(e){return Object(o.a)("MuiDialog",e)}var i=Object(r.a)("MuiDialog",["root","scrollPaper","scrollBody","container","paper","paperScrollPaper","paperScrollBody","paperWidthFalse","paperWidthXs","paperWidthSm","paperWidthMd","paperWidthLg","paperWidthXl","paperFullWidth","paperFullScreen"]);t.a=i},347:function(e,t,a){"use strict";var o,r=a(15),n=a(3),i=a(0),c=a(38),l=a(328),s=a(322),d=a(417),b=a(418),u=a(419),p=a(250),j=a(260),m=a(116),h=a(30),f=a(45),O=a.n(f),x=a(125),v=a.n(x),g=a(124),C=a.n(g),S=a(122),y=a.n(S),w=a(2),k=function(){clearInterval(o)},N={displayErrorMessage:h.h},M=Object(c.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),N)(Object(j.a)((function(e){return Object(p.a)({modalErrorContainer:{position:"absolute",marginTop:10,width:"80%",backgroundColor:"#fff",border:"#C72C48 1px solid",borderLeftWidth:12,borderRadius:3,zIndex:1e3,padding:"10px 15px",left:"50%",transform:"translateX(-50%)",opacity:0,transitionDuration:"0.2s"},modalErrorShow:{opacity:1},closeButton:{position:"absolute",right:5,fontSize:"small",border:0,backgroundColor:"#fff",cursor:"pointer"},errorTitle:{display:"flex",alignItems:"center"},errorLabel:{color:"#000",fontSize:18,fontWeight:500,marginLeft:5,marginRight:25},messageIcon:{color:"#C72C48",display:"flex","& svg":{width:32,height:32}},simpleError:{marginTop:5,padding:"2px 5px",fontSize:16,color:"#000"},detailsButton:{color:"#9C9C9C",display:"flex",alignItems:"center",border:0,backgroundColor:"transparent",paddingLeft:5,fontSize:14,transformDuration:"0.3s",cursor:"pointer"},extraDetailsContainer:{fontStyle:"italic",color:"#9C9C9C",lineHeight:0,padding:"0 10px",transition:"all .2s ease-in-out",overflow:"hidden"},extraDetailsOpen:{lineHeight:1,padding:"3px 10px"},arrowElement:{marginLeft:-5},arrowOpen:{transform:"rotateZ(90deg)",transformDuration:"0.3s"}})}))((function(e){var t=e.classes,a=e.modalSnackMessage,n=e.displayErrorMessage,c=e.customStyle,l=Object(i.useState)(!1),s=Object(r.a)(l,2),d=s[0],b=s[1],u=Object(i.useState)(!1),p=Object(r.a)(u,2),j=p[0],m=p[1],h=Object(i.useCallback)((function(){m(!1)}),[]);Object(i.useEffect)((function(){j||(n({detailedError:"",errorMessage:""}),b(!1))}),[n,j]),Object(i.useEffect)((function(){""!==a.message&&"error"===a.type&&m(!0)}),[h,a.message,a.type]);var f=O()(a,"message",""),x=O()(a,"detailedErrorMsg","");return"error"!==a.type||""===f?null:Object(w.jsx)(i.Fragment,{children:Object(w.jsxs)("div",{className:"".concat(t.modalErrorContainer," ").concat(j?t.modalErrorShow:""),style:c,onMouseOver:k,onMouseLeave:function(){o=setInterval(h,1e4)},children:[Object(w.jsx)("button",{className:t.closeButton,onClick:h,children:Object(w.jsx)(y.a,{})}),Object(w.jsxs)("div",{className:t.errorTitle,children:[Object(w.jsx)("span",{className:t.messageIcon,children:Object(w.jsx)(C.a,{})}),Object(w.jsx)("span",{className:t.errorLabel,children:f})]}),""!==x&&Object(w.jsxs)(i.Fragment,{children:[Object(w.jsx)("div",{className:t.detailsContainerLink,children:Object(w.jsxs)("button",{className:t.detailsButton,onClick:function(){b(!d)},children:["Details",Object(w.jsx)(v.a,{className:"".concat(t.arrowElement," ").concat(d?t.arrowOpen:"")})]})}),Object(w.jsx)("div",{className:"".concat(t.extraDetailsContainer," ").concat(d?t.extraDetailsOpen:""),children:x})]})]})})}))),W={content:'" "',borderLeft:"2px solid #9C9C9C",height:33,width:1,position:"absolute"},D=Object(c.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),{setModalSnackMessage:h.i});t.a=Object(j.a)((function(e){return Object(p.a)(Object(n.a)({dialogContainer:{padding:"8px 15px 22px"},closeContainer:{textAlign:"right"},closeButton:{height:16,width:16,padding:0,backgroundColor:"initial","&:hover":{backgroundColor:"initial"},"&:active":{backgroundColor:"initial"}},modalCloseIcon:{fontSize:35,color:"#9C9C9C",fontWeight:300,"&:hover":{color:"#9C9C9C"}},closeIcon:{"&::before":Object(n.a)(Object(n.a)({},W),{},{transform:"rotate(45deg)",height:12}),"&::after":Object(n.a)(Object(n.a)({},W),{},{transform:"rotate(-45deg)",height:12}),"&:hover::before, &:hover::after":{borderColor:"#9C9C9C"},display:"block",position:"relative",height:12,width:12},titleClass:{padding:"0px 50px 12px",fontSize:"1.2rem",fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"},modalContent:{padding:"0 50px"},customDialogSize:{width:"100%",maxWidth:765}},m.y))}))(D((function(e){var t=e.onClose,a=e.modalOpen,o=e.title,c=e.children,p=e.classes,j=e.wideLimit,m=void 0===j||j,h=e.modalSnackMessage,f=e.noContentPadding,O=e.setModalSnackMessage,x=Object(i.useState)(!1),v=Object(r.a)(x,2),g=v[0],C=v[1];Object(i.useEffect)((function(){O("")}),[O]),Object(i.useEffect)((function(){if(h){if(""===h.message)return void C(!1);"error"!==h.type&&C(!0)}}),[h]);var S=m?{classes:{paper:p.customDialogSize}}:{maxWidth:"lg",fullWidth:!0},y="";return h&&(y=h.detailedErrorMsg,(""===h.detailedErrorMsg||h.detailedErrorMsg.length<5)&&(y=h.message)),Object(w.jsx)(d.a,Object(n.a)(Object(n.a)({open:a,onClose:t,"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description"},S),{},{children:Object(w.jsxs)("div",{className:p.dialogContainer,children:[Object(w.jsx)(M,{}),Object(w.jsx)(s.a,{open:g,className:p.snackBarModal,onClose:function(){C(!1),O("")},message:y,ContentProps:{className:"".concat(p.snackBar," ").concat(h&&"error"===h.type?p.errorSnackBar:"")},autoHideDuration:h&&"error"===h.type?1e4:5e3}),Object(w.jsx)("div",{className:p.closeContainer,children:Object(w.jsx)(l.a,{"aria-label":"close",className:p.closeButton,onClick:t,disableRipple:!0,size:"large",children:Object(w.jsx)("span",{className:p.closeIcon})})}),Object(w.jsx)(b.a,{id:"alert-dialog-title",className:p.titleClass,children:o}),Object(w.jsx)(u.a,{className:f?"":p.modalContent,children:c})]})}))})))},348:function(e,t,a){"use strict";var o=a(3),r=a(0),n=a.n(r),i=a(428),c=a(444),l=a(818),s=a(326),d=a(328),b=a(250),u=a(319),p=a(260),j=a(116),m=a(334),h=a(2),f=Object(u.a)((function(e){return Object(b.a)(Object(o.a)({},j.n))}));function O(e){var t=f();return Object(h.jsx)(i.a,Object(o.a)({InputProps:{classes:t}},e))}t.a=Object(p.a)((function(e){return Object(b.a)(Object(o.a)(Object(o.a)(Object(o.a)({},j.i),j.D),{},{textBoxContainer:{flexGrow:1,position:"relative"},textBoxWithIcon:{position:"relative",paddingRight:25},errorState:{color:"#b53b4b",fontSize:14,position:"absolute",top:7,right:7},overlayAction:{position:"absolute",right:5,top:6,"& svg":{maxWidth:15,maxHeight:15},"&.withLabel":{top:5}}}))}))((function(e){var t=e.label,a=e.onChange,r=e.value,i=e.id,b=e.name,u=e.type,p=void 0===u?"text":u,j=e.autoComplete,f=void 0===j?"off":j,x=e.disabled,v=void 0!==x&&x,g=e.multiline,C=void 0!==g&&g,S=e.tooltip,y=void 0===S?"":S,w=e.index,k=void 0===w?0:w,N=e.error,M=void 0===N?"":N,W=e.required,D=void 0!==W&&W,B=e.placeholder,R=void 0===B?"":B,F=e.min,E=e.max,T=e.overlayIcon,I=void 0===T?null:T,P=e.overlayObject,z=void 0===P?null:P,L=e.extraInputProps,A=void 0===L?{}:L,K=e.overlayAction,H=e.noLabelMinWidth,_=void 0!==H&&H,V=e.classes,X=Object(o.a)({"data-index":k},A);return"number"===p&&F&&(X.min=F),"number"===p&&E&&(X.max=E),Object(h.jsx)(n.a.Fragment,{children:Object(h.jsxs)(c.a,{container:!0,className:" ".concat(""!==M?V.errorInField:V.inputBoxContainer),children:[""!==t&&Object(h.jsxs)(l.a,{htmlFor:i,className:_?V.noMinWidthLabel:V.inputLabel,children:[Object(h.jsxs)("span",{children:[t,D?"*":""]}),""!==y&&Object(h.jsx)("div",{className:V.tooltipContainer,children:Object(h.jsx)(s.a,{title:y,placement:"top-start",children:Object(h.jsx)("div",{className:V.tooltip,children:Object(h.jsx)(m.a,{})})})})]}),Object(h.jsxs)("div",{className:V.textBoxContainer,children:[Object(h.jsx)(O,{id:i,name:b,fullWidth:!0,value:r,disabled:v,onChange:a,type:p,multiline:C,autoComplete:f,inputProps:X,error:""!==M,helperText:M,placeholder:R,className:V.inputRebase}),I&&Object(h.jsx)("div",{className:"".concat(V.overlayAction," ").concat(""!==t?"withLabel":""),children:Object(h.jsx)(d.a,{onClick:K?function(){K()}:function(){return null},size:"small",disableFocusRipple:!1,disableRipple:!1,disableTouchRipple:!1,children:I})}),z&&Object(h.jsx)("div",{className:"".concat(V.overlayAction," ").concat(""!==t?"withLabel":""),children:z})]})]})})}))},417:function(e,t,a){"use strict";var o=a(5),r=a(4),n=a(1),i=a(0),c=(a(11),a(7)),l=a(89),s=a(255),d=a(9),b=a(323),u=a(305),p=a(26),j=a(327),m=a(12),h=a(8),f=a(343),O=a(336),x=a(325),v=a(2),g=["aria-describedby","aria-labelledby","BackdropComponent","BackdropProps","children","className","disableEscapeKeyDown","fullScreen","fullWidth","maxWidth","onBackdropClick","onClose","open","PaperComponent","PaperProps","scroll","TransitionComponent","transitionDuration","TransitionProps"],C=Object(h.a)(x.a,{name:"MuiDialog",slot:"Backdrop",overrides:function(e,t){return t.backdrop}})({zIndex:-1}),S=Object(h.a)(b.a,{name:"MuiDialog",slot:"Root",overridesResolver:function(e,t){return t.root}})({"@media print":{position:"absolute !important"}}),y=Object(h.a)("div",{name:"MuiDialog",slot:"Container",overridesResolver:function(e,t){var a=e.ownerState;return[t.container,t["scroll".concat(Object(d.a)(a.scroll))]]}})((function(e){var t=e.ownerState;return Object(n.a)({height:"100%","@media print":{height:"auto"},outline:0},"paper"===t.scroll&&{display:"flex",justifyContent:"center",alignItems:"center"},"body"===t.scroll&&{overflowY:"auto",overflowX:"hidden",textAlign:"center","&:after":{content:'""',display:"inline-block",verticalAlign:"middle",height:"100%",width:"0"}})})),w=Object(h.a)(j.a,{name:"MuiDialog",slot:"Paper",overridesResolver:function(e,t){var a=e.ownerState;return[t.paper,t["scrollPaper".concat(Object(d.a)(a.scroll))],t["paperWidth".concat(Object(d.a)(String(a.maxWidth)))],a.fullWidth&&t.paperFullWidth,a.fullScreen&&t.paperFullScreen]}})((function(e){var t=e.theme,a=e.ownerState;return Object(n.a)({margin:32,position:"relative",overflowY:"auto","@media print":{overflowY:"visible",boxShadow:"none"}},"paper"===a.scroll&&{display:"flex",flexDirection:"column",maxHeight:"calc(100% - 64px)"},"body"===a.scroll&&{display:"inline-block",verticalAlign:"middle",textAlign:"left"},!a.maxWidth&&{maxWidth:"calc(100% - 64px)"},"xs"===a.maxWidth&&Object(o.a)({maxWidth:"px"===t.breakpoints.unit?Math.max(t.breakpoints.values.xs,444):"".concat(t.breakpoints.values.xs).concat(t.breakpoints.unit)},"&.".concat(f.a.paperScrollBody),Object(o.a)({},t.breakpoints.down(Math.max(t.breakpoints.values.xs,444)+64),{maxWidth:"calc(100% - 64px)"})),"xs"!==a.maxWidth&&Object(o.a)({maxWidth:"".concat(t.breakpoints.values[a.maxWidth]).concat(t.breakpoints.unit)},"&.".concat(f.a.paperScrollBody),Object(o.a)({},t.breakpoints.down(t.breakpoints.values[a.maxWidth]+64),{maxWidth:"calc(100% - 64px)"})),a.fullWidth&&{width:"calc(100% - 64px)"},a.fullScreen&&Object(o.a)({margin:0,width:"100%",maxWidth:"100%",height:"100%",maxHeight:"none",borderRadius:0},"&.".concat(f.a.paperScrollBody),{margin:0,maxWidth:"100%"}))})),k={enter:p.b.enteringScreen,exit:p.b.leavingScreen},N=i.forwardRef((function(e,t){var a=Object(m.a)({props:e,name:"MuiDialog"}),o=a["aria-describedby"],b=a["aria-labelledby"],p=a.BackdropComponent,h=a.BackdropProps,x=a.children,N=a.className,M=a.disableEscapeKeyDown,W=void 0!==M&&M,D=a.fullScreen,B=void 0!==D&&D,R=a.fullWidth,F=void 0!==R&&R,E=a.maxWidth,T=void 0===E?"sm":E,I=a.onBackdropClick,P=a.onClose,z=a.open,L=a.PaperComponent,A=void 0===L?j.a:L,K=a.PaperProps,H=void 0===K?{}:K,_=a.scroll,V=void 0===_?"paper":_,X=a.TransitionComponent,Y=void 0===X?u.a:X,q=a.transitionDuration,U=void 0===q?k:q,G=a.TransitionProps,J=Object(r.a)(a,g),Z=Object(n.a)({},a,{disableEscapeKeyDown:W,fullScreen:B,fullWidth:F,maxWidth:T,scroll:V}),Q=function(e){var t=e.classes,a=e.scroll,o=e.maxWidth,r=e.fullWidth,n=e.fullScreen,i={root:["root"],container:["container","scroll".concat(Object(d.a)(a))],paper:["paper","paperScroll".concat(Object(d.a)(a)),"paperWidth".concat(Object(d.a)(String(o))),r&&"paperFullWidth",n&&"paperFullScreen"]};return Object(l.a)(i,f.b,t)}(Z),$=i.useRef(),ee=Object(s.a)(b),te=i.useMemo((function(){return{titleId:ee}}),[ee]);return Object(v.jsx)(S,Object(n.a)({className:Object(c.a)(Q.root,N),BackdropProps:Object(n.a)({transitionDuration:U,as:p},h),closeAfterTransition:!0,BackdropComponent:C,disableEscapeKeyDown:W,onClose:P,open:z,ref:t,onClick:function(e){$.current&&($.current=null,I&&I(e),P&&P(e,"backdropClick"))},ownerState:Z},J,{children:Object(v.jsx)(Y,Object(n.a)({appear:!0,in:z,timeout:U,role:"presentation"},G,{children:Object(v.jsx)(y,{className:Object(c.a)(Q.container),onMouseDown:function(e){$.current=e.target===e.currentTarget},ownerState:Z,children:Object(v.jsx)(w,Object(n.a)({as:A,elevation:24,role:"dialog","aria-describedby":o,"aria-labelledby":ee},H,{className:Object(c.a)(Q.paper,H.className),ownerState:Z,children:Object(v.jsx)(O.a.Provider,{value:te,children:x})}))})}))}))}));t.a=N},418:function(e,t,a){"use strict";var o=a(1),r=a(4),n=a(0),i=(a(11),a(7)),c=a(89),l=a(91),s=a(8),d=a(12),b=a(68),u=a(90);function p(e){return Object(b.a)("MuiDialogTitle",e)}Object(u.a)("MuiDialogTitle",["root"]);var j=a(336),m=a(2),h=["className","id"],f=Object(s.a)(l.a,{name:"MuiDialogTitle",slot:"Root",overridesResolver:function(e,t){return t.root}})({padding:"16px 24px",flex:"0 0 auto"}),O=n.forwardRef((function(e,t){var a=Object(d.a)({props:e,name:"MuiDialogTitle"}),l=a.className,s=a.id,b=Object(r.a)(a,h),u=a,O=function(e){var t=e.classes;return Object(c.a)({root:["root"]},p,t)}(u),x=n.useContext(j.a).titleId,v=void 0===x?s:x;return Object(m.jsx)(f,Object(o.a)({component:"h2",className:Object(i.a)(O.root,l),ownerState:u,ref:t,variant:"h6",id:v},b))}));t.a=O},419:function(e,t,a){"use strict";var o=a(4),r=a(1),n=a(0),i=(a(11),a(7)),c=a(89),l=a(8),s=a(12),d=a(68),b=a(90);function u(e){return Object(d.a)("MuiDialogContent",e)}Object(b.a)("MuiDialogContent",["root","dividers"]);var p=a(2),j=["className","dividers"],m=Object(l.a)("div",{name:"MuiDialogContent",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,a.dividers&&t.dividers]}})((function(e){var t=e.theme,a=e.ownerState;return Object(r.a)({flex:"1 1 auto",WebkitOverflowScrolling:"touch",overflowY:"auto",padding:"20px 24px"},a.dividers?{padding:"16px 24px",borderTop:"1px solid ".concat(t.palette.divider),borderBottom:"1px solid ".concat(t.palette.divider)}:{".MuiDialogTitle-root + &":{paddingTop:0}})})),h=n.forwardRef((function(e,t){var a=Object(s.a)({props:e,name:"MuiDialogContent"}),n=a.className,l=a.dividers,d=void 0!==l&&l,b=Object(o.a)(a,j),h=Object(r.a)({},a,{dividers:d}),f=function(e){var t=e.classes,a={root:["root",e.dividers&&"dividers"]};return Object(c.a)(a,u,t)}(h);return Object(p.jsx)(m,Object(r.a)({className:Object(i.a)(f.root,n),ownerState:h,ref:t},b))}));t.a=h},528:function(e,t,a){"use strict";var o=a(0),r=a.n(o),n=a(91),i=a(250),c=a(260),l=a(2);t.a=Object(c.a)((function(e){var t;return Object(i.a)({errorBlock:{color:(null===(t=e.palette)||void 0===t?void 0:t.error.main)||"#C83B51"}})}))((function(e){var t=e.classes,a=e.errorMessage,o=e.withBreak,i=void 0===o||o;return Object(l.jsxs)(r.a.Fragment,{children:[i&&Object(l.jsx)("br",{}),Object(l.jsx)(n.a,{component:"p",variant:"body1",className:t.errorBlock,children:a})]})}))},590:function(e,t,a){"use strict";var o=a(15),r=a(3),n=a(0),i=a.n(n),c=a(45),l=a.n(c),s=a(444),d=a(818),b=a(326),u=a(328),p=a(650),j=a.n(p),m=a(649),h=a.n(m),f=a(250),O=a(260),x=a(116),v=a(334),g=a(528),C=a(2);t.a=Object(O.a)((function(e){return Object(f.a)(Object(r.a)(Object(r.a)(Object(r.a)({},x.i),x.D),{},{textBoxContainer:{flexGrow:1,position:"relative",display:"flex",flexWrap:"nowrap",height:48},errorState:{color:"#b53b4b",fontSize:14,position:"absolute",top:7,right:7},errorText:{margin:"0",fontSize:"0.75rem",marginTop:3,textAlign:"left",fontFamily:"Lato,sans-serif",fontWeight:400,lineHeight:"1.66",color:"#dc1f2e"},valueString:{maxWidth:350,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:2},fileReselect:{display:"flex",alignItems:"center",height:48},fieldBottom:{borderBottom:"#9c9c9c 1px solid"},fileInputField:{margin:"13px 0"}}))}))((function(e){var t=e.label,a=e.classes,r=e.onChange,c=e.id,p=e.name,m=e.disabled,f=void 0!==m&&m,O=e.tooltip,x=void 0===O?"":O,S=e.required,y=e.error,w=void 0===y?"":y,k=e.accept,N=void 0===k?"":k,M=e.value,W=void 0===M?"":M,D=Object(n.useState)(!1),B=Object(o.a)(D,2),R=B[0],F=B[1];return Object(C.jsx)(i.a.Fragment,{children:Object(C.jsxs)(s.a,{item:!0,xs:12,className:"".concat(a.fileInputField," ").concat(a.fieldBottom," ").concat(a.fieldContainer," ").concat(""!==w?a.errorInField:""),children:[""!==t&&Object(C.jsxs)(d.a,{htmlFor:c,className:"".concat(""!==w?a.fieldLabelError:""," ").concat(a.inputLabel),children:[Object(C.jsxs)("span",{children:[t,S?"*":""]}),""!==x&&Object(C.jsx)("div",{className:a.tooltipContainer,children:Object(C.jsx)(b.a,{title:x,placement:"top-start",children:Object(C.jsx)("div",{className:a.tooltip,children:Object(C.jsx)(v.a,{})})})})]}),R||""===W?Object(C.jsxs)("div",{className:a.textBoxContainer,children:[Object(C.jsx)("input",{type:"file",name:p,onChange:function(e){var t=l()(e,"target.files[0].name","");!function(e,t){var a=e.target.files[0],o=new FileReader;o.readAsDataURL(a),o.onload=function(){var e=o.result;if(e){var a=e.toString().split("base64,");2===a.length&&t(a[1])}}}(e,(function(e){r(e,t)}))},accept:N,required:S,disabled:f,className:a.fileInputField}),""!==W&&Object(C.jsx)(u.a,{color:"primary","aria-label":"upload picture",component:"span",onClick:function(){F(!1)},disableRipple:!1,disableFocusRipple:!1,size:"large",children:Object(C.jsx)(h.a,{})}),""!==w&&Object(C.jsx)(g.a,{errorMessage:w})]}):Object(C.jsxs)("div",{className:a.fileReselect,children:[Object(C.jsx)("div",{className:a.valueString,children:W}),Object(C.jsx)(u.a,{color:"primary","aria-label":"upload picture",component:"span",onClick:function(){F(!0)},disableRipple:!1,disableFocusRipple:!1,size:"large",children:Object(C.jsx)(j.a,{})})]})]})})}))},649:function(e,t,a){"use strict";var o=a(70);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=o(a(71)),n=a(2),i=(0,r.default)((0,n.jsx)("path",{d:"M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"}),"Cancel");t.default=i},650:function(e,t,a){"use strict";var o=a(70);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=o(a(71)),n=a(2),i=(0,r.default)((0,n.jsx)("path",{d:"M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"}),"AttachFile");t.default=i},874:function(e,t,a){"use strict";a.r(t);var o=a(15),r=a(3),n=a(0),i=a(45),c=a.n(i),l=a(38),s=a(250),d=a(260),b=a(330),u=a(316),p=a(444),j=a(116),m=a(30),h=a(348),f=a(590),O=a(50),x=a(347),v=a(2),g=Object(l.b)(null,{setModalErrorSnackMessage:m.h});t.default=Object(d.a)((function(e){return Object(s.a)(Object(r.a)(Object(r.a)({minTableHeader:{color:"#393939","& tr":{"& th":{fontWeight:"bold"}}},buttonContainer:{textAlign:"right"}},j.p),j.k))}))(g((function(e){var t=e.open,a=e.closeModalAndRefresh,r=e.classes,i=e.tierData,l=e.setModalErrorSnackMessage,s=Object(n.useState)(!1),d=Object(o.a)(s,2),j=d[0],m=d[1],g=Object(n.useState)(""),C=Object(o.a)(g,2),S=C[0],y=C[1],w=Object(n.useState)(""),k=Object(o.a)(w,2),N=k[0],M=k[1],W=Object(n.useState)(""),D=Object(o.a)(W,2),B=D[0],R=D[1],F=Object(n.useState)(""),E=Object(o.a)(F,2),T=E[0],I=E[1],P=Object(n.useState)(""),z=Object(o.a)(P,2),L=z[0],A=z[1],K=Object(n.useState)(""),H=Object(o.a)(K,2),_=H[0],V=H[1],X=Object(n.useState)(!0),Y=Object(o.a)(X,2),q=Y[0],U=Y[1],G=c()(i,"type",""),J=c()(i,"".concat(G,".name"),"");Object(n.useEffect)((function(){var e=!0;"s3"===G||"azure"===G?""!==L&&""!==_||(e=!1):"gcs"===G&&""===T&&(e=!1),U(e)}),[_,L,T,G]);return Object(v.jsx)(x.a,{modalOpen:t,onClose:function(){a(!1)},title:"Update Credentials - ".concat(G," / ").concat(J),children:Object(v.jsx)("form",{noValidate:!0,autoComplete:"off",onSubmit:function(e){e.preventDefault(),m(!0),function(){var e={};"s3"===G||"azure"===G?e={access_key:L,secret_key:_}:"gcs"===G&&(e={creds:T}),""!==J?O.a.invoke("PUT","/api/v1/admin/tiers/".concat(G,"/").concat(J,"/credentials"),e).then((function(){m(!1),a(!0)})).catch((function(e){m(!1),l(e)})):l({errorMessage:"There was an error retrieving tier information",detailedError:""})}()},children:Object(v.jsxs)(p.a,{container:!0,children:[Object(v.jsxs)(p.a,{item:!0,xs:12,children:["s3"===G&&Object(v.jsxs)(n.Fragment,{children:[Object(v.jsx)("div",{className:r.formFieldRow,children:Object(v.jsx)(h.a,{id:"accessKey",name:"accessKey",label:"Access Key",placeholder:"Enter Access Key",value:S,onChange:function(e){y(e.target.value)}})}),Object(v.jsx)("div",{className:r.formFieldRow,children:Object(v.jsx)(h.a,{id:"secretKey",name:"secretKey",label:"Secret Key",placeholder:"Enter Secret Key",value:N,onChange:function(e){M(e.target.value)}})})]}),"gcs"===G&&Object(v.jsx)(n.Fragment,{children:Object(v.jsx)(f.a,{classes:r,accept:".json",id:"creds",label:"Credentials",name:"creds",onChange:function(e,t){I(e),R(t)},value:B})}),"azure"===G&&Object(v.jsxs)(n.Fragment,{children:[Object(v.jsx)("div",{className:r.formFieldRow,children:Object(v.jsx)(h.a,{id:"accountName",name:"accountName",label:"Account Name",placeholder:"Enter Account Name",value:L,onChange:function(e){A(e.target.value)}})}),Object(v.jsx)("div",{className:r.formFieldRow,children:Object(v.jsx)(h.a,{id:"accountKey",name:"accountKey",label:"Account Key",placeholder:"Enter Account Key",value:_,onChange:function(e){V(e.target.value)}})})]})]}),Object(v.jsx)(p.a,{item:!0,xs:12,className:r.buttonContainer,children:Object(v.jsx)(b.a,{type:"submit",variant:"contained",color:"primary",disabled:j||!q,children:"Save"})}),j&&Object(v.jsx)(p.a,{item:!0,xs:12,children:Object(v.jsx)(u.a,{})})]})})})})))}}]);
//# sourceMappingURL=44.43e33c33.chunk.js.map