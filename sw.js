// Cambia este número cada vez que actualices la web, para que se refresque en su teléfono
const CACHE = 'rumbo-cali-v2';
const ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Muestra lo guardado al instante y actualiza en segundo plano
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(e.request, { ignoreSearch: true }).then(function (cached) {
        var net = fetch(e.request).then(function (res) {
          if (res && (res.status === 200 || res.type === 'opaque')) cache.put(e.request, res.clone());
          return res;
        }).catch(function () { return cached; });
        return cached || net;
      });
    })
  );
});
