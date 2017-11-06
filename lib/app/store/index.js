const pathToRegExp = require('path-to-regexp')
const Prismic = require('prismic-javascript')
const error = require('./error')
const goals = require('./goals')
const activities = require('./activities')
const articles = require('./articles')
const pages = require('./pages')
const transitions = require('./transitions')
const tracking = require('./tracking')
const ui = require('./ui')
const twitter = require('./twitter')
const instagram = require('./instagram')
const geoip = require('./geoip')
const favicon = require('../../components/favicon')
const { inBrowser } = require('../../components/base/utils')
const meta = require('../../components/meta')
const { __ } = require('../../locale')

const NUMBER_OF_GRID_LAYOUT = process.env.GLOBALGOALS_NUMBER_OF_GRID_LAYOUT
const LAYOUT_COOKIE_NAME = process.env.GLOBALGOALS_GRID_LAYOUT_COOKIE_NAME
const LAYOUT_COOKIE_REGEX = new RegExp(`${LAYOUT_COOKIE_NAME}=(\\d+)`)
const PRISMIC_COOKIE_REGEX = new RegExp(`${Prismic.previewCookie}=([^;]+)`)

module.exports = function (initialState = {}) {
  return function (state, emitter) {
    assign(state, initialState)

    /**
     * Set initial route name
     */

    if (typeof window !== 'undefined') {
      setRouteName(state)
    }

    /**
     * Clean up and update state on navigate
     */

    emitter.on(state.events.NAVIGATE, () => {
      const { transitions } = state
      if (transitions.indexOf('pushstate') && transitions.indexOf('popstate')) {
        window.scrollTo(0, 0)
      }

      setRouteName(state)
    })

    /**
     * Overwrite cached state with cookies
     */

    emitter.on(state.events.DOMCONTENTLOADED, () => {
      const prismicCookie = document.cookie.match(PRISMIC_COOKIE_REGEX)

      if (prismicCookie) {
        // Overwrite Prismic ref with (possible) cookie
        state.ref = prismicCookie[1]
        state.isEditor = true
      }

      if (state.routeName !== 'home') {
        // Pick out layout cookie
        const prevLayout = document.cookie.match(LAYOUT_COOKIE_REGEX)

        state.layout = randomizeLayout()
        if (prevLayout) {
          while (state.layout === prevLayout[1]) {
            state.layout = randomizeLayout()
          }
        }

        // Overwrite cookie to have server issue the same layout on next visit
        document.cookie = `${LAYOUT_COOKIE_NAME}=${state.layout}`
      }
    })

    /**
     * Update head elements on title change
     */

    emitter.on(state.events.DOMTITLECHANGE, () => {
      if (inBrowser) {
        const root = document.documentElement

        // Update meta tags
        meta.update(state)

        if (state.params.goal) {
          // Set goal favicon
          favicon.update(state.params.goal)

          // Set goal page background color
          root.classList.add('u-bg' + state.params.goal)
        } else {
          // Reset default favicon
          favicon.update()

          // Unset goal background color
          const background = root.className.match(/(u-bg\d+)/)
          if (background) {
            root.classList.remove(background[1])
          }
        }
      }
    });

    [
      error(),
      goals(api('goals')),
      activities(api('activities')),
      articles(api('articles')),
      pages(api('pages')),
      transitions(),
      tracking(),
      ui(),
      twitter(),
      instagram(),
      geoip()
    ].forEach(model => model(state, emitter))

    /**
     * Terminate the app if it crashes
     */

    if (inBrowser) {
      window.addEventListener('error', () => {
        document.documentElement.classList.remove('has-js')
        emitter.emit('app:terminate')
      })
    }

    /**
     * Do a hard page reload if the application has been terminated
     */

    let isActive = true
    emitter.on('app:terminate', () => { isActive = false })
    emitter.on(state.events.PUSHSTATE, () => {
      if (!isActive) {
        window.location.reload()
      }
    })

    /**
     * Set up service worker
     */

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        const init = {
          headers: {
            'Accept': 'application/json'
          },
          credentials: 'include'
        }

        /**
         * Forward state to *new* service worker when it is `activated`
         */

        registration.onupdatefound = function onupdatefound () {
          registration.installing.onstatechange = function onstatechange (event) {
            if (event.target.state === 'activated' && !state.error) {
              event.target.postMessage({ state })
            }
          }
        }

        /**
         * Forward next state to service worker on any `render`
         */

        emitter.on(state.events.RENDER, () => {
          if (navigator.serviceWorker.controller && !state.error) {
            navigator.serviceWorker.controller.postMessage({ state })
          }
        })

        /**
         * Fetch next application state
         */

        window.fetch('/api', init).then(body => body.json().then(next => {
          if (next.version > state.version) {
            // If a newer version of the app is available, terminate this app...
            emitter.emit('app:terminate')

            // ...and update the service worker
            registration.update()
            return
          }

          if (next.api > state.api) {
            // Use the new ref from here on in
            state.ref = next.ref

            // If the api has been updated, reset application cache
            emitter.emit('app:reset')
          }
        }))
      })
    }

    /**
     * Create utility function for querying prismic api
     */

    function api (type) {
      const queries = []

      return function (callback) {
        return function (data) {
          callback(data, function (predicates, options = {}) {
            if (!predicates.length) return Promise.reject(notFound())
            const query = predicates.join()

            if (queries.includes(query)) return new Promise(() => {})

            queries.push(query)
            state[type].queue += 1

            return Prismic.api(process.env.PRISMIC_API).then(api => api.query(
              predicates,
              Object.assign({ ref: state.ref }, options)
            )).then(response => {
              done()
              if (data && data.uid && !response.results.length) throw notFound()
              return response
            }, err => {
              done()
              throw err
            })

            function done () {
              state[type].queue -= 1
              queries.splice(queries.indexOf(query), 1)
            }
          })
        }
      }
    }
  }
}

function notFound () {
  const error = new Error(__('Page not found'))
  error.status = 404
  return error
}

function setRouteName (state) {
  if (state.error) {
    state.routeName = state.error.code || 'error'
  } else {
    const route = Object.keys(state.routes)
      .filter(key => key !== '404')
      .sort(key => key === 'page' ? 1 : -1)
      .find(key => {
        const regex = pathToRegExp(state.routes[key])
        return regex.test(window.location.pathname)
      })

    /**
     * Update route name w/ fallback to 404
     */

    state.routeName = route || '404'
  }
}

/**
 * Randomize grid layout
 */

function randomizeLayout () {
  return Math.floor(Math.random() * NUMBER_OF_GRID_LAYOUT + 1)
}

function assign () {
  var args = Array.prototype.slice.call(arguments)
  var target = args[0]

  for (var i = 1; i < args.length; i += 1) {
    if (args[i] && typeof args[i] === 'object') {
      for (var key in args[i]) {
        if (args[i].hasOwnProperty(key)) {
          target[key] = args[i][key]
        }
      }
    }
  }

  return target
}
