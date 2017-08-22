const Router = require('koa-router');
const Prismic = require('prismic-javascript');

const router = module.exports = new Router();

router.get('home', '/', async (ctx, next) => {
  await next();

  /**
   * Fetch all goals
   */

  await Promise.all([
    ctx.prismic.query(
      Prismic.Predicates.at('document.type', 'goal'),
      { orderings: '[my.goal.number]' }
    ).then(body => {
      body.results.forEach(doc => {
        ctx.state.goals.items.push(doc);
      });
    }),
    ctx.prismic.getByUID('landing_page', 'home').then(doc => {
      ctx.state.pages.items.push(doc);
    })
  ]);

  ctx.body = ctx.render(ctx.url);
});
