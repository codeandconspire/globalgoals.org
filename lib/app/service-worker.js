/**
 * Install and cache latest versions of application
 */

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(process.env.npm_package_version).then(cache => {
      if (process.env.NODE_ENV === 'development') {
        return self.skipWaiting();
      }

      return cache.addAll([
        `/index-${ process.env.npm_package_version }.js`,
        `/index-${ process.env.npm_package_version }.css`
      ]).then(() => self.skipWaiting());
    })
  );
});

/**
 * Clear legacy cache on activating worker
 */

self.addEventListener('activate', event => {
  event.waitUntil(clear());
});

/**
 * Highjack all requests but letting /api request go through
 */

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  event.respondWith(
    caches.match(event.request).then(cached => {
      // Always bypass cache for requests for application api
      if (url.pathname === '/api' || process.env.NODE_ENV === 'development') {
        return fetch(event.request).catch(() => cached);
      }

      return cached;
    }).then(cached => {
      // Always try and fetch latest content from the Prismic api
      if (cached && url.href.indexOf(process.env.PRISMIC_API) !== -1) {
        return update(event.request).catch(() => cached);
      }

      // Add unrecognized requests to cache
      if (!cached) {
        return update(event.request);
      }

      // Use cached response
      return cached;
    })
  );
});

function update(request) {
  return fetch(request).then(response => {
    if (!response.ok) { return response; }
    return caches.open(process.env.npm_package_version).then(cache => {
      cache.put(request, response.clone());
      return response;
    });
  });
}

function clear() {
  return caches.keys().then(keys => Promise.all(keys.map(key => {
    if (key === process.env.npm_package_version) {
      return caches.delete(key);
    }
  })));
}
