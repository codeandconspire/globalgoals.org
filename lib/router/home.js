const Router = require('koa-router');
const Prismic = require('prismic-javascript');

const router = new Router();

router.get('home', '/', async (ctx, next) => {
  await next();

  await ctx.prismic.query(
    Prismic.Predicates.at('document.type', 'goal'),
    { orderings: '[my.goal.number]' }
  ).then(({ results }) => {
    const goals = [];
    const last = results[results.length - 1];

    for (let i = 1, l = last.data.number; i <= l; i += 1) {
      goals.push(results.find(doc => doc.data.number === i));
    }

    ctx.state.goals = goals;
  });

  ctx.body = ctx.render(ctx.url);
});

module.exports = router;
