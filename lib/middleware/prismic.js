const retry = require('p-retry')
const Prismic = require('prismic-javascript')
const { getCode } = require('../locale')

module.exports = async function prismicApi (ctx, next) {
  ctx.state.isEditor = Boolean(ctx.cookies.get(Prismic.previewCookie))

  /**
   * Expose the Prismic api on the context object
   */

  const api = ctx.prismic = await retry(getApi, {
    retries: 5
  })

  /**
   * Capture and track all queries to Prismic
   */

  const _query = api.query
  api.query = async function query (predicates, opts = {}, callback) {
    if (typeof opts === 'function') {
      callback = opts
      opts = {}
    }

    opts.lang = opts.lang || getCode(ctx.state.lang)

    return _query.call(this, predicates, opts, callback)
  }

  return next()

  function getApi () {
    return Prismic.api(process.env.PRISMIC_API, { req: ctx.req })
  }
}
