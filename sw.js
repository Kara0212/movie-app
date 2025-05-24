// sw.js

const CACHE_NAME = 'movieapp-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/login.html',
    '/search.html',
    '/style.css',
    '/script.js',
    '/auth.js',
    '/omdb.js',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

// Instalacja - cache'ujemy pliki
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Aktywacja - czyszczenie starego cache
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

// Fetch - obs³uga ¿¹dañ (cache-first)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            // fallback dla trybu offline
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        })
    );
});
