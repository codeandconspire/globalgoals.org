const Router = require('koa-router');

const router = new Router();

router.get('home', '/', async (ctx, next) => {
  await next();

  /**
   * Render view
   * TODO: Actually render view
   */

  ctx.body = 'Hello world!';
});

module.exports = router;
