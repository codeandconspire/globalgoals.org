const html = require('choo/html');
const errors = require('../error');

/**
 * Default titles be trollin'
 */

const TITLES = {
  DEFAULT: 'The Global Goals',
  get ['404']() {
    return `Not found | ${ this.DEFAULT } `;
  },
  get ['500']() {
    return `An error occured | ${ this.DEFAULT } `;
  },
  get [undefined]() {
    return this.DEFAULT;
  }
};

/**
 * Create an application view with given view function and title. If there's an
 * error or if the view function throws, a corresponding error view will be
 * rendered in its place.
 *
 * @example
 * module.exports = view(main, title);
 *
 * function main(state, emit) {
 *   if (!state.somethingImportant) {
 *     const error = new Error('Missing important thing');
 *     error.status = 500;
 *     throw error;
 *   }
 *
 *   return html`
 *     <div>
 *       <h1>Welcome!</h1>
 *     </div>
 *   `;
 * }
 *
 * function title(state) {
 *   return 'Welcome';
 * }
 *
 * @param {function} render Render application view
 * @param {function} title Get view title
 * @returns {Element}
 */

module.exports = function view(render, title) {
  return function wrapper(state, emit) {
    let content;

    /**
     * Try render the view, falling back to appropiate error view if it throws
     */

    if (!state.error) {
      try {
        content = render(state, emit);
      } catch (err) {
        content = errors[err.status || 500](err);
      }
    } else {
      const status = errors[state.error.status] ? state.error.status : 500;
      content = errors[status](state.error);
    }

    /**
     * Set title, falling back to a default if it's missing or there's an error
     */

    if (!state.error && title) {
      emit(state.events.DOMTITLECHANGE, `${ title(state) } | ${ TITLES.DEFAULT }`);
    } else {
      // Tricky way of accessing `TITLES[undefined]` for unknown error codes
      const key = state.error ? TITLES[state.error.status] : TITLES.DEFAULT;
      emit(state.events.DOMTITLECHANGE, key || TITLES[key]);
    }

    return html`
      <body class="View js-view">
        ${ content }
      </body>
    `;
  };
};
