const Prismic = require('prismic-javascript')
const { __ } = require('../../locale')

const ORDERINGS = '[my.news.original_publication_date desc, document.first_publication_date desc]'

module.exports = function () {
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

    emitter.on('articles:fetch', data => {
      state.articles.isLoading = true

      Prismic.api(process.env.PRISMIC_API).then(api => {
        let query

        /**
         * Figure out the query
         */

        if (!data) {
          // Set page on first complete fetch
          state.articles.page = state.articles.page || 1

          // Get all articles for current page
          query = api.query(Prismic.Predicates.at('document.type', 'news'), {
            ref: state.ref,
            pageSize: state.articles.pageSize,
            page: state.articles.page,
            orderings: ORDERINGS
          })
        } else if (data.uid) {
          // Get article by uid
          query = api.query(Prismic.Predicates.at('my.news.uid', data.uid), {
            ref: state.ref
          })
        } else if (data.tags) {
          // Cache that these tags have been fetched
          state.articles.fetched.push(...data.tags)

          // Get all articles with matching tags
          query = api.query([
            Prismic.Predicates.at('document.type', 'news'),
            Prismic.Predicates.at('document.tags', data.tags)
          ], {
            ref: state.ref,
            orderings: ORDERINGS
          })
        } else {
          const err = new Error(__('Page not found'))
          err.status = 404
          throw err
        }

        /**
         * Query the Prismic API
         */

        return query.then(response => {
          /**
           * Identify which articles we did not already have
           */

          const newcomers = response.results.filter(result => {
            return !state.articles.items.find(doc => doc.id === result.id)
          })

          state.articles.isLoading = false
          state.articles.items = state.articles.items.concat(newcomers)
          emitter.emit(state.events.RENDER)
        })
      }).catch(err => {
        state.articles.isLoading = false
        emitter.emit('error', { status: 503, error: err })
      })
    })
  }
}
