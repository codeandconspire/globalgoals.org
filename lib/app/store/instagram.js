const { fromError } = require('../../components/base/utils')

module.exports = function () {
  return function (state, emitter) {
    emitter.on('instagram:fetch', ({ user, hashtag = null }) => {
      state.instagram.isLoading = true
      emitter.emit(state.events.RENDER)

      let url = '/api/instagram'
      if (hashtag) {
        url += `?hashtag=${encodeURIComponent(hashtag)}`
      }

      window.fetch(url).then(response => {
        if (!response.ok) {
          state.instagram.isLoading = false
          throw new Error(`Instagram rejected with ${response.status}`)
        }

        return response.json().then(result => {
          state.instagram.isLoading = false
          state.instagram.items[hashtag || user] = result
          emitter.emit(state.events.RENDER)
        })
      }).catch(err => {
        state.instagram.isLoading = false
        err.status = 503
        state.instagram.error = fromError(err)
        emitter.emit(state.events.RENDER)
      })
    })
  }
}
