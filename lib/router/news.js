const Router = require('koa-router')
const Prismic = require('prismic-javascript')

const GOAL_TAG = /^goal-(\d{1,2})$/

const router = module.exports = new Router()

router.get('/news', ctx => {
  if (ctx.query.page) {
    ctx.state.articles.page = ctx.state.query.page = +ctx.query.page
  }

  /**
   * Fetch page contents
   */

  return Promise.all([
    // Articles
    ctx.prismic.query(
      Prismic.Predicates.at('document.type', 'news'),
      {
        pageSize: ctx.state.articles.pageSize * ctx.state.articles.page,
        page: ctx.state.articles.page,
        orderings: '[my.news.original_publication_date desc, document.first_publication_date desc]'
      }
    ).then(response => {
      ctx.state.articles.total = response.total_results_size
      ctx.state.articles.items = response.results
    }),
    // Page header
    ctx.prismic.getByUID('landing_page', 'news').then(doc => {
      ctx.assert(doc, 500, 'Content missing')
      ctx.state.pages.items.push(doc)
    })
  ])
})

router.get('/news/:article', async ctx => {
  const { articles } = ctx.state

  /**
   * Get article
   */

  if (!articles.items.find(doc => doc.uid === ctx.params.article)) {
    await ctx.prismic.query(
      Prismic.Predicates.at('my.news.uid', ctx.params.article)
    ).then(response => {
      ctx.assert(response.results.length, 404)
      articles.total = response.total_results_size
      articles.items.push(response.results[0])
    })
  }

  /**
   * Get all goals that are tagged on this article
   */

  const tags = goalTags(articles.items)
  if (tags.length) {
    await ctx.prismic.query(
      Prismic.Predicates.any('my.goal.number', tags)
    ).then(body => {
      body.results.forEach(doc => {
        ctx.state.goals.items.push(doc)
      })
    })
  }
})

/**
 * Get a list of all goals that are tagged in given list of documents
 *
 * @param {Prismic.Document[]} docs List of Prismic documents (with tags)
 * @returns {string[]}
 */

function goalTags (docs) {
  return docs.reduce((all, doc) => {
    return all.concat(doc.tags.map(tag => tag.match(GOAL_TAG)))
  }, []).filter(Boolean).map(match => +match[1])
}
