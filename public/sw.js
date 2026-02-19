const CACHE_NAME = 'upglow-v3';
const urlsToCache = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/logo.svg',
  '/icon.svg',
  '/apple-icon.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache).catch((error) => {
          console.error('Failed to cache resources:', error);
        });
      })
  );
  self.skipWaiting();
});

// Fetch event - Network first for HTML, cache first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!request.url.startsWith('http')) {
    return;
  }

// Network first for HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          // Return offline page if available
          return caches.match('/offline.html')
            .then((offlineResponse) => {
              if (offlineResponse) {
                return offlineResponse;
              }
              return caches.match(request);
            });
        })
    );
    return;
  }

  // Cache first for static assets
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(request).then((response) => {
          // Only cache successful responses
          if (!response || response.status !== 200) {
            return response;
          }

          // Only cache GET requests
          if (request.method !== 'GET') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
            })
            .catch((error) => {
              console.error('Failed to cache:', error);
            });

          return response;
        });
      })
      .catch((error) => {
        console.error('Fetch failed:', error);
        throw error;
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

