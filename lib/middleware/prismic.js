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

  const master = api.refs.find(ref => ref.isMasterRef)
  ctx.state.isEditor = !!previewCookie
  ctx.state.ref = previewCookie || process.env.PRISMIC_REF || master.ref

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

  await next()

  /**
   * Populate inital state with meta data on page size
   */

  try {
    await Promise.all([
      api.query(
        Prismic.Predicates.at('document.type', 'goal'),
        { pageSize: 1 }
      ).then(body => {
        ctx.state.goals.total = body.total_results_size
      }),
      api.query(
        Prismic.Predicates.at('document.type', 'activity'),
        { pageSize: 1 }
      ).then(body => {
        ctx.state.activities.total = body.total_results_size
      }),
      api.query(
        Prismic.Predicates.at('document.type', 'news'),
        { pageSize: 1 }
      ).then(body => {
        ctx.state.articles.total = body.total_results_size
      })
    ])
  } catch (err) {
    /**
     * Failure isn't really fatal but the client won't work if this meta data is
     * missing so tag state as being static
     */

    ctx.state.isStatic = true
  }
}
