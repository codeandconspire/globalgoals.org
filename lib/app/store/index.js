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
    assign(state, initialState);

    /**
     * Cache a regexp of every routes for perf sake
     */

    const cache = {};
    if (state.routes) {
      for (const key in state.routes) {
        if (state.routes.hasOwnProperty(key)) {
          cache[key] = pathToRegExp(state.routes[key]);
        }
      }
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

    emitter.on(state.events.PUSHSTATE, () => {
      state.previousScrollPos = window.scrollY;

      if (state.routeFromGoalGrid) {
        window.scrollTo(0, 0);
      } else {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, 0);
          });
        });
      }
    });

    emitter.on(state.events.REPLACESTATE, () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, state.previousScrollPos);
        });
      });
    });

    /**
     * Do a hard page reload if the application has been terminated
     */

    let isActive = true;
    emitter.on('app:terminate', () => { isActive = false; });
    emitter.on(state.events.PUSHSTATE, () => {
      if (!isActive) {
        location.reload();
      }
    });

    /**
     * Set up service worker
     */

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        const init = { headers: { 'Accept': 'application/json' }};

        /**
         * Fetch next application state
         */

        fetch('/api', init).then(body => body.json().then(next => {
          if (next.version > state.version) {
            // If a newer version of the app is available, terminate this app...
            emitter.emit('app:terminate');

            // ...and update the service worker
            registration.update();
          } else if (next.api > state.api) {
            // Use the new ref from here on in
            state.ref = next.ref;

            // If the api has been updated, reset application cache
            emitter.emit('app:reset');
          }
        }));
      });
    }
  };
};

function assign() {
  var args = Array.prototype.slice.call(arguments);
  var target = args[0];

  for (var i = 1; i < args.length; i += 1) {
    if (args[i] && typeof args[i] === 'object') {
      for (var key in args[i]) {
        if (args[i].hasOwnProperty(key)) {
          target[key] = args[i][key];
        }
      }
    }
  }

  return target;
}
