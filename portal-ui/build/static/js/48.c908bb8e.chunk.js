(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[48],{396:function(e,t,n){"use strict";var r=n(15),a=n(14),o=n(1),i=n(2),c=n.n(i),l=n(46),s=n.n(l),d=n(394),u=n.n(d),b=n(95),j=n(378),h=n(972),p=n(436),m=n(377),v=n(366),O=n(778),f=n(443),x=n(300),g=n(310),y=n(476),w=n(442),S=n.n(w),C=n(441),k=n.n(C),F=n(440),R=n.n(F),T=n(21),N=n(376),z="#081C42",I="#081C42",P=n(0),B=function(e){var t=e.active,n=void 0!==t&&t;return Object(P.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(P.jsx)("path",{fill:n?I:z,d:"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"})})},M=function(e){var t=e.active,n=void 0!==t&&t;return Object(P.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(P.jsx)("path",{fill:n?I:z,d:"M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3v-3h18v3z"})})},L=function(e){var t=e.active,n=void 0!==t&&t;return Object(P.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",children:Object(P.jsx)("path",{fill:n?I:z,d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"})})},A=function(e){var t=e.active,n=void 0!==t&&t;return Object(P.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(P.jsx)("path",{fill:n?I:z,d:"M20 16h2v-2h-2v2zm0-9v5h2V7h-2zM10 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"})})},D=n(129),E=n(130),H=n(22),K=n(131),W=Object(g.a)((function(){return Object(x.a)({spacing:{margin:"0 8px"},buttonDisabled:{"&.MuiButtonBase-root.Mui-disabled":{cursor:"not-allowed",filter:"grayscale(100%)",opacity:"30%"}}})}))((function(e){var t=e.type,n=e.onClick,r=e.valueToSend,a=e.idField,o=e.selected,i=e.to,c=e.sendOnlyId,l=void 0!==c&&c,s=e.disabled,d=void 0!==s&&s,b=e.classes,h=e.label,p=l?r[a]:r,m="string"===typeof t?function(e,t){switch(e){case"view":case"preview":return Object(P.jsx)(H.sb,{});case"edit":return Object(P.jsx)(D.default,{});case"delete":return Object(P.jsx)(E.a,{});case"description":return Object(P.jsx)(H.Y,{});case"share":return Object(P.jsx)(H.Fb,{});case"cloud":return Object(P.jsx)(B,{active:t});case"console":return Object(P.jsx)(M,{active:t});case"download":return Object(P.jsx)(K.default,{});case"disable":return Object(P.jsx)(L,{active:t});case"format":return Object(P.jsx)(A,{active:t})}return null}(t,o):t,v=Object(P.jsx)(j.a,{"aria-label":"string"===typeof t?t:"",size:"small",className:"".concat(b.spacing," ").concat(d?b.buttonDisabled:""),disabled:d,onClick:n?function(e){e.stopPropagation(),d?e.preventDefault():n(p)}:function(){return null},children:m});return h&&""!==h&&(v=Object(P.jsx)(N.a,{title:h,children:v})),n?v:u()(i)?d?v:Object(P.jsx)(T.a,{to:"".concat(i,"/").concat(p),onClick:function(e){e.stopPropagation()},children:v}):null})),_=n(397),q=n(53),V=n(120),G=function(e,t,n,r,o,c,l,d,b,j,h){var p=function(e,t,n,r,o,i,c){var l=Object(a.a)(e);i&&(l=e.filter((function(e){return c.includes(e.elementKey)})));var s=t;return r&&(s-=45),o&&(s-=n),l.reduce((function(e,t){return t.width?e-t.width:e}),s)/l.filter((function(e){return!e.width})).length}(e,t,n,r,o,d,b);return e.map((function(e,t){if(d&&!b.includes(e.elementKey))return null;var n=!e.enableSort||!e.enableSort;return Object(P.jsx)(f.b,{dataKey:e.elementKey,headerClassName:"titleHeader ".concat(e.headerTextAlign?"text-".concat(e.headerTextAlign):""),headerRenderer:function(){return Object(P.jsxs)(i.Fragment,{children:[j===e.elementKey&&Object(P.jsx)(i.Fragment,{children:"ASC"===h?Object(P.jsx)(R.a,{}):Object(P.jsx)(k.a,{})}),e.label]})},className:e.contentTextAlign?"text-".concat(e.contentTextAlign):"",cellRenderer:function(t){var n=t.rowData,r=!!c&&c.includes(u()(n)?n:n[l]);return function(e,t,n){var r=u()(e)?e:s()(e,t.elementKey,null),a=t.renderFullObject?e:r,o=t.renderFunction?t.renderFunction(a):a;return Object(P.jsx)(i.Fragment,{children:Object(P.jsx)("span",{className:n?"selected":"",children:o})})}(n,e,r)},width:e.width||p,disableSort:n,defaultSortDirection:"ASC"},"col-tb-".concat(t.toString()))}))};t.a=Object(g.a)((function(){return Object(x.a)(Object(o.a)(Object(o.a)({paper:{display:"flex",overflow:"auto",flexDirection:"column",padding:"8px 16px",boxShadow:"none",border:"#EAEDEE 1px solid",borderRadius:3,minHeight:200,overflowY:"scroll",position:"relative","&::-webkit-scrollbar":{width:3,height:3}},noBackground:{backgroundColor:"transparent",border:0},disabled:{backgroundColor:"#fbfafa",color:"#cccccc"},defaultPaperHeight:{height:"calc(100vh - 205px)"},loadingBox:{paddingTop:"100px",paddingBottom:"100px"},overlayColumnSelection:{position:"absolute",right:0,top:0},popoverContent:{maxHeight:250,overflowY:"auto",padding:"0 10px 10px"},shownColumnsLabel:{color:"#9c9c9c",fontSize:12,padding:10,borderBottom:"#eaeaea 1px solid",width:"100%"},checkAllWrapper:{marginTop:-16},"@global":{".rowLine":{borderBottom:"1px solid ".concat("#9c9c9c80"),height:40,color:"#393939",fontSize:14,transitionDuration:.3,"&:focus":{outline:"initial"},"&:hover:not(.ReactVirtualized__Table__headerRow)":{userSelect:"none",backgroundColor:"#ececec",fontWeight:600,"&.canClick":{cursor:"pointer"},"&.canSelectText":{userSelect:"text"}},"& .selected":{color:"#081C42",fontWeight:600}},".headerItem":{userSelect:"none",fontWeight:700,fontSize:14,fontStyle:"initial",display:"flex",alignItems:"center",outline:"none"},".ReactVirtualized__Table__headerRow":{fontWeight:700,fontSize:14,borderColor:"#39393980",textTransform:"initial"},".optionsAlignment":{textAlign:"center","& .min-icon":{width:16,height:16}},".text-center":{textAlign:"center"},".text-right":{textAlign:"right"},".progress-enabled":{paddingTop:3,display:"inline-block",margin:"0 10px",position:"relative",width:18,height:18},".progress-enabled > .MuiCircularProgress-root":{position:"absolute",left:0,top:3}}},V.d),V.t))}))((function(e){var t=e.itemActions,n=e.columns,a=e.onSelect,o=e.records,l=e.isLoading,s=e.loadingMessage,d=void 0===s?Object(P.jsx)(b.a,{component:"h3",children:"Loading..."}):s,x=e.entityName,g=e.selectedItems,w=e.idField,C=e.classes,k=e.radioSelection,F=void 0!==k&&k,R=e.customEmptyMessage,T=void 0===R?"":R,N=e.customPaperHeight,z=void 0===N?"":N,I=e.noBackground,B=void 0!==I&&I,M=e.columnsSelector,L=void 0!==M&&M,A=e.textSelectable,D=void 0!==A&&A,E=e.columnsShown,H=void 0===E?[]:E,K=e.onColumnChange,V=void 0===K?function(e,t){}:K,Y=e.infiniteScrollConfig,J=e.sortConfig,U=e.autoScrollToBottom,Q=void 0!==U&&U,X=e.disabled,Z=void 0!==X&&X,$=e.onSelectAll,ee=Object(i.useState)(!1),te=Object(r.a)(ee,2),ne=te[0],re=te[1],ae=c.a.useState(null),oe=Object(r.a)(ae,2),ie=oe[0],ce=oe[1],le=t?t.find((function(e){return"view"===e.type})):null,se=function(e){re(!ne),ce(e.currentTarget)},de=function(){re(!1),ce(null)};return Object(P.jsx)(p.a,{item:!0,xs:12,children:Object(P.jsxs)(m.a,{className:"".concat(C.paper," ").concat(B?C.noBackground:"","\n        ").concat(Z?C.disabled:""," \n        ").concat(""!==z?z:C.defaultPaperHeight),children:[l&&Object(P.jsxs)(p.a,{container:!0,className:C.loadingBox,children:[Object(P.jsx)(p.a,{item:!0,xs:12,style:{textAlign:"center"},children:d}),Object(P.jsx)(p.a,{item:!0,xs:12,children:Object(P.jsx)(v.a,{})})]}),L&&!l&&o.length>0&&Object(P.jsx)("div",{className:C.overlayColumnSelection,children:function(e){return Object(P.jsxs)(i.Fragment,{children:[Object(P.jsx)(j.a,{"aria-describedby":"columnsSelector",color:"primary",onClick:se,size:"large",children:Object(P.jsx)(S.a,{fontSize:"inherit"})}),Object(P.jsxs)(h.a,{anchorEl:ie,id:"columnsSelector",open:ne,anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"},onClose:de,children:[Object(P.jsx)("div",{className:C.shownColumnsLabel,children:"Shown Columns"}),Object(P.jsx)("div",{className:C.popoverContent,children:e.map((function(e){return Object(P.jsx)(_.a,{label:e.label,checked:H.includes(e.elementKey),onChange:function(t){V(e.elementKey,t.target.checked)},id:"chbox-".concat(e.label),name:"chbox-".concat(e.label),value:e.label},"tableColumns-".concat(e.label))}))})]})]})}(n)}),o&&!l&&o.length>0?Object(P.jsx)(f.c,{isRowLoaded:function(e){var t=e.index;return!!o[t]},loadMoreRows:Y?Y.loadMoreRecords:function(){return new Promise((function(){return!0}))},rowCount:Y?Y.recordsCount:o.length,children:function(e){var r=e.onRowsRendered,c=e.registerChild;return Object(P.jsx)(f.a,{children:function(e){var l=e.width,s=e.height,d=function(e,t){var n=45*t+15;return n<80?80:n>e?e:n}(l,t?t.filter((function(e){return"view"!==e.type})).length:0),b=!(!a||!g),j=!!(t&&t.length>1||t&&1===t.length&&"view"!==t[0].type);return Object(P.jsxs)(f.d,{ref:c,disableHeader:!1,headerClassName:"headerItem",headerHeight:40,height:s,noRowsRenderer:function(){return Object(P.jsx)(i.Fragment,{children:""!==T?T:"There are no ".concat(x," yet.")})},overscanRowCount:10,rowHeight:40,width:l,rowCount:o.length,rowGetter:function(e){var t=e.index;return o[t]},onRowClick:function(e){!function(e){if(le){var t=le.sendOnlyId?e[w]:e,n=!1;if(le.disableButtonFunction&&le.disableButtonFunction(t)&&(n=!0),le.to&&!n)return void q.a.push("".concat(le.to,"/").concat(t));le.onClick&&!n&&le.onClick(t)}}(e.rowData)},rowClassName:"rowLine ".concat(le?"canClick":""," ").concat(!le&&D?"canSelectText":""),onRowsRendered:r,sort:J?J.triggerSort:void 0,sortBy:J?J.currentSort:void 0,sortDirection:J?J.currentDirection:void 0,scrollToIndex:Q?o.length-1:-1,children:[b&&Object(P.jsx)(f.b,{headerRenderer:function(){return Object(P.jsx)(i.Fragment,{children:$?Object(P.jsx)("div",{className:C.checkAllWrapper,children:Object(P.jsx)(_.a,{label:"",onChange:$,value:"all",id:"selectAll",name:"selectAll",checked:(null===g||void 0===g?void 0:g.length)===o.length})}):Object(P.jsx)(i.Fragment,{children:"Select"})})},dataKey:"select-".concat(w),width:45,disableSort:!0,cellRenderer:function(e){var t=e.rowData,n=!!g&&g.includes(u()(t)?t:t[w]);return Object(P.jsx)(O.a,{value:u()(t)?t:t[w],color:"primary",inputProps:{"aria-label":"secondary checkbox"},checked:n,onChange:a,onClick:function(e){e.stopPropagation()},checkedIcon:Object(P.jsx)("span",{className:F?C.radioSelectedIcon:C.checkedIcon}),icon:Object(P.jsx)("span",{className:F?C.radioUnselectedIcon:C.unCheckedIcon})})}}),G(n,l,d,b,j,g||[],w,L,H,J?J.currentSort:"",J?J.currentDirection:void 0),j&&Object(P.jsx)(f.b,{headerRenderer:function(){return Object(P.jsx)(i.Fragment,{children:"Options"})},dataKey:w,width:d,headerClassName:"optionsAlignment",className:"optionsAlignment",cellRenderer:function(e){var n=e.rowData,r=!!g&&g.includes(u()(n)?n:n[w]);return function(e,t,n,r){return e.map((function(e,a){if("view"===e.type)return null;var o="string"===typeof t?t:t[r],i=!1;return e.disableButtonFunction&&e.disableButtonFunction(o)&&(i=!0),e.showLoaderFunction&&e.showLoaderFunction(o)?Object(P.jsx)("div",{className:"progress-enabled",children:Object(P.jsx)(y.a,{color:"primary",size:18,variant:"indeterminate"},"actions-loader-".concat(e.type,"-").concat(a.toString()))}):Object(P.jsx)(W,{label:e.label,type:e.type,onClick:e.onClick,to:e.to,valueToSend:t,selected:n,idField:r,sendOnlyId:!!e.sendOnlyId,disabled:i},"actions-".concat(e.type,"-").concat(a.toString()))}))}(t||[],n,r,w)}})]})}})}}):Object(P.jsx)(i.Fragment,{children:!l&&Object(P.jsx)("div",{children:""!==T?T:"There are no ".concat(x," yet.")})})]})})}))},397:function(e,t,n){"use strict";var r=n(1),a=n(2),o=n.n(a),i=n(436),c=n(778),l=n(809),s=n(376),d=n(300),u=n(310),b=n(120),j=n(121),h=n(0);t.a=Object(u.a)((function(e){return Object(d.a)(Object(r.a)(Object(r.a)(Object(r.a)(Object(r.a)({},b.i),b.D),b.d),{},{fieldContainer:Object(r.a)(Object(r.a)({},b.i.fieldContainer),{},{display:"flex",justifyContent:"flex-start",alignItems:"center",margin:"15px 0",marginBottom:0,flexBasis:"initial"})}))}))((function(e){var t=e.label,n=e.onChange,r=e.value,a=e.id,d=e.name,u=e.checked,b=void 0!==u&&u,p=e.disabled,m=void 0!==p&&p,v=e.tooltip,O=void 0===v?"":v,f=e.classes;return Object(h.jsx)(o.a.Fragment,{children:Object(h.jsxs)(i.a,{item:!0,xs:12,className:f.fieldContainer,children:[Object(h.jsx)("div",{children:Object(h.jsx)(c.a,{name:d,id:a,value:r,color:"primary",inputProps:{"aria-label":"secondary checkbox"},checked:b,onChange:n,checkedIcon:Object(h.jsx)("span",{className:f.checkedIcon}),icon:Object(h.jsx)("span",{className:f.unCheckedIcon}),disabled:m})}),""!==t&&Object(h.jsxs)(l.a,{htmlFor:a,className:f.noMinWidthLabel,children:[Object(h.jsx)("span",{children:t}),""!==O&&Object(h.jsx)("div",{className:f.tooltipContainer,children:Object(h.jsx)(s.a,{title:O,placement:"top-start",children:Object(h.jsx)("div",{className:f.tooltip,children:Object(h.jsx)(j.a,{})})})})]})]})})}))},403:function(e,t,n){"use strict";function r(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}n.d(t,"a",(function(){return r}))},415:function(e,t,n){"use strict";var r=n(3),a=n(4),o=n(2),i=(n(11),n(7)),c=n(93),l=n(8),s=n(12),d=n(969),u=n(970),b=n(964),j=n(809),h=n(971),p=n(6),m=n(398),v=n(386),O=n(9),f=n(70),x=n(94);function g(e){return Object(f.a)("MuiFormHelperText",e)}var y=Object(x.a)("MuiFormHelperText",["root","error","disabled","sizeSmall","sizeMedium","contained","focused","filled","required"]),w=n(0),S=["children","className","component","disabled","error","filled","focused","margin","required","variant"],C=Object(l.a)("p",{name:"MuiFormHelperText",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,n.size&&t["size".concat(Object(O.a)(n.size))],n.contained&&t.contained,n.filled&&t.filled]}})((function(e){var t,n=e.theme,a=e.ownerState;return Object(r.a)({color:n.palette.text.secondary},n.typography.caption,(t={textAlign:"left",marginTop:3,marginRight:0,marginBottom:0,marginLeft:0},Object(p.a)(t,"&.".concat(y.disabled),{color:n.palette.text.disabled}),Object(p.a)(t,"&.".concat(y.error),{color:n.palette.error.main}),t),"small"===a.size&&{marginTop:4},a.contained&&{marginLeft:14,marginRight:14})})),k=o.forwardRef((function(e,t){var n=Object(s.a)({props:e,name:"MuiFormHelperText"}),o=n.children,l=n.className,d=n.component,u=void 0===d?"p":d,b=Object(a.a)(n,S),j=Object(v.a)(),h=Object(m.a)({props:n,muiFormControl:j,states:["variant","size","disabled","error","filled","focused","required"]}),p=Object(r.a)({},n,{component:u,contained:"filled"===h.variant||"outlined"===h.variant,variant:h.variant,size:h.size,disabled:h.disabled,error:h.error,filled:h.filled,focused:h.focused,required:h.required}),f=function(e){var t=e.classes,n=e.contained,r=e.size,a=e.disabled,o=e.error,i=e.filled,l=e.focused,s=e.required,d={root:["root",a&&"disabled",o&&"error",r&&"size".concat(Object(O.a)(r)),n&&"contained",l&&"focused",i&&"filled",s&&"required"]};return Object(c.a)(d,g,t)}(p);return Object(w.jsx)(C,Object(r.a)({as:u,ownerState:p,className:Object(i.a)(f.root,l),ref:t},b,{children:" "===o?Object(w.jsx)("span",{className:"notranslate",dangerouslySetInnerHTML:{__html:"&#8203;"}}):o}))})),F=n(957);function R(e){return Object(f.a)("MuiTextField",e)}Object(x.a)("MuiTextField",["root"]);var T=["autoComplete","autoFocus","children","className","color","defaultValue","disabled","error","FormHelperTextProps","fullWidth","helperText","id","InputLabelProps","inputProps","InputProps","inputRef","label","maxRows","minRows","multiline","name","onBlur","onChange","onFocus","placeholder","required","rows","select","SelectProps","type","value","variant"],N={standard:d.a,filled:u.a,outlined:b.a},z=Object(l.a)(h.a,{name:"MuiTextField",slot:"Root",overridesResolver:function(e,t){return t.root}})({}),I=o.forwardRef((function(e,t){var n=Object(s.a)({props:e,name:"MuiTextField"}),l=n.autoComplete,d=n.autoFocus,u=void 0!==d&&d,b=n.children,h=n.className,p=n.color,m=void 0===p?"primary":p,v=n.defaultValue,O=n.disabled,f=void 0!==O&&O,x=n.error,g=void 0!==x&&x,y=n.FormHelperTextProps,S=n.fullWidth,C=void 0!==S&&S,I=n.helperText,P=n.id,B=n.InputLabelProps,M=n.inputProps,L=n.InputProps,A=n.inputRef,D=n.label,E=n.maxRows,H=n.minRows,K=n.multiline,W=void 0!==K&&K,_=n.name,q=n.onBlur,V=n.onChange,G=n.onFocus,Y=n.placeholder,J=n.required,U=void 0!==J&&J,Q=n.rows,X=n.select,Z=void 0!==X&&X,$=n.SelectProps,ee=n.type,te=n.value,ne=n.variant,re=void 0===ne?"outlined":ne,ae=Object(a.a)(n,T),oe=Object(r.a)({},n,{autoFocus:u,color:m,disabled:f,error:g,fullWidth:C,multiline:W,required:U,select:Z,variant:re}),ie=function(e){var t=e.classes;return Object(c.a)({root:["root"]},R,t)}(oe);var ce={};if("outlined"===re&&(B&&"undefined"!==typeof B.shrink&&(ce.notched=B.shrink),D)){var le,se=null!=(le=null==B?void 0:B.required)?le:U;ce.label=Object(w.jsxs)(o.Fragment,{children:[D,se&&"\xa0*"]})}Z&&($&&$.native||(ce.id=void 0),ce["aria-describedby"]=void 0);var de=I&&P?"".concat(P,"-helper-text"):void 0,ue=D&&P?"".concat(P,"-label"):void 0,be=N[re],je=Object(w.jsx)(be,Object(r.a)({"aria-describedby":de,autoComplete:l,autoFocus:u,defaultValue:v,fullWidth:C,multiline:W,name:_,rows:Q,maxRows:E,minRows:H,type:ee,value:te,id:P,inputRef:A,onBlur:q,onChange:V,onFocus:G,placeholder:Y,inputProps:M},ce,L));return Object(w.jsxs)(z,Object(r.a)({className:Object(i.a)(ie.root,h),disabled:f,error:g,fullWidth:C,ref:t,required:U,color:m,variant:re,ownerState:oe},ae,{children:[D&&Object(w.jsx)(j.a,Object(r.a)({htmlFor:P,id:ue},B,{children:D})),Z?Object(w.jsx)(F.a,Object(r.a)({"aria-describedby":de,id:P,labelId:ue,value:te,input:je},$,{children:b})):je,I&&Object(w.jsx)(k,Object(r.a)({id:de},y,{children:I}))]}))}));t.a=I},425:function(e,t,n){"use strict";n(2);var r=n(300),a=n(310),o=n(436),i=n(0);t.a=Object(a.a)((function(e){return Object(r.a)({root:{border:"1px solid rgb(234, 237, 238)",borderRadius:5,paddingTop:10,paddingLeft:40,paddingRight:40,paddingBottom:40,marginTop:10,marginBottom:10,backgroundColor:"#fbfafa"},leftItems:{fontSize:16,fontWeight:"bold",marginBottom:20,display:"flex",alignItems:"center","& .min-icon":{width:"2.5rem",marginRight:".8rem"}},helpText:{fontSize:16}})}))((function(e){var t=e.classes,n=e.iconComponent,r=e.title,a=e.help;return Object(i.jsx)("div",{className:t.root,children:Object(i.jsxs)(o.a,{container:!0,children:[Object(i.jsxs)(o.a,{item:!0,xs:12,className:t.leftItems,children:[n,r]}),Object(i.jsx)(o.a,{item:!0,xs:12,className:t.helpText,children:a})]})})}))},426:function(e,t,n){"use strict";var r=n(1),a=n(6),o=n(403),i=(n(2),n(300)),c=n(310),l=n(378),s=n(376),d=n(7),u=n(0),b=["classes","children","variant","tooltip"];t.a=Object(c.a)((function(e){return Object(i.a)({root:{padding:8,marginLeft:8,borderWidth:1,borderColor:"#696969",color:"#696969",borderStyle:"solid",borderRadius:3,"& .min-icon":{width:20},"& .MuiTouchRipple-root span":{backgroundColor:e.palette.primary.main,borderRadius:3,opacity:.3},"&:disabled":{color:"#EBEBEB",borderColor:"#EBEBEB"}},contained:{borderColor:e.palette.primary.main,background:e.palette.primary.main,color:"white","& .MuiTouchRipple-root span":{backgroundColor:e.palette.primary.dark,borderRadius:3,opacity:.3},"&:hover":{backgroundColor:e.palette.primary.light,color:"#FFF"}}})}))((function(e){var t=e.classes,n=e.children,i=e.variant,c=void 0===i?"outlined":i,j=e.tooltip,h=Object(o.a)(e,b),p=Object(u.jsx)(l.a,Object(r.a)(Object(r.a)({},h),{},{className:Object(d.a)(t.root,Object(a.a)({},t.contained,"contained"===c)),children:n}));return j&&""!==j?Object(u.jsx)(s.a,{title:j,children:Object(u.jsx)("span",{children:p})}):p}))},453:function(e,t,n){"use strict";var r=n(6),a=n(4),o=n(3),i=n(2),c=(n(11),n(7)),l=n(93),s=n(9),d=n(95),u=n(431),b=n(386),j=n(8),h=n(70),p=n(94);function m(e){return Object(h.a)("MuiInputAdornment",e)}var v=Object(p.a)("MuiInputAdornment",["root","filled","standard","outlined","positionStart","positionEnd","disablePointerEvents","hiddenLabel","sizeSmall"]),O=n(12),f=n(0),x=["children","className","component","disablePointerEvents","disableTypography","position","variant"],g=Object(j.a)("div",{name:"MuiInputAdornment",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,t["position".concat(Object(s.a)(n.position))],!0===n.disablePointerEvents&&t.disablePointerEvents,t[n.variant]]}})((function(e){var t=e.theme,n=e.ownerState;return Object(o.a)({display:"flex",height:"0.01em",maxHeight:"2em",alignItems:"center",whiteSpace:"nowrap",color:t.palette.action.active},"filled"===n.variant&&Object(r.a)({},"&.".concat(v.positionStart,"&:not(.").concat(v.hiddenLabel,")"),{marginTop:16}),"start"===n.position&&{marginRight:8},"end"===n.position&&{marginLeft:8},!0===n.disablePointerEvents&&{pointerEvents:"none"})})),y=i.forwardRef((function(e,t){var n=Object(O.a)({props:e,name:"MuiInputAdornment"}),r=n.children,j=n.className,h=n.component,p=void 0===h?"div":h,v=n.disablePointerEvents,y=void 0!==v&&v,w=n.disableTypography,S=void 0!==w&&w,C=n.position,k=n.variant,F=Object(a.a)(n,x),R=Object(b.a)()||{},T=k;k&&R.variant,R&&!T&&(T=R.variant);var N=Object(o.a)({},n,{hiddenLabel:R.hiddenLabel,size:R.size,disablePointerEvents:y,position:C,variant:T}),z=function(e){var t=e.classes,n=e.disablePointerEvents,r=e.hiddenLabel,a=e.position,o=e.size,i=e.variant,c={root:["root",n&&"disablePointerEvents",a&&"position".concat(Object(s.a)(a)),i,r&&"hiddenLabel",o&&"size".concat(Object(s.a)(o))]};return Object(l.a)(c,m,t)}(N);return Object(f.jsx)(u.a.Provider,{value:null,children:Object(f.jsx)(g,Object(o.a)({as:p,ownerState:N,className:Object(c.a)(z.root,j),ref:t},F,{children:"string"!==typeof r||S?Object(f.jsxs)(i.Fragment,{children:["start"===C?Object(f.jsx)("span",{className:"notranslate",dangerouslySetInnerHTML:{__html:"&#8203;"}}):null,r]}):Object(f.jsx)(d.a,{color:"text.secondary",children:r})}))})}));t.a=y},768:function(e,t,n){"use strict";var r=n(72);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=r(n(73)),o=n(0),i=(0,a.default)((0,o.jsx)("path",{d:"M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"}),"Group");t.default=i},900:function(e,t,n){"use strict";n.r(t);var r=n(14),a=n(15),o=n(1),i=n(2),c=n.n(i),l=n(39),s=n(300),d=n(310),u=n(436),b=n(415),j=n(453),h=n(46),p=n.n(h),m=n(768),v=n.n(m),O=n(22),f=n(31),x=n(120),g=n(58),y=n(193),w=n(52),S=n(396),C=n(136),k=n(134),F=n(426),R=n(425),T=n(403),N=n(433),z=n(380),I=n(0),P=["classes","children","label"],B=function(e){e.classes;var t=e.children,n=e.label,r=void 0===n?"":n,a=Object(T.a)(e,P),c=a;return Object(I.jsxs)(i.Fragment,{children:[Object(I.jsx)(N.a,{sx:{display:{xs:"none",sm:"none",md:"block"}},children:Object(I.jsx)(z.a,Object(o.a)(Object(o.a)({},a),{},{endIcon:t,children:r}))}),Object(I.jsx)(N.a,{sx:{display:{xs:"block",sm:"block",md:"none"}},children:Object(I.jsx)(F.a,Object(o.a)(Object(o.a)({},c),{},{tooltip:r,children:t}))})]})},M=n(424),L=Object(M.a)(c.a.lazy((function(){return Promise.all([n.e(70),n.e(120)]).then(n.bind(null,948))}))),A=Object(M.a)(c.a.lazy((function(){return n.e(82).then(n.bind(null,949))}))),D={setErrorSnackMessage:f.e,selectDrive:function(e){return{type:y.a,driveName:e}}},E=Object(l.b)(null,D);t.default=Object(d.a)((function(e){return Object(s.a)(Object(o.a)(Object(o.a)(Object(o.a)({tableWrapper:{height:"calc(100vh - 275px)"},linkItem:{display:"default",color:e.palette.info.main,textDecoration:"none","&:hover":{textDecoration:"underline",color:"#000"}}},x.a),x.u),Object(x.f)(e.spacing(4))))}))(E((function(e){var t=e.classes,n=(e.selectDrive,e.setErrorSnackMessage),c=Object(i.useState)([]),l=Object(a.a)(c,2),s=l[0],d=l[1],h=Object(i.useState)(""),m=Object(a.a)(h,2),f=m[0],x=m[1],y=Object(i.useState)([]),T=Object(a.a)(y,2),N=T[0],z=T[1],P=Object(i.useState)(!0),M=Object(a.a)(P,2),D=M[0],E=M[1],H=Object(i.useState)(!1),K=Object(a.a)(H,2),W=K[0],_=K[1],q=Object(i.useState)(!1),V=Object(a.a)(q,2),G=V[0],Y=V[1],J=Object(i.useState)([]),U=Object(a.a)(J,2),Q=U[0],X=U[1],Z=Object(i.useState)(!1),$=Object(a.a)(Z,2),ee=$[0],te=$[1],ne=Object(i.useState)([]),re=Object(a.a)(ne,2),ae=re[0],oe=re[1],ie=Object(i.useState)(!0),ce=Object(a.a)(ie,2),le=ce[0],se=ce[1];Object(i.useEffect)((function(){D&&w.a.invoke("GET","/api/v1/direct-csi/drives").then((function(e){var t=p()(e,"drives",[]);t||(t=[]),(t=t.map((function(e){var t=Object(o.a)({},e);return t.joinName="".concat(t.node,":").concat(t.drive),t}))).sort((function(e,t){return e.drive>t.drive?1:e.drive<t.drive?-1:0})),d(t),E(!1),se(!1)})).catch((function(e){E(!1),se(!0)}))}),[D,n,le]);var de=[{type:"format",onClick:function(e){oe([e]),Y(!1),_(!0)},sendOnlyId:!0}],ue=s.filter((function(e){return e.drive.includes(f)}));return Object(I.jsxs)(i.Fragment,{children:[W&&Object(I.jsx)(L,{closeFormatModalAndRefresh:function(e,t){_(!1),e&&(t&&t.length>0&&(X(t),te(!0)),E(!0),z([]))},deleteOpen:W,allDrives:G,drivesToFormat:ae}),ee&&Object(I.jsx)(A,{errorsList:Q,open:ee,onCloseFormatErrorsList:function(){te(!1)}}),Object(I.jsx)("h1",{className:t.sectionTitle,children:"Local Drives"}),Object(I.jsxs)(u.a,{item:!0,xs:12,className:t.actionsTray,children:[Object(I.jsx)(b.a,{placeholder:"Search Drives",className:t.searchField,id:"search-resource",label:"",InputProps:{disableUnderline:!0,startAdornment:Object(I.jsx)(j.a,{position:"start",children:Object(I.jsx)(k.default,{})})},onChange:function(e){x(e.target.value)},disabled:le,variant:"standard"}),Object(I.jsx)(F.a,{color:"primary","aria-label":"Refresh Tenant List",onClick:function(){E(!0)},disabled:le,size:"large",children:Object(I.jsx)(C.default,{})}),Object(I.jsx)(B,{variant:"contained",color:"primary",disabled:N.length<=0||le,onClick:function(){N.length>0&&(oe(N),Y(!1),_(!0))},label:"Format Selected Drives",children:Object(I.jsx)(v.a,{})}),Object(I.jsx)(B,{variant:"contained",color:"primary",label:"Format All Drives",onClick:function(){var e=s.map((function(e){return"".concat(e.node,":").concat(e.drive)}));Y(!0),oe(e),_(!0)},disabled:le,children:Object(I.jsx)(O.c,{})})]}),Object(I.jsx)(u.a,{item:!0,xs:12,children:le&&!D?Object(I.jsx)(R.a,{title:"Leverage locally attached drives",iconComponent:Object(I.jsx)(O.Hb,{}),help:Object(I.jsxs)(i.Fragment,{children:["We can automatically provision persistent volumes (PVs) on top locally attached drives on your Kubernetes nodes by leveraging Direct-CSI.",Object(I.jsx)("br",{}),Object(I.jsx)("br",{}),"For more information"," ",Object(I.jsx)("a",{href:"https://github.com/minio/direct-csi",rel:"noreferrer",target:"_blank",className:t.linkItem,children:"Visit Direct-CSI Documentation"})]})}):Object(I.jsx)(S.a,{itemActions:de,columns:[{label:"Drive",elementKey:"drive"},{label:"Capacity",elementKey:"capacity",renderFunction:g.l},{label:"Allocated",elementKey:"allocated",renderFunction:g.l},{label:"Volumes",elementKey:"volumes"},{label:"Node",elementKey:"node"},{label:"Status",elementKey:"status"}],onSelect:function(e){var t=e.target,n=t.value,a=t.checked,o=Object(r.a)(N);return a?o.push(n):o=o.filter((function(e){return e!==n})),z(o),o},selectedItems:N,isLoading:D,records:ue,customPaperHeight:t.tableWrapper,entityName:"Drives",idField:"joinName"})})]})})))}}]);
//# sourceMappingURL=48.c908bb8e.chunk.js.map