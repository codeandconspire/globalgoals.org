const Router = require('koa-router');

const router = module.exports = new Router();

router.get('api', '/api', async (ctx, next) => {
  if (ctx.accepts('json')) {
    ctx.body = JSON.stringify(ctx.state);
  } else {
    ctx.throw(406);
  }

  return next();
});

/**
 * Treat everything mathing the api root route as JSON
 */

// router.use((ctx, next) => {
//   ctx.type = 'application/json';
//   return next();
// });
