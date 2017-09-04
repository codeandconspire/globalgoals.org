const html = require('choo/html');
const pathToRegExp = require('path-to-regexp');
const Prismic = require('prismic-javascript');
const error = require('./error');
const goals = require('./goals');
const initiatives = require('./initiatives');
const articles = require('./articles');
const pages = require('./pages');
const transitions = require('./transitions');

const NUMBER_OF_GRID_LAYOUT = process.env.GLOBALGOALS_NUMBER_OF_GRID_LAYOUT;
const LAYOUT_COOKIE_NAME = process.env.GLOBALGOALS_GRID_LAYOUT_COOKIE_NAME;
const LAYOUT_COOKIE_REGEX = new RegExp(`${ LAYOUT_COOKIE_NAME }=(\\d+)`);
const PRISMIC_COOKIE_REGEX = new RegExp(`${ Prismic.previewCookie }=([^;]+)`);

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
     * Overwrite cached state with cookies
     */

    emitter.on(state.events.DOMCONTENTLOADED, () => {
      const prismicCookie = document.cookie.match(PRISMIC_COOKIE_REGEX);

      if (prismicCookie) {
        // Overwrite Prismic ref with (possible) cookie
        state.ref = prismicCookie[1];
        state.isEditor = true;
      }

      if (state.routeName !== 'home') {
        // Try and read lauyout cookie
        const layoutCookie = document.cookie.match(LAYOUT_COOKIE_REGEX);

        if (layoutCookie) {
          state.cookie = parseInt(layoutCookie[1], 10);
        } else {
          // Fallback to generating a new random layout
          state.layout = Math.floor(Math.random() * NUMBER_OF_GRID_LAYOUT + 1);
          document.cookie = `${ LAYOUT_COOKIE_NAME }=${ state.layout }`;
        }
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

    emitter.on(state.events.PUSHSTATE, (test, test2) => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    });
  };
};
