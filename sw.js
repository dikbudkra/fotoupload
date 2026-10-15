const CACHE_NAME = 'pho-lapangan-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install Service Worker dan Simpan Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Aktivasi dan hapus cache lama jika ada update
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Strategi Network Falling Back to Cache (Untuk PWA iframe)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
