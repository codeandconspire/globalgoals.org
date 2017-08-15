const Router = require('koa-router');
const Prismic = require('prismic-javascript');

const router = module.exports = new Router();

router.get('home', '/', async (ctx, next) => {
  await next();

  /**
   * Fetch all goals
   */

  await ctx.prismic.query(
    Prismic.Predicates.at('document.type', 'goal'),
    { orderings: '[my.goal.number]' }
  ).then(({ results }) => {

    /**
     * Insert goals at their proper place in `state.goals`
     */

    results.forEach(doc => {
      ctx.state.goals[doc.data.number - 1] = doc;
    });
  });

  ctx.body = ctx.render(ctx.url);
});
