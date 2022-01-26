"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[6951],{95239:function(e,t,n){n.r(t);var o=n(23430),r=n(18489),a=n(50390),i=n(34424),s=n(66946),l=n(86509),c=n(4285),d=n(25594),u=n(72462),m=n(44149),p=n(30324),f=n(76352),g=n(67754),x=n(52813),h=n(70014),b=n(62559);(0,l.Z)((0,r.Z)((0,r.Z)({},u.ID),u.bK));var Z=(0,i.$j)(null,{setModalErrorSnackMessage:m.zb});t.default=(0,c.Z)((function(e){return(0,l.Z)((0,r.Z)((0,r.Z)((0,r.Z)({codeMirrorContainer:{marginBottom:20,"& label":{marginBottom:".5rem"},"& label + div":{display:"none"}}},u.DF),u.ID),u.bK))}))(Z((function(e){var t=e.classes,n=e.open,r=e.bucketName,i=e.actualPolicy,l=e.actualDefinition,c=e.closeModalAndRefresh,u=e.setModalErrorSnackMessage,m=(0,a.useState)(!1),Z=(0,o.Z)(m,2),v=Z[0],C=Z[1],j=(0,a.useState)(""),y=(0,o.Z)(j,2),k=y[0],S=y[1],M=(0,a.useState)(""),B=(0,o.Z)(M,2),N=B[0],w=B[1];return(0,a.useEffect)((function(){S(i),w(l?JSON.stringify(JSON.parse(l),null,4):"")}),[S,i,w,l]),(0,b.jsx)(f.Z,{title:"Change Access Policy",modalOpen:n,onClose:function(){c()},titleIcon:(0,b.jsx)(x.QX,{}),children:(0,b.jsx)("form",{noValidate:!0,autoComplete:"off",onSubmit:function(e){e.preventDefault(),v||(C(!0),p.Z.invoke("PUT","/api/v1/buckets/".concat(r,"/set-policy"),{access:k,definition:N}).then((function(e){C(!1),c()})).catch((function(e){C(!1),u(e)})))},children:(0,b.jsxs)(d.ZP,{container:!0,children:[(0,b.jsxs)(d.ZP,{item:!0,xs:12,className:t.modalFormScrollable,children:[(0,b.jsx)(d.ZP,{item:!0,xs:12,className:t.formFieldRow,children:(0,b.jsx)(g.Z,{value:k,label:"Access Policy",id:"select-access-policy",name:"select-access-policy",onChange:function(e){S(e.target.value)},options:[{value:"PRIVATE",label:"Private"},{value:"PUBLIC",label:"Public"},{value:"CUSTOM",label:"Custom"}]})}),"CUSTOM"===k&&(0,b.jsx)(d.ZP,{item:!0,xs:12,className:t.codeMirrorContainer,children:(0,b.jsx)(h.Z,{label:"Write Policy",value:N,onBeforeChange:function(e,t,n){w(n)},editorHeight:"350px"})})]}),(0,b.jsxs)(d.ZP,{item:!0,xs:12,className:t.modalButtonBar,children:[(0,b.jsx)(s.Z,{type:"button",variant:"outlined",color:"primary",onClick:function(){c()},disabled:v,children:"Cancel"}),(0,b.jsx)(s.Z,{type:"submit",variant:"contained",color:"primary",disabled:v||"CUSTOM"===k&&!N,children:"Set"})]})]})})})})))},70014:function(e,t,n){var o=n(35531),r=n(23430),a=n(18489),i=n(50390),s=n(25594),l=(n(2574),n(20704)),c=n(54880),d=n(21563),u=n(36297),m=n(14602),p=n(94187),f=n(56805),g=n(86509),x=n(4285),h=n(97538),b=n(72462),Z=n(52813),v=n(53224),C=n(33034),j=n.n(C),y=n(53357),k=n(62559),S={json:d.AV,yaml:function(){return c.i.define(u.r)}},M=y.tk.theme({"&":{backgroundColor:"#FBFAFA"},".cm-content":{caretColor:"#05122B"},"&.cm-focused .cm-cursor":{borderLeftColor:"#05122B"},".cm-gutters":{backgroundColor:"#FBFAFA",color:"#000000",border:"none"},".cm-gutter.cm-foldGutter":{borderRight:"1px solid #eaeaea"},".cm-gutterElement":{fontSize:"13px"},".cm-line":{fontSize:"13px",color:"#2781B0","& .\u037cc":{color:"#C83B51"}},"& .\u037cb":{color:"#2781B0"},".cm-activeLine":{backgroundColor:"#dde1f1"},".cm-matchingBracket":{backgroundColor:"#05122B",color:"#ffffff"},".cm-selectionMatch":{backgroundColor:"#ebe7f1"},".cm-selectionLayer":{fontWeight:500}," .cm-selectionBackground":{backgroundColor:"#a180c7",color:"#ffffff"}},{dark:!1}),B=y.tk.theme({"&":{backgroundColor:"#282a36",color:"#ffb86c"},".cm-gutter.cm-foldGutter":{borderRight:"1px solid #eaeaea"},".cm-gutterElement":{fontSize:"13px"},".cm-line":{fontSize:"13px","& .\u037cd, & .\u037cc":{color:"#8e6cef"}},"& .\u037cb":{color:"#2781B0"},".cm-activeLine":{backgroundColor:"#44475a"},".cm-matchingBracket":{backgroundColor:"#842de5",color:"#ff79c6"},".cm-selectionLayer .cm-selectionBackground":{backgroundColor:"green"}},{dark:!0});t.Z=(0,x.Z)((function(e){return(0,g.Z)((0,a.Z)((0,a.Z)({},b.YI),{},{inputLabel:(0,a.Z)((0,a.Z)({},b.YI.inputLabel),{},{fontWeight:"normal"})}))}))((function(e){var t=e.value,n=e.label,a=void 0===n?"":n,c=e.tooltip,d=void 0===c?"":c,u=e.mode,g=void 0===u?"json":u,x=e.classes,b=e.onBeforeChange,C=e.readOnly,y=void 0!==C&&C,N=e.editorHeight,w=void 0===N?"250px":N,I=(0,i.useState)(!1),P=(0,r.Z)(I,2),E=P[0],L=P[1],F=[];return S[g]&&(F=[].concat((0,o.Z)(F),[S[g]()])),(0,k.jsxs)(i.Fragment,{children:[(0,k.jsxs)(m.Z,{className:x.inputLabel,children:[(0,k.jsx)("span",{children:a}),""!==d&&(0,k.jsx)("div",{className:x.tooltipContainer,children:(0,k.jsx)(p.Z,{title:d,placement:"top-start",children:(0,k.jsx)("div",{className:x.tooltip,children:(0,k.jsx)(h.Z,{})})})})]}),(0,k.jsx)(s.ZP,{item:!0,xs:12,children:(0,k.jsx)("br",{})}),(0,k.jsxs)(s.ZP,{item:!0,xs:12,sx:{border:"1px solid #eaeaea"},children:[(0,k.jsx)(s.ZP,{item:!0,xs:12,children:(0,k.jsx)(l.ZP,{value:t,theme:E?B:M,extensions:F,editable:!y,basicSetup:!0,height:w,onChange:function(e,t){b(null,null,e)}})}),(0,k.jsx)(s.ZP,{item:!0,xs:12,sx:{borderTop:"1px solid #eaeaea",background:E?"#282c34":"#f7f7f7"},children:(0,k.jsxs)(f.Z,{sx:{display:"flex",alignItems:"center",padding:"2px",paddingRight:"5px",justifyContent:"flex-end","& button":{height:"26px",width:"26px",padding:"2px"," .min-icon":{marginLeft:"0"}}},children:[(0,k.jsx)(v.Z,{tooltip:"Change theme",onClick:function(){L(!E)},text:"",icon:(0,k.jsx)(Z.EO,{}),color:"primary",variant:"outlined"}),(0,k.jsx)(j(),{text:t,children:(0,k.jsx)(v.Z,{tooltip:"Copy to Clipboard",onClick:function(){},text:"",icon:(0,k.jsx)(Z.TI,{}),color:"primary",variant:"outlined"})})]})})]})]})}))},67754:function(e,t,n){var o=n(18489),r=n(50390),a=n(25594),i=n(46413),s=n(14602),l=n(94187),c=n(47554),d=n(43965),u=n(31680),m=n(86509),p=n(4285),f=n(72462),g=n(97538),x=n(62559),h=(0,p.Z)((function(e){return(0,m.Z)({root:{height:38,lineHeight:1,"label + &":{marginTop:e.spacing(3)}},input:{height:38,position:"relative",color:"#07193E",fontSize:13,fontWeight:600,padding:"8px 20px 10px 10px",border:"#e5e5e5 1px solid",borderRadius:4,display:"flex",alignItems:"center","&:hover":{borderColor:"#393939"},"&:focus":{backgroundColor:"#fff"}}})}))(i.ZP);t.Z=(0,p.Z)((function(e){return(0,m.Z)((0,o.Z)((0,o.Z)((0,o.Z)({},f.YI),f.Hr),{},{inputLabel:(0,o.Z)((0,o.Z)({},f.YI.inputLabel),{},{"& span":{fontWeight:"normal"}}),fieldContainer:{display:"flex","@media (max-width: 600px)":{flexFlow:"column"}}}))}))((function(e){var t=e.classes,n=e.id,o=e.name,i=e.onChange,m=e.options,p=e.label,f=e.tooltip,b=void 0===f?"":f,Z=e.value,v=e.disabled,C=void 0!==v&&v;return(0,x.jsx)(r.Fragment,{children:(0,x.jsxs)(a.ZP,{item:!0,xs:12,className:t.fieldContainer,children:[""!==p&&(0,x.jsxs)(s.Z,{htmlFor:n,className:t.inputLabel,children:[(0,x.jsx)("span",{children:p}),""!==b&&(0,x.jsx)("div",{className:t.tooltipContainer,children:(0,x.jsx)(l.Z,{title:b,placement:"top-start",children:(0,x.jsx)("div",{className:t.tooltip,children:(0,x.jsx)(g.Z,{})})})})]}),(0,x.jsx)(c.Z,{fullWidth:!0,children:(0,x.jsx)(d.Z,{id:n,name:o,value:Z,onChange:i,input:(0,x.jsx)(h,{}),disabled:C,children:m.map((function(e){return(0,x.jsx)(u.Z,{value:e.value,children:e.label},"select-".concat(o,"-").concat(e.label))}))})})]})})}))},76352:function(e,t,n){n.d(t,{Z:function(){return B}});var o,r=n(23430),a=n(18489),i=n(50390),s=n(34424),l=n(95467),c=n(97771),d=n(84402),u=n(78426),m=n(93085),p=n(86509),f=n(4285),g=n(72462),x=n(44149),h=n(38342),b=n.n(h),Z=n(92125),v=n(19538),C=n(21278),j=n(62559),y=function(){clearInterval(o)},k={displayErrorMessage:x.zb},S=(0,s.$j)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),k)((0,f.Z)((function(e){return(0,p.Z)({modalErrorContainer:{position:"absolute",marginTop:10,width:"80%",backgroundColor:"#fff",border:"#C72C48 1px solid",borderLeftWidth:12,borderRadius:3,zIndex:1e3,padding:"10px 15px",left:"50%",transform:"translateX(-50%)",opacity:0,transitionDuration:"0.2s"},modalErrorShow:{opacity:1},closeButton:{position:"absolute",right:5,fontSize:"small",border:0,backgroundColor:"#fff",cursor:"pointer"},errorTitle:{display:"flex",alignItems:"center"},errorLabel:{color:"#000",fontSize:18,fontWeight:500,marginLeft:5,marginRight:25},messageIcon:{color:"#C72C48",display:"flex","& svg":{width:32,height:32}},detailsButton:{color:"#9C9C9C",display:"flex",alignItems:"center",border:0,backgroundColor:"transparent",paddingLeft:5,fontSize:14,transformDuration:"0.3s",cursor:"pointer"},extraDetailsContainer:{fontStyle:"italic",color:"#9C9C9C",lineHeight:0,padding:"0 10px",transition:"all .2s ease-in-out",overflow:"hidden"},extraDetailsOpen:{lineHeight:1,padding:"3px 10px"},arrowElement:{marginLeft:-5},arrowOpen:{transform:"rotateZ(90deg)",transformDuration:"0.3s"}})}))((function(e){var t=e.classes,n=e.modalSnackMessage,a=e.displayErrorMessage,s=e.customStyle,l=(0,i.useState)(!1),c=(0,r.Z)(l,2),d=c[0],u=c[1],m=(0,i.useState)(!1),p=(0,r.Z)(m,2),f=p[0],g=p[1],x=(0,i.useCallback)((function(){g(!1)}),[]);(0,i.useEffect)((function(){f||(a({detailedError:"",errorMessage:""}),u(!1))}),[a,f]),(0,i.useEffect)((function(){""!==n.message&&"error"===n.type&&g(!0)}),[x,n.message,n.type]);var h=b()(n,"message",""),k=b()(n,"detailedErrorMsg","");return"error"!==n.type||""===h?null:(0,j.jsx)(i.Fragment,{children:(0,j.jsxs)("div",{className:"".concat(t.modalErrorContainer," ").concat(f?t.modalErrorShow:""),style:s,onMouseOver:y,onMouseLeave:function(){o=setInterval(x,1e4)},children:[(0,j.jsx)("button",{className:t.closeButton,onClick:x,children:(0,j.jsx)(C.Z,{})}),(0,j.jsxs)("div",{className:t.errorTitle,children:[(0,j.jsx)("span",{className:t.messageIcon,children:(0,j.jsx)(v.Z,{})}),(0,j.jsx)("span",{className:t.errorLabel,children:h})]}),""!==k&&(0,j.jsxs)(i.Fragment,{children:[(0,j.jsx)("div",{className:t.detailsContainerLink,children:(0,j.jsxs)("button",{className:t.detailsButton,onClick:function(){u(!d)},children:["Details",(0,j.jsx)(Z.Z,{className:"".concat(t.arrowElement," ").concat(d?t.arrowOpen:"")})]})}),(0,j.jsx)("div",{className:"".concat(t.extraDetailsContainer," ").concat(d?t.extraDetailsOpen:""),children:k})]})]})})}))),M=(0,s.$j)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),{setModalSnackMessage:x.MK}),B=(0,f.Z)((function(e){return(0,p.Z)((0,a.Z)((0,a.Z)({},g.Qw),{},{root:{"& .MuiPaper-root":{padding:"1rem 2rem 2rem 1rem"}},content:{padding:25,paddingBottom:0},customDialogSize:{width:"100%",maxWidth:765}},g.sN))}))(M((function(e){var t=e.onClose,n=e.modalOpen,o=e.title,s=e.children,p=e.classes,f=e.wideLimit,g=void 0===f||f,x=e.modalSnackMessage,h=e.noContentPadding,b=e.setModalSnackMessage,Z=e.titleIcon,v=void 0===Z?null:Z,y=(0,i.useState)(!1),k=(0,r.Z)(y,2),M=k[0],B=k[1];(0,i.useEffect)((function(){b("")}),[b]),(0,i.useEffect)((function(){if(x){if(""===x.message)return void B(!1);"error"!==x.type&&B(!0)}}),[x]);var N=g?{classes:{paper:p.customDialogSize}}:{maxWidth:"lg",fullWidth:!0},w="";return x&&(w=x.detailedErrorMsg,(""===x.detailedErrorMsg||x.detailedErrorMsg.length<5)&&(w=x.message)),(0,j.jsxs)(d.Z,(0,a.Z)((0,a.Z)({open:n,classes:p},N),{},{scroll:"paper",onClose:function(e,n){"backdropClick"!==n&&t()},className:p.root,children:[(0,j.jsxs)(u.Z,{className:p.title,children:[(0,j.jsxs)("div",{className:p.titleText,children:[v," ",o]}),(0,j.jsx)("div",{className:p.closeContainer,children:(0,j.jsx)(l.Z,{"aria-label":"close",className:p.closeButton,onClick:t,disableRipple:!0,size:"small",children:(0,j.jsx)(C.Z,{})})})]}),(0,j.jsx)(S,{}),(0,j.jsx)(c.Z,{open:M,className:p.snackBarModal,onClose:function(){B(!1),b("")},message:w,ContentProps:{className:"".concat(p.snackBar," ").concat(x&&"error"===x.type?p.errorSnackBar:"")},autoHideDuration:x&&"error"===x.type?1e4:5e3}),(0,j.jsx)(m.Z,{className:h?"":p.content,children:s})]}))})))},4247:function(e,t,n){n.d(t,{V:function(){return r}});var o=n(10594);function r(e){return(0,o.Z)("MuiDivider",e)}var a=(0,n(43349).Z)("MuiDivider",["root","absolute","fullWidth","inset","middle","flexItem","light","vertical","withChildren","withChildrenVertical","textAlignRight","textAlignLeft","wrapper","wrapperVertical"]);t.Z=a},31680:function(e,t,n){n.d(t,{Z:function(){return S}});var o=n(36222),r=n(1048),a=n(32793),i=n(50390),s=n(44977),l=n(50076),c=n(36128),d=n(8208),u=n(15573),m=n(57308),p=n(86875),f=n(40839),g=n(3299),x=n(4247),h=n(2198),b=n(23586),Z=n(10594);function v(e){return(0,Z.Z)("MuiMenuItem",e)}var C=(0,n(43349).Z)("MuiMenuItem",["root","focusVisible","dense","disabled","divider","gutters","selected"]),j=n(62559),y=["autoFocus","component","dense","divider","disableGutters","focusVisibleClassName","role","tabIndex"],k=(0,d.ZP)(p.Z,{shouldForwardProp:function(e){return(0,d.FO)(e)||"classes"===e},name:"MuiMenuItem",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,n.dense&&t.dense,n.divider&&t.divider,!n.disableGutters&&t.gutters]}})((function(e){var t,n=e.theme,r=e.ownerState;return(0,a.Z)({},n.typography.body1,{display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",whiteSpace:"nowrap"},!r.disableGutters&&{paddingLeft:16,paddingRight:16},r.divider&&{borderBottom:"1px solid ".concat(n.palette.divider),backgroundClip:"padding-box"},(t={"&:hover":{textDecoration:"none",backgroundColor:n.palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}}},(0,o.Z)(t,"&.".concat(C.selected),(0,o.Z)({backgroundColor:(0,c.Fq)(n.palette.primary.main,n.palette.action.selectedOpacity)},"&.".concat(C.focusVisible),{backgroundColor:(0,c.Fq)(n.palette.primary.main,n.palette.action.selectedOpacity+n.palette.action.focusOpacity)})),(0,o.Z)(t,"&.".concat(C.selected,":hover"),{backgroundColor:(0,c.Fq)(n.palette.primary.main,n.palette.action.selectedOpacity+n.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:(0,c.Fq)(n.palette.primary.main,n.palette.action.selectedOpacity)}}),(0,o.Z)(t,"&.".concat(C.focusVisible),{backgroundColor:n.palette.action.focus}),(0,o.Z)(t,"&.".concat(C.disabled),{opacity:n.palette.action.disabledOpacity}),(0,o.Z)(t,"& + .".concat(x.Z.root),{marginTop:n.spacing(1),marginBottom:n.spacing(1)}),(0,o.Z)(t,"& + .".concat(x.Z.inset),{marginLeft:52}),(0,o.Z)(t,"& .".concat(b.Z.root),{marginTop:0,marginBottom:0}),(0,o.Z)(t,"& .".concat(b.Z.inset),{paddingLeft:36}),(0,o.Z)(t,"& .".concat(h.Z.root),{minWidth:36}),t),!r.dense&&(0,o.Z)({},n.breakpoints.up("sm"),{minHeight:"auto"}),r.dense&&(0,a.Z)({minHeight:32,paddingTop:4,paddingBottom:4},n.typography.body2,(0,o.Z)({},"& .".concat(h.Z.root," svg"),{fontSize:"1.25rem"})))})),S=i.forwardRef((function(e,t){var n=(0,u.Z)({props:e,name:"MuiMenuItem"}),o=n.autoFocus,c=void 0!==o&&o,d=n.component,p=void 0===d?"li":d,x=n.dense,h=void 0!==x&&x,b=n.divider,Z=void 0!==b&&b,C=n.disableGutters,S=void 0!==C&&C,M=n.focusVisibleClassName,B=n.role,N=void 0===B?"menuitem":B,w=n.tabIndex,I=(0,r.Z)(n,y),P=i.useContext(m.Z),E={dense:h||P.dense||!1,disableGutters:S},L=i.useRef(null);(0,f.Z)((function(){c&&L.current&&L.current.focus()}),[c]);var F,O=(0,a.Z)({},n,{dense:E.dense,divider:Z,disableGutters:S}),D=function(e){var t=e.disabled,n=e.dense,o=e.divider,r=e.disableGutters,i=e.selected,s=e.classes,c={root:["root",n&&"dense",t&&"disabled",!r&&"gutters",o&&"divider",i&&"selected"]},d=(0,l.Z)(c,v,s);return(0,a.Z)({},s,d)}(n),T=(0,g.Z)(L,t);return n.disabled||(F=void 0!==w?w:-1),(0,j.jsx)(m.Z.Provider,{value:E,children:(0,j.jsx)(k,(0,a.Z)({ref:T,role:N,tabIndex:F,component:p,focusVisibleClassName:(0,s.Z)(D.focusVisible,M)},I,{ownerState:O,classes:D}))})}))},89472:function(e,t,n){n.d(t,{Z:function(){return r}});var o=n(72327);function r(e,t){var n="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=(0,o.Z)(e))||t&&e&&"number"===typeof e.length){n&&(e=n);var r=0,a=function(){};return{s:a,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,s=!0,l=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return s=e.done,e},e:function(e){l=!0,i=e},f:function(){try{s||null==n.return||n.return()}finally{if(l)throw i}}}}}}]);
//# sourceMappingURL=6951.89bf293f.chunk.js.map