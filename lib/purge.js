var cccpurge = require('cccpurge')
var Prismic = require('prismic-javascript')
const params = require('./params')
const { getCode } = require('./locale')

const protocol = /^https?:\/\//

module.exports = purge

function purge (urls, callback = Function.prototype) {
  if (typeof urls === 'function') {
    callback = urls
    urls = []
  }

  /**
   * Ensure to purge all queried layouts
   */

  for (let i = 1; i <= process.env.GLOBALGOALS_NUMBER_OF_GRID_LAYOUT; i++) {
    urls.push(`/?layout=${i}`)
  }

  cccpurge(require('./app'), {
    urls: urls,
    resolve: resolve,
    root: process.env.GLOBALGOALS_URL,
    zone: process.env.CLOUDFLARE_ZONE,
    email: process.env.CLOUDFLARE_EMAIL,
    key: process.env.CLOUDFLARE_KEY
  }, callback)
}

function resolve (route, done) {
  switch (route) {
    case '/:path': {
      return Prismic.api(process.env.PRISMIC_API).then(api => {
        return Promise.all([
          api.query(Prismic.Predicates.at('document.type', 'goal')),
          api.query(Prismic.Predicates.at('document.type', 'page'))
        ]).then(res => {
          const docs = res.reduce((all, { results }) => all.concat(results), [])
          const urls = docs.map(params.href)

          for (const parent of docs.filter(doc => doc.type === 'page')) {
            for (const item of parent.data.menu) {
              urls.push(params.resolve(params.routes.sub_page, {
                parent: parent,
                child: item.link
              }))
            }
          }

          done(null, urls.filter((url) => !protocol.test(url)))
        })
      }).catch(done)
    }
    case '/zh/:path':
    case '/es/:path':
    case '/fr/:path':
    case '/ja/:path':
    case '/ru/:path':
    case '/sv/:path': {
      return Prismic.api(process.env.PRISMIC_API).then(api => {
        const lang = route.match(/^\/(\w{2})/)
        const opts = { lang: getCode(lang[1]) }
        const query = Prismic.Predicates.at('document.type', 'goal')
        return api.query(query, opts).then(response => {
          done(null, response.results.map(params.href))
        })
      }).catch(done)
    }
    case '/news/:article': {
      return Prismic.api(process.env.PRISMIC_API).then(api => {
        return api.query(
          Prismic.Predicates.at('document.type', 'news'),
          { pageSize: 100 }
        ).then(response => {
          var urls = response.results.map(params.href)

          if (response.total_pages > 1) {
            let pages = []
            for (let i = 2; i <= response.total_pages; i++) {
              pages.push(api.query(
                Prismic.Predicates.at('document.type', 'news'),
                { pageSize: 100, page: i }
              ).then(response => {
                return response.results.map(params.href)
              }))
            }
            return Promise.all(pages).then(urlsPerPage => {
              return urlsPerPage.reduce((flat, list) => flat.concat(list), urls)
            })
          }

          return urls
        }).then((urls) => done(null, urls)).catch(done)
      })
    }
    default: return done(null)
  }
}
