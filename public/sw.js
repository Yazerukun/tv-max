// TV-MAX Service Worker v4.6.0
const CACHE_NAME = 'tv-max-cache-v4.6.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip caching for video streams, embeds, iframes, APIs, and external CDNs
  if (
    request.method !== 'GET' ||
    url.pathname.endsWith('.m3u8') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.mp4') ||
    url.hostname.includes('vidsrc') ||
    url.hostname.includes('yomi') ||
    url.hostname.includes('mangafire') ||
    url.hostname.includes('reelshort') ||
    url.hostname.includes('stremio') ||
    url.hostname.includes('cinemeta') ||
    url.hostname.includes('supabase')
  ) {
    return;
  }

  // Network-first strategy with cache fallback for documents
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html') as Promise<Response>)
    );
    return;
  }

  // Cache-first for local static assets (JS, CSS, fonts, SVG)
  if (
    url.origin === location.origin &&
    (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js'))
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            if (response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
        );
      })
    );
  }
});
