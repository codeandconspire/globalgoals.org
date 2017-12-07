const Prismic = require('prismic-javascript')
const Router = require('koa-router')

const GOAL_TAG = /^goal-(\d{1,2})$/

const router = module.exports = new Router()

router.get('news', '/news', ctx => {
  ctx.state.articles.page = +ctx.query.page || 1

  /**
   * Fetch page contents
   */

  return Promise.all([
    // Articles
    ctx.prismic.query(
      Prismic.Predicates.at('document.type', 'news'),
      {
        ref: ctx.state.ref,
        pageSize: ctx.state.articles.pageSize,
        page: ctx.state.articles.page,
        orderings: '[my.news.original_publication_date desc, document.first_publication_date desc]'
      }
    ).then(body => {
      ctx.state.articles.items = body.results
    }),
    // Page header
    ctx.prismic.getByUID('landing_page', 'news', {
      ref: ctx.state.ref
    }).then(doc => {
      ctx.assert(doc, 500, 'Content missing')
      ctx.state.pages.items.push(doc)
    })
  ])
})

router.get('article', '/news/:article', async ctx => {
  const { articles } = ctx.state

  /**
   * Get article
   */

  if (!articles.items.find(doc => doc.uid === ctx.params.article)) {
    await ctx.prismic.query(
      Prismic.Predicates.at('my.news.uid', ctx.params.article),
      { ref: ctx.state.ref }
    ).then(body => {
      ctx.assert(body.results.length, 404)
      articles.items.push(body.results[0])
    })
  }

  /**
   * Get all goals that are tagged on this article
   */

  const tags = goalTags(articles.items)
  if (tags.length) {
    await ctx.prismic.query(
      Prismic.Predicates.any('my.goal.number', tags),
      { ref: ctx.state.ref }
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
