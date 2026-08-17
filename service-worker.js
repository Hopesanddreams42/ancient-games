// Service worker for the Seven Ancient Games hub.
// Precaches the hub page and every game so the whole collection works offline
// after the first visit. Deliberately does NOT touch any third-party network
// requests (ad scripts, affiliate/support widgets) — those must always be
// fetched live, never cached, so they stay current and consent-aware.

const CACHE_VERSION = 'ancient-games-v13';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './og-banner.png',
  './senet.html',
  './royal_game_of_ur.html',
  './ludus_latrunculorum.html',
  './hnefatafl.html',
  './oware.html',
  './nine_mens_morris.html',
  './bul.html'
];

// Domains that must NEVER be served from cache — third-party ad, consent,
// affiliate, or support-button scripts. Add to this list as you wire up
// real providers later; nothing here is cached even if it's requested.
const NEVER_CACHE_HOSTS = [
  'googlesyndication.com',
  'googletagmanager.com',
  'google-analytics.com',
  'doubleclick.net',
  'ko-fi.com',
  'amazon-adsystem.com',
  'consensu.org'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never intercept cross-origin requests to the never-cache list, or any
  // non-GET request — let those go straight to the network untouched.
  if (
    event.request.method !== 'GET' ||
    (url.origin !== self.location.origin && NEVER_CACHE_HOSTS.some((h) => url.hostname.includes(h)))
  ) {
    return;
  }

  // Only handle same-origin requests (the hub + game files); everything
  // else (ads, fonts, future third-party widgets) passes through to the
  // network normally and is never written into this cache.
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => cached);
    })
  );
});
