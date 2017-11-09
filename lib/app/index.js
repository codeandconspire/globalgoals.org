const Core = require('./core')
const documentReady = require('document-ready')
const createStore = require('./store')
const error = require('../components/error')
const { setLocale } = require('../locale')
const { parse, extend } = require('../params')
const { inBrowser } = require('../components/base/utils')

const routes = [
  [ extend('/'), require('../views/home') ],
  [ extend('/organisations'), require('../views/engager') ],
  [ extend('/media'), require('../views/engager') ],
  [ extend('/faq'), require('../views/engager') ],
  [ extend('/newsletter'), require('../views/engager') ],
  [ extend('/:goal(\\d{1,2}):slug(-[-\\w]+)?'), require('../views/goal') ],
  [ extend('/:goal(\\d{1,2}):slug(-[-\\w]+)?/organisations'), require('../views/engager') ],
  [ extend('/:goal(\\d{1,2}):slug(-[-\\w]+)?/newsletter'), require('../views/engager') ],
  [ extend('/:goal(\\d{1,2}):slug(-[-\\w]+)?/tips-tricks'), require('../views/engager') ],
  [ extend('/:goal(\\d{1,2}):slug(-[-\\w]+)?/media'), require('../views/engager') ],
  [ extend('/:goal(\\d{1,2}):slug(-[-\\w]+)?/media/:media'), require('../views/goal') ],
  [ extend('/activities'), require('../views/activities') ],
  [ extend('/activities/:activity'), require('../views/activity') ],
  [ extend('/news'), require('../views/news') ],
  [ extend('/news/:article'), require('../views/article') ],
  [ extend('/resources'), require('../views/resources') ],
  [ extend('/404'), error.create(404) ],
  [ extend('/error'), error.create(500) ],
  [ extend('/:page'), require('../views/page') ],
  [ extend('/*'), error.create(404) ]
]

if (inBrowser) {
  documentReady(start)
} else {
  module.exports = start()
}

function start () {
  const app = new Core({ parse })

  routes.map(localize).forEach(([route, view]) => app.route(route, view))

  app.use(createStore())

  if (inBrowser) {
    app.mount('.js-view')
  }

  return app
}

function localize ([route, view]) {
  return [route, (state, emit) => {
    setLocale(state.lang)
    return view(state, emit)
  }]
}
