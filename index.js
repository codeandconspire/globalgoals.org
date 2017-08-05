const Koa = require('koa');
const static = require('koa-static');
const dedent = require('dedent');
const router = require('./lib/router');

const app = new Koa();

/**
 * Serve static files
 * TODO: Either implement HTTP/2 Push or check for dev environment
 */

app.use(static('assets'));

/**
 * Wrap up anything that has been gathered and determin proper data type
 */

app.use(async (ctx, next) => {

  /**
   * Let all other middleware have a go at the request before acting on it
   */

  await next();

  if (ctx.accepts('html')) {

    /**
     * Wrap up HTML response in a document
     */

    ctx.type = 'text/html';
    ctx.body = dedent`
      <!doctype html>
      <html lang="en">
      <head>
        <title>The Global Goals</title>
        <link rel="stylesheet" href="/css/index.css" />
      </head>
      <body>
        ${ ctx.body }
        ${ ctx.params.referrer ? `
          <br />
          Referer id: ${ ctx.params.referrer }
        ` : '' }
      </body>
      </html>
    `;
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

app.use(router.routes());
app.use(router.allowedMethods());

/**
 * Lift off
 */

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`🚀  Server listening at localhost:${ process.env.PORT }`);
});
