/* eslint-env serviceworker */

const idbKeyval = require('idb-keyval')
const document = require('../document')
const { languages } = require('../locale')

const TRACKING_REGEX = /https?:\/\/((www|ssl)\.)?google-analytics\.com/
const WEBSITE_URLS = [ process.env.NOW_URL, process.env.GLOBALGOALS_URL ]
const WEBSITE_PATTERN = `(?:${WEBSITE_URLS.join('|')})`.replace(/\//g, '\\/').replace(/\./g, '\\.')
const WEBSITE_REGEX = new RegExp(WEBSITE_PATTERN)
const DEFAULT_LANGUAGE = process.env.GLOBALGOALS_LANG
const BUILD_VERSION = process.env.npm_package_version
const NUMBER_OF_GRID_LAYOUT = process.env.GLOBALGOALS_NUMBER_OF_GRID_LAYOUT
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
const LANG_PATTERNS = Object.keys(languages).map(key => new RegExp(`^\\/(${key})`))
const FILES = [
  '/',
  `/index-${BUILD_VERSION}.js`,
  `/index-${BUILD_VERSION}.css`
]

const state = {
  set (lang, props) {
    return this.get().then(prev => {
      const next = Object.assign({}, prev, props, {
        params: {},
        query: null,
        error: null,
        route: null,
        title: null,
        routeName: null,
        transitions: [],
        pages: unique(prev && prev.pages, props.pages),
        goals: unique(prev && prev.goals, props.goals),
        activities: unique(prev && prev.activities, props.activities),
        articles: Object.assign(
          unique(prev && prev.articles, props.articles),
          {page: 1}
        )
      })
      return idbKeyval.set(lang + ':' + BUILD_VERSION, next)
    })
  },
  get (lang) {
    return idbKeyval.get(lang + ':' + BUILD_VERSION)
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
          const regex = LANG_PATTERNS.find(regex => regex.test(url.pathname))
          const lang = regex ? url.pathname.match(regex)[1] : DEFAULT_LANGUAGE

          return state.get(lang).then(initialState => {
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
    state.set(event.data.state.lang, event.data.state)
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
