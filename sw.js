// Service Worker para Cubano Bar, Joseo Terrace y Demos (PWA)
const CACHE_NAME = 'mesas-v13';
const STATIC_ASSETS = [
  './shared.css',
  './manifest.json',
  './manifest-admin.json',
  './manifest-joseo.json',
  './manifest-joseo-admin.json',
  './icon-192.png',
  './icon-512.png',
  './icon-joseo-192.png',
  './icon-joseo-512.png',
  './logo-joseo.png',
  './terraza_cubano.png'
];

// Instalación inmediata
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activación inmediata y toma de control de todas las pestañas abiertas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Manejo de peticiones:
// Las páginas HTML, admin, boletería y llamadas a Firebase SIEMPRE van directo a la red
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Ignorar Firebase, CDNs externos o APIs
  if (url.origin !== self.origin || url.pathname.includes('/__/')) {
    return;
  }

  // Si es navegación o página HTML (o panel admin / boletería / demo), SIEMPRE de la red
  const isHtmlOrNavigate = event.request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.includes('admin') ||
    url.pathname.includes('boleteria') ||
    url.pathname.includes('demo') ||
    url.pathname === '/';

  if (isHtmlOrNavigate) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Para assets estáticos (CSS, iconos)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
