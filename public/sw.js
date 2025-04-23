const CACHE_NAME = 'eczema-dashboard-v1';

const urlsToCache = [
  '/',
  '/diagnoses',
  '/styles/globals.css',
  '/manifest.json',
  '/offline.html', // ✅ offline fallback file
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // optional: activate SW immediately
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim(); // optional: take control of all open pages
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request)
          .then((networkResponse) => {
            // Cache the new response
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // 👇 Return offline page if nothing works
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          })
      );
    })
  );
});
