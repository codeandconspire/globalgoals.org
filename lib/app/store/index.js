const pathToRegExp = require('path-to-regexp');
const error = require('./error');
const goals = require('./goals');
const initiatives = require('./initiatives');
const articles = require('./articles');
const pages = require('./pages');
const transitions = require('./transitions');


module.exports = function (initialState = {}) {
  return function (state, emitter) {
    Object.assign(state, initialState);

    /**
     * Cache a regexp of every routes for perf sake
     */

    const cache = {};
    if (state.routes) {
      Object.keys(state.routes).forEach(key => {
        cache[key] = pathToRegExp(state.routes[key]);
      });
    }

    /**
     * Determine route name on navigate
     */

    emitter.on(state.events.NAVIGATE, () => {
      if (state.error) {
        state.routeName = state.error.code || 'error';
      } else {
        const route = Object.keys(cache).find(key => {
          return cache[key].test(window.location.pathname);
        });

        state.routeName = route || 'page';
      }
    });

    /**
     * Handle navigation open/close
     */

    emitter.on('navigation:toggle', (bool) => {
      state.navigationOpen = bool;
      emitter.emit(state.events.RENDER);
    });

    [
      error(),
      goals(),
      initiatives(),
      articles(),
      pages(),
      transitions()
    ].forEach(model => model(state, emitter));

    emitter.on(state.events.NAVIGATE, () => {
      window.scrollTo(0, 0);
    });
  };
};
