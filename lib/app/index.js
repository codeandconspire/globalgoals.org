const Core = require('./core')
const documentReady = require('document-ready')
const createStore = require('./store')
const error = require('../components/error')
const engager = require('../views/engager')
const { setLocale } = require('../locale')
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
  ['/:path', resolve(require('../views/goal'), require('../views/page'))],
  ['/:path/organisations', resolve(engager('organisations'))],
  ['/:path/newsletter', resolve(engager('newsletter'))],
  ['/:path/tips-tricks', resolve(engager('tips'))],
  ['/:path/media', resolve(engager('messages'))],
  ['/:path/media/:media', resolve(require('../views/goal'))]
]

if (inBrowser) {
  documentReady(start)
} else {
  module.exports = start()
}

function start () {
  const app = new Core()
  routes.map(localize).forEach(([route, view]) => app.route(route, view))
  app.use(createStore())
  if (inBrowser) app.mount('.js-view')
  return app
}

/**
 * Try and resolve path to goal page
 */

function resolve (view, fallback) {
  return function (state, emit) {
    const match = state.params.path.match(GOAL_PATH)
    if (match) {
      state.params.goal = +match[1]
      state.params.slug = match[2]
      return view(state, emit)
    }
    return fallback ? fallback(state, emit) : error.create(404)(state.emit)
  }
}

/**
 * Set locale before rendering page
 */

function localize ([route, view]) {
  return [route, (state, emit) => {
    setLocale(state.lang)
    return view(state, emit)
  }]
}
