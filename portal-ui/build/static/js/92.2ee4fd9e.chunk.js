(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[92],{347:function(e,t,a){"use strict";var n,o=a(15),i=a(3),c=a(0),r=a(38),l=a(328),s=a(322),d=a(417),b=a(418),j=a(419),u=a(250),p=a(260),h=a(116),x=a(30),O=a(45),m=a.n(O),g=a(125),f=a.n(g),v=a(124),C=a.n(v),k=a(122),y=a.n(k),S=a(2),N=function(){clearInterval(n)},w={displayErrorMessage:x.h},L=Object(r.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),w)(Object(p.a)((function(e){return Object(u.a)({modalErrorContainer:{position:"absolute",marginTop:10,width:"80%",backgroundColor:"#fff",border:"#C72C48 1px solid",borderLeftWidth:12,borderRadius:3,zIndex:1e3,padding:"10px 15px",left:"50%",transform:"translateX(-50%)",opacity:0,transitionDuration:"0.2s"},modalErrorShow:{opacity:1},closeButton:{position:"absolute",right:5,fontSize:"small",border:0,backgroundColor:"#fff",cursor:"pointer"},errorTitle:{display:"flex",alignItems:"center"},errorLabel:{color:"#000",fontSize:18,fontWeight:500,marginLeft:5,marginRight:25},messageIcon:{color:"#C72C48",display:"flex","& svg":{width:32,height:32}},simpleError:{marginTop:5,padding:"2px 5px",fontSize:16,color:"#000"},detailsButton:{color:"#9C9C9C",display:"flex",alignItems:"center",border:0,backgroundColor:"transparent",paddingLeft:5,fontSize:14,transformDuration:"0.3s",cursor:"pointer"},extraDetailsContainer:{fontStyle:"italic",color:"#9C9C9C",lineHeight:0,padding:"0 10px",transition:"all .2s ease-in-out",overflow:"hidden"},extraDetailsOpen:{lineHeight:1,padding:"3px 10px"},arrowElement:{marginLeft:-5},arrowOpen:{transform:"rotateZ(90deg)",transformDuration:"0.3s"}})}))((function(e){var t=e.classes,a=e.modalSnackMessage,i=e.displayErrorMessage,r=e.customStyle,l=Object(c.useState)(!1),s=Object(o.a)(l,2),d=s[0],b=s[1],j=Object(c.useState)(!1),u=Object(o.a)(j,2),p=u[0],h=u[1],x=Object(c.useCallback)((function(){h(!1)}),[]);Object(c.useEffect)((function(){p||(i({detailedError:"",errorMessage:""}),b(!1))}),[i,p]),Object(c.useEffect)((function(){""!==a.message&&"error"===a.type&&h(!0)}),[x,a.message,a.type]);var O=m()(a,"message",""),g=m()(a,"detailedErrorMsg","");return"error"!==a.type||""===O?null:Object(S.jsx)(c.Fragment,{children:Object(S.jsxs)("div",{className:"".concat(t.modalErrorContainer," ").concat(p?t.modalErrorShow:""),style:r,onMouseOver:N,onMouseLeave:function(){n=setInterval(x,1e4)},children:[Object(S.jsx)("button",{className:t.closeButton,onClick:x,children:Object(S.jsx)(y.a,{})}),Object(S.jsxs)("div",{className:t.errorTitle,children:[Object(S.jsx)("span",{className:t.messageIcon,children:Object(S.jsx)(C.a,{})}),Object(S.jsx)("span",{className:t.errorLabel,children:O})]}),""!==g&&Object(S.jsxs)(c.Fragment,{children:[Object(S.jsx)("div",{className:t.detailsContainerLink,children:Object(S.jsxs)("button",{className:t.detailsButton,onClick:function(){b(!d)},children:["Details",Object(S.jsx)(f.a,{className:"".concat(t.arrowElement," ").concat(d?t.arrowOpen:"")})]})}),Object(S.jsx)("div",{className:"".concat(t.extraDetailsContainer," ").concat(d?t.extraDetailsOpen:""),children:g})]})]})})}))),M={content:'" "',borderLeft:"2px solid #9C9C9C",height:33,width:1,position:"absolute"},E=Object(r.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),{setModalSnackMessage:x.i});t.a=Object(p.a)((function(e){return Object(u.a)(Object(i.a)({dialogContainer:{padding:"8px 15px 22px"},closeContainer:{textAlign:"right"},closeButton:{height:16,width:16,padding:0,backgroundColor:"initial","&:hover":{backgroundColor:"initial"},"&:active":{backgroundColor:"initial"}},modalCloseIcon:{fontSize:35,color:"#9C9C9C",fontWeight:300,"&:hover":{color:"#9C9C9C"}},closeIcon:{"&::before":Object(i.a)(Object(i.a)({},M),{},{transform:"rotate(45deg)",height:12}),"&::after":Object(i.a)(Object(i.a)({},M),{},{transform:"rotate(-45deg)",height:12}),"&:hover::before, &:hover::after":{borderColor:"#9C9C9C"},display:"block",position:"relative",height:12,width:12},titleClass:{padding:"0px 50px 12px",fontSize:"1.2rem",fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"},modalContent:{padding:"0 50px"},customDialogSize:{width:"100%",maxWidth:765}},h.y))}))(E((function(e){var t=e.onClose,a=e.modalOpen,n=e.title,r=e.children,u=e.classes,p=e.wideLimit,h=void 0===p||p,x=e.modalSnackMessage,O=e.noContentPadding,m=e.setModalSnackMessage,g=Object(c.useState)(!1),f=Object(o.a)(g,2),v=f[0],C=f[1];Object(c.useEffect)((function(){m("")}),[m]),Object(c.useEffect)((function(){if(x){if(""===x.message)return void C(!1);"error"!==x.type&&C(!0)}}),[x]);var k=h?{classes:{paper:u.customDialogSize}}:{maxWidth:"lg",fullWidth:!0},y="";return x&&(y=x.detailedErrorMsg,(""===x.detailedErrorMsg||x.detailedErrorMsg.length<5)&&(y=x.message)),Object(S.jsx)(d.a,Object(i.a)(Object(i.a)({open:a,onClose:t,"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description"},k),{},{children:Object(S.jsxs)("div",{className:u.dialogContainer,children:[Object(S.jsx)(L,{}),Object(S.jsx)(s.a,{open:v,className:u.snackBarModal,onClose:function(){C(!1),m("")},message:y,ContentProps:{className:"".concat(u.snackBar," ").concat(x&&"error"===x.type?u.errorSnackBar:"")},autoHideDuration:x&&"error"===x.type?1e4:5e3}),Object(S.jsx)("div",{className:u.closeContainer,children:Object(S.jsx)(l.a,{"aria-label":"close",className:u.closeButton,onClick:t,disableRipple:!0,size:"large",children:Object(S.jsx)("span",{className:u.closeIcon})})}),Object(S.jsx)(b.a,{id:"alert-dialog-title",className:u.titleClass,children:n}),Object(S.jsx)(j.a,{className:O?"":u.modalContent,children:r})]})}))})))},348:function(e,t,a){"use strict";var n=a(3),o=a(0),i=a.n(o),c=a(428),r=a(444),l=a(818),s=a(326),d=a(328),b=a(250),j=a(319),u=a(260),p=a(116),h=a(334),x=a(2),O=Object(j.a)((function(e){return Object(b.a)(Object(n.a)({},p.n))}));function m(e){var t=O();return Object(x.jsx)(c.a,Object(n.a)({InputProps:{classes:t}},e))}t.a=Object(u.a)((function(e){return Object(b.a)(Object(n.a)(Object(n.a)(Object(n.a)({},p.i),p.D),{},{textBoxContainer:{flexGrow:1,position:"relative"},textBoxWithIcon:{position:"relative",paddingRight:25},errorState:{color:"#b53b4b",fontSize:14,position:"absolute",top:7,right:7},overlayAction:{position:"absolute",right:5,top:6,"& svg":{maxWidth:15,maxHeight:15},"&.withLabel":{top:5}}}))}))((function(e){var t=e.label,a=e.onChange,o=e.value,c=e.id,b=e.name,j=e.type,u=void 0===j?"text":j,p=e.autoComplete,O=void 0===p?"off":p,g=e.disabled,f=void 0!==g&&g,v=e.multiline,C=void 0!==v&&v,k=e.tooltip,y=void 0===k?"":k,S=e.index,N=void 0===S?0:S,w=e.error,L=void 0===w?"":w,M=e.required,E=void 0!==M&&M,F=e.placeholder,B=void 0===F?"":F,I=e.min,W=e.max,z=e.overlayIcon,T=void 0===z?null:z,D=e.overlayObject,q=void 0===D?null:D,R=e.extraInputProps,A=void 0===R?{}:R,H=e.overlayAction,_=e.noLabelMinWidth,P=void 0!==_&&_,Q=e.classes,$=Object(n.a)({"data-index":N},A);return"number"===u&&I&&($.min=I),"number"===u&&W&&($.max=W),Object(x.jsx)(i.a.Fragment,{children:Object(x.jsxs)(r.a,{container:!0,className:" ".concat(""!==L?Q.errorInField:Q.inputBoxContainer),children:[""!==t&&Object(x.jsxs)(l.a,{htmlFor:c,className:P?Q.noMinWidthLabel:Q.inputLabel,children:[Object(x.jsxs)("span",{children:[t,E?"*":""]}),""!==y&&Object(x.jsx)("div",{className:Q.tooltipContainer,children:Object(x.jsx)(s.a,{title:y,placement:"top-start",children:Object(x.jsx)("div",{className:Q.tooltip,children:Object(x.jsx)(h.a,{})})})})]}),Object(x.jsxs)("div",{className:Q.textBoxContainer,children:[Object(x.jsx)(m,{id:c,name:b,fullWidth:!0,value:o,disabled:f,onChange:a,type:u,multiline:C,autoComplete:O,inputProps:$,error:""!==L,helperText:L,placeholder:B,className:Q.inputRebase}),T&&Object(x.jsx)("div",{className:"".concat(Q.overlayAction," ").concat(""!==t?"withLabel":""),children:Object(x.jsx)(d.a,{onClick:H?function(){H()}:function(){return null},size:"small",disableFocusRipple:!1,disableRipple:!1,disableTouchRipple:!1,children:T})}),q&&Object(x.jsx)("div",{className:"".concat(Q.overlayAction," ").concat(""!==t?"withLabel":""),children:q})]})]})})}))},412:function(e,t,a){"use strict";var n=a(5),o=a(3),i=a(0),c=a.n(i),r=a(250),l=a(260),s=a(485),d=a(818),b=a(326),j=a(91),u=a(444),p=a(116),h=a(334),x=a(7),O=a(2),m=Object(l.a)((function(e){return{root:{width:50,height:24,padding:0,margin:0},switchBase:{padding:1,"&$checked":{transform:"translateX(24px)",color:e.palette.common.white,"& + $track":{backgroundColor:"#4CCB92",boxShadow:"inset 0px 1px 4px rgba(0,0,0,0.1)",opacity:1,border:"none"}},"&$focusVisible $thumb":{color:"#4CCB92",border:"6px solid #fff"}},thumb:{width:22,height:22,backgroundColor:"#FAFAFA",border:"2px solid #FFFFFF",marginLeft:1},track:{borderRadius:12,backgroundColor:"#E2E2E2",boxShadow:"inset 0px 1px 4px rgba(0,0,0,0.1)",opacity:1,transition:e.transitions.create(["background-color","border"])},checked:{},focusVisible:{}}}))(s.a);t.a=Object(l.a)((function(e){return Object(r.a)(Object(o.a)(Object(o.a)({seeMore:{marginTop:e.spacing(3)},paper:{display:"flex",overflow:"auto",flexDirection:"column",paddingTop:15,boxShadow:"none"},addSideBar:{width:"320px",padding:"20px"},tableToolbar:{paddingLeft:e.spacing(2),paddingRight:e.spacing(0)},wrapCell:{maxWidth:"200px",whiteSpace:"normal",wordWrap:"break-word"},minTableHeader:{color:"#393939","& tr":{"& th":{fontWeight:"bold"}}},noFound:{textAlign:"center",padding:"10px 0"},tableContainer:{maxHeight:200},stickyHeader:{backgroundColor:"#fff"},actionsTitle:{fontWeight:600,color:"#081C42",fontSize:16,alignSelf:"center"},tableBlock:{marginTop:15},filterField:{width:375,fontWeight:600,"& .input":{"&::placeholder":{fontWeight:600,color:"#081C42"}}},divContainer:{marginBottom:20},indicatorLabelOn:{fontWeight:"bold",color:"#081C42 !important"},indicatorLabel:{fontSize:12,color:"#E2E2E2",margin:"0 8px 0 10px"},fieldDescription:{marginTop:4,color:"#999999"},tooltip:{fontSize:16}},p.a),p.i))}))((function(e){var t=e.label,a=void 0===t?"":t,o=e.onChange,i=e.value,r=e.id,l=e.name,s=e.checked,p=void 0!==s&&s,g=e.disabled,f=void 0!==g&&g,v=e.switchOnly,C=void 0!==v&&v,k=e.tooltip,y=void 0===k?"":k,S=e.description,N=void 0===S?"":S,w=e.classes,L=e.indicatorLabels,M=Object(O.jsxs)(c.a.Fragment,{children:[!C&&Object(O.jsx)("span",{className:Object(x.a)(w.indicatorLabel,Object(n.a)({},w.indicatorLabelOn,!p)),children:L&&L.length>1?L[1]:"OFF"}),Object(O.jsx)(m,{checked:p,onChange:o,color:"primary",name:l,inputProps:{"aria-label":"primary checkbox"},disabled:f,disableRipple:!0,disableFocusRipple:!0,disableTouchRipple:!0,value:i}),!C&&Object(O.jsx)("span",{className:Object(x.a)(w.indicatorLabel,Object(n.a)({},w.indicatorLabelOn,p)),children:L?L[0]:"ON"})]});return C?M:Object(O.jsx)("div",{className:w.divContainer,children:Object(O.jsxs)(u.a,{container:!0,alignItems:"center",children:[Object(O.jsx)(u.a,{item:!0,xs:!0,children:Object(O.jsxs)(u.a,{container:!0,children:[Object(O.jsx)(u.a,{item:!0,xs:12,sm:4,md:3,children:""!==a&&Object(O.jsxs)(d.a,{htmlFor:r,className:w.inputLabel,children:[Object(O.jsx)("span",{children:a}),""!==y&&Object(O.jsx)("div",{className:w.tooltipContainer,children:Object(O.jsx)(b.a,{title:y,placement:"top-start",children:Object(O.jsx)("div",{className:w.tooltip,children:Object(O.jsx)(h.a,{})})})})]})}),Object(O.jsx)(u.a,{item:!0,xs:12,sm:!0,textAlign:"left",children:""!==N&&Object(O.jsx)(j.a,{component:"p",className:w.fieldDescription,children:N})})]})}),Object(O.jsx)(u.a,{item:!0,xs:12,sm:2,textAlign:"right",className:w.switchContainer,children:M})]})})}))},443:function(e,t,a){"use strict";var n=a(3),o=a(0),i=a.n(o),c=a(444),r=a(788),l=a(818),s=a(326),d=a(980),b=a(966),j=a(496),u=a(250),p=a(260),h=a(116),x=a(334),O=a(2),m=Object(p.a)((function(e){return Object(u.a)({root:{height:38,lineHeight:1,"label + &":{marginTop:e.spacing(3)}},input:{height:38,position:"relative",color:"#07193E",fontSize:13,fontWeight:600,padding:"8px 20px 10px 10px",border:"#e5e5e5 1px solid",borderRadius:4,display:"flex",alignItems:"center","&:hover":{borderColor:"#393939"},"&:focus":{backgroundColor:"#fff"}}})}))(r.c);t.a=Object(p.a)((function(e){return Object(u.a)(Object(n.a)(Object(n.a)({},h.i),h.D))}))((function(e){var t=e.classes,a=e.id,n=e.name,o=e.onChange,r=e.options,u=e.label,p=e.tooltip,h=void 0===p?"":p,g=e.value,f=e.disabled,v=void 0!==f&&f;return Object(O.jsx)(i.a.Fragment,{children:Object(O.jsxs)(c.a,{item:!0,xs:12,className:t.fieldContainer,children:[""!==u&&Object(O.jsxs)(l.a,{htmlFor:a,className:t.inputLabel,children:[Object(O.jsx)("span",{children:u}),""!==h&&Object(O.jsx)("div",{className:t.tooltipContainer,children:Object(O.jsx)(s.a,{title:h,placement:"top-start",children:Object(O.jsx)("div",{className:t.tooltip,children:Object(O.jsx)(x.a,{})})})})]}),Object(O.jsx)(d.a,{fullWidth:!0,children:Object(O.jsx)(b.a,{id:a,name:n,value:g,onChange:o,input:Object(O.jsx)(m,{}),disabled:v,children:r.map((function(e){return Object(O.jsx)(j.a,{value:e.value,children:e.label},"select-".concat(n,"-").concat(e.label))}))})})]})})}))},469:function(e,t,a){"use strict";var n=a(5),o=a(3),i=(a(0),a(7)),c=a(444),r=a(819),l=a(825),s=a(817),d=a(818),b=a(326),j=a(250),u=a(260),p=a(319),h=a(116),x=a(334),O=a(2),m=Object(p.a)(Object(o.a)({root:{"&:hover":{backgroundColor:"transparent"}}},h.t)),g=function(e){var t=m();return Object(O.jsx)(s.a,Object(o.a)({className:t.root,disableRipple:!0,color:"default",checkedIcon:Object(O.jsx)("span",{className:t.radioSelectedIcon}),icon:Object(O.jsx)("span",{className:t.radioUnselectedIcon})},e))};t.a=Object(u.a)((function(e){return Object(j.a)(Object(o.a)(Object(o.a)(Object(o.a)({},h.i),h.D),{},{radioBoxContainer:{},optionLabel:{"&.Mui-disabled":{"& .MuiFormControlLabel-label":{color:"#9c9c9c"}},"&:last-child":{marginRight:0},"& .MuiFormControlLabel-label":{fontSize:12,color:"#07193E"}},checkedOption:{"& .MuiFormControlLabel-label":{fontSize:12,color:"#07193E",fontWeight:700}}}))}))((function(e){var t=e.selectorOptions,a=void 0===t?[]:t,o=e.currentSelection,s=e.label,j=e.id,u=e.name,p=e.onChange,h=e.tooltip,m=void 0===h?"":h,f=e.disableOptions,v=void 0!==f&&f,C=e.classes,k=e.displayInColumn,y=void 0!==k&&k;return Object(O.jsxs)(c.a,{container:!0,alignItems:"center",children:[Object(O.jsx)(c.a,{item:!0,xs:!0,children:Object(O.jsxs)(d.a,{htmlFor:j,className:C.inputLabel,children:[Object(O.jsx)("span",{children:s}),""!==m&&Object(O.jsx)("div",{className:C.tooltipContainer,children:Object(O.jsx)(b.a,{title:m,placement:"top-start",children:Object(O.jsx)("div",{children:Object(O.jsx)(x.a,{})})})})]})}),Object(O.jsx)(c.a,{item:!0,xs:!0,className:C.radioOptionsLayout,children:Object(O.jsx)(r.a,{"aria-label":j,id:j,name:u,value:o,onChange:p,row:!y,style:{display:"block",textAlign:"right"},children:a.map((function(e){return Object(O.jsx)(l.a,{value:e.value,control:Object(O.jsx)(g,{}),label:e.label,disabled:v,className:Object(i.a)(C.optionLabel,Object(n.a)({},C.checkedOption,e.value===o))},"rd-".concat(u,"-").concat(e.value))}))})})]})}))},902:function(e,t,a){"use strict";a.r(t);var n=a(15),o=a(3),i=a(0),c=a.n(i),r=a(38),l=a(330),s=a(316),d=a(250),b=a(260),j=a(444),u=a(56),p=a(30),h=a(116),x=a(412),O=a(469),m=a(348),g=a(347),f=a(443),v=a(50),C=a(2),k=Object(r.b)(null,{setModalErrorSnackMessage:p.h});t.default=Object(b.a)((function(e){return Object(d.a)(Object(o.a)({minTableHeader:{color:"#393939","& tr":{"& th":{fontWeight:"bold"}}},buttonContainer:{textAlign:"right"},multiContainer:{display:"flex",alignItems:"center",justifyContent:"flex-start"}},h.p))}))(k((function(e){var t=e.classes,a=e.open,o=e.enabled,r=e.cfg,d=e.selectedBucket,b=e.closeModalAndRefresh,p=e.setModalErrorSnackMessage,h=Object(i.useState)(!1),k=Object(n.a)(h,2),y=k[0],S=k[1],N=Object(i.useState)(!1),w=Object(n.a)(N,2),L=w[0],M=w[1],E=Object(i.useState)("hard"),F=Object(n.a)(E,2),B=F[0],I=F[1],W=Object(i.useState)("1"),z=Object(n.a)(W,2),T=z[0],D=z[1],q=Object(i.useState)("TiB"),R=Object(n.a)(q,2),A=R[0],H=R[1];Object(i.useEffect)((function(){if(o&&(M(!0),r)){I(r.type),D("".concat(r.quota)),H("B");for(var e="B",t=r.quota,a=0;a<u.t.length&&r.quota%Math.pow(1024,a)===0;a++)t=r.quota/Math.pow(1024,a),e=u.t[a];D("".concat(t)),H(e)}}),[o,r]);return Object(C.jsx)(g.a,{modalOpen:a,onClose:function(){b()},title:"Enable Bucket Quota",children:Object(C.jsx)("form",{noValidate:!0,autoComplete:"off",onSubmit:function(e){!function(e){if(e.preventDefault(),!y){var t={enabled:L,amount:parseInt(Object(u.i)(T,A,!1)),quota_type:B};v.a.invoke("PUT","/api/v1/buckets/".concat(d,"/quota"),t).then((function(){S(!1),b()})).catch((function(e){S(!1),p(e)}))}}(e)},children:Object(C.jsxs)(j.a,{container:!0,children:[Object(C.jsxs)(j.a,{item:!0,xs:12,className:t.formScrollable,children:[Object(C.jsx)(j.a,{item:!0,xs:12,children:Object(C.jsx)(x.a,{value:"bucket_quota",id:"bucket_quota",name:"bucket_quota",checked:L,onChange:function(e){M(e.target.checked)},label:"Quota"})}),L&&Object(C.jsxs)(c.a.Fragment,{children:[Object(C.jsx)(j.a,{item:!0,xs:12,children:Object(C.jsx)(O.a,{currentSelection:B,id:"quota_type",name:"quota_type",label:"Quota Type",onChange:function(e){I(e.target.value)},selectorOptions:[{value:"hard",label:"Hard"},{value:"fifo",label:"FIFO"}]})}),Object(C.jsx)(j.a,{item:!0,xs:12,children:Object(C.jsxs)(j.a,{container:!0,children:[Object(C.jsx)(j.a,{item:!0,xs:10,children:Object(C.jsx)(m.a,{type:"number",id:"quota_size",name:"quota_size",onChange:function(e){D(e.target.value)},label:"Quota",value:T,required:!0,min:"1"})}),Object(C.jsx)(j.a,{item:!0,xs:2,children:Object(C.jsx)("div",{style:{width:100},children:Object(C.jsx)(f.a,{label:"",id:"quota_unit",name:"quota_unit",value:A,onChange:function(e){H(e.target.value)},options:Object(u.g)()})})})]})})]}),Object(C.jsx)(j.a,{item:!0,xs:12,children:Object(C.jsx)("br",{})})]}),Object(C.jsx)(j.a,{item:!0,xs:12,className:t.buttonContainer,children:Object(C.jsx)(l.a,{type:"submit",variant:"contained",color:"primary",disabled:y,children:"Save"})}),y&&Object(C.jsx)(j.a,{item:!0,xs:12,children:Object(C.jsx)(s.a,{})})]})})})})))}}]);
//# sourceMappingURL=92.2ee4fd9e.chunk.js.map