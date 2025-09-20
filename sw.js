const CACHE_NAME = 'uni-matcher-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Les ressources des CDN et les modules JS dynamiques sont généralement mis en cache
  // lors de la première requête via la stratégie "network falling back to cache".
];

// Installe le Service Worker et met en cache l'application shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepte les requêtes réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si la ressource est dans le cache, la retourne
        if (response) {
          return response;
        }

        // Sinon, la récupère du réseau
        return fetch(event.request).then(
          networkResponse => {
            // Vérifie si la réponse est valide
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
              return networkResponse;
            }

            // Clone la réponse car elle ne peut être consommée qu'une seule fois
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});

// Supprime les anciens caches lors de l'activation d'un nouveau Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
