(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[129],{398:function(e,t,a){"use strict";var n,r=a(16),s=a(1),c=a(2),o=a(40),i=a(387),l=a(380),d=a(413),b=a(414),j=a(415),u=a(307),m=a(319),p=a(122),O=a(32),f=a(48),h=a.n(f),g=a(129),x=a.n(g),C=a(128),v=a.n(C),k=a(125),y=a.n(k),S=a(0),N=function(){clearInterval(n)},E={displayErrorMessage:O.h},M=Object(o.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),E)(Object(m.a)((function(e){return Object(u.a)({modalErrorContainer:{position:"absolute",marginTop:10,width:"80%",backgroundColor:"#fff",border:"#C72C48 1px solid",borderLeftWidth:12,borderRadius:3,zIndex:1e3,padding:"10px 15px",left:"50%",transform:"translateX(-50%)",opacity:0,transitionDuration:"0.2s"},modalErrorShow:{opacity:1},closeButton:{position:"absolute",right:5,fontSize:"small",border:0,backgroundColor:"#fff",cursor:"pointer"},errorTitle:{display:"flex",alignItems:"center"},errorLabel:{color:"#000",fontSize:18,fontWeight:500,marginLeft:5,marginRight:25},messageIcon:{color:"#C72C48",display:"flex","& svg":{width:32,height:32}},detailsButton:{color:"#9C9C9C",display:"flex",alignItems:"center",border:0,backgroundColor:"transparent",paddingLeft:5,fontSize:14,transformDuration:"0.3s",cursor:"pointer"},extraDetailsContainer:{fontStyle:"italic",color:"#9C9C9C",lineHeight:0,padding:"0 10px",transition:"all .2s ease-in-out",overflow:"hidden"},extraDetailsOpen:{lineHeight:1,padding:"3px 10px"},arrowElement:{marginLeft:-5},arrowOpen:{transform:"rotateZ(90deg)",transformDuration:"0.3s"}})}))((function(e){var t=e.classes,a=e.modalSnackMessage,s=e.displayErrorMessage,o=e.customStyle,i=Object(c.useState)(!1),l=Object(r.a)(i,2),d=l[0],b=l[1],j=Object(c.useState)(!1),u=Object(r.a)(j,2),m=u[0],p=u[1],O=Object(c.useCallback)((function(){p(!1)}),[]);Object(c.useEffect)((function(){m||(s({detailedError:"",errorMessage:""}),b(!1))}),[s,m]),Object(c.useEffect)((function(){""!==a.message&&"error"===a.type&&p(!0)}),[O,a.message,a.type]);var f=h()(a,"message",""),g=h()(a,"detailedErrorMsg","");return"error"!==a.type||""===f?null:Object(S.jsx)(c.Fragment,{children:Object(S.jsxs)("div",{className:"".concat(t.modalErrorContainer," ").concat(m?t.modalErrorShow:""),style:o,onMouseOver:N,onMouseLeave:function(){n=setInterval(O,1e4)},children:[Object(S.jsx)("button",{className:t.closeButton,onClick:O,children:Object(S.jsx)(y.a,{})}),Object(S.jsxs)("div",{className:t.errorTitle,children:[Object(S.jsx)("span",{className:t.messageIcon,children:Object(S.jsx)(v.a,{})}),Object(S.jsx)("span",{className:t.errorLabel,children:f})]}),""!==g&&Object(S.jsxs)(c.Fragment,{children:[Object(S.jsx)("div",{className:t.detailsContainerLink,children:Object(S.jsxs)("button",{className:t.detailsButton,onClick:function(){b(!d)},children:["Details",Object(S.jsx)(x.a,{className:"".concat(t.arrowElement," ").concat(d?t.arrowOpen:"")})]})}),Object(S.jsx)("div",{className:"".concat(t.extraDetailsContainer," ").concat(d?t.extraDetailsOpen:""),children:g})]})]})})}))),w=Object(o.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),{setModalSnackMessage:O.i});t.a=Object(m.a)((function(e){return Object(u.a)(Object(s.a)(Object(s.a)({},p.h),{},{root:{"& .MuiPaper-root":{padding:"1rem 2rem 2rem 1rem"}},content:{padding:25,paddingBottom:0},customDialogSize:{width:"100%",maxWidth:765}},p.z))}))(w((function(e){var t=e.onClose,a=e.modalOpen,n=e.title,o=e.children,u=e.classes,m=e.wideLimit,p=void 0===m||m,O=e.modalSnackMessage,f=e.noContentPadding,h=e.setModalSnackMessage,g=Object(c.useState)(!1),x=Object(r.a)(g,2),C=x[0],v=x[1];Object(c.useEffect)((function(){h("")}),[h]),Object(c.useEffect)((function(){if(O){if(""===O.message)return void v(!1);"error"!==O.type&&v(!0)}}),[O]);var k=p?{classes:{paper:u.customDialogSize}}:{maxWidth:"lg",fullWidth:!0},N="";return O&&(N=O.detailedErrorMsg,(""===O.detailedErrorMsg||O.detailedErrorMsg.length<5)&&(N=O.message)),Object(S.jsxs)(d.a,Object(s.a)(Object(s.a)({open:a,classes:u},k),{},{scroll:"paper",onClose:function(e,a){"backdropClick"!==a&&t()},className:u.root,children:[Object(S.jsxs)(b.a,{className:u.title,children:[Object(S.jsx)("div",{className:u.titleText,children:n}),Object(S.jsx)("div",{className:u.closeContainer,children:Object(S.jsx)(i.a,{"aria-label":"close",className:u.closeButton,onClick:t,disableRipple:!0,size:"small",children:Object(S.jsx)(y.a,{})})})]}),Object(S.jsx)(M,{}),Object(S.jsx)(l.a,{open:C,className:u.snackBarModal,onClose:function(){v(!1),h("")},message:N,ContentProps:{className:"".concat(u.snackBar," ").concat(O&&"error"===O.type?u.errorSnackBar:"")},autoHideDuration:O&&"error"===O.type?1e4:5e3}),Object(S.jsx)(j.a,{className:f?"":u.content,children:o})]}))})))},440:function(e,t,a){"use strict";var n=a(1),r=a(2),s=a.n(r),c=a(443),o=a(788),i=a(821),l=a(384),d=a(982),b=a(971),j=a(494),u=a(307),m=a(319),p=a(122),O=a(123),f=a(0),h=Object(m.a)((function(e){return Object(u.a)({root:{height:38,lineHeight:1,"label + &":{marginTop:e.spacing(3)}},input:{height:38,position:"relative",color:"#07193E",fontSize:13,fontWeight:600,padding:"8px 20px 10px 10px",border:"#e5e5e5 1px solid",borderRadius:4,display:"flex",alignItems:"center","&:hover":{borderColor:"#393939"},"&:focus":{backgroundColor:"#fff"}}})}))(o.c);t.a=Object(m.a)((function(e){return Object(u.a)(Object(n.a)(Object(n.a)({},p.i),p.E))}))((function(e){var t=e.classes,a=e.id,n=e.name,r=e.onChange,o=e.options,u=e.label,m=e.tooltip,p=void 0===m?"":m,g=e.value,x=e.disabled,C=void 0!==x&&x;return Object(f.jsx)(s.a.Fragment,{children:Object(f.jsxs)(c.a,{item:!0,xs:12,className:t.fieldContainer,children:[""!==u&&Object(f.jsxs)(i.a,{htmlFor:a,className:t.inputLabel,children:[Object(f.jsx)("span",{children:u}),""!==p&&Object(f.jsx)("div",{className:t.tooltipContainer,children:Object(f.jsx)(l.a,{title:p,placement:"top-start",children:Object(f.jsx)("div",{className:t.tooltip,children:Object(f.jsx)(O.a,{})})})})]}),Object(f.jsx)(d.a,{fullWidth:!0,children:Object(f.jsx)(b.a,{id:a,name:n,value:g,onChange:r,input:Object(f.jsx)(h,{}),disabled:C,children:o.map((function(e){return Object(f.jsx)(j.a,{value:e.value,children:e.label},"select-".concat(n,"-").concat(e.label))}))})})]})})}))},899:function(e,t,a){"use strict";a.r(t);var n=a(16),r=a(1),s=a(2),c=a.n(s),o=a(398),i=a(443),l=a(385),d=a(307),b=a(319),j=a(122),u=a(40),m=a(52),p=a(32),O=a(440),f=a(0),h=Object(u.b)((function(e){return{session:e.console.session}}),{setErrorSnackMessage:p.e});t.default=Object(b.a)((function(e){return Object(d.a)(Object(r.a)({buttonContainer:{textAlign:"right"}},j.p))}))(h((function(e){var t=e.modalOpen,a=e.onClose,r=e.classes,d=e.bucket,b=e.toEdit,j=e.initial,u=Object(s.useState)(j),h=Object(n.a)(u,2),g=h[0],x=h[1];return Object(f.jsx)(c.a.Fragment,{children:Object(f.jsx)(o.a,{modalOpen:t,title:"Edit Access Rule for ".concat(b),onClose:a,children:Object(f.jsxs)(i.a,{container:!0,children:[Object(f.jsx)(i.a,{item:!0,xs:12,children:Object(f.jsx)(O.a,{id:"access",name:"Access",onChange:function(e){x(e.target.value)},label:"Access",value:g,options:[{label:"readonly",value:"readonly"},{label:"writeonly",value:"writeonly"},{label:"readwrite",value:"readwrite"}],disabled:!1})}),Object(f.jsxs)(i.a,{item:!0,xs:12,className:r.buttonContainer,children:[Object(f.jsx)("button",{type:"button",color:"primary",className:r.clearButton,onClick:function(){x(j)},children:"Clear"}),Object(f.jsx)(l.a,{type:"submit",variant:"contained",color:"primary",onClick:function(){m.a.invoke("PUT","/api/v1/bucket/".concat(d,"/access-rules"),{prefix:b,access:g}).then((function(e){a()})).catch((function(e){Object(p.e)(e),a()}))},children:"Save"})]})]})})})})))}}]);
//# sourceMappingURL=129.b407960e.chunk.js.map