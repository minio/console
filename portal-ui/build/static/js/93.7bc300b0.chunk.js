(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[93],{389:function(e,t,a){"use strict";var n,i=a(15),o=a(1),c=a(2),r=a(39),l=a(378),s=a(372),d=a(406),b=a(407),j=a(408),u=a(300),p=a(310),h=a(120),O=a(31),m=a(46),x=a.n(m),f=a(127),g=a.n(f),v=a(126),C=a.n(v),k=a(123),y=a.n(k),N=a(0),S=function(){clearInterval(n)},w={displayErrorMessage:O.h},L=Object(r.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),w)(Object(p.a)((function(e){return Object(u.a)({modalErrorContainer:{position:"absolute",marginTop:10,width:"80%",backgroundColor:"#fff",border:"#C72C48 1px solid",borderLeftWidth:12,borderRadius:3,zIndex:1e3,padding:"10px 15px",left:"50%",transform:"translateX(-50%)",opacity:0,transitionDuration:"0.2s"},modalErrorShow:{opacity:1},closeButton:{position:"absolute",right:5,fontSize:"small",border:0,backgroundColor:"#fff",cursor:"pointer"},errorTitle:{display:"flex",alignItems:"center"},errorLabel:{color:"#000",fontSize:18,fontWeight:500,marginLeft:5,marginRight:25},messageIcon:{color:"#C72C48",display:"flex","& svg":{width:32,height:32}},detailsButton:{color:"#9C9C9C",display:"flex",alignItems:"center",border:0,backgroundColor:"transparent",paddingLeft:5,fontSize:14,transformDuration:"0.3s",cursor:"pointer"},extraDetailsContainer:{fontStyle:"italic",color:"#9C9C9C",lineHeight:0,padding:"0 10px",transition:"all .2s ease-in-out",overflow:"hidden"},extraDetailsOpen:{lineHeight:1,padding:"3px 10px"},arrowElement:{marginLeft:-5},arrowOpen:{transform:"rotateZ(90deg)",transformDuration:"0.3s"}})}))((function(e){var t=e.classes,a=e.modalSnackMessage,o=e.displayErrorMessage,r=e.customStyle,l=Object(c.useState)(!1),s=Object(i.a)(l,2),d=s[0],b=s[1],j=Object(c.useState)(!1),u=Object(i.a)(j,2),p=u[0],h=u[1],O=Object(c.useCallback)((function(){h(!1)}),[]);Object(c.useEffect)((function(){p||(o({detailedError:"",errorMessage:""}),b(!1))}),[o,p]),Object(c.useEffect)((function(){""!==a.message&&"error"===a.type&&h(!0)}),[O,a.message,a.type]);var m=x()(a,"message",""),f=x()(a,"detailedErrorMsg","");return"error"!==a.type||""===m?null:Object(N.jsx)(c.Fragment,{children:Object(N.jsxs)("div",{className:"".concat(t.modalErrorContainer," ").concat(p?t.modalErrorShow:""),style:r,onMouseOver:S,onMouseLeave:function(){n=setInterval(O,1e4)},children:[Object(N.jsx)("button",{className:t.closeButton,onClick:O,children:Object(N.jsx)(y.a,{})}),Object(N.jsxs)("div",{className:t.errorTitle,children:[Object(N.jsx)("span",{className:t.messageIcon,children:Object(N.jsx)(C.a,{})}),Object(N.jsx)("span",{className:t.errorLabel,children:m})]}),""!==f&&Object(N.jsxs)(c.Fragment,{children:[Object(N.jsx)("div",{className:t.detailsContainerLink,children:Object(N.jsxs)("button",{className:t.detailsButton,onClick:function(){b(!d)},children:["Details",Object(N.jsx)(g.a,{className:"".concat(t.arrowElement," ").concat(d?t.arrowOpen:"")})]})}),Object(N.jsx)("div",{className:"".concat(t.extraDetailsContainer," ").concat(d?t.extraDetailsOpen:""),children:f})]})]})})}))),M={content:'" "',borderLeft:"2px solid #9C9C9C",height:33,width:1,position:"absolute"},E=Object(r.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),{setModalSnackMessage:O.i});t.a=Object(p.a)((function(e){return Object(u.a)(Object(o.a)({dialogContainer:{padding:"8px 15px 22px"},closeContainer:{textAlign:"right"},closeButton:{height:16,width:16,padding:0,backgroundColor:"initial","&:hover":{backgroundColor:"initial"},"&:active":{backgroundColor:"initial"}},closeIcon:{"&::before":Object(o.a)(Object(o.a)({},M),{},{transform:"rotate(45deg)",height:12}),"&::after":Object(o.a)(Object(o.a)({},M),{},{transform:"rotate(-45deg)",height:12}),"&:hover::before, &:hover::after":{borderColor:"#9C9C9C"},display:"block",position:"relative",height:12,width:12},titleClass:{padding:"0px 50px 12px",fontSize:"1.2rem",fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"},modalContent:{padding:"0 50px"},customDialogSize:{width:"100%",maxWidth:765}},h.y))}))(E((function(e){var t=e.onClose,a=e.modalOpen,n=e.title,r=e.children,u=e.classes,p=e.wideLimit,h=void 0===p||p,O=e.modalSnackMessage,m=e.noContentPadding,x=e.setModalSnackMessage,f=Object(c.useState)(!1),g=Object(i.a)(f,2),v=g[0],C=g[1];Object(c.useEffect)((function(){x("")}),[x]),Object(c.useEffect)((function(){if(O){if(""===O.message)return void C(!1);"error"!==O.type&&C(!0)}}),[O]);var k=h?{classes:{paper:u.customDialogSize}}:{maxWidth:"lg",fullWidth:!0},y="";return O&&(y=O.detailedErrorMsg,(""===O.detailedErrorMsg||O.detailedErrorMsg.length<5)&&(y=O.message)),Object(N.jsx)(d.a,Object(o.a)(Object(o.a)({open:a,onClose:t,"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description"},k),{},{children:Object(N.jsxs)("div",{className:u.dialogContainer,children:[Object(N.jsx)(L,{}),Object(N.jsx)(s.a,{open:v,className:u.snackBarModal,onClose:function(){C(!1),x("")},message:y,ContentProps:{className:"".concat(u.snackBar," ").concat(O&&"error"===O.type?u.errorSnackBar:"")},autoHideDuration:O&&"error"===O.type?1e4:5e3}),Object(N.jsx)("div",{className:u.closeContainer,children:Object(N.jsx)(l.a,{"aria-label":"close",className:u.closeButton,onClick:t,disableRipple:!0,size:"large",children:Object(N.jsx)("span",{className:u.closeIcon})})}),Object(N.jsx)(b.a,{id:"alert-dialog-title",className:u.titleClass,children:n}),Object(N.jsx)(j.a,{className:m?"":u.modalContent,children:r})]})}))})))},390:function(e,t,a){"use strict";var n=a(1),i=a(2),o=a.n(i),c=a(415),r=a(436),l=a(809),s=a(376),d=a(378),b=a(300),j=a(369),u=a(310),p=a(120),h=a(121),O=a(0),m=Object(j.a)((function(e){return Object(b.a)(Object(n.a)({},p.n))}));function x(e){var t=m();return Object(O.jsx)(c.a,Object(n.a)({InputProps:{classes:t}},e))}t.a=Object(u.a)((function(e){return Object(b.a)(Object(n.a)(Object(n.a)(Object(n.a)({},p.i),p.D),{},{textBoxContainer:{flexGrow:1,position:"relative"},overlayAction:{position:"absolute",right:5,top:6,"& svg":{maxWidth:15,maxHeight:15},"&.withLabel":{top:5}}}))}))((function(e){var t=e.label,a=e.onChange,i=e.value,c=e.id,b=e.name,j=e.type,u=void 0===j?"text":j,p=e.autoComplete,m=void 0===p?"off":p,f=e.disabled,g=void 0!==f&&f,v=e.multiline,C=void 0!==v&&v,k=e.tooltip,y=void 0===k?"":k,N=e.index,S=void 0===N?0:N,w=e.error,L=void 0===w?"":w,M=e.required,E=void 0!==M&&M,F=e.placeholder,B=void 0===F?"":F,I=e.min,q=e.max,D=e.overlayIcon,z=void 0===D?null:D,R=e.overlayObject,W=void 0===R?null:R,A=e.extraInputProps,T=void 0===A?{}:A,_=e.overlayAction,P=e.noLabelMinWidth,H=void 0!==P&&P,Q=e.classes,$=Object(n.a)({"data-index":S},T);return"number"===u&&I&&($.min=I),"number"===u&&q&&($.max=q),Object(O.jsx)(o.a.Fragment,{children:Object(O.jsxs)(r.a,{container:!0,className:" ".concat(""!==L?Q.errorInField:Q.inputBoxContainer),children:[""!==t&&Object(O.jsxs)(l.a,{htmlFor:c,className:H?Q.noMinWidthLabel:Q.inputLabel,children:[Object(O.jsxs)("span",{children:[t,E?"*":""]}),""!==y&&Object(O.jsx)("div",{className:Q.tooltipContainer,children:Object(O.jsx)(s.a,{title:y,placement:"top-start",children:Object(O.jsx)("div",{className:Q.tooltip,children:Object(O.jsx)(h.a,{})})})})]}),Object(O.jsxs)("div",{className:Q.textBoxContainer,children:[Object(O.jsx)(x,{id:c,name:b,fullWidth:!0,value:i,disabled:g,onChange:a,type:u,multiline:C,autoComplete:m,inputProps:$,error:""!==L,helperText:L,placeholder:B,className:Q.inputRebase}),z&&Object(O.jsx)("div",{className:"".concat(Q.overlayAction," ").concat(""!==t?"withLabel":""),children:Object(O.jsx)(d.a,{onClick:_?function(){_()}:function(){return null},size:"small",disableFocusRipple:!1,disableRipple:!1,disableTouchRipple:!1,children:z})}),W&&Object(O.jsx)("div",{className:"".concat(Q.overlayAction," ").concat(""!==t?"withLabel":""),children:W})]})]})})}))},400:function(e,t,a){"use strict";var n=a(6),i=a(1),o=a(2),c=a.n(o),r=a(300),l=a(310),s=a(477),d=a(809),b=a(376),j=a(95),u=a(436),p=a(120),h=a(121),O=a(7),m=a(0),x=Object(l.a)((function(e){return{root:{width:50,height:24,padding:0,margin:0},switchBase:{padding:1,"&$checked":{transform:"translateX(24px)",color:e.palette.common.white,"& + $track":{backgroundColor:"#4CCB92",boxShadow:"inset 0px 1px 4px rgba(0,0,0,0.1)",opacity:1,border:"none"}},"&$focusVisible $thumb":{color:"#4CCB92",border:"6px solid #fff"}},thumb:{width:22,height:22,backgroundColor:"#FAFAFA",border:"2px solid #FFFFFF",marginLeft:1},track:{borderRadius:12,backgroundColor:"#E2E2E2",boxShadow:"inset 0px 1px 4px rgba(0,0,0,0.1)",opacity:1,transition:e.transitions.create(["background-color","border"])},checked:{},focusVisible:{},switchContainer:{display:"flex",alignItems:"center",justifyContent:"flex-end"}}}))(s.a);t.a=Object(l.a)((function(e){return Object(r.a)(Object(i.a)(Object(i.a)({divContainer:{marginBottom:20},indicatorLabelOn:{fontWeight:"bold",color:"#081C42 !important"},indicatorLabel:{fontSize:12,color:"#E2E2E2",margin:"0 8px 0 10px"},fieldDescription:{marginTop:4,color:"#999999"},tooltip:{fontSize:16}},p.a),p.i))}))((function(e){var t=e.label,a=void 0===t?"":t,i=e.onChange,o=e.value,r=e.id,l=e.name,s=e.checked,p=void 0!==s&&s,f=e.disabled,g=void 0!==f&&f,v=e.switchOnly,C=void 0!==v&&v,k=e.tooltip,y=void 0===k?"":k,N=e.description,S=void 0===N?"":N,w=e.classes,L=e.indicatorLabels,M=Object(m.jsxs)(c.a.Fragment,{children:[!C&&Object(m.jsx)("span",{className:Object(O.a)(w.indicatorLabel,Object(n.a)({},w.indicatorLabelOn,!p)),children:L&&L.length>1?L[1]:"OFF"}),Object(m.jsx)(x,{checked:p,onChange:i,color:"primary",name:l,inputProps:{"aria-label":"primary checkbox"},disabled:g,disableRipple:!0,disableFocusRipple:!0,disableTouchRipple:!0,value:o}),!C&&Object(m.jsx)("span",{className:Object(O.a)(w.indicatorLabel,Object(n.a)({},w.indicatorLabelOn,p)),children:L?L[0]:"ON"})]});return C?M:Object(m.jsx)("div",{className:w.divContainer,children:Object(m.jsxs)(u.a,{container:!0,alignItems:"center",children:[Object(m.jsx)(u.a,{item:!0,xs:!0,children:Object(m.jsxs)(u.a,{container:!0,children:[Object(m.jsx)(u.a,{item:!0,xs:12,sm:4,md:3,children:""!==a&&Object(m.jsxs)(d.a,{htmlFor:r,className:w.inputLabel,children:[Object(m.jsx)("span",{children:a}),""!==y&&Object(m.jsx)("div",{className:w.tooltipContainer,children:Object(m.jsx)(b.a,{title:y,placement:"top-start",children:Object(m.jsx)("div",{className:w.tooltip,children:Object(m.jsx)(h.a,{})})})})]})}),Object(m.jsx)(u.a,{item:!0,xs:12,sm:!0,textAlign:"left",children:""!==S&&Object(m.jsx)(j.a,{component:"p",className:w.fieldDescription,children:S})})]})}),Object(m.jsx)(u.a,{item:!0,xs:12,sm:2,textAlign:"right",className:w.switchContainer,children:M})]})})}))},435:function(e,t,a){"use strict";var n=a(1),i=a(2),o=a.n(i),c=a(436),r=a(779),l=a(809),s=a(376),d=a(971),b=a(957),j=a(488),u=a(300),p=a(310),h=a(120),O=a(121),m=a(0),x=Object(p.a)((function(e){return Object(u.a)({root:{height:38,lineHeight:1,"label + &":{marginTop:e.spacing(3)}},input:{height:38,position:"relative",color:"#07193E",fontSize:13,fontWeight:600,padding:"8px 20px 10px 10px",border:"#e5e5e5 1px solid",borderRadius:4,display:"flex",alignItems:"center","&:hover":{borderColor:"#393939"},"&:focus":{backgroundColor:"#fff"}}})}))(r.c);t.a=Object(p.a)((function(e){return Object(u.a)(Object(n.a)(Object(n.a)({},h.i),h.D))}))((function(e){var t=e.classes,a=e.id,n=e.name,i=e.onChange,r=e.options,u=e.label,p=e.tooltip,h=void 0===p?"":p,f=e.value,g=e.disabled,v=void 0!==g&&g;return Object(m.jsx)(o.a.Fragment,{children:Object(m.jsxs)(c.a,{item:!0,xs:12,className:t.fieldContainer,children:[""!==u&&Object(m.jsxs)(l.a,{htmlFor:a,className:t.inputLabel,children:[Object(m.jsx)("span",{children:u}),""!==h&&Object(m.jsx)("div",{className:t.tooltipContainer,children:Object(m.jsx)(s.a,{title:h,placement:"top-start",children:Object(m.jsx)("div",{className:t.tooltip,children:Object(m.jsx)(O.a,{})})})})]}),Object(m.jsx)(d.a,{fullWidth:!0,children:Object(m.jsx)(b.a,{id:a,name:n,value:f,onChange:i,input:Object(m.jsx)(x,{}),disabled:v,children:r.map((function(e){return Object(m.jsx)(j.a,{value:e.value,children:e.label},"select-".concat(n,"-").concat(e.label))}))})})]})})}))},460:function(e,t,a){"use strict";var n=a(6),i=a(1),o=(a(2),a(7)),c=a(436),r=a(810),l=a(816),s=a(808),d=a(809),b=a(376),j=a(300),u=a(310),p=a(369),h=a(120),O=a(121),m=a(0),x=Object(p.a)(Object(i.a)({root:{"&:hover":{backgroundColor:"transparent"}}},h.t)),f=function(e){var t=x();return Object(m.jsx)(s.a,Object(i.a)({className:t.root,disableRipple:!0,color:"default",checkedIcon:Object(m.jsx)("span",{className:t.radioSelectedIcon}),icon:Object(m.jsx)("span",{className:t.radioUnselectedIcon})},e))};t.a=Object(u.a)((function(e){return Object(j.a)(Object(i.a)(Object(i.a)(Object(i.a)({},h.i),h.D),{},{optionLabel:{"&.Mui-disabled":{"& .MuiFormControlLabel-label":{color:"#9c9c9c"}},"&:last-child":{marginRight:0},"& .MuiFormControlLabel-label":{fontSize:12,color:"#07193E"}},checkedOption:{"& .MuiFormControlLabel-label":{fontSize:12,color:"#07193E",fontWeight:700}}}))}))((function(e){var t=e.selectorOptions,a=void 0===t?[]:t,i=e.currentSelection,s=e.label,j=e.id,u=e.name,p=e.onChange,h=e.tooltip,x=void 0===h?"":h,g=e.disableOptions,v=void 0!==g&&g,C=e.classes,k=e.displayInColumn,y=void 0!==k&&k;return Object(m.jsxs)(c.a,{container:!0,alignItems:"center",children:[Object(m.jsx)(c.a,{item:!0,xs:!0,children:Object(m.jsxs)(d.a,{htmlFor:j,className:C.inputLabel,children:[Object(m.jsx)("span",{children:s}),""!==x&&Object(m.jsx)("div",{className:C.tooltipContainer,children:Object(m.jsx)(b.a,{title:x,placement:"top-start",children:Object(m.jsx)("div",{children:Object(m.jsx)(O.a,{})})})})]})}),Object(m.jsx)(c.a,{item:!0,xs:!0,className:C.radioOptionsLayout,children:Object(m.jsx)(r.a,{"aria-label":j,id:j,name:u,value:i,onChange:p,row:!y,style:{display:"block",textAlign:"right"},children:a.map((function(e){return Object(m.jsx)(l.a,{value:e.value,control:Object(m.jsx)(f,{}),label:e.label,disabled:v,className:Object(o.a)(C.optionLabel,Object(n.a)({},C.checkedOption,e.value===i))},"rd-".concat(u,"-").concat(e.value))}))})})]})}))},894:function(e,t,a){"use strict";a.r(t);var n=a(15),i=a(1),o=a(2),c=a.n(o),r=a(39),l=a(380),s=a(366),d=a(300),b=a(310),j=a(436),u=a(58),p=a(31),h=a(120),O=a(400),m=a(460),x=a(390),f=a(389),g=a(435),v=a(52),C=a(0),k=Object(r.b)(null,{setModalErrorSnackMessage:p.h});t.default=Object(b.a)((function(e){return Object(d.a)(Object(i.a)({buttonContainer:{textAlign:"right"}},h.p))}))(k((function(e){var t=e.classes,a=e.open,i=e.enabled,r=e.cfg,d=e.selectedBucket,b=e.closeModalAndRefresh,p=e.setModalErrorSnackMessage,h=Object(o.useState)(!1),k=Object(n.a)(h,2),y=k[0],N=k[1],S=Object(o.useState)(!1),w=Object(n.a)(S,2),L=w[0],M=w[1],E=Object(o.useState)("hard"),F=Object(n.a)(E,2),B=F[0],I=F[1],q=Object(o.useState)("1"),D=Object(n.a)(q,2),z=D[0],R=D[1],W=Object(o.useState)("TiB"),A=Object(n.a)(W,2),T=A[0],_=A[1];Object(o.useEffect)((function(){if(i&&(M(!0),r)){I(r.type),R("".concat(r.quota)),_("B");for(var e="B",t=r.quota,a=0;a<u.t.length&&r.quota%Math.pow(1024,a)===0;a++)t=r.quota/Math.pow(1024,a),e=u.t[a];R("".concat(t)),_(e)}}),[i,r]);return Object(C.jsx)(f.a,{modalOpen:a,onClose:function(){b()},title:"Enable Bucket Quota",children:Object(C.jsx)("form",{noValidate:!0,autoComplete:"off",onSubmit:function(e){!function(e){if(e.preventDefault(),!y){var t={enabled:L,amount:parseInt(Object(u.i)(z,T,!1)),quota_type:B};v.a.invoke("PUT","/api/v1/buckets/".concat(d,"/quota"),t).then((function(){N(!1),b()})).catch((function(e){N(!1),p(e)}))}}(e)},children:Object(C.jsxs)(j.a,{container:!0,children:[Object(C.jsxs)(j.a,{item:!0,xs:12,className:t.formScrollable,children:[Object(C.jsx)(j.a,{item:!0,xs:12,children:Object(C.jsx)(O.a,{value:"bucket_quota",id:"bucket_quota",name:"bucket_quota",checked:L,onChange:function(e){M(e.target.checked)},label:"Quota"})}),L&&Object(C.jsxs)(c.a.Fragment,{children:[Object(C.jsx)(j.a,{item:!0,xs:12,children:Object(C.jsx)(m.a,{currentSelection:B,id:"quota_type",name:"quota_type",label:"Quota Type",onChange:function(e){I(e.target.value)},selectorOptions:[{value:"hard",label:"Hard"},{value:"fifo",label:"FIFO"}]})}),Object(C.jsx)(j.a,{item:!0,xs:12,children:Object(C.jsxs)(j.a,{container:!0,children:[Object(C.jsx)(j.a,{item:!0,xs:10,children:Object(C.jsx)(x.a,{type:"number",id:"quota_size",name:"quota_size",onChange:function(e){R(e.target.value)},label:"Quota",value:z,required:!0,min:"1"})}),Object(C.jsx)(j.a,{item:!0,xs:2,children:Object(C.jsx)("div",{style:{width:100},children:Object(C.jsx)(g.a,{label:"",id:"quota_unit",name:"quota_unit",value:T,onChange:function(e){_(e.target.value)},options:Object(u.g)()})})})]})})]}),Object(C.jsx)(j.a,{item:!0,xs:12,children:Object(C.jsx)("br",{})})]}),Object(C.jsx)(j.a,{item:!0,xs:12,className:t.buttonContainer,children:Object(C.jsx)(l.a,{type:"submit",variant:"contained",color:"primary",disabled:y,children:"Save"})}),y&&Object(C.jsx)(j.a,{item:!0,xs:12,children:Object(C.jsx)(s.a,{})})]})})})})))}}]);
//# sourceMappingURL=93.7bc300b0.chunk.js.map