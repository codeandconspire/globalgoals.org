const Router = require('koa-router');
const friendlyUrl = require('friendly-url');

const router = new Router();

/**
 * Catch all goals as just numbers `/15` with optional slug `/12-foo-bar`
 */

router.get('goal', '/:goal(\\d+):slug(-[-\\w]+)?', async (ctx, next) => {
  await next();

  /**
   * Redirect to complete url with slug if accessing just the goal number
   */

  if (!ctx.params.slug) {
    return ctx.redirect(ctx.router.url('goal', {
      goal: ctx.params.goal,
      referrer: ctx.params.referrer,
      slug: friendlyUrl('Foo Bar') // TODO: Fetch actual goal name
    }));
  }

  ctx.body = ctx.render(ctx.url);
});

module.exports = router;
