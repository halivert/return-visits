if(!self.define){let s,e={};const i=(i,n)=>(i=new URL(i+".js",n).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(n,l)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let o={};const t=s=>i(s,r),u={module:{uri:r},exports:o,require:t};e[r]=Promise.all(n.map((s=>u[s]||t(s)))).then((s=>(l(...s),o)))}}define(["./workbox-5ffe50d4"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.clientsClaim(),s.precacheAndRoute([{url:"apple-touch-icon-180x180.png",revision:"dfb4f11a1d64d474b2fc9aac710f09f7"},{url:"assets/getDateTimeForInput-BOWwtIe8.js",revision:null},{url:"assets/index-2urXqW4y.js",revision:null},{url:"assets/index-BzlAtdqQ.js",revision:null},{url:"assets/index-C4LZsWjt.css",revision:null},{url:"assets/PeopleCreate-CIMv4flG.js",revision:null},{url:"assets/PeopleEdit-5LIk3w9r.js",revision:null},{url:"assets/PeopleShow-oSohHZGL.js",revision:null},{url:"assets/ReturnVisitsCreate-DJSltq7G.js",revision:null},{url:"assets/ReturnVisitsEdit-BGDllEXD.js",revision:null},{url:"assets/ReturnVisitsList-C8aUWuXE.js",revision:null},{url:"assets/useAsyncPerson-CKSnThlb.js",revision:null},{url:"assets/useAvailableTopics-CSAzX7J1.js",revision:null},{url:"assets/useColonies-BhmOh_xi.js",revision:null},{url:"assets/useMutation-Ca4hD85O.js",revision:null},{url:"assets/usePersonReturnVisits-03yIQ2au.js",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js",revision:null},{url:"favicon.ico",revision:"39c6b33cb277180bc8513ad088a30eed"},{url:"index.html",revision:"c73bacd32bc5af9d46bbf023a4f46bce"},{url:"maskable-icon-512x512.png",revision:"4fc5de2488c2d0f03a83f3c21cd1485b"},{url:"pwa-192x192.png",revision:"051ddede7c6b992d3c72f5aae3d137d5"},{url:"pwa-512x512.png",revision:"adbe8154eac10cee6da33b1c91ec4a76"},{url:"pwa-64x64.png",revision:"b98ccb7ba95f4fadda8d8cb5afbd19ba"},{url:"manifest.webmanifest",revision:"02c0dfcef20aeff3d0b68ad3aa08e66d"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
