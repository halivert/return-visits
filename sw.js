if(!self.define){let s,e={};const i=(i,n)=>(i=new URL(i+".js",n).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(n,r)=>{const l=s||("document"in self?document.currentScript.src:"")||location.href;if(e[l])return;let o={};const t=s=>i(s,l),u={module:{uri:l},exports:o,require:t};e[l]=Promise.all(n.map((s=>u[s]||t(s)))).then((s=>(r(...s),o)))}}define(["./workbox-5ffe50d4"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.clientsClaim(),s.precacheAndRoute([{url:"apple-touch-icon-180x180.png",revision:"dfb4f11a1d64d474b2fc9aac710f09f7"},{url:"assets/index-CUzv3Wcz.css",revision:null},{url:"assets/index-DMjtAVTl.js",revision:null},{url:"assets/index-Kia6NWE0.js",revision:null},{url:"assets/PeopleCreate-CwU92x5W.js",revision:null},{url:"assets/PeopleEdit-hNANVuHh.js",revision:null},{url:"assets/PeopleShow-B66JQ_VO.js",revision:null},{url:"assets/ReturnVisitsCreate-Be-aDxbo.js",revision:null},{url:"assets/ReturnVisitsEdit-DBBGiZH5.js",revision:null},{url:"assets/returnVisitsKeys-BjL7tDZc.js",revision:null},{url:"assets/ReturnVisitsList-CgK4klCP.js",revision:null},{url:"assets/useAsyncPerson-ByhD_Tlu.js",revision:null},{url:"assets/useColonies-BdvGVhfc.js",revision:null},{url:"assets/useMutation-DPviKlMa.js",revision:null},{url:"assets/usePersonReturnVisits-Do4PO4mN.js",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js",revision:null},{url:"favicon.ico",revision:"39c6b33cb277180bc8513ad088a30eed"},{url:"index.html",revision:"55cee7b3dde3992e7ca70748b4f9ac15"},{url:"maskable-icon-512x512.png",revision:"4fc5de2488c2d0f03a83f3c21cd1485b"},{url:"pwa-192x192.png",revision:"051ddede7c6b992d3c72f5aae3d137d5"},{url:"pwa-512x512.png",revision:"adbe8154eac10cee6da33b1c91ec4a76"},{url:"pwa-64x64.png",revision:"b98ccb7ba95f4fadda8d8cb5afbd19ba"},{url:"manifest.webmanifest",revision:"d839615c4ac368c874a177fdd64e4bb3"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
