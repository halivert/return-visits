import{d as R,s as N,x as a,e as n,F as B,f as t,t as l,k as u,g as h,i as V,y as d,z as b,m as C,A as E,B as y,o as r,D as P}from"./index-BzlAtdqQ.js";import{a as A}from"./index-2urXqW4y.js";import{u as D,a as g}from"./useAsyncPerson-CKSnThlb.js";const F={class:"max-w-prose mx-auto py-2 px-3"},S={key:0,class:"text-3xl font-bold text-center"},j={class:"flex justify-between flex-wrap gap-3"},L={class:"text-3xl font-bold"},I={class:"text-2xl font-semibold"},T=["href"],U={key:0,class:"underline text-sm"},$={class:"whitespace-pre-line"},z={class:"px-2 py-1"},Q={class:"flex justify-between"},Y={class:"inline-block fixed bottom-4 right-5"},q={async beforeRouteEnter(c,p,i){try{await g({id:parseInt(c.params.id,10)}),i()}catch{i({name:"NotFound"})}}},K=R({...q,__name:"PeopleShow",props:{id:{}},setup(c){const p=C(),i=E();N(s=>{g({id:parseInt(s.params.id,10)}).catch(()=>{p.replace({name:"NotFound"})})});const m=c,_=a(()=>m.id),k=D({id:_}),o=a(()=>k.data.value),f=a(()=>{if(!o.value||!o.value.location)return"";const{latitude:s,longitude:e}=o.value.location;return!s||!e?"":`https://www.google.com/maps/search/${s},${e}`}),v=a(()=>{});return A(a(()=>{var s;return[(s=o.value)==null?void 0:s.name,i.meta.appName].filter(Boolean).join(" | ")})),(s,e)=>{const x=y("RouterLink"),w=y("router-view");return r(),n("main",F,[o.value?(r(),n(B,{key:1},[t("div",j,[t("h1",L,l(o.value.name||"Sin nombre"),1),t("h2",I,[u(l(o.value.colony)+" ",1),f.value?(r(),n("a",{key:0,href:f.value,rel:"noopener noreferrer",target:"_blank",class:"text-base bg-lemon-100"}," (Ubicación) ",8,T)):h("",!0)])]),v.value!=null?(r(),n("span",U," Volver el "+l(V(P)[v.value]),1)):h("",!0),t("p",$,l(o.value.description),1),e[3]||(e[3]=t("hr",{class:"h-0.5 bg-asparagus-600 my-3"},null,-1)),t("section",z,[t("div",Q,[e[1]||(e[1]=t("h2",{class:"text-xl font-semibold"},"Revisitas",-1)),d(x,{to:{name:"PeopleReturnVisitsCreate"},class:"underline bg-lemon-100","active-class":"hidden"},{default:b(()=>e[0]||(e[0]=[u(" Agregar revisita ")])),_:1})]),d(w,{class:"mt-6"})]),t("div",Y,[d(x,{to:{name:"PeopleEdit",params:{id:_.value}},class:"inline-block underline bg-lemon-100"},{default:b(()=>e[2]||(e[2]=[u(" Editar persona ")])),_:1},8,["to"])])],64)):(r(),n("h1",S,"Error"))])}}});export{K as default};