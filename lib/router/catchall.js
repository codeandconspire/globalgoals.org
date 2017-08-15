const Router = require('koa-router');

const router = module.exports = new Router();

/**
 * Catch downstream errors and missing routes
 */

router.get('/*', async (ctx, next) => {
  try {
    /**
     * Try downstream routes
     */

    await next();

    /**
     * Catch uncaught routes
     */

    if (!ctx.body) {
      // TODO: Translate
      const err = new Error('This page does not exist');
      err.status = 404;
      err.expose = true;
      throw err;
    }
  } catch (err) {

    /**
     * Render error page
     */

    ctx.status = err.status || 500;
    ctx.state.error = {
      status: ctx.status,
      message: err.expose || process.env.NODE_ENV === 'development' ? err.message : ''
    };
    ctx.body = ctx.render(`/${ ctx.status === 404 ? '404' : 'error' }`);
  }
});
