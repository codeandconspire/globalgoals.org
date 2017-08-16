const Router = require('koa-router');

const router = module.exports = new Router();

/**
 * Optimistically lookup pages by root path
 */

router.get('/:page', async (ctx, next) => {
  await next();
  const doc = await ctx.prismic.getByUID('page', ctx.params.page);

  ctx.assert(doc, 404, 'Page could not be found');

  ctx.state.pages.items.push(doc);

  ctx.body = ctx.render(ctx.url);
});
