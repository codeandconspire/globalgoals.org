const Core = require('./core')
const createStore = require('./store')
const error = require('../components/error')
const goal = require('../views/goal')
const page = require('../views/page')
const engager = require('../views/engager')
const { languages, setLocale } = require('../locale')
const { inBrowser } = require('../components/base/utils')

const DEFAULT_LANG = process.env.GLOBALGOALS_LANG
const GOAL_PATH = /^(\d{1,2})(?:-([-\w]+))?(?:\/|$)/

const routes = [
  ['/', require('../views/home')],
  ['/languages', require('../views/lang')],
  ['/organisations', engager('organisations')],
  ['/media', engager('messages')],
  ['/faq', engager('tips')],
  ['/follow', engager('follow')],
  ['/action', require('../views/action')],
  ['/news', require('../views/news')],
  ['/news/:article', require('../views/article')],
  ['/resources', require('../views/resources')],
  ['/404', error.create(404)],
  ['/error', error.create(500)],
  ['/:path', resolve(goal, page)],
  ['/:path/', resolve(goal, page)], // Include trailing slash, just to be nice
  ['/:path/:sub_path', page],
  ['/:path/organisations', resolve(engager('organisations'))],
  ['/:path/follow', resolve(engager('follow'))],
  ['/:path/tips-tricks', resolve(engager('tips'))],
  ['/:path/media', resolve(engager('messages'))],
  ['/:path/media/:media', resolve(goal)]
]

/**
 * Create localized version of all routes
 */

const localized = Object.keys(languages).reduce((all, lang) => {
  if (lang === DEFAULT_LANG) return all
  return all.concat(routes.map(localize(lang)))
}, [])

/**
 * Wait for document load before mounting application in browser
 */

if (inBrowser) {
  try {
    start()
  } catch (err) {
    document.documentElement.classList.remove('has-js')
  }
} else {
  module.exports = start()
}

function start () {
  const app = new Core()

  /**
   * Add default localization and apply routes
   */

  routes
    .map(localize(DEFAULT_LANG))
    .concat(localized)
    .forEach(([route, view]) => app.route(route, view))

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
  return function ([route, handler]) {
    let href = route
    if (lang !== DEFAULT_LANG) {
      href = ('/' + lang + (route === '/' ? '' : route))
    }

    return [href, function (state, emit, render) {
      if (state.lang !== lang) emit('languagechange', lang)
      else setLocale(lang)
      if (handler.identity) return render(handler, state, emit, render)
      return handler(state, emit, render)
    }]
  }
}

/**
 * Try and resolve path to goal page
 * @param {function} view
 * @param {function?} fallback
 */

function resolve (view, fallback = error.create(404)) {
  return function (state, emit, render) {
    const match = state.params.path.match(GOAL_PATH)
    if (match) {
      state.params.goal = +match[1]
      state.params.slug = match[2]
      if (view.identity) return render(view, state, emit, render)
      return view(state, emit, render)
    }
    if (fallback.identity) return render(fallback, state, emit, render)
    return fallback(state, emit, render)
  }
}
