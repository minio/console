(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[103],{405:function(e,t,n){"use strict";var a=n(16),r=n(13),o=n(1),i=n(2),c=n.n(i),l=n(48),s=n.n(l),d=n(403),u=n.n(d),b=n(96),j=n(387),h=n(983),p=n(443),m=n(386),v=n(374),f=n(786),x=n(449),O=n(307),g=n(319),w=n(482),y=n(448),C=n.n(y),S=n(447),F=n.n(S),k=n(446),R=n.n(k),N=n(20),T=n(384),z="#081C42",P="#081C42",I=n(0),M=function(e){var t=e.active,n=void 0!==t&&t;return Object(I.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(I.jsx)("path",{fill:n?P:z,d:"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"})})},A=function(e){var t=e.active,n=void 0!==t&&t;return Object(I.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(I.jsx)("path",{fill:n?P:z,d:"M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3v-3h18v3z"})})},B=function(e){var t=e.active,n=void 0!==t&&t;return Object(I.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",children:Object(I.jsx)("path",{fill:n?P:z,d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"})})},L=function(e){var t=e.active,n=void 0!==t&&t;return Object(I.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(I.jsx)("path",{fill:n?P:z,d:"M20 16h2v-2h-2v2zm0-9v5h2V7h-2zM10 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"})})},E=n(131),H=n(132),D=n(23),K=n(133),W=Object(g.a)((function(){return Object(O.a)({spacing:{margin:"0 8px"},buttonDisabled:{"&.MuiButtonBase-root.Mui-disabled":{cursor:"not-allowed",filter:"grayscale(100%)",opacity:"30%"}}})}))((function(e){var t=e.type,n=e.onClick,a=e.valueToSend,r=e.idField,o=e.selected,i=e.to,c=e.sendOnlyId,l=void 0!==c&&c,s=e.disabled,d=void 0!==s&&s,b=e.classes,h=e.label,p=l?a[r]:a,m="string"===typeof t?function(e,t){switch(e){case"view":case"preview":return Object(I.jsx)(D.sb,{});case"edit":return Object(I.jsx)(E.default,{});case"delete":return Object(I.jsx)(H.a,{});case"description":return Object(I.jsx)(D.Y,{});case"share":return Object(I.jsx)(D.Fb,{});case"cloud":return Object(I.jsx)(M,{active:t});case"console":return Object(I.jsx)(A,{active:t});case"download":return Object(I.jsx)(K.default,{});case"disable":return Object(I.jsx)(B,{active:t});case"format":return Object(I.jsx)(L,{active:t})}return null}(t,o):t,v=Object(I.jsx)(j.a,{"aria-label":"string"===typeof t?t:"",size:"small",className:"".concat(b.spacing," ").concat(d?b.buttonDisabled:""),disabled:d,onClick:n?function(e){e.stopPropagation(),d?e.preventDefault():n(p)}:function(){return null},children:m});return h&&""!==h&&(v=Object(I.jsx)(T.a,{title:h,children:v})),n?v:u()(i)?d?v:Object(I.jsx)(N.a,{to:"".concat(i,"/").concat(p),onClick:function(e){e.stopPropagation()},children:v}):null})),q=n(406),_=n(53),V=n(122),Y=function(e,t,n,a,o,c,l,d,b,j,h){var p=function(e,t,n,a,o,i,c){var l=Object(r.a)(e);i&&(l=e.filter((function(e){return c.includes(e.elementKey)})));var s=t;return a&&(s-=45),o&&(s-=n),l.reduce((function(e,t){return t.width?e-t.width:e}),s)/l.filter((function(e){return!e.width})).length}(e,t,n,a,o,d,b);return e.map((function(e,t){if(d&&!b.includes(e.elementKey))return null;var n=!e.enableSort||!e.enableSort;return Object(I.jsx)(x.b,{dataKey:e.elementKey,headerClassName:"titleHeader ".concat(e.headerTextAlign?"text-".concat(e.headerTextAlign):""),headerRenderer:function(){return Object(I.jsxs)(i.Fragment,{children:[j===e.elementKey&&Object(I.jsx)(i.Fragment,{children:"ASC"===h?Object(I.jsx)(R.a,{}):Object(I.jsx)(F.a,{})}),e.label]})},className:e.contentTextAlign?"text-".concat(e.contentTextAlign):"",cellRenderer:function(t){var n=t.rowData,a=!!c&&c.includes(u()(n)?n:n[l]);return function(e,t,n){var a=u()(e)?e:s()(e,t.elementKey,null),r=t.renderFullObject?e:a,o=t.renderFunction?t.renderFunction(r):r;return Object(I.jsx)(i.Fragment,{children:Object(I.jsx)("span",{className:n?"selected":"",children:o})})}(n,e,a)},width:e.width||p,disableSort:n,defaultSortDirection:"ASC"},"col-tb-".concat(t.toString()))}))};t.a=Object(g.a)((function(){return Object(O.a)(Object(o.a)(Object(o.a)({paper:{display:"flex",overflow:"auto",flexDirection:"column",padding:"8px 16px",boxShadow:"none",border:"#EAEDEE 1px solid",borderRadius:3,minHeight:200,overflowY:"scroll",position:"relative","&::-webkit-scrollbar":{width:3,height:3}},noBackground:{backgroundColor:"transparent",border:0},disabled:{backgroundColor:"#fbfafa",color:"#cccccc"},defaultPaperHeight:{height:"calc(100vh - 205px)"},loadingBox:{paddingTop:"100px",paddingBottom:"100px"},overlayColumnSelection:{position:"absolute",right:0,top:0},popoverContent:{maxHeight:250,overflowY:"auto",padding:"0 10px 10px"},shownColumnsLabel:{color:"#9c9c9c",fontSize:12,padding:10,borderBottom:"#eaeaea 1px solid",width:"100%"},checkAllWrapper:{marginTop:-16},"@global":{".rowLine":{borderBottom:"1px solid ".concat("#9c9c9c80"),height:40,color:"#393939",fontSize:14,transitionDuration:.3,"&:focus":{outline:"initial"},"&:hover:not(.ReactVirtualized__Table__headerRow)":{userSelect:"none",backgroundColor:"#ececec",fontWeight:600,"&.canClick":{cursor:"pointer"},"&.canSelectText":{userSelect:"text"}},"& .selected":{color:"#081C42",fontWeight:600}},".headerItem":{userSelect:"none",fontWeight:700,fontSize:14,fontStyle:"initial",display:"flex",alignItems:"center",outline:"none"},".ReactVirtualized__Table__headerRow":{fontWeight:700,fontSize:14,borderColor:"#39393980",textTransform:"initial"},".optionsAlignment":{textAlign:"center","& .min-icon":{width:16,height:16}},".text-center":{textAlign:"center"},".text-right":{textAlign:"right"},".progress-enabled":{paddingTop:3,display:"inline-block",margin:"0 10px",position:"relative",width:18,height:18},".progress-enabled > .MuiCircularProgress-root":{position:"absolute",left:0,top:3}}},V.d),V.u))}))((function(e){var t=e.itemActions,n=e.columns,r=e.onSelect,o=e.records,l=e.isLoading,s=e.loadingMessage,d=void 0===s?Object(I.jsx)(b.a,{component:"h3",children:"Loading..."}):s,O=e.entityName,g=e.selectedItems,y=e.idField,S=e.classes,F=e.radioSelection,k=void 0!==F&&F,R=e.customEmptyMessage,N=void 0===R?"":R,T=e.customPaperHeight,z=void 0===T?"":T,P=e.noBackground,M=void 0!==P&&P,A=e.columnsSelector,B=void 0!==A&&A,L=e.textSelectable,E=void 0!==L&&L,H=e.columnsShown,D=void 0===H?[]:H,K=e.onColumnChange,V=void 0===K?function(e,t){}:K,G=e.infiniteScrollConfig,J=e.sortConfig,U=e.autoScrollToBottom,Q=void 0!==U&&U,X=e.disabled,Z=void 0!==X&&X,$=e.onSelectAll,ee=Object(i.useState)(!1),te=Object(a.a)(ee,2),ne=te[0],ae=te[1],re=c.a.useState(null),oe=Object(a.a)(re,2),ie=oe[0],ce=oe[1],le=t?t.find((function(e){return"view"===e.type})):null,se=function(e){ae(!ne),ce(e.currentTarget)},de=function(){ae(!1),ce(null)};return Object(I.jsx)(p.a,{item:!0,xs:12,children:Object(I.jsxs)(m.a,{className:"".concat(S.paper," ").concat(M?S.noBackground:"","\n        ").concat(Z?S.disabled:""," \n        ").concat(""!==z?z:S.defaultPaperHeight),children:[l&&Object(I.jsxs)(p.a,{container:!0,className:S.loadingBox,children:[Object(I.jsx)(p.a,{item:!0,xs:12,style:{textAlign:"center"},children:d}),Object(I.jsx)(p.a,{item:!0,xs:12,children:Object(I.jsx)(v.a,{})})]}),B&&!l&&o.length>0&&Object(I.jsx)("div",{className:S.overlayColumnSelection,children:function(e){return Object(I.jsxs)(i.Fragment,{children:[Object(I.jsx)(j.a,{"aria-describedby":"columnsSelector",color:"primary",onClick:se,size:"large",children:Object(I.jsx)(C.a,{fontSize:"inherit"})}),Object(I.jsxs)(h.a,{anchorEl:ie,id:"columnsSelector",open:ne,anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"},onClose:de,children:[Object(I.jsx)("div",{className:S.shownColumnsLabel,children:"Shown Columns"}),Object(I.jsx)("div",{className:S.popoverContent,children:e.map((function(e){return Object(I.jsx)(q.a,{label:e.label,checked:D.includes(e.elementKey),onChange:function(t){V(e.elementKey,t.target.checked)},id:"chbox-".concat(e.label),name:"chbox-".concat(e.label),value:e.label},"tableColumns-".concat(e.label))}))})]})]})}(n)}),o&&!l&&o.length>0?Object(I.jsx)(x.c,{isRowLoaded:function(e){var t=e.index;return!!o[t]},loadMoreRows:G?G.loadMoreRecords:function(){return new Promise((function(){return!0}))},rowCount:G?G.recordsCount:o.length,children:function(e){var a=e.onRowsRendered,c=e.registerChild;return Object(I.jsx)(x.a,{children:function(e){var l=e.width,s=e.height,d=function(e,t){var n=45*t+15;return n<80?80:n>e?e:n}(l,t?t.filter((function(e){return"view"!==e.type})).length:0),b=!(!r||!g),j=!!(t&&t.length>1||t&&1===t.length&&"view"!==t[0].type);return Object(I.jsxs)(x.d,{ref:c,disableHeader:!1,headerClassName:"headerItem",headerHeight:40,height:s,noRowsRenderer:function(){return Object(I.jsx)(i.Fragment,{children:""!==N?N:"There are no ".concat(O," yet.")})},overscanRowCount:10,rowHeight:40,width:l,rowCount:o.length,rowGetter:function(e){var t=e.index;return o[t]},onRowClick:function(e){!function(e){if(le){var t=le.sendOnlyId?e[y]:e,n=!1;if(le.disableButtonFunction&&le.disableButtonFunction(t)&&(n=!0),le.to&&!n)return void _.a.push("".concat(le.to,"/").concat(t));le.onClick&&!n&&le.onClick(t)}}(e.rowData)},rowClassName:"rowLine ".concat(le?"canClick":""," ").concat(!le&&E?"canSelectText":""),onRowsRendered:a,sort:J?J.triggerSort:void 0,sortBy:J?J.currentSort:void 0,sortDirection:J?J.currentDirection:void 0,scrollToIndex:Q?o.length-1:-1,children:[b&&Object(I.jsx)(x.b,{headerRenderer:function(){return Object(I.jsx)(i.Fragment,{children:$?Object(I.jsx)("div",{className:S.checkAllWrapper,children:Object(I.jsx)(q.a,{label:"",onChange:$,value:"all",id:"selectAll",name:"selectAll",checked:(null===g||void 0===g?void 0:g.length)===o.length})}):Object(I.jsx)(i.Fragment,{children:"Select"})})},dataKey:"select-".concat(y),width:45,disableSort:!0,cellRenderer:function(e){var t=e.rowData,n=!!g&&g.includes(u()(t)?t:t[y]);return Object(I.jsx)(f.a,{value:u()(t)?t:t[y],color:"primary",inputProps:{"aria-label":"secondary checkbox"},checked:n,onChange:r,onClick:function(e){e.stopPropagation()},checkedIcon:Object(I.jsx)("span",{className:k?S.radioSelectedIcon:S.checkedIcon}),icon:Object(I.jsx)("span",{className:k?S.radioUnselectedIcon:S.unCheckedIcon})})}}),Y(n,l,d,b,j,g||[],y,B,D,J?J.currentSort:"",J?J.currentDirection:void 0),j&&Object(I.jsx)(x.b,{headerRenderer:function(){return Object(I.jsx)(i.Fragment,{children:"Options"})},dataKey:y,width:d,headerClassName:"optionsAlignment",className:"optionsAlignment",cellRenderer:function(e){var n=e.rowData,a=!!g&&g.includes(u()(n)?n:n[y]);return function(e,t,n,a){return e.map((function(e,r){if("view"===e.type)return null;var o="string"===typeof t?t:t[a],i=!1;return e.disableButtonFunction&&e.disableButtonFunction(o)&&(i=!0),e.showLoaderFunction&&e.showLoaderFunction(o)?Object(I.jsx)("div",{className:"progress-enabled",children:Object(I.jsx)(w.a,{color:"primary",size:18,variant:"indeterminate"},"actions-loader-".concat(e.type,"-").concat(r.toString()))}):Object(I.jsx)(W,{label:e.label,type:e.type,onClick:e.onClick,to:e.to,valueToSend:t,selected:n,idField:a,sendOnlyId:!!e.sendOnlyId,disabled:i},"actions-".concat(e.type,"-").concat(r.toString()))}))}(t||[],n,a,y)}})]})}})}}):Object(I.jsx)(i.Fragment,{children:!l&&Object(I.jsx)("div",{children:""!==N?N:"There are no ".concat(O," yet.")})})]})})}))},406:function(e,t,n){"use strict";var a=n(1),r=n(2),o=n.n(r),i=n(443),c=n(786),l=n(821),s=n(384),d=n(307),u=n(319),b=n(122),j=n(123),h=n(0);t.a=Object(u.a)((function(e){return Object(d.a)(Object(a.a)(Object(a.a)(Object(a.a)(Object(a.a)({},b.i),b.E),b.d),{},{fieldContainer:Object(a.a)(Object(a.a)({},b.i.fieldContainer),{},{display:"flex",justifyContent:"flex-start",alignItems:"center",margin:"15px 0",marginBottom:0,flexBasis:"initial"})}))}))((function(e){var t=e.label,n=e.onChange,a=e.value,r=e.id,d=e.name,u=e.checked,b=void 0!==u&&u,p=e.disabled,m=void 0!==p&&p,v=e.tooltip,f=void 0===v?"":v,x=e.classes;return Object(h.jsx)(o.a.Fragment,{children:Object(h.jsxs)(i.a,{item:!0,xs:12,className:x.fieldContainer,children:[Object(h.jsx)("div",{children:Object(h.jsx)(c.a,{name:d,id:r,value:a,color:"primary",inputProps:{"aria-label":"secondary checkbox"},checked:b,onChange:n,checkedIcon:Object(h.jsx)("span",{className:x.checkedIcon}),icon:Object(h.jsx)("span",{className:x.unCheckedIcon}),disabled:m})}),""!==t&&Object(h.jsxs)(l.a,{htmlFor:r,className:x.noMinWidthLabel,children:[Object(h.jsx)("span",{children:t}),""!==f&&Object(h.jsx)("div",{className:x.tooltipContainer,children:Object(h.jsx)(s.a,{title:f,placement:"top-start",children:Object(h.jsx)("div",{className:x.tooltip,children:Object(h.jsx)(j.a,{})})})})]})]})})}))},429:function(e,t,n){"use strict";var a=n(3),r=n(4),o=n(2),i=(n(12),n(8)),c=n(94),l=n(314),s=n(9),d=n(14),u=n(934),b=n(935),j=n(981),h=n(821),p=n(982),m=n(5),v=n(409),f=n(396),x=n(11),O=n(70),g=n(95);function w(e){return Object(O.a)("MuiFormHelperText",e)}var y=Object(g.a)("MuiFormHelperText",["root","error","disabled","sizeSmall","sizeMedium","contained","focused","filled","required"]),C=n(0),S=["children","className","component","disabled","error","filled","focused","margin","required","variant"],F=Object(s.a)("p",{name:"MuiFormHelperText",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,n.size&&t["size".concat(Object(x.a)(n.size))],n.contained&&t.contained,n.filled&&t.filled]}})((function(e){var t,n=e.theme,r=e.ownerState;return Object(a.a)({color:n.palette.text.secondary},n.typography.caption,(t={textAlign:"left",marginTop:3,marginRight:0,marginBottom:0,marginLeft:0},Object(m.a)(t,"&.".concat(y.disabled),{color:n.palette.text.disabled}),Object(m.a)(t,"&.".concat(y.error),{color:n.palette.error.main}),t),"small"===r.size&&{marginTop:4},r.contained&&{marginLeft:14,marginRight:14})})),k=o.forwardRef((function(e,t){var n=Object(d.a)({props:e,name:"MuiFormHelperText"}),o=n.children,l=n.className,s=n.component,u=void 0===s?"p":s,b=Object(r.a)(n,S),j=Object(f.a)(),h=Object(v.a)({props:n,muiFormControl:j,states:["variant","size","disabled","error","filled","focused","required"]}),p=Object(a.a)({},n,{component:u,contained:"filled"===h.variant||"outlined"===h.variant,variant:h.variant,size:h.size,disabled:h.disabled,error:h.error,filled:h.filled,focused:h.focused,required:h.required}),m=function(e){var t=e.classes,n=e.contained,a=e.size,r=e.disabled,o=e.error,i=e.filled,l=e.focused,s=e.required,d={root:["root",r&&"disabled",o&&"error",a&&"size".concat(Object(x.a)(a)),n&&"contained",l&&"focused",i&&"filled",s&&"required"]};return Object(c.a)(d,w,t)}(p);return Object(C.jsx)(F,Object(a.a)({as:u,ownerState:p,className:Object(i.a)(m.root,l),ref:t},b,{children:" "===o?Object(C.jsx)("span",{className:"notranslate",dangerouslySetInnerHTML:{__html:"&#8203;"}}):o}))})),R=n(971);function N(e){return Object(O.a)("MuiTextField",e)}Object(g.a)("MuiTextField",["root"]);var T=["autoComplete","autoFocus","children","className","color","defaultValue","disabled","error","FormHelperTextProps","fullWidth","helperText","id","InputLabelProps","inputProps","InputProps","inputRef","label","maxRows","minRows","multiline","name","onBlur","onChange","onFocus","placeholder","required","rows","select","SelectProps","type","value","variant"],z={standard:u.a,filled:b.a,outlined:j.a},P=Object(s.a)(p.a,{name:"MuiTextField",slot:"Root",overridesResolver:function(e,t){return t.root}})({}),I=o.forwardRef((function(e,t){var n=Object(d.a)({props:e,name:"MuiTextField"}),s=n.autoComplete,u=n.autoFocus,b=void 0!==u&&u,j=n.children,p=n.className,m=n.color,v=void 0===m?"primary":m,f=n.defaultValue,x=n.disabled,O=void 0!==x&&x,g=n.error,w=void 0!==g&&g,y=n.FormHelperTextProps,S=n.fullWidth,F=void 0!==S&&S,I=n.helperText,M=n.id,A=n.InputLabelProps,B=n.inputProps,L=n.InputProps,E=n.inputRef,H=n.label,D=n.maxRows,K=n.minRows,W=n.multiline,q=void 0!==W&&W,_=n.name,V=n.onBlur,Y=n.onChange,G=n.onFocus,J=n.placeholder,U=n.required,Q=void 0!==U&&U,X=n.rows,Z=n.select,$=void 0!==Z&&Z,ee=n.SelectProps,te=n.type,ne=n.value,ae=n.variant,re=void 0===ae?"outlined":ae,oe=Object(r.a)(n,T),ie=Object(a.a)({},n,{autoFocus:b,color:v,disabled:O,error:w,fullWidth:F,multiline:q,required:Q,select:$,variant:re}),ce=function(e){var t=e.classes;return Object(c.a)({root:["root"]},N,t)}(ie);var le={};if("outlined"===re&&(A&&"undefined"!==typeof A.shrink&&(le.notched=A.shrink),H)){var se,de=null!=(se=null==A?void 0:A.required)?se:Q;le.label=Object(C.jsxs)(o.Fragment,{children:[H,de&&"\xa0*"]})}$&&(ee&&ee.native||(le.id=void 0),le["aria-describedby"]=void 0);var ue=Object(l.a)(M),be=I&&ue?"".concat(ue,"-helper-text"):void 0,je=H&&ue?"".concat(ue,"-label"):void 0,he=z[re],pe=Object(C.jsx)(he,Object(a.a)({"aria-describedby":be,autoComplete:s,autoFocus:b,defaultValue:f,fullWidth:F,multiline:q,name:_,rows:X,maxRows:D,minRows:K,type:te,value:ne,id:ue,inputRef:E,onBlur:V,onChange:Y,onFocus:G,placeholder:J,inputProps:B},le,L));return Object(C.jsxs)(P,Object(a.a)({className:Object(i.a)(ce.root,p),disabled:O,error:w,fullWidth:F,ref:t,required:Q,color:v,variant:re,ownerState:ie},oe,{children:[H&&Object(C.jsx)(h.a,Object(a.a)({htmlFor:ue,id:je},A,{children:H})),$?Object(C.jsx)(R.a,Object(a.a)({"aria-describedby":be,id:ue,labelId:je,value:ne,input:pe},ee,{children:j})):pe,I&&Object(C.jsx)(k,Object(a.a)({id:be},y,{children:I}))]}))}));t.a=I},460:function(e,t,n){"use strict";var a=n(5),r=n(4),o=n(3),i=n(2),c=(n(12),n(8)),l=n(94),s=n(11),d=n(96),u=n(438),b=n(396),j=n(9),h=n(70),p=n(95);function m(e){return Object(h.a)("MuiInputAdornment",e)}var v=Object(p.a)("MuiInputAdornment",["root","filled","standard","outlined","positionStart","positionEnd","disablePointerEvents","hiddenLabel","sizeSmall"]),f=n(14),x=n(0),O=["children","className","component","disablePointerEvents","disableTypography","position","variant"],g=Object(j.a)("div",{name:"MuiInputAdornment",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,t["position".concat(Object(s.a)(n.position))],!0===n.disablePointerEvents&&t.disablePointerEvents,t[n.variant]]}})((function(e){var t=e.theme,n=e.ownerState;return Object(o.a)({display:"flex",height:"0.01em",maxHeight:"2em",alignItems:"center",whiteSpace:"nowrap",color:t.palette.action.active},"filled"===n.variant&&Object(a.a)({},"&.".concat(v.positionStart,"&:not(.").concat(v.hiddenLabel,")"),{marginTop:16}),"start"===n.position&&{marginRight:8},"end"===n.position&&{marginLeft:8},!0===n.disablePointerEvents&&{pointerEvents:"none"})})),w=i.forwardRef((function(e,t){var n=Object(f.a)({props:e,name:"MuiInputAdornment"}),a=n.children,j=n.className,h=n.component,p=void 0===h?"div":h,v=n.disablePointerEvents,w=void 0!==v&&v,y=n.disableTypography,C=void 0!==y&&y,S=n.position,F=n.variant,k=Object(r.a)(n,O),R=Object(b.a)()||{},N=F;F&&R.variant,R&&!N&&(N=R.variant);var T=Object(o.a)({},n,{hiddenLabel:R.hiddenLabel,size:R.size,disablePointerEvents:w,position:S,variant:N}),z=function(e){var t=e.classes,n=e.disablePointerEvents,a=e.hiddenLabel,r=e.position,o=e.size,i=e.variant,c={root:["root",n&&"disablePointerEvents",r&&"position".concat(Object(s.a)(r)),i,a&&"hiddenLabel",o&&"size".concat(Object(s.a)(o))]};return Object(l.a)(c,m,t)}(T);return Object(x.jsx)(u.a.Provider,{value:null,children:Object(x.jsx)(g,Object(o.a)({as:p,ownerState:T,className:Object(c.a)(z.root,j),ref:t},k,{children:"string"!==typeof a||C?Object(x.jsxs)(i.Fragment,{children:["start"===S?Object(x.jsx)("span",{className:"notranslate",dangerouslySetInnerHTML:{__html:"&#8203;"}}):null,a]}):Object(x.jsx)(d.a,{color:"text.secondary",children:a})}))})}));t.a=w},886:function(e,t,n){"use strict";n.r(t);var a=n(16),r=n(1),o=n(2),i=n(48),c=n.n(i),l=n(40),s=n(307),d=n(319),u=n(443),b=n(429),j=n(460),h=n(122),p=n(32),m=n(52),v=n(405),f=n(136),x=n(0),O={setErrorSnackMessage:p.e},g=Object(l.b)(null,O);t.default=Object(d.a)((function(e){return Object(s.a)(Object(r.a)(Object(r.a)(Object(r.a)({tableWrapper:{height:"450px"}},h.a),h.v),Object(h.f)(e.spacing(4))))}))(g((function(e){var t=e.classes,n=e.setErrorSnackMessage,r=e.match,i=Object(o.useState)([]),l=Object(a.a)(i,2),s=l[0],d=l[1],h=Object(o.useState)(""),p=Object(a.a)(h,2),O=p[0],g=p[1],w=Object(o.useState)(!0),y=Object(a.a)(w,2),C=y[0],S=y[1],F=r.params.tenantName,k=r.params.tenantNamespace;Object(o.useEffect)((function(){C&&m.a.invoke("GET","/api/v1/namespaces/".concat(k,"/tenants/").concat(F,"/pvcs")).then((function(e){var t=c()(e,"pvcs",[]);d(t||[]),S(!1)})).catch((function(e){S(!1),n(e)}))}),[C,n,F,k]);var R=s.filter((function(e){return e.name.includes(O)}));return Object(x.jsxs)(o.Fragment,{children:[Object(x.jsx)("h1",{className:t.sectionTitle,children:"Volumes"}),Object(x.jsx)(u.a,{item:!0,xs:12,className:t.actionsTray,children:Object(x.jsx)(b.a,{placeholder:"Search Volumes (PVCs)",className:t.searchField,id:"search-resource",label:"",InputProps:{disableUnderline:!0,startAdornment:Object(x.jsx)(j.a,{position:"start",children:Object(x.jsx)(f.default,{})})},onChange:function(e){g(e.target.value)},variant:"standard"})}),Object(x.jsx)(u.a,{item:!0,xs:12,children:Object(x.jsx)("br",{})}),Object(x.jsx)(u.a,{item:!0,xs:12,children:Object(x.jsx)(v.a,{itemActions:[],columns:[{label:"Name",elementKey:"name"},{label:"Status",elementKey:"status",width:120},{label:"Capacity",elementKey:"capacity",width:120},{label:"Storage Class",elementKey:"storageClass"}],isLoading:C,records:R,entityName:"PVCs",idField:"name",customPaperHeight:t.tableWrapper})})]})})))}}]);
//# sourceMappingURL=103.3402408d.chunk.js.map