import{u as N,k as _,p as S,E as G,g as v,C as R,d as O,j as $,H,i as I,r as L,c as i,F as h,b as o,t as x,x as P,y as C,n as g,e as w,f as J,l as E,m as W,q as X,w as Y,h as Z,v as ee,o as r}from"./index-DMjtAVTl.js";import{u as ae}from"./index-Kia6NWE0.js";import{u as U,a as D}from"./useAsyncPerson-ByhD_Tlu.js";import{u as te}from"./useColonies-BdvGVhfc.js";import{u as Q}from"./useMutation-DPviKlMa.js";import{u as oe}from"./usePersonReturnVisits-Do4PO4mN.js";import{r as ne}from"./returnVisitsKeys-BjL7tDZc.js";function le({id:u}){const c=N(),{data:n}=U({id:u});return Q({mutationFn:_(()=>async s=>{if(!n.value)return Promise.reject(new Error("Original no encontrado"));const y={id:n.value.id,name:n.value.name,colony:n.value.colony,description:n.value.description,location:n.value.location?{latitude:n.value.location.latitude,longitude:n.value.location.longitude,altitude:n.value.location.altitude}:void 0,...s},m=await G("people",v(u),y);return{...y,id:m}}),onSuccess:s=>{c.invalidateQueries({queryKey:S.all()}),c.setQueryData(S.detail(s.id),s)}})}function se({id:u}){const c=N(),{data:n}=oe({personId:u});return Q({mutationFn:_(()=>async()=>{var y;await R("people",v(u));const s=((y=n.value)==null?void 0:y.map(m=>R("returnVisits",[v(u),m.date])))??[];await Promise.allSettled(s)}),onSuccess:()=>{c.invalidateQueries({queryKey:S.all()}),c.invalidateQueries({queryKey:ne.all()})}})}const ie={class:"max-w-prose mx-auto py-2 px-3"},re={key:0,class:"text-3xl font-bold text-center"},ue={class:"text-3xl font-bold mb-4"},ce={class:"col-span-2"},de=["placeholder"],pe={key:0,class:"text-chili-600"},me={class:"col-span-2"},ye=["placeholder"],ve={key:0,class:"text-chili-600"},fe={id:"colonyList"},be={class:"col-start-2 col-span-2"},xe={class:"flex gap-2"},ge=["disabled"],he=["disabled"],we={key:0,class:"text-chili-600 whitespace-pre"},_e={class:"col-span-2"},ke=["placeholder"],Pe=["disabled"],Ce={async beforeRouteEnter(u,c,n){try{await D({id:parseInt(u.params.id,10)}),n()}catch{n({name:"NotFound"})}}},Le=O({...Ce,__name:"PeopleEdit",props:{id:{}},setup(u){var V,q,F;const c=Z(),n=te(),s=ae({immediate:!1});$(t=>{D({id:parseInt(t.params.id,10)}).catch(()=>{c.replace({name:"NotFound"})})});const y=u,m=_(()=>y.id),z=U({id:m}),d=_(()=>z.data.value),b=le({id:m}),K=se({id:m}),l=H({name:((V=d.value)==null?void 0:V.name)??"",colony:((q=d.value)==null?void 0:q.colony)??"",description:((F=d.value)==null?void 0:F.description)??""});I(d,t=>{t&&(l.name=t.name,l.colony=t.colony,l.description=t.description)});const a=L({}),f=L(!1);async function k(t){if(!b.isPending.value&&!Object.values(a.value).some(e=>e))try{if(await b.mutateAsync("location"in t?{location:t.location}:{name:t.name,colony:t.colony,description:t.description}),!("location"in t))return c.push({name:"PeopleShow",params:{id:m.value}});f.value=!0,setTimeout(()=>{f.value=!1},2e3)}catch(e){console.info(e),alert(`Error guardando los datos
Por favor intenta de nuevo`)}}function A(){l.name||(a.value={...a.value,name:"Falta nombre"}),l.colony||(a.value={...a.value,colony:"Falta colonia"}),k(l)}function B(){s.resume(),I([s.coords,s.error],async([t,e])=>{if(e){a.value={...a.value,location:`Error actualizando la ubicación.
Revisa que la aplicación tenga los permisos necesarios.`};return}a.value={...a.value,location:""},k({location:{latitude:t.latitude,longitude:t.longitude,altitude:t.altitude}})},{once:!0})}function M(){k({location:void 0})}async function j(){if(confirm("¿Segura que deseas eliminar a esta persona?"))try{await K.mutateAsync(),c.go(-2)}catch(e){console.info(e)}}return(t,e)=>{const T=ee("RouterLink");return r(),i("main",ie,[d.value?(r(),i(h,{key:1},[o("h1",ue,"Editar persona: "+x(d.value.name),1),o("form",{class:"grid grid-cols-3 gap-2 gap-y-3",onSubmit:Y(A,["prevent"])},[e[6]||(e[6]=o("label",{class:"text-right",for:"name"},"Nombre",-1)),o("div",ce,[P(o("input",{id:"name",class:g(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","h-8 w-full",a.value.name?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),type:"text",name:"name","onUpdate:modelValue":e[0]||(e[0]=p=>l.name=p),onInput:e[1]||(e[1]=p=>a.value.name=""),placeholder:d.value.name,required:""},null,42,de),[[C,l.name]]),a.value.name?(r(),i("small",pe,x(a.value.name),1)):w("",!0)]),e[7]||(e[7]=o("label",{class:"text-right",for:"colony"},"Colonia",-1)),o("div",me,[P(o("input",{id:"colony",class:g(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","h-8 w-full",a.value.colony?"border-chili-400 accent-chili-600":"border-asparagus-100 accent-asparagus-600"]),type:"text",name:"colony",list:"colonyList","onUpdate:modelValue":e[2]||(e[2]=p=>l.colony=p),onInput:e[3]||(e[3]=p=>a.value.colony=""),placeholder:d.value.colony,required:""},null,42,ye),[[C,l.colony]]),a.value.colony?(r(),i("small",ve,x(a.value.colony),1)):w("",!0),o("datalist",fe,[(r(!0),i(h,null,J(v(n),p=>(r(),i("option",{key:p},x(p),1))),128))])]),o("div",be,[o("div",xe,[o("button",{class:g(["flex-1 px-2 py-1 rounded","disabled:cursor-not-allowed disabled:grayscale",a.value.location?"bg-chili-600 text-chili-50":"bg-lemon-500"]),type:"button",onClick:B,disabled:v(b).isPending.value||f.value},[f.value?(r(),i(h,{key:0},[E(" Ubicación actualizada ")],64)):(r(),i(h,{key:1},[E("Actualizar ubicación")],64))],10,ge),d.value.location&&!f.value?(r(),i("button",{key:0,class:g(["flex-1 px-2 py-1 rounded text-fawn-50","bg-fawn-600 disabled:cursor-not-allowed disabled:grayscale"]),type:"button",onClick:M,disabled:v(b).isPending.value||f.value}," Eliminar ubicación ",8,he)):w("",!0)]),a.value.location?(r(),i("small",we,x(a.value.location),1)):w("",!0)]),e[8]||(e[8]=o("label",{class:"text-right",for:"description"},"Descripción",-1)),o("div",_e,[P(o("textarea",{id:"description",class:g(["block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border","resize-y min-h-16 max-h-72 w-full"]),rows:"8",name:"description","onUpdate:modelValue":e[4]||(e[4]=p=>l.description=p),placeholder:d.value.description,maxlength:"250"},null,8,ke),[[C,l.description]])]),W(T,{class:"col-start-2 border underline border-asparagus-600 rounded px-2 py-1 text-asparagus-600 text-center",to:{name:"PeopleShow",params:{id:m.value}}},{default:X(()=>e[5]||(e[5]=[E(" Cancelar ")])),_:1},8,["to"]),o("button",{class:"col-start-3 bg-asparagus-600 rounded px-2 py-1 text-lemon-50 disabled:cursor-not-allowed disabled:grayscale",type:"submit",disabled:v(b).isPending.value}," Guardar ",8,Pe),o("button",{class:"col-start-2 bg-fawn-600 rounded px-2 py-1 text-fawn-50 text-center",onClick:j,type:"button"}," Eliminar ")],32)],64)):(r(),i("h1",re,"Error"))])}}});export{Le as default};
