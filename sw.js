var CACHE='sgd-thb-v5';
var FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(FILES.map(function(f){
      return fetch(f,{cache:'reload'}).then(function(r){return c.put(f,r)});
    }));
  }));
  self.skipWaiting();
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  e.respondWith(
    fetch(req.url,{cache:'no-cache'}).then(function(r){
      if(r&&r.ok){var copy=r.clone();caches.open(CACHE).then(function(c){c.put(req,copy)})}
      return r;
    }).catch(function(){
      return caches.match(req).then(function(m){return m||caches.match('index.html')});
    })
  );
});
