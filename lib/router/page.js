const Router = require('koa-router');

const router = module.exports = new Router();

router.get('page', '/:page', async (ctx, next) => {
  await next();

  /**
   * Optimistically lookup pages by root path
   */

  if (!ctx.body) {
    const doc = await ctx.prismic.getByUID('page', ctx.params.page, {
      ref: ctx.state.ref
    });

    if (doc) {
      ctx.state.pages.items.push(doc);
      ctx.body = ctx.render(ctx.url);
    } else {
      ctx.throw(404);
    }
  }
});
