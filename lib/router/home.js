const Router = require('koa-router')
const Prismic = require('prismic-javascript')

const router = module.exports = new Router()

router.get('/', ctx => {
  return ctx.prismic.getSingle('home_page').then(doc => {
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
  })
})
