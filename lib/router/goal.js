const Router = require('koa-router');
const Prismic = require('prismic-javascript');
const { __ } = require('../locale');
const { resolve } = require('../params');

const router = module.exports = new Router();

const GOAL_URL = '/:goal(\\d{1,2}):slug(-[-\\w]+)?';
const GRID_SLICE = /link|twitter|instagram/;
const GRID_SIZE = 6;

/**
 * Catch all goals as just numbers `/15` with optional slug `/12-foo-bar`
 */

router.get('goal', GOAL_URL, goal, async ctx => {
  const doc = ctx.state.goals.items.find(item => {
    return item.data.number === ctx.params.goal;
  });

  const tag = `goal-${ ctx.params.goal }`;
  const grid = doc.data.body.filter(slice => GRID_SLICE.test(slice.slice_type));

  if (grid.length < GRID_SIZE) {
    await ctx.prismic.query([
      Prismic.Predicates.at('document.type', 'news'),
      Prismic.Predicates.at('document.tags', [ tag ])
    ], { ref: ctx.state.ref }).then(response => {
      ctx.state.articles.items.push(...response.results);
      ctx.state.articles.fetched.push(tag);

      if (response.results_size < (GRID_SIZE - grid.length)) {
        return ctx.prismic.query([
          Prismic.Predicates.at('document.type', 'activity'),
          Prismic.Predicates.at('document.tags', [ tag ])
        ], { ref: ctx.state.ref }).then(response => {
          ctx.state.activities.items.push(...response.results);
          ctx.state.activities.fetched.push(tag);
        });
      }
    });
  }

  ctx.body = ctx.render(ctx.path);
});

/**
 * List all organisations for goal
 */

router.get('goal_organisations', `${ GOAL_URL }/organisations`, goal, async ctx => {
  await ctx.prismic.query([
    Prismic.Predicates.at('document.type', 'page'),
    Prismic.Predicates.at('document.tags', ['organisation', `goal-${ ctx.params.goal }`]),
  ], { ref: ctx.state.ref }).then(response => {
    ctx.state.pages.items.push(...response.results);
  });

  ctx.body = ctx.render(ctx.path);
});

/**
 * List all tips and tricks for goal
 */

router.get('goal_newsletter', `${ GOAL_URL }/newsletter`, goal, async ctx => {
  ctx.body = ctx.render(ctx.path);
});


/**
 * List all tips and tricks for goal
 */

router.get('goal_tips', `${ GOAL_URL }/tips-tricks`, goal, async ctx => {
  ctx.body = ctx.render(ctx.path);
});

/**
 * List all media for goal
 */

router.get('goal_media', `${ GOAL_URL }/media`, goal, async ctx => {
  ctx.body = ctx.render(ctx.path);
});

/**
 * All goals have a sub-route for each sharable media item
 */

router.get('media', `${ GOAL_URL }/media/:media`, goal, async ctx => {
  const { goal, slug, referrer, media } = ctx.params;
  const doc = ctx.state.goals.items.find(item => item.data.number === goal);

  /**
   * Don't try and render a media item w/o a slug
   */

  if (!doc.data.media.find(item => item.slug === media)) {
    return ctx.redirect(resolve(ctx.state.routes.goal, {
      goal: goal,
      referrer: referrer,
      slug: slug
    }));
  }

  ctx.body = ctx.render(ctx.path);
});


/**
 * Fetch goal and redirect missing slug before hitting route middleware
 */

async function goal(ctx, next) {
  const { goal, slug, referrer, media } = ctx.params;

  const doc = await ctx.prismic.query(
    Prismic.Predicates.at('my.goal.number', goal),
    { ref: ctx.state.ref }
  ).then(body => {
    ctx.assert(body.results.length, 404, __('There is no goal %s', goal));
    return body.results[0];
  });

  /**
   * Redirect to complete and correct url if slug is missing
   */

  if (doc.uid !== slug) {
    return ctx.redirect(resolve(ctx.state.routes[ctx.state.routeName], {
      goal: goal,
      referrer: referrer,
      slug: doc.uid,
      media: media
    }));
  }

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

  /**
   * Add docutment to state
   */

  ctx.state.goals.items.push(doc);

  return next();
}
