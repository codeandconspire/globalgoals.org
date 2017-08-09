const Router = require('koa-router');
const friendlyUrl = require('friendly-url');
const { texts } = require('../components/goals');

const router = new Router();

/**
 * Catch all goals as just numbers `/15` with optional slug `/12-foo-bar`
 */

router.get('goal', '/:goal(\\d+):slug(-[-\\w]+)?', async (ctx, next) => {
  await next();

  /**
   * Redirect to complete and correct url if slug is missing
   */

  const slug = friendlyUrl(texts[ctx.params.goal - 1].title)

  if (ctx.params.slug !== slug) {
    return ctx.redirect(ctx.router.url('goal', {
      goal: ctx.params.goal,
      referrer: ctx.params.referrer,
      slug: slug
    }));
  }

  ctx.body = ctx.render(ctx.url);
});

module.exports = router;
