/* eslint-env serviceworker */

const document = require('../document')
const { languages } = require('../locale')

const BUILD_VERSION = process.env.npm_package_version
const NUMBER_OF_GRID_LAYOUT = +process.env.GLOBALGOALS_NUMBER_OF_GRID_LAYOUT
const FILES = [
  '/',
  '/site.webmanifest',
  `/index-${BUILD_VERSION}.js`,
  `/index-${BUILD_VERSION}.css`
]

/**
 * Install and cache latest versions of application
 */

self.addEventListener('install', function oninstall (event) {
  event.waitUntil(
    caches
      .open(BUILD_VERSION)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  )
})

/**
 * Clear legacy cache on activating worker
 */

self.addEventListener('activate', function onactivate (event) {
  event.waitUntil(clear().then(function () {
    if (!self.registration.navigationPreload) return self.clients.claim()
    // enable navigation preloads
    return self.registration.navigationPreload.enable().then(function () {
      return self.clients.claim()
    })
  }))
})

/**
 * Highjack all requests filtering them through conditions
 */

self.addEventListener('fetch', function onfetch (event) {
  let req = event.request
  const url = new self.URL(req.url)
  const isLocal = self.location.origin === url.origin
  const isSameOrigin = self.location.origin === url.origin
  const isHTML = req.headers.get('accept').includes('text/html')

  // proxy requests for start page with a random layout query
  if (url.pathname === '/' && !/layout=\d+/.test(url.search)) {
    const layout = Math.floor(Math.random() * NUMBER_OF_GRID_LAYOUT + 1)
    req = addLayout(req, url, layout)
  }

  event.respondWith(
    caches.open(BUILD_VERSION).then(cache => {
      return cache.match(req).then(cached => {
        // Bypass cache for html pages that can render in client
        // Try and fetch latest content from server, if state has been stored
        // in an indexed database, use that as fallback
        if (isHTML && isLocal) {
          const href = url.pathname + url.search + url.hash

          return update(cached).catch(err => {
            try {
              return render(href)
            } catch (e) {
              throw err
            }
          })
        }

        return update(cached)
      })

      function update (fallback) {
        if (req.cache === 'only-if-cached' && req.mode !== 'same-origin') {
          return fallback
        }

        if (event.preloadResponse) {
          return event.preloadResponse.then(function (response) {
            return response || self.fetch(req)
          }).then(onresponse).catch(onerror)
        }

        return self.fetch(req).then(onresponse).catch(onerror)

        function onresponse (response) {
          if (response.type === 'opaqueredirect') return response
          if (!response.ok) {
            if (fallback) {
              return fallback
            } else if (isSameOrigin && url.pathname === '/') {
              return findCachedLayout().catch(() => response)
            }
            return response
          }
          if (req.method.toUpperCase() === 'GET') {
            return cache.put(req, response.clone()).then(() => response)
          }
          return response
        }

        function onerror (err) {
          if (fallback) {
            return fallback
          } else if (isSameOrigin && url.pathname === '/') {
            return findCachedLayout().catch(() => Promise.reject(err))
          }
          return Promise.reject(err)
        }
      }

      /**
       * Lookup cached layout
       */

      function findCachedLayout (layout = null) {
        const next = layout ? addLayout(event.request, url, layout) : event.request
        return cache.match(next).then(function (cached) {
          if (cached) return cached
          if (layout === NUMBER_OF_GRID_LAYOUT) throw new Error('no-match')
          return findCachedLayout(layout + 1)
        })
      }
    }))
})

/**
 * Listen for client instructions
 */

self.addEventListener('message', function onmessage (event) {
  if (event.data.type === 'clear') {
    clear().then(() => {
      caches.open(BUILD_VERSION).then(cache => cache.addAll(FILES))
    })
  }
})

/**
 * Add layout query to cloned request
 */

function addLayout (req, url, layout) {
  var query = layout ? `${url.search ? '&' : '?'}layout=${layout}` : url.search
  url = new self.URL(url.href + query)
  return new self.Request(url.href, {
    body: req.body,
    method: req.method,
    headers: req.heders,
    referrer: req.referrer,
    credentials: 'include'
  })
}

 /**
  * Render blank html page with latest state
  */

function render (href) {
  const state = {
    href,
    params: {},
    query: {},
    events: {},
    version: BUILD_VERSION,
    error: {
      status: 503
    },
    transitions: [],
    ui: {},
    twitter: {
      items: {}
    },
    instagram: {
      items: {}
    },
    pages: {
      items: []
    },
    goals: {
      items: []
    },
    articles: {
      items: [],
      pages: [],
      tags: [],
      pageSize: 8,
      page: 1
    }
  }
  const lang = href.match(/^\/(\w+)/)
  if (lang && Object.keys(languages).includes(lang[0])) state.lang = lang[0]
  if (!lang || lang === 'en' || !Object.keys(languages).includes(lang[0])) {
    state.layout = Math.floor(Math.random() * NUMBER_OF_GRID_LAYOUT + 1)
  } else {
    state.layout = null
  }

  const body = '<body class="js-view"></body>'
  return new self.Response(document(state, body), {
    status: 503,
    headers: {
      'Content-Type': 'text/html'
    }
  })
}

/**
 * Completely wipe cache
 */

function clear () {
  return caches.keys().then(keys => {
    keys = keys.filter(key => key !== BUILD_VERSION)
    return Promise.all(keys.map(key => caches.delete(key)))
  })
}
