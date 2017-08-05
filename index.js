const Koa = require('koa');
const static = require('koa-static');
const router = require('./lib/router');
const document = require('./lib/document');
const app = require('./lib/app');

const server = new Koa();

/**
 * Serve static files
 * TODO: Either implement HTTP/2 Push or check for dev environment
 */

server.use(static('assets'));

/**
 * Expose a render function on context object
 */

server.use((ctx, next) => {
  // TODO: Guess language from header/path/subdomain whatevs
  ctx.state.lang = 'en';
  ctx.render = function render(href) {
    if (ctx.accepts('html')) {
      // Render href to string
      const html = app.toString(href, ctx.state);

      // Snatch up changes that were made to state in the process of rendering
      Object.assign(ctx.state, app.state);

      return html;
    }

    return null;
  };
  return next();
});

/**
 * Wrap up anything that has been gathered and determin proper data type
 */

server.use(async (ctx, next) => {

  /**
   * Let all other middleware have a go at the request before acting on it
   */

  await next();

  if (ctx.accepts('html')) {

    /**
     * Wrap up HTML response in a document
     */

    ctx.type = 'text/html';
    ctx.body = document(ctx.body, ctx.state);
  } else if (ctx.accepts('json')) {

    /**
     * Send the raw state, whateever that may be
     */

    ctx.type = 'application/json';
    ctx.body = JSON.stringify(ctx.state);
  } else {

    /**
     * We only support HTML and JSON
     */

    ctx.status = 406;
  }
});

/**
 * Hook up all em' routes
 */

server.use(router.routes());
server.use(router.allowedMethods());

/**
 * Lift off
 */

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`🚀  Server listening at localhost:${ process.env.PORT }`);
});
