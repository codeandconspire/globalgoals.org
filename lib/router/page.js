const Router = require('koa-router');

const router = module.exports = new Router();

/**
 * Optimistically lookup pages by root path
 */

router.get('page', '/:page', async (ctx, next) => {

  /**
   * Let all other toutes have a go at the request first
   */

  await next();

  /**
   * If no other route has generated content, try and lookup page by uid
   */

  if (!ctx.body) {
    const doc = await ctx.prismic.getByUID('page', ctx.params.page);
    ctx.assert(doc, 404, 'Page could not be found');
    ctx.state.pages.items.push(doc);
    ctx.body = ctx.render(ctx.url);
  }
});
