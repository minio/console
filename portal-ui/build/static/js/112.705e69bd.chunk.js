(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[112],{406:function(e,t,n){"use strict";var c=n(16),o=n(13),i=n(1),a=n(2),r=n.n(a),l=n(39),s=n.n(l),d=n(404),u=n.n(d),b=n(96),j=n(388),h=n(984),f=n(444),O=n(387),x=n(375),g=n(787),m=n(450),p=n(308),v=n(320),w=n(483),C=n(449),k=n.n(C),S=n(448),y=n.n(S),B=n(447),T=n.n(B),I=n(20),N=n(385),_="#081C42",F="#081C42",A=n(0),E=function(e){var t=e.active,n=void 0!==t&&t;return Object(A.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(A.jsx)("path",{fill:n?F:_,d:"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"})})},R=function(e){var t=e.active,n=void 0!==t&&t;return Object(A.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(A.jsx)("path",{fill:n?F:_,d:"M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3v-3h18v3z"})})},z=function(e){var t=e.active,n=void 0!==t&&t;return Object(A.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",children:Object(A.jsx)("path",{fill:n?F:_,d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"})})},P=function(e){var t=e.active,n=void 0!==t&&t;return Object(A.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(A.jsx)("path",{fill:n?F:_,d:"M20 16h2v-2h-2v2zm0-9v5h2V7h-2zM10 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"})})},L=n(131),D=n(132),K=n(23),M=n(133),H=Object(v.a)((function(){return Object(p.a)({spacing:{margin:"0 8px"},buttonDisabled:{"&.MuiButtonBase-root.Mui-disabled":{cursor:"not-allowed",filter:"grayscale(100%)",opacity:"30%"}}})}))((function(e){var t=e.type,n=e.onClick,c=e.valueToSend,o=e.idField,i=e.selected,a=e.to,r=e.sendOnlyId,l=void 0!==r&&r,s=e.disabled,d=void 0!==s&&s,b=e.classes,h=e.label,f=l?c[o]:c,O="string"===typeof t?function(e,t){switch(e){case"view":case"preview":return Object(A.jsx)(K.Nb,{});case"edit":return Object(A.jsx)(L.default,{});case"delete":return Object(A.jsx)(D.a,{});case"description":return Object(A.jsx)(K.pb,{});case"share":return Object(A.jsx)(K.bc,{});case"cloud":return Object(A.jsx)(E,{active:t});case"console":return Object(A.jsx)(R,{active:t});case"download":return Object(A.jsx)(M.default,{});case"disable":return Object(A.jsx)(z,{active:t});case"format":return Object(A.jsx)(P,{active:t})}return null}(t,i):t,x=Object(A.jsx)(j.a,{"aria-label":"string"===typeof t?t:"",size:"small",className:"".concat(b.spacing," ").concat(d?b.buttonDisabled:""),disabled:d,onClick:n?function(e){e.stopPropagation(),d?e.preventDefault():n(f)}:function(){return null},children:O});return h&&""!==h&&(x=Object(A.jsx)(N.a,{title:h,children:x})),n?x:u()(a)?d?x:Object(A.jsx)(I.a,{to:"".concat(a,"/").concat(f),onClick:function(e){e.stopPropagation()},children:x}):null})),U=n(407),Y=n(53),W=n(122),G=function(e,t,n,c,i,r,l,d,b,j,h){var f=function(e,t,n,c,i,a,r){var l=Object(o.a)(e);a&&(l=e.filter((function(e){return r.includes(e.elementKey)})));var s=t;return c&&(s-=45),i&&(s-=n),l.reduce((function(e,t){return t.width?e-t.width:e}),s)/l.filter((function(e){return!e.width})).length}(e,t,n,c,i,d,b);return e.map((function(e,t){if(d&&!b.includes(e.elementKey))return null;var n=!e.enableSort||!e.enableSort;return Object(A.jsx)(m.b,{dataKey:e.elementKey,headerClassName:"titleHeader ".concat(e.headerTextAlign?"text-".concat(e.headerTextAlign):""),headerRenderer:function(){return Object(A.jsxs)(a.Fragment,{children:[j===e.elementKey&&Object(A.jsx)(a.Fragment,{children:"ASC"===h?Object(A.jsx)(T.a,{}):Object(A.jsx)(y.a,{})}),e.label]})},className:e.contentTextAlign?"text-".concat(e.contentTextAlign):"",cellRenderer:function(t){var n=t.rowData,c=!!r&&r.includes(u()(n)?n:n[l]);return function(e,t,n){var c=u()(e)?e:s()(e,t.elementKey,null),o=t.renderFullObject?e:c,i=t.renderFunction?t.renderFunction(o):o;return Object(A.jsx)(a.Fragment,{children:Object(A.jsx)("span",{className:n?"selected":"",children:i})})}(n,e,c)},width:e.width||f,disableSort:n,defaultSortDirection:"ASC"},"col-tb-".concat(t.toString()))}))};t.a=Object(v.a)((function(){return Object(p.a)(Object(i.a)(Object(i.a)({paper:{display:"flex",overflow:"auto",flexDirection:"column",padding:"8px 16px",boxShadow:"none",border:"#EAEDEE 1px solid",borderRadius:3,minHeight:200,overflowY:"scroll",position:"relative","&::-webkit-scrollbar":{width:3,height:3}},noBackground:{backgroundColor:"transparent",border:0},disabled:{backgroundColor:"#fbfafa",color:"#cccccc"},defaultPaperHeight:{height:"calc(100vh - 205px)"},loadingBox:{paddingTop:"100px",paddingBottom:"100px"},overlayColumnSelection:{position:"absolute",right:0,top:0},popoverContent:{maxHeight:250,overflowY:"auto",padding:"0 10px 10px"},shownColumnsLabel:{color:"#9c9c9c",fontSize:12,padding:10,borderBottom:"#eaeaea 1px solid",width:"100%"},checkAllWrapper:{marginTop:-16},"@global":{".rowLine":{borderBottom:"1px solid ".concat("#9c9c9c80"),height:40,color:"#393939",fontSize:14,transitionDuration:.3,"&:focus":{outline:"initial"},"&:hover:not(.ReactVirtualized__Table__headerRow)":{userSelect:"none",backgroundColor:"#ececec",fontWeight:600,"&.canClick":{cursor:"pointer"},"&.canSelectText":{userSelect:"text"}},"& .selected":{color:"#081C42",fontWeight:600}},".headerItem":{userSelect:"none",fontWeight:700,fontSize:14,fontStyle:"initial",display:"flex",alignItems:"center",outline:"none"},".ReactVirtualized__Table__headerRow":{fontWeight:700,fontSize:14,borderColor:"#39393980",textTransform:"initial"},".optionsAlignment":{textAlign:"center","& .min-icon":{width:16,height:16}},".text-center":{textAlign:"center"},".text-right":{textAlign:"right"},".progress-enabled":{paddingTop:3,display:"inline-block",margin:"0 10px",position:"relative",width:18,height:18},".progress-enabled > .MuiCircularProgress-root":{position:"absolute",left:0,top:3}}},W.d),W.u))}))((function(e){var t=e.itemActions,n=e.columns,o=e.onSelect,i=e.records,l=e.isLoading,s=e.loadingMessage,d=void 0===s?Object(A.jsx)(b.a,{component:"h3",children:"Loading..."}):s,p=e.entityName,v=e.selectedItems,C=e.idField,S=e.classes,y=e.radioSelection,B=void 0!==y&&y,T=e.customEmptyMessage,I=void 0===T?"":T,N=e.customPaperHeight,_=void 0===N?"":N,F=e.noBackground,E=void 0!==F&&F,R=e.columnsSelector,z=void 0!==R&&R,P=e.textSelectable,L=void 0!==P&&P,D=e.columnsShown,K=void 0===D?[]:D,M=e.onColumnChange,W=void 0===M?function(e,t){}:M,V=e.infiniteScrollConfig,J=e.sortConfig,q=e.autoScrollToBottom,Q=void 0!==q&&q,X=e.disabled,Z=void 0!==X&&X,$=e.onSelectAll,ee=Object(a.useState)(!1),te=Object(c.a)(ee,2),ne=te[0],ce=te[1],oe=r.a.useState(null),ie=Object(c.a)(oe,2),ae=ie[0],re=ie[1],le=t?t.find((function(e){return"view"===e.type})):null,se=function(e){ce(!ne),re(e.currentTarget)},de=function(){ce(!1),re(null)};return Object(A.jsx)(f.a,{item:!0,xs:12,children:Object(A.jsxs)(O.a,{className:"".concat(S.paper," ").concat(E?S.noBackground:"","\n        ").concat(Z?S.disabled:""," \n        ").concat(""!==_?_:S.defaultPaperHeight),children:[l&&Object(A.jsxs)(f.a,{container:!0,className:S.loadingBox,children:[Object(A.jsx)(f.a,{item:!0,xs:12,style:{textAlign:"center"},children:d}),Object(A.jsx)(f.a,{item:!0,xs:12,children:Object(A.jsx)(x.a,{})})]}),z&&!l&&i.length>0&&Object(A.jsx)("div",{className:S.overlayColumnSelection,children:function(e){return Object(A.jsxs)(a.Fragment,{children:[Object(A.jsx)(j.a,{"aria-describedby":"columnsSelector",color:"primary",onClick:se,size:"large",children:Object(A.jsx)(k.a,{fontSize:"inherit"})}),Object(A.jsxs)(h.a,{anchorEl:ae,id:"columnsSelector",open:ne,anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"},onClose:de,children:[Object(A.jsx)("div",{className:S.shownColumnsLabel,children:"Shown Columns"}),Object(A.jsx)("div",{className:S.popoverContent,children:e.map((function(e){return Object(A.jsx)(U.a,{label:e.label,checked:K.includes(e.elementKey),onChange:function(t){W(e.elementKey,t.target.checked)},id:"chbox-".concat(e.label),name:"chbox-".concat(e.label),value:e.label},"tableColumns-".concat(e.label))}))})]})]})}(n)}),i&&!l&&i.length>0?Object(A.jsx)(m.c,{isRowLoaded:function(e){var t=e.index;return!!i[t]},loadMoreRows:V?V.loadMoreRecords:function(){return new Promise((function(){return!0}))},rowCount:V?V.recordsCount:i.length,children:function(e){var c=e.onRowsRendered,r=e.registerChild;return Object(A.jsx)(m.a,{children:function(e){var l=e.width,s=e.height,d=function(e,t){var n=45*t+15;return n<80?80:n>e?e:n}(l,t?t.filter((function(e){return"view"!==e.type})).length:0),b=!(!o||!v),j=!!(t&&t.length>1||t&&1===t.length&&"view"!==t[0].type);return Object(A.jsxs)(m.d,{ref:r,disableHeader:!1,headerClassName:"headerItem",headerHeight:40,height:s,noRowsRenderer:function(){return Object(A.jsx)(a.Fragment,{children:""!==I?I:"There are no ".concat(p," yet.")})},overscanRowCount:10,rowHeight:40,width:l,rowCount:i.length,rowGetter:function(e){var t=e.index;return i[t]},onRowClick:function(e){!function(e){if(le){var t=le.sendOnlyId?e[C]:e,n=!1;if(le.disableButtonFunction&&le.disableButtonFunction(t)&&(n=!0),le.to&&!n)return void Y.a.push("".concat(le.to,"/").concat(t));le.onClick&&!n&&le.onClick(t)}}(e.rowData)},rowClassName:"rowLine ".concat(le?"canClick":""," ").concat(!le&&L?"canSelectText":""),onRowsRendered:c,sort:J?J.triggerSort:void 0,sortBy:J?J.currentSort:void 0,sortDirection:J?J.currentDirection:void 0,scrollToIndex:Q?i.length-1:-1,children:[b&&Object(A.jsx)(m.b,{headerRenderer:function(){return Object(A.jsx)(a.Fragment,{children:$?Object(A.jsx)("div",{className:S.checkAllWrapper,children:Object(A.jsx)(U.a,{label:"",onChange:$,value:"all",id:"selectAll",name:"selectAll",checked:(null===v||void 0===v?void 0:v.length)===i.length})}):Object(A.jsx)(a.Fragment,{children:"Select"})})},dataKey:"select-".concat(C),width:45,disableSort:!0,cellRenderer:function(e){var t=e.rowData,n=!!v&&v.includes(u()(t)?t:t[C]);return Object(A.jsx)(g.a,{value:u()(t)?t:t[C],color:"primary",inputProps:{"aria-label":"secondary checkbox"},checked:n,onChange:o,onClick:function(e){e.stopPropagation()},checkedIcon:Object(A.jsx)("span",{className:B?S.radioSelectedIcon:S.checkedIcon}),icon:Object(A.jsx)("span",{className:B?S.radioUnselectedIcon:S.unCheckedIcon})})}}),G(n,l,d,b,j,v||[],C,z,K,J?J.currentSort:"",J?J.currentDirection:void 0),j&&Object(A.jsx)(m.b,{headerRenderer:function(){return Object(A.jsx)(a.Fragment,{children:"Options"})},dataKey:C,width:d,headerClassName:"optionsAlignment",className:"optionsAlignment",cellRenderer:function(e){var n=e.rowData,c=!!v&&v.includes(u()(n)?n:n[C]);return function(e,t,n,c){return e.map((function(e,o){if("view"===e.type)return null;var i="string"===typeof t?t:t[c],a=!1;return e.disableButtonFunction&&e.disableButtonFunction(i)&&(a=!0),e.showLoaderFunction&&e.showLoaderFunction(i)?Object(A.jsx)("div",{className:"progress-enabled",children:Object(A.jsx)(w.a,{color:"primary",size:18,variant:"indeterminate"},"actions-loader-".concat(e.type,"-").concat(o.toString()))}):Object(A.jsx)(H,{label:e.label,type:e.type,onClick:e.onClick,to:e.to,valueToSend:t,selected:n,idField:c,sendOnlyId:!!e.sendOnlyId,disabled:a},"actions-".concat(e.type,"-").concat(o.toString()))}))}(t||[],n,c,C)}})]})}})}}):Object(A.jsx)(a.Fragment,{children:!l&&Object(A.jsx)("div",{children:""!==I?I:"There are no ".concat(p," yet.")})})]})})}))},407:function(e,t,n){"use strict";var c=n(1),o=n(2),i=n.n(o),a=n(444),r=n(787),l=n(822),s=n(385),d=n(308),u=n(320),b=n(122),j=n(123),h=n(0);t.a=Object(u.a)((function(e){return Object(d.a)(Object(c.a)(Object(c.a)(Object(c.a)(Object(c.a)({},b.i),b.E),b.d),{},{fieldContainer:Object(c.a)(Object(c.a)({},b.i.fieldContainer),{},{display:"flex",justifyContent:"flex-start",alignItems:"center",margin:"15px 0",marginBottom:0,flexBasis:"initial"})}))}))((function(e){var t=e.label,n=e.onChange,c=e.value,o=e.id,d=e.name,u=e.checked,b=void 0!==u&&u,f=e.disabled,O=void 0!==f&&f,x=e.tooltip,g=void 0===x?"":x,m=e.classes;return Object(h.jsx)(i.a.Fragment,{children:Object(h.jsxs)(a.a,{item:!0,xs:12,className:m.fieldContainer,children:[Object(h.jsx)("div",{children:Object(h.jsx)(r.a,{name:d,id:o,value:c,color:"primary",inputProps:{"aria-label":"secondary checkbox"},checked:b,onChange:n,checkedIcon:Object(h.jsx)("span",{className:m.checkedIcon}),icon:Object(h.jsx)("span",{className:m.unCheckedIcon}),disabled:O})}),""!==t&&Object(h.jsxs)(l.a,{htmlFor:o,className:m.noMinWidthLabel,children:[Object(h.jsx)("span",{children:t}),""!==g&&Object(h.jsx)("div",{className:m.tooltipContainer,children:Object(h.jsx)(s.a,{title:g,placement:"top-start",children:Object(h.jsx)("div",{className:m.tooltip,children:Object(h.jsx)(j.a,{})})})})]})]})})}))},472:function(e,t,n){"use strict";n(2);var c=n(308),o=n(320),i=n(0);t.a=Object(o.a)((function(e){return Object(c.a)({root:{padding:0,margin:0,fontSize:".9rem"}})}))((function(e){var t=e.classes,n=e.children;return Object(i.jsx)("h1",{className:t.root,children:n})}))},891:function(e,t,n){"use strict";n.r(t);var c=n(16),o=n(1),i=n(2),a=n.n(i),r=n(41),l=n(308),s=n(320),d=n(386),u=n(387),b=n(32),j=n(406),h=n(52),f=n(137),O=n(444),x=n(122),g=n(6),m=n(472),p=n(43),v=n(433),w=n(0),C=Object(v.a)(a.a.lazy((function(){return Promise.all([n.e(0),n.e(71),n.e(113)]).then(n.bind(null,898))}))),k=Object(v.a)(a.a.lazy((function(){return Promise.all([n.e(54),n.e(125)]).then(n.bind(null,899))}))),S=Object(v.a)(a.a.lazy((function(){return Promise.all([n.e(0),n.e(82),n.e(129)]).then(n.bind(null,900))}))),y=Object(r.b)((function(e){return{session:e.console.session,loadingBucket:e.buckets.bucketDetails.loadingBucket,bucketInfo:e.buckets.bucketDetails.bucketInfo}}),{setErrorSnackMessage:b.e});t.default=Object(s.a)((function(e){return Object(l.a)(Object(o.a)(Object(o.a)(Object(o.a)(Object(o.a)({"@global":{".rowLine:hover  .iconFileElm":{backgroundImage:"url(/images/ob_file_filled.svg)"},".rowLine:hover  .iconFolderElm":{backgroundImage:"url(/images/ob_folder_filled.svg)"}},listButton:{marginLeft:"10px",align:"right"}},x.a),x.v),x.r),Object(x.f)(e.spacing(4))))}))(y((function(e){var t=e.classes,n=e.match,o=e.setErrorSnackMessage,a=e.loadingBucket,r=(e.bucketInfo,Object(i.useState)(!0)),l=Object(c.a)(r,2),s=l[0],b=l[1],x=Object(i.useState)([]),v=Object(c.a)(x,2),y=v[0],B=v[1],T=Object(i.useState)(!1),I=Object(c.a)(T,2),N=I[0],_=I[1],F=Object(i.useState)(!1),A=Object(c.a)(F,2),E=A[0],R=A[1],z=Object(i.useState)(""),P=Object(c.a)(z,2),L=P[0],D=P[1],K=Object(i.useState)(!1),M=Object(c.a)(K,2),H=M[0],U=M[1],Y=Object(i.useState)(""),W=Object(c.a)(Y,2),G=W[0],V=W[1],J=Object(i.useState)(""),q=Object(c.a)(J,2),Q=q[0],X=q[1],Z=n.params.bucketName,$=Object(p.b)(Z,[g.f.S3_GET_BUCKET_POLICY]),ee=Object(p.b)(Z,[g.f.S3_DELETE_BUCKET_POLICY]),te=Object(p.b)(Z,[g.f.S3_PUT_BUCKET_POLICY]);Object(i.useEffect)((function(){a&&b(!0)}),[a,b]);var ne=[{type:"delete",disableButtonFunction:function(){return!ee},onClick:function(e){R(!0),D(e.prefix)}},{type:"view",disableButtonFunction:function(){return!te},onClick:function(e){V(e.prefix),X(e.access),U(!0)}}];Object(i.useEffect)((function(){s&&($?h.a.invoke("GET","/api/v1/bucket/".concat(Z,"/access-rules")).then((function(e){B(e.accessRules),b(!1)})).catch((function(e){o(e),b(!1)})):b(!1))}),[s,o,$,Z]);return Object(w.jsxs)(i.Fragment,{children:[N&&Object(w.jsx)(C,{modalOpen:N,onClose:function(){_(!1),b(!0)},bucket:Z}),E&&Object(w.jsx)(k,{modalOpen:E,onClose:function(){R(!1),b(!0)},bucket:Z,toDelete:L}),H&&Object(w.jsx)(S,{modalOpen:H,onClose:function(){U(!1),b(!0)},bucket:Z,toEdit:G,initial:Q}),Object(w.jsxs)(O.a,{item:!0,xs:12,className:t.actionsTray,children:[Object(w.jsx)(m.a,{children:"Access Rules"}),Object(w.jsx)(p.a,{scopes:[g.f.S3_GET_BUCKET_POLICY,g.f.S3_PUT_BUCKET_POLICY],resource:Z,matchAll:!0,errorProps:{disabled:!0},children:Object(w.jsx)(d.a,{variant:"contained",color:"primary",endIcon:Object(w.jsx)(f.a,{}),component:"label",onClick:function(){_(!0)},className:t.listButton,children:"Add Access Rule"})})]}),Object(w.jsx)(u.a,{children:Object(w.jsx)(p.a,{scopes:[g.f.S3_GET_BUCKET_POLICY],resource:Z,errorProps:{disabled:!0},children:Object(w.jsx)(j.a,{noBackground:!0,itemActions:ne,columns:[{label:"Prefix",elementKey:"prefix"},{label:"Access",elementKey:"access"}],isLoading:s,records:y,entityName:"Access Rules",idField:"prefix"})})})]})})))}}]);
//# sourceMappingURL=112.705e69bd.chunk.js.map