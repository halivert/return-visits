if(!self.define){let s,e={};const i=(i,n)=>(i=new URL(i+".js",n).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(n,l)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let u={};const t=s=>i(s,r),o={module:{uri:r},exports:u,require:t};e[r]=Promise.all(n.map((s=>o[s]||t(s)))).then((s=>(l(...s),u)))}}define(["./workbox-5ffe50d4"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.clientsClaim(),s.precacheAndRoute([{url:"apple-touch-icon-180x180.png",revision:"dfb4f11a1d64d474b2fc9aac710f09f7"},{url:"assets/getDateTimeForInput-BOWwtIe8.js",revision:null},{url:"assets/index-DuX6IK19.js",revision:null},{url:"assets/index-T52F6kOd.js",revision:null},{url:"assets/index-v7Qw6R7x.css",revision:null},{url:"assets/PeopleCreate-CqC-TV_l.js",revision:null},{url:"assets/PeopleEdit-BaQ1f1tw.js",revision:null},{url:"assets/PeopleShow-ClVHRNuE.js",revision:null},{url:"assets/ReturnVisitsCreate-DdTpUwjR.js",revision:null},{url:"assets/ReturnVisitsEdit-D73Xsy1k.js",revision:null},{url:"assets/ReturnVisitsList-Bwk5uUJ3.js",revision:null},{url:"assets/useAsyncPerson-N21pRBcq.js",revision:null},{url:"assets/useAvailableTopics--6djl2yI.js",revision:null},{url:"assets/useColonies-CqDZQFZR.js",revision:null},{url:"assets/useMutation-fCztBfGf.js",revision:null},{url:"assets/usePersonReturnVisits-BTQpl9CO.js",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js",revision:null},{url:"favicon.ico",revision:"39c6b33cb277180bc8513ad088a30eed"},{url:"index.html",revision:"f93acfdcc893f19819d32830acdbfa51"},{url:"maskable-icon-512x512.png",revision:"4fc5de2488c2d0f03a83f3c21cd1485b"},{url:"pwa-192x192.png",revision:"051ddede7c6b992d3c72f5aae3d137d5"},{url:"pwa-512x512.png",revision:"adbe8154eac10cee6da33b1c91ec4a76"},{url:"pwa-64x64.png",revision:"b98ccb7ba95f4fadda8d8cb5afbd19ba"},{url:"manifest.webmanifest",revision:"02c0dfcef20aeff3d0b68ad3aa08e66d"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
