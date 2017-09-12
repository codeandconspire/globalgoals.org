const Router = require('koa-router');

const router = module.exports = new Router();

router.get('/api', async (ctx, next) => {
  await next();

  if (ctx.accepts('json')) {
    ctx.body = ctx.state;
  } else {
    ctx.throw(406);
  }
});
