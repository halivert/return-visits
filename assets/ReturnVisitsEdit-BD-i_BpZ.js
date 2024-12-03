import{x as Y,r as b,y as Z,u as h,k as T,f as u,z,a as _,A as ee,d as O,B as te,C as $,c as y,E as ae,G as re,b as i,H as oe,I as A,J as se,l as V,o as c,K as le,v as N,i as ne,F as I,g as x,t as P,w as de,e as v,m as L,h as ie,q as ue,s as me}from"./index-CRgsI8ii.js";import{u as pe,g as F,a as S}from"./getDateTimeForInput-B7rWynE8.js";import{u as j,b as q,_ as w,a as ve}from"./VTextarea.vue_vue_type_script_setup_true_lang-Bq3UuHX3.js";function G({personId:l,date:n}){return Y({queryKey:b.detail(l,n),queryFn:({queryKey:d})=>Z("returnVisits",[d[2],d[3]])})}function fe({personId:l,date:n}){const d=h(),{data:m}=G({personId:l,date:n});return j({mutationFn:T(()=>async s=>{var D;if(!m.value)return Promise.reject(new Error("Revisita no encontrada"));const p=m.value,g={personId:s.personId??p.personId,date:s.date??p.date,topic:(s.topic??p.topic).trim(),returnDate:s.returnDate??p.returnDate,notes:(D=s.notes??p.notes)==null?void 0:D.trim()};return u(l)!==g.personId||u(n).toISOString()!==g.date.toISOString()?(await z("returnVisits",[u(l),u(n)]),await _("returnVisits",g)):await ee("returnVisits",[u(l),u(n)],g),g}),onSuccess:s=>{d.invalidateQueries({queryKey:b.list(s.personId)}),d.setQueryData(b.detail(s.personId,s.date),s),s.personId!==u(l)&&d.invalidateQueries({queryKey:b.list(l)}),(s.personId!==u(l)||s.date!==u(n))&&d.invalidateQueries({queryKey:b.detail(l,n)})}})}function ce({personId:l,date:n}){const d=h();return j({mutationFn:T(()=>async()=>{await z("returnVisits",[u(l),u(n)])}),onSuccess:()=>{d.invalidateQueries({queryKey:b.list(l)}),d.removeQueries({queryKey:b.detail(l,n)})}})}const ye=["id","name"],ge=O({inheritAttrs:!1,__name:"VSelect",props:te({divClass:{},id:{},hideErrors:{type:Boolean}},{modelValue:{},modelModifiers:{},errors:{},errorsModifiers:{}}),emits:["update:modelValue","update:errors"],setup(l){const n=$(l,"modelValue"),d=$(l,"errors");return(m,s)=>(c(),y("div",{class:A(m.divClass)},[ae(i("select",{id:m.id,name:m.id,class:A(["w-full h-8 px-2 py-1 border dark:text-lemon-50",d.value?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),"onUpdate:modelValue":s[0]||(s[0]=p=>n.value=p),onChange:s[1]||(s[1]=p=>d.value="")},[oe(m.$slots,"default")],42,ye),[[re,n.value]]),m.hideErrors?V("",!0):(c(),se(q,{key:0,errors:d.value},null,8,["errors"]))],2))}}),De=["value"],be={class:"col-span-2"},xe={class:"flex flex-wrap gap-2"},Te={class:"col-span-2"},we={class:"flex flex-wrap gap-2"},ke=O({__name:"ReturnVisitsEdit",props:{id:{},date:{}},setup(l){var U,R,Q,E,B,K,M;const n=ie(),d=l,m=T(()=>d.id),s=T(()=>d.date),p=fe({personId:m,date:s}),g=ce({personId:m,date:s}),D=G({personId:m,date:s}),f=T(()=>D.data.value),H=pe(),J=le(),C=T(()=>J.data.value??[]),t=N({personId:(U=f.value)==null?void 0:U.personId,topic:(R=f.value)==null?void 0:R.topic,date:F((Q=f.value)==null?void 0:Q.date),time:S((E=f.value)==null?void 0:E.date),returnDate:F((B=f.value)==null?void 0:B.returnDate),returnTime:S((K=f.value)==null?void 0:K.returnDate),notes:(M=f.value)==null?void 0:M.notes}),o=N({});ne(f,r=>{t.personId=r==null?void 0:r.personId,t.topic=r==null?void 0:r.topic,t.date=F(r==null?void 0:r.date),t.time=S(r==null?void 0:r.date),t.returnDate=F(r==null?void 0:r.returnDate),t.returnTime=S(r==null?void 0:r.returnDate),t.notes=r==null?void 0:r.notes});async function W(){try{await g.mutateAsync(),n.back()}catch(r){console.info(r)}}async function X(){t.personId||(o.personId="Elige a la persona"),t.topic||(o.topic="Falta tema"),t.date||(o.date="Falta fecha"),t.time||(o.time="Falta hora"),t.returnDate||(o.returnDate="Falta fecha de revisita"),t.returnTime||(o.returnTime="Falta hora de revisita");const r=new Date(t.date+"T"+t.time),e=new Date(t.returnDate+"T"+t.returnTime);if(r.getTime()>e.getTime()&&(o.returnDate="Fecha de revisita tiene que ser posterior a fecha de visita"),!Object.values(o).some(Boolean))try{await p.mutateAsync({personId:t.personId,date:r,topic:t.topic,returnDate:e,notes:t.notes}),n.back()}catch(k){console.info(k)}}return(r,e)=>{const k=ue("RouterLink");return c(),y("div",null,[u(D).isLoading.value?(c(),y(I,{key:0},[x("Cargando...")],64)):u(D).error.value||!f.value?(c(),y(I,{key:1},[x(P(u(D).error.value||"Error"),1)],64)):(c(),y("form",{key:2,class:"grid grid-cols-3 gap-2 gap-y-3",onSubmit:de(X,["prevent"])},[C.value.length>1?(c(),y(I,{key:0},[e[13]||(e[13]=i("label",{class:"text-right",for:"personId"},"Persona",-1)),v(ge,{"div-class":"col-span-2",id:"personId",modelValue:t.personId,"onUpdate:modelValue":e[0]||(e[0]=a=>t.personId=a),errors:o.personId},{default:L(()=>[(c(!0),y(I,null,me(C.value,a=>(c(),y("option",{key:a.id,value:a.id},P(a.name),9,De))),128))]),_:1},8,["modelValue","errors"])],64)):V("",!0),e[15]||(e[15]=i("div",{class:"text-right"},[i("label",{for:"date"},"Fecha"),x(" y "),i("label",{for:"time"},"hora")],-1)),i("div",be,[i("div",xe,[v(w,{id:"date","div-class":"flex-1",type:"date",modelValue:t.date,"onUpdate:modelValue":e[1]||(e[1]=a=>t.date=a),errors:o.date,"onUpdate:errors":e[2]||(e[2]=a=>o.date=a),"hide-errors":"",required:""},null,8,["modelValue","errors"]),v(w,{id:"time","div-class":"flex-1",type:"time",modelValue:t.time,"onUpdate:modelValue":e[3]||(e[3]=a=>t.time=a),errors:o.time,"onUpdate:errors":e[4]||(e[4]=a=>o.time=a),"hide-errors":"",required:""},null,8,["modelValue","errors"])]),v(q,{errors:[o.date,o.time]},null,8,["errors"])]),e[16]||(e[16]=i("label",{class:"text-right",for:"topic"},"Tema",-1)),v(w,{id:"topic","div-class":"col-span-2",modelValue:t.topic,"onUpdate:modelValue":e[5]||(e[5]=a=>t.topic=a),errors:o.topic,"onUpdate:errors":e[6]||(e[6]=a=>o.topic=a),list:u(H),required:""},null,8,["modelValue","errors","list"]),e[17]||(e[17]=i("div",{class:"text-right"},[i("label",{for:"returnDate"},"Fecha"),x(" y "),i("label",{for:"returnTime"},"hora"),x(" de revisita ")],-1)),i("div",Te,[i("div",we,[v(w,{id:"returnDate","div-class":"flex-1",type:"date",modelValue:t.returnDate,"onUpdate:modelValue":e[7]||(e[7]=a=>t.returnDate=a),errors:o.returnDate,"onUpdate:errors":e[8]||(e[8]=a=>o.returnDate=a),min:t.date,"hide-errors":"",required:""},null,8,["modelValue","errors","min"]),v(w,{id:"returnTime","div-class":"flex-1",type:"time",modelValue:t.returnTime,"onUpdate:modelValue":e[9]||(e[9]=a=>t.returnTime=a),errors:o.returnTime,"onUpdate:errors":e[10]||(e[10]=a=>o.returnTime=a),"hide-errors":"",required:""},null,8,["modelValue","errors"])]),v(q,{errors:[o.returnDate,o.returnTime]},null,8,["errors"])]),e[18]||(e[18]=i("label",{class:"text-right",for:"notes"},"Notas",-1)),v(ve,{"div-class":"col-span-2",id:"notes",class:"resize-y min-h-16 max-h-72",modelValue:t.notes,"onUpdate:modelValue":e[11]||(e[11]=a=>t.notes=a),errors:o.notes,"onUpdate:errors":e[12]||(e[12]=a=>o.notes=a)},null,8,["modelValue","errors"]),v(k,{class:"col-start-2 border underline border-asparagus-600 rounded px-2 py-1 text-asparagus-600 text-center",to:{name:"PeopleShow",params:{id:r.id}}},{default:L(()=>e[14]||(e[14]=[x(" Cancelar ")])),_:1},8,["to"]),e[19]||(e[19]=i("button",{class:"bg-asparagus-600 rounded px-2 py-1 text-lemon-50",type:"submit"}," Guardar ",-1)),i("button",{class:"col-start-2 bg-fawn-600 rounded px-2 py-1 text-fawn-50 text-center",onClick:W,type:"button"}," Eliminar ")],32))])}}});export{ke as default};
