const Router = require('koa-router');

const router = new Router();

router.get('home', '/', async (ctx, next) => {
  await next();

  ctx.body = ctx.render(ctx.url);
});

module.exports = router;
