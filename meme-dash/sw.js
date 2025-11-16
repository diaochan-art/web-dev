const CACHE = 'meme-dash-v1';
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(['/', '/index.html', '/style.css', '/script.js', '/manifest.json']))); self.skipWaiting(); });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(resp => resp || fetch(e.request))); });