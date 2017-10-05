const Prismic = require('prismic-javascript');
const Router = require('koa-router');

const GOAL_TAG = /^goal-(\d{1,2})$/;

const router = module.exports = new Router();

router.get('activities', '/activities', async (ctx, next) => {
  await next();

  /**
   * Fetch page contents
   */

  await Promise.all([
    // All activities
    ctx.prismic.query(
      Prismic.Predicates.at('document.type', 'activity'),
      { ref: ctx.state.ref }
    ).then(body => {
      ctx.state.activities.items = body.results;
    }),
    // Page header
    ctx.prismic.getByUID('landing_page', 'activities', {
      ref: ctx.state.ref
    }).then(doc => {
      ctx.state.pages.items.push(doc);
    })
  ]);

  ctx.body = ctx.render(ctx.path);
});

router.get('activity', '/activities/:activity', async (ctx, next) => {
  await next();

  const { activities } = ctx.state;

  /**
   * Get intiative
   */

  if (!activities.items.find(doc => doc.uid === ctx.params.activity)) {
    await ctx.prismic.query(
      Prismic.Predicates.at('my.activity.uid', ctx.params.activity),
      { ref: ctx.state.ref }
    ).then(body => {
      ctx.assert(body.results.length, 404);
      activities.items.push(body.results[0]);
    });
  }

  /**
   * Get all goals that are tagged on this initative
   */

  const tags = goalTags(activities.items);
  if (tags.length) {
    await ctx.prismic.query(
      Prismic.Predicates.any('my.goal.number', tags),
      { ref: ctx.state.ref }
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
  }, []).filter(Boolean).map(match => parseInt(match[1], 10));
}
