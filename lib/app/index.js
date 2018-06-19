const Core = require('./core')
const createStore = require('./store')
const error = require('../components/error')
const { inBrowser } = require('../components/base/utils')

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
   * Add routes
   */

  app.route('/', require('../views/awards'))
  app.route('/thanks', require('../views/awards'))
  app.route('*', error.create(404))

  /**
   * Hook up development tools
   */

  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
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
