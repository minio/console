"use strict";(self.webpackChunkweb_app=self.webpackChunkweb_app||[]).push([[51],{51:(e,t,n)=>{n.r(t),n.d(t,{default:()=>T});var r=n(72791),i=n(26181),a=n.n(i),s=n(29945),o=n(78687),l=n(31776),c=n(38442),d=n(56087),u=n(9859),x=n(57689),p=n(87995),h=n(44690),m=n(82342),y=n(23508),g=n(80184);const j=e=>{let{onCloseAndRefresh:t,deleteOpen:n,bucket:i,id:a}=e;const o=(0,h.TL)(),[c,d]=(0,r.useState)(!1);(0,r.useEffect)((()=>{c&&l.h.buckets.deleteBucketLifecycleRule(i,a).then((()=>{d(!1),t(!0)})).catch((e=>{d(!1),o((0,p.Ih)((0,m.g)(e.error)))}))}),[c,i,a,t,o]);return(0,g.jsx)(y.Z,{title:"Delete Lifecycle Rule",confirmText:"Delete",isOpen:n,isLoading:c,onConfirm:()=>{d(!0)},titleIcon:(0,g.jsx)(s.NvT,{}),onClose:()=>t(!1),confirmationContent:(0,g.jsxs)(r.Fragment,{children:["Are you sure you want to delete the ",(0,g.jsx)("strong",{children:a})," rule?"]})})};var _=n(23814),v=n(56028),f=n(17420);const b=e=>{var t,n,i,o,c;let{closeModalAndRefresh:d,selectedBucket:u,lifecycleRule:x,open:y}=e;const j=(0,h.TL)(),[b,S]=(0,r.useState)(!0),[C,k]=(0,r.useState)(!1),[T,F]=(0,r.useState)(""),[I,E]=(0,r.useState)(!1),[O,L]=(0,r.useState)([]),[A,Z]=(0,r.useState)(""),[w,N]=(0,r.useState)(""),[P,z]=(0,r.useState)(""),[B,R]=(0,r.useState)(!1),[V,D]=(0,r.useState)("0"),[M,W]=(0,r.useState)("0"),[U,Y]=(0,r.useState)("expiry"),[Q,G]=(0,r.useState)("0"),[K,q]=(0,r.useState)("0"),[H,X]=(0,r.useState)(!1),[J,$]=(0,r.useState)(!1),[ee,te]=(0,r.useState)(!1),ne={"& .MuiPaper-root":{padding:0}};(0,r.useEffect)((()=>{b&&l.h.admin.tiersList().then((e=>{const t=a()(e.data,"items",[]);if(null!==t&&t.length>=1){const e=t.map((e=>{const t=e.type,n=a()(e,"".concat(t,".name"),"");return{label:n,value:n}}));L(e),e.length>0&&N(e[0].value)}S(!1)})).catch((()=>{S(!1)}))}),[b]),(0,r.useEffect)((()=>{let e=!0;"expiry"!==U&&""===w&&(e=!1),X(e)}),[U,Q,K,w]),(0,r.useEffect)((()=>{var e;"Enabled"===x.status&&E(!0);let t=!1;var n,r,i,a,s,o;(x.transition&&(x.transition.days&&0!==x.transition.days&&(q(x.transition.days.toString()),Y("transition"),t=!0),x.transition.noncurrent_transition_days&&0!==x.transition.noncurrent_transition_days&&(W(x.transition.noncurrent_transition_days.toString()),Y("transition"),t=!0),x.transition.date&&"0001-01-01T00:00:00Z"!==x.transition.date&&(Y("transition"),t=!0)),x.expiration&&(x.expiration.days&&0!==x.expiration.days&&(G(x.expiration.days.toString()),Y("expiry"),t=!1),x.expiration.noncurrent_expiration_days&&0!==x.expiration.noncurrent_expiration_days&&(D(x.expiration.noncurrent_expiration_days.toString()),Y("expiry"),t=!1),x.expiration.date&&"0001-01-01T00:00:00Z"!==x.expiration.date&&(Y("expiry"),t=!1)),t)?(N((null===(n=x.transition)||void 0===n?void 0:n.storage_class)||""),W((null===(r=x.transition)||void 0===r||null===(i=r.noncurrent_transition_days)||void 0===i?void 0:i.toString())||"0"),z((null===(a=x.transition)||void 0===a?void 0:a.noncurrent_storage_class)||"")):D((null===(s=x.expiration)||void 0===s||null===(o=s.noncurrent_expiration_days)||void 0===o?void 0:o.toString())||"0");if(R(!(null===(e=x.expiration)||void 0===e||!e.delete_marker)),Z(x.prefix||""),x.tags){const e=x.tags.reduce(((e,t,n)=>"".concat(e).concat(0!==n?"&":"").concat(t.key,"=").concat(t.value)),"");F(e)}}),[x]);let re="";return x.expiration&&(x.expiration.days>0?re="Current Version":x.expiration.noncurrent_expiration_days&&(re="Non-Current Version")),x.transition&&(x.transition.days>0?re="Current Version":x.transition.noncurrent_transition_days&&(re="Non-Current Version")),(0,g.jsx)(v.Z,{onClose:()=>{d(!1)},modalOpen:y,title:"Edit Lifecycle Configuration",titleIcon:(0,g.jsx)(s.QIv,{}),children:(0,g.jsx)("form",{noValidate:!0,autoComplete:"off",onSubmit:e=>{(e=>{if(e.preventDefault(),!C&&(k(!0),null!==u&&null!==x)){let e={};if("expiry"===U){var t,n,r;let i={};null!==(t=x.expiration)&&void 0!==t&&t.days&&(null===(n=x.expiration)||void 0===n?void 0:n.days)>0&&(i.expiry_days=parseInt(Q)),null!==(r=x.expiration)&&void 0!==r&&r.noncurrent_expiration_days&&(i.noncurrentversion_expiration_days=parseInt(V)),e={...i}}else{var i,a,s;let t={};null!==(i=x.transition)&&void 0!==i&&i.days&&(null===(a=x.transition)||void 0===a?void 0:a.days)>0&&(t.transition_days=parseInt(K),t.storage_class=w),null!==(s=x.transition)&&void 0!==s&&s.noncurrent_transition_days&&(t.noncurrentversion_transition_days=parseInt(M),t.noncurrentversion_transition_storage_class=P),e={...t}}const o={type:U,disable:!I,prefix:A,tags:T,expired_object_delete_marker:B,...e};l.h.buckets.updateBucketLifecycle(u,x.id,o).then((e=>{k(!1),d(!0)})).catch((async e=>{k(!1);const t=await e.json();j((0,p.Ih)((0,m.g)(t)))}))}})(e)},children:(0,g.jsxs)(s.ltY,{containerPadding:!1,withBorders:!1,children:[(0,g.jsx)(s.rsf,{label:"Status",indicatorLabels:["Enabled","Disabled"],checked:I,value:"user_enabled",id:"rule_status",name:"rule_status",onChange:e=>{E(e.target.checked)}}),(0,g.jsx)(s.Wzg,{id:"id",name:"id",label:"Id",value:x.id,onChange:()=>{},disabled:!0}),(0,g.jsx)(s.Eep,{currentValue:U,id:"rule_type",name:"rule_type",label:"Rule Type",selectorOptions:[{value:"expiry",label:"Expiry"},{value:"transition",label:"Transition"}],onChange:()=>{},disableOptions:!0}),(0,g.jsx)(s.Wzg,{id:"object-version",name:"object-version",label:"Object Version",value:re,onChange:()=>{},disabled:!0}),"expiry"===U&&(null===(t=x.expiration)||void 0===t?void 0:t.days)&&(0,g.jsx)(s.Wzg,{type:"number",id:"expiry_days",name:"expiry_days",onChange:e=>{G(e.target.value)},label:"Expiry Days",value:Q,min:"0"}),"expiry"===U&&(null===(n=x.expiration)||void 0===n?void 0:n.noncurrent_expiration_days)&&(0,g.jsx)(s.Wzg,{type:"number",id:"noncurrentversion_expiration_days",name:"noncurrentversion_expiration_days",onChange:e=>{D(e.target.value)},label:"Non-current Expiration Days",value:V,min:"0"}),"transition"===U&&(null===(i=x.transition)||void 0===i?void 0:i.days)&&(0,g.jsxs)(r.Fragment,{children:[(0,g.jsx)(s.Wzg,{type:"number",id:"transition_days",name:"transition_days",onChange:e=>{q(e.target.value)},label:"Transition Days",value:K,min:"0"}),(0,g.jsx)(s.PhF,{label:"Storage Class",id:"storage_class",name:"storage_class",value:w,onChange:e=>{N(e)},options:O})]}),"transition"===U&&(null===(o=x.transition)||void 0===o?void 0:o.noncurrent_transition_days)&&(0,g.jsxs)(r.Fragment,{children:[(0,g.jsx)(s.Wzg,{type:"number",id:"noncurrentversion_transition_days",name:"noncurrentversion_transition_days",onChange:e=>{W(e.target.value)},label:"Non-current Transition Days",value:M,min:"0"}),(0,g.jsx)(s.Wzg,{id:"noncurrentversion_t_SC",name:"noncurrentversion_t_SC",onChange:e=>{z(e.target.value)},placeholder:"Set Non-current Version Transition Storage Class",label:"Non-current Version Transition Storage Class",value:P})]}),(0,g.jsx)(s.rjZ,{item:!0,xs:12,sx:ne,children:(0,g.jsxs)(s.UQy,{title:"Filters",id:"lifecycle-filters",expanded:ee,onTitleClick:()=>te(!ee),children:[(0,g.jsx)(s.Wzg,{id:"prefix",name:"prefix",onChange:e=>{Z(e.target.value)},label:"Prefix",value:A}),(0,g.jsx)(f.Z,{name:"tags",label:"Tags",elements:T,onChange:e=>{F(e)},keyPlaceholder:"Tag Key",valuePlaceholder:"Tag Value",withBorder:!0})]})}),"expiry"===U&&(null===(c=x.expiration)||void 0===c?void 0:c.noncurrent_expiration_days)&&(0,g.jsx)(s.rjZ,{item:!0,xs:12,sx:ne,children:(0,g.jsx)(s.UQy,{title:"Advanced",id:"lifecycle-advanced-filters",expanded:J,onTitleClick:()=>$(!J),sx:{marginTop:15},children:(0,g.jsx)(s.rsf,{value:"expired_delete_marker",id:"expired_delete_marker",name:"expired_delete_marker",checked:B,onChange:e=>{R(e.target.checked)},label:"Expired Object Delete Marker"})})}),(0,g.jsxs)(s.rjZ,{item:!0,xs:12,sx:_.ID.modalButtonBar,children:[(0,g.jsx)(s.zxk,{id:"cancel",type:"button",variant:"regular",disabled:C,onClick:()=>{d(!1)},label:"Cancel"}),(0,g.jsx)(s.zxk,{id:"save",type:"submit",variant:"callAction",color:"primary",disabled:C||!H,label:"Save"})]}),C&&(0,g.jsx)(s.rjZ,{item:!0,xs:12,children:(0,g.jsx)(s.kod,{})})]})})})};var S=n(84741);const C=e=>{let{open:t,closeModalAndRefresh:n,bucketName:i}=e;const c=(0,h.TL)(),u=(0,o.v9)(p.N5),[x,y]=(0,r.useState)(!0),[j,b]=(0,r.useState)([]),[C,k]=(0,r.useState)(!1),[T,F]=(0,r.useState)(null),[I,E]=(0,r.useState)(""),[O,L]=(0,r.useState)(""),[A,Z]=(0,r.useState)(""),[w,N]=(0,r.useState)("expiry"),[P,z]=(0,r.useState)("current"),[B,R]=(0,r.useState)(""),[V,D]=(0,r.useState)(!1),[M,W]=(0,r.useState)(!1),[U,Y]=(0,r.useState)(!0),[Q,G]=(0,r.useState)(!1),[K,q]=(0,r.useState)(!1),[H,X]=(0,r.useState)("days"),J={"& .MuiPaper-root":{padding:0}};(0,r.useEffect)((()=>{x&&l.h.admin.tiersList().then((e=>{const t=a()(e.data,"items",[]);if(null!==t&&t.length>=1){const e=t.map((e=>{const t=e.type,n=a()(e,"".concat(t,".name"),"");return{label:n,value:n}}));b(e),e.length>0&&Z(e[0].value)}y(!1)})).catch((()=>{y(!1)}))}),[x]),(0,r.useEffect)((()=>{let e=!0;"expiry"!==w&&""===A&&(e=!1),B&&0!==parseInt(B)||(e=!1),parseInt(B)>2147483647&&(e=!1),D(e)}),[w,B,A]),(0,r.useEffect)((()=>{U&&u&&l.h.buckets.getBucketVersioning(i).then((e=>{F(e.data),Y(!1)})).catch((e=>{c((0,p.zb)((0,m.g)(e))),Y(!1)}))}),[U,c,i,u]);return(0,g.jsxs)(v.Z,{modalOpen:t,onClose:()=>{n(!1)},title:"Add Lifecycle Rule",titleIcon:(0,g.jsx)(s.QIv,{}),children:[x&&(0,g.jsx)(s.rjZ,{container:!0,children:(0,g.jsx)(s.rjZ,{item:!0,xs:12,children:(0,g.jsx)(s.kod,{})})}),!x&&(0,g.jsx)("form",{noValidate:!0,autoComplete:"off",onSubmit:e=>{e.preventDefault(),k(!0),(()=>{let e={};if("expiry"===w){let t={};"current"===P?t.expiry_days=parseInt(B):"days"===H?t.noncurrentversion_expiration_days=parseInt(B):t.newer_noncurrentversion_expiration_versions=parseInt(B),e={...t}}else{let t={};"current"===P?(t.transition_days=parseInt(B),t.storage_class=A):"days"===H&&(t.noncurrentversion_transition_days=parseInt(B),t.noncurrentversion_transition_storage_class=A),e={...t}}const t={type:w,prefix:I,tags:O,expired_object_delete_marker:M,...e};l.h.buckets.addBucketLifecycle(i,t).then((()=>{k(!1),n(!0)})).catch((e=>{k(!1),c((0,p.zb)((0,m.g)(e)))}))})()},children:(0,g.jsxs)(s.ltY,{withBorders:!1,containerPadding:!1,children:[(0,g.jsx)(s.Eep,{currentValue:w,id:"ilm_type",name:"ilm_type",label:"Type of Lifecycle",onChange:e=>{N(e.target.value)},selectorOptions:[{value:"expiry",label:"Expiry"},{value:"transition",label:"Transition"}],helpTip:(0,g.jsxs)(r.Fragment,{children:["Select"," ",(0,g.jsx)("a",{target:"blank",href:"https://min.io/docs/minio/kubernetes/upstream/administration/object-management/create-lifecycle-management-expiration-rule.html",children:"Expiry"})," ","to delete Objects per this rule. Select"," ",(0,g.jsx)("a",{target:"blank",href:"https://min.io/docs/minio/kubernetes/upstream/administration/object-management/transition-objects-to-minio.html",children:"Transition"})," ","to move Objects to a remote storage"," ",(0,g.jsx)("a",{target:"blank",href:"https://min.io/docs/minio/windows/administration/object-management/transition-objects-to-minio.html#configure-the-remote-storage-tier",children:"Tier"})," ","per this rule."]}),helpTipPlacement:"right"}),"Enabled"===(null===T||void 0===T?void 0:T.status)&&(0,g.jsx)(s.PhF,{value:P,id:"object_version",name:"object_version",label:"Object Version",onChange:e=>{z(e)},options:[{value:"current",label:"Current Version"},{value:"noncurrent",label:"Non-Current Version"}],helpTip:(0,g.jsxs)(r.Fragment,{children:["Select whether to apply the rule to current or non-current Object",(0,g.jsxs)("a",{target:"blank",href:"https://min.io/docs/minio/kubernetes/upstream/administration/object-management/create-lifecycle-management-expiration-rule.html#expire-versioned-objects",children:[" ","Versions"]})]}),helpTipPlacement:"right"}),(0,g.jsx)(s.Wzg,{error:B&&!V?parseInt(B)<=0?"Number of ".concat(H," to retain must be greater than zero"):parseInt(B)>2147483647?"Number of ".concat(H," must be less than or equal to 2147483647"):"":"",id:"expiry_days",name:"expiry_days",onChange:e=>{e.target.validity.valid&&R(e.target.value)},pattern:"[0-9]*",label:"After",value:B,overlayObject:(0,g.jsx)(r.Fragment,{children:(0,g.jsxs)(s.rjZ,{container:!0,sx:{justifyContent:"center"},children:[(0,g.jsx)(S.Z,{id:"expire-current-unit",unitSelected:H,unitsList:[{label:"Days",value:"days"},{label:"Versions",value:"versions"}],disabled:"noncurrent"!==P||"expiry"!==w,onUnitChange:e=>{X(e)}}),"expiry"===w&&"noncurrent"===P&&(0,g.jsxs)(s.SYi,{content:(0,g.jsx)(r.Fragment,{children:"Select to set expiry by days or newer noncurrent versions"}),placement:"right",children:[" ",(0,g.jsx)(s.zMQ,{style:{width:15,height:15}})]})]})})}),"expiry"===w?(0,g.jsx)(r.Fragment,{}):(0,g.jsx)(s.PhF,{label:"To Tier",id:"storage_class",name:"storage_class",value:A,onChange:e=>{Z(e)},options:j,helpTip:(0,g.jsxs)(r.Fragment,{children:["Configure a"," ",(0,g.jsx)("a",{href:d.gA.TIERS_ADD,color:"secondary",style:{textDecoration:"underline"},children:"remote tier"})," ","to receive transitioned Objects"]}),helpTipPlacement:"right"}),(0,g.jsx)(s.rjZ,{item:!0,xs:12,sx:J,children:(0,g.jsxs)(s.UQy,{title:"Filters",id:"lifecycle-filters",expanded:K,onTitleClick:()=>q(!K),children:[(0,g.jsx)(s.rjZ,{item:!0,xs:12,children:(0,g.jsx)(s.Wzg,{id:"prefix",name:"prefix",onChange:e=>{E(e.target.value)},label:"Prefix",value:I})}),(0,g.jsx)(s.rjZ,{item:!0,xs:12,children:(0,g.jsx)(f.Z,{name:"tags",label:"Tags",elements:"",onChange:e=>{L(e)},keyPlaceholder:"Tag Key",valuePlaceholder:"Tag Value",withBorder:!0})})]})}),"expiry"===w&&"noncurrent"===P&&(0,g.jsx)(s.rjZ,{item:!0,xs:12,sx:J,children:(0,g.jsx)(s.UQy,{title:"Advanced",id:"lifecycle-advanced-filters",expanded:Q,onTitleClick:()=>G(!Q),sx:{marginTop:15},children:(0,g.jsx)(s.rjZ,{item:!0,xs:12,children:(0,g.jsx)(s.rsf,{value:"expired_delete_marker",id:"expired_delete_marker",name:"expired_delete_marker",checked:M,onChange:e=>{W(e.target.checked)},label:"Expire Delete Marker",description:"Remove the reference to the object if no versions are left"})})})}),(0,g.jsxs)(s.rjZ,{item:!0,xs:12,sx:_.ID.modalButtonBar,children:[(0,g.jsx)(s.zxk,{id:"reset",type:"button",variant:"regular",disabled:C,onClick:()=>{n(!1)},label:"Cancel"}),(0,g.jsx)(s.zxk,{id:"save-lifecycle",type:"submit",variant:"callAction",color:"primary",disabled:C||!V,label:"Save"})]}),C&&(0,g.jsx)(s.rjZ,{item:!0,xs:12,children:(0,g.jsx)(s.kod,{})})]})})]})};var k=n(27454);const T=()=>{const e=(0,o.v9)(u.HQ),t=(0,x.UO)(),[n,i]=(0,r.useState)(!0),[m,y]=(0,r.useState)([]),[_,v]=(0,r.useState)(!1),[f,S]=(0,r.useState)(!1),[T,F]=(0,r.useState)(null),[I,E]=(0,r.useState)(!1),[O,L]=(0,r.useState)(null),A=(0,h.TL)(),Z=t.bucketName||"",w=(0,c.F)(Z,[d.Ft.S3_GET_LIFECYCLE_CONFIGURATION,d.Ft.S3_GET_ACTIONS]);(0,r.useEffect)((()=>{e&&i(!0)}),[e,i]),(0,r.useEffect)((()=>{A((0,p.Sc)("bucket_detail_lifecycle"))}),[]),(0,r.useEffect)((()=>{n&&(w?l.h.buckets.getBucketLifecycle(Z).then((e=>{const t=a()(e.data,"lifecycle",[]);y(t||[]),i(!1)})).catch((e=>{console.error(e.error),y([]),i(!1)})):i(!1))}),[n,i,Z,w]);const N=[{label:"Type",renderFullObject:!0,renderFunction:e=>e?e.expiration&&(e.expiration.days>0||e.expiration.noncurrent_expiration_days||e.expiration.newer_noncurrent_expiration_versions&&e.expiration.newer_noncurrent_expiration_versions>0)?(0,g.jsx)("span",{children:"Expiry"}):e.transition&&(e.transition.days>0||e.transition.noncurrent_transition_days)?(0,g.jsx)("span",{children:"Transition"}):(0,g.jsx)(r.Fragment,{}):(0,g.jsx)(r.Fragment,{})},{label:"Version",renderFullObject:!0,renderFunction:e=>{if(!e)return(0,g.jsx)(r.Fragment,{});if(e.expiration){if(e.expiration.days>0)return(0,g.jsx)("span",{children:"Current"});if(e.expiration.noncurrent_expiration_days||e.expiration.newer_noncurrent_expiration_versions)return(0,g.jsx)("span",{children:"Non-Current"})}if(e.transition){if(e.transition.days>0)return(0,g.jsx)("span",{children:"Current"});if(e.transition.noncurrent_transition_days)return(0,g.jsx)("span",{children:"Non-Current"})}}},{label:"Tier",elementKey:"storage_class",renderFunction:e=>{let t=a()(e,"transition.storage_class","");return t=a()(e,"transition.noncurrent_storage_class",t),t},renderFullObject:!0},{label:"Prefix",elementKey:"prefix"},{label:"After",renderFullObject:!0,renderFunction:e=>{if(!e)return(0,g.jsx)(r.Fragment,{});if(e.transition){if(e.transition.days>0)return(0,g.jsxs)("span",{children:[e.transition.days," days"]});if(e.transition.noncurrent_transition_days)return(0,g.jsxs)("span",{children:[e.transition.noncurrent_transition_days," days"]})}return e.expiration?e.expiration.days>0?(0,g.jsxs)("span",{children:[e.expiration.days," days"]}):e.expiration.noncurrent_expiration_days?(0,g.jsxs)("span",{children:[e.expiration.noncurrent_expiration_days," days"]}):(0,g.jsxs)("span",{children:[e.expiration.newer_noncurrent_expiration_versions," versions"]}):void 0}},{label:"Status",elementKey:"status"}],P=[{type:"view",onClick(e){F(e),S(!0)}},{type:"delete",onClick(e){L(e),E(!0)},sendOnlyId:!0}];return(0,g.jsxs)(r.Fragment,{children:[f&&T&&(0,g.jsx)(b,{open:f,closeModalAndRefresh:e=>{S(!1),F(null),e&&i(!0)},selectedBucket:Z,lifecycleRule:T}),_&&(0,g.jsx)(C,{open:_,bucketName:Z,closeModalAndRefresh:e=>{v(!1),e&&i(!0)}}),I&&O&&(0,g.jsx)(j,{id:O,bucket:Z,deleteOpen:I,onCloseAndRefresh:e=>{E(!1),L(null),e&&i(!0)}}),(0,g.jsx)(s.NZf,{separator:!0,sx:{marginBottom:15},actions:(0,g.jsx)(c.s,{scopes:[d.Ft.S3_PUT_LIFECYCLE_CONFIGURATION,d.Ft.S3_PUT_ACTIONS],resource:Z,matchAll:!0,errorProps:{disabled:!0},children:(0,g.jsx)(k.Z,{tooltip:"Add Lifecycle Rule",children:(0,g.jsx)(s.zxk,{id:"add-bucket-lifecycle-rule",onClick:()=>{v(!0)},label:"Add Lifecycle Rule",icon:(0,g.jsx)(s.dtP,{}),variant:"callAction"})})}),children:(0,g.jsx)(s.SYi,{content:(0,g.jsxs)(r.Fragment,{children:["MinIO derives it\u2019s behavior and syntax from"," ",(0,g.jsx)("a",{target:"blank",href:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html",children:"S3 lifecycle"})," ","for compatibility in migrating workloads and lifecycle rules from S3 to MinIO."]}),placement:"right",children:"Lifecycle Rules"})}),(0,g.jsxs)(s.rjZ,{container:!0,children:[(0,g.jsx)(s.rjZ,{item:!0,xs:12,children:(0,g.jsx)(c.s,{scopes:[d.Ft.S3_GET_LIFECYCLE_CONFIGURATION,d.Ft.S3_GET_ACTIONS],resource:Z,errorProps:{disabled:!0},children:(0,g.jsx)(s.wQF,{itemActions:P,columns:N,isLoading:n,records:m,entityName:"Lifecycle",customEmptyMessage:"There are no Lifecycle rules yet",idField:"id",customPaperHeight:"400px"})})}),!n&&(0,g.jsxs)(s.rjZ,{item:!0,xs:12,children:[(0,g.jsx)("br",{}),(0,g.jsx)(s.KfX,{title:"Lifecycle Rules",iconComponent:(0,g.jsx)(s.y2Y,{}),help:(0,g.jsxs)(r.Fragment,{children:["MinIO Object Lifecycle Management allows creating rules for time or date based automatic transition or expiry of objects. For object transition, MinIO automatically moves the object to a configured remote storage tier.",(0,g.jsx)("br",{}),(0,g.jsx)("br",{}),"You can learn more at our"," ",(0,g.jsx)("a",{href:"https://min.io/docs/minio/linux/administration/object-management/object-lifecycle-management.html?ref=con",target:"_blank",rel:"noopener",children:"documentation"}),"."]})})]})]})]})}},84741:(e,t,n)=>{n.d(t,{Z:()=>d});var r=n(72791),i=n(29945),a=n(16444),s=n(26181),o=n.n(s),l=n(80184);const c=a.ZP.button((e=>{let{theme:t}=e;return{border:"1px solid ".concat(o()(t,"borderColor","#E2E2E2")),borderRadius:3,color:o()(t,"secondaryText","#5B5C5C"),backgroundColor:o()(t,"boxBackground","#FBFAFA"),fontSize:12}})),d=e=>{let{id:t,unitSelected:n,unitsList:a,disabled:s=!1,onUnitChange:o}=e;const[d,u]=r.useState(null),x=Boolean(d),p=e=>{u(null),""!==e&&o&&o(e)};return(0,l.jsxs)(r.Fragment,{children:[(0,l.jsx)(c,{id:"".concat(t,"-button"),"aria-controls":"".concat(t,"-menu"),"aria-haspopup":"true","aria-expanded":x?"true":void 0,onClick:e=>{u(e.currentTarget)},disabled:s,type:"button",children:n}),(0,l.jsx)(i.udT,{id:"upload-main-menu",options:a,selectedOption:"",onSelect:e=>p(e),hideTriggerAction:()=>{p("")},open:x,anchorEl:d,anchorOrigin:"end"})]})}},17420:(e,t,n)=>{n.d(t,{Z:()=>d});var r=n(72791),i=n(26181),a=n.n(i),s=n(48573),o=n.n(s),l=n(29945),c=n(80184);const d=e=>{let{elements:t,name:n,label:i,tooltip:s="",keyPlaceholder:d="",valuePlaceholder:u="",onChange:x,withBorder:p=!1}=e;const[h,m]=(0,r.useState)([""]),[y,g]=(0,r.useState)([""]),j=(0,r.createRef)();(0,r.useEffect)((()=>{if(1===h.length&&""===h[0]&&1===y.length&&""===y[0]&&t&&""!==t){const e=t.split("&");let n=[],r=[];e.forEach((e=>{const t=e.split("=");2===t.length&&(n.push(t[0]),r.push(t[1]))})),n.push(""),r.push(""),m(n),g(r)}}),[h,y,t]),(0,r.useEffect)((()=>{const e=j.current;e&&h.length>1&&e.scrollIntoView(!1)}),[h]);const _=(0,r.useRef)(!0);(0,r.useLayoutEffect)((()=>{_.current?_.current=!1:b()}),[h,y]);const v=e=>{e.persist();let t=[...h];const n=a()(e.target,"dataset.index","0");t[parseInt(n)]=e.target.value,m(t)},f=e=>{e.persist();let t=[...y];const n=a()(e.target,"dataset.index","0");t[parseInt(n)]=e.target.value,g(t)},b=o()((()=>{let e="";h.forEach(((t,n)=>{if(h[n]&&y[n]){let r="".concat(t,"=").concat(y[n]);0!==n&&(r="&".concat(r)),e="".concat(e).concat(r)}})),x(e)}),500),S=y.map(((e,t)=>(0,c.jsxs)(l.rjZ,{item:!0,xs:12,className:"lineInputBoxes inputItem",children:[(0,c.jsx)(l.Wzg,{id:"".concat(n,"-key-").concat(t.toString()),label:"",name:"".concat(n,"-").concat(t.toString()),value:h[t],onChange:v,index:t,placeholder:d}),(0,c.jsx)("span",{className:"queryDiv",children:":"}),(0,c.jsx)(l.Wzg,{id:"".concat(n,"-value-").concat(t.toString()),label:"",name:"".concat(n,"-").concat(t.toString()),value:y[t],onChange:f,index:t,placeholder:u,overlayIcon:t===y.length-1?(0,c.jsx)(l.dtP,{}):null,overlayAction:()=>{(()=>{if(""!==h[h.length-1].trim()&&""!==y[y.length-1].trim()){const e=[...h],t=[...y];e.push(""),t.push(""),m(e),g(t)}})()}})]},"query-pair-".concat(n,"-").concat(t.toString()))));return(0,c.jsx)(r.Fragment,{children:(0,c.jsxs)(l.rjZ,{item:!0,xs:12,sx:{"& .lineInputBoxes":{display:"flex"},"& .queryDiv":{alignSelf:"center",margin:"-15px 4px 0",fontWeight:600}},className:"inputItem",children:[(0,c.jsxs)(l.AZs,{children:[i,""!==s&&(0,c.jsx)(l.xuv,{sx:{marginLeft:5,display:"flex",alignItems:"center","& .min-icon":{width:13}},children:(0,c.jsx)(l.ua7,{tooltip:s,placement:"top",children:(0,c.jsx)(l.byK,{style:{width:13,height:13}})})})]}),(0,c.jsxs)(l.xuv,{withBorders:p,sx:{padding:15,height:150,overflowY:"auto",position:"relative",marginTop:15},children:[S,(0,c.jsx)("div",{ref:j})]})]})})}}}]);
//# sourceMappingURL=51.ea4630e2.chunk.js.map