const CACHE = 'meme-dash-v2'; // Increment version to bust old cache

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(['./', './index.html', './style.css', './script.js', './manifest.json', './sw.js', './doge.svg'])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // Delete old cache versions on activation
  e.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network first, fallback to cache
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clonedResponse = response.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, clonedResponse));
        }
        return response;
      })
      .catch(() => caches.match(e.request).then((resp) => resp || caches.match('./')))
  );
});