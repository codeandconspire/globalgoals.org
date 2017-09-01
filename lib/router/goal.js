const Router = require('koa-router');
const Prismic = require('prismic-javascript');
const { __ } = require('../locale');
const { resolve } = require('../params')

const router = module.exports = new Router();

/**
 * Catch all goals as just numbers `/15` with optional slug `/12-foo-bar`
 */

router.get('goal', '/:goal(\\d{1,2}):slug(-[-\\w]+)?', async (ctx, next) => {
  await next();

  const { goal, slug, referrer } = ctx.params;

  const doc = await ctx.prismic.query(
    Prismic.Predicates.at('my.goal.number', goal)
  ).then(body => {
    ctx.assert(body.results.length, 404, __('There is no goal %s', ctx.params.goal));
    return body.results[0];
  });

  /**
   * Redirect to complete and correct url if slug is missing
   */

  if (doc.uid !== slug) {
    return ctx.redirect(resolve(ctx.state.routes.goal, {
      goal: goal,
      referrer: referrer,
      slug: doc.uid
    }));
  }

  ctx.state.goals.items.push(doc);
  ctx.body = ctx.render(ctx.url);
});
