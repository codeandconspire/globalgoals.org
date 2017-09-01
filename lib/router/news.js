const Prismic = require('prismic-javascript');
const Router = require('koa-router');

const GOAL_TAG = /^goal-(\d{1,2})$/;

const router = module.exports = new Router();

router.get('news', '/news', async (ctx, next) => {
  await next();

  ctx.state.articles.page = ctx.query.page || ctx.state.articles.page;

  /**
   * Fetch page contents
   */

  await Promise.all([
    ctx.prismic.query(
      Prismic.Predicates.at('document.type', 'news'),
      {
        pageSize: ctx.state.articles.pageSize,
        page: ctx.state.articles.page,
        orderings: '[my.news.original_publication_date, document.first_publication_date]'
      }
    ).then(body => {
      ctx.state.articles.items = body.results;
    }),
    ctx.prismic.getByUID('landing_page', 'news').then(doc => {
      ctx.assert(doc, 500, 'Content missing');
      ctx.state.pages.items.push(doc);
    })
  ]);

  ctx.body = ctx.render(ctx.path);
});

router.get('article', '/news/:article', async (ctx, next) => {
  await next();

  const { articles } = ctx.state;

  /**
   * Get article
   */

  if (!articles.items.find(doc => doc.uid === ctx.params.article)) {
    await ctx.prismic.query(
      Prismic.Predicates.at('my.news.uid', ctx.params.article)
    ).then(body => {
      ctx.assert(body.results.length, 404);
      articles.items.push(body.results[0]);
    });
  }

  /**
   * Get all goals that are tagged on this article
   */

  const tags = goalTags(articles.items);
  if (tags.length) {
    await ctx.prismic.query(
      Prismic.Predicates.any('my.goal.number', tags)
    ).then(body => {
      body.results.forEach(doc => {
        ctx.state.goals.items.push(doc);
      });
    });
  }

  ctx.body = ctx.render(ctx.path);
});

/**
 * Get a list of all goals that are tagged in given list of documents
 *
 * @param {Prismic.Document[]} docs List of Prismic documents (with tags)
 * @returns {string[]}
 */

function goalTags(docs) {
  return docs.reduce((all, doc) => {
    return all.concat(doc.tags.map(tag => tag.match(GOAL_TAG)));
  }, []).filter(Boolean).map(match => +match[1]);
}
