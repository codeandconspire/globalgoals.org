const { fromError } = require('../../components/base/utils')
const Prismic = require('prismic-javascript')

module.exports = function (batch) {
  return function (state, emitter) {
    emitter.on('app:reset', () => {
      state.pages.items = []
      state.pages.error = null
    })

    emitter.on('pages:fetch', batch((data, query) => {
      state.pages.isLoading = true

      const predicates = []
      const opts = { fetchLinks: data.include }

      if (data.id) {
        const method = Array.isArray(data.id) ? 'in' : 'at'
        predicates.push(Prismic.Predicates[method](`document.id`, data.id))
      } else if (data.uid) {
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
          Object.keys(data.fields).forEach(key => {
            predicates.push(Prismic.Predicates.lt(`my.${key}`, data.fields[key]))
          })
        }
      }

      query(predicates, opts).then(response => {
        state.pages.error = null
        state.pages.isLoading = false
        state.pages.items = unique(state.pages.items.concat(response.results))
      }).catch(err => {
        state.pages.isLoading = false
        if (!data || typeof data.critical === 'undefined' || data.critical) {
          emitter.emit('error', { status: err.status || 503, error: err })
        } else {
          state.pages.error = fromError(err)
          emitter.emit('render')
        }
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
