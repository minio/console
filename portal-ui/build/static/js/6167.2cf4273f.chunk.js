"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[6167],{60656:function(e,n,t){var s=t(18489),i=t(50390),o=t(84402),a=t(78426),r=t(93085),c=t(7887),l=t(66946),u=t(14476),d=t(95467),f=t(21278),x=t(86509),h=t(4285),m=t(72462),p=t(62559);n.Z=(0,h.Z)((function(e){return(0,x.Z)((0,s.Z)({},m.Qw))}))((function(e){var n=e.isOpen,t=void 0!==n&&n,x=e.onClose,h=e.onCancel,m=e.onConfirm,g=e.classes,Z=void 0===g?{}:g,v=e.title,j=void 0===v?"":v,C=e.isLoading,b=e.confirmationContent,y=e.cancelText,k=void 0===y?"Cancel":y,N=e.confirmText,S=void 0===N?"Confirm":N,w=e.confirmButtonProps,P=void 0===w?{}:w,R=e.cancelButtonProps,T=void 0===R?{}:R,_=e.titleIcon,E=void 0===_?null:_;return(0,p.jsxs)(o.Z,{open:t,onClose:function(e,n){"backdropClick"!==n&&x()},className:Z.root,sx:{"& .MuiPaper-root":{padding:"1rem 2rem 2rem 1rem"}},children:[(0,p.jsxs)(a.Z,{className:Z.title,children:[(0,p.jsxs)("div",{className:Z.titleText,children:[E," ",j]}),(0,p.jsx)("div",{className:Z.closeContainer,children:(0,p.jsx)(d.Z,{"aria-label":"close",className:Z.closeButton,onClick:x,disableRipple:!0,size:"small",children:(0,p.jsx)(f.Z,{})})})]}),(0,p.jsx)(r.Z,{className:Z.content,children:b}),(0,p.jsxs)(c.Z,{className:Z.actions,children:[(0,p.jsx)(l.Z,(0,s.Z)((0,s.Z)({className:Z.cancelButton,onClick:h||x,disabled:C,type:"button"},T),{},{variant:"outlined",color:"primary",children:k})),(0,p.jsx)(u.Z,(0,s.Z)((0,s.Z)({className:Z.confirmButton,type:"button",onClick:m,loading:C,disabled:C,variant:"outlined",color:"secondary",loadingPosition:"start",startIcon:(0,p.jsx)(i.Fragment,{}),autoFocus:!0},P),{},{children:S}))]})]})}))},16167:function(e,n,t){t.r(n),t.d(n,{default:function(){return R}});var s=t(50390),i=t(38342),o=t.n(i),a=t(25594),r=t(73726),c=t(23430),l=t(18489),u=t(34424),d=t(86509),f=t(4285),x=t(81378),h=t(56805),m=t(66946),p=t(30324),g=t(96873),Z=t(44149),v=t(72462),j=t(23473),C=t(60656),b=t(63548),y=t(62559),k={setErrorSnackMessage:Z.Ih},N=(0,u.$j)(null,k),S=(0,f.Z)((function(e){return(0,d.Z)((0,l.Z)({wrapText:{maxWidth:"200px",whiteSpace:"normal",wordWrap:"break-word"}},v.Qw))}))(N((function(e){var n=e.classes,t=e.configurationName,i=e.closeResetModalAndRefresh,o=e.setErrorSnackMessage,a=e.resetOpen,r=(0,s.useState)(!1),l=(0,c.Z)(r,2),u=l[0],d=l[1];(0,s.useEffect)((function(){u&&p.Z.invoke("GET","/api/v1/configs/".concat(t,"/reset")).then((function(e){d(!1),i(!0)})).catch((function(e){d(!1),o(e)}))}),[i,t,u,o]);return(0,y.jsx)(C.Z,{title:"Restore Defaults",confirmText:"Yes, Reset Configuration",isOpen:a,titleIcon:(0,y.jsx)(b.Nv,{}),isLoading:u,onConfirm:function(){d(!0)},onClose:function(){i(!1)},confirmationContent:(0,y.jsxs)(s.Fragment,{children:[u&&(0,y.jsx)(x.Z,{}),(0,y.jsxs)(j.Z,{children:["Are you sure you want to restore these configurations to default values?",(0,y.jsx)("br",{}),(0,y.jsx)("b",{className:n.wrapText,children:"Please note that this may cause your system to not be accessible"})]})]})})}))),w={serverNeedsRestart:Z.o8,setErrorSnackMessage:Z.Ih},P=(0,u.$j)(null,w)((0,f.Z)((function(e){return(0,d.Z)((0,l.Z)((0,l.Z)((0,l.Z)({},v.YI),v.Je),{},{settingsFormContainer:{display:"grid",gridTemplateColumns:"1fr",gridGap:"10px"}}))}))((function(e){var n=e.serverNeedsRestart,t=e.selectedConfiguration,i=e.setErrorSnackMessage,l=e.classes,u=e.history,d=e.className,f=void 0===d?"":d,Z=(0,s.useState)([]),v=(0,c.Z)(Z,2),j=v[0],C=v[1],b=(0,s.useState)(!1),k=(0,c.Z)(b,2),N=k[0],w=k[1],P=(0,s.useState)(!0),R=(0,c.Z)(P,2),T=R[0],_=R[1],E=(0,s.useState)([]),F=(0,c.Z)(E,2),I=F[0],M=F[1],D=(0,s.useState)(!1),B=(0,c.Z)(D,2),O=B[0],A=B[1];(0,s.useEffect)((function(){if(T){var e=o()(t,"configuration_id",!1);if(e)return void p.Z.invoke("GET","/api/v1/configs/".concat(e)).then((function(e){var n=o()(e,"key_values",[]);M(n),_(!1)})).catch((function(e){_(!1),i(e)}));_(!1)}}),[T,t,i]),(0,s.useEffect)((function(){if(N){var e={key_values:(0,r.DD)(j)};p.Z.invoke("PUT","/api/v1/configs/".concat(t.configuration_id),e).then((function(e){w(!1),n(e.restart),u.push("/settings")})).catch((function(e){w(!1),i(e)}))}}),[N,u,n,t,j,i]);var G=(0,s.useCallback)((function(e){C(e)}),[C]);return(0,y.jsxs)(s.Fragment,{children:[O&&(0,y.jsx)(S,{configurationName:t.configuration_id,closeResetModalAndRefresh:function(e){A(!1),n(e),e&&_(!0)},resetOpen:O}),T?(0,y.jsx)(a.ZP,{item:!0,xs:12,children:(0,y.jsx)(x.Z,{})}):(0,y.jsx)(h.Z,{sx:{padding:"15px",height:"100%"},children:(0,y.jsxs)("form",{noValidate:!0,onSubmit:function(e){e.preventDefault(),w(!0)},className:f,style:{height:"100%",display:"flex",flexFlow:"column"},children:[(0,y.jsx)(a.ZP,{item:!0,xs:12,className:l.settingsFormContainer,children:(0,y.jsx)(g.default,{fields:r.DP[t.configuration_id],onChange:G,defaultVals:I})}),(0,y.jsxs)(a.ZP,{item:!0,xs:12,sx:{paddingTop:"15px ",textAlign:"right",maxHeight:"60px"},children:[(0,y.jsx)(m.Z,{type:"button",variant:"outlined",color:"secondary",onClick:function(){A(!0)},children:"Restore Defaults"}),"\xa0 \xa0",(0,y.jsx)(m.Z,{type:"submit",variant:"contained",color:"primary",disabled:N,children:"Save"})]})]})})]})}))),R=function(e){var n=e.match,t=e.history,s=o()(n,"url",""),i=s.substring(s.lastIndexOf("/")+1),c=r.bx.find((function(e){return e.configuration_id===i})),l="".concat(i);return(0,y.jsx)(a.ZP,{item:!0,xs:12,sx:{height:"100%","& .identity_ldap, .api":{"& label":{minWidth:220,marginRight:0}}},children:c&&(0,y.jsx)(P,{className:"".concat(l),selectedConfiguration:c,history:t})})}}}]);
//# sourceMappingURL=6167.2cf4273f.chunk.js.map