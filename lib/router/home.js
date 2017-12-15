const Router = require('koa-router')
const Prismic = require('prismic-javascript')

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
      await Promise.all(doc.data.body
        .filter(slice => {
          const { slice_type: type, primary: { link } } = slice
          return type === 'link' && link.link_type === 'Document' && !link.isBroken
        })
        .map(slice => {
          return ctx.prismic.getByID(slice.primary.link.id).then(doc => {
            ctx.assert(doc, 500, 'Content missing')
            switch (doc.type) {
              case 'goal': break
              case 'activity': ctx.state.activities.items.push(doc); break
              case 'news': ctx.state.articles.items.push(doc); break
              default: ctx.state.pages.items.push(doc); break
            }
          })
        })
      )

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

router.get(['/faq', '/newsletter'], populate)

function populate (ctx) {
  return ctx.prismic.getSingle('home_page').then(doc => {
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
  })
}
