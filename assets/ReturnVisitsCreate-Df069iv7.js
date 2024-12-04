import{u as q,m as V,r as b,f as t,a as C,d as k,W as x,k as S,c as A,b as o,g as u,e as n,_ as w,w as F,h as E,i as N,j as P,s as Q,o as B}from"./index-CVGw5Sz0.js";import{u as M}from"./useMutation-x1iVZiTe.js";import{u as $,g as v,a as c}from"./getDateTimeForInput-BAL-ceny.js";import{u as K,_ as m,a as L}from"./VTextarea.vue_vue_type_script_setup_true_lang-Nj08pXi5.js";import{u as j}from"./usePersonReturnVisits-DHf5t2o3.js";import"./useReturnVisits-Cc36bZhK.js";function W({personId:D}){const p=q();return M({mutationFn:V(()=>async a=>{var f;const l={personId:t(D),date:a.date,returnDate:a.returnDate,topic:a.topic.trim(),notes:(f=a.notes)==null?void 0:f.trim()};return await C("returnVisits",l),l}),onSuccess:a=>{p.invalidateQueries({queryKey:b.list(a.personId)}),p.setQueryData(b.detail(a.personId,a.date),a)}})}const z={class:"col-span-2"},G={class:"flex flex-wrap gap-2"},O={class:"col-span-2"},H={class:"flex flex-wrap gap-2"},ee=k({__name:"ReturnVisitsCreate",props:{id:{}},setup(D){const p=P(),a=D,l=V(()=>a.id),f=j({personId:l}),g=W({personId:l}),U=$(),R=V(()=>{var i;return(i=f.data.value)==null?void 0:i.at(0)}),T=new Date,y=new Date(T.getTime()+x),e=K({date:v(T),time:c(T),topic:"",returnDate:v(y),returnTime:c(y),notes:""});S(R,i=>{if(!i)return;const r=i.returnDate;e.date=v(r),e.time=c(r);const d=new Date(r.getTime()+x);e.returnDate=v(d),e.returnTime=c(d)});async function I(){if(g.isPending.value)return;e.date||(e.errors.date="Falta fecha"),e.time||(e.errors.time="Falta hora"),e.topic||(e.errors.topic="Falta tema"),e.returnDate||(e.errors.returnDate="Falta fecha de revisita"),e.returnTime||(e.errors.returnTime="Falta hora de revisita");const i=new Date(e.date+"T"+e.time),r=new Date(e.returnDate+"T"+e.returnTime);if(i.getTime()>r.getTime()&&(e.errors.returnDate="Fecha de revisita tiene que ser posterior a fecha de visita"),!Object.values(e.errors).some(Boolean))try{await g.mutateAsync({date:i,topic:e.topic,returnDate:r,notes:e.notes}),p.back()}catch(d){console.info(d),alert(`Error guardando los datos
Por favor intenta de nuevo`)}}return(i,r)=>{const d=Q("RouterLink");return B(),A("form",{class:"grid grid-cols-3 gap-2 gap-y-3",onSubmit:N(I,["prevent"])},[r[14]||(r[14]=o("div",{class:"text-right"},[o("label",{for:"date"},"Fecha"),u(" y "),o("label",{for:"time"},"hora")],-1)),o("div",z,[o("div",G,[n(m,{id:"date","div-class":"flex-1",type:"date",modelValue:t(e).date,"onUpdate:modelValue":r[0]||(r[0]=s=>t(e).date=s),errors:t(e).errors.date,"onUpdate:errors":r[1]||(r[1]=s=>t(e).errors.date=s),"hide-errors":"",required:""},null,8,["modelValue","errors"]),n(m,{id:"time","div-class":"flex-1",type:"time",modelValue:t(e).time,"onUpdate:modelValue":r[2]||(r[2]=s=>t(e).time=s),errors:t(e).errors.time,"onUpdate:errors":r[3]||(r[3]=s=>t(e).errors.time=s),"hide-errors":"",required:""},null,8,["modelValue","errors"])]),n(w,{errors:[t(e).errors.date,t(e).errors.time]},null,8,["errors"])]),r[15]||(r[15]=o("label",{class:"text-right",for:"topic"},"Tema",-1)),n(m,{id:"topic","div-class":"col-span-2",modelValue:t(e).topic,"onUpdate:modelValue":r[4]||(r[4]=s=>t(e).topic=s),errors:t(e).errors.topic,"onUpdate:errors":r[5]||(r[5]=s=>t(e).errors.topic=s),placeholder:"En esta visita hablamos de...",list:t(U),required:""},null,8,["modelValue","errors","list"]),r[16]||(r[16]=o("div",{class:"text-right"},[o("label",{for:"returnDate"},"Fecha"),u(" y "),o("label",{for:"returnTime"},"hora"),u(" de revisita ")],-1)),o("div",O,[o("div",H,[n(m,{id:"returnDate","div-class":"flex-1",type:"date",modelValue:t(e).returnDate,"onUpdate:modelValue":r[6]||(r[6]=s=>t(e).returnDate=s),errors:t(e).errors.returnDate,"onUpdate:errors":r[7]||(r[7]=s=>t(e).errors.returnDate=s),min:t(e).date,"hide-errors":"",required:""},null,8,["modelValue","errors","min"]),n(m,{id:"returnTime","div-class":"flex-1",type:"time",modelValue:t(e).returnTime,"onUpdate:modelValue":r[8]||(r[8]=s=>t(e).returnTime=s),errors:t(e).errors.returnTime,"onUpdate:errors":r[9]||(r[9]=s=>t(e).errors.returnTime=s),"hide-errors":"",required:""},null,8,["modelValue","errors"])]),n(w,{errors:[t(e).errors.returnDate,t(e).errors.returnTime]},null,8,["errors"])]),r[17]||(r[17]=o("label",{class:"text-right",for:"notes"},"Notas",-1)),n(L,{id:"notes","div-class":"col-span-2",class:"resize-y min-h-16 max-h-72",placeholder:"Quedé en volver para platicar sobre...",modelValue:t(e).notes,"onUpdate:modelValue":r[10]||(r[10]=s=>t(e).notes=s),errors:t(e).errors.notes,"onUpdate:errors":r[11]||(r[11]=s=>t(e).errors.notes=s)},null,8,["modelValue","errors"]),n(d,{class:"col-start-2 border underline border-asparagus-600 rounded px-2 py-1 text-asparagus-600 text-center",to:{name:"PeopleShow",params:{id:l.value}}},{default:F(()=>r[12]||(r[12]=[u(" Cancelar ")])),_:1},8,["to"]),n(E,{class:"col-start-3",color:"asparagus",type:"submit",disabled:t(g).isPending.value},{default:F(()=>r[13]||(r[13]=[u(" Guardar ")])),_:1},8,["disabled"])],32)}}});export{ee as default};
