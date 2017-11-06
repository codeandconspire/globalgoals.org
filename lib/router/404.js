const Router = require('koa-router')

const router = module.exports = new Router()

router.get('404', '/*', async (ctx, next) => {
  ctx.status = 404
  ctx.body = ctx.render('/404')
})
