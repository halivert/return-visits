import{u as S,x as D,r as F,i as x,a as E,d as L,b as y,e as o,f as a,k as l,w as I,v as C,n as d,t as i,g as c,F as N,h as Q,y as $,z as B,l as M,m as z,B as P,o as n}from"./index-B5qpgIxp.js";import{u as A}from"./useMutation-B7kydQLG.js";import{u as K}from"./usePersonReturnVisits-DL40Iu_7.js";import{g as q,a as U}from"./getDateTimeForInput-BOWwtIe8.js";function j({personId:b}){const m=S();return A({mutationFn:D(()=>async s=>{var v;const u={personId:x(b),date:s.date,returnDate:s.returnDate,topic:s.topic.trim(),notes:(v=s.notes)==null?void 0:v.trim()};return await E("returnVisits",u),u}),onSuccess:s=>{m.invalidateQueries({queryKey:F.list(s.personId)}),m.setQueryData(F.detail(s.personId,s.date),s)}})}const G={class:"col-span-2"},O={class:"flex flex-wrap gap-2"},H=["value"],J={key:0,class:"text-chili-600"},W={key:0},X={class:"col-span-2"},Y={key:0,class:"text-chili-600"},Z={id:"topicDataList"},ee={class:"col-span-2"},te={class:"flex flex-wrap gap-2"},ae=["min"],re=["value"],se={key:0,class:"text-chili-600"},oe={key:0},ne={class:"col-span-2"},le={key:0,class:"text-chili-600"},ie=["disabled"],me=L({__name:"ReturnVisitsCreate",props:{id:{}},setup(b){const m=z(),s=b,u=D(()=>s.id),v=K({personId:u}),w=j({personId:u}),e=y({}),R=D(()=>{var p;return new Set((p=v.data.value)==null?void 0:p.map(({topic:t})=>t))}),h=new Date,g=y(q(h)),k=y(q(new Date(h.getTime()+7*24*60*60*1e3))),T=U(h);async function V(p){const t=Object.fromEntries(new FormData(p.target));t.date||(e.value={...e.value,date:"Falta fecha"}),t.time||(e.value={...e.value,time:"Falta hora"}),t.topic||(e.value={...e.value,topic:"Falta tema"}),t.returnDate||(e.value={...e.value,returnDate:"Falta fecha de revisita"}),t.returnTime||(e.value={...e.value,returnTime:"Falta hora de revisita"});const f=new Date(t.date+"T"+t.time),r=new Date(t.returnDate+"T"+t.returnTime);f.getTime()>r.getTime()&&(e.value={...e.value,returnDate:"Fecha de revisita tiene que ser posterior a fecha de visita"});try{await w.mutateAsync({date:f,topic:t.topic,returnDate:r,notes:t.notes}),m.back()}catch(_){e.value={...e.value,time:_ instanceof Error?_.message:"Error desconocido"}}}return(p,t)=>{const f=P("RouterLink");return n(),o("form",{class:"grid grid-cols-3 gap-2 gap-y-3",onSubmit:M(V,["prevent"])},[t[8]||(t[8]=a("div",{class:"text-right"},[a("label",{for:"date"},"Fecha"),l(" y "),a("label",{for:"time"},"hora")],-1)),a("div",G,[a("div",O,[I(a("input",{id:"date",class:d(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","h-8 flex-1",e.value.date?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),type:"date",name:"date","onUpdate:modelValue":t[0]||(t[0]=r=>g.value=r),onInput:t[1]||(t[1]=r=>e.value.date=""),required:""},null,34),[[C,g.value]]),a("input",{id:"time",class:d(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","h-8 flex-1",e.value.time?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),type:"time",name:"time",value:x(T),onInput:t[2]||(t[2]=r=>e.value.time=""),required:""},null,42,H)]),e.value.date||e.value.time?(n(),o("small",J,[l(i(e.value.date)+" ",1),e.value.date&&e.value.time?(n(),o("br",W)):c("",!0),l(" "+i(e.value.time),1)])):c("",!0)]),t[9]||(t[9]=a("label",{class:"text-right",for:"topic"},"Tema",-1)),a("div",X,[a("input",{id:"topic",class:d(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","h-8 w-full",e.value.topic?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),type:"string",name:"topic",onInput:t[3]||(t[3]=r=>e.value.topic=""),placeholder:"En esta visita hablamos de...",list:"topicDataList",required:""},null,34),e.value.topic?(n(),o("small",Y,i(e.value.topic),1)):c("",!0),a("datalist",Z,[(n(!0),o(N,null,Q(R.value,r=>(n(),o("option",{key:r},i(r),1))),128))])]),t[10]||(t[10]=a("div",{class:"text-right"},[a("label",{for:"returnDate"},"Fecha"),l(" y "),a("label",{for:"returnTime"},"hora"),l(" de revisita ")],-1)),a("div",ee,[a("div",te,[I(a("input",{id:"returnDate",class:d(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","h-8 flex-1",e.value.returnDate?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),type:"date",name:"returnDate","onUpdate:modelValue":t[4]||(t[4]=r=>k.value=r),min:g.value,onChange:t[5]||(t[5]=r=>e.value.returnDate=""),required:""},null,42,ae),[[C,k.value]]),a("input",{id:"returnTime",class:d(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","h-8 flex-1",e.value.returnTime?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),type:"time",name:"returnTime",value:x(T),onInput:t[6]||(t[6]=r=>e.value.returnTime=""),required:""},null,42,re)]),e.value.returnDate||e.value.returnTime?(n(),o("small",se,[l(i(e.value.returnDate)+" ",1),e.value.returnDate&&e.value.returnTime?(n(),o("br",oe)):c("",!0),l(" "+i(e.value.returnTime),1)])):c("",!0)]),t[11]||(t[11]=a("label",{class:"text-right",for:"notes"},"Notas",-1)),a("div",ne,[a("textarea",{id:"notes",class:d(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","resize-y min-h-16 max-h-72 w-full",e.value.notes?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),name:"notes",placeholder:"Quedé en volver para platicar sobre...",rows:"10",maxlength:"500"},null,2),e.value.notes?(n(),o("small",le,i(e.value.notes),1)):c("",!0)]),$(f,{class:"col-start-2 border underline border-asparagus-600 rounded px-2 py-1 text-asparagus-600 text-center",to:{name:"PeopleShow",params:{id:u.value}}},{default:B(()=>t[7]||(t[7]=[l(" Cancelar ")])),_:1},8,["to"]),a("button",{class:"col-start-3 bg-asparagus-600 rounded px-2 py-1 text-lemon-50",type:"submit",disabled:x(w).isPending.value}," Guardar ",8,ie)],32)}}});export{me as default};
