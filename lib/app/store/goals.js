const Prismic = require('prismic-javascript')

module.exports = function (batch) {
  return function (state, emitter) {
    emitter.on('app:reset', () => {
      state.goals.items = []
    })

    /**
     * Fetch specific or all goals
     */

    emitter.on('goals:fetch', batch((number, query) => {
      state.goals.isLoading = true

      const predicates = []
      const options = { orderings: '[my.goal.number]' }

      /**
       * Figure out the query and how many items we hope to recieve
       */

      if (number) {
        if (Array.isArray(number)) {
          predicates.push(Prismic.Predicates.any('my.goal.number', number))
        } else {
          predicates.push(Prismic.Predicates.at('my.goal.number', number))
        }
      } else {
        predicates.push(Prismic.Predicates.at('document.type', 'goal'))
      }

      query(predicates, options).then(response => {
        // Identify which articles we did not already have
        const newcomers = response.results.filter(result => {
          return !state.goals.items.find(doc => doc.id === result.id)
        })

        state.goals.isLoading = false
        state.goals.items = state.goals.items.concat(newcomers)
      }).catch(err => {
        state.goals.isLoading = false
        emitter.emit('error', { status: err.status || 503, error: err })
      })
    }))
  }
}
