(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[66],{400:function(e,t,a){"use strict";var c=a(1),n=a(2),o=a.n(n),i=a(430),r=a(444),l=a(822),s=a(385),d=a(388),b=a(308),u=a(378),j=a(320),h=a(122),m=a(123),p=a(0),O=Object(u.a)((function(e){return Object(b.a)(Object(c.a)({},h.n))}));function x(e){var t=O();return Object(p.jsx)(i.a,Object(c.a)({InputProps:{classes:t}},e))}t.a=Object(j.a)((function(e){return Object(b.a)(Object(c.a)(Object(c.a)(Object(c.a)({},h.i),h.E),{},{textBoxContainer:{flexGrow:1,position:"relative"},overlayAction:{position:"absolute",right:5,top:6,"& svg":{maxWidth:15,maxHeight:15},"&.withLabel":{top:5}}}))}))((function(e){var t=e.label,a=e.onChange,n=e.value,i=e.id,b=e.name,u=e.type,j=void 0===u?"text":u,h=e.autoComplete,O=void 0===h?"off":h,v=e.disabled,g=void 0!==v&&v,f=e.multiline,k=void 0!==f&&f,w=e.tooltip,C=void 0===w?"":w,S=e.index,N=void 0===S?0:S,F=e.error,y=void 0===F?"":F,R=e.required,L=void 0!==R&&R,E=e.placeholder,I=void 0===E?"":E,B=e.min,z=e.max,M=e.overlayIcon,A=void 0===M?null:M,P=e.overlayObject,q=void 0===P?null:P,T=e.extraInputProps,W=void 0===T?{}:T,D=e.overlayAction,_=e.noLabelMinWidth,$=void 0!==_&&_,Q=e.pattern,H=void 0===Q?"":Q,X=e.autoFocus,G=void 0!==X&&X,J=e.classes,U=Object(c.a)({"data-index":N},W);return"number"===j&&B&&(U.min=B),"number"===j&&z&&(U.max=z),""!==H&&(U.pattern=H),Object(p.jsx)(o.a.Fragment,{children:Object(p.jsxs)(r.a,{container:!0,className:" ".concat(""!==y?J.errorInField:J.inputBoxContainer),children:[""!==t&&Object(p.jsxs)(l.a,{htmlFor:i,className:$?J.noMinWidthLabel:J.inputLabel,children:[Object(p.jsxs)("span",{children:[t,L?"*":""]}),""!==C&&Object(p.jsx)("div",{className:J.tooltipContainer,children:Object(p.jsx)(s.a,{title:C,placement:"top-start",children:Object(p.jsx)("div",{className:J.tooltip,children:Object(p.jsx)(m.a,{})})})})]}),Object(p.jsxs)("div",{className:J.textBoxContainer,children:[Object(p.jsx)(x,{id:i,name:b,fullWidth:!0,value:n,autoFocus:G,disabled:g,onChange:a,type:j,multiline:k,autoComplete:O,inputProps:U,error:""!==y,helperText:y,placeholder:I,className:J.inputRebase}),A&&Object(p.jsx)("div",{className:"".concat(J.overlayAction," ").concat(""!==t?"withLabel":""),children:Object(p.jsx)(d.a,{onClick:D?function(){D()}:function(){return null},size:"small",disableFocusRipple:!1,disableRipple:!1,disableTouchRipple:!1,children:A})}),q&&Object(p.jsx)("div",{className:"".concat(J.overlayAction," ").concat(""!==t?"withLabel":""),children:q})]})]})})}))},409:function(e,t,a){"use strict";var c=a(5),n=a(1),o=a(2),i=a.n(o),r=a(308),l=a(320),s=a(484),d=a(822),b=a(385),u=a(96),j=a(444),h=a(122),m=a(123),p=a(8),O=a(0),x=Object(l.a)((function(e){return{root:{width:50,height:24,padding:0,margin:0},switchBase:{padding:1,"&$checked":{transform:"translateX(24px)",color:e.palette.common.white,"& + $track":{backgroundColor:"#4CCB92",boxShadow:"inset 0px 1px 4px rgba(0,0,0,0.1)",opacity:1,border:"none"}},"&$focusVisible $thumb":{color:"#4CCB92",border:"6px solid #fff"}},thumb:{width:22,height:22,backgroundColor:"#FAFAFA",border:"2px solid #FFFFFF",marginLeft:1},track:{borderRadius:12,backgroundColor:"#E2E2E2",boxShadow:"inset 0px 1px 4px rgba(0,0,0,0.1)",opacity:1,transition:e.transitions.create(["background-color","border"])},checked:{},focusVisible:{},switchContainer:{display:"flex",alignItems:"center",justifyContent:"flex-end"}}}))(s.a);t.a=Object(l.a)((function(e){return Object(r.a)(Object(n.a)(Object(n.a)({divContainer:{marginBottom:20},indicatorLabelOn:{fontWeight:"bold",color:"#081C42 !important"},indicatorLabel:{fontSize:12,color:"#E2E2E2",margin:"0 8px 0 10px"},fieldDescription:{marginTop:4,color:"#999999"},tooltip:{fontSize:16}},h.a),h.i))}))((function(e){var t=e.label,a=void 0===t?"":t,n=e.onChange,o=e.value,r=e.id,l=e.name,s=e.checked,h=void 0!==s&&s,v=e.disabled,g=void 0!==v&&v,f=e.switchOnly,k=void 0!==f&&f,w=e.tooltip,C=void 0===w?"":w,S=e.description,N=void 0===S?"":S,F=e.classes,y=e.indicatorLabels,R=Object(O.jsxs)(i.a.Fragment,{children:[!k&&Object(O.jsx)("span",{className:Object(p.a)(F.indicatorLabel,Object(c.a)({},F.indicatorLabelOn,!h)),children:y&&y.length>1?y[1]:"OFF"}),Object(O.jsx)(x,{checked:h,onChange:n,color:"primary",name:l,inputProps:{"aria-label":"primary checkbox"},disabled:g,disableRipple:!0,disableFocusRipple:!0,disableTouchRipple:!0,value:o}),!k&&Object(O.jsx)("span",{className:Object(p.a)(F.indicatorLabel,Object(c.a)({},F.indicatorLabelOn,h)),children:y?y[0]:"ON"})]});return k?R:Object(O.jsx)("div",{className:F.divContainer,children:Object(O.jsxs)(j.a,{container:!0,alignItems:"center",children:[Object(O.jsx)(j.a,{item:!0,xs:!0,children:Object(O.jsxs)(j.a,{container:!0,children:[Object(O.jsx)(j.a,{item:!0,xs:12,sm:4,md:3,children:""!==a&&Object(O.jsxs)(d.a,{htmlFor:r,className:F.inputLabel,children:[Object(O.jsx)("span",{children:a}),""!==C&&Object(O.jsx)("div",{className:F.tooltipContainer,children:Object(O.jsx)(b.a,{title:C,placement:"top-start",children:Object(O.jsx)("div",{className:F.tooltip,children:Object(O.jsx)(m.a,{})})})})]})}),Object(O.jsx)(j.a,{item:!0,xs:12,sm:!0,textAlign:"left",children:""!==N&&Object(O.jsx)(u.a,{component:"p",className:F.fieldDescription,children:N})})]})}),Object(O.jsx)(j.a,{item:!0,xs:12,sm:2,textAlign:"right",className:F.switchContainer,children:R})]})})}))},431:function(e,t,a){"use strict";var c=a(16),n=a(4),o=a(3),i=a(2),r=(a(12),a(8)),l=a(94),s=a(11),d=a(9),b=a(77),u=a(397),j=a(379),h=a(70),m=a(95);function p(e){return Object(h.a)("PrivateSwitchBase",e)}Object(m.a)("PrivateSwitchBase",["root","checked","disabled","input","edgeStart","edgeEnd"]);var O=a(0),x=["autoFocus","checked","checkedIcon","className","defaultChecked","disabled","disableFocusRipple","edge","icon","id","inputProps","inputRef","name","onBlur","onChange","onFocus","readOnly","required","tabIndex","type","value"],v=Object(d.a)(j.a,{skipSx:!0})((function(e){var t=e.ownerState;return Object(o.a)({padding:9,borderRadius:"50%"},"start"===t.edge&&{marginLeft:"small"===t.size?-3:-12},"end"===t.edge&&{marginRight:"small"===t.size?-3:-12})})),g=Object(d.a)("input",{skipSx:!0})({cursor:"inherit",position:"absolute",opacity:0,width:"100%",height:"100%",top:0,left:0,margin:0,padding:0,zIndex:1}),f=i.forwardRef((function(e,t){var a=e.autoFocus,i=e.checked,d=e.checkedIcon,j=e.className,h=e.defaultChecked,m=e.disabled,f=e.disableFocusRipple,k=void 0!==f&&f,w=e.edge,C=void 0!==w&&w,S=e.icon,N=e.id,F=e.inputProps,y=e.inputRef,R=e.name,L=e.onBlur,E=e.onChange,I=e.onFocus,B=e.readOnly,z=e.required,M=e.tabIndex,A=e.type,P=e.value,q=Object(n.a)(e,x),T=Object(b.a)({controlled:i,default:Boolean(h),name:"SwitchBase",state:"checked"}),W=Object(c.a)(T,2),D=W[0],_=W[1],$=Object(u.a)(),Q=m;$&&"undefined"===typeof Q&&(Q=$.disabled);var H="checkbox"===A||"radio"===A,X=Object(o.a)({},e,{checked:D,disabled:Q,disableFocusRipple:k,edge:C}),G=function(e){var t=e.classes,a=e.checked,c=e.disabled,n=e.edge,o={root:["root",a&&"checked",c&&"disabled",n&&"edge".concat(Object(s.a)(n))],input:["input"]};return Object(l.a)(o,p,t)}(X);return Object(O.jsxs)(v,Object(o.a)({component:"span",className:Object(r.a)(G.root,j),centerRipple:!0,focusRipple:!k,disabled:Q,tabIndex:null,role:void 0,onFocus:function(e){I&&I(e),$&&$.onFocus&&$.onFocus(e)},onBlur:function(e){L&&L(e),$&&$.onBlur&&$.onBlur(e)},ownerState:X,ref:t},q,{children:[Object(O.jsx)(g,Object(o.a)({autoFocus:a,checked:i,defaultChecked:h,className:G.input,disabled:Q,id:H&&N,name:R,onChange:function(e){if(!e.nativeEvent.defaultPrevented){var t=e.target.checked;_(t),E&&E(e,t)}},readOnly:B,ref:y,required:z,ownerState:X,tabIndex:M,type:A},"checkbox"===A&&void 0===P?{}:{value:P},F)),D?d:S]}))}));t.a=f},454:function(e,t,a){"use strict";var c=a(1),n=a(2),o=a(444),i=a(308),r=a(320),l=a(122),s=a(0);t.a=Object(r.a)((function(e){return Object(i.a)(Object(c.a)({},l.t))}))((function(e){var t=e.classes,a=e.label,c=void 0===a?"":a,i=e.content,r=e.multiLine,l=void 0!==r&&r;return Object(s.jsx)(n.Fragment,{children:Object(s.jsxs)(o.a,{className:t.prefinedContainer,children:[""!==c&&Object(s.jsx)(o.a,{item:!0,xs:12,className:t.predefinedTitle,children:c}),Object(s.jsx)(o.a,{item:!0,xs:12,className:t.predefinedList,children:Object(s.jsx)(o.a,{item:!0,xs:12,className:l?t.innerContentMultiline:t.innerContent,children:i})})]})})}))},466:function(e,t,a){"use strict";var c=a(5),n=a(1),o=(a(2),a(8)),i=a(444),r=a(823),l=a(829),s=a(821),d=a(822),b=a(385),u=a(308),j=a(320),h=a(378),m=a(122),p=a(123),O=a(0),x=Object(h.a)(Object(n.a)({root:{"&:hover":{backgroundColor:"transparent"}}},m.u)),v=function(e){var t=x();return Object(O.jsx)(s.a,Object(n.a)({className:t.root,disableRipple:!0,color:"default",checkedIcon:Object(O.jsx)("span",{className:t.radioSelectedIcon}),icon:Object(O.jsx)("span",{className:t.radioUnselectedIcon})},e))};t.a=Object(j.a)((function(e){return Object(u.a)(Object(n.a)(Object(n.a)(Object(n.a)({},m.i),m.E),{},{optionLabel:{"&.Mui-disabled":{"& .MuiFormControlLabel-label":{color:"#9c9c9c"}},"&:last-child":{marginRight:0},"& .MuiFormControlLabel-label":{fontSize:12,color:"#07193E"}},checkedOption:{"& .MuiFormControlLabel-label":{fontSize:12,color:"#07193E",fontWeight:700}}}))}))((function(e){var t=e.selectorOptions,a=void 0===t?[]:t,n=e.currentSelection,s=e.label,u=e.id,j=e.name,h=e.onChange,m=e.tooltip,x=void 0===m?"":m,g=e.disableOptions,f=void 0!==g&&g,k=e.classes,w=e.displayInColumn,C=void 0!==w&&w;return Object(O.jsxs)(i.a,{container:!0,alignItems:"center",children:[Object(O.jsx)(i.a,{item:!0,xs:!0,children:Object(O.jsxs)(d.a,{htmlFor:u,className:k.inputLabel,children:[Object(O.jsx)("span",{children:s}),""!==x&&Object(O.jsx)("div",{className:k.tooltipContainer,children:Object(O.jsx)(b.a,{title:x,placement:"top-start",children:Object(O.jsx)("div",{children:Object(O.jsx)(p.a,{})})})})]})}),Object(O.jsx)(i.a,{item:!0,xs:!0,className:k.radioOptionsLayout,children:Object(O.jsx)(r.a,{"aria-label":u,id:u,name:j,value:n,onChange:h,row:!C,style:{display:"block",textAlign:"right"},children:a.map((function(e){return Object(O.jsx)(l.a,{value:e.value,control:Object(O.jsx)(v,{}),label:e.label,disabled:f,className:Object(o.a)(k.optionLabel,Object(c.a)({},k.checkedOption,e.value===n))},"rd-".concat(j,"-").concat(e.value))}))})})]})}))},484:function(e,t,a){"use strict";var c=a(5),n=a(4),o=a(3),i=a(2),r=(a(12),a(8)),l=a(94),s=a(118),d=a(11),b=a(431),u=a(14),j=a(9),h=a(70),m=a(95);function p(e){return Object(h.a)("MuiSwitch",e)}var O=Object(m.a)("MuiSwitch",["root","edgeStart","edgeEnd","switchBase","colorPrimary","colorSecondary","sizeSmall","sizeMedium","checked","disabled","input","thumb","track"]),x=a(0),v=["className","color","edge","size","sx"],g=Object(j.a)("span",{name:"MuiSwitch",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,a.edge&&t["edge".concat(Object(d.a)(a.edge))],t["size".concat(Object(d.a)(a.size))]]}})((function(e){var t,a=e.ownerState;return Object(o.a)({display:"inline-flex",width:58,height:38,overflow:"hidden",padding:12,boxSizing:"border-box",position:"relative",flexShrink:0,zIndex:0,verticalAlign:"middle","@media print":{colorAdjust:"exact"}},"start"===a.edge&&{marginLeft:-8},"end"===a.edge&&{marginRight:-8},"small"===a.size&&(t={width:40,height:24,padding:7},Object(c.a)(t,"& .".concat(O.thumb),{width:16,height:16}),Object(c.a)(t,"& .".concat(O.switchBase),Object(c.a)({padding:4},"&.".concat(O.checked),{transform:"translateX(16px)"})),t))})),f=Object(j.a)(b.a,{name:"MuiSwitch",slot:"SwitchBase",overridesResolver:function(e,t){var a=e.ownerState;return[t.switchBase,Object(c.a)({},"& .".concat(O.input),t.input),"default"!==a.color&&t["color".concat(Object(d.a)(a.color))]]}})((function(e){var t,a=e.theme;return t={position:"absolute",top:0,left:0,zIndex:1,color:"light"===a.palette.mode?a.palette.common.white:a.palette.grey[300],transition:a.transitions.create(["left","transform"],{duration:a.transitions.duration.shortest})},Object(c.a)(t,"&.".concat(O.checked),{transform:"translateX(20px)"}),Object(c.a)(t,"&.".concat(O.disabled),{color:"light"===a.palette.mode?a.palette.grey[100]:a.palette.grey[600]}),Object(c.a)(t,"&.".concat(O.checked," + .").concat(O.track),{opacity:.5}),Object(c.a)(t,"&.".concat(O.disabled," + .").concat(O.track),{opacity:"light"===a.palette.mode?.12:.2}),Object(c.a)(t,"& .".concat(O.input),{left:"-100%",width:"300%"}),t}),(function(e){var t,a=e.theme,n=e.ownerState;return Object(o.a)({"&:hover":{backgroundColor:Object(s.a)(a.palette.action.active,a.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"default"!==n.color&&(t={},Object(c.a)(t,"&.".concat(O.checked),Object(c.a)({color:a.palette[n.color].main,"&:hover":{backgroundColor:Object(s.a)(a.palette[n.color].main,a.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"&.".concat(O.disabled),{color:"light"===a.palette.mode?Object(s.e)(a.palette[n.color].main,.62):Object(s.b)(a.palette[n.color].main,.55)})),Object(c.a)(t,"&.".concat(O.checked," + .").concat(O.track),{backgroundColor:a.palette[n.color].main}),t))})),k=Object(j.a)("span",{name:"MuiSwitch",slot:"Track",overridesResolver:function(e,t){return t.track}})((function(e){var t=e.theme;return{height:"100%",width:"100%",borderRadius:7,zIndex:-1,transition:t.transitions.create(["opacity","background-color"],{duration:t.transitions.duration.shortest}),backgroundColor:"light"===t.palette.mode?t.palette.common.black:t.palette.common.white,opacity:"light"===t.palette.mode?.38:.3}})),w=Object(j.a)("span",{name:"MuiSwitch",slot:"Thumb",overridesResolver:function(e,t){return t.thumb}})((function(e){return{boxShadow:e.theme.shadows[1],backgroundColor:"currentColor",width:20,height:20,borderRadius:"50%"}})),C=i.forwardRef((function(e,t){var a=Object(u.a)({props:e,name:"MuiSwitch"}),c=a.className,i=a.color,s=void 0===i?"primary":i,b=a.edge,j=void 0!==b&&b,h=a.size,m=void 0===h?"medium":h,O=a.sx,C=Object(n.a)(a,v),S=Object(o.a)({},a,{color:s,edge:j,size:m}),N=function(e){var t=e.classes,a=e.edge,c=e.size,n=e.color,i=e.checked,r=e.disabled,s={root:["root",a&&"edge".concat(Object(d.a)(a)),"size".concat(Object(d.a)(c))],switchBase:["switchBase","color".concat(Object(d.a)(n)),i&&"checked",r&&"disabled"],thumb:["thumb"],track:["track"],input:["input"]},b=Object(l.a)(s,p,t);return Object(o.a)({},t,b)}(S),F=Object(x.jsx)(w,{className:N.thumb,ownerState:S});return Object(x.jsxs)(g,{className:Object(r.a)(N.root,c),sx:O,ownerState:S,children:[Object(x.jsx)(f,Object(o.a)({type:"checkbox",icon:F,checkedIcon:F,ref:t,ownerState:S},C,{classes:Object(o.a)({},N,{root:N.switchBase})})),Object(x.jsx)(k,{className:N.track,ownerState:S})]})}));t.a=C},648:function(e,t,a){"use strict";var c=a(1),n=a(2),o=a.n(n),i=a(444),r=a(822),l=a(385),s=a(430),d=a(308),b=a(320),u=a(122),j=a(123),h=a(0);t.a=Object(b.a)((function(e){return Object(d.a)(Object(c.a)(Object(c.a)(Object(c.a)({},u.i),u.E),{},{inputLabel:Object(c.a)(Object(c.a)({},u.i.inputLabel),{},{marginBottom:16,fontSize:14}),textBoxContainer:{flexGrow:1,position:"relative"},cssOutlinedInput:{borderColor:"#EAEAEA",padding:16},rootContainer:{"& .MuiOutlinedInput-inputMultiline":Object(c.a)(Object(c.a)({},u.i.inputLabel),{},{fontSize:13,minHeight:150}),"&.Mui-focused .MuiOutlinedInput-notchedOutline":{borderColor:"#07193E",borderWidth:1},"& textarea":{color:"#07193E",fontSize:13,fontWeight:600,"&:placeholder":{color:"#393939",opacity:1}}}}))}))((function(e){var t=e.label,a=e.onChange,c=e.value,n=e.id,d=e.name,b=e.disabled,u=void 0!==b&&b,m=e.tooltip,p=void 0===m?"":m,O=e.index,x=void 0===O?0:O,v=e.error,g=void 0===v?"":v,f=e.required,k=void 0!==f&&f,w=e.placeholder,C=void 0===w?"":w,S=e.classes,N={"data-index":x};return Object(h.jsx)(o.a.Fragment,{children:Object(h.jsxs)(i.a,{item:!0,xs:12,className:"".concat(S.fieldContainer," ").concat(""!==g?S.errorInField:""),children:[""!==t&&Object(h.jsxs)(r.a,{htmlFor:n,className:S.inputLabel,children:[Object(h.jsxs)("span",{children:[t,k?"*":""]}),""!==p&&Object(h.jsx)("div",{className:S.tooltipContainer,children:Object(h.jsx)(l.a,{title:p,placement:"top-start",children:Object(h.jsx)("div",{className:S.tooltip,children:Object(h.jsx)(j.a,{})})})})]}),Object(h.jsx)("div",{className:S.textBoxContainer,children:Object(h.jsx)(s.a,{id:n,name:d,fullWidth:!0,value:c,disabled:u,onChange:a,multiline:!0,rows:5,inputProps:N,error:""!==g,helperText:g,placeholder:C,InputLabelProps:{shrink:!0},InputProps:{classes:{notchedOutline:S.cssOutlinedInput,root:S.rootContainer}},variant:"outlined"})})]})})}))},876:function(e,t,a){"use strict";a.r(t);var c=a(16),n=a(1),o=a(2),i=a.n(o),r=a(308),l=a(320),s=a(444),d=a(400),b=a(466),u=a(122),j=a(648),h=a(409),m=a(454),p=a(0);t.default=Object(l.a)((function(e){return Object(r.a)(Object(n.a)(Object(n.a)({},u.p),u.k))}))((function(e){var t=e.onChange,a=e.classes,n=Object(o.useState)(!1),r=Object(c.a)(n,2),l=r[0],u=r[1],O=Object(o.useState)(""),x=Object(c.a)(O,2),v=x[0],g=x[1],f=Object(o.useState)(""),k=Object(c.a)(f,2),w=k[0],C=k[1],S=Object(o.useState)(""),N=Object(c.a)(S,2),F=N[0],y=N[1],R=Object(o.useState)(""),L=Object(c.a)(R,2),E=L[0],I=L[1],B=Object(o.useState)(""),z=Object(c.a)(B,2),M=z[0],A=z[1],P=Object(o.useState)(""),q=Object(c.a)(P,2),T=q[0],W=q[1],D=Object(o.useState)(""),_=Object(c.a)(D,2),$=_[0],Q=_[1],H=Object(o.useState)("namespace"),X=Object(c.a)(H,2),G=X[0],J=X[1],U=Object(o.useState)(""),V=Object(c.a)(U,2),K=V[0],Y=V[1],Z=Object(o.useState)(""),ee=Object(c.a)(Z,2),te=ee[0],ae=ee[1],ce=Object(o.useState)(""),ne=Object(c.a)(ce,2),oe=ne[0],ie=ne[1],re=Object(o.useCallback)((function(){return"".concat(M,":").concat(T,"@tcp(").concat(w,":").concat(E,")/").concat(F)}),[M,T,w,E,F]);Object(o.useEffect)((function(){""!==v&&t([{key:"dsn_string",value:v},{key:"table",value:$},{key:"format",value:G},{key:"queue_dir",value:K},{key:"queue_limit",value:te},{key:"comment",value:oe}])}),[v,$,G,K,te,oe,t]),Object(o.useEffect)((function(){var e=re();g(e)}),[M,F,T,E,w,g,re]);return Object(p.jsxs)(s.a,{container:!0,children:[Object(p.jsx)(s.a,{item:!0,xs:12,children:Object(p.jsx)(h.a,{label:"Enter DNS String",checked:l,id:"checkedB",name:"checkedB",onChange:function(e){if(e.target.checked){var t=re();g(t)}else{var a=function(e,t){for(var a,c=new Map,n=/(.*?):(.*?)@tcp\((.*?):(.*?)\)\/(.*?)$/gm;null!==(a=n.exec(e));)a.index===n.lastIndex&&n.lastIndex++,c.set("user",a[1]),c.set("password",a[2]),c.set("host",a[3]),c.set("port",a[4]),c.set("dbname",a[5]);return c}(v);C(a.get("host")?a.get("host")+"":""),I(a.get("port")?a.get("port")+"":""),y(a.get("dbname")?a.get("dbname")+"":""),A(a.get("user")?a.get("user")+"":""),W(a.get("password")?a.get("password")+"":"")}u(e.target.checked)},value:"dnsString"})}),l?Object(p.jsx)(i.a.Fragment,{children:Object(p.jsx)(s.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(p.jsx)(d.a,{id:"dsn-string",name:"dsn_string",label:"DSN String",value:v,onChange:function(e){g(e.target.value)}})})}):Object(p.jsxs)(i.a.Fragment,{children:[Object(p.jsx)(s.a,{item:!0,xs:12,children:Object(p.jsxs)(s.a,{item:!0,xs:12,className:a.configureString,children:[Object(p.jsx)(s.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(p.jsx)(d.a,{id:"host",name:"host",label:"",placeholder:"Enter Host",value:w,onChange:function(e){C(e.target.value)}})}),Object(p.jsx)(s.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(p.jsx)(d.a,{id:"db-name",name:"db-name",label:"",placeholder:"Enter DB Name",value:F,onChange:function(e){y(e.target.value)}})}),Object(p.jsx)(s.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(p.jsx)(d.a,{id:"port",name:"port",label:"",placeholder:"Enter Port",value:E,onChange:function(e){I(e.target.value)}})}),Object(p.jsx)(s.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(p.jsx)(d.a,{id:"user",name:"user",label:"",placeholder:"Enter User",value:M,onChange:function(e){A(e.target.value)}})}),Object(p.jsx)(s.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(p.jsx)(d.a,{id:"password",name:"password",label:"",placeholder:"Enter Password",type:"password",value:T,onChange:function(e){W(e.target.value)}})})]})}),Object(p.jsx)(m.a,{label:"Connection String",content:v}),Object(p.jsx)(s.a,{item:!0,xs:12,children:Object(p.jsx)("br",{})})]}),Object(p.jsx)(s.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(p.jsx)(d.a,{id:"table",name:"table",label:"Table",placeholder:"Enter Table Name",value:$,tooltip:"DB table name to store/update events, table is auto-created",onChange:function(e){Q(e.target.value)}})}),Object(p.jsx)(s.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(p.jsx)(b.a,{currentSelection:G,id:"format",name:"format",label:"Format",onChange:function(e){J(e.target.value)},tooltip:"'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'",selectorOptions:[{label:"Namespace",value:"namespace"},{label:"Access",value:"access"}]})}),Object(p.jsx)(s.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(p.jsx)(d.a,{id:"queue-dir",name:"queue_dir",label:"Queue Dir",placeholder:"Enter Queue Dir",value:K,tooltip:"staging dir for undelivered messages e.g. '/home/events'",onChange:function(e){Y(e.target.value)}})}),Object(p.jsx)(s.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(p.jsx)(d.a,{id:"queue-limit",name:"queue_limit",label:"Queue Limit",placeholder:"Enter Queue Limit",type:"number",value:te,tooltip:"maximum limit for undelivered messages, defaults to '10000'",onChange:function(e){ae(e.target.value)}})}),Object(p.jsx)(s.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(p.jsx)(j.a,{id:"comment",name:"comment",label:"Comment",placeholder:"Enter Comment",value:oe,onChange:function(e){ie(e.target.value)}})})]})}))}}]);
//# sourceMappingURL=66.372a3769.chunk.js.map