const Router = require('koa-router');
const Prismic = require('prismic-javascript');

const router = module.exports = new Router();

/**
 * Catch all goals as just numbers `/15` with optional slug `/12-foo-bar`
 */

router.get('goal', '/:goal(\\d{1,2}):slug(-[-\\w]+)?', async (ctx, next) => {
  await next();

  const { goal, slug, referrer } = ctx.params;

  const doc = await ctx.prismic.query(
    // TODO: Use `Prismic.Predicate` once prismic resolves https://github.com/prismicio/prismic-javascript/pull/16
    // Prismic.Predicates.any('my.goal.number', goal);
    `[:d = at(my.goal.number, ${ goal })]`
  ).then(body => {
    // TODO: Translate
    ctx.assert(body.results.length, 404, `There is no goal #${ ctx.params.goal }`);
    return body.results[0];
  });

  /**
   * Redirect to complete and correct url if slug is missing
   */

  if (!doc.slugs.includes(slug)) {
    return ctx.redirect(ctx.router.url('goal', {
      goal: goal,
      referrer: referrer,
      slug: doc.slugs[0]
    }));
  }

  ctx.state.goals[doc.data.number - 1] = doc;
  ctx.body = ctx.render(ctx.url);
});
