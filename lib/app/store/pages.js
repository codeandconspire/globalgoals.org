const Prismic = require('prismic-javascript')
const { __ } = require('../../locale')

module.exports = function () {
  return function (state, emitter) {
    emitter.on('app:reset', () => {
      state.pages.items = []
    })

    emitter.on('pages:fetch', data => {
      state.pages.isLoading = true

      /**
       * Query the Prismic API
       */

      Prismic.api(process.env.PRISMIC_API).then(api => {
        let query
        if (data.uid) {
          query = api.getByUID(data.type, data.uid, { ref: state.ref })
        } else if (data.single) {
          query = api.getSingle(data.single, { ref: state.ref })
        } else {
          const predicates = []

          if (data.tags) {
            predicates.push(Prismic.Predicates.at('document.tags', data.tags))
          }

          if (data.fields) {
            for (const [key, value] of Object.entries(data.fields)) {
              predicates.push(Prismic.Predicates.lt(`my.${key}`, value))
            }
          }

          if (!predicates.length) {
            throw notFound()
          } else {
            predicates.unshift(Prismic.Predicates.at('document.type', 'page'))
            query = api.query(predicates, { ref: state.ref })
          }
        }

        return query.then(response => {
          const doc = response && (response.results || response)
          if (!doc) { throw notFound() }
          state.pages.isLoading = false
          state.pages.items = unique(state.pages.items.concat(doc))
          emitter.emit(state.events.RENDER)
        })
      }).catch(err => {
        state.pages.isLoading = false
        emitter.emit('error', { status: 503, error: err })
      })
    })
  }
}

function unique (list) {
  const used = {}

  return list.filter(doc => {
    return used[doc.id] ? false : (used[doc.id] = true)
  })
}

function notFound () {
  const err = new Error(__('Page not found'))
  err.status = 404
  return err
}
