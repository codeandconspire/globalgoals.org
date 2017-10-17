const Prismic = require('prismic-javascript');
const Router = require('koa-router');
const { href } = require('../params');

const router = module.exports = new Router();

router.post(process.env.PRISMIC_HOOK, async ctx => {
  const { body } = ctx.request;

  ctx.assert(
    body && body.secret === process.env.PRISMIC_SECRET,
    403,
    'Secret mismatch'
  );

  return new Promise((resolve, reject) => {
    ctx.cache.clear(err => {
      if (err) { return reject(err); }
      ctx.cache.set(body.type, Date.now(), null, err => {
        if (err) { return reject(err); }
        ctx.type = 'application/json';
        ctx.status = 200;
        ctx.body = JSON.stringify({ result: 'success', status: 200 });
        resolve();
      });
    });
  });
});

router.get(process.env.PRISMIC_PREVIEW, async ctx => {
  const { token } = ctx.query;
  const linkResolver = doc => href(ctx.state, doc);

  await new Promise((resolve, reject) => {
    ctx.prismic.previewSession(token, linkResolver, '/', (err, redirectUrl) => {
      if (err) { return reject(err); }
      resolve(redirectUrl);
    });
  }).then(url => {
    ctx.cookies.set(Prismic.previewCookie, token, {
      expires: new Date(Date.now() + (1000 * 60 * 30)), // 30 min (default Prismic cokie session)
      path: '/',
      httpOnly: false
    });
    ctx.redirect(url);
  });
});
