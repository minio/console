(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[92],{389:function(e,t,a){"use strict";var n,c=a(15),i=a(1),r=a(2),o=a(39),s=a(378),l=a(372),d=a(406),b=a(407),j=a(408),u=a(300),h=a(310),O=a(120),p=a(31),x=a(46),m=a.n(x),g=a(127),f=a.n(g),v=a(126),C=a.n(v),y=a(123),S=a.n(y),k=a(0),N=function(){clearInterval(n)},w={displayErrorMessage:p.h},E=Object(o.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),w)(Object(h.a)((function(e){return Object(u.a)({modalErrorContainer:{position:"absolute",marginTop:10,width:"80%",backgroundColor:"#fff",border:"#C72C48 1px solid",borderLeftWidth:12,borderRadius:3,zIndex:1e3,padding:"10px 15px",left:"50%",transform:"translateX(-50%)",opacity:0,transitionDuration:"0.2s"},modalErrorShow:{opacity:1},closeButton:{position:"absolute",right:5,fontSize:"small",border:0,backgroundColor:"#fff",cursor:"pointer"},errorTitle:{display:"flex",alignItems:"center"},errorLabel:{color:"#000",fontSize:18,fontWeight:500,marginLeft:5,marginRight:25},messageIcon:{color:"#C72C48",display:"flex","& svg":{width:32,height:32}},detailsButton:{color:"#9C9C9C",display:"flex",alignItems:"center",border:0,backgroundColor:"transparent",paddingLeft:5,fontSize:14,transformDuration:"0.3s",cursor:"pointer"},extraDetailsContainer:{fontStyle:"italic",color:"#9C9C9C",lineHeight:0,padding:"0 10px",transition:"all .2s ease-in-out",overflow:"hidden"},extraDetailsOpen:{lineHeight:1,padding:"3px 10px"},arrowElement:{marginLeft:-5},arrowOpen:{transform:"rotateZ(90deg)",transformDuration:"0.3s"}})}))((function(e){var t=e.classes,a=e.modalSnackMessage,i=e.displayErrorMessage,o=e.customStyle,s=Object(r.useState)(!1),l=Object(c.a)(s,2),d=l[0],b=l[1],j=Object(r.useState)(!1),u=Object(c.a)(j,2),h=u[0],O=u[1],p=Object(r.useCallback)((function(){O(!1)}),[]);Object(r.useEffect)((function(){h||(i({detailedError:"",errorMessage:""}),b(!1))}),[i,h]),Object(r.useEffect)((function(){""!==a.message&&"error"===a.type&&O(!0)}),[p,a.message,a.type]);var x=m()(a,"message",""),g=m()(a,"detailedErrorMsg","");return"error"!==a.type||""===x?null:Object(k.jsx)(r.Fragment,{children:Object(k.jsxs)("div",{className:"".concat(t.modalErrorContainer," ").concat(h?t.modalErrorShow:""),style:o,onMouseOver:N,onMouseLeave:function(){n=setInterval(p,1e4)},children:[Object(k.jsx)("button",{className:t.closeButton,onClick:p,children:Object(k.jsx)(S.a,{})}),Object(k.jsxs)("div",{className:t.errorTitle,children:[Object(k.jsx)("span",{className:t.messageIcon,children:Object(k.jsx)(C.a,{})}),Object(k.jsx)("span",{className:t.errorLabel,children:x})]}),""!==g&&Object(k.jsxs)(r.Fragment,{children:[Object(k.jsx)("div",{className:t.detailsContainerLink,children:Object(k.jsxs)("button",{className:t.detailsButton,onClick:function(){b(!d)},children:["Details",Object(k.jsx)(f.a,{className:"".concat(t.arrowElement," ").concat(d?t.arrowOpen:"")})]})}),Object(k.jsx)("div",{className:"".concat(t.extraDetailsContainer," ").concat(d?t.extraDetailsOpen:""),children:g})]})]})})}))),L={content:'" "',borderLeft:"2px solid #9C9C9C",height:33,width:1,position:"absolute"},M=Object(o.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),{setModalSnackMessage:p.i});t.a=Object(h.a)((function(e){return Object(u.a)(Object(i.a)({dialogContainer:{padding:"8px 15px 22px"},closeContainer:{textAlign:"right"},closeButton:{height:16,width:16,padding:0,backgroundColor:"initial","&:hover":{backgroundColor:"initial"},"&:active":{backgroundColor:"initial"}},closeIcon:{"&::before":Object(i.a)(Object(i.a)({},L),{},{transform:"rotate(45deg)",height:12}),"&::after":Object(i.a)(Object(i.a)({},L),{},{transform:"rotate(-45deg)",height:12}),"&:hover::before, &:hover::after":{borderColor:"#9C9C9C"},display:"block",position:"relative",height:12,width:12},titleClass:{padding:"0px 50px 12px",fontSize:"1.2rem",fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"},modalContent:{padding:"0 50px"},customDialogSize:{width:"100%",maxWidth:765}},O.y))}))(M((function(e){var t=e.onClose,a=e.modalOpen,n=e.title,o=e.children,u=e.classes,h=e.wideLimit,O=void 0===h||h,p=e.modalSnackMessage,x=e.noContentPadding,m=e.setModalSnackMessage,g=Object(r.useState)(!1),f=Object(c.a)(g,2),v=f[0],C=f[1];Object(r.useEffect)((function(){m("")}),[m]),Object(r.useEffect)((function(){if(p){if(""===p.message)return void C(!1);"error"!==p.type&&C(!0)}}),[p]);var y=O?{classes:{paper:u.customDialogSize}}:{maxWidth:"lg",fullWidth:!0},S="";return p&&(S=p.detailedErrorMsg,(""===p.detailedErrorMsg||p.detailedErrorMsg.length<5)&&(S=p.message)),Object(k.jsx)(d.a,Object(i.a)(Object(i.a)({open:a,onClose:t,"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description"},y),{},{children:Object(k.jsxs)("div",{className:u.dialogContainer,children:[Object(k.jsx)(E,{}),Object(k.jsx)(l.a,{open:v,className:u.snackBarModal,onClose:function(){C(!1),m("")},message:S,ContentProps:{className:"".concat(u.snackBar," ").concat(p&&"error"===p.type?u.errorSnackBar:"")},autoHideDuration:p&&"error"===p.type?1e4:5e3}),Object(k.jsx)("div",{className:u.closeContainer,children:Object(k.jsx)(s.a,{"aria-label":"close",className:u.closeButton,onClick:t,disableRipple:!0,size:"large",children:Object(k.jsx)("span",{className:u.closeIcon})})}),Object(k.jsx)(b.a,{id:"alert-dialog-title",className:u.titleClass,children:n}),Object(k.jsx)(j.a,{className:x?"":u.modalContent,children:o})]})}))})))},390:function(e,t,a){"use strict";var n=a(1),c=a(2),i=a.n(c),r=a(415),o=a(436),s=a(809),l=a(376),d=a(378),b=a(300),j=a(369),u=a(310),h=a(120),O=a(121),p=a(0),x=Object(j.a)((function(e){return Object(b.a)(Object(n.a)({},h.n))}));function m(e){var t=x();return Object(p.jsx)(r.a,Object(n.a)({InputProps:{classes:t}},e))}t.a=Object(u.a)((function(e){return Object(b.a)(Object(n.a)(Object(n.a)(Object(n.a)({},h.i),h.D),{},{textBoxContainer:{flexGrow:1,position:"relative"},overlayAction:{position:"absolute",right:5,top:6,"& svg":{maxWidth:15,maxHeight:15},"&.withLabel":{top:5}}}))}))((function(e){var t=e.label,a=e.onChange,c=e.value,r=e.id,b=e.name,j=e.type,u=void 0===j?"text":j,h=e.autoComplete,x=void 0===h?"off":h,g=e.disabled,f=void 0!==g&&g,v=e.multiline,C=void 0!==v&&v,y=e.tooltip,S=void 0===y?"":y,k=e.index,N=void 0===k?0:k,w=e.error,E=void 0===w?"":w,L=e.required,M=void 0!==L&&L,D=e.placeholder,B=void 0===D?"":D,R=e.min,F=e.max,I=e.overlayIcon,A=void 0===I?null:I,T=e.overlayObject,W=void 0===T?null:T,z=e.extraInputProps,P=void 0===z?{}:z,K=e.overlayAction,U=e.noLabelMinWidth,_=void 0!==U&&U,H=e.classes,V=Object(n.a)({"data-index":N},P);return"number"===u&&R&&(V.min=R),"number"===u&&F&&(V.max=F),Object(p.jsx)(i.a.Fragment,{children:Object(p.jsxs)(o.a,{container:!0,className:" ".concat(""!==E?H.errorInField:H.inputBoxContainer),children:[""!==t&&Object(p.jsxs)(s.a,{htmlFor:r,className:_?H.noMinWidthLabel:H.inputLabel,children:[Object(p.jsxs)("span",{children:[t,M?"*":""]}),""!==S&&Object(p.jsx)("div",{className:H.tooltipContainer,children:Object(p.jsx)(l.a,{title:S,placement:"top-start",children:Object(p.jsx)("div",{className:H.tooltip,children:Object(p.jsx)(O.a,{})})})})]}),Object(p.jsxs)("div",{className:H.textBoxContainer,children:[Object(p.jsx)(m,{id:r,name:b,fullWidth:!0,value:c,disabled:f,onChange:a,type:u,multiline:C,autoComplete:x,inputProps:V,error:""!==E,helperText:E,placeholder:B,className:H.inputRebase}),A&&Object(p.jsx)("div",{className:"".concat(H.overlayAction," ").concat(""!==t?"withLabel":""),children:Object(p.jsx)(d.a,{onClick:K?function(){K()}:function(){return null},size:"small",disableFocusRipple:!1,disableRipple:!1,disableTouchRipple:!1,children:A})}),W&&Object(p.jsx)("div",{className:"".concat(H.overlayAction," ").concat(""!==t?"withLabel":""),children:W})]})]})})}))},400:function(e,t,a){"use strict";var n=a(6),c=a(1),i=a(2),r=a.n(i),o=a(300),s=a(310),l=a(477),d=a(809),b=a(376),j=a(95),u=a(436),h=a(120),O=a(121),p=a(7),x=a(0),m=Object(s.a)((function(e){return{root:{width:50,height:24,padding:0,margin:0},switchBase:{padding:1,"&$checked":{transform:"translateX(24px)",color:e.palette.common.white,"& + $track":{backgroundColor:"#4CCB92",boxShadow:"inset 0px 1px 4px rgba(0,0,0,0.1)",opacity:1,border:"none"}},"&$focusVisible $thumb":{color:"#4CCB92",border:"6px solid #fff"}},thumb:{width:22,height:22,backgroundColor:"#FAFAFA",border:"2px solid #FFFFFF",marginLeft:1},track:{borderRadius:12,backgroundColor:"#E2E2E2",boxShadow:"inset 0px 1px 4px rgba(0,0,0,0.1)",opacity:1,transition:e.transitions.create(["background-color","border"])},checked:{},focusVisible:{},switchContainer:{display:"flex",alignItems:"center",justifyContent:"flex-end"}}}))(l.a);t.a=Object(s.a)((function(e){return Object(o.a)(Object(c.a)(Object(c.a)({divContainer:{marginBottom:20},indicatorLabelOn:{fontWeight:"bold",color:"#081C42 !important"},indicatorLabel:{fontSize:12,color:"#E2E2E2",margin:"0 8px 0 10px"},fieldDescription:{marginTop:4,color:"#999999"},tooltip:{fontSize:16}},h.a),h.i))}))((function(e){var t=e.label,a=void 0===t?"":t,c=e.onChange,i=e.value,o=e.id,s=e.name,l=e.checked,h=void 0!==l&&l,g=e.disabled,f=void 0!==g&&g,v=e.switchOnly,C=void 0!==v&&v,y=e.tooltip,S=void 0===y?"":y,k=e.description,N=void 0===k?"":k,w=e.classes,E=e.indicatorLabels,L=Object(x.jsxs)(r.a.Fragment,{children:[!C&&Object(x.jsx)("span",{className:Object(p.a)(w.indicatorLabel,Object(n.a)({},w.indicatorLabelOn,!h)),children:E&&E.length>1?E[1]:"OFF"}),Object(x.jsx)(m,{checked:h,onChange:c,color:"primary",name:s,inputProps:{"aria-label":"primary checkbox"},disabled:f,disableRipple:!0,disableFocusRipple:!0,disableTouchRipple:!0,value:i}),!C&&Object(x.jsx)("span",{className:Object(p.a)(w.indicatorLabel,Object(n.a)({},w.indicatorLabelOn,h)),children:E?E[0]:"ON"})]});return C?L:Object(x.jsx)("div",{className:w.divContainer,children:Object(x.jsxs)(u.a,{container:!0,alignItems:"center",children:[Object(x.jsx)(u.a,{item:!0,xs:!0,children:Object(x.jsxs)(u.a,{container:!0,children:[Object(x.jsx)(u.a,{item:!0,xs:12,sm:4,md:3,children:""!==a&&Object(x.jsxs)(d.a,{htmlFor:o,className:w.inputLabel,children:[Object(x.jsx)("span",{children:a}),""!==S&&Object(x.jsx)("div",{className:w.tooltipContainer,children:Object(x.jsx)(b.a,{title:S,placement:"top-start",children:Object(x.jsx)("div",{className:w.tooltip,children:Object(x.jsx)(O.a,{})})})})]})}),Object(x.jsx)(u.a,{item:!0,xs:12,sm:!0,textAlign:"left",children:""!==N&&Object(x.jsx)(j.a,{component:"p",className:w.fieldDescription,children:N})})]})}),Object(x.jsx)(u.a,{item:!0,xs:12,sm:2,textAlign:"right",className:w.switchContainer,children:L})]})})}))},435:function(e,t,a){"use strict";var n=a(1),c=a(2),i=a.n(c),r=a(436),o=a(779),s=a(809),l=a(376),d=a(971),b=a(957),j=a(488),u=a(300),h=a(310),O=a(120),p=a(121),x=a(0),m=Object(h.a)((function(e){return Object(u.a)({root:{height:38,lineHeight:1,"label + &":{marginTop:e.spacing(3)}},input:{height:38,position:"relative",color:"#07193E",fontSize:13,fontWeight:600,padding:"8px 20px 10px 10px",border:"#e5e5e5 1px solid",borderRadius:4,display:"flex",alignItems:"center","&:hover":{borderColor:"#393939"},"&:focus":{backgroundColor:"#fff"}}})}))(o.c);t.a=Object(h.a)((function(e){return Object(u.a)(Object(n.a)(Object(n.a)({},O.i),O.D))}))((function(e){var t=e.classes,a=e.id,n=e.name,c=e.onChange,o=e.options,u=e.label,h=e.tooltip,O=void 0===h?"":h,g=e.value,f=e.disabled,v=void 0!==f&&f;return Object(x.jsx)(i.a.Fragment,{children:Object(x.jsxs)(r.a,{item:!0,xs:12,className:t.fieldContainer,children:[""!==u&&Object(x.jsxs)(s.a,{htmlFor:a,className:t.inputLabel,children:[Object(x.jsx)("span",{children:u}),""!==O&&Object(x.jsx)("div",{className:t.tooltipContainer,children:Object(x.jsx)(l.a,{title:O,placement:"top-start",children:Object(x.jsx)("div",{className:t.tooltip,children:Object(x.jsx)(p.a,{})})})})]}),Object(x.jsx)(d.a,{fullWidth:!0,children:Object(x.jsx)(b.a,{id:a,name:n,value:g,onChange:c,input:Object(x.jsx)(m,{}),disabled:v,children:o.map((function(e){return Object(x.jsx)(j.a,{value:e.value,children:e.label},"select-".concat(n,"-").concat(e.label))}))})})]})})}))},741:function(e,t,a){"use strict";var n=a(14),c=a(15),i=a(1),r=a(2),o=a.n(r),s=a(46),l=a.n(s),d=a(458),b=a.n(d),j=a(300),u=a(310),h=a(436),O=a(774),p=a.n(O),x=a(809),m=a(376),g=a(120),f=a(390),v=a(135),C=a(0);t.a=Object(u.a)((function(e){return Object(j.a)(Object(i.a)(Object(i.a)(Object(i.a)({},g.i),g.D),{},{inputWithBorder:{border:"1px solid #EAEAEA",padding:15,height:150,overflowY:"auto",position:"relative",marginTop:15},lineInputBoxes:{display:"flex"},queryDiv:{alignSelf:"center",margin:"0 4px",fontWeight:600}}))}))((function(e){var t=e.elements,a=e.name,i=e.label,s=e.tooltip,d=void 0===s?"":s,j=e.keyPlaceholder,u=void 0===j?"":j,O=e.valuePlaceholder,g=void 0===O?"":O,y=e.onChange,S=e.withBorder,k=void 0!==S&&S,N=e.classes,w=Object(r.useState)([""]),E=Object(c.a)(w,2),L=E[0],M=E[1],D=Object(r.useState)([""]),B=Object(c.a)(D,2),R=B[0],F=B[1],I=Object(r.createRef)();Object(r.useEffect)((function(){if(1===L.length&&""===L[0]&&1===R.length&&""===R[0]&&t&&""!==t){var e=t.split("&"),a=[],n=[];e.forEach((function(e){var t=e.split("=");2===t.length&&(a.push(t[0]),n.push(t[1]))})),a.push(""),n.push(""),M(a),F(n)}}),[L,R,t]),Object(r.useEffect)((function(){var e=I.current;e&&L.length>1&&e.scrollIntoView(!1)}),[L]);var A=Object(r.useRef)(!0);Object(r.useLayoutEffect)((function(){A.current?A.current=!1:z()}),[L,R]);var T=function(e){e.persist();var t=Object(n.a)(L);t[l()(e.target,"dataset.index",0)]=e.target.value,M(t)},W=function(e){e.persist();var t=Object(n.a)(R);t[l()(e.target,"dataset.index",0)]=e.target.value,F(t)},z=b()((function(){var e="";L.forEach((function(t,a){if(L[a]&&R[a]){var n="".concat(t,"=").concat(R[a]);0!==a&&(n="&".concat(n)),e="".concat(e).concat(n)}})),y(e)}),500),P=R.map((function(e,t){return Object(C.jsxs)(h.a,{item:!0,xs:12,className:N.lineInputBoxes,children:[Object(C.jsx)(f.a,{id:"".concat(a,"-key-").concat(t.toString()),label:"",name:"".concat(a,"-").concat(t.toString()),value:L[t],onChange:T,index:t,placeholder:u}),Object(C.jsx)("span",{className:N.queryDiv,children:":"}),Object(C.jsx)(f.a,{id:"".concat(a,"-value-").concat(t.toString()),label:"",name:"".concat(a,"-").concat(t.toString()),value:R[t],onChange:W,index:t,placeholder:g,overlayIcon:t===R.length-1?Object(C.jsx)(v.a,{}):null,overlayAction:function(){!function(){if(""!==L[L.length-1].trim()&&""!==R[R.length-1].trim()){var e=Object(n.a)(L),t=Object(n.a)(R);e.push(""),t.push(""),M(e),F(t)}}()}})]},"query-pair-".concat(a,"-").concat(t.toString()))}));return Object(C.jsx)(o.a.Fragment,{children:Object(C.jsxs)(h.a,{item:!0,xs:12,className:N.fieldContainer,children:[Object(C.jsxs)(x.a,{className:N.inputLabel,children:[Object(C.jsx)("span",{children:i}),""!==d&&Object(C.jsx)("div",{className:N.tooltipContainer,children:Object(C.jsx)(m.a,{title:d,placement:"top-start",children:Object(C.jsx)(p.a,{className:N.tooltip})})})]}),Object(C.jsxs)(h.a,{item:!0,xs:12,className:"".concat(k?N.inputWithBorder:""),children:[P,Object(C.jsx)("div",{ref:I})]})]})})}))},896:function(e,t,a){"use strict";a.r(t);var n=a(15),c=a(1),i=a(2),r=a(39),o=a(300),s=a(310),l=a(380),d=a(366),b=a(46),j=a.n(b),u=a(436),h=a(120),O=a(31),p=a(390),x=a(389),m=a(52),g=a(435),f=a(400),v=a(58),C=a(741),y=a(0),S=Object(r.b)(null,{setModalErrorSnackMessage:O.h});t.default=Object(s.a)((function(e){return Object(o.a)(Object(c.a)({buttonContainer:{textAlign:"right"},multiContainer:{display:"flex",alignItems:"center",justifyContent:"flex-start"}},h.p))}))(S((function(e){var t=e.open,a=e.closeModalAndRefresh,c=e.classes,r=e.bucketName,o=e.setModalErrorSnackMessage,s=Object(i.useState)(!1),b=Object(n.a)(s,2),h=b[0],O=b[1],S=Object(i.useState)(""),k=Object(n.a)(S,2),N=k[0],w=k[1],E=Object(i.useState)(""),L=Object(n.a)(E,2),M=L[0],D=L[1],B=Object(i.useState)(""),R=Object(n.a)(B,2),F=R[0],I=R[1],A=Object(i.useState)(""),T=Object(n.a)(A,2),W=T[0],z=T[1],P=Object(i.useState)(""),K=Object(n.a)(P,2),U=K[0],_=K[1],H=Object(i.useState)(""),V=Object(n.a)(H,2),q=V[0],$=V[1],G=Object(i.useState)(""),J=Object(n.a)(G,2),X=J[0],Y=J[1],Z=Object(i.useState)(!0),Q=Object(n.a)(Z,2),ee=Q[0],te=Q[1],ae=Object(i.useState)(!0),ne=Object(n.a)(ae,2),ce=ne[0],ie=ne[1],re=Object(i.useState)(!0),oe=Object(n.a)(re,2),se=oe[0],le=oe[1],de=Object(i.useState)(""),be=Object(n.a)(de,2),je=be[0],ue=be[1],he=Object(i.useState)("async"),Oe=Object(n.a)(he,2),pe=Oe[0],xe=Oe[1],me=Object(i.useState)("100"),ge=Object(n.a)(me,2),fe=ge[0],ve=ge[1],Ce=Object(i.useState)("Gi"),ye=Object(n.a)(Ce,2),Se=ye[0],ke=ye[1],Ne=Object(i.useState)("60"),we=Object(n.a)(Ne,2),Ee=we[0],Le=we[1];return Object(y.jsx)(x.a,{modalOpen:t,onClose:function(){a()},title:"Set Bucket Replication",children:Object(y.jsx)("form",{noValidate:!0,autoComplete:"off",onSubmit:function(e){e.preventDefault(),O(!0),function(){var e=[{originBucket:r,destinationBucket:q}],t=parseInt(Ee),n="".concat(ee?"https://":"http://").concat(F),c={accessKey:N,secretKey:M,targetURL:n,region:X,bucketsRelation:e,syncMode:pe,bandwidth:"async"===pe?parseInt(Object(v.i)(fe,Se,!0)):0,healthCheckPeriod:t,prefix:U,tags:je,replicateDeleteMarkers:ce,replicateDeletes:se};m.a.invoke("POST","/api/v1/buckets-replication",c).then((function(e){O(!1);var t=j()(e,"replicationState",[]);if(t.length>0){var n=t[0];return O(!1),n.errorString&&""!==n.errorString?void o({errorMessage:n.errorString,detailedError:""}):void a()}o({errorMessage:"No changes applied",detailedError:""})})).catch((function(e){O(!1),o(e)}))}()},children:Object(y.jsxs)(u.a,{container:!0,children:[Object(y.jsxs)(u.a,{item:!0,xs:12,className:c.formScrollable,children:[Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(p.a,{id:"targetURL",name:"targetURL",onChange:function(e){I(e.target.value)},placeholder:"play.min.io",label:"Target URL",value:F})}),Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(f.a,{checked:ee,id:"useTLS",name:"useTLS",label:"Use TLS",onChange:function(e){te(e.target.checked)},value:"yes"})}),Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(p.a,{id:"accessKey",name:"accessKey",onChange:function(e){w(e.target.value)},label:"Access Key",value:N})}),Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(p.a,{id:"secretKey",name:"secretKey",onChange:function(e){D(e.target.value)},label:"Secret Key",value:M})}),Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(p.a,{id:"targetBucket",name:"targetBucket",onChange:function(e){$(e.target.value)},label:"Target Bucket",value:q})}),Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(p.a,{id:"region",name:"region",onChange:function(e){Y(e.target.value)},label:"Region",value:X})}),Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(g.a,{id:"replication_mode",name:"replication_mode",onChange:function(e){xe(e.target.value)},label:"Replication Mode",value:pe,options:[{label:"Asynchronous",value:"async"},{label:"Synchronous",value:"sync"}]})}),"async"===pe&&Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsxs)("div",{className:c.multiContainer,children:[Object(y.jsx)("div",{children:Object(y.jsx)(p.a,{type:"number",id:"bandwidth_scalar",name:"bandwidth_scalar",onChange:function(e){ve(e.target.value)},label:"Bandwidth",value:fe,min:"0"})}),Object(y.jsx)("div",{className:c.sizeFactorContainer,children:Object(y.jsx)(g.a,{label:"Unit",id:"bandwidth_unit",name:"bandwidth_unit",value:Se,onChange:function(e){ke(e.target.value)},options:Object(v.k)()})})]})}),Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(p.a,{id:"healthCheck",name:"healthCheck",onChange:function(e){Le(e.target.value)},label:"Health Check Duration",value:Ee})}),Object(y.jsx)("h3",{children:"Object Filters"}),Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(p.a,{id:"prefix",name:"prefix",onChange:function(e){_(e.target.value)},placeholder:"prefix",label:"Prefix",value:U})}),Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(C.a,{name:"tags",label:"Tags",elements:"",onChange:function(e){ue(e)},keyPlaceholder:"Tag Key",valuePlaceholder:"Tag Value",withBorder:!0})}),Object(y.jsx)("h3",{children:"Storage Configuration"}),Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(p.a,{id:"storageClass",name:"storageClass",onChange:function(e){z(e.target.value)},placeholder:"STANDARD_IA,REDUCED_REDUNDANCY etc",label:"Storage Class",value:W})}),Object(y.jsx)("h3",{children:"Replication Options"}),Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(f.a,{checked:ce,id:"deleteMarker",name:"deleteMarker",label:"Delete Marker",onChange:function(e){ie(e.target.checked)},value:ce,description:"Replicate soft deletes"})}),Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(f.a,{checked:se,id:"repDelete",name:"repDelete",label:"Deletes",onChange:function(e){le(e.target.checked)},value:se,description:"Replicate versioned deletes"})})]}),Object(y.jsx)(u.a,{item:!0,xs:12,className:c.buttonContainer,children:Object(y.jsx)(l.a,{type:"submit",variant:"contained",color:"primary",disabled:h,children:"Save"})}),h&&Object(y.jsx)(u.a,{item:!0,xs:12,children:Object(y.jsx)(d.a,{})})]})})})})))}}]);
//# sourceMappingURL=92.f8ff5411.chunk.js.map