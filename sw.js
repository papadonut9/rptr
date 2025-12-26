const CACHE_NAME = 'job-status-v1';
const assets = ['/', '/index.html', '/style.css', '/app.js'];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(res => res || fetch(event.request)));
});
