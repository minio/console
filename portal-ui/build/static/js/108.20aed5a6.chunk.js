(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[108],{430:function(e,t,n){"use strict";var a=n(16),c=n(4),r=n(3),o=n(2),i=(n(12),n(8)),u=n(94),s=n(11),d=n(9),l=n(77),b=n(396),p=n(378),m=n(70),g=n(95);function f(e){return Object(m.a)("PrivateSwitchBase",e)}Object(g.a)("PrivateSwitchBase",["root","checked","disabled","input","edgeStart","edgeEnd"]);var j=n(0),O=["autoFocus","checked","checkedIcon","className","defaultChecked","disabled","disableFocusRipple","edge","icon","id","inputProps","inputRef","name","onBlur","onChange","onFocus","readOnly","required","tabIndex","type","value"],h=Object(d.a)(p.a,{skipSx:!0})((function(e){var t=e.ownerState;return Object(r.a)({padding:9,borderRadius:"50%"},"start"===t.edge&&{marginLeft:"small"===t.size?-3:-12},"end"===t.edge&&{marginRight:"small"===t.size?-3:-12})})),v=Object(d.a)("input",{skipSx:!0})({cursor:"inherit",position:"absolute",opacity:0,width:"100%",height:"100%",top:0,left:0,margin:0,padding:0,zIndex:1}),x=o.forwardRef((function(e,t){var n=e.autoFocus,o=e.checked,d=e.checkedIcon,p=e.className,m=e.defaultChecked,g=e.disabled,x=e.disableFocusRipple,w=void 0!==x&&x,S=e.edge,k=void 0!==S&&S,y=e.icon,C=e.id,R=e.inputProps,M=e.inputRef,z=e.name,B=e.onBlur,N=e.onChange,W=e.onFocus,F=e.readOnly,I=e.required,G=e.tabIndex,T=e.type,P=e.value,E=Object(c.a)(e,O),L=Object(l.a)({controlled:o,default:Boolean(m),name:"SwitchBase",state:"checked"}),V=Object(a.a)(L,2),D=V[0],q=V[1],A=Object(b.a)(),H=g;A&&"undefined"===typeof H&&(H=A.disabled);var J="checkbox"===T||"radio"===T,X=Object(r.a)({},e,{checked:D,disabled:H,disableFocusRipple:w,edge:k}),K=function(e){var t=e.classes,n=e.checked,a=e.disabled,c=e.edge,r={root:["root",n&&"checked",a&&"disabled",c&&"edge".concat(Object(s.a)(c))],input:["input"]};return Object(u.a)(r,f,t)}(X);return Object(j.jsxs)(h,Object(r.a)({component:"span",className:Object(i.a)(K.root,p),centerRipple:!0,focusRipple:!w,disabled:H,tabIndex:null,role:void 0,onFocus:function(e){W&&W(e),A&&A.onFocus&&A.onFocus(e)},onBlur:function(e){B&&B(e),A&&A.onBlur&&A.onBlur(e)},ownerState:X,ref:t},E,{children:[Object(j.jsx)(v,Object(r.a)({autoFocus:n,checked:o,defaultChecked:m,className:K.input,disabled:H,id:J&&C,name:z,onChange:function(e){if(!e.nativeEvent.defaultPrevented){var t=e.target.checked;q(t),N&&N(e,t)}},readOnly:F,ref:M,required:I,ownerState:X,tabIndex:G,type:T},"checkbox"===T&&void 0===P?{}:{value:P},R)),D?d:y]}))}));t.a=x},443:function(e,t,n){"use strict";var a=n(13),c=n(5),r=n(4),o=n(3),i=n(2),u=(n(12),n(8)),s=n(25),d=n(372),l=n(94),b=n(9),p=n(14);var m=i.createContext(),g=n(70),f=n(95);function j(e){return Object(g.a)("MuiGrid",e)}var O=["auto",!0,1,2,3,4,5,6,7,8,9,10,11,12],h=Object(f.a)("MuiGrid",["root","container","item","zeroMinWidth"].concat(Object(a.a)([0,1,2,3,4,5,6,7,8,9,10].map((function(e){return"spacing-xs-".concat(e)}))),Object(a.a)(["column-reverse","column","row-reverse","row"].map((function(e){return"direction-xs-".concat(e)}))),Object(a.a)(["nowrap","wrap-reverse","wrap"].map((function(e){return"wrap-xs-".concat(e)}))),Object(a.a)(O.map((function(e){return"grid-xs-".concat(e)}))),Object(a.a)(O.map((function(e){return"grid-sm-".concat(e)}))),Object(a.a)(O.map((function(e){return"grid-md-".concat(e)}))),Object(a.a)(O.map((function(e){return"grid-lg-".concat(e)}))),Object(a.a)(O.map((function(e){return"grid-xl-".concat(e)}))))),v=n(0),x=["className","columns","columnSpacing","component","container","direction","item","lg","md","rowSpacing","sm","spacing","wrap","xl","xs","zeroMinWidth"];function w(e){var t=parseFloat(e);return"".concat(t).concat(String(e).replace(String(t),"")||"px")}function S(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(!t||!e||e<=0)return[];if("string"===typeof e&&!Number.isNaN(Number(e))||"number"===typeof e)return[n["spacing-xs-".concat(String(e))]||"spacing-xs-".concat(String(e))];var a=e.xs,c=e.sm,r=e.md,o=e.lg,i=e.xl;return[Number(a)>0&&(n["spacing-xs-".concat(String(a))]||"spacing-xs-".concat(String(a))),Number(c)>0&&(n["spacing-sm-".concat(String(c))]||"spacing-sm-".concat(String(c))),Number(r)>0&&(n["spacing-md-".concat(String(r))]||"spacing-md-".concat(String(r))),Number(o)>0&&(n["spacing-lg-".concat(String(o))]||"spacing-lg-".concat(String(o))),Number(i)>0&&(n["spacing-xl-".concat(String(i))]||"spacing-xl-".concat(String(i)))]}var k=Object(b.a)("div",{name:"MuiGrid",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState,c=n.container,r=n.direction,o=n.item,i=n.lg,u=n.md,s=n.sm,d=n.spacing,l=n.wrap,b=n.xl,p=n.xs,m=n.zeroMinWidth;return[t.root,c&&t.container,o&&t.item,m&&t.zeroMinWidth].concat(Object(a.a)(S(d,c,t)),["row"!==r&&t["direction-xs-".concat(String(r))],"wrap"!==l&&t["wrap-xs-".concat(String(l))],!1!==p&&t["grid-xs-".concat(String(p))],!1!==s&&t["grid-sm-".concat(String(s))],!1!==u&&t["grid-md-".concat(String(u))],!1!==i&&t["grid-lg-".concat(String(i))],!1!==b&&t["grid-xl-".concat(String(b))]])}})((function(e){var t=e.ownerState;return Object(o.a)({boxSizing:"border-box"},t.container&&{display:"flex",flexWrap:"wrap",width:"100%"},t.item&&{margin:0},t.zeroMinWidth&&{minWidth:0},"nowrap"===t.wrap&&{flexWrap:"nowrap"},"reverse"===t.wrap&&{flexWrap:"wrap-reverse"})}),(function(e){var t=e.theme,n=e.ownerState,a=Object(s.d)({values:n.direction,breakpoints:t.breakpoints.values});return Object(s.b)({theme:t},a,(function(e){var t={flexDirection:e};return 0===e.indexOf("column")&&(t["& > .".concat(h.item)]={maxWidth:"none"}),t}))}),(function(e){var t=e.theme,n=e.ownerState,a=n.container,r=n.rowSpacing,o={};if(a&&0!==r){var i=Object(s.d)({values:r,breakpoints:t.breakpoints.values});o=Object(s.b)({theme:t},i,(function(e){var n=t.spacing(e);return"0px"!==n?Object(c.a)({marginTop:"-".concat(w(n))},"& > .".concat(h.item),{paddingTop:w(n)}):{}}))}return o}),(function(e){var t=e.theme,n=e.ownerState,a=n.container,r=n.columnSpacing,o={};if(a&&0!==r){var i=Object(s.d)({values:r,breakpoints:t.breakpoints.values});o=Object(s.b)({theme:t},i,(function(e){var n=t.spacing(e);return"0px"!==n?Object(c.a)({width:"calc(100% + ".concat(w(n),")"),marginLeft:"-".concat(w(n))},"& > .".concat(h.item),{paddingLeft:w(n)}):{}}))}return o}),(function(e){var t=e.theme,n=e.ownerState;return t.breakpoints.keys.reduce((function(e,a){return function(e,t,n,a){var c=a[n];if(c){var r={};if(!0===c)r={flexBasis:0,flexGrow:1,maxWidth:"100%"};else if("auto"===c)r={flexBasis:"auto",flexGrow:0,flexShrink:0,maxWidth:"none",width:"auto"};else{var i=Object(s.d)({values:a.columns,breakpoints:t.breakpoints.values}),u="object"===typeof i?i[n]:i,d="".concat(Math.round(c/u*1e8)/1e6,"%"),l={};if(a.container&&a.item&&0!==a.columnSpacing){var b=t.spacing(a.columnSpacing);if("0px"!==b){var p="calc(".concat(d," + ").concat(w(b),")");l={flexBasis:p,maxWidth:p}}}r=Object(o.a)({flexBasis:d,flexGrow:0,maxWidth:d},l)}0===t.breakpoints.values[n]?Object.assign(e,r):e[t.breakpoints.up(n)]=r}}(e,t,a,n),e}),{})})),y=i.forwardRef((function(e,t){var n,c=Object(p.a)({props:e,name:"MuiGrid"}),s=Object(d.a)(c),b=s.className,g=s.columns,f=s.columnSpacing,O=s.component,h=void 0===O?"div":O,w=s.container,y=void 0!==w&&w,C=s.direction,R=void 0===C?"row":C,M=s.item,z=void 0!==M&&M,B=s.lg,N=void 0!==B&&B,W=s.md,F=void 0!==W&&W,I=s.rowSpacing,G=s.sm,T=void 0!==G&&G,P=s.spacing,E=void 0===P?0:P,L=s.wrap,V=void 0===L?"wrap":L,D=s.xl,q=void 0!==D&&D,A=s.xs,H=void 0!==A&&A,J=s.zeroMinWidth,X=void 0!==J&&J,K=Object(r.a)(s,x),Q=I||E,U=f||E,Y=i.useContext(m),Z=g||Y||12,$=Object(o.a)({},s,{columns:Z,container:y,direction:R,item:z,lg:N,md:F,sm:T,rowSpacing:Q,columnSpacing:U,wrap:V,xl:q,xs:H,zeroMinWidth:X}),_=function(e){var t=e.classes,n=e.container,c=e.direction,r=e.item,o=e.lg,i=e.md,u=e.sm,s=e.spacing,d=e.wrap,b=e.xl,p=e.xs,m={root:["root",n&&"container",r&&"item",e.zeroMinWidth&&"zeroMinWidth"].concat(Object(a.a)(S(s,n)),["row"!==c&&"direction-xs-".concat(String(c)),"wrap"!==d&&"wrap-xs-".concat(String(d)),!1!==p&&"grid-xs-".concat(String(p)),!1!==u&&"grid-sm-".concat(String(u)),!1!==i&&"grid-md-".concat(String(i)),!1!==o&&"grid-lg-".concat(String(o)),!1!==b&&"grid-xl-".concat(String(b))])};return Object(l.a)(m,j,t)}($);return n=Object(v.jsx)(k,Object(o.a)({ownerState:$,className:Object(u.a)(_.root,b),as:h,ref:t},K)),12!==Z?Object(v.jsx)(m.Provider,{value:Z,children:n}):n}));t.a=y},483:function(e,t,n){"use strict";var a=n(5),c=n(4),r=n(3),o=n(2),i=(n(12),n(8)),u=n(94),s=n(118),d=n(11),l=n(430),b=n(14),p=n(9),m=n(70),g=n(95);function f(e){return Object(m.a)("MuiSwitch",e)}var j=Object(g.a)("MuiSwitch",["root","edgeStart","edgeEnd","switchBase","colorPrimary","colorSecondary","sizeSmall","sizeMedium","checked","disabled","input","thumb","track"]),O=n(0),h=["className","color","edge","size","sx"],v=Object(p.a)("span",{name:"MuiSwitch",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,n.edge&&t["edge".concat(Object(d.a)(n.edge))],t["size".concat(Object(d.a)(n.size))]]}})((function(e){var t,n=e.ownerState;return Object(r.a)({display:"inline-flex",width:58,height:38,overflow:"hidden",padding:12,boxSizing:"border-box",position:"relative",flexShrink:0,zIndex:0,verticalAlign:"middle","@media print":{colorAdjust:"exact"}},"start"===n.edge&&{marginLeft:-8},"end"===n.edge&&{marginRight:-8},"small"===n.size&&(t={width:40,height:24,padding:7},Object(a.a)(t,"& .".concat(j.thumb),{width:16,height:16}),Object(a.a)(t,"& .".concat(j.switchBase),Object(a.a)({padding:4},"&.".concat(j.checked),{transform:"translateX(16px)"})),t))})),x=Object(p.a)(l.a,{name:"MuiSwitch",slot:"SwitchBase",overridesResolver:function(e,t){var n=e.ownerState;return[t.switchBase,Object(a.a)({},"& .".concat(j.input),t.input),"default"!==n.color&&t["color".concat(Object(d.a)(n.color))]]}})((function(e){var t,n=e.theme;return t={position:"absolute",top:0,left:0,zIndex:1,color:"light"===n.palette.mode?n.palette.common.white:n.palette.grey[300],transition:n.transitions.create(["left","transform"],{duration:n.transitions.duration.shortest})},Object(a.a)(t,"&.".concat(j.checked),{transform:"translateX(20px)"}),Object(a.a)(t,"&.".concat(j.disabled),{color:"light"===n.palette.mode?n.palette.grey[100]:n.palette.grey[600]}),Object(a.a)(t,"&.".concat(j.checked," + .").concat(j.track),{opacity:.5}),Object(a.a)(t,"&.".concat(j.disabled," + .").concat(j.track),{opacity:"light"===n.palette.mode?.12:.2}),Object(a.a)(t,"& .".concat(j.input),{left:"-100%",width:"300%"}),t}),(function(e){var t,n=e.theme,c=e.ownerState;return Object(r.a)({"&:hover":{backgroundColor:Object(s.a)(n.palette.action.active,n.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"default"!==c.color&&(t={},Object(a.a)(t,"&.".concat(j.checked),Object(a.a)({color:n.palette[c.color].main,"&:hover":{backgroundColor:Object(s.a)(n.palette[c.color].main,n.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"&.".concat(j.disabled),{color:"light"===n.palette.mode?Object(s.e)(n.palette[c.color].main,.62):Object(s.b)(n.palette[c.color].main,.55)})),Object(a.a)(t,"&.".concat(j.checked," + .").concat(j.track),{backgroundColor:n.palette[c.color].main}),t))})),w=Object(p.a)("span",{name:"MuiSwitch",slot:"Track",overridesResolver:function(e,t){return t.track}})((function(e){var t=e.theme;return{height:"100%",width:"100%",borderRadius:7,zIndex:-1,transition:t.transitions.create(["opacity","background-color"],{duration:t.transitions.duration.shortest}),backgroundColor:"light"===t.palette.mode?t.palette.common.black:t.palette.common.white,opacity:"light"===t.palette.mode?.38:.3}})),S=Object(p.a)("span",{name:"MuiSwitch",slot:"Thumb",overridesResolver:function(e,t){return t.thumb}})((function(e){return{boxShadow:e.theme.shadows[1],backgroundColor:"currentColor",width:20,height:20,borderRadius:"50%"}})),k=o.forwardRef((function(e,t){var n=Object(b.a)({props:e,name:"MuiSwitch"}),a=n.className,o=n.color,s=void 0===o?"primary":o,l=n.edge,p=void 0!==l&&l,m=n.size,g=void 0===m?"medium":m,j=n.sx,k=Object(c.a)(n,h),y=Object(r.a)({},n,{color:s,edge:p,size:g}),C=function(e){var t=e.classes,n=e.edge,a=e.size,c=e.color,o=e.checked,i=e.disabled,s={root:["root",n&&"edge".concat(Object(d.a)(n)),"size".concat(Object(d.a)(a))],switchBase:["switchBase","color".concat(Object(d.a)(c)),o&&"checked",i&&"disabled"],thumb:["thumb"],track:["track"],input:["input"]},l=Object(u.a)(s,f,t);return Object(r.a)({},t,l)}(y),R=Object(O.jsx)(S,{className:C.thumb,ownerState:y});return Object(O.jsxs)(v,{className:Object(i.a)(C.root,a),sx:j,ownerState:y,children:[Object(O.jsx)(x,Object(r.a)({type:"checkbox",icon:R,checkedIcon:R,ref:t,ownerState:y},k,{classes:Object(r.a)({},C,{root:C.switchBase})})),Object(O.jsx)(w,{className:C.track,ownerState:y})]})}));t.a=k},494:function(e,t,n){"use strict";var a=n(5),c=n(4),r=n(3),o=n(2),i=(n(12),n(8)),u=n(94),s=n(118),d=n(9),l=n(14),b=n(35),p=n(378),m=n(76),g=n(21),f=n(208),j=n(209),O=n(93),h=n(70),v=n(95);function x(e){return Object(h.a)("MuiMenuItem",e)}var w=Object(v.a)("MuiMenuItem",["root","focusVisible","dense","disabled","divider","gutters","selected"]),S=n(0),k=["autoFocus","component","dense","divider","disableGutters","focusVisibleClassName","role","tabIndex"],y=Object(d.a)(p.a,{shouldForwardProp:function(e){return Object(d.b)(e)||"classes"===e},name:"MuiMenuItem",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,n.dense&&t.dense,n.divider&&t.divider,!n.disableGutters&&t.gutters]}})((function(e){var t,n=e.theme,c=e.ownerState;return Object(r.a)({},n.typography.body1,{display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",whiteSpace:"nowrap"},!c.disableGutters&&{paddingLeft:16,paddingRight:16},c.divider&&{borderBottom:"1px solid ".concat(n.palette.divider),backgroundClip:"padding-box"},(t={"&:hover":{textDecoration:"none",backgroundColor:n.palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}}},Object(a.a)(t,"&.".concat(w.selected),Object(a.a)({backgroundColor:Object(s.a)(n.palette.primary.main,n.palette.action.selectedOpacity)},"&.".concat(w.focusVisible),{backgroundColor:Object(s.a)(n.palette.primary.main,n.palette.action.selectedOpacity+n.palette.action.focusOpacity)})),Object(a.a)(t,"&.".concat(w.selected,":hover"),{backgroundColor:Object(s.a)(n.palette.primary.main,n.palette.action.selectedOpacity+n.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:Object(s.a)(n.palette.primary.main,n.palette.action.selectedOpacity)}}),Object(a.a)(t,"&.".concat(w.focusVisible),{backgroundColor:n.palette.action.focus}),Object(a.a)(t,"&.".concat(w.disabled),{opacity:n.palette.action.disabledOpacity}),Object(a.a)(t,"& + .".concat(f.a.root),{marginTop:n.spacing(1),marginBottom:n.spacing(1)}),Object(a.a)(t,"& + .".concat(f.a.inset),{marginLeft:52}),Object(a.a)(t,"& .".concat(O.a.root),{marginTop:0,marginBottom:0}),Object(a.a)(t,"& .".concat(O.a.inset),{paddingLeft:36}),Object(a.a)(t,"& .".concat(j.a.root),{minWidth:36}),t),!c.dense&&Object(a.a)({},n.breakpoints.up("sm"),{minHeight:"auto"}),c.dense&&Object(r.a)({minHeight:32,paddingTop:4,paddingBottom:4},n.typography.body2,Object(a.a)({},"& .".concat(j.a.root," svg"),{fontSize:"1.25rem"})))})),C=o.forwardRef((function(e,t){var n=Object(l.a)({props:e,name:"MuiMenuItem"}),a=n.autoFocus,s=void 0!==a&&a,d=n.component,p=void 0===d?"li":d,f=n.dense,j=void 0!==f&&f,O=n.divider,h=void 0!==O&&O,v=n.disableGutters,w=void 0!==v&&v,C=n.focusVisibleClassName,R=n.role,M=void 0===R?"menuitem":R,z=n.tabIndex,B=Object(c.a)(n,k),N=o.useContext(b.a),W={dense:j||N.dense||!1,disableGutters:w},F=o.useRef(null);Object(m.a)((function(){s&&F.current&&F.current.focus()}),[s]);var I,G=Object(r.a)({},n,{dense:W.dense,divider:h,disableGutters:w}),T=function(e){var t=e.disabled,n=e.dense,a=e.divider,c=e.disableGutters,o=e.selected,i=e.classes,s={root:["root",n&&"dense",t&&"disabled",!c&&"gutters",a&&"divider",o&&"selected"]},d=Object(u.a)(s,x,i);return Object(r.a)({},i,d)}(n),P=Object(g.a)(F,t);return n.disabled||(I=void 0!==z?z:-1),Object(S.jsx)(b.a.Provider,{value:W,children:Object(S.jsx)(y,Object(r.a)({ref:P,role:M,tabIndex:I,component:p,focusVisibleClassName:Object(i.a)(T.focusVisible,C)},B,{ownerState:G,classes:T}))})}));t.a=C},985:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var a=n(2);function c(e,t){return e===t}function r(e){return"function"===typeof e?function(){return e}:e}function o(e,t,n){var o=n&&n.equalityFn||c,i=function(e){var t=Object(a.useState)(r(e)),n=t[0],c=t[1];return[n,Object(a.useCallback)((function(e){return c(r(e))}),[])]}(e),u=i[0],s=i[1],d=function(e,t,n){var c=this,r=Object(a.useRef)(null),o=Object(a.useRef)(0),i=Object(a.useRef)(null),u=Object(a.useRef)([]),s=Object(a.useRef)(),d=Object(a.useRef)(),l=Object(a.useRef)(e),b=Object(a.useRef)(!0);l.current=e;var p=!t&&0!==t&&"undefined"!==typeof window;if("function"!==typeof e)throw new TypeError("Expected a function");t=+t||0;var m=!!(n=n||{}).leading,g=!("trailing"in n)||!!n.trailing,f="maxWait"in n,j=f?Math.max(+n.maxWait||0,t):null,O=Object(a.useCallback)((function(e){var t=u.current,n=s.current;return u.current=s.current=null,o.current=e,d.current=l.current.apply(n,t)}),[]),h=Object(a.useCallback)((function(e,t){p&&cancelAnimationFrame(i.current),i.current=p?requestAnimationFrame(e):setTimeout(e,t)}),[p]),v=Object(a.useCallback)((function(e){if(!b.current)return!1;var n=e-r.current,a=e-o.current;return!r.current||n>=t||n<0||f&&a>=j}),[j,f,t]),x=Object(a.useCallback)((function(e){return i.current=null,g&&u.current?O(e):(u.current=s.current=null,d.current)}),[O,g]),w=Object(a.useCallback)((function(){var e=Date.now();if(v(e))return x(e);if(b.current){var n=e-r.current,a=e-o.current,c=t-n,i=f?Math.min(c,j-a):c;h(w,i)}}),[j,f,v,h,x,t]),S=Object(a.useCallback)((function(){i.current&&(p?cancelAnimationFrame(i.current):clearTimeout(i.current)),o.current=0,u.current=r.current=s.current=i.current=null}),[p]),k=Object(a.useCallback)((function(){return i.current?x(Date.now()):d.current}),[x]);Object(a.useEffect)((function(){return b.current=!0,function(){b.current=!1}}),[]);var y=Object(a.useCallback)((function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var a=Date.now(),l=v(a);if(u.current=e,s.current=c,r.current=a,l){if(!i.current&&b.current)return o.current=r.current,h(w,t),m?O(r.current):d.current;if(f)return h(w,t),O(r.current)}return i.current||h(w,t),d.current}),[O,m,f,v,h,w,t]),C=Object(a.useCallback)((function(){return!!i.current}),[]);return Object(a.useMemo)((function(){return{callback:y,cancel:S,flush:k,pending:C}}),[y,S,k,C])}(Object(a.useCallback)((function(e){return s(e)}),[s]),t,n),l=Object(a.useRef)(e);return Object(a.useEffect)((function(){o(l.current,e)||(d.callback(e),l.current=e)}),[e,d,o]),[u,{cancel:d.cancel,pending:d.pending,flush:d.flush}]}}}]);
//# sourceMappingURL=108.20aed5a6.chunk.js.map