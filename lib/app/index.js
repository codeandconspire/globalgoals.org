const Core = require('./core');
const createStore = require('./store');
const view = require('../components/view');
const { parse, extend } = require('../params');

const app = module.exports = new Core({ parse });

app.route(extend('/'), require('../views/home'));
app.route(extend('/:goal(\\d{1,2}):slug(-[-\\w]+)?'), require('../views/goal'));
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
