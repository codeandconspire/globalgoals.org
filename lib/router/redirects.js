const Prismic = require('prismic-javascript')
const Router = require('koa-router')
const { href } = require('../params')

const TRAILING_SLASH = '(/)?'

const router = module.exports = new Router({ strict: false })

// Todo: The redirects below should be handled by the DNS when possible
const routeMap = {
  // Pages
  '/global-goals': '/',
  '/take-action': '/',
  '/anti-corruption': '/anti-corruption-policy',
  '/privacy': '/privacy-policy',
  '/resource-centre(.*)?': '/resources',
  '/media-centre(.*)?': '/resources',
  '/tell-everyone(.*)?': '/media',
  '/outcomes(.*)?': '/',
  '/films': 'http://www.project-everyone.org/films/',

  // Other
  '/radio-everyone-partners': 'http://www.project-everyone.org/radio-everyone/',
  '/cinema': 'https://www.youtube.com/watch?v=7V3eSHgMEFM',
  '/2015/09/29/download-the-global-goals-app': 'https://sdgsinaction.com/',
  '/now': 'https://sdgsinaction.com/',
  '/healthynothungry': '/healthy-not-hungry',
  '/leavenowomanbehind': '/leave-no-woman-or-girl-behind',
  '/dizzy-goals': '/news/gareth-bale-dizzy-goals',
  '/dizzygoalsgame': 'https://dizzygoalsgame.globalgoals.org/',
  '/goalkeepers/datareport(.*)?': 'http://stash.globalgoals.org/goalkeepers/datareport/$1',
  '/datareport(.*)?': 'http://stash.globalgoals.org/goalkeepers/datareport/$1',
  '/girls-progress': 'http://stash.globalgoals.org/dayofthegirl/',
  '/join-the-movement-girls/': 'http://stash.globalgoals.org/dayofthegirl/',
  '/dayofthegirl/': 'http://stash.globalgoals.org/dayofthegirl/'
}

Object.keys(routeMap).forEach(route => {
  router.get(route + TRAILING_SLASH, ctx => {
    const path = ctx.params['0'] ? ctx.params['0'].replace(/^\//, '') : ''
    ctx.redirect(routeMap[route].replace('$1', path))
  })
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
