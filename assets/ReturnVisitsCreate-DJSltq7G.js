import{u as S,x as D,r as F,i as x,a as L,d as N,b as y,e as o,f as a,k as i,w as I,v as C,n as d,t as l,g as c,F as $,h as B,y as E,z as M,l as Q,m as z,B as P,o as n}from"./index-BzlAtdqQ.js";import{u as A}from"./useMutation-Ca4hD85O.js";import{u as K}from"./usePersonReturnVisits-03yIQ2au.js";import{g as q,a as U}from"./getDateTimeForInput-BOWwtIe8.js";function j({personId:b}){const p=S();return A({mutationFn:D(()=>async s=>{var v;const u={personId:x(b),date:s.date,returnDate:s.returnDate,topic:s.topic.trim(),notes:(v=s.notes)==null?void 0:v.trim()};return await L("returnVisits",u),u}),onSuccess:s=>{p.invalidateQueries({queryKey:F.list(s.personId)}),p.setQueryData(F.detail(s.personId,s.date),s)}})}const G={class:"col-span-2"},O={class:"flex flex-wrap gap-2"},H=["value"],J={key:0,class:"text-chili-600"},W={key:0},X={class:"col-span-2"},Y={key:0,class:"text-chili-600"},Z={id:"topicDataList"},ee={class:"col-span-2"},te={class:"flex flex-wrap gap-2"},ae=["min"],re=["value"],se={key:0,class:"text-chili-600"},oe={key:0},ne={class:"col-span-2"},ie={key:0,class:"text-chili-600"},le=["disabled"],pe=N({__name:"ReturnVisitsCreate",props:{id:{}},setup(b){const p=z(),s=b,u=D(()=>s.id),v=K({personId:u}),w=j({personId:u}),e=y({}),R=D(()=>{var m;return new Set((m=v.data.value)==null?void 0:m.map(({topic:t})=>t))}),g=new Date,h=y(q(g)),k=y(q(new Date(g.getTime()+7*24*60*60*1e3))),T=U(g);async function V(m){const t=Object.fromEntries(new FormData(m.target));t.date||(e.value={...e.value,date:"Falta fecha"}),t.time||(e.value={...e.value,time:"Falta hora"}),t.topic||(e.value={...e.value,topic:"Falta tema"}),t.returnDate||(e.value={...e.value,returnDate:"Falta fecha de revisita"}),t.returnTime||(e.value={...e.value,returnTime:"Falta hora de revisita"});const f=new Date(t.date+"T"+t.time),r=new Date(t.returnDate+"T"+t.returnTime);f.getTime()>r.getTime()&&(e.value={...e.value,returnDate:"Fecha de revisita tiene que ser posterior a fecha de visita"});try{await w.mutateAsync({date:f,topic:t.topic,returnDate:r,notes:t.notes}),p.back()}catch(_){e.value={...e.value,time:_ instanceof Error?_.message:"Error desconocido"}}}return(m,t)=>{const f=P("RouterLink");return n(),o("form",{class:"grid grid-cols-3 gap-2 gap-y-3",onSubmit:Q(V,["prevent"])},[t[8]||(t[8]=a("div",{class:"text-right"},[a("label",{for:"date"},"Fecha"),i(" y "),a("label",{for:"time"},"hora")],-1)),a("div",G,[a("div",O,[I(a("input",{id:"date",class:d(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","h-8 flex-1",e.value.date?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),type:"date",name:"date","onUpdate:modelValue":t[0]||(t[0]=r=>h.value=r),onInput:t[1]||(t[1]=r=>e.value.date=""),required:""},null,34),[[C,h.value]]),a("input",{id:"time",class:d(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","h-8 flex-1",e.value.time?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),type:"time",name:"time",value:x(T),onInput:t[2]||(t[2]=r=>e.value.time=""),required:""},null,42,H)]),e.value.date||e.value.time?(n(),o("small",J,[i(l(e.value.date)+" ",1),e.value.date&&e.value.time?(n(),o("br",W)):c("",!0),i(" "+l(e.value.time),1)])):c("",!0)]),t[9]||(t[9]=a("label",{class:"text-right",for:"topic"},"Tema",-1)),a("div",X,[a("input",{id:"topic",class:d(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","h-8 w-full",e.value.topic?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),type:"string",name:"topic",onInput:t[3]||(t[3]=r=>e.value.topic=""),list:"topicDataList",required:""},null,34),e.value.topic?(n(),o("small",Y,l(e.value.topic),1)):c("",!0),a("datalist",Z,[(n(!0),o($,null,B(R.value,r=>(n(),o("option",{key:r},l(r),1))),128))])]),t[10]||(t[10]=a("div",{class:"text-right"},[a("label",{for:"returnDate"},"Fecha"),i(" y "),a("label",{for:"returnTime"},"hora"),i(" de revisita ")],-1)),a("div",ee,[a("div",te,[I(a("input",{id:"returnDate",class:d(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","h-8 flex-1",e.value.returnDate?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),type:"date",name:"returnDate","onUpdate:modelValue":t[4]||(t[4]=r=>k.value=r),min:h.value,onChange:t[5]||(t[5]=r=>e.value.returnDate=""),required:""},null,42,ae),[[C,k.value]]),a("input",{id:"returnTime",class:d(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","h-8 flex-1",e.value.returnTime?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),type:"time",name:"returnTime",value:x(T),onInput:t[6]||(t[6]=r=>e.value.returnTime=""),required:""},null,42,re)]),e.value.returnDate||e.value.returnTime?(n(),o("small",se,[i(l(e.value.returnDate)+" ",1),e.value.returnDate&&e.value.returnTime?(n(),o("br",oe)):c("",!0),i(" "+l(e.value.returnTime),1)])):c("",!0)]),t[11]||(t[11]=a("label",{class:"text-right",for:"notes"},"Notas",-1)),a("div",ne,[a("textarea",{id:"notes",class:d(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","resize-y min-h-16 max-h-72 w-full",e.value.notes?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),name:"notes",rows:"10",maxlength:"500"},null,2),e.value.notes?(n(),o("small",ie,l(e.value.notes),1)):c("",!0)]),E(f,{class:"col-start-2 border underline border-asparagus-600 rounded px-2 py-1 text-asparagus-600 text-center",to:{name:"PeopleShow",params:{id:u.value}}},{default:M(()=>t[7]||(t[7]=[i(" Cancelar ")])),_:1},8,["to"]),a("button",{class:"col-start-3 bg-asparagus-600 rounded px-2 py-1 text-lemon-50",type:"submit",disabled:x(w).isPending.value}," Guardar ",8,le)],32)}}});export{pe as default};
