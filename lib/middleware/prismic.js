const Prismic = require('prismic-javascript');

module.exports = async function prismicApi(ctx, next) {
  const previewCookie = ctx.cookies.get(Prismic.previewCookie);

  /**
   * Expose the Prismic api on the context object
   */

  const init = Date.now();
  const api = ctx.prismic = await Prismic.api(process.env.PRISMIC_API, {
    req: ctx.req,
    apiCache: ctx.cache,
    apiDataTTL: 60 * 60 * 24 * 7
  });

  ctx.track.timing('Init', 'api', Date.now() - init, 'Prismic').send();

  /**
   * Capture and track all queries to Prismic
   */

  const _query = api.query;
  api.query = async function query(...args) {
    const start = Date.now();
    const predicates = args.filter(arg => typeof arg === 'string');

    try {
      const response = await _query.apply(this, args);

      ctx.track.timing(
        'Query',
        predicates.join(','),
        Date.now() - start,
        'Prismic'
      ).send();

      return response;
    } catch (err) {
      await ctx.track.exception(err.message).send();
      throw err;
    }
  };

  /**
   * Extend state with additional info related to the Prismic api
   */

  ctx.state.isEditor = !!previewCookie;
  ctx.state.ref = previewCookie || process.env.PRISMIC_REF || api.master();

  /**
   * Populate inital state with meta data on page size
   */

  try {
    await Promise.all([
      api.query(
        Prismic.Predicates.at('document.type', 'goal'),
        { pageSize: 1, ref: ctx.state.ref }
      ).then(body => {
        ctx.state.goals.total = body.total_results_size;
      }),
      api.query(
        Prismic.Predicates.at('document.type', 'activity'),
        { pageSize: 1, ref: ctx.state.ref }
      ).then(body => {
        ctx.state.activities.total = body.total_results_size;
      }),
      api.query(
        Prismic.Predicates.at('document.type', 'news'),
        { pageSize: 1, ref: ctx.state.ref }
      ).then(body => {
        ctx.state.articles.total = body.total_results_size;
      })
    ]);
  } catch (err) {

    /**
     * Failure isn't really fatal but the client won't work if this meta data is
     * missing so tag state as being static
     */

    ctx.state.isStatic = true;
  }

  return next();
};
