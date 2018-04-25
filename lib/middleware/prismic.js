const Prismic = require('prismic-javascript')
const { getCode } = require('../locale')

module.exports = async function prismicApi (ctx, next) {
  const previewCookie = ctx.cookies.get(Prismic.previewCookie)

  /**
   * Expose the Prismic api on the context object
   */

  const init = Date.now()
  const api = ctx.prismic = await Prismic.api(process.env.PRISMIC_API, {
    req: ctx.req,
    apiCache: ctx.cache,
    apiDataTTL: 60 * 60 * 24 * 7
  })

  /**
   * Extend state with additional info related to the Prismic api
   */

  let ref = ctx.cache.get('ref')
  if (!ref) {
    ref = api.refs.find(ref => ref.isMasterRef)
    ctx.cache.set('ref', ref)
  }

  ctx.state.isEditor = !!previewCookie
  ctx.state.ref = previewCookie || process.env.PRISMIC_REF || ref.ref

  ctx.track.timing('Init', 'api', Date.now() - init, 'Prismic').send()

  /**
   * Capture and track all queries to Prismic
   */

  const _query = api.query
  api.query = async function query (predicates, opts = {}, callback) {
    const start = Date.now()

    if (typeof opts === 'function') {
      callback = opts
      opts = {}
    }

    opts.ref = opts.ref || ctx.state.ref
    opts.lang = opts.lang || getCode(ctx.state.lang)

    try {
      const response = await _query.call(this, predicates, opts, callback)

      ctx.track.timing(
        'Query',
        Array.isArray(predicates) ? predicates.join(',') : predicates,
        Date.now() - start,
        'Prismic'
      ).send()

      return response
    } catch (err) {
      await ctx.track.exception(err.message).send()
      throw err
    }
  }

  return next()
}
