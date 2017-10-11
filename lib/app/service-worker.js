const TRACKING_REGEX = /https?:\/\/((www|ssl)\.)?google-analytics\.com/;
const API_REGEX = /^\/api/;
const BUILD_VERSION = process.env.npm_package_version;
let initialState;

/**
 * Install and cache latest versions of application
 */

self.addEventListener('install', function oninstall(event) {
  event.waitUntil(
    caches.open(BUILD_VERSION).then(cache => {
      if (process.env.NODE_ENV === 'development') {
        return self.skipWaiting();
      }

      return cache.addAll([
        `/index-${ BUILD_VERSION }.js`,
        `/index-${ BUILD_VERSION }.css`
      ]).then(() => self.skipWaiting());
    })
  );
});

/**
 * Clear legacy cache on activating worker
 */

self.addEventListener('activate', function onactivate(event) {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => {
      if (key !== BUILD_VERSION) {
        return caches.delete(key);
      }
    }))).then(() => self.clients.claim())
  );
});

/**
 * Highjack all requests filtering them through conditions
 */

self.addEventListener('fetch', function onfetch(event) {
  const url = new URL(event.request.url);

  event.respondWith(
    caches.open(BUILD_VERSION).then(cache => {
      return cache.match(event.request).then(cached => {
        // Always bypass cache for requests to application api
        if (API_REGEX.test(url.pathname) || process.env.NODE_ENV === 'development') {
          return update().catch(err => {
            if (cached) { return cached; }
            throw err;
          });
        }

        return cached;
      }).then(cached => {
        // Always try and fetch latest content from the Prismic api
        if (cached && url.href.indexOf(process.env.PRISMIC_API) !== -1) {
          return update().catch(err => {
            if (cached) { return cached; }
            throw err;
          });
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
      }).catch(err => {
        // TODO: Inspect headers and reply w/ placeholder document as HTML
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

self.addEventListener('message', function onmessage(event) {
  const { state } = event.data;

  if (typeof state === 'object') {
    if (typeof initialState === 'undefined') {
      initialState = state;
    } else {
      Object.assign(initialState, state, {
        twitter: Object.assign({}, initialState.twitter, state.twitter, {
          items: Object.assign({}, initialState.twitter.items, state.twitter.items)
        }),
        instagram: Object.assign({}, initialState.instagram, state.instagram, {
          items: Object.assign({}, initialState.instagram.items, state.instagram.items)
        }),
        pages: unique(initialState.pages, state.pages),
        goals: unique(initialState.goals, state.goals),
        activities: unique(initialState.activities, state.activities),
        articles: unique(initialState.articles, state.articles)
      });
    }
  }
});

/**
 * Ensure list of unique documents in member `items` of all [args]
 *
 * @param {...object} args Objects for which to concat `items` as unique list
 * @returns {object}
 */

function unique(...args) {
  const used = {};

  args.push({
    items: [].concat(...args.map(src => src.items)).filter(doc => {
      return used[doc.id] ? false : (used[doc.id] = true);
    })
  });

  return Object.assign({}, ...args);
}
