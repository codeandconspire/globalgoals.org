const { fromError } = require('../../components/base/utils')
const Prismic = require('prismic-javascript')

const ORDERINGS = '[my.news.original_publication_date desc, document.first_publication_date desc]'

module.exports = function (batch) {
  return function (state, emitter) {
    emitter.on('app:reset', () => {
      state.articles.page = 1
      state.articles.items = []
      state.articles.pages = []
      state.articles.tags = []
      state.articles.error = null
      state.articles.total = null
    })

    emitter.on('articles:paginate', page => {
      const { total, items } = state.articles

      state.articles.page = page

      if (state.query.page) {
        // Loose the query to prevent messing up the page index on next render
        delete state.query.page
        const href = state.href.replace(/\?.+?(?:#|$)/, window.location.hash)
        window.history.replaceState({}, state.title, href)
      }

      if (!total || !items.length < total) {
        emitter.emit('articles:fetch')
      } else {
        emitter.emit(state.events.RENDER)
      }
    })

    emitter.on('articles:fetch', batch((data, query) => {
      state.articles.isLoading = true

      const predicates = []
      const options = { orderings: ORDERINGS }
      const page = state.query.page ? +state.query.page : state.articles.page

      if (!data) {
        predicates.push(Prismic.Predicates.at('document.type', 'news'))
        options.pageSize = state.articles.pageSize
        options.page = page
      } else if (data.uid) {
        // Get article by uid
        predicates.push(Prismic.Predicates.at('my.news.uid', data.uid))
      } else if (data.tags) {
        // Cache that these tags have been fetched
        state.articles.tags.push(...data.tags)

        // Get all articles with matching tags
        predicates.push(
          Prismic.Predicates.at('document.type', 'news'),
          Prismic.Predicates.at('document.tags', data.tags)
        )
      }

      return query(predicates, options).then(response => {
        // Identify which articles we did not already have
        const newcomers = response.results.filter(result => {
          return !state.articles.items.find(doc => doc.id === result.id)
        })

        if (!data) {
          state.articles.pages[page - 1] = response.results.map(item => item.id)
        }

        state.articles.error = null
        state.articles.isLoading = false
        state.articles.items = state.articles.items.concat(newcomers)
        state.articles.total = response.total_results_size
      }).catch(err => {
        state.articles.isLoading = false
        if (!data || typeof data.critical === 'undefined' || data.critical) {
          emitter.emit('error', { status: err.status || 503, error: err })
        } else {
          state.articles.error = fromError(err)
          emitter.emit('render')
        }
      })
    }))
  }
}
