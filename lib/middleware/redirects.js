const cors = require('@koa/cors')
const Router = require('koa-router')
const compose = require('koa-compose')
const Prismic = require('prismic-javascript')
const { languages, getCode } = require('../locale')
const { href, resolve } = require('../params')

const TRAILING_SLASH = '(/)?'

const router = new Router({ strict: false })

// Todo: The redirects below should be handled by the DNS when possible
const routeMap = {
  // Pages
  "/global-goals": "/",
  "/take-action": "/",
  "/anti-corruption": "/anti-corruption-policy",
  "/privacy": "/privacy-policy",
  "/resource-centre(.*)?": "/resources",
  "/media-centre(.*)?": "/resources",
  "/tell-everyone(.*)?": "/media",
  "/outcomes(.*)?": "/",
  "/films": "http://www.project-everyone.org/films/",
  "/radio-everyone-partners": "http://www.project-everyone.org/radio-everyone/",
  "/cinema": "https://www.youtube.com/watch?v=7V3eSHgMEFM",
  "/2015/09/29/download-the-global-goals-app": "https://sdgsinaction.com/",
  "/now": "https://sdgsinaction.com/",
  "/healthynothungry": "/healthy-not-hungry",
  "/leavenowomanbehind": "/leave-no-woman-or-girl-behind",
  "/dizzy-goals": "/news/gareth-bale-dizzy-goals",
  "/dizzygoalsgame": "https://dizzygoalsgame.globalgoals.org/",
  "/goalkeepers/datareport(.*)?": "https://datareport.goalkeepers.org/$1",
  "/datareport(.*)?": "https://datareport.goalkeepers.org/$1",
  "/girls-progress": "http://stash.globalgoals.org/dayofthegirl/",
  "/join-the-movement-girls/": "http://stash.globalgoals.org/dayofthegirl/",
  "/dayofthegirl/": "http://stash.globalgoals.org/dayofthegirl/"
};

Object.keys(routeMap).forEach(route => {
  router.get(route + TRAILING_SLASH, cors({origin: '*'}), ctx => {
    const path = ctx.params['0'] ? ctx.params['0'].replace(/^\//, '') : ''
    ctx.redirect(resolve(routeMap[route].replace('$1', path)))
  })
})

router.get('/global-goals/:legacy_slug', ctx => {
  return Prismic.api(process.env.PRISMIC_API).then(api => {
    return api.query(
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
})

Object.keys(languages).forEach(lang => {
  if (lang === process.env.GLOBALGOALS_LANG) return

  router.get(`/${lang}/global-goals/:legacy_slug`, ctx => {
    ctx.state.lang = lang
    return Prismic.api(process.env.PRISMIC_API).then(api => {
      return api.query(
        Prismic.Predicates.at('my.goal.legacy_slug', ctx.params.legacy_slug),
        { lang: getCode(lang) }
      ).then(body => {
        if (!body.results.length) {
          ctx.redirect(`/${lang}`)
        } else {
          const doc = body.results[0]
          ctx.redirect(href(doc))
        }
      })
    })
  })
})

module.exports = compose([router.routes(), router.allowedMethods()])
