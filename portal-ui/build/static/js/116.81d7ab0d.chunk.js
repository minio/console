(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[116],{400:function(e,t,a){"use strict";var c=a(6),o=a(1),n=a(2),i=a.n(n),r=a(300),s=a(310),l=a(477),d=a(809),b=a(376),h=a(95),j=a(436),u=a(120),p=a(121),O=a(7),m=a(0),x=Object(s.a)((function(e){return{root:{width:50,height:24,padding:0,margin:0},switchBase:{padding:1,"&$checked":{transform:"translateX(24px)",color:e.palette.common.white,"& + $track":{backgroundColor:"#4CCB92",boxShadow:"inset 0px 1px 4px rgba(0,0,0,0.1)",opacity:1,border:"none"}},"&$focusVisible $thumb":{color:"#4CCB92",border:"6px solid #fff"}},thumb:{width:22,height:22,backgroundColor:"#FAFAFA",border:"2px solid #FFFFFF",marginLeft:1},track:{borderRadius:12,backgroundColor:"#E2E2E2",boxShadow:"inset 0px 1px 4px rgba(0,0,0,0.1)",opacity:1,transition:e.transitions.create(["background-color","border"])},checked:{},focusVisible:{},switchContainer:{display:"flex",alignItems:"center",justifyContent:"flex-end"}}}))(l.a);t.a=Object(s.a)((function(e){return Object(r.a)(Object(o.a)(Object(o.a)({divContainer:{marginBottom:20},indicatorLabelOn:{fontWeight:"bold",color:"#081C42 !important"},indicatorLabel:{fontSize:12,color:"#E2E2E2",margin:"0 8px 0 10px"},fieldDescription:{marginTop:4,color:"#999999"},tooltip:{fontSize:16}},u.a),u.i))}))((function(e){var t=e.label,a=void 0===t?"":t,o=e.onChange,n=e.value,r=e.id,s=e.name,l=e.checked,u=void 0!==l&&l,g=e.disabled,f=void 0!==g&&g,v=e.switchOnly,k=void 0!==v&&v,w=e.tooltip,y=void 0===w?"":w,S=e.description,C=void 0===S?"":S,N=e.classes,z=e.indicatorLabels,F=Object(m.jsxs)(i.a.Fragment,{children:[!k&&Object(m.jsx)("span",{className:Object(O.a)(N.indicatorLabel,Object(c.a)({},N.indicatorLabelOn,!u)),children:z&&z.length>1?z[1]:"OFF"}),Object(m.jsx)(x,{checked:u,onChange:o,color:"primary",name:s,inputProps:{"aria-label":"primary checkbox"},disabled:f,disableRipple:!0,disableFocusRipple:!0,disableTouchRipple:!0,value:n}),!k&&Object(m.jsx)("span",{className:Object(O.a)(N.indicatorLabel,Object(c.a)({},N.indicatorLabelOn,u)),children:z?z[0]:"ON"})]});return k?F:Object(m.jsx)("div",{className:N.divContainer,children:Object(m.jsxs)(j.a,{container:!0,alignItems:"center",children:[Object(m.jsx)(j.a,{item:!0,xs:!0,children:Object(m.jsxs)(j.a,{container:!0,children:[Object(m.jsx)(j.a,{item:!0,xs:12,sm:4,md:3,children:""!==a&&Object(m.jsxs)(d.a,{htmlFor:r,className:N.inputLabel,children:[Object(m.jsx)("span",{children:a}),""!==y&&Object(m.jsx)("div",{className:N.tooltipContainer,children:Object(m.jsx)(b.a,{title:y,placement:"top-start",children:Object(m.jsx)("div",{className:N.tooltip,children:Object(m.jsx)(p.a,{})})})})]})}),Object(m.jsx)(j.a,{item:!0,xs:12,sm:!0,textAlign:"left",children:""!==C&&Object(m.jsx)(h.a,{component:"p",className:N.fieldDescription,children:C})})]})}),Object(m.jsx)(j.a,{item:!0,xs:12,sm:2,textAlign:"right",className:N.switchContainer,children:F})]})})}))},477:function(e,t,a){"use strict";var c=a(6),o=a(4),n=a(3),i=a(2),r=(a(11),a(7)),s=a(93),l=a(116),d=a(9),b=a(420),h=a(12),j=a(8),u=a(70),p=a(94);function O(e){return Object(u.a)("MuiSwitch",e)}var m=Object(p.a)("MuiSwitch",["root","edgeStart","edgeEnd","switchBase","colorPrimary","colorSecondary","sizeSmall","sizeMedium","checked","disabled","input","thumb","track"]),x=a(0),g=["className","color","edge","size","sx"],f=Object(j.a)("span",{name:"MuiSwitch",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,a.edge&&t["edge".concat(Object(d.a)(a.edge))],t["size".concat(Object(d.a)(a.size))]]}})((function(e){var t,a=e.ownerState;return Object(n.a)({display:"inline-flex",width:58,height:38,overflow:"hidden",padding:12,boxSizing:"border-box",position:"relative",flexShrink:0,zIndex:0,verticalAlign:"middle","@media print":{colorAdjust:"exact"}},"start"===a.edge&&{marginLeft:-8},"end"===a.edge&&{marginRight:-8},"small"===a.size&&(t={width:40,height:24,padding:7},Object(c.a)(t,"& .".concat(m.thumb),{width:16,height:16}),Object(c.a)(t,"& .".concat(m.switchBase),Object(c.a)({padding:4},"&.".concat(m.checked),{transform:"translateX(16px)"})),t))})),v=Object(j.a)(b.a,{name:"MuiSwitch",slot:"SwitchBase",overridesResolver:function(e,t){var a=e.ownerState;return[t.switchBase,Object(c.a)({},"& .".concat(m.input),t.input),"default"!==a.color&&t["color".concat(Object(d.a)(a.color))]]}})((function(e){var t,a=e.theme;return t={position:"absolute",top:0,left:0,zIndex:1,color:"light"===a.palette.mode?a.palette.common.white:a.palette.grey[300],transition:a.transitions.create(["left","transform"],{duration:a.transitions.duration.shortest})},Object(c.a)(t,"&.".concat(m.checked),{transform:"translateX(20px)"}),Object(c.a)(t,"&.".concat(m.disabled),{color:"light"===a.palette.mode?a.palette.grey[100]:a.palette.grey[600]}),Object(c.a)(t,"&.".concat(m.checked," + .").concat(m.track),{opacity:.5}),Object(c.a)(t,"&.".concat(m.disabled," + .").concat(m.track),{opacity:"light"===a.palette.mode?.12:.2}),Object(c.a)(t,"& .".concat(m.input),{left:"-100%",width:"300%"}),t}),(function(e){var t,a=e.theme,o=e.ownerState;return Object(n.a)({"&:hover":{backgroundColor:Object(l.a)(a.palette.action.active,a.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"default"!==o.color&&(t={},Object(c.a)(t,"&.".concat(m.checked),Object(c.a)({color:a.palette[o.color].main,"&:hover":{backgroundColor:Object(l.a)(a.palette[o.color].main,a.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"&.".concat(m.disabled),{color:"light"===a.palette.mode?Object(l.e)(a.palette[o.color].main,.62):Object(l.b)(a.palette[o.color].main,.55)})),Object(c.a)(t,"&.".concat(m.checked," + .").concat(m.track),{backgroundColor:a.palette[o.color].main}),t))})),k=Object(j.a)("span",{name:"MuiSwitch",slot:"Track",overridesResolver:function(e,t){return t.track}})((function(e){var t=e.theme;return{height:"100%",width:"100%",borderRadius:7,zIndex:-1,transition:t.transitions.create(["opacity","background-color"],{duration:t.transitions.duration.shortest}),backgroundColor:"light"===t.palette.mode?t.palette.common.black:t.palette.common.white,opacity:"light"===t.palette.mode?.38:.3}})),w=Object(j.a)("span",{name:"MuiSwitch",slot:"Thumb",overridesResolver:function(e,t){return t.thumb}})((function(e){return{boxShadow:e.theme.shadows[1],backgroundColor:"currentColor",width:20,height:20,borderRadius:"50%"}})),y=i.forwardRef((function(e,t){var a=Object(h.a)({props:e,name:"MuiSwitch"}),c=a.className,i=a.color,l=void 0===i?"primary":i,b=a.edge,j=void 0!==b&&b,u=a.size,p=void 0===u?"medium":u,m=a.sx,y=Object(o.a)(a,g),S=Object(n.a)({},a,{color:l,edge:j,size:p}),C=function(e){var t=e.classes,a=e.edge,c=e.size,o=e.color,i=e.checked,r=e.disabled,l={root:["root",a&&"edge".concat(Object(d.a)(a)),"size".concat(Object(d.a)(c))],switchBase:["switchBase","color".concat(Object(d.a)(o)),i&&"checked",r&&"disabled"],thumb:["thumb"],track:["track"],input:["input"]},b=Object(s.a)(l,O,t);return Object(n.a)({},t,b)}(S),N=Object(x.jsx)(w,{className:C.thumb,ownerState:S});return Object(x.jsxs)(f,{className:Object(r.a)(C.root,c),sx:m,ownerState:S,children:[Object(x.jsx)(v,Object(n.a)({type:"checkbox",icon:N,checkedIcon:N,ref:t,ownerState:S},y,{classes:Object(n.a)({},C,{root:C.switchBase})})),Object(x.jsx)(k,{className:C.track,ownerState:S})]})}));t.a=y},522:function(e,t,a){"use strict";var c=a(1),o=a(2),n=a.n(o),i=a(436),r=a(575),s=a(809),l=a(376),d=a(300),b=a(310),h=a(121),j=a(120),u=(a(577),a(578),a(0));a(579);t.a=Object(b.a)((function(e){return Object(d.a)(Object(c.a)({},j.i))}))((function(e){var t=e.value,a=e.label,c=void 0===a?"":a,o=e.tooltip,d=void 0===o?"":o,b=e.mode,j=void 0===b?"yaml":b,p=e.classes,O=e.onChange,m=void 0===O?function(){}:O,x=e.onBeforeChange,g=e.readOnly,f=void 0!==g&&g;return Object(u.jsxs)(n.a.Fragment,{children:[Object(u.jsxs)(s.a,{className:p.inputLabel,children:[Object(u.jsx)("span",{children:c}),""!==d&&Object(u.jsx)("div",{className:p.tooltipContainer,children:Object(u.jsx)(l.a,{title:d,placement:"top-start",children:Object(u.jsx)("div",{className:p.tooltip,children:Object(u.jsx)(h.a,{})})})})]}),Object(u.jsx)(i.a,{item:!0,xs:12,children:Object(u.jsx)("br",{})}),Object(u.jsx)(i.a,{item:!0,xs:12,children:Object(u.jsx)(r.Controlled,{value:t,options:{mode:j,lineNumbers:!0,readOnly:f},onBeforeChange:x,onChange:m})})]})}))},944:function(e,t,a){"use strict";a.r(t);var c=a(15),o=a(1),n=a(2),i=a(39),r=a(436),s=a(380),l=a(366),d=a(300),b=a(310),h=a(120),j=a(31),u=a(389),p=a(52),O=a(522),m=a(400),x=a(390),g=a(0),f={setModalErrorSnackMessage:j.h},v=Object(i.b)(null,f);t.default=Object(b.a)((function(e){return Object(d.a)(Object(o.a)(Object(o.a)({},h.w),h.p))}))(v((function(e){var t=e.classes,a=e.open,o=e.closeModalAndRefresh,i=e.setModalErrorSnackMessage,d=Object(n.useState)(!1),b=Object(c.a)(d,2),h=b[0],j=b[1],f=Object(n.useState)(""),v=Object(c.a)(f,2),k=v[0],w=v[1],y=Object(n.useState)(""),S=Object(c.a)(y,2),C=S[0],N=S[1],z=Object(n.useState)(""),F=Object(c.a)(z,2),R=F[0],A=F[1],B=Object(n.useState)(!1),M=Object(c.a)(B,2),E=M[0],L=M[1],K=Object(n.useState)(!1),I=Object(c.a)(K,2),T=I[0],P=I[1];Object(n.useEffect)((function(){h&&(T?p.a.invoke("POST","/api/v1/service-account-credentials",{policy:k,accessKey:C,secretKey:R}).then((function(e){j(!1),o(e)})).catch((function(e){j(!1),i(e)})):p.a.invoke("POST","/api/v1/service-accounts",{policy:k}).then((function(e){j(!1),o(e)})).catch((function(e){j(!1),i(e)})))}),[h,j,i,k,o,T,C,R]);return Object(g.jsx)(u.a,{modalOpen:a,onClose:function(){o(null)},title:"Create Service Account",children:Object(g.jsxs)("form",{noValidate:!0,autoComplete:"off",onSubmit:function(e){!function(e){e.preventDefault(),j(!0)}(e)},children:[Object(g.jsxs)(r.a,{container:!0,className:t.containerScrollable,children:[Object(g.jsx)(r.a,{item:!0,xs:12,children:Object(g.jsx)("div",{className:t.infoDetails,children:"Service Accounts inherit the policy explicitly attached to the parent user and the policy attached to each group in which the parent user has membership. You can specify an optional JSON-formatted policy below to restrict the Service Account access to a subset of actions and resources explicitly allowed for the parent user. You cannot modify the Service Account optional policy after saving."})}),Object(g.jsxs)(r.a,{item:!0,xs:12,children:[Object(g.jsxs)(r.a,{item:!0,xs:12,children:[Object(g.jsx)(m.a,{value:"locking",id:"locking",name:"locking",checked:T,onChange:function(e){P(e.target.checked)},label:"Customize Credentials"}),T&&Object(g.jsx)(r.a,{item:!0,xs:12,children:Object(g.jsxs)("div",{className:t.stackedInputs,children:[Object(g.jsx)(x.a,{value:C,label:"Access Key",id:"accessKey",name:"accessKey",placeholder:"Enter Access Key",onChange:function(e){N(e.target.value)}}),Object(g.jsx)(x.a,{value:R,label:"Secret Key",id:"secretKey",name:"secretKey",placeholder:"Enter Secret Key",onChange:function(e){A(e.target.value)}})]})})]}),Object(g.jsxs)(r.a,{item:!0,xs:12,children:[Object(g.jsx)(m.a,{value:"locking",id:"locking",name:"locking",checked:E,onChange:function(e){L(e.target.checked)},label:"Restrict with policy"}),E&&Object(g.jsx)(r.a,{item:!0,xs:12,className:t.codeMirrorContainer,children:Object(g.jsx)(O.a,{label:"Policy ",value:k,onBeforeChange:function(e,t,a){w(a)}})})]})]})]}),Object(g.jsxs)(r.a,{container:!0,children:[Object(g.jsxs)(r.a,{item:!0,xs:12,className:t.buttonContainer,children:[Object(g.jsx)(s.a,{type:"button",color:"primary",variant:"outlined",className:t.buttonSpacer,onClick:function(){w("")},children:"Clear"}),Object(g.jsx)(s.a,{type:"submit",variant:"contained",color:"primary",disabled:h,children:"Create"})]}),h&&Object(g.jsx)(r.a,{item:!0,xs:12,children:Object(g.jsx)(l.a,{})})]})]})})})))}}]);
//# sourceMappingURL=116.81d7ab0d.chunk.js.map