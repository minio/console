(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[34],{377:function(e,t,n){"use strict";n(1);var a=n(552),o=n(290),i=n(299),c=n(94),r=n(38),l=n(71),s=n(72),d=n(401),u=n(0),b=Object(r.b)((function(e){return{sidebarOpen:e.system.sidebarOpen,operatorMode:e.system.operatorMode}}),null);t.a=b(Object(i.a)((function(e){return Object(o.a)({headerContainer:{width:"100%",minHeight:79,display:"flex",backgroundColor:"#fff",left:0,boxShadow:"rgba(0,0,0,.08) 0 3px 10px"},label:{display:"flex",justifyContent:"flex-start",alignItems:"center"},labelStyle:{color:"#000",fontSize:18,fontWeight:700,marginLeft:34,marginTop:8},rightMenu:{textAlign:"right"},logo:{marginLeft:34,fill:e.palette.primary.main,"& .min-icon":{width:120}}})}))((function(e){var t=e.classes,n=e.label,o=e.actions,i=e.sidebarOpen,r=e.operatorMode;return Object(u.jsxs)(a.a,{container:!0,className:t.headerContainer,direction:"row",alignItems:"center",children:[Object(u.jsx)(d.a,{display:{xs:"block",sm:"block",md:"none"},children:Object(u.jsx)(a.a,{item:!0,xs:12,style:{height:10},children:"\xa0"})}),Object(u.jsxs)(a.a,{item:!0,xs:12,sm:12,md:6,className:t.label,children:[!i&&Object(u.jsx)("div",{className:t.logo,children:r?Object(u.jsx)(l.a,{}):Object(u.jsx)(s.a,{})}),Object(u.jsx)(c.a,{variant:"h4",className:t.labelStyle,children:n})]}),o&&Object(u.jsx)(a.a,{item:!0,xs:12,sm:12,md:6,className:t.rightMenu,children:o})]})})))},380:function(e,t,n){"use strict";var a=n(14),o=n(15),i=n(2),c=n(1),r=n.n(c),l=n(44),s=n.n(l),d=n(384),u=n.n(d),b=n(94),h=n(367),j=n(899),p=n(552),g=n(366),f=n(355),m=n(709),x=n(444),O=n(290),v=n(299),w=n(527),y=n(436),C=n.n(y),S=n(430),k=n.n(S),N=n(435),T=n.n(N),R=n(19),M=n(365),I="#081C42",B="#081C42",z=n(0),F=function(e){var t=e.active,n=void 0!==t&&t;return Object(z.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(z.jsx)("path",{fill:n?B:I,d:"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"})})},L=function(e){var t=e.active,n=void 0!==t&&t;return Object(z.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(z.jsx)("path",{fill:n?B:I,d:"M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3v-3h18v3z"})})},P=function(e){var t=e.active,n=void 0!==t&&t;return Object(z.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",children:Object(z.jsx)("path",{fill:n?B:I,d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"})})},D=function(e){var t=e.active,n=void 0!==t&&t;return Object(z.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(z.jsx)("path",{fill:n?B:I,d:"M20 16h2v-2h-2v2zm0-9v5h2V7h-2zM10 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"})})},W=n(130),_=n(131),A=n(121),H=n(132),E=Object(v.a)((function(){return Object(O.a)({spacing:{margin:"0 8px"},buttonDisabled:{"&.MuiButtonBase-root.Mui-disabled":{cursor:"not-allowed",filter:"grayscale(100%)",opacity:"30%"}}})}))((function(e){var t=e.type,n=e.onClick,a=e.valueToSend,o=e.idField,i=e.selected,c=e.to,r=e.sendOnlyId,l=void 0!==r&&r,s=e.disabled,d=void 0!==s&&s,b=e.classes,j=e.label,p=l?a[o]:a,g="string"===typeof t?function(e,t){switch(e){case"view":case"preview":return Object(z.jsx)(A.nb,{});case"edit":return Object(z.jsx)(W.a,{});case"delete":return Object(z.jsx)(_.a,{});case"description":return Object(z.jsx)(A.X,{});case"share":return Object(z.jsx)(A.Ab,{});case"cloud":return Object(z.jsx)(F,{active:t});case"console":return Object(z.jsx)(L,{active:t});case"download":return Object(z.jsx)(H.a,{});case"disable":return Object(z.jsx)(P,{active:t});case"format":return Object(z.jsx)(D,{active:t})}return null}(t,i):t,f=Object(z.jsx)(h.a,{"aria-label":"string"===typeof t?t:"",size:"small",className:"".concat(b.spacing," ").concat(d?b.buttonDisabled:""),disabled:d,onClick:n?function(e){e.stopPropagation(),d?e.preventDefault():n(p)}:function(){return null},children:g});return j&&""!==j&&(f=Object(z.jsx)(M.a,{title:j,children:f})),n?f:u()(c)?d?f:Object(z.jsx)(R.a,{to:"".concat(c,"/").concat(p),onClick:function(e){e.stopPropagation()},children:f}):null})),K=n(45),G=n(120),V=n(389),U="#9c9c9c80",J={fontWeight:400,fontSize:14,borderColor:U,borderWidth:"0.5px",height:40,transitionDuration:"0.3s",padding:"initial",paddingRight:6,paddingLeft:6},q=function(e,t,n,a,i,r,l,d,b,h,j){var p=function(e,t,n,a,i,c,r){var l=Object(o.a)(e);c&&(l=e.filter((function(e){return r.includes(e.elementKey)})));var s=t;return a&&(s-=45),i&&(s-=n),l.reduce((function(e,t){return t.width?e-t.width:e}),s)/l.filter((function(e){return!e.width})).length}(e,t,n,a,i,d,b);return e.map((function(e,t){if(d&&!b.includes(e.elementKey))return null;var n=!e.enableSort||!e.enableSort;return Object(z.jsx)(x.b,{dataKey:e.elementKey,headerClassName:"titleHeader ".concat(e.headerTextAlign?"text-".concat(e.headerTextAlign):""),headerRenderer:function(){return Object(z.jsxs)(c.Fragment,{children:[h===e.elementKey&&Object(z.jsx)(c.Fragment,{children:"ASC"===j?Object(z.jsx)(T.a,{}):Object(z.jsx)(k.a,{})}),e.label]})},className:e.contentTextAlign?"text-".concat(e.contentTextAlign):"",cellRenderer:function(t){var n=t.rowData,a=!!r&&r.includes(u()(n)?n:n[l]);return function(e,t,n){var a=u()(e)?e:s()(e,t.elementKey,null),o=t.renderFullObject?e:a,i=t.renderFunction?t.renderFunction(o):o;return Object(z.jsx)(c.Fragment,{children:Object(z.jsx)("span",{className:n?"selected":"",children:i})})}(n,e,a)},width:e.width||p,disableSort:n,defaultSortDirection:"ASC"},"col-tb-".concat(t.toString()))}))};t.a=Object(v.a)((function(){return Object(O.a)(Object(i.a)(Object(i.a)({dialogContainer:{padding:"12px 26px 22px"},paper:{display:"flex",overflow:"auto",flexDirection:"column",padding:"8px 16px",boxShadow:"none",border:"#EAEDEE 1px solid",borderRadius:3,minHeight:200,overflowY:"scroll",position:"relative","&::-webkit-scrollbar":{width:3,height:3}},noBackground:{backgroundColor:"transparent",border:0},disabled:{backgroundColor:"#fbfafa",color:"#cccccc"},defaultPaperHeight:{height:"calc(100vh - 205px)"},allTableSettings:{"& .MuiTableCell-sizeSmall:last-child":{paddingRight:"initial"},"& .MuiTableCell-body.MuiTableCell-sizeSmall:last-child":{paddingRight:6}},minTableHeader:{color:"#393939","& tr":{"& th":{fontWeight:700,fontSize:14,borderColor:"#39393980",borderWidth:"0.5px",padding:"6px 0 10px"}}},rowUnselected:Object(i.a)(Object(i.a)({},J),{},{color:"#393939"}),rowSelected:Object(i.a)(Object(i.a)({},J),{},{color:"#081C42",fontWeight:600}),paginatorContainer:{display:"flex",justifyContent:"flex-end",padding:"5px 38px"},checkBoxHeader:{width:50,textAlign:"left",paddingRight:10,"&.MuiTableCell-paddingCheckbox":{paddingBottom:4,paddingLeft:0}},actionsContainer:{width:150,borderColor:U},paginatorComponent:{borderBottom:0},checkBoxRow:{borderColor:U,padding:"0 10px 0 0"},loadingBox:{paddingTop:"100px",paddingBottom:"100px"},overlayColumnSelection:{position:"absolute",right:0,top:0},popoverContent:{maxHeight:250,overflowY:"auto",padding:"0 10px 10px"},shownColumnsLabel:{color:"#9c9c9c",fontSize:12,padding:10,borderBottom:"#eaeaea 1px solid",width:"100%"},"@global":{".rowLine":{borderBottom:"1px solid ".concat(U),height:40,color:"#393939",fontSize:14,transitionDuration:.3,"&:focus":{outline:"initial"},"&:hover:not(.ReactVirtualized__Table__headerRow)":{userSelect:"none",backgroundColor:"#ececec",fontWeight:600,"&.canClick":{cursor:"pointer"},"&.canSelectText":{userSelect:"text"}},"& .selected":{color:"#081C42",fontWeight:600}},".headerItem":{userSelect:"none",fontWeight:700,fontSize:14,fontStyle:"initial",display:"flex",alignItems:"center",outline:"none"},".ReactVirtualized__Table__headerRow":{fontWeight:700,fontSize:14,borderColor:"#39393980",textTransform:"initial"},".optionsAlignment":{textAlign:"center","& .min-icon":{width:16,height:16}},".text-center":{textAlign:"center"},".text-right":{textAlign:"right"},".progress-enabled":{paddingTop:3,display:"inline-block",margin:"0 10px",position:"relative",width:18,height:18},".progress-enabled > .MuiCircularProgress-root":{position:"absolute",left:0,top:3}}},G.c),G.q))}))((function(e){var t=e.itemActions,n=e.columns,o=e.onSelect,i=e.records,l=e.isLoading,s=e.loadingMessage,d=void 0===s?Object(z.jsx)(b.a,{component:"h3",children:"Loading..."}):s,O=e.entityName,v=e.selectedItems,y=e.idField,S=e.classes,k=e.radioSelection,N=void 0!==k&&k,T=e.customEmptyMessage,R=void 0===T?"":T,M=e.customPaperHeight,I=void 0===M?"":M,B=e.noBackground,F=void 0!==B&&B,L=e.columnsSelector,P=void 0!==L&&L,D=e.textSelectable,W=void 0!==D&&D,_=e.columnsShown,A=void 0===_?[]:_,H=e.onColumnChange,G=void 0===H?function(e,t){}:H,U=e.infiniteScrollConfig,J=e.sortConfig,Y=e.autoScrollToBottom,X=void 0!==Y&&Y,Q=e.disabled,Z=void 0!==Q&&Q,$=Object(c.useState)(!1),ee=Object(a.a)($,2),te=ee[0],ne=ee[1],ae=r.a.useState(null),oe=Object(a.a)(ae,2),ie=oe[0],ce=oe[1],re=t?t.find((function(e){return"view"===e.type})):null,le=function(e){ne(!te),ce(e.currentTarget)},se=function(){ne(!1),ce(null)};return Object(z.jsx)(p.a,{item:!0,xs:12,children:Object(z.jsxs)(g.a,{className:"".concat(S.paper," ").concat(F?S.noBackground:"","\n        ").concat(Z?S.disabled:""," \n        ").concat(""!==I?I:S.defaultPaperHeight),children:[l&&Object(z.jsxs)(p.a,{container:!0,className:S.loadingBox,children:[Object(z.jsx)(p.a,{item:!0,xs:12,style:{textAlign:"center"},children:d}),Object(z.jsx)(p.a,{item:!0,xs:12,children:Object(z.jsx)(f.a,{})})]}),P&&!l&&i.length>0&&Object(z.jsx)("div",{className:S.overlayColumnSelection,children:function(e){return Object(z.jsxs)(c.Fragment,{children:[Object(z.jsx)(h.a,{"aria-describedby":"columnsSelector",color:"primary",onClick:le,size:"large",children:Object(z.jsx)(C.a,{fontSize:"inherit"})}),Object(z.jsxs)(j.a,{anchorEl:ie,id:"columnsSelector",open:te,anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"},onClose:se,children:[Object(z.jsx)("div",{className:S.shownColumnsLabel,children:"Shown Columns"}),Object(z.jsx)("div",{className:S.popoverContent,children:e.map((function(e){return Object(z.jsx)(V.a,{label:e.label,checked:A.includes(e.elementKey),onChange:function(t){G(e.elementKey,t.target.checked)},id:"chbox-".concat(e.label),name:"chbox-".concat(e.label),value:e.label},"tableColumns-".concat(e.label))}))})]})]})}(n)}),i&&!l&&i.length>0?Object(z.jsx)(x.c,{isRowLoaded:function(e){var t=e.index;return!!i[t]},loadMoreRows:U?U.loadMoreRecords:function(){return new Promise((function(){return!0}))},rowCount:U?U.recordsCount:i.length,children:function(e){var a=e.onRowsRendered,r=e.registerChild;return Object(z.jsx)(x.a,{children:function(e){var l=e.width,s=e.height,d=function(e,t){var n=45*t+15;return n<80?80:n>e?e:n}(l,t?t.filter((function(e){return"view"!==e.type})).length:0),b=!(!o||!v),h=!!(t&&t.length>1||t&&1===t.length&&"view"!==t[0].type);return Object(z.jsxs)(x.d,{ref:r,disableHeader:!1,headerClassName:"headerItem",headerHeight:40,height:s,noRowsRenderer:function(){return Object(z.jsx)(c.Fragment,{children:""!==R?R:"There are no ".concat(O," yet.")})},overscanRowCount:10,rowHeight:40,width:l,rowCount:i.length,rowGetter:function(e){var t=e.index;return i[t]},onRowClick:function(e){!function(e){if(re){var t=re.sendOnlyId?e[y]:e,n=!1;if(re.disableButtonFunction&&re.disableButtonFunction(t)&&(n=!0),re.to&&!n)return void K.b.push("".concat(re.to,"/").concat(t));re.onClick&&!n&&re.onClick(t)}}(e.rowData)},rowClassName:"rowLine ".concat(re?"canClick":""," ").concat(!re&&W?"canSelectText":""),onRowsRendered:a,sort:J?J.triggerSort:void 0,sortBy:J?J.currentSort:void 0,sortDirection:J?J.currentDirection:void 0,scrollToIndex:X?i.length-1:-1,children:[b&&Object(z.jsx)(x.b,{headerRenderer:function(){return Object(z.jsx)(c.Fragment,{children:"Select"})},dataKey:"select-".concat(y),width:45,disableSort:!0,cellRenderer:function(e){var t=e.rowData,n=!!v&&v.includes(u()(t)?t:t[y]);return Object(z.jsx)(m.a,{value:u()(t)?t:t[y],color:"primary",inputProps:{"aria-label":"secondary checkbox"},checked:n,onChange:o,onClick:function(e){e.stopPropagation()},checkedIcon:Object(z.jsx)("span",{className:N?S.radioSelectedIcon:S.checkedIcon}),icon:Object(z.jsx)("span",{className:N?S.radioUnselectedIcon:S.unCheckedIcon})})}}),q(n,l,d,b,h,v||[],y,P,A,J?J.currentSort:"",J?J.currentDirection:void 0),h&&Object(z.jsx)(x.b,{headerRenderer:function(){return Object(z.jsx)(c.Fragment,{children:"Options"})},dataKey:y,width:d,headerClassName:"optionsAlignment",className:"optionsAlignment",cellRenderer:function(e){var n=e.rowData,a=!!v&&v.includes(u()(n)?n:n[y]);return function(e,t,n,a){return e.map((function(e,o){if("view"===e.type)return null;var i="string"===typeof t?t:t[a],c=!1;return e.disableButtonFunction&&e.disableButtonFunction(i)&&(c=!0),e.showLoaderFunction&&e.showLoaderFunction(i)?Object(z.jsx)("div",{className:"progress-enabled",children:Object(z.jsx)(w.a,{color:"primary",size:18,variant:"indeterminate"},"actions-loader-".concat(e.type,"-").concat(o.toString()))}):Object(z.jsx)(E,{label:e.label,type:e.type,onClick:e.onClick,to:e.to,valueToSend:t,selected:n,idField:a,sendOnlyId:!!e.sendOnlyId,disabled:c},"actions-".concat(e.type,"-").concat(o.toString()))}))}(t||[],n,a,y)}})]})}})}}):Object(z.jsx)(c.Fragment,{children:!l&&Object(z.jsx)("div",{children:""!==R?R:"There are no ".concat(O," yet.")})})]})})}))},389:function(e,t,n){"use strict";var a=n(2),o=n(1),i=n.n(o),c=n(552),r=n(709),l=n(885),s=n(365),d=n(290),u=n(299),b=n(120),h=n(122),j=n(0);t.a=Object(u.a)((function(e){return Object(d.a)(Object(a.a)(Object(a.a)(Object(a.a)(Object(a.a)({},b.g),b.A),b.c),{},{fieldContainer:Object(a.a)(Object(a.a)({},b.g.fieldContainer),{},{display:"flex",justifyContent:"flex-start",alignItems:"center",margin:"15px 0",marginBottom:0,flexBasis:"initial"})}))}))((function(e){var t=e.label,n=e.onChange,a=e.value,o=e.id,d=e.name,u=e.checked,b=void 0!==u&&u,p=e.disabled,g=void 0!==p&&p,f=e.tooltip,m=void 0===f?"":f,x=e.classes;return Object(j.jsx)(i.a.Fragment,{children:Object(j.jsxs)(c.a,{item:!0,xs:12,className:x.fieldContainer,children:[Object(j.jsx)("div",{children:Object(j.jsx)(r.a,{name:d,id:o,value:a,color:"primary",inputProps:{"aria-label":"secondary checkbox"},checked:b,onChange:n,checkedIcon:Object(j.jsx)("span",{className:x.checkedIcon}),icon:Object(j.jsx)("span",{className:x.unCheckedIcon}),disabled:g})}),""!==t&&Object(j.jsxs)(l.a,{htmlFor:o,className:x.noMinWidthLabel,children:[Object(j.jsx)("span",{children:t}),""!==m&&Object(j.jsx)("div",{className:x.tooltipContainer,children:Object(j.jsx)(s.a,{title:m,placement:"top-start",children:Object(j.jsx)("div",{className:x.tooltip,children:Object(j.jsx)(h.a,{})})})})]})]})})}))},392:function(e,t,n){"use strict";n(1);var a=n(19),o=n(290),i=n(299),c=n(121),r=n(0);t.a=Object(i.a)((function(e){return Object(o.a)({link:{display:"flex",alignItems:"center",textDecoration:"none",maxWidth:"250px",padding:"2rem 2rem 0rem 2rem",color:e.palette.primary.light,fontSize:".8rem","&:hover":{textDecoration:"underline"}},icon:{marginRight:".3rem",display:"flex",alignItems:"center",justifyContent:"center"}})}))((function(e){var t=e.to,n=e.label,o=e.classes;return Object(r.jsxs)(a.a,{to:t,className:o.link,children:[Object(r.jsx)("div",{className:o.icon,children:Object(r.jsx)(c.f,{})}),Object(r.jsx)("div",{children:n})]})}))},401:function(e,t,n){"use strict";var a=n(3),o=n(4),i=n(1),c=(n(11),n(7)),r=n(98),l=n(343),s=n(353),d=n(56),u=n(0),b=["className","component"];var h=n(199),j=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.defaultTheme,n=Object(r.a)("div")(l.a),h=i.forwardRef((function(e,i){var r=Object(d.a)(t),l=Object(s.a)(e),h=l.className,j=l.component,p=void 0===j?"div":j,g=Object(o.a)(l,b);return Object(u.jsx)(n,Object(a.a)({as:p,ref:i,className:Object(c.a)(h,"MuiBox-root"),theme:r},g))}));return h}({defaultTheme:Object(h.a)()});t.a=j},461:function(e,t,n){var a;if("object"===typeof globalThis)a=globalThis;else try{a=n(462)}catch(r){}finally{if(a||"undefined"===typeof window||(a=window),!a)throw new Error("Could not determine global this")}var o=a.WebSocket||a.MozWebSocket,i=n(463);function c(e,t){return t?new o(e,t):new o(e)}o&&["CONNECTING","OPEN","CLOSING","CLOSED"].forEach((function(e){Object.defineProperty(c,e,{get:function(){return o[e]}})})),e.exports={w3cwebsocket:o?c:null,version:i}},462:function(e,t){var n=function(){if("object"===typeof self&&self)return self;if("object"===typeof window&&window)return window;throw new Error("Unable to resolve global `this`")};e.exports=function(){if(this)return this;if("object"===typeof globalThis&&globalThis)return globalThis;try{Object.defineProperty(Object.prototype,"__global__",{get:function(){return this},configurable:!0})}catch(e){return n()}try{return __global__||n()}finally{delete Object.prototype.__global__}}()},463:function(e,t,n){e.exports=n(464).version},464:function(e){e.exports=JSON.parse('{"name":"websocket","description":"Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.","keywords":["websocket","websockets","socket","networking","comet","push","RFC-6455","realtime","server","client"],"author":"Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)","contributors":["I\xf1aki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"],"version":"1.0.34","repository":{"type":"git","url":"https://github.com/theturtle32/WebSocket-Node.git"},"homepage":"https://github.com/theturtle32/WebSocket-Node","engines":{"node":">=4.0.0"},"dependencies":{"bufferutil":"^4.0.1","debug":"^2.2.0","es5-ext":"^0.10.50","typedarray-to-buffer":"^3.1.5","utf-8-validate":"^5.0.2","yaeti":"^0.0.6"},"devDependencies":{"buffer-equal":"^1.0.0","gulp":"^4.0.2","gulp-jshint":"^2.0.4","jshint-stylish":"^2.2.1","jshint":"^2.0.0","tape":"^4.9.1"},"config":{"verbose":false},"scripts":{"test":"tape test/unit/*.js","gulp":"gulp"},"main":"index","directories":{"lib":"./lib"},"browser":"lib/browser.js","license":"Apache-2.0"}')},465:function(e,t,n){"use strict";n.d(t,"a",(function(){return a})),n.d(t,"c",(function(){return o})),n.d(t,"b",(function(){return i})),n.d(t,"d",(function(){return c}));var a=1006,o=1008,i=1011,c=function(e){var t="ws";return"https:"===e&&(t="wss"),t}},554:function(e,t,n){"use strict";var a=n(5),o=n(4),i=n(3),c=n(1),r=(n(11),n(7)),l=n(92),s=n(116),d=n(8),u=n(12),b=n(34),h=n(359),j=n(48),p=n(18),g=n(192),f=n(193),m=n(91),x=n(67),O=n(93);function v(e){return Object(x.a)("MuiMenuItem",e)}var w=Object(O.a)("MuiMenuItem",["root","focusVisible","dense","disabled","divider","gutters","selected"]),y=n(0),C=["autoFocus","component","dense","divider","disableGutters","focusVisibleClassName","role","tabIndex"],S=Object(d.a)(h.a,{shouldForwardProp:function(e){return Object(d.b)(e)||"classes"===e},name:"MuiMenuItem",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,n.dense&&t.dense,n.divider&&t.divider,!n.disableGutters&&t.gutters]}})((function(e){var t,n=e.theme,o=e.ownerState;return Object(i.a)({},n.typography.body1,{display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",whiteSpace:"nowrap"},!o.disableGutters&&{paddingLeft:16,paddingRight:16},o.divider&&{borderBottom:"1px solid ".concat(n.palette.divider),backgroundClip:"padding-box"},(t={"&:hover":{textDecoration:"none",backgroundColor:n.palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}}},Object(a.a)(t,"&.".concat(w.selected),Object(a.a)({backgroundColor:Object(s.a)(n.palette.primary.main,n.palette.action.selectedOpacity)},"&.".concat(w.focusVisible),{backgroundColor:Object(s.a)(n.palette.primary.main,n.palette.action.selectedOpacity+n.palette.action.focusOpacity)})),Object(a.a)(t,"&.".concat(w.selected,":hover"),{backgroundColor:Object(s.a)(n.palette.primary.main,n.palette.action.selectedOpacity+n.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:Object(s.a)(n.palette.primary.main,n.palette.action.selectedOpacity)}}),Object(a.a)(t,"&.".concat(w.focusVisible),{backgroundColor:n.palette.action.focus}),Object(a.a)(t,"&.".concat(w.disabled),{opacity:n.palette.action.disabledOpacity}),Object(a.a)(t,"& + .".concat(g.a.root),{marginTop:n.spacing(1),marginBottom:n.spacing(1)}),Object(a.a)(t,"& + .".concat(g.a.inset),{marginLeft:52}),Object(a.a)(t,"& .".concat(m.a.root),{marginTop:0,marginBottom:0}),Object(a.a)(t,"& .".concat(m.a.inset),{paddingLeft:36}),Object(a.a)(t,"& .".concat(f.a.root),{minWidth:36}),t),!o.dense&&Object(a.a)({},n.breakpoints.up("sm"),{minHeight:"auto"}),o.dense&&Object(i.a)({minHeight:36},n.typography.body2,Object(a.a)({},"& .".concat(f.a.root," svg"),{fontSize:"1.25rem"})))})),k=c.forwardRef((function(e,t){var n=Object(u.a)({props:e,name:"MuiMenuItem"}),a=n.autoFocus,s=void 0!==a&&a,d=n.component,h=void 0===d?"li":d,g=n.dense,f=void 0!==g&&g,m=n.divider,x=void 0!==m&&m,O=n.disableGutters,w=void 0!==O&&O,k=n.focusVisibleClassName,N=n.role,T=void 0===N?"menuitem":N,R=n.tabIndex,M=Object(o.a)(n,C),I=c.useContext(b.a),B={dense:f||I.dense||!1,disableGutters:w},z=c.useRef(null);Object(j.a)((function(){s&&z.current&&z.current.focus()}),[s]);var F,L=Object(i.a)({},n,{dense:B.dense,divider:x,disableGutters:w}),P=function(e){var t=e.disabled,n=e.dense,a=e.divider,o=e.disableGutters,c=e.selected,r=e.classes,s={root:["root",n&&"dense",t&&"disabled",!o&&"gutters",a&&"divider",c&&"selected"]},d=Object(l.a)(s,v,r);return Object(i.a)({},r,d)}(n),D=Object(p.a)(z,t);return n.disabled||(F=void 0!==R?R:-1),Object(y.jsx)(b.a.Provider,{value:B,children:Object(y.jsx)(S,Object(i.a)({ref:D,role:T,tabIndex:F,component:h,focusVisibleClassName:Object(r.a)(P.focusVisible,k)},M,{ownerState:L,classes:P}))})}));t.a=k},860:function(e,t,n){"use strict";n.r(t);var a=n(14),o=n(2),i=n(1),c=n.n(i),r=n(710),l=n(552),s=n(898),d=n(882),u=n(554),b=n(884),h=n(369),j=n(461),p=n(38),g=n(290),f=n(299),m=n(114),x=n(55),O=n(465),v=n(120),w=n(380),y=n(377),C=n(50),S=n(392),k=n(0),N=Object(f.a)((function(e){return Object(g.a)({root:{width:450,lineHeight:"50px","label + &":{marginTop:e.spacing(3)},"& .MuiSelect-select:focus":{backgroundColor:"transparent"}},input:{height:50,fontSize:13,lineHeight:"50px",width:450}})}))(r.c),T=Object(p.b)((function(e){return{messages:e.watch.messages}}),{watchMessageReceived:m.c,watchResetMessages:m.d});t.default=T(Object(f.a)((function(e){return Object(g.a)(Object(o.a)(Object(o.a)(Object(o.a)({watchList:{background:"white",height:"400px",overflow:"auto","& ul":{margin:"4px",padding:"0px"},"& ul li":{listStyle:"none",margin:"0px",padding:"0px",borderBottom:"1px solid #dedede"}},searchPrefix:{flexGrow:1,marginLeft:15}},v.a),v.r),Object(v.e)(e.spacing(4))))}))((function(e){var t=e.classes,n=e.watchMessageReceived,o=e.watchResetMessages,r=e.messages,p=Object(i.useState)(!1),g=Object(a.a)(p,2),f=g[0],m=g[1],v=Object(i.useState)("Select Bucket"),T=Object(a.a)(v,2),R=T[0],M=T[1],I=Object(i.useState)(""),B=Object(a.a)(I,2),z=B[0],F=B[1],L=Object(i.useState)(""),P=Object(a.a)(L,2),D=P[0],W=P[1],_=Object(i.useState)([]),A=Object(a.a)(_,2),H=A[0],E=A[1];Object(i.useEffect)((function(){C.a.invoke("GET","/api/v1/buckets").then((function(e){var t=[];null!==e.buckets&&(t=e.buckets),E(t)})).catch((function(e){console.log(e)}))}),[]),Object(i.useEffect)((function(){if(o(),f&&H.some((function(e){return e.name===R}))){var e=new URL(window.location.toString()),t=e.port,a=Object(O.d)(e.protocol),i=new j.w3cwebsocket("".concat(a,"://").concat(e.hostname,":").concat(t,"/ws/watch/").concat(R,"?prefix=").concat(z,"&suffix=").concat(D)),c=null;if(null!==i)return i.onopen=function(){console.log("WebSocket Client Connected"),i.send("ok"),c=setInterval((function(){i.send("ok")}),1e4)},i.onmessage=function(e){var t=JSON.parse(e.data.toString());t.Time=new Date(t.Time.toString()),t.key=Math.random(),n(t)},i.onclose=function(){clearInterval(c),console.log("connection closed by server"),m(!1)},function(){i.close(1e3),clearInterval(c),console.log("closing websockets")}}else m(!1)}),[n,f,H,R,z,D,o]);var K=H.map((function(e){return{label:e.name,value:e.name}}));return Object(k.jsxs)(c.a.Fragment,{children:[Object(k.jsx)(y.a,{label:"Watch"}),Object(k.jsxs)(l.a,{container:!0,className:t.container,children:[Object(k.jsx)(l.a,{item:!0,xs:12,children:Object(k.jsx)(S.a,{to:"/tools",label:"Return to Tools"})}),Object(k.jsxs)(l.a,{item:!0,xs:12,children:[Object(k.jsxs)(l.a,{item:!0,xs:12,className:t.actionsTray,children:[Object(k.jsx)(s.a,{variant:"outlined",children:Object(k.jsxs)(d.a,{id:"bucket-name",name:"bucket-name",value:R,onChange:function(e){M(e.target.value)},className:t.searchField,disabled:f,input:Object(k.jsx)(N,{}),children:[Object(k.jsx)(u.a,{value:R,disabled:!0,children:"Select Bucket"},"select-bucket-name-default"),K.map((function(e){return Object(k.jsx)(u.a,{value:e.value,children:e.label},"select-bucket-name-".concat(e.label))}))]})}),Object(k.jsx)(b.a,{placeholder:"Prefix",className:"".concat(t.searchField," ").concat(t.searchPrefix),id:"prefix-resource",label:"",disabled:f,InputProps:{disableUnderline:!0},onChange:function(e){F(e.target.value)},variant:"standard"}),Object(k.jsx)(b.a,{placeholder:"Suffix",className:"".concat(t.searchField," ").concat(t.searchPrefix),id:"suffix-resource",label:"",disabled:f,InputProps:{disableUnderline:!0},onChange:function(e){W(e.target.value)},variant:"standard"}),Object(k.jsx)(h.a,{type:"submit",variant:"contained",color:"primary",disabled:f,onClick:function(){return m(!0)},children:"Start"})]}),Object(k.jsx)(l.a,{item:!0,xs:12,children:Object(k.jsx)("br",{})}),Object(k.jsx)(w.a,{columns:[{label:"Time",elementKey:"Time",renderFunction:x.s},{label:"Size",elementKey:"Size",renderFunction:x.l},{label:"Type",elementKey:"Type"},{label:"Path",elementKey:"Path"}],records:r,entityName:"Watch",customEmptyMessage:"No Changes at this time",idField:"watch_table",isLoading:!1})]})]})]})})))}}]);
//# sourceMappingURL=34.69562794.chunk.js.map