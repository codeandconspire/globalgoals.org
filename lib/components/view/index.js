const html = require('choo/html');
const errors = require('../error');
const { __ } = require('../../locale');
const { setFavicon, resetFavicon } = require('../favicon');
const header = require('../header');
const footer = require('../footer');

const DEFAULT_TITLE = 'The Global Goals';

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

    if (state.error) {
      emit(state.events.DOMTITLECHANGE, composeTitle(state.error.status));
    } else if (title) {
      emit(state.events.DOMTITLECHANGE, composeTitle(title(state)));
    } else {
      emit(state.events.DOMTITLECHANGE, DEFAULT_TITLE);
    }

    if (state.params.goal) {
      setFavicon(state.params.goal);

    } else {
      resetFavicon();
    }

    return html`
      <body class="View js-view">
        <div class="View-container">
          ${ header(state, state.params.goal) }
          ${ content }
          ${ footer() }
        </div>
      </body>
    `;
  };
};

/**
 * Compose a title string form string or error code
 * @param {string|number} title Title string or error code
 * @return {string}
 */

function composeTitle(title) {
  switch (title) {
    case 404: return `${ __('Not found') } | ${ __(DEFAULT_TITLE) } `;
    case 500: return `${ __('An error occured') } | ${ __(DEFAULT_TITLE) } `;
    default: {
      if (typeof title === 'string') {
        return `${ title.replace(/\s+/g, ' ') } | ${ __(DEFAULT_TITLE) }`;
      }
      return __(DEFAULT_TITLE);
    }
  }
}
