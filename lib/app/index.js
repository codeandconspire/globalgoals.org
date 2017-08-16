const Core = require('./core');
const createStore = require('./store');
const view = require('../components/view');
const { parse, extend } = require('../params');

const app = module.exports = new Core({ parse });

app.route(extend('/'), require('../views/home'));
app.route(extend('/:goal(\\d{1,2}):slug(-[-\\w]+)?'), require('../views/goal'));
app.route(extend('/initiatives'), require('../views/initiatives'));
app.route(extend('/initiatives/:initiative'), require('../views/initiative'));
app.route(extend('/news'), require('../views/news'));
app.route(extend('/news/:article'), require('../views/article'));
app.route(extend('/:page'), require('../views/page'));
app.route('/*', view(require('../components/error/404')));

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
