import{u as o}from"./useReturnVisits-BBX5RBm0.js";import{k as a,f as u}from"./index-D6IdYIOx.js";function p({personId:t}={}){const i=o();return a(()=>{var n,e;return new Set((e=(n=i.data.value)==null?void 0:n.filter(r=>u(t)==null?!0:r.personId===u(t)))==null?void 0:e.map(({topic:r})=>r))})}function f(t){return t?[t.getFullYear(),(t.getMonth()+1).toString().padStart(2,"0"),t.getDate().toString().padStart(2,"0")].join("-"):""}function S(t){return t?[t.getHours().toString().padStart(2,"0"),t.getMinutes().toString().padStart(2,"0")].join(":"):""}export{S as a,f as g,p as u};
