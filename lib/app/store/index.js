const pathToRegExp = require('path-to-regexp');
const error = require('./error');
const goals = require('./goals');
const initiatives = require('./initiatives');
const articles = require('./articles');
const pages = require('./pages');

module.exports = function (initialState = {}) {
  return function (state, emitter) {
    Object.assign(state, initialState);

    emitter.on(state.events.NAVIGATE, () => {
      state.routeName = match(location.pathname, state.routes);
    });

    [
      error(),
      goals(),
      initiatives(),
      articles(),
      pages()
    ].forEach(model => model(state, emitter));
  };
};

/**
 * Find matching route by value and return its key
 * @param {string} href
 * @param {object} routes
 * @return {boolean}
 */

function match(href, routes) {
  const result = Object.keys(routes).find(key => {
    if (key !== 'page') {
      return pathToRegExp(routes[key]).test(href)
    }
  });

  return result || 'page';
};
