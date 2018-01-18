const Prismic = require('prismic-javascript')
const Router = require('koa-router')
const { href, resolve } = require('../params')
const cors = require('@koa/cors')

const TRAILING_SLASH = '(/)?'

const router = module.exports = new Router({ strict: false })

// Todo: The redirects below should be handled by the DNS when possible
const routeMap = {
  // Files
  '/goalkeepers/datareport/assets/fonts/GiorgioSans-Bold-Web.woff': 'https://prismic-io.s3.amazonaws.com/globalgoals%2Fd976a888-bd06-4f65-86e7-a92575207065_giorgiosans-bold-web.woff',
  '/goalkeepers/datareport/assets/fonts/GiorgioSans-Regular-Web.woff': 'https://prismic-io.s3.amazonaws.com/globalgoals%2Fa29752fd-91d4-4cd8-8c35-95f98cda79ba_giorgiosans-regular-web.woff',
  '/goalkeepers/datareport/assets/fonts/34A6BC_0_0.woff2': 'https://prismic-io.s3.amazonaws.com/globalgoals%2F8f79d7d6-b684-46f8-ac84-ca4822155ac0_34a6bc_0_0.woff2',
  '/goalkeepers/datareport/assets/fonts/34A6BC_0_0.woff': 'https://prismic-io.s3.amazonaws.com/globalgoals%2Fd0adddd9-4334-46f8-b21b-19236c75671d_34a6bc_0_0.woff',
  '/goalkeepers/datareport/assets/fonts/34A6BC_0_0.ttf': 'https://prismic-io.s3.amazonaws.com/globalgoals%2F768a4a2a-3168-4cdf-af16-65592e80827d_34a6bc_0_0.ttf',
  '/goalkeepers/datareport/assets/fonts/34A6BC_1_0.woff2': 'https://prismic-io.s3.amazonaws.com/globalgoals%2F023d7401-067a-4993-8295-4328caef10f8_34a6bc_1_0.woff2',
  '/goalkeepers/datareport/assets/fonts/34A6BC_1_0.woff': 'https://prismic-io.s3.amazonaws.com/globalgoals%2Fc15a14ef-cd53-446b-83ea-19a1dd43a4b1_34a6bc_1_0.woff',
  '/goalkeepers/datareport/assets/fonts/34A6BC_1_0.ttf': 'https://prismic-io.s3.amazonaws.com/globalgoals%2Fd9a67106-4a02-4da4-b13b-27ac603522a3_34a6bc_1_0.ttf',

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
  router.get(route + TRAILING_SLASH, cors({origin: '*'}), ctx => {
    const path = ctx.params['0'] ? ctx.params['0'].replace(/^\//, '') : ''
    ctx.redirect(resolve(routeMap[route].replace('$1', path)))
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
