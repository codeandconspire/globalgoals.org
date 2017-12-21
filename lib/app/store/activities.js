const { fromError } = require('../../components/base/utils')
const Prismic = require('prismic-javascript')

module.exports = function (batch) {
  return function (state, emitter) {
    emitter.on('app:reset', () => {
      state.activities.items = []
      state.activities.fetched = []
      state.activities.error = null
      state.activities.total = false
    })

    emitter.on('activities:fetch', batch((data, query) => {
      state.activities.isLoading = true

      const predicates = []

      if (!data) {
        // Get all activities
        predicates.push(Prismic.Predicates.at('document.type', 'activity'))
      } else if (data.uid) {
        // Get activity by uid
        predicates.push(Prismic.Predicates.at('my.activity.uid', data.uid))
      } else if (data.tags) {
        // Cache that these tags have been fetched
        state.activities.fetched.push(...data.tags)

        // Get all activities with matching tags
        predicates.push(
          Prismic.Predicates.at('document.type', 'activity'),
          Prismic.Predicates.at('document.tags', data.tags)
        )
      }

      query(predicates).then(response => {
        const newcomers = response.results.filter(result => {
          return !state.activities.items.find(doc => doc.id === result.id)
        })

        state.activities.error = null
        state.activities.isLoading = false
        state.activities.items = state.activities.items.concat(newcomers)
        state.activities.total = response.total_results_size
      }).catch(err => {
        state.activities.isLoading = false
        if (!data || typeof data.critical === 'undefined' || data.critical) {
          emitter.emit('error', { status: err.status || 503, error: err })
        } else {
          state.activities.error = fromError(err)
          emitter.emit('render')
        }
      })
    }))
  }
}
