const Router = require('koa-router');
const Prismic = require('prismic-javascript');

const router = module.exports = new Router();

router.get('home', '/', async ctx => {
  /**
   * Fetch page contents
   */

  await Promise.all([
    // All goals
    ctx.prismic.query(
      Prismic.Predicates.at('document.type', 'goal'),
      { orderings: '[my.goal.number]', ref: ctx.state.ref }
    ).then(response => {
      ctx.state.goals.items.push(...response.results);
    }),
    // Page content
    ctx.prismic.getSingle('home_page', {
      ref: ctx.state.ref
    }).then(async doc => {
      ctx.assert(doc, 500, 'Content missing');

      // Internal links
      await Promise.all(doc.data.body
        .filter(slice => {
          const { slice_type, primary: { link }} = slice;
          return slice_type === 'link' && link.link_type === 'Document' && !link.isBroken;
        })
        .map(slice => {
          return ctx.prismic.getByID(slice.primary.link.id, {
            ref: ctx.state.ref
          }).then(doc => {
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
