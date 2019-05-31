const sw = require('choo-service-worker')
const Prismic = require('prismic-javascript')
const ui = require('./ui')
const error = require('./error')
const goals = require('./goals')
const pages = require('./pages')
const twitter = require('./twitter')
const articles = require('./articles')
const tracking = require('./tracking')
const instagram = require('./instagram')
const transitions = require('./transitions')
const meta = require('../../components/meta')
const favicon = require('../../components/favicon')
const { setLocale, getCode } = require('../../locale')
const { inBrowser, onidle } = require('../../components/base/utils')

const BATCH_PROCESS_TIMEOUT = 90
const NUMBER_OF_GRID_LAYOUT = process.env.GLOBALGOALS_NUMBER_OF_GRID_LAYOUT
var COOKIE = new RegExp(`${Prismic.previewCookie}=(.+?)(?:;|$)`)

module.exports = function () {
  return function (state, emitter, app) {
    /**
     * Properly reset eventbus on ssr
     */

    if (typeof window === 'undefined') emitter.removeAllListeners()
    emitter.on('DOMTitleChange', function (title) {
      state.title = title
    })

    /**
     * Prevent leaking component state in-between renders
     */

    state.components = Object.create({
      toJSON () {
        return {}
      }
    })

    /**
     * Ensure a layout
     */

    if (state.lang === 'en') {
      state.layout = state.layout || randomizeLayout()
    } else {
      state.layout = null
    }

    /**
     * Handle language
     */

    emitter.on('languagechange', lang => {
      emitter.emit('app:reset')
      setLocale(lang)
      state.lang = lang
      state.layout = lang === 'en' ? randomizeLayout() : null
    })

    /**
     * Clean up and update state on navigate
     */

    emitter.on(state.events.NAVIGATE, () => {
      const transitions = ['pushstate', 'popstate', 'tab']
      const inTransition = transitions.reduce((result, name) => {
        return result || state.transitions.includes(name)
      }, false)

      window.requestAnimationFrame(function () {
        if (!inTransition) window.scrollTo(0, 0)
      })
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
    })

    /**
     * Persist route name to state
     */

    emitter.on('routeChange', name => {
      // Attach to app state to persist change to SSR state
      app.state.routeName = name
    })

    const models = [
      error(),
      transitions(),
      tracking(),
      ui(),
      sw('/service-worker.js')
    ]
    models.forEach(model => model(state, emitter))

    /**
     * Terminate the app if it crashes
     */

    if (inBrowser && process.env.NODE_ENV !== 'development') {
      window.addEventListener('error', err => {
        document.documentElement.classList.remove('has-js')
        emitter.emit('app:terminate')
        emitter.emit('track:exception', { message: err.message, status: 500 })
      })
    }

    /**
     * Do a hard page reload if the application has been terminated
     */

    let isActive = true
    emitter.on('app:terminate', () => { isActive = false })
    emitter.on(state.events.PUSHSTATE, () => {
      if (!isActive) window.location.reload()
    })

    /**
     * Clear app state when in preview
     */

    if (typeof window !== 'undefined' && COOKIE.test(document.cookie)) {
      emitter.emit('app:reset')
    }

    /**
     * API wrapper functionality for batch rendering on consecutive requests
     */

    let init
    if (typeof window === 'undefined') {
      init = Promise.reject(new Error('Invalid api access by store'))
    } else {
      init = Prismic.api(process.env.PRISMIC_API).catch((err) => {
        emitter.emit('app:terminate')
        emitter.emit('track:exception', { message: err.message, status: 500 })
      })
    }

    /**
     * Curried batch query generator for use as event listener by stores
     */

    let cancelRender
    function batch (callback) {
      return function (data) {
        callback(data, function (predicates, options = {}) {
          return init.then(api => api.query(
            predicates,
            Object.assign({ lang: getCode(state.lang) }, options)
          ).then(response => {
            if (cancelRender) cancelRender()
            cancelRender = onidle(function callback () {
              emitter.emit(state.events.RENDER)
            }, BATCH_PROCESS_TIMEOUT)
            return response
          }))
        })
      }
    }
  }
}
