const Router = require('koa-router')
const Prismic = require('prismic-javascript')

const router = module.exports = new Router()

router.get('/action', async ctx => {
  await ctx.prismic.query(
    Prismic.Predicates.at('document.type', 'action')
  ).then(response => {
    const doc = response.results[0]
    ctx.assert(doc, 404)
    ctx.state.pages.items.push(doc)

    const links = doc.data.links.map(item => item.link.id)
    return ctx.prismic.query(
      Prismic.Predicates.in('document.id', links)
    ).then(response => {
      ctx.state.pages.items.push(...response.results)
    })
  })
})
