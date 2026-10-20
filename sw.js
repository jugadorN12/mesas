// Service Worker para Cubano Bar (PWA)
const CACHE_NAME = 'cubanobar-v2';
const STATIC_ASSETS = [
  './shared.css',
  './manifest.json',
  './manifest-admin.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalación: Guardar recursos estáticos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activación: Limpiar versiones viejas de caché
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Peticiones: Network-First para asegurar que las reservas y datos en vivo siempre estén actualizados
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET o que vayan a Firebase / APIs externas
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  
  if (url.origin !== self.origin || url.pathname.includes('/__/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si la red responde bien, actualizamos la caché de recursos estáticos
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Si no hay internet, intentamos responder desde la caché
        return caches.match(event.request);
      })
  );
});
