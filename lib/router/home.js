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
      { orderings: '[my.goal.number]' }
    ).then(body => {
      body.results.forEach(doc => {
        ctx.state.goals.items.push(doc);
      });
    }),
    // Page content
    ctx.prismic.getSingle('home_page').then(async doc => {
      ctx.assert(doc, 500, 'Content missing');

      // Internal links
      await Promise.all(doc.data.body
        .filter(slice => {
          const { slice_type, primary: { link }} = slice;
          return slice_type === 'link' && link.link_type === 'Document' && !link.isBroken;
        })
        .map(slice => {
          return ctx.prismic.getByID(slice.primary.link.id).then(doc => {
            ctx.assert(doc, 500, 'Content missing');
            switch (doc.type) {
              case 'goal': break;
              case 'activity': ctx.state.activities.items.push(doc); break;
              case 'news': ctx.state.articles.items.push(doc); break;
              default: ctx.state.pages.items.push(doc); break;
            }
          });
        })
      );

      ctx.state.pages.items.push(doc);
    })
  ]);

  ctx.body = ctx.render(ctx.path);
});
