(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[95],{424:function(e,t,n){"use strict";var a=n(1),o=n(2),r=n(0);t.a=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;function n(n){return Object(r.jsx)(o.Suspense,{fallback:t,children:Object(r.jsx)(e,Object(a.a)({},n))})}return n}},433:function(e,t,n){"use strict";var a=n(3),o=n(4),r=n(2),i=(n(11),n(7)),c=n(99),s=n(354),u=n(364),b=n(59),d=n(0),l=["className","component"];var j=n(210),p=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.defaultTheme,n=Object(c.a)("div")(s.a),j=r.forwardRef((function(e,r){var c=Object(b.a)(t),s=Object(u.a)(e),j=s.className,p=s.component,m=void 0===p?"div":p,O=Object(o.a)(s,l);return Object(d.jsx)(n,Object(a.a)({as:m,ref:r,className:Object(i.a)(j,"MuiBox-root"),theme:c},O))}));return j}({defaultTheme:Object(j.a)()});t.a=p},644:function(e,t,n){"use strict";n(2);var a=n(365),o=n(433),r=n(95),i=n(783),c=n(782),s=n(0);function u(){return Object(s.jsxs)(r.a,{variant:"body2",color:"textSecondary",align:"center",children:["Copyright \xa9 ",Object(s.jsx)(c.a,{color:"inherit",href:"https://min.io/",children:"MinIO"})," ",(new Date).getFullYear(),"."]})}t.a=function(){return Object(s.jsxs)(i.a,{component:"main",children:[Object(s.jsx)(a.a,{}),Object(s.jsx)("div",{children:Object(s.jsx)(r.a,{variant:"h1",component:"h1",children:"404 Not Found"})}),Object(s.jsx)(o.a,{mt:5,children:Object(s.jsx)(u,{})})]})}},782:function(e,t,n){"use strict";var a=n(15),o=n(6),r=n(4),i=n(3),c=n(2),s=(n(11),n(7)),u=n(93),b=n(5),d=n(116),l=n(9),j=n(8),p=n(12),m=n(54),O=n(18),h=n(95),x=n(70),f=n(94);function v(e){return Object(x.a)("MuiLink",e)}var g=Object(f.a)("MuiLink",["root","underlineNone","underlineHover","underlineAlways","button","focusVisible"]),y=n(0),k=["className","color","component","onBlur","onFocus","TypographyClasses","underline","variant"],W={primary:"primary.main",textPrimary:"text.primary",secondary:"secondary.main",textSecondary:"text.secondary",error:"error.main"},w=Object(j.a)(h.a,{name:"MuiLink",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,t["underline".concat(Object(l.a)(n.underline))],"button"===n.component&&t.button]}})((function(e){var t=e.theme,n=e.ownerState,a=Object(b.b)(t,"palette.".concat(function(e){return W[e]||e}(n.color)))||n.color;return Object(i.a)({},"none"===n.underline&&{textDecoration:"none"},"hover"===n.underline&&{textDecoration:"none","&:hover":{textDecoration:"underline"}},"always"===n.underline&&{textDecoration:"underline",textDecorationColor:"inherit"!==a?Object(d.a)(a,.4):void 0,"&:hover":{textDecorationColor:"inherit"}},"button"===n.component&&Object(o.a)({position:"relative",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none","&::-moz-focus-inner":{borderStyle:"none"}},"&.".concat(g.focusVisible),{outline:"auto"}))})),S=c.forwardRef((function(e,t){var n=Object(p.a)({props:e,name:"MuiLink"}),o=n.className,b=n.color,d=void 0===b?"primary":b,j=n.component,h=void 0===j?"a":j,x=n.onBlur,f=n.onFocus,g=n.TypographyClasses,W=n.underline,S=void 0===W?"always":W,M=n.variant,R=void 0===M?"inherit":M,C=Object(r.a)(n,k),N=Object(m.a)(),G=N.isFocusVisibleRef,L=N.onBlur,D=N.onFocus,F=N.ref,V=c.useState(!1),z=Object(a.a)(V,2),B=z[0],T=z[1],A=Object(O.a)(t,F),P=Object(i.a)({},n,{color:d,component:h,focusVisible:B,underline:S,variant:R}),H=function(e){var t=e.classes,n=e.component,a=e.focusVisible,o=e.underline,r={root:["root","underline".concat(Object(l.a)(o)),"button"===n&&"button",a&&"focusVisible"]};return Object(u.a)(r,v,t)}(P);return Object(y.jsx)(w,Object(i.a)({className:Object(s.a)(H.root,o),classes:g,color:d,component:h,onBlur:function(e){L(e),!1===G.current&&T(!1),x&&x(e)},onFocus:function(e){D(e),!0===G.current&&T(!0),f&&f(e)},ref:A,ownerState:P,variant:R},C))}));t.a=S},783:function(e,t,n){"use strict";var a=n(6),o=n(4),r=n(3),i=n(2),c=(n(11),n(7)),s=n(93),u=n(12),b=n(8),d=n(70),l=n(94);function j(e){return Object(d.a)("MuiContainer",e)}Object(l.a)("MuiContainer",["root","disableGutters","fixed","maxWidthXs","maxWidthSm","maxWidthMd","maxWidthLg","maxWidthXl"]);var p=n(9),m=n(0),O=["className","component","disableGutters","fixed","maxWidth"],h=Object(b.a)("div",{name:"MuiContainer",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,t["maxWidth".concat(Object(p.a)(String(n.maxWidth)))],n.fixed&&t.fixed,n.disableGutters&&t.disableGutters]}})((function(e){var t=e.theme,n=e.ownerState;return Object(r.a)({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",display:"block"},!n.disableGutters&&Object(a.a)({paddingLeft:t.spacing(2),paddingRight:t.spacing(2)},t.breakpoints.up("sm"),{paddingLeft:t.spacing(3),paddingRight:t.spacing(3)}))}),(function(e){var t=e.theme;return e.ownerState.fixed&&Object.keys(t.breakpoints.values).reduce((function(e,n){var a=t.breakpoints.values[n];return 0!==a&&(e[t.breakpoints.up(n)]={maxWidth:"".concat(a).concat(t.breakpoints.unit)}),e}),{})}),(function(e){var t=e.theme,n=e.ownerState;return Object(r.a)({},"xs"===n.maxWidth&&Object(a.a)({},t.breakpoints.up("xs"),{maxWidth:Math.max(t.breakpoints.values.xs,444)}),n.maxWidth&&"xs"!==n.maxWidth&&Object(a.a)({},t.breakpoints.up(n.maxWidth),{maxWidth:"".concat(t.breakpoints.values[n.maxWidth]).concat(t.breakpoints.unit)}))})),x=i.forwardRef((function(e,t){var n=Object(u.a)({props:e,name:"MuiContainer"}),a=n.className,i=n.component,b=void 0===i?"div":i,d=n.disableGutters,l=void 0!==d&&d,x=n.fixed,f=void 0!==x&&x,v=n.maxWidth,g=void 0===v?"lg":v,y=Object(o.a)(n,O),k=Object(r.a)({},n,{component:b,disableGutters:l,fixed:f,maxWidth:g}),W=function(e){var t=e.classes,n=e.fixed,a=e.disableGutters,o=e.maxWidth,r={root:["root",o&&"maxWidth".concat(Object(p.a)(String(o))),n&&"fixed",a&&"disableGutters"]};return Object(s.a)(r,j,t)}(k);return Object(m.jsx)(h,Object(r.a)({as:b,ownerState:k,className:Object(c.a)(W.root,a),ref:t},y))}));t.a=x},939:function(e,t,n){"use strict";n.r(t);var a=n(2),o=n.n(a),r=n(53),i=n(19),c=n(39),s=n(31),u=n(644),b=n(424),d=n(0),l=Object(b.a)(o.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(115),n.e(49)]).then(n.bind(null,870))}))),j=Object(b.a)(o.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(4),n.e(25)]).then(n.bind(null,871))}))),p=Object(c.b)((function(e){return{open:e.system.sidebarOpen}}),{setMenuOpen:s.g});t.default=Object(i.i)(p((function(){return Object(d.jsx)(i.c,{history:r.a,children:Object(d.jsxs)(i.d,{children:[Object(d.jsx)(i.b,{path:"/policies/",exact:!0,component:l}),Object(d.jsx)(i.b,{path:"/policies/*",component:j}),Object(d.jsx)(i.b,{path:"/",component:l}),Object(d.jsx)(i.b,{component:u.a})]})})})))}}]);
//# sourceMappingURL=95.4b4807ce.chunk.js.map