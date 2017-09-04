const Prismic = require('prismic-javascript');

module.exports = async function prismicApi(ctx, next) {
  ctx.prismic = await Prismic.api(process.env.PRISMIC_API, {
    req: ctx.req,
    apiCache: ctx.cache,
    apiDataTTL: 60 * 60 * 24
  });

  return next();
};
