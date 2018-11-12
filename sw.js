const cacheName = 'pwa-dash-v1';
const staticAssets = [
  './',
  './index.html',
  './employee_dash.html',
  './calendar.html',
  './employee/employee_alerts.html',
  './employee/view_jobs.html',
  './employee/employee_profile.html',
  './manager/job_view.html',
  './manager/make_jobs.html',
  './manager/manager_alerts.html',
  './css/dashboard.css',
  './css/calendar.css',
  './css/font-face.css',
  './css/theme.css',
  './images/FedExExpress.svg',
  './images/jeremy-jefferson-profile.jpg',
  './images/on-time-graph.png',
  './images/present-graph.png',
  './images/users.png'
];

self.addEventListener('install', async event => {
  console.log('install event');
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
  console.log('fetch event');
  const req = event.request;

  if (/.*(json)$/.test(req.url)) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(cacheFirst(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(req);
  return cachedResponse || networkFirst(req);
}

async function networkFirst(req) {
  const cache = await caches.open(cacheName);
  try { // (1)
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) { // (2)
    const cachedResponse = await cache.match(req);
    return cachedResponse;
  }
}