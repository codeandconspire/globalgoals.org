const Prismic = require('prismic-javascript')
const { fromError } = require('../../components/base/utils')
const { getCode } = require('../../locale')

module.exports = function (batch) {
  return function (state, emitter) {
    emitter.on('app:reset', () => {
      state.goals.items = []
      state.goals.error = null
      state.goals.isLoading = true

      // Preemtively re-fetch all goals
      Prismic.api(process.env.PRISMIC_API).then(api => api.query(
        Prismic.Predicates.at('document.type', 'goal'),
        { ref: state.ref, lang: getCode(state.lang) })
      ).then(response => {
        state.goals.isLoading = false
        state.goals.items = response.results
      }).catch(err => {
        state.goals.isLoading = false
        emitter.emit('error', { status: err.status || 503, error: err })
      })
    })

    /**
     * Fetch specific or all goals
     */

    emitter.on('goals:fetch', batch((data, query) => {
      state.goals.isLoading = true

      const predicates = []
      const options = { orderings: '[my.goal.number]' }

      /**
       * Figure out the query and how many items we hope to recieve
       */

      if (data && data.number) {
        if (Array.isArray(data.number)) {
          predicates.push(Prismic.Predicates.any('my.goal.number', data.number))
        } else {
          predicates.push(Prismic.Predicates.at('my.goal.number', data.number))
        }
      } else {
        predicates.push(Prismic.Predicates.at('document.type', 'goal'))
      }

      query(predicates, options).then(response => {
        // Identify which articles we did not already have
        const newcomers = response.results.filter(result => {
          return !state.goals.items.find(doc => doc.id === result.id)
        })

        state.goals.error = null
        state.goals.isLoading = false
        state.goals.items = state.goals.items.concat(newcomers)
      }).catch(err => {
        state.goals.isLoading = false
        if (!data || typeof data.critical === 'undefined' || data.critical) {
          emitter.emit('error', { status: err.status || 503, error: err })
        } else {
          state.goals.error = fromError(err)
          emitter.emit('render')
        }
      })
    }))
  }
}
