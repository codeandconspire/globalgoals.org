const Router = require('koa-router');

const router = module.exports = new Router();

router.get('resources', '/resources', async ctx => {
  const doc = await ctx.prismic.getSingle('resources', { ref: ctx.state.ref });
  ctx.assert(doc, 500, 'Content missing');
  ctx.state.pages.items.push(doc);

  ctx.body = ctx.render(ctx.path);
});
