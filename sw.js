if(!self.define){let s,e={};const i=(i,n)=>(i=new URL(i+".js",n).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(n,r)=>{const l=s||("document"in self?document.currentScript.src:"")||location.href;if(e[l])return;let u={};const t=s=>i(s,l),o={module:{uri:l},exports:u,require:t};e[l]=Promise.all(n.map((s=>o[s]||t(s)))).then((s=>(r(...s),u)))}}define(["./workbox-5ffe50d4"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.clientsClaim(),s.precacheAndRoute([{url:"apple-touch-icon-180x180.png",revision:"dfb4f11a1d64d474b2fc9aac710f09f7"},{url:"assets/AppConfig-j2EgRDfS.js",revision:null},{url:"assets/getDateTimeForInput-B5XN4plr.js",revision:null},{url:"assets/index-BLTWodrC.css",revision:null},{url:"assets/index-C8QBmJ4_.js",revision:null},{url:"assets/index-T_QLBgn9.js",revision:null},{url:"assets/PeopleCreate-F6uEeWJ6.js",revision:null},{url:"assets/PeopleEdit-DlK6d3vM.js",revision:null},{url:"assets/PeopleShow-Bo5XM-Ru.js",revision:null},{url:"assets/ReturnVisitsCreate-bfKYNv_N.js",revision:null},{url:"assets/ReturnVisitsEdit-C1a6olcG.js",revision:null},{url:"assets/ReturnVisitsList-DnD2AFlm.js",revision:null},{url:"assets/useAsyncPerson-0eVztWn0.js",revision:null},{url:"assets/useColonies-DmnoQ_aB.js",revision:null},{url:"assets/useMutation-BQTArVSh.js",revision:null},{url:"assets/usePersonReturnVisits--llcybvA.js",revision:null},{url:"assets/useReturnVisits-Cqzu6DOn.js",revision:null},{url:"assets/VTextarea.vue_vue_type_script_setup_true_lang-BsjPrlrZ.js",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js",revision:null},{url:"favicon.ico",revision:"39c6b33cb277180bc8513ad088a30eed"},{url:"index.html",revision:"3170f7e86c88e60c1abf6fd4770adcce"},{url:"maskable-icon-512x512.png",revision:"4fc5de2488c2d0f03a83f3c21cd1485b"},{url:"pwa-192x192.png",revision:"051ddede7c6b992d3c72f5aae3d137d5"},{url:"pwa-512x512.png",revision:"adbe8154eac10cee6da33b1c91ec4a76"},{url:"pwa-64x64.png",revision:"b98ccb7ba95f4fadda8d8cb5afbd19ba"},{url:"manifest.webmanifest",revision:"02c0dfcef20aeff3d0b68ad3aa08e66d"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
