const Prismic = require('prismic-javascript');
const Router = require('koa-router');

const TAG_REGEX = /^goal-(\d{1,2})$/;

const router = module.exports = new Router();

router.get('page', '/:page', async ctx => {
  /**
   * Optimistically lookup pages by root path
   */

  const doc = await ctx.prismic.getByUID('page', ctx.params.page, {
    ref: ctx.state.ref
  }).then(doc => {
    ctx.assert(doc, 404);
    ctx.state.pages.items.push(doc);
    return doc;
  });

  /**
   * Isolate goals tagged in document
   */

  const goals = doc.tags
    .map(tag => tag.match(TAG_REGEX))
    .filter(Boolean)
    .map(match => parseInt(match[1], 10));

  /**
   * Fetch goals and populate state
   */

  if (goals.length) {
    await ctx.prismic.query(Prismic.Predicates.any('my.goal.number', goals), {
      ref: ctx.state.ref
    }).then(response => {
      ctx.state.goals.items.push(...response.results);
    });
  }

  ctx.body = ctx.render(ctx.url);
});
