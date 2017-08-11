const Prismic = require('prismic-javascript');

module.exports = async function prismic(ctx, next) {
  ctx.prismic = await Prismic.api(process.env.PRISMIC_API, {
    req: ctx.req
  });

  return next();
};
