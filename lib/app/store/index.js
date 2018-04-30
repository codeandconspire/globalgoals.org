const error = require('./error')
const transitions = require('./transitions')
const tracking = require('./tracking')
const ui = require('./ui')
const favicon = require('../../components/favicon')
const { inBrowser } = require('../../components/base/utils')
const meta = require('../../components/meta')

module.exports = function () {
  return function (state, emitter, app) {

    /**
     * Clean up and update state on navigate
     */

    emitter.on(state.events.NAVIGATE, () => {
      const transitions = ['pushstate', 'popstate', 'tab']
      const inTransition = transitions.reduce((result, name) => {
        return result || state.transitions.includes(name)
      }, false)

      if (!inTransition) window.scrollTo(0, 0)
    })

    /**
     * Update head elements on title change
     */

    emitter.on(state.events.DOMTITLECHANGE, () => {
      if (inBrowser) {
        const root = document.documentElement

        // Update meta tags
        meta.update(state)

        if (state.params.goal) {
          // Set goal favicon
          favicon.update(state.params.goal)

          // Set goal page background color
          root.classList.add('u-bg' + state.params.goal)
        } else {
          // Reset default favicon
          favicon.update()

          // Unset goal background color
          const background = root.className.match(/(u-bg\d+)/)
          if (background) {
            root.classList.remove(background[1])
          }
        }
      }
    })

    /**
     * Persist route name to state
     */

    emitter.on('routeChange', name => {
      // Attach to app state to persist change to SSR state
      app.state.routeName = name
    })

    const models = [
      error(),
      transitions(),
      tracking(),
      ui()
    ]
    models.forEach(model => model(state, emitter))

    /**
     * Terminate the app if it crashes
     */

    if (inBrowser && process.env.NODE_ENV !== 'development') {
      window.addEventListener('error', err => {
        document.documentElement.classList.remove('has-js')
        emitter.emit('app:terminate')
        emitter.emit('track:exception', { message: err.message, status: 500 })
      })
    }

    /**
     * Do a hard page reload if the application has been terminated
     */

    let isActive = true
    emitter.on('app:terminate', () => { isActive = false })
    emitter.on(state.events.PUSHSTATE, () => {
      if (!isActive) window.location.reload()
    })
  }
}
