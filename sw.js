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
    self.skipWaiting(); // natychmiastowa aktywacja
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return Promise.all(
                    urlsToCache.map(url => {
                        return fetch(url)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Błąd przy pobieraniu ${url}: ${response.statusText}`);
                                }
                                return cache.put(url, response.clone());
                            })
                            .catch(err => {
                                console.error(`Nie udało się zcache'ować ${url}:`, err);
                            });
                    })
                );
            })
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
    self.clients.claim(); // natychmiastowe przejęcie kontroli nad stroną
});

// Fetch - obsługa żądań (cache-first)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        })
    );
});
