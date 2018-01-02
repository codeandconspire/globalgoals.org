/* eslint-env serviceworker */

const TRACKING_REGEX = /https?:\/\/((www|ssl)\.)?google-analytics\.com/
const WEBSITE_URLS = [ process.env.NOW_URL, process.env.GLOBALGOALS_URL ]
const WEBSITE_PATTERN = `(?:${WEBSITE_URLS.join('|')})`.replace(/\//g, '\\/').replace(/\./g, '\\.')
const WEBSITE_REGEX = new RegExp(WEBSITE_PATTERN)
const BUILD_VERSION = process.env.npm_package_version
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
  const url = new self.URL(event.request.url)

  event.respondWith(
    caches.open(BUILD_VERSION).then(cache => {
      return cache.match(event.request).then(cached => {
        const isLocal = WEBSITE_REGEX.test(url.href)
        const isApi = isLocal && /^\/api/.test(url.pathname)

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
 * Completely wipe cache
 */

function clear () {
  return Promise.all([
    caches.keys().then(keys => Promise.all(keys.map(key => {
      if (key !== BUILD_VERSION) {
        return caches.delete(key)
      }
    })))
  ])
}
