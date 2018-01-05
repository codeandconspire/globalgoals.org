const Prismic = require('prismic-javascript')
const Router = require('koa-router')
const { href } = require('../params')

const TRAILING_SLASH = '(/)?'

const router = module.exports = new Router({ strict: false })

const routeMap = {
  // Activities
  '/prayer-for-everyone': 'http://www.prayerforeveryone.org',
  '/healthynothungry': '/activities/healthy-not-hungry',
  '/girls-progress': '/activities/dayofthegirl',
  '/dayofthegirl': '/activities/dayofthegirl',
  '/join-the-movement-girls/': '/activities/dayofthegirl',
  '/goalkeepers/datareport(.*)?': '/activities/datareport',
  '/goalkeepers(.*)?': '/activities/goalkeepers',
  '/leavenowomanbehind': '/activities/leave-no-woman-or-girl-behind',
  '/worlds-largest-lesson': '/activities/worlds-largest-lesson',

  // Pages
  '/global-goals': '/',
  '/anti-corruption': '/anti-corruption-policy',
  '/privacy': '/privacy-policy',
  '/take-action': '/',
  '/resource-centre(.*)?': '/resources',
  '/media-centre(.*)?': '/resources',
  '/tell-everyone(.*)?': '/media',
  '/outcomes(.*)?': '/',
  '/films': 'http://www.project-everyone.org/films/',
  'dizzy-goals': '/news/gareth-bale-dizzy-goals',
  'dizzygoalsgame': 'https://dizzygoalsgame.globalgoals.org/',

  // Other
  '/radio-everyone-partners': 'http://www.project-everyone.org/radio-everyone/',
  '/cinema': 'https://www.youtube.com/watch?v=7V3eSHgMEFM',
  '/2015/09/29/download-the-global-goals-app': 'https://sdgsinaction.com/',
  '/now': 'https://sdgsinaction.com/'
}

Object.keys(routeMap).forEach(route => {
  router.get(route + TRAILING_SLASH, ctx => ctx.redirect(routeMap[route]))
})

router.get('/global-goals/:legacy_slug', ctx => {
  return ctx.prismic.query(
    Prismic.Predicates.at('my.goal.legacy_slug', ctx.params.legacy_slug)
  ).then(body => {
    if (!body.results.length) {
      ctx.redirect('/')
    } else {
      const doc = body.results[0]
      ctx.redirect(href(doc))
    }
  })
})
