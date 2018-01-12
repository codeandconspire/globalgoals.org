/* eslint-env serviceworker */

const idb = require('idb-keyval')
const document = require('../document')

const TRACKING_REGEX = /https?:\/\/((www|ssl)\.)?google-analytics\.com/
const WEBSITE_URLS = [ process.env.NOW_URL, process.env.GLOBALGOALS_URL ]
const WEBSITE_PATTERN = `(?:${WEBSITE_URLS.join('|')})`.replace(/\//g, '\\/').replace(/\./g, '\\.')
const WEBSITE_REGEX = new RegExp(WEBSITE_PATTERN)
const BUILD_VERSION = process.env.npm_package_version
const NUMBER_OF_GRID_LAYOUT = process.env.GLOBALGOALS_NUMBER_OF_GRID_LAYOUT
const IS_DEVELOPMENT = false // process.env.NODE_ENV === 'development'
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
  const url = new self.URL(event.request.url)
  const isHTML = event.request.headers.get('accept').includes('text/html')

  event.respondWith(
    caches.open(BUILD_VERSION).then(cache => {
      return cache.match(event.request).then(cached => {
        const isLocal = WEBSITE_REGEX.test(url.href)
        const isApi = isLocal && /^\/api/.test(url.pathname)

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

        // Always bypass cache for requests to application api
        if (isApi || IS_DEVELOPMENT) {
          return update(cached)
        }

        // Bypass cache for tracking scripts
        if (TRACKING_REGEX.test(url.href)) {
          return self.fetch(event.request)
        }

        // Use cached response
        return cached || update()
      })

      function update (fallback) {
        return self.fetch(event.request).then(response => {
          if (!response.ok) { return response }
          cache.put(event.request, response.clone())
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
