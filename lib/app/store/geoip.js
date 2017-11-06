const { fromError } = require('../../components/base/utils')

module.exports = function geoip () {
  return function (state, emitter) {
    emitter.on('geoip:fetch', () => {
      window.fetch('https://api.ipify.org?format=json')
        .then(body => body.json())
        .then(resp => window.fetch(`https://freegeoip.net/json/${resp.ip}`))
        .then(body => body.json())
        .then(data => {
          Object.assign(state.geoip, data)
          emitter.emit(state.events.RENDER)
        })
        .catch(err => {
          err.status = 503
          state.geoip.error = fromError(err)
        })
    })
  }
}
