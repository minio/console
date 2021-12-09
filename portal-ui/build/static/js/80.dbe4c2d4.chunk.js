(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[80],{389:function(e,t,n){"use strict";var a,o=n(15),c=n(1),i=n(2),r=n(39),s=n(378),l=n(372),d=n(406),u=n(407),b=n(408),j=n(300),h=n(310),p=n(120),m=n(31),x=n(46),g=n.n(x),O=n(127),f=n.n(O),v=n(126),C=n.n(v),y=n(123),w=n.n(y),S=n(0),k=function(){clearInterval(a)},N={displayErrorMessage:m.h},I=Object(r.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),N)(Object(h.a)((function(e){return Object(j.a)({modalErrorContainer:{position:"absolute",marginTop:10,width:"80%",backgroundColor:"#fff",border:"#C72C48 1px solid",borderLeftWidth:12,borderRadius:3,zIndex:1e3,padding:"10px 15px",left:"50%",transform:"translateX(-50%)",opacity:0,transitionDuration:"0.2s"},modalErrorShow:{opacity:1},closeButton:{position:"absolute",right:5,fontSize:"small",border:0,backgroundColor:"#fff",cursor:"pointer"},errorTitle:{display:"flex",alignItems:"center"},errorLabel:{color:"#000",fontSize:18,fontWeight:500,marginLeft:5,marginRight:25},messageIcon:{color:"#C72C48",display:"flex","& svg":{width:32,height:32}},detailsButton:{color:"#9C9C9C",display:"flex",alignItems:"center",border:0,backgroundColor:"transparent",paddingLeft:5,fontSize:14,transformDuration:"0.3s",cursor:"pointer"},extraDetailsContainer:{fontStyle:"italic",color:"#9C9C9C",lineHeight:0,padding:"0 10px",transition:"all .2s ease-in-out",overflow:"hidden"},extraDetailsOpen:{lineHeight:1,padding:"3px 10px"},arrowElement:{marginLeft:-5},arrowOpen:{transform:"rotateZ(90deg)",transformDuration:"0.3s"}})}))((function(e){var t=e.classes,n=e.modalSnackMessage,c=e.displayErrorMessage,r=e.customStyle,s=Object(i.useState)(!1),l=Object(o.a)(s,2),d=l[0],u=l[1],b=Object(i.useState)(!1),j=Object(o.a)(b,2),h=j[0],p=j[1],m=Object(i.useCallback)((function(){p(!1)}),[]);Object(i.useEffect)((function(){h||(c({detailedError:"",errorMessage:""}),u(!1))}),[c,h]),Object(i.useEffect)((function(){""!==n.message&&"error"===n.type&&p(!0)}),[m,n.message,n.type]);var x=g()(n,"message",""),O=g()(n,"detailedErrorMsg","");return"error"!==n.type||""===x?null:Object(S.jsx)(i.Fragment,{children:Object(S.jsxs)("div",{className:"".concat(t.modalErrorContainer," ").concat(h?t.modalErrorShow:""),style:r,onMouseOver:k,onMouseLeave:function(){a=setInterval(m,1e4)},children:[Object(S.jsx)("button",{className:t.closeButton,onClick:m,children:Object(S.jsx)(w.a,{})}),Object(S.jsxs)("div",{className:t.errorTitle,children:[Object(S.jsx)("span",{className:t.messageIcon,children:Object(S.jsx)(C.a,{})}),Object(S.jsx)("span",{className:t.errorLabel,children:x})]}),""!==O&&Object(S.jsxs)(i.Fragment,{children:[Object(S.jsx)("div",{className:t.detailsContainerLink,children:Object(S.jsxs)("button",{className:t.detailsButton,onClick:function(){u(!d)},children:["Details",Object(S.jsx)(f.a,{className:"".concat(t.arrowElement," ").concat(d?t.arrowOpen:"")})]})}),Object(S.jsx)("div",{className:"".concat(t.extraDetailsContainer," ").concat(d?t.extraDetailsOpen:""),children:O})]})]})})}))),z={content:'" "',borderLeft:"2px solid #9C9C9C",height:33,width:1,position:"absolute"},D=Object(r.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),{setModalSnackMessage:m.i});t.a=Object(h.a)((function(e){return Object(j.a)(Object(c.a)({dialogContainer:{padding:"8px 15px 22px"},closeContainer:{textAlign:"right"},closeButton:{height:16,width:16,padding:0,backgroundColor:"initial","&:hover":{backgroundColor:"initial"},"&:active":{backgroundColor:"initial"}},closeIcon:{"&::before":Object(c.a)(Object(c.a)({},z),{},{transform:"rotate(45deg)",height:12}),"&::after":Object(c.a)(Object(c.a)({},z),{},{transform:"rotate(-45deg)",height:12}),"&:hover::before, &:hover::after":{borderColor:"#9C9C9C"},display:"block",position:"relative",height:12,width:12},titleClass:{padding:"0px 50px 12px",fontSize:"1.2rem",fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"},modalContent:{padding:"0 50px"},customDialogSize:{width:"100%",maxWidth:765}},p.y))}))(D((function(e){var t=e.onClose,n=e.modalOpen,a=e.title,r=e.children,j=e.classes,h=e.wideLimit,p=void 0===h||h,m=e.modalSnackMessage,x=e.noContentPadding,g=e.setModalSnackMessage,O=Object(i.useState)(!1),f=Object(o.a)(O,2),v=f[0],C=f[1];Object(i.useEffect)((function(){g("")}),[g]),Object(i.useEffect)((function(){if(m){if(""===m.message)return void C(!1);"error"!==m.type&&C(!0)}}),[m]);var y=p?{classes:{paper:j.customDialogSize}}:{maxWidth:"lg",fullWidth:!0},w="";return m&&(w=m.detailedErrorMsg,(""===m.detailedErrorMsg||m.detailedErrorMsg.length<5)&&(w=m.message)),Object(S.jsx)(d.a,Object(c.a)(Object(c.a)({open:n,onClose:t,"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description"},y),{},{children:Object(S.jsxs)("div",{className:j.dialogContainer,children:[Object(S.jsx)(I,{}),Object(S.jsx)(l.a,{open:v,className:j.snackBarModal,onClose:function(){C(!1),g("")},message:w,ContentProps:{className:"".concat(j.snackBar," ").concat(m&&"error"===m.type?j.errorSnackBar:"")},autoHideDuration:m&&"error"===m.type?1e4:5e3}),Object(S.jsx)("div",{className:j.closeContainer,children:Object(S.jsx)(s.a,{"aria-label":"close",className:j.closeButton,onClick:t,disableRipple:!0,size:"large",children:Object(S.jsx)("span",{className:j.closeIcon})})}),Object(S.jsx)(u.a,{id:"alert-dialog-title",className:j.titleClass,children:a}),Object(S.jsx)(b.a,{className:x?"":j.modalContent,children:r})]})}))})))},390:function(e,t,n){"use strict";var a=n(1),o=n(2),c=n.n(o),i=n(415),r=n(436),s=n(809),l=n(376),d=n(378),u=n(300),b=n(369),j=n(310),h=n(120),p=n(121),m=n(0),x=Object(b.a)((function(e){return Object(u.a)(Object(a.a)({},h.n))}));function g(e){var t=x();return Object(m.jsx)(i.a,Object(a.a)({InputProps:{classes:t}},e))}t.a=Object(j.a)((function(e){return Object(u.a)(Object(a.a)(Object(a.a)(Object(a.a)({},h.i),h.D),{},{textBoxContainer:{flexGrow:1,position:"relative"},overlayAction:{position:"absolute",right:5,top:6,"& svg":{maxWidth:15,maxHeight:15},"&.withLabel":{top:5}}}))}))((function(e){var t=e.label,n=e.onChange,o=e.value,i=e.id,u=e.name,b=e.type,j=void 0===b?"text":b,h=e.autoComplete,x=void 0===h?"off":h,O=e.disabled,f=void 0!==O&&O,v=e.multiline,C=void 0!==v&&v,y=e.tooltip,w=void 0===y?"":y,S=e.index,k=void 0===S?0:S,N=e.error,I=void 0===N?"":N,z=e.required,D=void 0!==z&&z,A=e.placeholder,T=void 0===A?"":A,B=e.min,E=e.max,F=e.overlayIcon,M=void 0===F?null:F,L=e.overlayObject,R=void 0===L?null:L,_=e.extraInputProps,P=void 0===_?{}:_,W=e.overlayAction,H=e.noLabelMinWidth,K=void 0!==H&&H,V=e.classes,q=Object(a.a)({"data-index":k},P);return"number"===j&&B&&(q.min=B),"number"===j&&E&&(q.max=E),Object(m.jsx)(c.a.Fragment,{children:Object(m.jsxs)(r.a,{container:!0,className:" ".concat(""!==I?V.errorInField:V.inputBoxContainer),children:[""!==t&&Object(m.jsxs)(s.a,{htmlFor:i,className:K?V.noMinWidthLabel:V.inputLabel,children:[Object(m.jsxs)("span",{children:[t,D?"*":""]}),""!==w&&Object(m.jsx)("div",{className:V.tooltipContainer,children:Object(m.jsx)(l.a,{title:w,placement:"top-start",children:Object(m.jsx)("div",{className:V.tooltip,children:Object(m.jsx)(p.a,{})})})})]}),Object(m.jsxs)("div",{className:V.textBoxContainer,children:[Object(m.jsx)(g,{id:i,name:u,fullWidth:!0,value:o,disabled:f,onChange:n,type:j,multiline:C,autoComplete:x,inputProps:q,error:""!==I,helperText:I,placeholder:T,className:V.inputRebase}),M&&Object(m.jsx)("div",{className:"".concat(V.overlayAction," ").concat(""!==t?"withLabel":""),children:Object(m.jsx)(d.a,{onClick:W?function(){W()}:function(){return null},size:"small",disableFocusRipple:!1,disableRipple:!1,disableTouchRipple:!1,children:M})}),R&&Object(m.jsx)("div",{className:"".concat(V.overlayAction," ").concat(""!==t?"withLabel":""),children:R})]})]})})}))},396:function(e,t,n){"use strict";var a=n(15),o=n(14),c=n(1),i=n(2),r=n.n(i),s=n(46),l=n.n(s),d=n(394),u=n.n(d),b=n(95),j=n(378),h=n(972),p=n(436),m=n(377),x=n(366),g=n(778),O=n(443),f=n(300),v=n(310),C=n(476),y=n(442),w=n.n(y),S=n(441),k=n.n(S),N=n(440),I=n.n(N),z=n(21),D=n(376),A="#081C42",T="#081C42",B=n(0),E=function(e){var t=e.active,n=void 0!==t&&t;return Object(B.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(B.jsx)("path",{fill:n?T:A,d:"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"})})},F=function(e){var t=e.active,n=void 0!==t&&t;return Object(B.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(B.jsx)("path",{fill:n?T:A,d:"M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3v-3h18v3z"})})},M=function(e){var t=e.active,n=void 0!==t&&t;return Object(B.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",children:Object(B.jsx)("path",{fill:n?T:A,d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"})})},L=function(e){var t=e.active,n=void 0!==t&&t;return Object(B.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",children:Object(B.jsx)("path",{fill:n?T:A,d:"M20 16h2v-2h-2v2zm0-9v5h2V7h-2zM10 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"})})},R=n(129),_=n(130),P=n(22),W=n(131),H=Object(v.a)((function(){return Object(f.a)({spacing:{margin:"0 8px"},buttonDisabled:{"&.MuiButtonBase-root.Mui-disabled":{cursor:"not-allowed",filter:"grayscale(100%)",opacity:"30%"}}})}))((function(e){var t=e.type,n=e.onClick,a=e.valueToSend,o=e.idField,c=e.selected,i=e.to,r=e.sendOnlyId,s=void 0!==r&&r,l=e.disabled,d=void 0!==l&&l,b=e.classes,h=e.label,p=s?a[o]:a,m="string"===typeof t?function(e,t){switch(e){case"view":case"preview":return Object(B.jsx)(P.sb,{});case"edit":return Object(B.jsx)(R.default,{});case"delete":return Object(B.jsx)(_.a,{});case"description":return Object(B.jsx)(P.Y,{});case"share":return Object(B.jsx)(P.Fb,{});case"cloud":return Object(B.jsx)(E,{active:t});case"console":return Object(B.jsx)(F,{active:t});case"download":return Object(B.jsx)(W.default,{});case"disable":return Object(B.jsx)(M,{active:t});case"format":return Object(B.jsx)(L,{active:t})}return null}(t,c):t,x=Object(B.jsx)(j.a,{"aria-label":"string"===typeof t?t:"",size:"small",className:"".concat(b.spacing," ").concat(d?b.buttonDisabled:""),disabled:d,onClick:n?function(e){e.stopPropagation(),d?e.preventDefault():n(p)}:function(){return null},children:m});return h&&""!==h&&(x=Object(B.jsx)(D.a,{title:h,children:x})),n?x:u()(i)?d?x:Object(B.jsx)(z.a,{to:"".concat(i,"/").concat(p),onClick:function(e){e.stopPropagation()},children:x}):null})),K=n(397),V=n(53),q=n(120),G=function(e,t,n,a,c,r,s,d,b,j,h){var p=function(e,t,n,a,c,i,r){var s=Object(o.a)(e);i&&(s=e.filter((function(e){return r.includes(e.elementKey)})));var l=t;return a&&(l-=45),c&&(l-=n),s.reduce((function(e,t){return t.width?e-t.width:e}),l)/s.filter((function(e){return!e.width})).length}(e,t,n,a,c,d,b);return e.map((function(e,t){if(d&&!b.includes(e.elementKey))return null;var n=!e.enableSort||!e.enableSort;return Object(B.jsx)(O.b,{dataKey:e.elementKey,headerClassName:"titleHeader ".concat(e.headerTextAlign?"text-".concat(e.headerTextAlign):""),headerRenderer:function(){return Object(B.jsxs)(i.Fragment,{children:[j===e.elementKey&&Object(B.jsx)(i.Fragment,{children:"ASC"===h?Object(B.jsx)(I.a,{}):Object(B.jsx)(k.a,{})}),e.label]})},className:e.contentTextAlign?"text-".concat(e.contentTextAlign):"",cellRenderer:function(t){var n=t.rowData,a=!!r&&r.includes(u()(n)?n:n[s]);return function(e,t,n){var a=u()(e)?e:l()(e,t.elementKey,null),o=t.renderFullObject?e:a,c=t.renderFunction?t.renderFunction(o):o;return Object(B.jsx)(i.Fragment,{children:Object(B.jsx)("span",{className:n?"selected":"",children:c})})}(n,e,a)},width:e.width||p,disableSort:n,defaultSortDirection:"ASC"},"col-tb-".concat(t.toString()))}))};t.a=Object(v.a)((function(){return Object(f.a)(Object(c.a)(Object(c.a)({paper:{display:"flex",overflow:"auto",flexDirection:"column",padding:"8px 16px",boxShadow:"none",border:"#EAEDEE 1px solid",borderRadius:3,minHeight:200,overflowY:"scroll",position:"relative","&::-webkit-scrollbar":{width:3,height:3}},noBackground:{backgroundColor:"transparent",border:0},disabled:{backgroundColor:"#fbfafa",color:"#cccccc"},defaultPaperHeight:{height:"calc(100vh - 205px)"},loadingBox:{paddingTop:"100px",paddingBottom:"100px"},overlayColumnSelection:{position:"absolute",right:0,top:0},popoverContent:{maxHeight:250,overflowY:"auto",padding:"0 10px 10px"},shownColumnsLabel:{color:"#9c9c9c",fontSize:12,padding:10,borderBottom:"#eaeaea 1px solid",width:"100%"},checkAllWrapper:{marginTop:-16},"@global":{".rowLine":{borderBottom:"1px solid ".concat("#9c9c9c80"),height:40,color:"#393939",fontSize:14,transitionDuration:.3,"&:focus":{outline:"initial"},"&:hover:not(.ReactVirtualized__Table__headerRow)":{userSelect:"none",backgroundColor:"#ececec",fontWeight:600,"&.canClick":{cursor:"pointer"},"&.canSelectText":{userSelect:"text"}},"& .selected":{color:"#081C42",fontWeight:600}},".headerItem":{userSelect:"none",fontWeight:700,fontSize:14,fontStyle:"initial",display:"flex",alignItems:"center",outline:"none"},".ReactVirtualized__Table__headerRow":{fontWeight:700,fontSize:14,borderColor:"#39393980",textTransform:"initial"},".optionsAlignment":{textAlign:"center","& .min-icon":{width:16,height:16}},".text-center":{textAlign:"center"},".text-right":{textAlign:"right"},".progress-enabled":{paddingTop:3,display:"inline-block",margin:"0 10px",position:"relative",width:18,height:18},".progress-enabled > .MuiCircularProgress-root":{position:"absolute",left:0,top:3}}},q.d),q.t))}))((function(e){var t=e.itemActions,n=e.columns,o=e.onSelect,c=e.records,s=e.isLoading,l=e.loadingMessage,d=void 0===l?Object(B.jsx)(b.a,{component:"h3",children:"Loading..."}):l,f=e.entityName,v=e.selectedItems,y=e.idField,S=e.classes,k=e.radioSelection,N=void 0!==k&&k,I=e.customEmptyMessage,z=void 0===I?"":I,D=e.customPaperHeight,A=void 0===D?"":D,T=e.noBackground,E=void 0!==T&&T,F=e.columnsSelector,M=void 0!==F&&F,L=e.textSelectable,R=void 0!==L&&L,_=e.columnsShown,P=void 0===_?[]:_,W=e.onColumnChange,q=void 0===W?function(e,t){}:W,Y=e.infiniteScrollConfig,J=e.sortConfig,U=e.autoScrollToBottom,X=void 0!==U&&U,Z=e.disabled,Q=void 0!==Z&&Z,$=e.onSelectAll,ee=Object(i.useState)(!1),te=Object(a.a)(ee,2),ne=te[0],ae=te[1],oe=r.a.useState(null),ce=Object(a.a)(oe,2),ie=ce[0],re=ce[1],se=t?t.find((function(e){return"view"===e.type})):null,le=function(e){ae(!ne),re(e.currentTarget)},de=function(){ae(!1),re(null)};return Object(B.jsx)(p.a,{item:!0,xs:12,children:Object(B.jsxs)(m.a,{className:"".concat(S.paper," ").concat(E?S.noBackground:"","\n        ").concat(Q?S.disabled:""," \n        ").concat(""!==A?A:S.defaultPaperHeight),children:[s&&Object(B.jsxs)(p.a,{container:!0,className:S.loadingBox,children:[Object(B.jsx)(p.a,{item:!0,xs:12,style:{textAlign:"center"},children:d}),Object(B.jsx)(p.a,{item:!0,xs:12,children:Object(B.jsx)(x.a,{})})]}),M&&!s&&c.length>0&&Object(B.jsx)("div",{className:S.overlayColumnSelection,children:function(e){return Object(B.jsxs)(i.Fragment,{children:[Object(B.jsx)(j.a,{"aria-describedby":"columnsSelector",color:"primary",onClick:le,size:"large",children:Object(B.jsx)(w.a,{fontSize:"inherit"})}),Object(B.jsxs)(h.a,{anchorEl:ie,id:"columnsSelector",open:ne,anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"},onClose:de,children:[Object(B.jsx)("div",{className:S.shownColumnsLabel,children:"Shown Columns"}),Object(B.jsx)("div",{className:S.popoverContent,children:e.map((function(e){return Object(B.jsx)(K.a,{label:e.label,checked:P.includes(e.elementKey),onChange:function(t){q(e.elementKey,t.target.checked)},id:"chbox-".concat(e.label),name:"chbox-".concat(e.label),value:e.label},"tableColumns-".concat(e.label))}))})]})]})}(n)}),c&&!s&&c.length>0?Object(B.jsx)(O.c,{isRowLoaded:function(e){var t=e.index;return!!c[t]},loadMoreRows:Y?Y.loadMoreRecords:function(){return new Promise((function(){return!0}))},rowCount:Y?Y.recordsCount:c.length,children:function(e){var a=e.onRowsRendered,r=e.registerChild;return Object(B.jsx)(O.a,{children:function(e){var s=e.width,l=e.height,d=function(e,t){var n=45*t+15;return n<80?80:n>e?e:n}(s,t?t.filter((function(e){return"view"!==e.type})).length:0),b=!(!o||!v),j=!!(t&&t.length>1||t&&1===t.length&&"view"!==t[0].type);return Object(B.jsxs)(O.d,{ref:r,disableHeader:!1,headerClassName:"headerItem",headerHeight:40,height:l,noRowsRenderer:function(){return Object(B.jsx)(i.Fragment,{children:""!==z?z:"There are no ".concat(f," yet.")})},overscanRowCount:10,rowHeight:40,width:s,rowCount:c.length,rowGetter:function(e){var t=e.index;return c[t]},onRowClick:function(e){!function(e){if(se){var t=se.sendOnlyId?e[y]:e,n=!1;if(se.disableButtonFunction&&se.disableButtonFunction(t)&&(n=!0),se.to&&!n)return void V.a.push("".concat(se.to,"/").concat(t));se.onClick&&!n&&se.onClick(t)}}(e.rowData)},rowClassName:"rowLine ".concat(se?"canClick":""," ").concat(!se&&R?"canSelectText":""),onRowsRendered:a,sort:J?J.triggerSort:void 0,sortBy:J?J.currentSort:void 0,sortDirection:J?J.currentDirection:void 0,scrollToIndex:X?c.length-1:-1,children:[b&&Object(B.jsx)(O.b,{headerRenderer:function(){return Object(B.jsx)(i.Fragment,{children:$?Object(B.jsx)("div",{className:S.checkAllWrapper,children:Object(B.jsx)(K.a,{label:"",onChange:$,value:"all",id:"selectAll",name:"selectAll",checked:(null===v||void 0===v?void 0:v.length)===c.length})}):Object(B.jsx)(i.Fragment,{children:"Select"})})},dataKey:"select-".concat(y),width:45,disableSort:!0,cellRenderer:function(e){var t=e.rowData,n=!!v&&v.includes(u()(t)?t:t[y]);return Object(B.jsx)(g.a,{value:u()(t)?t:t[y],color:"primary",inputProps:{"aria-label":"secondary checkbox"},checked:n,onChange:o,onClick:function(e){e.stopPropagation()},checkedIcon:Object(B.jsx)("span",{className:N?S.radioSelectedIcon:S.checkedIcon}),icon:Object(B.jsx)("span",{className:N?S.radioUnselectedIcon:S.unCheckedIcon})})}}),G(n,s,d,b,j,v||[],y,M,P,J?J.currentSort:"",J?J.currentDirection:void 0),j&&Object(B.jsx)(O.b,{headerRenderer:function(){return Object(B.jsx)(i.Fragment,{children:"Options"})},dataKey:y,width:d,headerClassName:"optionsAlignment",className:"optionsAlignment",cellRenderer:function(e){var n=e.rowData,a=!!v&&v.includes(u()(n)?n:n[y]);return function(e,t,n,a){return e.map((function(e,o){if("view"===e.type)return null;var c="string"===typeof t?t:t[a],i=!1;return e.disableButtonFunction&&e.disableButtonFunction(c)&&(i=!0),e.showLoaderFunction&&e.showLoaderFunction(c)?Object(B.jsx)("div",{className:"progress-enabled",children:Object(B.jsx)(C.a,{color:"primary",size:18,variant:"indeterminate"},"actions-loader-".concat(e.type,"-").concat(o.toString()))}):Object(B.jsx)(H,{label:e.label,type:e.type,onClick:e.onClick,to:e.to,valueToSend:t,selected:n,idField:a,sendOnlyId:!!e.sendOnlyId,disabled:i},"actions-".concat(e.type,"-").concat(o.toString()))}))}(t||[],n,a,y)}})]})}})}}):Object(B.jsx)(i.Fragment,{children:!s&&Object(B.jsx)("div",{children:""!==z?z:"There are no ".concat(f," yet.")})})]})})}))},397:function(e,t,n){"use strict";var a=n(1),o=n(2),c=n.n(o),i=n(436),r=n(778),s=n(809),l=n(376),d=n(300),u=n(310),b=n(120),j=n(121),h=n(0);t.a=Object(u.a)((function(e){return Object(d.a)(Object(a.a)(Object(a.a)(Object(a.a)(Object(a.a)({},b.i),b.D),b.d),{},{fieldContainer:Object(a.a)(Object(a.a)({},b.i.fieldContainer),{},{display:"flex",justifyContent:"flex-start",alignItems:"center",margin:"15px 0",marginBottom:0,flexBasis:"initial"})}))}))((function(e){var t=e.label,n=e.onChange,a=e.value,o=e.id,d=e.name,u=e.checked,b=void 0!==u&&u,p=e.disabled,m=void 0!==p&&p,x=e.tooltip,g=void 0===x?"":x,O=e.classes;return Object(h.jsx)(c.a.Fragment,{children:Object(h.jsxs)(i.a,{item:!0,xs:12,className:O.fieldContainer,children:[Object(h.jsx)("div",{children:Object(h.jsx)(r.a,{name:d,id:o,value:a,color:"primary",inputProps:{"aria-label":"secondary checkbox"},checked:b,onChange:n,checkedIcon:Object(h.jsx)("span",{className:O.checkedIcon}),icon:Object(h.jsx)("span",{className:O.unCheckedIcon}),disabled:m})}),""!==t&&Object(h.jsxs)(s.a,{htmlFor:o,className:O.noMinWidthLabel,children:[Object(h.jsx)("span",{children:t}),""!==g&&Object(h.jsx)("div",{className:O.tooltipContainer,children:Object(h.jsx)(l.a,{title:g,placement:"top-start",children:Object(h.jsx)("div",{className:O.tooltip,children:Object(h.jsx)(j.a,{})})})})]})]})})}))},435:function(e,t,n){"use strict";var a=n(1),o=n(2),c=n.n(o),i=n(436),r=n(779),s=n(809),l=n(376),d=n(971),u=n(957),b=n(488),j=n(300),h=n(310),p=n(120),m=n(121),x=n(0),g=Object(h.a)((function(e){return Object(j.a)({root:{height:38,lineHeight:1,"label + &":{marginTop:e.spacing(3)}},input:{height:38,position:"relative",color:"#07193E",fontSize:13,fontWeight:600,padding:"8px 20px 10px 10px",border:"#e5e5e5 1px solid",borderRadius:4,display:"flex",alignItems:"center","&:hover":{borderColor:"#393939"},"&:focus":{backgroundColor:"#fff"}}})}))(r.c);t.a=Object(h.a)((function(e){return Object(j.a)(Object(a.a)(Object(a.a)({},p.i),p.D))}))((function(e){var t=e.classes,n=e.id,a=e.name,o=e.onChange,r=e.options,j=e.label,h=e.tooltip,p=void 0===h?"":h,O=e.value,f=e.disabled,v=void 0!==f&&f;return Object(x.jsx)(c.a.Fragment,{children:Object(x.jsxs)(i.a,{item:!0,xs:12,className:t.fieldContainer,children:[""!==j&&Object(x.jsxs)(s.a,{htmlFor:n,className:t.inputLabel,children:[Object(x.jsx)("span",{children:j}),""!==p&&Object(x.jsx)("div",{className:t.tooltipContainer,children:Object(x.jsx)(l.a,{title:p,placement:"top-start",children:Object(x.jsx)("div",{className:t.tooltip,children:Object(x.jsx)(m.a,{})})})})]}),Object(x.jsx)(d.a,{fullWidth:!0,children:Object(x.jsx)(u.a,{id:n,name:a,value:O,onChange:o,input:Object(x.jsx)(g,{}),disabled:v,children:r.map((function(e){return Object(x.jsx)(b.a,{value:e.value,children:e.label},"select-".concat(a,"-").concat(e.label))}))})})]})})}))},762:function(e,t,n){"use strict";n.d(t,"a",(function(){return a})),n.d(t,"b",(function(){return o}));var a=function(e,t){return{podAntiAffinity:{requiredDuringSchedulingIgnoredDuringExecution:[{labelSelector:{matchExpressions:[{key:"v1.min.io/tenant",operator:"In",values:[e]},{key:"v1.min.io/pool",operator:"In",values:[t]}]},topologyKey:"kubernetes.io/hostname"}]}}},o=function(e,t,n,o){var c=e.split("&"),i=[];c.forEach((function(e){var t=e.split("=");2===t.length&&i.push({key:t[0],operator:"In",values:[t[1]]})}));var r={nodeAffinity:{requiredDuringSchedulingIgnoredDuringExecution:{nodeSelectorTerms:[{matchExpressions:i}]}}};if(t){var s=a(n,o);r.podAntiAffinity=s.podAntiAffinity}return console.log(r),r}},909:function(e,t,n){"use strict";n.r(t);var a=n(15),o=n(1),c=n(2),i=n(39),r=n(300),s=n(310),l=n(120),d=n(415),u=n(380),b=n(436),j=n(22),h=n(31),p=n(396),m=n(46),x=n.n(m),g=n(389),O=n(390),f=n(58),v=n(366),C=n(52),y=n(762),w=n(435),S=n(0),k=Object(s.a)((function(e){return Object(r.a)(Object(o.a)({buttonContainer:{textAlign:"right"},bottomContainer:{display:"flex",flexGrow:1,alignItems:"center","& div":{flexGrow:1,width:"100%"}},factorElements:{display:"flex",justifyContent:"flex-start"},sizeNumber:{fontSize:35,fontWeight:700,textAlign:"center"},sizeDescription:{fontSize:14,color:"#777",textAlign:"center"}},l.p))}))((function(e){var t=e.tenant,n=e.classes,o=e.open,i=e.onClosePoolAndReload,r=Object(c.useState)(!1),s=Object(a.a)(r,2),l=s[0],d=s[1],j=Object(c.useState)(0),h=Object(a.a)(j,2),p=h[0],m=h[1],k=Object(c.useState)(0),N=Object(a.a)(k,2),I=N[0],z=N[1],D=Object(c.useState)(0),A=Object(a.a)(D,2),T=A[0],B=A[1],E=Object(c.useState)(""),F=Object(a.a)(E,2),M=F[0],L=F[1],R=Object(c.useState)([]),_=Object(a.a)(R,2),P=_[0],W=_[1],H=1073741824*I*T,K=H*p;return Object(c.useEffect)((function(){L(""),W([]),C.a.invoke("GET","/api/v1/namespaces/".concat(t.namespace,"/resourcequotas/").concat(t.namespace,"-storagequota")).then((function(e){var t=x()(e,"elements",[]).map((function(e){var t=x()(e,"name","").split(".storageclass.storage.k8s.io/requests.storage")[0];return{label:t,value:t}}));W(t),t.length>0&&L(t[0].value)})).catch((function(e){console.error(e)}))}),[t]),Object(S.jsx)(g.a,{onClose:function(){return i(!1)},modalOpen:o,title:"Add Pool",children:Object(S.jsxs)("form",{noValidate:!0,autoComplete:"off",onSubmit:function(e){e.preventDefault(),d(!0);var n=Object(f.h)(t.pools),a=Object(y.a)(t.name,n),o={name:n,servers:p,volumes_per_server:T,volume_configuration:{size:1073741824*I,storage_class_name:M,labels:null},affinity:a};C.a.invoke("POST","/api/v1/namespaces/".concat(t.namespace,"/tenants/").concat(t.name,"/pools"),o).then((function(){d(!1),i(!0)})).catch((function(e){d(!1)}))},children:[Object(S.jsx)(b.a,{item:!0,xs:12,children:Object(S.jsx)(O.a,{id:"number_of_nodes",name:"number_of_nodes",type:"number",onChange:function(e){m(parseInt(e.target.value))},label:"Number o Nodes",value:p.toString(10)})}),Object(S.jsx)(b.a,{item:!0,xs:12,children:Object(S.jsx)(O.a,{id:"pool_size",name:"pool_size",type:"number",onChange:function(e){z(parseInt(e.target.value))},label:"Volume Size (Gi)",value:I.toString(10)})}),Object(S.jsx)(b.a,{item:!0,xs:12,children:Object(S.jsx)(O.a,{id:"volumes_per_sever",name:"volumes_per_sever",type:"number",onChange:function(e){B(parseInt(e.target.value))},label:"Volumes per Server",value:T.toString(10)})}),Object(S.jsx)(b.a,{item:!0,xs:12,children:Object(S.jsx)(w.a,{id:"storage_class",name:"storage_class",onChange:function(e){L(e.target.value)},label:"Storage Class",value:M,options:P,disabled:P.length<1})}),Object(S.jsxs)(b.a,{item:!0,xs:12,children:[Object(S.jsxs)(b.a,{item:!0,xs:12,className:n.bottomContainer,children:[Object(S.jsxs)("div",{className:n.factorElements,children:[Object(S.jsxs)("div",{children:[Object(S.jsx)("div",{className:n.sizeNumber,children:Object(f.l)(H.toString(10))}),Object(S.jsx)("div",{className:n.sizeDescription,children:"Instance Capacity"})]}),Object(S.jsxs)("div",{children:[Object(S.jsx)("div",{className:n.sizeNumber,children:Object(f.l)(K.toString(10))}),Object(S.jsx)("div",{className:n.sizeDescription,children:"Total Capacity"})]})]}),Object(S.jsx)("div",{className:n.buttonContainer,children:Object(S.jsx)(u.a,{type:"submit",variant:"contained",color:"primary",disabled:l,children:"Save"})})]}),l&&Object(S.jsx)(b.a,{item:!0,xs:12,children:Object(S.jsx)(v.a,{})})]})]})})})),N=n(453),I=n(473),z=n(134),D=Object(i.b)((function(e){return{loadingTenant:e.tenants.tenantDetails.loadingTenant,selectedTenant:e.tenants.tenantDetails.currentTenant,tenant:e.tenants.tenantDetails.tenantInfo}}),{setErrorSnackMessage:h.e,setTenantDetailsLoad:I.p});t.default=Object(s.a)((function(e){return Object(r.a)(Object(o.a)(Object(o.a)(Object(o.a)({},l.B),l.a),Object(l.f)(e.spacing(4))))}))(D((function(e){var t=e.classes,n=e.tenant,o=e.loadingTenant,i=e.setTenantDetailsLoad,r=Object(c.useState)([]),s=Object(a.a)(r,2),l=s[0],h=s[1],m=Object(c.useState)(!1),x=Object(a.a)(m,2),g=x[0],O=x[1],f=Object(c.useState)(""),v=Object(a.a)(f,2),C=v[0],y=v[1];Object(c.useEffect)((function(){if(n){var e=n.pools?n.pools:[];h(e)}}),[n]);var w=l.filter((function(e){return!!e.name.toLowerCase().includes(C.toLowerCase())}));return Object(S.jsxs)(c.Fragment,{children:[g&&null!==n&&Object(S.jsx)(k,{open:g,onClosePoolAndReload:function(e){O(!1),e&&i(!0)},tenant:n}),Object(S.jsx)("h1",{className:t.sectionTitle,children:"Pools"}),Object(S.jsxs)(b.a,{container:!0,children:[Object(S.jsxs)(b.a,{item:!0,xs:12,className:t.actionsTray,children:[Object(S.jsx)(d.a,{placeholder:"Filter",className:t.searchField,id:"search-resource",label:"",onChange:function(e){y(e.target.value)},InputProps:{disableUnderline:!0,startAdornment:Object(S.jsx)(N.a,{position:"start",children:Object(S.jsx)(z.default,{})})},variant:"standard"}),Object(S.jsx)(u.a,{variant:"contained",color:"primary",endIcon:Object(S.jsx)(j.c,{}),onClick:function(){O(!0)},children:"Expand Tenant"})]}),Object(S.jsx)(b.a,{item:!0,xs:12,children:Object(S.jsx)("br",{})}),Object(S.jsx)(b.a,{item:!0,xs:12,children:Object(S.jsx)(p.a,{itemActions:[],columns:[{label:"Name",elementKey:"name"},{label:"Capacity",elementKey:"capacity"},{label:"# of Instances",elementKey:"servers"},{label:"# of Drives",elementKey:"volumes"}],isLoading:o,records:w,entityName:"Servers",idField:"name",customEmptyMessage:"No Pools found"})})]})]})})))}}]);
//# sourceMappingURL=80.dbe4c2d4.chunk.js.map