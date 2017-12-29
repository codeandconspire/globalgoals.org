module.exports = sw

function sw () {
  return function (state, emitter) {
    if (typeof window === 'undefined') return

    if (process.env.NODE_ENV === 'development') {
      if (!navigator.onLine || !navigator.serviceWorker) return
      const registrations = navigator.serviceWorker.getRegistrations()
      registrations.then(function (registrations) {
        Object.keys(registrations).forEach(function (key) {
          const registration = registrations[key]
          registration.unregister()
        })
      })
    }

    if (navigator.serviceWorker && navigator.onLine) {
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
    }

    ready(navigator.serviceWorker.controller)

    function ready (worker) {
      if (!worker || worker.state === 'redundant') return

      emitter.on('*', event => {
        const {RENDER, DOMTITLECHANGE} = state.events
        if (event === RENDER || event === DOMTITLECHANGE) {
          worker.postMessage({type: 'update', state: state})
        }
      })

      window.fetch('/api', {
        headers: {'Accept': 'application/json'},
        credentials: 'include'
      }).then(body => body.json().then(next => {
        if (next.version > state.version) {
          emitter.emit('app:terminate')
          worker.postMessage({type: 'reset', state: next})
        } else if (next.ref !== state.ref) {
          state.ref = next.ref
          emitter.emit('app:reset')
          worker.postMessage({type: 'reset', state: next})
        }
      }))
    }
  }
}
