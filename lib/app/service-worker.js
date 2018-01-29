/* eslint-env serviceworker */

const idb = require('idb-keyval')
const document = require('../document')

const TRACKING_REGEX = /https?:\/\/((www|ssl)\.)?google-analytics\.com/
const BUILD_VERSION = process.env.npm_package_version
const NUMBER_OF_GRID_LAYOUT = process.env.GLOBALGOALS_NUMBER_OF_GRID_LAYOUT
const CMS_ENDPOINT = process.env.PRISMIC_API
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
const FILES = [
  '/',
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
  event.waitUntil(clear().then(() => self.clients.claim()))
})

/**
 * Highjack all requests filtering them through conditions
 */

self.addEventListener('fetch', function onfetch (event) {
  const req = event.request
  const url = new self.URL(req.url)
  const isHTML = req.headers.get('accept').includes('text/html')

  event.respondWith(
    caches.open(BUILD_VERSION).then(cache => {
      return cache.match(req).then(cached => {
        const isLocal = self.location.origin === url.origin
        const isAPI = isLocal && /^\/api/.test(url.pathname)
        const isCMS = url.href === CMS_ENDPOINT

        // Bypass cache for html pages that can render in client
        // Try and fetch latest content from server, if state has been stored
        // in an indexed database, use that as fallback
        if (isHTML && isLocal) {
          return idb.get(BUILD_VERSION).then(initialState => {
            return new Promise((resolve, reject) => {
              const href = url.pathname + url.search + url.hash

              if (initialState) {
                self.setTimeout(() => {
                  try {
                    resolve(render(href, JSON.parse(initialState)))
                  } catch (err) {}
                }, 5000)
              }

              update(cached).then(resolve, err => {
                if (!initialState) return resolve(err)

                try {
                  resolve(render(href, JSON.parse(initialState)))
                } catch (e) {
                  resolve(err)
                }
              })
            })
          })
        }

        // Always bypass cache for requests to application APIs
        if (isAPI || isCMS || IS_DEVELOPMENT) {
          return update(cached)
        }

        // Bypass cache for tracking scripts
        if (TRACKING_REGEX.test(url.href)) {
          return self.fetch(req)
        }

        // Use cached response
        return cached || update()
      })

      function update (fallback) {
        if (req.cache === 'only-if-cached' && req.mode !== 'same-origin') {
          return fallback
        }

        return self.fetch(req).then(response => {
          if (!response.ok) { return response }
          cache.put(req, response.clone())
          return response
        }, err => fallback || Promise.reject(err))
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
  * Render blank html page with latest state
  */

function render (href, initialState) {
  const state = Object.assign({}, initialState, {
    version: BUILD_VERSION,
    href: href
  })

  if (initialState.lang === 'en') {
    state.layout = Math.floor(Math.random() * NUMBER_OF_GRID_LAYOUT + 1)
    while (state.layout === initialState.layout) {
      state.layout = Math.floor(Math.random() * NUMBER_OF_GRID_LAYOUT + 1)
    }
  } else {
    state.layout = null
  }

  const body = '<body class="js-view"></body>'
  return new self.Response(document(state, body), { headers: {
    'Content-Type': 'text/html'
  }})
}

/**
 * Completely wipe cache
 */

function clear () {
  return caches.keys().then(keys => {
    return Promise.all(keys.map(key => caches.delete(key)))
  })
}
