/* eslint-env serviceworker */

const document = require('../document')

const TRACKING_REGEX = /https?:\/\/((www|ssl)\.)?google-analytics\.com/
const WEBSITE_URLS = [ process.env.NOW_URL, process.env.GLOBALGOALS_URL ]
const WEBSITE_PATTERN = `(?:${WEBSITE_URLS.join('|')})`.replace(/\//g, '\\/').replace(/\./g, '\\.')
const WEBSITE_REGEX = new RegExp(WEBSITE_PATTERN)
const BUILD_VERSION = process.env.npm_package_version
const NUMBER_OF_GRID_LAYOUT = process.env.GLOBALGOALS_NUMBER_OF_GRID_LAYOUT
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
const FILES = [
  '/',
  `/index-${BUILD_VERSION}.js`,
  `/index-${BUILD_VERSION}.css`
]

const state = new State()

/**
 * Install and cache latest versions of application
 */

self.addEventListener('install', function oninstall (event) {
  event.waitUntil(
    caches.open(BUILD_VERSION).then(cache => {
      return cache.addAll(FILES).then(() => self.skipWaiting())
    })
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
        if (cached && isHTML && isLocal) {
          return new Promise(resolve => {
            const layout = Math.floor(Math.random() * NUMBER_OF_GRID_LAYOUT + 1)
            state.set({ layout }, () => resolve(render()))
          })
        }

        // Always bypass cache for requests to application api
        if (isApi || isHTML || IS_DEVELOPMENT) {
          return update(cached)
        }

        // Bypass cache for tracking scripts
        if (TRACKING_REGEX.test(url.href)) {
          return self.fetch(event.request)
        }

        // Use cached response
        return cached || update()
      }).catch(err => {
        const { mode, method } = event.request

        if (mode === 'navigate' || (method === 'GET' && isHTML)) {
          return render()
        }

        return Promise.reject(err)
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
 * Merge cached state wit latest
 */

self.addEventListener('message', function onmessage (event) {
  state.set(event.data.state)
  if (event.data.type === 'reset') {
    clear().then(function () {
      caches.open(BUILD_VERSION).then(cache => cache.addAll(FILES))
    })
  }
})

/**
 * Completely wipe cache
 */

function clear () {
  return caches.keys().then(keys => Promise.all(keys.map(key => {
    if (key !== BUILD_VERSION) {
      return caches.delete(key)
    }
  })))
}

/**
 * Render blank html page with latest state
 */

function render () {
  return new Promise(resolve => {
    state.get(function (initialState) {
      const body = `
        <body class="js-view">
          <script>window.initialState = ${JSON.stringify(initialState).replace(/[\u2028\u200B-\u200D\uFEFF]/g, '')}</script>
        </body>
      `
      resolve(new self.Response(document(initialState, body), { headers: {
        'Content-Type': 'text/html'
      }}))
    })
  })
}

/**
 * Ensure list of unique documents in member `items` of all [args]
 *
 * @param {...object} args Objects for which to concat `items` as unique list
 * @returns {object}
 */

function unique (...args) {
  const used = {}

  args.push({
    items: [].concat(...args.filter(Boolean).map(src => src.items)).filter(doc => {
      return used[doc.id] ? false : (used[doc.id] = true)
    })
  })

  return Object.assign({}, ...args)
}

/**
 * Wrapper utility for `indexedDB` saving and retrieving state object
 */

function State () {
  this.state = {}

  const open = self.indexedDB.open('state', 3)
  open.onsuccess = () => { this.db = open.result }
  open.onupgradeneeded = function () {
    var db = open.result
    db.createObjectStore('state', { keyPath: 'version' })
  }
}

/**
 * Get state object
 * @param {function} callback
 */

State.prototype.get = function (callback) {
  const store = this.db.transaction(['state']).objectStore('state')
  store.get(BUILD_VERSION).onsuccess = function (event) {
    if (callback) callback(event.target.result)
  }
}

/**
 * Set state object
 * @param {object} next
 * @param {function} callback
 */

State.prototype.set = function (next, callback) {
  this.get(prev => {
    const store = this.db.transaction(['state'], 'readwrite').objectStore('state')

    let save
    if (prev) {
      save = store.put(Object.assign(prev, next, {
        pages: unique(prev.pages, next.pages),
        goals: unique(prev.goals, next.goals),
        activities: unique(prev.activities, next.activities),
        articles: unique(prev.articles, next.articles)
      }))
    } else {
      save = store.put(next)
    }

    save.onsuccess = function (event) {
      if (callback) callback(event.target.result)
    }
  })
}
