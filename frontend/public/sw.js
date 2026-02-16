// ============================================================
// TienditaCampus - Service Worker (PWA)
// ============================================================
// Estrategia: Cache First para assets, Network First para API
// ============================================================

const CACHE_NAME = 'tienditacampus-v1';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Instalación: cachear assets estáticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activación: limpiar caches antiguos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch: Network First para API, Cache First para assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // API calls: Network First
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Static assets: Cache First
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            return cachedResponse || fetch(request);
        })
    );
});
