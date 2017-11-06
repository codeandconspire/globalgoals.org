const Prismic = require('prismic-javascript')

const ORDERINGS = '[my.news.original_publication_date desc, document.first_publication_date desc]'

module.exports = function (api) {
  return function (state, emitter) {
    emitter.on('app:reset', () => {
      state.articles.items = []
    })

    emitter.on('articles:goto', goto => {
      const { items, total, pageSize, page } = state.articles
      const max = Math.ceil(total / pageSize)
      const shouldHave = page === max ? total : page * pageSize

      state.articles.page = goto

      if (items !== shouldHave) {
        emitter.emit('articles:fetch')
      }
    })

    emitter.on('articles:fetch', api((data, query) => {
      state.articles.isLoading = true

      const predicates = []
      const options = { orderings: ORDERINGS }

      if (!data) {
        // Set page on first complete fetch
        state.articles.page = state.articles.page || 1

        // Get all articles for current page
        predicates.push(Prismic.Predicates.at('document.type', 'news'))
        Object.assign(options, {
          pageSize: state.articles.pageSize,
          page: state.articles.page
        })
      } else if (data.uid) {
        // Get article by uid
        predicates.push(Prismic.Predicates.at('my.news.uid', data.uid))
      } else if (data.tags) {
        // Cache that these tags have been fetched
        state.articles.fetched.push(...data.tags)

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

        state.articles.isLoading = false
        state.articles.items = state.articles.items.concat(newcomers)
        if (!state.articles.queue) {
          emitter.emit(state.events.RENDER)
        }
      }).catch(err => {
        state.articles.isLoading = false
        emitter.emit('error', { status: err.status || 503, error: err })
      })
    }))
  }
}
