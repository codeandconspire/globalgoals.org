const Router = require('koa-router');
const friendlyUrl = require('friendly-url');
const { texts } = require('../components/goals');

const router = new Router();

/**
 * Catch all goals as just numbers `/15` with optional slug `/12-foo-bar`
 */

router.get('goal', '/:goal(\\d+):slug(-[-\\w]+)?', async (ctx, next) => {
  await next();

  const { goal, slug, referrer } = ctx.params;

  // TODO: Translate
  ctx.assert(texts[+goal - 1], 404, `There is no goal #${ ctx.params.goal }`);

  /**
   * Redirect to complete and correct url if slug is missing
   */

  const title = friendlyUrl(texts[+goal - 1].title);

  if (title !== slug) {
    return ctx.redirect(ctx.router.url('goal', {
      goal: goal,
      referrer: referrer,
      slug: title
    }));
  }

  ctx.body = ctx.render(ctx.url);
});

module.exports = router;
