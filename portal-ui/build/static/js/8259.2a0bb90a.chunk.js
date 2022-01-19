"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[8259],{8235:function(e,t,n){n(50390);var a=n(86509),i=n(4285),r=n(25594),s=n(62559);t.Z=(0,i.Z)((function(e){return(0,a.Z)({root:{border:"1px solid #E2E2E2",borderRadius:2,backgroundColor:"#FBFAFA",paddingLeft:25,paddingTop:31,paddingBottom:21,paddingRight:30},leftItems:{fontSize:16,fontWeight:"bold",marginBottom:15,display:"flex",alignItems:"center","& .min-icon":{marginRight:15,height:28,width:38}},helpText:{fontSize:16,paddingLeft:5}})}))((function(e){var t=e.classes,n=e.iconComponent,a=e.title,i=e.help;return(0,s.jsx)("div",{className:t.root,children:(0,s.jsxs)(r.ZP,{container:!0,children:[(0,s.jsxs)(r.ZP,{item:!0,xs:12,className:t.leftItems,children:[n,a]}),(0,s.jsx)(r.ZP,{item:!0,xs:12,className:t.helpText,children:i})]})})}))},53224:function(e,t,n){var a=n(18489),i=n(83738),r=(n(50390),n(70758)),s=n(62449),o=n(62559),l=["onClick","text","disabled","tooltip","icon"],c=(0,s.Z)((function(e){return{root:{padding:"7px",color:function(t){return function(t){var n=t.variant,a=t.color,i=e.palette.primary.main;return"primary"===a&&"contained"===n?i=e.palette.primary.contrastText:"primary"===a&&"outlined"===n?i=e.palette.primary.main:"secondary"===a&&(i=e.palette.secondary.main),i}(t)},borderColor:function(t){return"secondary"===t.color?e.palette.secondary.main:e.palette.primary.main},"& svg.min-icon":{width:12,marginLeft:function(e){return e.text?"5px":"0px"},"@media (max-width: 900px)":{width:16,marginLeft:"0px !important"}}}}}));t.Z=function(e){var t=c(e),n=e.onClick,s=e.text,d=void 0===s?"":s,u=e.disabled,h=void 0!==u&&u,m=e.tooltip,x=e.icon,p=void 0===x?null:x,g=(0,i.Z)(e,l);return(0,o.jsxs)(r.Z,(0,a.Z)((0,a.Z)({classes:t,tooltip:m||d,variant:"outlined",onClick:n,disabled:h,color:"secondary",size:"medium",sx:{border:"1px solid #f44336","& span":{fontSize:14,"@media (max-width: 900px)":{display:"none"}}}},g),{},{children:[(0,o.jsx)("span",{children:d})," ",p]}))}},11835:function(e,t,n){var a=n(18489),i=n(83738),r=(n(50390),n(86509)),s=n(4285),o=n(62559),l=["classes","children"];t.Z=(0,s.Z)((function(e){return(0,r.Z)({root:{padding:0,margin:0,border:0,backgroundColor:"transparent",textDecoration:"underline",cursor:"pointer",fontSize:"inherit",color:e.palette.info.main,fontFamily:"Lato, sans-serif"}})}))((function(e){var t=e.classes,n=e.children,r=(0,i.Z)(e,l);return(0,o.jsx)("button",(0,a.Z)((0,a.Z)({},r),{},{className:t.root,children:n}))}))},70758:function(e,t,n){var a=n(18489),i=n(36222),r=n(83738),s=(n(50390),n(86509)),o=n(4285),l=n(95467),c=n(94187),d=n(44977),u=n(62559),h=["classes","children","variant","tooltip"];t.Z=(0,o.Z)((function(e){return(0,s.Z)({root:{padding:8,marginLeft:8,borderWidth:1,borderColor:"#696969",color:"#696969",borderStyle:"solid",borderRadius:3,"& .min-icon":{width:20},"& .MuiTouchRipple-root span":{backgroundColor:e.palette.primary.main,borderRadius:3,opacity:.3},"&:disabled":{color:"#EBEBEB",borderColor:"#EBEBEB"}},contained:{borderColor:e.palette.primary.main,background:e.palette.primary.main,color:"white","& .MuiTouchRipple-root span":{backgroundColor:e.palette.primary.dark,borderRadius:3,opacity:.3},"&:hover":{backgroundColor:e.palette.primary.light,color:"#FFF"}}})}))((function(e){var t=e.classes,n=e.children,s=e.variant,o=void 0===s?"outlined":s,m=e.tooltip,x=(0,r.Z)(e,h),p=(0,u.jsx)(l.Z,(0,a.Z)((0,a.Z)({},x),{},{className:(0,d.Z)(t.root,(0,i.Z)({},t.contained,"contained"===o)),children:n}));return m&&""!==m?(0,u.jsx)(c.Z,{title:m,children:(0,u.jsx)("span",{children:p})}):p}))},37882:function(e,t,n){var a=n(18489),i=n(50390),r=n(62559);t.Z=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;function n(n){return(0,r.jsx)(i.Suspense,{fallback:t,children:(0,r.jsx)(e,(0,a.Z)({},n))})}return n}},25534:function(e,t,n){var a=n(18489),i=(n(50390),n(25594)),r=n(86509),s=n(4285),o=n(72462),l=n(62559);t.Z=(0,s.Z)((function(e){return(0,r.Z)((0,a.Z)({},o.Bw))}))((function(e){var t=e.classes,n=e.className,a=void 0===n?"":n,r=e.children;return(0,l.jsx)("div",{className:t.contentSpacer,children:(0,l.jsx)(i.ZP,{container:!0,children:(0,l.jsx)(i.ZP,{item:!0,xs:12,className:a,children:r})})})}))},35721:function(e,t,n){n(50390);var a=n(34424),i=n(56805),r=n(25594),s=n(86509),o=n(4285),l=n(35477),c=n(95467),d=n(26805),u=n(44078),h=n(5265),m=n(63548),x=n(62559),p={toggleList:h.kQ},g=(0,a.$j)((function(e){return{sidebarOpen:e.system.sidebarOpen,operatorMode:e.system.operatorMode,managerObjects:e.objectBrowser.objectManager.objectsToManage}}),p);t.Z=g((0,o.Z)((function(e){return(0,s.Z)({headerContainer:{width:"100%",minHeight:79,display:"flex",backgroundColor:"#fff",left:0,boxShadow:"rgba(0,0,0,.08) 0 3px 10px"},label:{display:"flex",justifyContent:"flex-start",alignItems:"center"},labelStyle:{color:"#000",fontSize:18,fontWeight:700,marginLeft:34,marginTop:8},rightMenu:{textAlign:"right"},logo:{marginLeft:34,fill:e.palette.primary.main,"& .min-icon":{width:120}}})}))((function(e){var t=e.classes,n=e.label,a=e.actions,s=e.sidebarOpen,o=e.operatorMode,h=e.managerObjects,p=e.toggleList;return(0,x.jsxs)(r.ZP,{container:!0,className:"".concat(t.headerContainer," page-header"),direction:"row",alignItems:"center",children:[(0,x.jsx)(i.Z,{display:{xs:"block",sm:"block",md:"none"},children:(0,x.jsx)(r.ZP,{item:!0,xs:12,style:{height:10},children:"\xa0"})}),(0,x.jsxs)(r.ZP,{item:!0,xs:12,sm:12,md:6,className:t.label,children:[!s&&(0,x.jsx)("div",{className:t.logo,children:o?(0,x.jsx)(d.Z,{}):(0,x.jsx)(u.Z,{})}),(0,x.jsx)(l.Z,{variant:"h4",className:t.labelStyle,children:n})]}),(0,x.jsxs)(r.ZP,{item:!0,xs:12,sm:12,md:6,className:t.rightMenu,children:[a&&a,h&&h.length>0&&(0,x.jsx)(c.Z,{color:"primary","aria-label":"Refresh List",component:"span",onClick:function(){p()},size:"large",children:(0,x.jsx)(m.gx,{})})]})]})})))},23165:function(e,t,n){var a=n(36222),i=n(18489),r=(n(50390),n(65771)),s=n(13336),o=n(12066),l=n(4285),c=n(86509),d=n(72462),u=n(62559);t.Z=(0,l.Z)((function(e){return(0,c.Z)({searchField:(0,i.Z)({},d.qg.searchField),adornment:{}})}))((function(e){var t=e.placeholder,n=void 0===t?"":t,i=e.classes,l=e.onChange,c=e.adornmentPosition,d=void 0===c?"end":c,h=e.overrideClass,m=(0,a.Z)({disableUnderline:!0},"".concat(d,"Adornment"),(0,u.jsx)(r.Z,{position:d,className:i.adornment,children:(0,u.jsx)(s.default,{})}));return(0,u.jsx)(o.Z,{placeholder:n,className:h||i.searchField,id:"search-resource",label:"",InputProps:m,onChange:function(e){l(e.target.value)},variant:"standard"})}))},18572:function(e,t,n){var a=n(50390),i=n(65742),r=n(10106),s=n(33690),o=n(62559),l={};t.Z=function(e){var t=e.rowRenderFunction,n=e.totalItems,c=e.defaultHeight,d=function(e){var n=e.index,a=e.style;return(0,o.jsx)("div",{style:a,children:t(n)})};return(0,o.jsx)(a.Fragment,{children:(0,o.jsx)(r.Z,{isItemLoaded:function(e){return!!l[e]},loadMoreItems:function(e,t){for(var n=e;n<=t;n++)l[n]=1;for(var a=e;a<=t;a++)l[a]=2},itemCount:n,children:function(e){var t=e.onItemsRendered,a=e.ref;return(0,o.jsx)(s.qj,{children:function(e){var r=e.width,s=e.height;return(0,o.jsx)(i.t7,{itemSize:c||220,height:s,itemCount:n,width:r,ref:a,onItemsRendered:t,children:d})}})}})})}},38259:function(e,t,n){n.r(t),n.d(t,{default:function(){return L}});var a=n(23430),i=n(18489),r=n(50390),s=n(34424),o=n(25594),l=n(81378),c=n(86509),d=n(4285),u=n(28948),h=n(72462),m=n(44149),x=n(63548),p=n(30324),g=n(24442),f=n(18221),Z=n(35721),j=n(10542),v=n(18201),b=n(82981),y=n(62559),S=(0,d.Z)((function(e){return{root:{height:10,borderRadius:5},colorPrimary:{backgroundColor:"#F4F4F4"},bar:{borderRadius:5,backgroundColor:"#081C42"},padChart:{padding:"5px"}}}))(l.Z),C=(0,d.Z)((function(e){return(0,c.Z)({allValue:{fontSize:16,fontWeight:700,marginBottom:8},currentUsage:{fontSize:12,marginTop:8},centerItem:{textAlign:"center"}})}))((function(e){var t=e.classes,n=e.maxValue,a=e.currValue,i=e.label,s=e.renderFunction,l=e.loading,c=e.error,d=e.labels,u=void 0===d||d,h=100*a/n;return(0,y.jsxs)(r.Fragment,{children:[l&&(0,y.jsx)("div",{className:t.padChart,children:(0,y.jsx)(o.ZP,{item:!0,xs:12,className:t.centerItem,children:(0,y.jsx)(v.Z,{color:"primary",size:40,variant:"indeterminate"})})}),l?null:""!==c?(0,y.jsx)(b.Z,{errorMessage:c,withBreak:!1}):(0,y.jsxs)(r.Fragment,{children:[(0,y.jsx)(o.ZP,{item:!0,xs:12,className:t.allValue,children:u&&(0,y.jsxs)(r.Fragment,{children:[i," ",s?s(n.toString()):n]})}),(0,y.jsx)(S,{variant:"determinate",value:h}),(0,y.jsx)(o.ZP,{item:!0,xs:12,className:t.currentUsage,children:u&&(0,y.jsxs)(r.Fragment,{children:["Used:"," ",s?s(a.toString()):a]})})]})]})})),w=n(32120),N=n(53224),P=(0,s.$j)(null,{setErrorSnackMessage:m.Ih}),k=(0,d.Z)((function(e){return(0,c.Z)({redState:{color:e.palette.error.main,"& .min-icon":{width:16,height:16,float:"left",marginRight:4}},yellowState:{color:e.palette.warning.main,"& .min-icon":{width:16,height:16,float:"left",marginRight:4}},greenState:{color:e.palette.success.main,"& .min-icon":{width:16,height:16,float:"left",marginRight:4}},greyState:{color:"grey","& .min-icon":{width:16,height:16,float:"left",marginRight:4}},tenantIcon:{width:40,height:40,position:"relative"},healthStatusIcon:{position:"absolute",fontSize:10,top:0,right:-20,height:10},tenantItem:{border:"1px solid #dedede",marginBottom:20,paddingLeft:40,paddingRight:40,paddingTop:30,paddingBottom:30},title:{fontSize:22,fontWeight:"bold"},titleSubKey:{fontSize:14,paddingRight:8},titleSubValue:{fontSize:14,fontWeight:"bold",paddingRight:16},boxyTitle:{fontWeight:"bold"},boxyValue:{fontSize:24,fontWeight:"bold"},boxyUnit:{fontSize:12,color:"#5E5E5E"},manageButton:{marginRight:8,textTransform:"initial"}})}))(P((function(e){var t,n,a=e.tenant,i=e.classes,s={value:"n/a",unit:""},l={value:"n/a",unit:""},c={value:"n/a",unit:""};if(a.capacity_raw){var d=(0,u.ae)("".concat(a.capacity_raw),!0).split(" ");s.value=d[0],s.unit=d[1]}if(a.capacity){var h=(0,u.ae)("".concat(a.capacity),!0).split(" ");l.value=h[0],l.unit=h[1]}if(a.capacity_usage){var m=a.capacity*a.capacity_raw_usage/a.capacity_raw,p=(0,u.ae)("".concat(m),!0).split(" ");c.value=p[0],c.unit=p[1]}return(0,y.jsx)(r.Fragment,{children:(0,y.jsx)("div",{className:i.tenantItem,children:(0,y.jsxs)(o.ZP,{container:!0,children:[(0,y.jsxs)(o.ZP,{item:!0,xs:8,children:[(0,y.jsx)("div",{className:i.title,children:a.name}),(0,y.jsxs)("div",{children:[(0,y.jsx)("span",{className:i.titleSubKey,children:"Namespace:"}),(0,y.jsx)("span",{className:i.titleSubValue,children:a.namespace}),(0,y.jsx)("span",{className:i.titleSubKey,children:"Pools:"}),(0,y.jsx)("span",{className:i.titleSubValue,children:a.pool_count}),(0,y.jsx)("span",{className:i.titleSubKey,children:"State:"}),(0,y.jsx)("span",{className:i.titleSubValue,children:a.currentState})]})]}),(0,y.jsxs)(o.ZP,{item:!0,xs:4,textAlign:"end",children:[(0,y.jsx)(N.Z,{tooltip:"Manage Tenant",text:"Manage",disabled:!(0,w.Yk)(a),onClick:function(){g.Z.push("/namespaces/".concat(a.namespace,"/tenants/").concat(a.name,"/hop"))},icon:(0,y.jsx)(x.ew,{}),color:"primary",variant:"outlined"}),(0,y.jsx)(N.Z,{tooltip:"View Tenant",text:"View",onClick:function(){g.Z.push("/namespaces/".concat(a.namespace,"/tenants/").concat(a.name))},icon:(0,y.jsx)(x.LZ,{}),color:"primary",variant:"contained"})]}),(0,y.jsx)(o.ZP,{item:!0,xs:12,children:(0,y.jsx)("hr",{})}),(0,y.jsx)(o.ZP,{item:!0,xs:12,children:(0,y.jsxs)(o.ZP,{container:!0,alignItems:"center",children:[(0,y.jsx)(o.ZP,{item:!0,xs:7,children:(0,y.jsxs)(o.ZP,{container:!0,children:[(0,y.jsx)(o.ZP,{item:!0,xs:3,style:{textAlign:"center"},children:(0,y.jsxs)("div",{className:i.tenantIcon,children:[(0,y.jsx)(j.Z,{style:{height:40,width:40}}),(0,y.jsx)("div",{className:i.healthStatusIcon,children:(0,y.jsx)("span",{className:function(e){switch(e){case"red":return i.redState;case"yellow":return i.yellowState;case"green":return i.greenState;default:return i.greyState}}(a.health_status),children:(0,y.jsx)(x.J$,{})})})]})}),(0,y.jsx)(o.ZP,{item:!0,xs:3,children:(0,y.jsxs)(o.ZP,{container:!0,children:[(0,y.jsx)(o.ZP,{item:!0,xs:12,className:i.boxyTitle,children:"Raw Capacity"}),(0,y.jsxs)(o.ZP,{item:!0,className:i.boxyValue,children:[s.value,(0,y.jsx)("span",{className:i.boxyUnit,children:s.unit})]})]})}),(0,y.jsx)(o.ZP,{item:!0,xs:3,children:(0,y.jsxs)(o.ZP,{container:!0,children:[(0,y.jsx)(o.ZP,{item:!0,xs:12,className:i.boxyTitle,children:"Capacity"}),(0,y.jsxs)(o.ZP,{item:!0,className:i.boxyValue,children:[l.value,(0,y.jsx)("span",{className:i.boxyUnit,children:l.unit})]})]})}),(0,y.jsx)(o.ZP,{item:!0,xs:3,children:(0,y.jsxs)(o.ZP,{container:!0,children:[(0,y.jsx)(o.ZP,{item:!0,xs:12,className:i.boxyTitle,children:"Usage"}),(0,y.jsxs)(o.ZP,{item:!0,className:i.boxyValue,children:[c.value,(0,y.jsx)("span",{className:i.boxyUnit,children:c.unit})]})]})})]})}),(0,y.jsx)(o.ZP,{item:!0,xs:5,children:(0,y.jsx)(C,{currValue:null!==(t=a.capacity_raw_usage)&&void 0!==t?t:0,maxValue:null!==(n=a.capacity_raw)&&void 0!==n?n:1,label:"",renderFunction:u.ae,error:"",loading:!1,labels:!1})})]})})]})})})}))),T=n(8235),F=n(11835),R=n(37882),I=n(18572),B=n(23165),z=n(25534),M=(0,R.Z)(r.lazy((function(){return Promise.all([n.e(5444),n.e(1140)]).then(n.bind(n,39080))}))),E=(0,s.$j)(null,{setErrorSnackMessage:m.Ih}),L=(0,d.Z)((function(e){return(0,c.Z)((0,i.Z)((0,i.Z)((0,i.Z)((0,i.Z)({},h.OR),h.qg),(0,h.Bz)(e.spacing(4))),{},{addTenant:{marginRight:8},theaderSearchLabel:{color:e.palette.grey[400],fontSize:14,fontWeight:"bold"},theaderSearch:{borderColor:e.palette.grey[200],"& .MuiInputBase-input":{paddingTop:10,paddingBottom:10},"& .MuiInputBase-root":{"& .MuiInputAdornment-root":{"& .min-icon":{color:e.palette.grey[400],height:14}}},actionHeaderItems:{"@media (min-width: 320px)":{marginTop:8}},marginRight:10,marginLeft:10},mainActions:{textAlign:"right",marginBottom:8},tenantsList:{marginTop:25,height:"calc(100vh - 195px)"},searchField:(0,i.Z)((0,i.Z)({},h.qg.searchField),{},{marginRight:"auto",maxWidth:380})}))}))(E((function(e){var t=e.classes,n=e.setErrorSnackMessage,i=(0,r.useState)(!1),s=(0,a.Z)(i,2),c=s[0],d=s[1],h=(0,r.useState)(""),m=(0,a.Z)(h,2),j=m[0],v=m[1],b=(0,r.useState)([]),S=(0,a.Z)(b,2),C=S[0],w=S[1],P=(0,r.useState)(!1),R=(0,a.Z)(P,2),E=R[0],L=R[1],_=(0,r.useState)(null),V=(0,a.Z)(_,2),A=V[0],U=V[1],W=C.filter((function(e){return""===j||e.name.indexOf(j)>=0}));(0,r.useEffect)((function(){if(c){p.Z.invoke("GET","/api/v1/tenants").then((function(e){if(null!==e){var t=[];null!==e.tenants&&(t=e.tenants);for(var n=0;n<t.length;n++)t[n].total_capacity=(0,u.ae)(t[n].total_size+"");w(t),d(!1)}else d(!1)})).catch((function(e){n(e),d(!1)}))}}),[c,n]),(0,r.useEffect)((function(){d(!0)}),[]);return(0,y.jsxs)(r.Fragment,{children:[E&&(0,y.jsx)(M,{newServiceAccount:A,open:E,closeModal:function(){L(!1),U(null)},entity:"Tenant"}),(0,y.jsx)(Z.Z,{label:"Tenants",actions:(0,y.jsxs)(o.ZP,{item:!0,xs:12,className:t.actionsTray,marginRight:"30px",children:[(0,y.jsx)(B.Z,{placeholder:"Filter Tenants",onChange:function(e){v(e)},overrideClass:t.searchField}),(0,y.jsx)(N.Z,{tooltip:"Refresh Tenant List",text:"",onClick:function(){d(!0)},icon:(0,y.jsx)(f.default,{}),color:"primary",variant:"outlined"}),(0,y.jsx)(N.Z,{tooltip:"Create Tenant",text:"Create Tenant",onClick:function(){g.Z.push("/tenants/add")},icon:(0,y.jsx)(x.dt,{}),color:"primary",variant:"contained"})]})}),(0,y.jsx)(z.Z,{children:(0,y.jsxs)(o.ZP,{item:!0,xs:12,className:t.tenantsList,children:[c&&(0,y.jsx)(l.Z,{}),!c&&(0,y.jsxs)(r.Fragment,{children:[0!==W.length&&(0,y.jsx)(I.Z,{rowRenderFunction:function(e){var t=W[e]||null;return t?(0,y.jsx)(k,{tenant:t}):null},totalItems:W.length}),0===W.length&&(0,y.jsx)(o.ZP,{container:!0,justifyContent:"center",alignContent:"center",alignItems:"center",children:(0,y.jsx)(o.ZP,{item:!0,xs:8,children:(0,y.jsx)(T.Z,{iconComponent:(0,y.jsx)(x.zb,{}),title:"Tenants",help:(0,y.jsxs)(r.Fragment,{children:["Tenant is the logical structure to represent a MinIO deployment. A tenant can have different size and configurations from other tenants, even a different storage class.",(0,y.jsx)("br",{}),(0,y.jsx)("br",{}),"To get started,\xa0",(0,y.jsx)(F.Z,{onClick:function(){g.Z.push("/tenants/add")},children:"Create a Tenant."})]})})})})]})]})})]})})))},32120:function(e,t,n){n.d(t,{dv:function(){return r},OU:function(){return s},Yk:function(){return o}});var a=n(38342),i=n.n(a),r=function(e){return e.map((function(e){return{label:e,value:e}}))},s=function(e){var t=i()(e,"elements",[]),n={};return t.forEach((function(e){var t=e.name.split(".storageclass.storage.k8s.io/requests.storage")[0],a=i()(e,"hard",0),r=i()(e,"used",0);n[t]=a-r})),n},o=function(e){return""!==e.currentState&&(!(!e.status&&"green"!==e.health_status&&"yellow"!==e.health_status)&&(!e.status||"green"===e.status.health_status||"yellow"===e.status.health_status))}},82981:function(e,t,n){var a=n(50390),i=n(35477),r=n(86509),s=n(4285),o=n(62559);t.Z=(0,s.Z)((function(e){var t;return(0,r.Z)({errorBlock:{color:(null===(t=e.palette)||void 0===t?void 0:t.error.main)||"#C83B51"}})}))((function(e){var t=e.classes,n=e.errorMessage,r=e.withBreak,s=void 0===r||r;return(0,o.jsxs)(a.Fragment,{children:[s&&(0,o.jsx)("br",{}),(0,o.jsx)(i.Z,{component:"p",variant:"body1",className:t.errorBlock,children:n})]})}))}}]);
//# sourceMappingURL=8259.2a0bb90a.chunk.js.map