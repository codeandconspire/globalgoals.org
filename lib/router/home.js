const Router = require('koa-router')
const Prismic = require('prismic-javascript')

const ORDERINGS = '[my.news.original_publication_date desc, document.first_publication_date desc]'
const GRID_SIZE = 6
const GRID_SLICE = /^link|page_link|twitter|instagram$/

const router = module.exports = new Router()

router.get('/', ctx => {
  return Promise.all([
    // All goals
    ctx.prismic.query(
      Prismic.Predicates.at('document.type', 'goal'),
      {orderings: '[my.goal.number]'}
    ).then(response => {
      ctx.state.goals.items.push(...response.results)
    }),
    // Page content
    ctx.prismic.getSingle('home_page').then(async doc => {
      ctx.assert(doc, 500, 'Content missing')

      // Internal links
      const links = doc.data.body
        .filter(slice => {
          const link = slice.primary.link
          return link && link.link_type === 'Document' && !link.isBroken
        })
        .map(slice => slice.primary.link.id)

      const grid = doc.data.body.filter(slice => GRID_SLICE.test(slice.slice_type))
      if (grid.length < GRID_SIZE) {
        await ctx.prismic.query(
          Prismic.Predicates.at('document.type', 'news'),
          { pageSize: GRID_SIZE - grid.length, orderings: ORDERINGS }
        ).then(response => {
          ctx.state.articles.items.push(...response.results)
        })
      }

      await ctx.prismic.query(
        Prismic.Predicates.in('document.id', links)
      ).then(response => {
        ctx.assert(response.results_size === links.length, 500)
        response.results.forEach(doc => {
          switch (doc.type) {
            case 'goal': break
            case 'news': ctx.state.articles.items.push(doc); break
            default: ctx.state.pages.items.push(doc); break
          }
        })
      })

      ctx.state.pages.items.push(doc)
    })
  ])
})

/**
 * Fetch all pages tagged as organisations
 */

router.get('/organisations', ctx => {
  return Promise.all([
    populate(ctx),
    ctx.prismic.query([
      Prismic.Predicates.at('document.type', 'page'),
      Prismic.Predicates.at('document.tags', ['organisation'])
    ]).then(response => {
      ctx.state.pages.items.push(...response.results)
    })
  ])
})

/**
 * Fetch all goals
 */

router.get('/media', ctx => {
  return Promise.all([
    populate(ctx),
    ctx.prismic.query(
      Prismic.Predicates.at('document.type', 'goal'),
      {orderings: '[my.goal.number]'}
    ).then(response => {
      ctx.state.goals.items.push(...response.results)
    })
  ])
})

/**
 * Fetch home page
 */

router.get(['/faq', '/follow'], populate)

function populate (ctx) {
  return ctx.prismic.getSingle('home_page').then(doc => {
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
  })
}
