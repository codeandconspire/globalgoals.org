const Koa = require('koa');
const static = require('koa-static');
const body = require('koa-body');
const router = require('./lib/router');
const render = require('./lib/middleware/render');
const prismic = require('./lib/middleware/prismic');
const catchall = require('./lib/middleware/catchall');
const app = require('./lib/app');

const server = new Koa();

/**
 * Compile and serve assets on demand during development
 */

if (process.env.NODE_ENV === 'development') {
  server.use(require('./lib/middleware/assets'));
}

/**
 * Serve static files
 * TODO: Either implement HTTP/2 Push or check for dev environment
 */

server.use(static('assets'));

/**
 * Parse request body
 */

server.use(body());

/**
 * Hook up the Prismic api
 */

server.use(prismic);

/**
 * Handle rendering response
 */

server.use(render(app));

/**
 * Guard against any downstream errors
 */

server.use(catchall);

/**
 * Hook up em' routes
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
