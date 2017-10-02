const TRACKING_REGEX = /https?:\/\/((www|ssl)\.)?google-analytics\.com/;

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
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => {
      if (key !== process.env.npm_package_version) {
        return caches.delete(key);
      }
    }))).then(() => self.clients.claim())
  );
});

/**
 * Highjack all requests but letting /api request go through
 */

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  event.respondWith(
    caches.open(process.env.npm_package_version).then(cache => {
      return cache.match(event.request).then(cached => {
        // Always bypass cache for requests for application api
        if (url.pathname === '/api' || process.env.NODE_ENV === 'development') {
          return fetch(event.request);
        }

        return cached;
      }).then(cached => {
        // Always try and fetch latest content from the Prismic api
        if (cached && url.href.indexOf(process.env.PRISMIC_API) !== -1) {
          return update().catch(() => cached);
        }

        // Bypass cache for tracking scripts
        if (TRACKING_REGEX.test(url.href)) {
          return fetch(event.request);
        }

        // Add unrecognized requests to cache
        if (!cached) {
          return update();
        }

        // Use cached response
        return cached;
      });

      function update() {
        return fetch(event.request).then(response => {
          if (!response.ok) { return response; }
          cache.put(event.request, response.clone());
          return response;
        });
      }
    }));
});
