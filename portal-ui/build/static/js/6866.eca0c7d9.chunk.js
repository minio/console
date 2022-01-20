"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[6866],{86866:function(e,t,a){a.r(t);var i=a(23430),n=a(18489),o=a(50390),r=a(34424),l=a(86509),s=a(4285),c=a(66946),d=a(38342),u=a.n(d),m=a(25594),p=a(72462),h=a(44149),g=a(66964),Z=a(76352),f=a(30324),x=a(67754),v=a(92440),b=a(28948),j=a(65703),y=a(63548),C=a(62559),S=(0,r.$j)(null,{setModalErrorSnackMessage:h.zb});t.default=(0,s.Z)((function(e){return(0,l.Z)((0,n.Z)((0,n.Z)((0,n.Z)((0,n.Z)((0,n.Z)({buttonContainer:{textAlign:"right"},multiContainer:{display:"flex",alignItems:"center"},sizeFactorContainer:{"& label":{display:"none"},"& div:first-child":{marginBottom:0}}},p.bK),p.QV),p.DF),p.ID),{},{modalFormScrollable:(0,n.Z)((0,n.Z)({},p.ID.modalFormScrollable),{},{paddingRight:10})}))}))(S((function(e){var t=e.open,a=e.closeModalAndRefresh,n=e.classes,r=e.bucketName,l=e.setModalErrorSnackMessage,s=e.setReplicationRules,d=(0,o.useState)(!1),p=(0,i.Z)(d,2),h=p[0],S=p[1],k=(0,o.useState)("1"),R=(0,i.Z)(k,2),w=R[0],N=R[1],F=(0,o.useState)(""),P=(0,i.Z)(F,2),M=P[0],D=P[1],I=(0,o.useState)(""),T=(0,i.Z)(I,2),B=T[0],V=T[1],L=(0,o.useState)(""),O=(0,i.Z)(L,2),A=O[0],G=O[1],K=(0,o.useState)(""),_=(0,i.Z)(K,2),E=_[0],U=_[1],z=(0,o.useState)(""),H=(0,i.Z)(z,2),q=H[0],W=H[1],Q=(0,o.useState)(""),Y=(0,i.Z)(Q,2),$=Y[0],J=Y[1],X=(0,o.useState)(""),ee=(0,i.Z)(X,2),te=ee[0],ae=ee[1],ie=(0,o.useState)(!0),ne=(0,i.Z)(ie,2),oe=ne[0],re=ne[1],le=(0,o.useState)(!0),se=(0,i.Z)(le,2),ce=se[0],de=se[1],ue=(0,o.useState)(!0),me=(0,i.Z)(ue,2),pe=me[0],he=me[1],ge=(0,o.useState)(!0),Ze=(0,i.Z)(ge,2),fe=Ze[0],xe=Ze[1],ve=(0,o.useState)(""),be=(0,i.Z)(ve,2),je=be[0],ye=be[1],Ce=(0,o.useState)("async"),Se=(0,i.Z)(Ce,2),ke=Se[0],Re=Se[1],we=(0,o.useState)("100"),Ne=(0,i.Z)(we,2),Fe=Ne[0],Pe=Ne[1],Me=(0,o.useState)("Gi"),De=(0,i.Z)(Me,2),Ie=De[0],Te=De[1],Be=(0,o.useState)("60"),Ve=(0,i.Z)(Be,2),Le=Ve[0],Oe=Ve[1];(0,o.useEffect)((function(){if(0!==s.length){var e=s.reduce((function(e,t){return t.priority>e?t.priority:e}),0);N((e+1).toString())}else N("1")}),[s]);return(0,C.jsx)(Z.Z,{modalOpen:t,onClose:function(){a()},title:"Set Bucket Replication",titleIcon:(0,C.jsx)(y.xR,{}),children:(0,C.jsx)("form",{noValidate:!0,autoComplete:"off",onSubmit:function(e){e.preventDefault(),S(!0),function(){var e=[{originBucket:r,destinationBucket:$}],t=parseInt(Le),i="".concat(oe?"https://":"http://").concat(A),n={accessKey:M,secretKey:B,targetURL:i,region:te,bucketsRelation:e,syncMode:ke,bandwidth:"async"===ke?parseInt((0,b.Pw)(Fe,Ie,!0)):0,healthCheckPeriod:t,prefix:q,tags:je,replicateDeleteMarkers:ce,replicateDeletes:pe,priority:parseInt(w),storageClass:E,replicateMetadata:fe};f.Z.invoke("POST","/api/v1/buckets-replication",n).then((function(e){S(!1);var t=u()(e,"replicationState",[]);if(t.length>0){var i=t[0];return S(!1),i.errorString&&""!==i.errorString?void l({errorMessage:i.errorString,detailedError:""}):void a()}l({errorMessage:"No changes applied",detailedError:""})})).catch((function(e){S(!1),l(e)}))}()},children:(0,C.jsxs)(m.ZP,{container:!0,children:[(0,C.jsxs)(m.ZP,{item:!0,xs:12,className:n.modalFormScrollable,children:[(0,C.jsx)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:(0,C.jsx)(g.Z,{id:"priority",name:"priority",onChange:function(e){e.target.validity.valid&&N(e.target.value)},label:"Priority",value:w,pattern:"[0-9]*"})}),(0,C.jsx)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:(0,C.jsx)(g.Z,{id:"targetURL",name:"targetURL",onChange:function(e){G(e.target.value)},placeholder:"play.min.io",label:"Target URL",value:A})}),(0,C.jsx)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:(0,C.jsx)(v.Z,{checked:oe,id:"useTLS",name:"useTLS",label:"Use TLS",onChange:function(e){re(e.target.checked)},value:"yes"})}),(0,C.jsx)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:(0,C.jsx)(g.Z,{id:"accessKey",name:"accessKey",onChange:function(e){D(e.target.value)},label:"Access Key",value:M})}),(0,C.jsx)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:(0,C.jsx)(g.Z,{id:"secretKey",name:"secretKey",onChange:function(e){V(e.target.value)},label:"Secret Key",value:B})}),(0,C.jsx)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:(0,C.jsx)(g.Z,{id:"targetBucket",name:"targetBucket",onChange:function(e){J(e.target.value)},label:"Target Bucket",value:$})}),(0,C.jsx)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:(0,C.jsx)(g.Z,{id:"region",name:"region",onChange:function(e){ae(e.target.value)},label:"Region",value:te})}),(0,C.jsx)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:(0,C.jsx)(x.Z,{id:"replication_mode",name:"replication_mode",onChange:function(e){Re(e.target.value)},label:"Replication Mode",value:ke,options:[{label:"Asynchronous",value:"async"},{label:"Synchronous",value:"sync"}]})}),"async"===ke&&(0,C.jsx)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:(0,C.jsxs)("div",{className:n.multiContainer,children:[(0,C.jsx)(g.Z,{type:"number",id:"bandwidth_scalar",name:"bandwidth_scalar",onChange:function(e){Pe(e.target.value)},label:"Bandwidth",value:Fe,min:"0"}),(0,C.jsx)("div",{className:n.sizeFactorContainer,children:(0,C.jsx)(x.Z,{label:" ",id:"bandwidth_unit",name:"bandwidth_unit",value:Ie,onChange:function(e){Te(e.target.value)},options:(0,b.QU)()})})]})}),(0,C.jsx)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:(0,C.jsx)(g.Z,{id:"healthCheck",name:"healthCheck",onChange:function(e){Oe(e.target.value)},label:"Health Check Duration",value:Le})}),(0,C.jsx)(m.ZP,{item:!0,xs:12,className:"".concat(n.spacerTop," ").concat(n.formFieldRow),children:(0,C.jsx)(g.Z,{id:"storageClass",name:"storageClass",onChange:function(e){U(e.target.value)},placeholder:"STANDARD_IA,REDUCED_REDUNDANCY etc",label:"Storage Class",value:E})}),(0,C.jsx)(m.ZP,{item:!0,xs:12,children:(0,C.jsxs)("fieldset",{className:n.fieldGroup,children:[(0,C.jsx)("legend",{className:n.descriptionText,children:"Object Filters"}),(0,C.jsx)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:(0,C.jsx)(g.Z,{id:"prefix",name:"prefix",onChange:function(e){W(e.target.value)},placeholder:"prefix",label:"Prefix",value:q})}),(0,C.jsx)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:(0,C.jsx)(j.Z,{name:"tags",label:"Tags",elements:"",onChange:function(e){ye(e)},keyPlaceholder:"Tag Key",valuePlaceholder:"Tag Value",withBorder:!0})})]})}),(0,C.jsx)(m.ZP,{item:!0,xs:12,children:(0,C.jsxs)("fieldset",{className:n.fieldGroup,children:[(0,C.jsx)("legend",{className:n.descriptionText,children:"Replication Options"}),(0,C.jsxs)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:[(0,C.jsx)(v.Z,{checked:fe,id:"metadatataSync",name:"metadatataSync",label:"Metadata Sync",onChange:function(e){xe(e.target.checked)},value:fe,description:"Metadata Sync"}),(0,C.jsx)(v.Z,{checked:ce,id:"deleteMarker",name:"deleteMarker",label:"Delete Marker",onChange:function(e){de(e.target.checked)},value:ce,description:"Replicate soft deletes"})]}),(0,C.jsx)(m.ZP,{item:!0,xs:12,className:n.formFieldRow,children:(0,C.jsx)(v.Z,{checked:pe,id:"repDelete",name:"repDelete",label:"Deletes",onChange:function(e){he(e.target.checked)},value:pe,description:"Replicate versioned deletes"})})]})})]}),(0,C.jsxs)(m.ZP,{item:!0,xs:12,className:n.modalButtonBar,children:[(0,C.jsx)(c.Z,{type:"button",variant:"outlined",color:"primary",disabled:h,onClick:function(){a()},children:"Cancel"}),(0,C.jsx)(c.Z,{type:"submit",variant:"contained",color:"primary",disabled:h,children:"Save"})]})]})})})})))},67754:function(e,t,a){var i=a(18489),n=a(50390),o=a(25594),r=a(46413),l=a(14602),s=a(94187),c=a(47554),d=a(43965),u=a(31680),m=a(86509),p=a(4285),h=a(72462),g=a(97538),Z=a(62559),f=(0,p.Z)((function(e){return(0,m.Z)({root:{height:38,lineHeight:1,"label + &":{marginTop:e.spacing(3)}},input:{height:38,position:"relative",color:"#07193E",fontSize:13,fontWeight:600,padding:"8px 20px 10px 10px",border:"#e5e5e5 1px solid",borderRadius:4,display:"flex",alignItems:"center","&:hover":{borderColor:"#393939"},"&:focus":{backgroundColor:"#fff"}}})}))(r.ZP);t.Z=(0,p.Z)((function(e){return(0,m.Z)((0,i.Z)((0,i.Z)({},h.YI),h.Hr))}))((function(e){var t=e.classes,a=e.id,i=e.name,r=e.onChange,m=e.options,p=e.label,h=e.tooltip,x=void 0===h?"":h,v=e.value,b=e.disabled,j=void 0!==b&&b;return(0,Z.jsx)(n.Fragment,{children:(0,Z.jsxs)(o.ZP,{item:!0,xs:12,className:t.fieldContainer,children:[""!==p&&(0,Z.jsxs)(l.Z,{htmlFor:a,className:t.inputLabel,children:[(0,Z.jsx)("span",{children:p}),""!==x&&(0,Z.jsx)("div",{className:t.tooltipContainer,children:(0,Z.jsx)(s.Z,{title:x,placement:"top-start",children:(0,Z.jsx)("div",{className:t.tooltip,children:(0,Z.jsx)(g.Z,{})})})})]}),(0,Z.jsx)(c.Z,{fullWidth:!0,children:(0,Z.jsx)(d.Z,{id:a,name:i,value:v,onChange:r,input:(0,Z.jsx)(f,{}),disabled:j,children:m.map((function(e){return(0,Z.jsx)(u.Z,{value:e.value,children:e.label},"select-".concat(i,"-").concat(e.label))}))})})]})})}))},4247:function(e,t,a){a.d(t,{V:function(){return n}});var i=a(10594);function n(e){return(0,i.Z)("MuiDivider",e)}var o=(0,a(43349).Z)("MuiDivider",["root","absolute","fullWidth","inset","middle","flexItem","light","vertical","withChildren","withChildrenVertical","textAlignRight","textAlignLeft","wrapper","wrapperVertical"]);t.Z=o},31680:function(e,t,a){a.d(t,{Z:function(){return k}});var i=a(36222),n=a(1048),o=a(32793),r=a(50390),l=a(44977),s=a(50076),c=a(36128),d=a(8208),u=a(15573),m=a(57308),p=a(86875),h=a(40839),g=a(3299),Z=a(4247),f=a(2198),x=a(23586),v=a(10594);function b(e){return(0,v.Z)("MuiMenuItem",e)}var j=(0,a(43349).Z)("MuiMenuItem",["root","focusVisible","dense","disabled","divider","gutters","selected"]),y=a(62559),C=["autoFocus","component","dense","divider","disableGutters","focusVisibleClassName","role","tabIndex"],S=(0,d.ZP)(p.Z,{shouldForwardProp:function(e){return(0,d.FO)(e)||"classes"===e},name:"MuiMenuItem",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,a.dense&&t.dense,a.divider&&t.divider,!a.disableGutters&&t.gutters]}})((function(e){var t,a=e.theme,n=e.ownerState;return(0,o.Z)({},a.typography.body1,{display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",whiteSpace:"nowrap"},!n.disableGutters&&{paddingLeft:16,paddingRight:16},n.divider&&{borderBottom:"1px solid ".concat(a.palette.divider),backgroundClip:"padding-box"},(t={"&:hover":{textDecoration:"none",backgroundColor:a.palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}}},(0,i.Z)(t,"&.".concat(j.selected),(0,i.Z)({backgroundColor:(0,c.Fq)(a.palette.primary.main,a.palette.action.selectedOpacity)},"&.".concat(j.focusVisible),{backgroundColor:(0,c.Fq)(a.palette.primary.main,a.palette.action.selectedOpacity+a.palette.action.focusOpacity)})),(0,i.Z)(t,"&.".concat(j.selected,":hover"),{backgroundColor:(0,c.Fq)(a.palette.primary.main,a.palette.action.selectedOpacity+a.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:(0,c.Fq)(a.palette.primary.main,a.palette.action.selectedOpacity)}}),(0,i.Z)(t,"&.".concat(j.focusVisible),{backgroundColor:a.palette.action.focus}),(0,i.Z)(t,"&.".concat(j.disabled),{opacity:a.palette.action.disabledOpacity}),(0,i.Z)(t,"& + .".concat(Z.Z.root),{marginTop:a.spacing(1),marginBottom:a.spacing(1)}),(0,i.Z)(t,"& + .".concat(Z.Z.inset),{marginLeft:52}),(0,i.Z)(t,"& .".concat(x.Z.root),{marginTop:0,marginBottom:0}),(0,i.Z)(t,"& .".concat(x.Z.inset),{paddingLeft:36}),(0,i.Z)(t,"& .".concat(f.Z.root),{minWidth:36}),t),!n.dense&&(0,i.Z)({},a.breakpoints.up("sm"),{minHeight:"auto"}),n.dense&&(0,o.Z)({minHeight:32,paddingTop:4,paddingBottom:4},a.typography.body2,(0,i.Z)({},"& .".concat(f.Z.root," svg"),{fontSize:"1.25rem"})))})),k=r.forwardRef((function(e,t){var a=(0,u.Z)({props:e,name:"MuiMenuItem"}),i=a.autoFocus,c=void 0!==i&&i,d=a.component,p=void 0===d?"li":d,Z=a.dense,f=void 0!==Z&&Z,x=a.divider,v=void 0!==x&&x,j=a.disableGutters,k=void 0!==j&&j,R=a.focusVisibleClassName,w=a.role,N=void 0===w?"menuitem":w,F=a.tabIndex,P=(0,n.Z)(a,C),M=r.useContext(m.Z),D={dense:f||M.dense||!1,disableGutters:k},I=r.useRef(null);(0,h.Z)((function(){c&&I.current&&I.current.focus()}),[c]);var T,B=(0,o.Z)({},a,{dense:D.dense,divider:v,disableGutters:k}),V=function(e){var t=e.disabled,a=e.dense,i=e.divider,n=e.disableGutters,r=e.selected,l=e.classes,c={root:["root",a&&"dense",t&&"disabled",!n&&"gutters",i&&"divider",r&&"selected"]},d=(0,s.Z)(c,b,l);return(0,o.Z)({},l,d)}(a),L=(0,g.Z)(I,t);return a.disabled||(T=void 0!==F?F:-1),(0,y.jsx)(m.Z.Provider,{value:D,children:(0,y.jsx)(S,(0,o.Z)({ref:L,role:N,tabIndex:T,component:p,focusVisibleClassName:(0,l.Z)(V.focusVisible,R)},P,{ownerState:B,classes:V}))})}))}}]);
//# sourceMappingURL=6866.eca0c7d9.chunk.js.map