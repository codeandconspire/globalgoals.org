const Router = require('koa-router');
const Prismic = require('prismic-javascript');

const router = module.exports = new Router();

router.get('home', '/', async (ctx, next) => {
  await next();

  /**
   * Fetch page contents
   */

  await Promise.all([
    // All goals
    ctx.prismic.query(
      Prismic.Predicates.at('document.type', 'goal'),
      {
        orderings: '[my.goal.number]',
        ref: ctx.state.ref
      }
    ).then(body => {
      body.results.forEach(doc => {
        ctx.state.goals.items.push(doc);
      });
    }),
    // Page header
    ctx.prismic.getByUID('landing_page', 'home', {
      ref: ctx.state.ref
    }).then(doc => {
      ctx.assert(doc, 500, 'Content missing');
      ctx.state.pages.items.push(doc);
    })
  ]);

  ctx.body = ctx.render(ctx.path);
});
