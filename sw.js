var CACHE = 'reclaim-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) { return r || fetch(e.request).then(function(res) { var c = caches.open(CACHE); c.then(function(cache) { cache.put(e.request, res.clone()); }); return res; }); })
  );
});

self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'show-notification') {
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      icon: e.data.icon || 'https://emojicdn.elk.sh/%F0%9F%8C%B1',
      tag: e.data.tag || 'reclaim',
      vibrate: [200, 100, 200]
    });
  }
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.matchAll({type: 'window'}).then(function(cls) {
    if (cls.length) { cls[0].focus(); return; }
    clients.openWindow('/reclaim-app/');
  }));
});
