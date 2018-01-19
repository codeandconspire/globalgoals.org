const Prismic = require('prismic-javascript')
const error = require('./error')
const goals = require('./goals')
const articles = require('./articles')
const pages = require('./pages')
const transitions = require('./transitions')
const tracking = require('./tracking')
const ui = require('./ui')
const twitter = require('./twitter')
const instagram = require('./instagram')
const sw = require('./service-worker')
const favicon = require('../../components/favicon')
const { inBrowser, onidle } = require('../../components/base/utils')
const meta = require('../../components/meta')
const { setLocale, getCode } = require('../../locale')

const BATCH_PROCESS_TIMEOUT = 90
const NUMBER_OF_GRID_LAYOUT = process.env.GLOBALGOALS_NUMBER_OF_GRID_LAYOUT
const LAYOUT_COOKIE_NAME = process.env.GLOBALGOALS_GRID_LAYOUT_COOKIE_NAME
const LAYOUT_COOKIE_REGEX = new RegExp(`${LAYOUT_COOKIE_NAME}=(\\d+)`)
const PRISMIC_COOKIE_REGEX = new RegExp(`${Prismic.previewCookie}=([^;]+)`)

module.exports = function () {
  return function (state, emitter, app) {
    /**
     * Handle language
     */

    emitter.on('languagechange', lang => {
      emitter.emit('app:reset')
      setLocale(lang)
      state.lang = lang
      state.layout = lang === 'en' ? randomizeLayout() : null
      if (inBrowser) {
        document.cookie = `${LAYOUT_COOKIE_NAME}=${state.layout}`
      }
    })

    /**
     * Clean up and update state on navigate
     */

    emitter.on(state.events.NAVIGATE, () => {
      const transitions = ['pushstate', 'popstate', 'tab']
      const inTransition = transitions.reduce((result, name) => {
        return result || state.transitions.includes(name)
      }, false)

      if (!inTransition) window.scrollTo(0, 0)
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
        if (state.lang === 'en') {
          const prevLayout = document.cookie.match(LAYOUT_COOKIE_REGEX)
          state.layout = randomizeLayout()
          if (prevLayout) {
            while (state.layout === prevLayout[1]) {
              state.layout = randomizeLayout()
            }
          }

          // Overwrite cookie to have server issue the same layout on next visit
          document.cookie = `${LAYOUT_COOKIE_NAME}=${state.layout}`
        } else {
          state.layout = null
        }
      }

      if (!/previews/.test(state.ref)) {
        Prismic.api(process.env.PRISMIC_API).then(api => {
          const master = api.refs.find(ref => ref.isMasterRef)
          if (state.ref !== master.ref) {
            state.ref = master.ref
            emitter.emit('app:reset')
            emitter.emit(state.events.RENDER)
          }
          emitter.emit('api:ready', api)
        })
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
      goals(batch),
      articles(batch),
      pages(batch),
      transitions(),
      tracking(),
      ui(),
      twitter(),
      instagram(),
      sw()
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
     * API wrapper functionality for batch rendering on consecutive requests
     */

    let PrismicApi
    const queue = []
    emitter.on('api:ready', api => {
      PrismicApi = api
      if (queue.length) {
        queue.forEach((callback, data) => batchProcess(callback, data))
      }
    })

    function batch (callback) {
      return function (data) {
        if (!PrismicApi) return queue.push([callback, data])
        batchProcess(callback, data)
      }
    }

    let cancelRender
    function batchProcess (callback, data) {
      callback(data, function (predicates, options = {}) {
        return PrismicApi.query(
          predicates,
          Object.assign({
            ref: state.ref,
            lang: getCode(state.lang)
          }, options)
        ).then(response => {
          if (cancelRender) cancelRender()
          cancelRender = onidle(function callback () {
            emitter.emit(state.events.RENDER)
          }, BATCH_PROCESS_TIMEOUT)
          return response
        })
      })
    }
  }
}

/**
 * Randomize grid layout
 */

function randomizeLayout () {
  return Math.floor(Math.random() * NUMBER_OF_GRID_LAYOUT + 1)
}
