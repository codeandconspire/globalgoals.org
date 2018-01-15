const idb = require('idb-keyval')

module.exports = serviceWorker

function serviceWorker () {
  return function (state, emitter) {
    if (typeof window === 'undefined') return

    if (navigator.serviceWorker && navigator.onLine) {
      emitter.on('app:terminate', () => idb.clear())
      emitter.on('app:reset', () => {
        idb.clear()
        const controller = navigator.serviceWorker.controller
        if (controller && controller.state !== 'redundant') {
          controller.postMessage({ type: 'clear' })
        }
      })

      emitter.on('*', (event, data) => {
        const events = ['render', 'DOMTitleChange', 'DOMContentLoaded']
        if (events.includes(event) && safeToPersist(state)) {
          idb.set(state.version, JSON.stringify(state))
        }
      })

      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        registration.onupdatefound = function () {
          const installingWorker = registration.installing
          installingWorker.onstatechange = function () {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Service worker has been updated
                emitter.emit('app:terminate')
              } else {
                // Service worker installed
                if (safeToPersist(state)) {
                  idb.set(state.version, JSON.stringify(state))
                }
              }
            }
          }
        }
      })
    }
  }
}

function safeToPersist (state) {
  const branches = ['pages', 'goals', 'twitter', 'instagram', 'articles']
  const inTransition = state.transitions.length !== 0
  const isLoading = branches.reduce((result, branch) => {
    return result || state[branch].isLoading
  }, false)

  return !state.error && !inTransition && !isLoading
}