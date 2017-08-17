const Prismic = require('prismic-javascript');
const Router = require('koa-router');

const GOAL_TAG = /^goal-(\d{1,2})$/;

const router = module.exports = new Router();

router.get('initiatives', '/initiatives', async (ctx, next) => {
  await next();

  /**
   * Get all initiatives
   */

  ctx.state.initiatives.items = await ctx.prismic.query(
    Prismic.Predicates.at('document.type', 'initiative')
  ).then(body => body.results);

  ctx.body = ctx.render(ctx.url);
});

router.get('initiative', '/initiatives/:initiative', async (ctx, next) => {
  await next();

  const { initiatives } = ctx.state;

  /**
   * Get intiative
   */

  if (!initiatives.items.find(doc => doc.uid === ctx.params.initiative)) {
    await ctx.prismic.query(
      Prismic.Predicates.at('my.initiative.uid', ctx.params.initiative)
    ).then(body => {
      ctx.assert(body.results.length, 404);
      initiatives.items.push(body.results[0]);
    });
  }

  /**
   * Get all goals that are tagged on this initative
   */

  const tags = goalTags(initiatives.items);
  if (tags.length) {
    await ctx.prismic.query(
      Prismic.Predicates.any('my.goal.number', tags)
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
