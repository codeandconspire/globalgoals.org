/* eslint-env serviceworker */

const idbKeyval = require('idb-keyval')
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

const state = {
  set (props) {
    return this.get().then(prev => {
      let next = props
      if (prev) {
        next = Object.assign(prev, props, {
          pages: unique(prev.pages, props.pages),
          goals: unique(prev.goals, props.goals),
          activities: unique(prev.activities, props.activities),
          articles: unique(prev.articles, props.articles)
        })
      }
      return idbKeyval.set(BUILD_VERSION, next)
    })
  },
  get () {
    return idbKeyval.get(BUILD_VERSION)
  }
}

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
        if (isHTML && isLocal) {
          return state.get().then(initialState => {
            if (initialState) return render(url.pathname, initialState)
            return update(cached)
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
      }).catch(err => {
        const { mode, method } = event.request

        if (mode === 'navigate' || (method === 'GET' && isHTML)) {
          return render(url.pathname)
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
  if (event.data.type === 'reset') {
    clear().then(function () {
      caches.open(BUILD_VERSION).then(cache => cache.addAll(FILES))
    })
  } else {
    state.set(event.data.state)
  }
})

/**
 * Completely wipe cache
 */

function clear () {
  return Promise.all([
    idbKeyval.clear(),
    caches.keys().then(keys => Promise.all(keys.map(key => {
      if (key !== BUILD_VERSION) {
        return caches.delete(key)
      }
    })))
  ])
}

/**
 * Render blank html page with latest state
 */

function render (href, initialState) {
  let layout = Math.floor(Math.random() * NUMBER_OF_GRID_LAYOUT + 1)
  while (layout === initialState.layout) {
    layout = Math.floor(Math.random() * NUMBER_OF_GRID_LAYOUT + 1)
  }

  // Clean up state to not make any unsafe assumptions
  const state = Object.assign({}, initialState, {
    params: {},
    query: null,
    routeName: null,
    error: null,
    route: null,
    title: null,
    version: BUILD_VERSION,
    href: href,
    layout: layout
  })
  const body = `
    <body class="js-view">
      <script>window.initialState = ${JSON.stringify(state).replace(/[\u2028\u200B-\u200D\uFEFF]/g, '')}</script>
    </body>
  `
  return new self.Response(document(state, body), { headers: {
    'Content-Type': 'text/html'
  }})
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
    error: null,
    isLoading: false,
    items: [].concat(...args.filter(Boolean).map(src => src.items)).filter(doc => {
      return used[doc.id] ? false : (used[doc.id] = true)
    })
  })

  return Object.assign({}, ...args)
}
