/* globals ga */

module.exports = function () {
  return function (state, emitter) {
    if (process.env.GOOGLE_ANALYTICS_ID && typeof ga !== 'undefined') {
      emitter.on(state.events.NAVIGATE, () => {
        ga('send', 'pageview', window.location.pathname)
      })

      emitter.on('track:exception', err => {
        ga('send', 'exception', {
          exDescription: err.message,
          exFatal: err.status > 499
        })
      })

      emitter.on('error', err => {
        ga('send', 'exception', {
          exDescription: err.message,
          exFatal: err.status > 499
        })
      })
    }
  }
}
