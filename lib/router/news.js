const Prismic = require('prismic-javascript');
const Router = require('koa-router');

const GOAL_TAG = /^goal-(\d{1,2})$/;
const PAGE_SIZE = 6;

const router = module.exports = new Router();

router.get('news', '/news', async (ctx, next) => {
  await next();

  /**
   * Get all articles
   */

  ctx.state.articles.items = await ctx.prismic.query(
    Prismic.Predicates.at('document.type', 'news'),
    {
      pageSize: PAGE_SIZE,
      page: ctx.query.page || 1,
      orderings: '[my.news.original_publication_date, document.first_publication_date]'
    }
  ).then(body => body.results);

  ctx.body = ctx.render(ctx.url);
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
      // Prismic.Predicates.any('my.goal.number', tags)
      // TODO: Use Predicats when prismic accepts PR
      `[:d = any(my.goal.number, [${ tags.join(',') }])]`
    ).then(body => {
      body.results.forEach(doc => {
        ctx.state.goals.items.push(doc);
      });
    });
  }

  ctx.body = ctx.render(ctx.url);
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
  }, []).filter(Boolean).map(match => match[1]);
}
