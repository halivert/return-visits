import{d as m,B as C,m as p,o as R,H as F,w as E,h as A,a0 as S,u as g,a1 as b,a as w,p as D,r as v,E as P,c as N,b as e,e as I,f as h,F as M,j as _,a2 as W,a3 as U,g as f,s as x}from"./index-Du3eMYQp.js";import{u as B}from"./useReturnVisits-DeG6Beyg.js";import{u as y}from"./useMutation-DDNdEncJ.js";const Y=m({__name:"ExportButton",props:{color:{default:"asparagus"}},setup(c){const a=C(),o=B(),l=p(()=>new Date().toISOString()+".return-visits"),i=p(()=>{if(a.isLoading.value||o.isLoading.value)return;const T={people:a.data.value??[],returnVisits:o.data.value??[]},O=new Blob([JSON.stringify(T)],{type:"application/json"});return URL.createObjectURL(O)});return(T,O)=>(R(),F(A,{color:T.color,href:i.value,download:l.value,external:""},{default:E(()=>[S(T.$slots,"default")]),_:3},8,["color","href","download"]))}});function G(){const c=g();return y({mutationFn:async a=>{await b("people");const o=a.map(i=>w("people",i));return(await Promise.allSettled(o)).filter(i=>i.status==="fulfilled").map(i=>i.value)},onSuccess:()=>{c.invalidateQueries({queryKey:D.all()})}})}function q(){const c=g();return y({mutationFn:async a=>{await b("returnVisits");const o=a.map(i=>w("returnVisits",i));return(await Promise.allSettled(o)).filter(i=>i.status==="fulfilled").map(i=>i.value)},onSuccess:()=>{c.invalidateQueries({queryKey:v.all()})}})}const k=m({__name:"ImportButton",props:{color:{default:"lemon"}},setup(c){const a=P(),o=_(),l=G(),i=q();function T(r){return Array.isArray(r)?r.every(t=>!(!Number.isInteger(t.id)||typeof(t==null?void 0:t.name)!="string"||!(t!=null&&t.name)||typeof(t==null?void 0:t.colony)!="string"||!(t!=null&&t.colony)||(t==null?void 0:t.description)==null||t!=null&&t.location&&(typeof t.location!="object"||!Number.isFinite(t.location.latitude)||!Number.isFinite(t.location.longitude)||t.location.altitude&&!Number.isFinite(t.location.altitude)))):!1}function O(r,t){return Array.isArray(t)?t.every(n=>!(!r.includes(n.personId)||!n.date||new Date(n.date).toString()==="Invalid Date"||typeof(n==null?void 0:n.topic)!="string"||!(n!=null&&n.topic)||!n.returnDate||new Date(n.returnDate).toString()==="Invalid Date")):!1}async function H(r){if(!confirm(`¿Segura que deseas importar estos datos?
Esto sobreescribirá los datos actuales.`))return;const n=r.target.files;if(!(n!=null&&n[0])){alert("Error en importación de datos");return}try{const u=n[0],d=JSON.parse(await u.text());if(!T(d==null?void 0:d.people))throw new Error("Error en estructura de archivo");const L=d.people.map(({id:s})=>s);if(!O(L,d.returnVisits))throw new Error("Error en estructura de archivo");await l.mutateAsync(d.people.map(s=>({id:s.id,name:s.name,colony:s.colony,description:s.description,location:s.location?{latitude:s.location.latitude,longitude:s.location.longitude,altitude:s.location.altitude}:void 0}))),await i.mutateAsync(d.returnVisits.map(s=>({personId:s.personId,date:new Date(s.date),topic:s.topic,returnDate:new Date(s.returnDate),notes:s.notes}))),o.back()}catch(u){alert(u instanceof Error?u.message:"Error en la importación")}}return(r,t)=>(R(),N(M,null,[e("input",{ref_key:"fileInput",ref:a,class:"hidden",onChange:H,type:"file",accept:".return-visits,application/json"},null,544),I(A,{loading:h(i).isPending.value||h(l).isPending.value,color:r.color,onClick:t[0]||(t[0]=n=>{var u;return(u=a.value)==null?void 0:u.click()})},{default:E(()=>[S(r.$slots,"default")]),_:3},8,["loading","color"])],64))}}),z={},j={class:"text-xs w-min"};function K(c,a){return R(),N("div",j,a[0]||(a[0]=[U(`<h3 class="text-sm mb-1 font-semibold">TanStack Query</h3><pre>MIT License

Copyright (c) 2021-present Tanner Linsley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
		</pre><hr class="border-lemon-300 mb-2"><h3 class="text-sm mb-1 font-semibold">Vueuse</h3><pre>MIT License

Copyright (c) 2019-PRESENT Anthony Fu&lt;https://github.com/antfu&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
		</pre><hr class="border-lemon-300 mb-2"><h3 class="text-sm mb-1 font-semibold">Vue</h3><pre>The MIT License (MIT)

Copyright (c) 2013-present, Yuxi (Evan) You

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
		</pre><hr class="border-lemon-300 mb-2"><h3 class="text-sm mb-1 font-semibold">Vue Router</h3><pre>The MIT License (MIT)

Copyright (c) 2019-present Eduardo San Martin Morote

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
		</pre>`,11)]))}const $=W(z,[["render",K]]),Q={class:"max-w-prose mx-auto py-2 px-3 space-y-3"},V={class:"flex gap-3 justify-center"},X={class:"text-lg font-semibold underline"},J={class:"text-sm"},Z={class:"h-80 overscroll-contain overflow-y-scroll mx-auto bg-lemon-100 p-2 dark:bg-lemon-950"},nt=m({__name:"AppConfig",setup(c){return(a,o)=>{const l=x("RouterLink");return R(),N("main",Q,[e("section",V,[I(Y,null,{default:E(()=>o[0]||(o[0]=[f("Exportar datos")])),_:1}),I(k,null,{default:E(()=>o[1]||(o[1]=[f("Importar datos")])),_:1})]),e("section",null,[e("h2",X,[I(l,{to:{name:"Terms"}},{default:E(()=>o[2]||(o[2]=[f("Términos y condiciones")])),_:1})])]),o[4]||(o[4]=e("section",null,[e("h2",{class:"text-lg font-semibold"},"Contacto"),e("ul",{class:"list-disc list-inside",role:"list"},[e("li",null,[e("a",{class:"text-asparagus-500",href:"https://t.me/halivert",target:"_blank",rel:"noopener noreferrer"},[f("Telegram "),e("span",{class:"text-[#30a5d8]"},[e("svg",{class:"size-4 inline-block",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 496 512"},[e("path",{fill:"currentColor",d:"M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z"})])])])]),e("li",null,[e("a",{class:"text-asparagus-500",href:"https://github.com/halivert/return-visits",target:"_blank",rel:"noopener noreferrer"},[f("Código fuente "),e("span",{class:"text-[#010409] dark:text-white"},[e("svg",{class:"size-4 inline-block",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 496 512"},[e("path",{fill:"currentColor",d:"M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"})])])])])])],-1)),e("details",J,[o[3]||(o[3]=e("summary",{class:"text-base font-semibold"}," Licencias de código abierto ",-1)),e("section",Z,[I($)])])])}}});export{nt as default};
