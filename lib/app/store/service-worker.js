const idb = require('idb-keyval')

module.exports = sw

function sw () {
  return function (state, emitter) {
    if (typeof window === 'undefined') return

    if (navigator.serviceWorker && navigator.onLine) {
      emitter.on('app:reset', () => {
        idb.clear()
        const controller = navigator.serviceWorker.controller
        if (controller && controller.state !== 'redundant') {
          controller.postMessage({ type: 'clear' })
        }
      })

      emitter.on('*', (event, data) => {
        const events = ['render', 'DOMTitleChange', 'DOMContentLoaded']
        const branches = ['pages', 'goals', 'twitter', 'instagram', 'articles']
        const inTransition = state.transitions.length !== 0
        const isLoading = branches.reduce((result, branch) => {
          return result || state[branch].isLoading
        }, false)

        if (!events.includes(event) || state.error || inTransition || isLoading) return
        idb.set(state.version, JSON.stringify(state))
      })

      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        registration.onupdatefound = function () {
          var installingWorker = registration.installing
          installingWorker.onstatechange = function () {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Service worker has been updated
                emitter.emit('app:reset')
              } else {
                // Service worker installed
                navigator.serviceWorker.ready.then(registration => {
                  ready(registration.active)
                })
              }
            }
          }
        }
      })

      ready(navigator.serviceWorker.controller)
    }

    function ready (worker) {
      if (!worker || worker.state === 'redundant') return

      window.fetch('/api', {
        headers: {'Accept': 'application/json'},
        credentials: 'include'
      }).then(body => body.json().then(next => {
        if (next.version > state.version) {
          emitter.emit('app:terminate')
          unregister()
        }
      }))
    }

    function unregister () {
      idb.clear()
      if (!navigator.onLine || !navigator.serviceWorker) return
      const registrations = navigator.serviceWorker.getRegistrations()
      registrations.then(function (registrations) {
        Object.keys(registrations).forEach(function (key) {
          const registration = registrations[key]
          registration.unregister()
        })
      })
    }
  }
}
