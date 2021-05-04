const html = require('choo/html')
const errors = require('../error')
const header = require('../header')
const footer = require('../footer')
const Share = require('../share')
const player = require('../embed/player')
const { inBrowser } = require('../base/utils')
const { __ } = require('../../locale')

if (inBrowser) {
  require('smoothscroll-polyfill').polyfill()
  require('../focus')()
}

const DEFAULT_TITLE = 'Goalkeepers 2021'

/**
 * Create an application view with given view function and title. If there's an
 * error or if the view function throws, a corresponding error view will be
 * rendered in its place.
 *
 * @example
 * module.exports = view('home', main, title);
 *
 * function main(state, emit) {
 *   if (!state.somethingImportant) {
 *     const error = new Error('Missing important thing');
 *     error.status = 500;
 *     throw error;
 *   }
 *
 *   return html`
 *     <div>´´
 *       <h1>Welcome!</h1>
 *     </div>
 *   `;
 * }
 *
 * function title(state) {
 *   return 'Welcome';
 * }
 *
 * @param {string} name View name
 * @param {function} render Render application view
 * @param {function} title Get view title
 * @returns {Element}
 */

module.exports = function createView (name, content, title) {
  return function view (state, emit, render) {
    let children, error

    /**
     * Try render the view, falling back to appropiate error view if it throws
     */

    if (!state.error) {
      try {
        if (state.routeName !== name) emit('routeChange', name)
        children = content(state, emit, render)
      } catch (err) {
        error = err
        err.status = err.status || 500
        children = errors[err.status](err)
        if (!inBrowser) throw error
        emit('track:exception', err)
      }
    } else {
      const status = errors[state.error.status] ? state.error.status : 500
      error = state.error
      children = errors[status](state.error)
    }

    /**
     * Set title, falling back to a default if it's missing or there's an error
     */

    let nextTitle = DEFAULT_TITLE
    if (error) {
      nextTitle = composeTitle(error.status || 500)
    } else if (title) {
      nextTitle = composeTitle(title(state))
    }
    if (nextTitle !== state.title) emit(state.events.DOMTITLECHANGE, nextTitle)

    if (error) {
      emit('routeChange', error.status)
    }

    return html`
      <body class="View js-view">

        ${children}

        ${player.render(null)}
        ${state.ui.sharing ? render(Share, state.ui.sharing) : null}
      </body>
    `
  }
}

/**
 * Compose a title string from string or error code
 * @param {string|number} title Title string or error code
 * @return {string}
 */

function composeTitle (title) {
  switch (title) {
    case 404: return `${__('Not found')} | ${__(DEFAULT_TITLE)} `
    case 500: return `${__('An error occured')} | ${__(DEFAULT_TITLE)} `
    default: {
      if (typeof title === 'string') {
        return `${title.replace(/\s+/g, ' ')} | ${__(DEFAULT_TITLE)}`
      }
      return __(DEFAULT_TITLE)
    }
  }
}
