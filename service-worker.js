const CACHE = 'matematica-irene-v6';

const ASSETS = [
  './',
  './index.html',
  './insiemi-numerici.html',
  './insiemi-numerici-allenamento.html',
  './insiemi-numerici-overview.mp3',
  './insiemi-numerici-infografica.png',
  './divisibilita.html',
  './divisibilita-allenamento.html',
  './divisibilita-overview.mp3',
  './divisibilita-infografica.png',
  './frazioni.html',
  './frazioni-allenamento.html',
  './frazioni-overview.mp3',
  './frazioni-infografica.png',
  './monomi.html',
  './monomi-allenamento.html',
  './monomi-overview.mp3',
  './monomi-infografica.png',
  './style.css',
  './app.js',
  './alert.js',
  './lightbox.js',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './icon-192.svg',
  './icon-512.svg',
];

// Installazione: pre-carica tutte le pagine locali
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Attivazione: elimina le cache vecchie
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first per i font Google, network-first per le pagine HTML,
// stale-while-revalidate per il resto.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Font Google: cache-first (raramente cambiano)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          const network = fetch(e.request).then(res => {
            cache.put(e.request, res.clone());
            return res;
          });
          return cached || network;
        })
      )
    );
    return;
  }

  // Pagine HTML: network-first → prende sempre l'ultima versione se online,
  // ricade sulla cache solo offline. Evita di servire codice vecchio.
  const isHTML = e.request.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/");
  if (url.origin === self.location.origin && isHTML) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        fetch(e.request).then(res => {
          cache.put(e.request, res.clone());
          return res;
        }).catch(() => cache.match(e.request))
      )
    );
    return;
  }

  // Altre risorse locali (immagini, css, js): stale-while-revalidate
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          const network = fetch(e.request).then(res => {
            cache.put(e.request, res.clone());
            return res;
          }).catch(() => {});
          return cached || network;
        })
      )
    );
  }
});
