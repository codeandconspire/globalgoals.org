const { fromError } = require('../../components/base/utils')

module.exports = function () {
  return function (state, emitter) {
    emitter.on('twitter:fetch', ({ user, hashtag = null }) => {
      state.twitter.isLoading = true
      emitter.emit(state.events.RENDER)

      let url = '/api/twitter'
      if (hashtag) {
        url += `?hashtag=${encodeURIComponent(hashtag)}`
      }

      window.fetch(url).then(response => {
        if (!response.ok) {
          state.twitter.isLoading = false
          throw new Error(`Twitter rejected with ${response.status}`)
        }

        return response.json().then(result => {
          state.twitter.isLoading = false
          state.twitter.items[hashtag || user] = result
          emitter.emit(state.events.RENDER)
        })
      }).catch(err => {
        state.twitter.isLoading = false
        err.status = 503
        state.twitter.error = fromError(err)
        emitter.emit(state.events.RENDER)
      })
    })
  }
}
