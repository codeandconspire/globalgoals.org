const path = require('path');
const send = require('koa-send');

const ROOT = path.resolve(__dirname, '../assets');
const YEAR = 1000 * 60 * 60 * 24 * 365;
const WEEK = 1000 * 60 * 60 * 24 * 7;

module.exports = async function assets(ctx, next) {
  let done = false;

  if (ctx.method === 'HEAD' || ctx.method === 'GET') {
    try {
      switch (ctx.path) {
        case '/browserconfig.xml':
        case '/site.webmanifest':
          done = await send(ctx, ctx.path, { root: ROOT, maxage: YEAR });
          break;
        default:
          done = await send(ctx, ctx.path, { root: ROOT, maxage: WEEK });
      }
    } catch (err) {
      if (err.status !== 404) {
        throw err;
      }
    }
  }

  if (!done) {
    await next();
  }
};
