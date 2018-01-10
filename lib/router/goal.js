const Router = require('koa-router')
const Prismic = require('prismic-javascript')
const { __ } = require('../locale')
const { resolve, href, routes } = require('../params')

const router = module.exports = new Router()

const GOAL_URL = '/:goal(\\d{1,2}):slug(-[-\\w]+)?'
const GRID_SLICE = /link|twitter|instagram/
const GRID_SIZE = 6

router.get(GOAL_URL, populate('goal'), grid, ctx => {
  // noop – prevent from falling through to next router middleware
})

/**
 * List all organisations for goal
 */

router.get(`${GOAL_URL}/organisations`, populate('goal_organisations'), async ctx => {
  ctx.assert(ctx.state.lang === 'en', 404)
  await ctx.prismic.query([
    Prismic.Predicates.at('document.type', 'page'),
    Prismic.Predicates.at('document.tags', [
      'organisation',
      `goal-${ctx.params.goal}`
    ])
  ]).then(response => {
    ctx.state.pages.items.push(...response.results)
  })
})

/**
 * Static pages of goal attributes
 */

router.get(`${GOAL_URL}/media`, populate('goal_media'))
router.get(`${GOAL_URL}/tips-tricks`, populate('goal_tips'))
router.get(`${GOAL_URL}/follow`, populate('goal_follow'))

/**
 * All goals have a sub-route for each sharable media item
 */

router.get(`${GOAL_URL}/media/:media`, populate('goal_media'), grid, async ctx => {
  ctx.assert(ctx.state.lang === 'en', 404)
  const { goal, media } = ctx.params
  const doc = ctx.state.goals.items.find(item => item.data.number === goal)

  /**
   * Don't try and render a media item w/o a slug
   */

  if (!doc.data.media.find(item => item.slug === media)) {
    ctx.redirect(href(doc))
  }
})

/**
 * Fetch goal and redirect missing slug before hitting route middleware
 */

function populate (route) {
  return async (ctx, next) => {
    const goal = ctx.params.goal = parseInt(ctx.params.goal, 10)
    const slug = ctx.params.slug = ctx.params.slug && ctx.params.slug.replace(/^-/, '')

    const doc = await ctx.prismic.query(
      Prismic.Predicates.at('my.goal.number', goal)
    ).then(body => {
      ctx.assert(body.results.length, 404, __('There is no Goal %s', goal))
      return body.results[0]
    })

    /**
     * Redirect to complete and correct url if slug is missing
     */

    if (doc.data.slug !== slug) {
      if (route === 'media') {
        return resolve('media', {
          doc: doc,
          media: doc.data.media.find(item => item.slug === ctx.params.media)
        })
      }
      return ctx.redirect(resolve(routes[route], doc))
    }

    const links = doc.data.body
      .filter(slice => {
        const { slice_type: type, primary: { link } } = slice
        return type === 'link' && link.link_type === 'Document' && !link.isBroken
      })
      .map(slice => slice.primary.link.id)

    await ctx.prismic.query(
      Prismic.Predicates.in('document.id', links)
    ).then(response => {
      ctx.assert(response.results_size === links.length, 500)
      response.results.forEach(doc => {
        switch (doc.type) {
          case 'goal': break
          case 'news': ctx.state.articles.items.push(doc); break
          default: ctx.state.pages.items.push(doc); break
        }
      })
    })

    /**
     * Add docutment to state
     */

    ctx.state.goals.items.push(doc)

    return next()
  }
}

/**
 * Populate grid with up tp `GRID_SIZE` news
 */

async function grid (ctx, next) {
  const doc = ctx.state.goals.items.find(item => {
    return item.data.number === ctx.params.goal
  })

  const tag = `goal-${ctx.params.goal}`
  const grid = doc.data.body.filter(slice => GRID_SLICE.test(slice.slice_type))

  if (grid.length < GRID_SIZE) {
    await ctx.prismic.query([
      Prismic.Predicates.at('document.type', 'news'),
      Prismic.Predicates.at('document.tags', [ tag ])
    ]).then(response => {
      ctx.state.articles.items.push(...response.results)
      ctx.state.articles.tags.push(tag)
    })
  }

  return next()
}
