const Router = require('koa-router');

const router = new Router();

router.get('home', '/', (ctx, next) => {

  /**
   * Render view
   * TODO: Actually render view
   */

  ctx.body = 'Hello world!';

  return next();
});

module.exports = router;
