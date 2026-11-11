const CACHE_NAME = 'arnof-portfolio-v33';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/foto/logo/logo.jpeg',
  '/profil.jpeg',
  '/intro-banner.jpg',
  '/intro-splash.jpg',
  '/arnof.jpg',
  '/menu/sidebar.js',
  '/menu/tabbar.js',
  '/user/beranda.js',
  '/user/projek.js',
  '/user/tentang.js',
  '/user/pendidikan.js',
  '/user/skill.js',
  '/user/pengalaman.js',
  '/user/sertifikat.js',
  '/user/learning.js',
  '/user/loogbook.js',
  '/user/galeri.js',
  '/user/pencapaian.js',
  '/user/komentar.js',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching core app shell');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[Service Worker] Asset cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Hapus semua cache lama segera
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate untuk aset statis agar buka web 0ms instan, Network First untuk HTML
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // Jangan pernah cache atau intercept halaman admin atau API Firebase
  if (event.request.url.includes('admin.html') || event.request.url.includes('firebaseio.com') || event.request.url.includes('firebasedatabase.app')) {
    return;
  }

  const isHTMLRequest = event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html');

  if (isHTMLRequest) {
    // HTML: Network First agar update cepat masuk, fallback ke cache jika jaringan lambat/offline
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Aset statis (CSS, JS, gambar, font): Cache First + Update di latar belakang (Instan 0ms)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
