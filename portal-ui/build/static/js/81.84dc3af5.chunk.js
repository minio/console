(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[81],{399:function(e,t,a){"use strict";var n=a(1),c=a(2),i=a.n(c),l=a(429),o=a(443),s=a(821),r=a(384),d=a(387),b=a(307),j=a(377),u=a(319),m=a(122),O=a(123),h=a(0),p=Object(j.a)((function(e){return Object(b.a)(Object(n.a)({},m.n))}));function x(e){var t=p();return Object(h.jsx)(l.a,Object(n.a)({InputProps:{classes:t}},e))}t.a=Object(u.a)((function(e){return Object(b.a)(Object(n.a)(Object(n.a)(Object(n.a)({},m.i),m.E),{},{textBoxContainer:{flexGrow:1,position:"relative"},overlayAction:{position:"absolute",right:5,top:6,"& svg":{maxWidth:15,maxHeight:15},"&.withLabel":{top:5}}}))}))((function(e){var t=e.label,a=e.onChange,c=e.value,l=e.id,b=e.name,j=e.type,u=void 0===j?"text":j,m=e.autoComplete,p=void 0===m?"off":m,v=e.disabled,f=void 0!==v&&v,g=e.multiline,C=void 0!==g&&g,N=e.tooltip,F=void 0===N?"":N,w=e.index,y=void 0===w?0:w,S=e.error,L=void 0===S?"":S,k=e.required,E=void 0!==k&&k,R=e.placeholder,I=void 0===R?"":R,A=e.min,M=e.max,B=e.overlayIcon,W=void 0===B?null:B,q=e.overlayObject,z=void 0===q?null:q,P=e.extraInputProps,T=void 0===P?{}:P,D=e.overlayAction,_=e.noLabelMinWidth,H=void 0!==_&&_,Q=e.classes,V=Object(n.a)({"data-index":y},T);return"number"===u&&A&&(V.min=A),"number"===u&&M&&(V.max=M),Object(h.jsx)(i.a.Fragment,{children:Object(h.jsxs)(o.a,{container:!0,className:" ".concat(""!==L?Q.errorInField:Q.inputBoxContainer),children:[""!==t&&Object(h.jsxs)(s.a,{htmlFor:l,className:H?Q.noMinWidthLabel:Q.inputLabel,children:[Object(h.jsxs)("span",{children:[t,E?"*":""]}),""!==F&&Object(h.jsx)("div",{className:Q.tooltipContainer,children:Object(h.jsx)(r.a,{title:F,placement:"top-start",children:Object(h.jsx)("div",{className:Q.tooltip,children:Object(h.jsx)(O.a,{})})})})]}),Object(h.jsxs)("div",{className:Q.textBoxContainer,children:[Object(h.jsx)(x,{id:l,name:b,fullWidth:!0,value:c,disabled:f,onChange:a,type:u,multiline:C,autoComplete:p,inputProps:V,error:""!==L,helperText:L,placeholder:I,className:Q.inputRebase}),W&&Object(h.jsx)("div",{className:"".concat(Q.overlayAction," ").concat(""!==t?"withLabel":""),children:Object(h.jsx)(d.a,{onClick:D?function(){D()}:function(){return null},size:"small",disableFocusRipple:!1,disableRipple:!1,disableTouchRipple:!1,children:W})}),z&&Object(h.jsx)("div",{className:"".concat(Q.overlayAction," ").concat(""!==t?"withLabel":""),children:z})]})]})})}))},408:function(e,t,a){"use strict";var n=a(5),c=a(1),i=a(2),l=a.n(i),o=a(307),s=a(319),r=a(483),d=a(821),b=a(384),j=a(96),u=a(443),m=a(122),O=a(123),h=a(8),p=a(0),x=Object(s.a)((function(e){return{root:{width:50,height:24,padding:0,margin:0},switchBase:{padding:1,"&$checked":{transform:"translateX(24px)",color:e.palette.common.white,"& + $track":{backgroundColor:"#4CCB92",boxShadow:"inset 0px 1px 4px rgba(0,0,0,0.1)",opacity:1,border:"none"}},"&$focusVisible $thumb":{color:"#4CCB92",border:"6px solid #fff"}},thumb:{width:22,height:22,backgroundColor:"#FAFAFA",border:"2px solid #FFFFFF",marginLeft:1},track:{borderRadius:12,backgroundColor:"#E2E2E2",boxShadow:"inset 0px 1px 4px rgba(0,0,0,0.1)",opacity:1,transition:e.transitions.create(["background-color","border"])},checked:{},focusVisible:{},switchContainer:{display:"flex",alignItems:"center",justifyContent:"flex-end"}}}))(r.a);t.a=Object(s.a)((function(e){return Object(o.a)(Object(c.a)(Object(c.a)({divContainer:{marginBottom:20},indicatorLabelOn:{fontWeight:"bold",color:"#081C42 !important"},indicatorLabel:{fontSize:12,color:"#E2E2E2",margin:"0 8px 0 10px"},fieldDescription:{marginTop:4,color:"#999999"},tooltip:{fontSize:16}},m.a),m.i))}))((function(e){var t=e.label,a=void 0===t?"":t,c=e.onChange,i=e.value,o=e.id,s=e.name,r=e.checked,m=void 0!==r&&r,v=e.disabled,f=void 0!==v&&v,g=e.switchOnly,C=void 0!==g&&g,N=e.tooltip,F=void 0===N?"":N,w=e.description,y=void 0===w?"":w,S=e.classes,L=e.indicatorLabels,k=Object(p.jsxs)(l.a.Fragment,{children:[!C&&Object(p.jsx)("span",{className:Object(h.a)(S.indicatorLabel,Object(n.a)({},S.indicatorLabelOn,!m)),children:L&&L.length>1?L[1]:"OFF"}),Object(p.jsx)(x,{checked:m,onChange:c,color:"primary",name:s,inputProps:{"aria-label":"primary checkbox"},disabled:f,disableRipple:!0,disableFocusRipple:!0,disableTouchRipple:!0,value:i}),!C&&Object(p.jsx)("span",{className:Object(h.a)(S.indicatorLabel,Object(n.a)({},S.indicatorLabelOn,m)),children:L?L[0]:"ON"})]});return C?k:Object(p.jsx)("div",{className:S.divContainer,children:Object(p.jsxs)(u.a,{container:!0,alignItems:"center",children:[Object(p.jsx)(u.a,{item:!0,xs:!0,children:Object(p.jsxs)(u.a,{container:!0,children:[Object(p.jsx)(u.a,{item:!0,xs:12,sm:4,md:3,children:""!==a&&Object(p.jsxs)(d.a,{htmlFor:o,className:S.inputLabel,children:[Object(p.jsx)("span",{children:a}),""!==F&&Object(p.jsx)("div",{className:S.tooltipContainer,children:Object(p.jsx)(b.a,{title:F,placement:"top-start",children:Object(p.jsx)("div",{className:S.tooltip,children:Object(p.jsx)(O.a,{})})})})]})}),Object(p.jsx)(u.a,{item:!0,xs:12,sm:!0,textAlign:"left",children:""!==y&&Object(p.jsx)(j.a,{component:"p",className:S.fieldDescription,children:y})})]})}),Object(p.jsx)(u.a,{item:!0,xs:12,sm:2,textAlign:"right",className:S.switchContainer,children:k})]})})}))},440:function(e,t,a){"use strict";var n=a(1),c=a(2),i=a.n(c),l=a(443),o=a(788),s=a(821),r=a(384),d=a(982),b=a(971),j=a(494),u=a(307),m=a(319),O=a(122),h=a(123),p=a(0),x=Object(m.a)((function(e){return Object(u.a)({root:{height:38,lineHeight:1,"label + &":{marginTop:e.spacing(3)}},input:{height:38,position:"relative",color:"#07193E",fontSize:13,fontWeight:600,padding:"8px 20px 10px 10px",border:"#e5e5e5 1px solid",borderRadius:4,display:"flex",alignItems:"center","&:hover":{borderColor:"#393939"},"&:focus":{backgroundColor:"#fff"}}})}))(o.c);t.a=Object(m.a)((function(e){return Object(u.a)(Object(n.a)(Object(n.a)({},O.i),O.E))}))((function(e){var t=e.classes,a=e.id,n=e.name,c=e.onChange,o=e.options,u=e.label,m=e.tooltip,O=void 0===m?"":m,v=e.value,f=e.disabled,g=void 0!==f&&f;return Object(p.jsx)(i.a.Fragment,{children:Object(p.jsxs)(l.a,{item:!0,xs:12,className:t.fieldContainer,children:[""!==u&&Object(p.jsxs)(s.a,{htmlFor:a,className:t.inputLabel,children:[Object(p.jsx)("span",{children:u}),""!==O&&Object(p.jsx)("div",{className:t.tooltipContainer,children:Object(p.jsx)(r.a,{title:O,placement:"top-start",children:Object(p.jsx)("div",{className:t.tooltip,children:Object(p.jsx)(h.a,{})})})})]}),Object(p.jsx)(d.a,{fullWidth:!0,children:Object(p.jsx)(b.a,{id:a,name:n,value:v,onChange:c,input:Object(p.jsx)(x,{}),disabled:g,children:o.map((function(e){return Object(p.jsx)(j.a,{value:e.value,children:e.label},"select-".concat(n,"-").concat(e.label))}))})})]})})}))},453:function(e,t,a){"use strict";var n=a(1),c=a(2),i=a(443),l=a(307),o=a(319),s=a(122),r=a(0);t.a=Object(o.a)((function(e){return Object(l.a)(Object(n.a)({},s.t))}))((function(e){var t=e.classes,a=e.label,n=void 0===a?"":a,l=e.content,o=e.multiLine,s=void 0!==o&&o;return Object(r.jsx)(c.Fragment,{children:Object(r.jsxs)(i.a,{className:t.prefinedContainer,children:[""!==n&&Object(r.jsx)(i.a,{item:!0,xs:12,className:t.predefinedTitle,children:n}),Object(r.jsx)(i.a,{item:!0,xs:12,className:t.predefinedList,children:Object(r.jsx)(i.a,{item:!0,xs:12,className:s?t.innerContentMultiline:t.innerContent,children:l})})]})})}))},465:function(e,t,a){"use strict";var n=a(5),c=a(1),i=(a(2),a(8)),l=a(443),o=a(822),s=a(828),r=a(820),d=a(821),b=a(384),j=a(307),u=a(319),m=a(377),O=a(122),h=a(123),p=a(0),x=Object(m.a)(Object(c.a)({root:{"&:hover":{backgroundColor:"transparent"}}},O.u)),v=function(e){var t=x();return Object(p.jsx)(r.a,Object(c.a)({className:t.root,disableRipple:!0,color:"default",checkedIcon:Object(p.jsx)("span",{className:t.radioSelectedIcon}),icon:Object(p.jsx)("span",{className:t.radioUnselectedIcon})},e))};t.a=Object(u.a)((function(e){return Object(j.a)(Object(c.a)(Object(c.a)(Object(c.a)({},O.i),O.E),{},{optionLabel:{"&.Mui-disabled":{"& .MuiFormControlLabel-label":{color:"#9c9c9c"}},"&:last-child":{marginRight:0},"& .MuiFormControlLabel-label":{fontSize:12,color:"#07193E"}},checkedOption:{"& .MuiFormControlLabel-label":{fontSize:12,color:"#07193E",fontWeight:700}}}))}))((function(e){var t=e.selectorOptions,a=void 0===t?[]:t,c=e.currentSelection,r=e.label,j=e.id,u=e.name,m=e.onChange,O=e.tooltip,x=void 0===O?"":O,f=e.disableOptions,g=void 0!==f&&f,C=e.classes,N=e.displayInColumn,F=void 0!==N&&N;return Object(p.jsxs)(l.a,{container:!0,alignItems:"center",children:[Object(p.jsx)(l.a,{item:!0,xs:!0,children:Object(p.jsxs)(d.a,{htmlFor:j,className:C.inputLabel,children:[Object(p.jsx)("span",{children:r}),""!==x&&Object(p.jsx)("div",{className:C.tooltipContainer,children:Object(p.jsx)(b.a,{title:x,placement:"top-start",children:Object(p.jsx)("div",{children:Object(p.jsx)(h.a,{})})})})]})}),Object(p.jsx)(l.a,{item:!0,xs:!0,className:C.radioOptionsLayout,children:Object(p.jsx)(o.a,{"aria-label":j,id:j,name:u,value:c,onChange:m,row:!F,style:{display:"block",textAlign:"right"},children:a.map((function(e){return Object(p.jsx)(s.a,{value:e.value,control:Object(p.jsx)(v,{}),label:e.label,disabled:g,className:Object(i.a)(C.optionLabel,Object(n.a)({},C.checkedOption,e.value===c))},"rd-".concat(u,"-").concat(e.value))}))})})]})}))},648:function(e,t,a){"use strict";var n=a(1),c=a(2),i=a.n(c),l=a(443),o=a(821),s=a(384),r=a(429),d=a(307),b=a(319),j=a(122),u=a(123),m=a(0);t.a=Object(b.a)((function(e){return Object(d.a)(Object(n.a)(Object(n.a)(Object(n.a)({},j.i),j.E),{},{inputLabel:Object(n.a)(Object(n.a)({},j.i.inputLabel),{},{marginBottom:16,fontSize:14}),textBoxContainer:{flexGrow:1,position:"relative"},cssOutlinedInput:{borderColor:"#EAEAEA",padding:16},rootContainer:{"& .MuiOutlinedInput-inputMultiline":Object(n.a)(Object(n.a)({},j.i.inputLabel),{},{fontSize:13,minHeight:150}),"&.Mui-focused .MuiOutlinedInput-notchedOutline":{borderColor:"#07193E",borderWidth:1},"& textarea":{color:"#07193E",fontSize:13,fontWeight:600,"&:placeholder":{color:"#393939",opacity:1}}}}))}))((function(e){var t=e.label,a=e.onChange,n=e.value,c=e.id,d=e.name,b=e.disabled,j=void 0!==b&&b,O=e.tooltip,h=void 0===O?"":O,p=e.index,x=void 0===p?0:p,v=e.error,f=void 0===v?"":v,g=e.required,C=void 0!==g&&g,N=e.placeholder,F=void 0===N?"":N,w=e.classes,y={"data-index":x};return Object(m.jsx)(i.a.Fragment,{children:Object(m.jsxs)(l.a,{item:!0,xs:12,className:"".concat(w.fieldContainer," ").concat(""!==f?w.errorInField:""),children:[""!==t&&Object(m.jsxs)(o.a,{htmlFor:c,className:w.inputLabel,children:[Object(m.jsxs)("span",{children:[t,C?"*":""]}),""!==h&&Object(m.jsx)("div",{className:w.tooltipContainer,children:Object(m.jsx)(s.a,{title:h,placement:"top-start",children:Object(m.jsx)("div",{className:w.tooltip,children:Object(m.jsx)(u.a,{})})})})]}),Object(m.jsx)("div",{className:w.textBoxContainer,children:Object(m.jsx)(r.a,{id:c,name:d,fullWidth:!0,value:n,disabled:j,onChange:a,multiline:!0,rows:5,inputProps:y,error:""!==f,helperText:f,placeholder:F,InputLabelProps:{shrink:!0},InputProps:{classes:{notchedOutline:w.cssOutlinedInput,root:w.rootContainer}},variant:"outlined"})})]})})}))},876:function(e,t,a){"use strict";a.r(t);var n=a(427),c=a(16),i=a(1),l=a(2),o=a.n(l),s=a(307),r=a(319),d=a(443),b=a(399),j=a(465),u=a(440),m=a(122),O=a(648),h=a(408),p=a(453),x=a(0);t.default=Object(r.a)((function(e){return Object(s.a)(Object(i.a)(Object(i.a)({},m.p),m.k))}))((function(e){var t=e.onChange,a=e.classes,i=Object(l.useState)(!1),s=Object(c.a)(i,2),r=s[0],m=s[1],v=Object(l.useState)(""),f=Object(c.a)(v,2),g=f[0],C=f[1],N=Object(l.useState)(""),F=Object(c.a)(N,2),w=F[0],y=F[1],S=Object(l.useState)(""),L=Object(c.a)(S,2),k=L[0],E=L[1],R=Object(l.useState)(""),I=Object(c.a)(R,2),A=I[0],M=I[1],B=Object(l.useState)(""),W=Object(c.a)(B,2),q=W[0],z=W[1],P=Object(l.useState)(""),T=Object(c.a)(P,2),D=T[0],_=T[1],H=Object(l.useState)(" "),Q=Object(c.a)(H,2),V=Q[0],$=Q[1],G=Object(l.useState)(""),J=Object(c.a)(G,2),U=J[0],X=J[1],K=Object(l.useState)("namespace"),Y=Object(c.a)(K,2),Z=Y[0],ee=Y[1],te=Object(l.useState)(""),ae=Object(c.a)(te,2),ne=ae[0],ce=ae[1],ie=Object(l.useState)(""),le=Object(c.a)(ie,2),oe=le[0],se=le[1],re=Object(l.useState)(""),de=Object(c.a)(re,2),be=de[0],je=de[1],ue=Object(l.useCallback)((function(){var e="";return""!==w&&(e="".concat(e," host=").concat(w)),""!==k&&(e="".concat(e," dbname=").concat(k)),""!==q&&(e="".concat(e," user=").concat(q)),""!==D&&(e="".concat(e," password=").concat(D)),""!==A&&(e="".concat(e," port=").concat(A))," "!==V&&(e="".concat(e," sslmode=").concat(V)),(e="".concat(e," ")).trim()}),[w,k,q,D,A,V]);return Object(l.useEffect)((function(){""!==g&&t([{key:"connection_string",value:g},{key:"table",value:U},{key:"format",value:Z},{key:"queue_dir",value:ne},{key:"queue_limit",value:oe},{key:"comment",value:be}])}),[g,U,Z,ne,oe,be,t]),Object(l.useEffect)((function(){var e=ue();C(e)}),[q,k,D,A,V,w,C,ue]),Object(l.useEffect)((function(){if(r){var e=ue();C(e)}else{var t=function(e,t){var a,c=[],i=Object(n.a)(t);try{for(i.s();!(a=i.n()).done;){var l=a.value,o=e.indexOf(l+"=");-1!==o&&c.push(o)}}catch(p){i.e(p)}finally{i.f()}c.sort((function(e,t){return e-t}));for(var s=new Map,r=new Array(c.length),d=0;d<c.length;d++){var b=d+1;b<c.length?r[d]=e.substr(c[d],c[b]-c[d]):r[d]=e.substr(c[d])}for(var j=0,u=r;j<u.length;j++){var m=u[j];if(void 0!==m){var O=m.substr(0,m.indexOf("=")),h=m.substr(m.indexOf("=")+1).trim();s.set(O,h)}}return s}(g,["host","port","dbname","user","password","sslmode"]);y(t.get("host")?t.get("host")+"":""),M(t.get("port")?t.get("port")+"":""),E(t.get("dbname")?t.get("dbname")+"":""),z(t.get("user")?t.get("user")+"":""),_(t.get("password")?t.get("password")+"":""),$(t.get("sslmode")?t.get("sslmode")+"":" ")}}),[r]),Object(x.jsxs)(d.a,{container:!0,children:[Object(x.jsx)(d.a,{item:!0,xs:12,children:Object(x.jsx)(h.a,{label:"Manually Configure String",checked:r,id:"manualString",name:"manualString",onChange:function(e){m(e.target.checked)},value:"manualString"})}),r?Object(x.jsx)(o.a.Fragment,{children:Object(x.jsx)(d.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(x.jsx)(b.a,{id:"connection-string",name:"connection_string",label:"Connection String",value:g,onChange:function(e){C(e.target.value)}})})}):Object(x.jsxs)(o.a.Fragment,{children:[Object(x.jsx)(d.a,{item:!0,xs:12,children:Object(x.jsxs)(d.a,{item:!0,xs:12,className:a.configureString,children:[Object(x.jsx)(d.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(x.jsx)(b.a,{id:"host",name:"host",label:"",placeholder:"Enter Host",value:w,onChange:function(e){y(e.target.value)}})}),Object(x.jsx)(d.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(x.jsx)(b.a,{id:"db-name",name:"db-name",label:"",placeholder:"Enter DB Name",value:k,onChange:function(e){E(e.target.value)}})}),Object(x.jsx)(d.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(x.jsx)(b.a,{id:"port",name:"port",label:"",placeholder:"Enter Port",value:A,onChange:function(e){M(e.target.value)}})}),Object(x.jsx)(d.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(x.jsx)(u.a,{value:V,label:"",id:"sslmode",name:"sslmode",onChange:function(e){void 0!==e.target.value&&$(e.target.value+"")},options:[{label:"Enter SSL Mode",value:" "},{label:"Require",value:"require"},{label:"Disable",value:"disable"},{label:"Verify CA",value:"verify-ca"},{label:"Verify Full",value:"verify-full"}]})}),Object(x.jsx)(d.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(x.jsx)(b.a,{id:"user",name:"user",label:"",placeholder:"Enter User",value:q,onChange:function(e){z(e.target.value)}})}),Object(x.jsx)(d.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(x.jsx)(b.a,{id:"password",name:"password",label:"",type:"password",placeholder:"Enter Password",value:D,onChange:function(e){_(e.target.value)}})})]})}),Object(x.jsx)(p.a,{label:"Connection String",content:g}),Object(x.jsx)(d.a,{item:!0,xs:12,children:Object(x.jsx)("br",{})})]}),Object(x.jsx)(d.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(x.jsx)(b.a,{id:"table",name:"table",label:"Table",placeholder:"Enter Table Name",value:U,tooltip:"DB table name to store/update events, table is auto-created",onChange:function(e){X(e.target.value)}})}),Object(x.jsx)(d.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(x.jsx)(j.a,{currentSelection:Z,id:"format",name:"format",label:"Format",onChange:function(e){ee(e.target.value)},tooltip:"'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'",selectorOptions:[{label:"Namespace",value:"namespace"},{label:"Access",value:"access"}]})}),Object(x.jsx)(d.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(x.jsx)(b.a,{id:"queue-dir",name:"queue_dir",label:"Queue Dir",placeholder:"Enter Queue Directory",value:ne,tooltip:"staging dir for undelivered messages e.g. '/home/events'",onChange:function(e){ce(e.target.value)}})}),Object(x.jsx)(d.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(x.jsx)(b.a,{id:"queue-limit",name:"queue_limit",label:"Queue Limit",placeholder:"Enter Queue Limit",type:"number",value:oe,tooltip:"maximum limit for undelivered messages, defaults to '10000'",onChange:function(e){se(e.target.value)}})}),Object(x.jsx)(d.a,{item:!0,xs:12,className:a.formFieldRow,children:Object(x.jsx)(O.a,{id:"comment",name:"comment",label:"Comment",placeholder:"Enter Comment",value:be,onChange:function(e){je(e.target.value)}})})]})}))}}]);
//# sourceMappingURL=81.84dc3af5.chunk.js.map