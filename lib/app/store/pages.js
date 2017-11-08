const Prismic = require('prismic-javascript')

module.exports = function (batch) {
  return function (state, emitter) {
    emitter.on('app:reset', () => {
      state.pages.items = []
    })

    emitter.on('pages:fetch', batch((data, query) => {
      state.pages.isLoading = true

      const predicates = []

      if (data.uid) {
        predicates.push(
          Prismic.Predicates.at(`my.${data.type || 'page'}.uid`, data.uid)
        )
      } else if (data.single) {
        predicates.push(Prismic.Predicates.at('document.type', data.single))
      } else {
        predicates.push(Prismic.Predicates.at('document.type', 'page'))

        if (data.tags) {
          predicates.push(Prismic.Predicates.at('document.tags', data.tags))
        }

        if (data.fields) {
          for (const [key, value] of Object.entries(data.fields)) {
            predicates.push(Prismic.Predicates.lt(`my.${key}`, value))
          }
        }
      }

      query(predicates).then(response => {
        state.pages.isLoading = false
        state.pages.items = unique(state.pages.items.concat(response.results))
      }).catch(err => {
        state.pages.isLoading = false
        emitter.emit('error', { status: err.status || 503, error: err })
      })
    }))
  }
}

function unique (list) {
  const used = {}

  return list.filter(doc => {
    return used[doc.id] ? false : (used[doc.id] = true)
  })
}
