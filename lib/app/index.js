const Core = require('./core')
const documentReady = require('document-ready')
const createStore = require('./store')
const error = require('../components/error')
const goal = require('../views/goal')
const engager = require('../views/engager')
const { languages, setLocale } = require('../locale')
const { inBrowser } = require('../components/base/utils')

const GOAL_PATH = /^(\d{1,2})(?:-([-\w]+))?(?:\/|$)/

const routes = [
  ['/', require('../views/home')],
  ['/organisations', engager('organisations')],
  ['/media', engager('messages')],
  ['/faq', engager('tips')],
  ['/newsletter', engager('newsletter')],
  ['/activities', require('../views/activities')],
  ['/activities/:activity', require('../views/activity')],
  ['/news', require('../views/news')],
  ['/news/:article', require('../views/article')],
  ['/resources', require('../views/resources')],
  ['/404', error.create(404)],
  ['/error', error.create(500)],
  ['/:path', resolve(goal, require('../views/page'))],
  ['/:path/organisations', resolve(engager('organisations'))],
  ['/:path/newsletter', resolve(engager('newsletter'))],
  ['/:path/tips-tricks', resolve(engager('tips'))],
  ['/:path/media', resolve(engager('messages'))],
  ['/:path/media/:media', resolve(goal)]
]

/**
 * Extend routes with localized paths for all languages
 */

Object.keys(languages).forEach(lang => {
  if (lang === process.env.GLOBALGOALS_LANG) return
  routes.push.apply(routes, routes.map(localize(lang)))
})

/**
 * Wait for document load before mounting application in browser
 */

if (inBrowser) {
  documentReady(start)
} else {
  module.exports = start()
}

function start () {
  const app = new Core()

  /**
   * Add all routes
   */

  routes.forEach(([route, view]) => app.route(route, view))

  /**
   * Hook up development tools
   */

  if (process.env.NODE_ENV === 'development') {
    app.use(require('choo-devtools')())
  }

  /**
   * Initialize application store
   */

  app.use(createStore())

  /**
   * Mount app in browser
   */

  if (inBrowser) app.mount('.js-view')
  return app
}

/**
 * Create a localization iterator for prefixing roues with language slug
 * @param {string} lang
 */

function localize (lang) {
  return function ([route, view]) {
    return ['/' + lang + (route === '/' ? '' : route), function (state, emit) {
      setLocale(lang)
      return view(state, emit)
    }]
  }
}

/**
 * Try and resolve path to goal page
 * @param {function} view
 * @param {function?} fallback
 */

function resolve (view, fallback) {
  return function (state, emit) {
    const match = state.params.path.match(GOAL_PATH)
    if (match) {
      state.params.goal = +match[1]
      state.params.slug = match[2]
      return view(state, emit)
    }
    return fallback ? fallback(state, emit) : error.create(404)(state, emit)
  }
}
