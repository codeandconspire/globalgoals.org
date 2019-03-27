const Core = require('./core')
const createStore = require('./store')
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

  // app.route('/', require('../views/vote'))
  // app.route('/:category', require('../views/category'))
  app.route('/', require('../views/nominate'))
  app.route('/thanks', require('../views/nominate'))

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
