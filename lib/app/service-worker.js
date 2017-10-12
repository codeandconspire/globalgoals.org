const document = require('../document');

const TRACKING_REGEX = /https?:\/\/((www|ssl)\.)?google-analytics\.com/;
const WEBSITE_URLS = [ process.env.NOW_URL, process.env.GLOBALGOALS_URL ];
const WEBSITE_PATTERN = `(?:${ WEBSITE_URLS.join('|') })`.replace(/\//g, '\\/').replace(/\./g, '\\.');
const API_REGEX = new RegExp(`${ WEBSITE_PATTERN }\\/api`);
const BUILD_VERSION = process.env.npm_package_version;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
let initialState;

/**
 * Install and cache latest versions of application
 */

self.addEventListener('install', function oninstall(event) {
  event.waitUntil(
    caches.open(BUILD_VERSION).then(cache => {
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
  const url = event.request.url;

  event.respondWith(
    caches.open(BUILD_VERSION).then(cache => {
      return cache.match(event.request).then(cached => {
        const isApi = API_REGEX.test(url);
        const isPrismic = url.indexOf(process.env.PRISMIC_API) !== -1;

        // Always bypass cache for requests to application api
        if (isApi || isPrismic || IS_DEVELOPMENT) {
          return update(cached);
        }

        // Bypass cache for tracking scripts
        if (TRACKING_REGEX.test(url)) {
          return fetch(event.request);
        }

        // Use cached response
        return cached || update();
      }).catch(err => {
        const { mode, method, headers } = event.request;
        const isHTML = headers.get('accept').includes('text/html');

        if (mode === 'navigate' || (method === 'GET' && isHTML && initialState)) {
          const body = '<body class="js-view"></body>';
          return new Response(document(initialState, body), { headers: {
            'Content-Type': 'text/html'
          }});
        }

        return Promise.reject(err);
      });

      function update(cached) {
        return fetch(event.request).then(response => {
          if (!response.ok) { return response; }
          cache.put(event.request, response.clone());
          return response;
        }, err => cached || Promise.reject(err));
      }
    }));
});

/**
 * Merge cached state wit latest
 */

self.addEventListener('message', function onmessage(event) {
  const { state } = event.data;

  if (typeof state === 'object' && state.version === BUILD_VERSION) {
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
