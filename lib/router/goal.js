const Router = require('koa-router');
const friendlyUrl = require('friendly-url');

const router = new Router();

/**
 * Catch all goals as just numbers `/15` with optional name `/12-foo-bar`
 */

router.get('goal', '/:goal(\\d+):slug(-[-\\w]+)?', (ctx, next) => {

  /**
   * Redirect to complete url with slug if accessing just the goal number
   */

  if (!ctx.params.slug) {
    return ctx.redirect(router.url('goal', {
      goal: ctx.params.goal,
      referrer: ctx.params.referrer,
      slug: `-${ friendlyUrl('Foo Bar') }` // TODO: Fetch actual goal name
    }));
  }

  /**
   * Stoopid capitalizer of slug
   * TODO: Fetch actual goal from db
   */

  const name = ctx.params.slug
    .substr(1)
    .split('-')
    .map(str => str[0].toUpperCase() + str.substr(1))
    .join(' ');

  /**
   * Render view
   * TODO: Actually render view
   */

  ctx.body = `${ ctx.params.goal }: ${ name }`;

  return next();
});

module.exports = router;
