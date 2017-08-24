const Prismic = require('prismic-javascript');

module.exports = async function prismicApi(ctx, next) {
  ctx.prismic = await Prismic.api(process.env.PRISMIC_API, {
    req: ctx.req,
    apiCache: ctx.cache,
    apiDataTTL: 60 * 60 * 24
  });

  if (ctx.url === '/prismic-hook') {
    const { body } = ctx.request;

    ctx.assert(
      body && body.secret === process.env.PRISMIC_SECRET,
      403,
      'Secret mismatch'
    );

    return await new Promise((resolve, reject) => {
      ctx.cache.clear(err => {
        if (err) { return reject(err); }
        ctx.type = 'application/json';
        ctx.status = 200;
        ctx.body = {};
        resolve();
      });
    });
  } else {
    return next();
  }
};
