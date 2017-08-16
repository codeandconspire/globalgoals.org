const Core = require('./core');
const createStore = require('./store');
const { setLocale } = require('../locale');
const view = require('../components/view');
const { parse, extend } = require('../params');

const app = module.exports = new Core({ parse });

const routes = [
  [ extend('/'), require('../views/home') ],
  [ extend('/:goal(\\d{1,2}):slug(-[-\\w]+)?'), require('../views/goal') ],
  [ extend('/initiatives'), require('../views/initiatives') ],
  [ extend('/initiatives/:initiative'), require('../views/initiative') ],
  [ extend('/news'), require('../views/news') ],
  [ extend('/news/:article'), require('../views/article') ],
  [ extend('/:page'), require('../views/page') ],
  [ '/*', view(require('../components/error/404')) ]
];

routes.map(localize).forEach(([route, view]) => app.route(route, view));

/**
 * Read initial state from DOM and create app state models
 */

const initialState = {};
if (typeof window !== 'undefined') {
  const src = document.querySelector('.js-initialState');
  Object.assign(initialState, JSON.parse(src.innerText));
  src.parentElement.removeChild(src);
}

app.use(createStore(initialState));

/**
 * Start application when running in browser
 */

if (typeof window !== 'undefined') {
  app.mount('.js-view');
}

function localize([route, view]) {
  return [route, (state, emit) => {
    setLocale(state.lang);
    return view(state, emit);
  }];
}
