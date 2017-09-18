const Koa = require('koa');
const static = require('koa-static');
const body = require('koa-body');
const helmet = require('koa-helmet');
const router = require('./lib/router');
const { auth, unauthorized } = require('./lib/middleware/auth');
const cache = require('./lib/middleware/cache');
const assets = require('./lib/middleware/assets');
const render = require('./lib/middleware/render');
const prismic = require('./lib/middleware/prismic');
const catchall = require('./lib/middleware/catchall');
const app = require('./lib/app');

const server = new Koa();

/**
 * Basic authentication
 */

if (process.env.AUTH === 'true') {
  server.use(unauthorized);
  server.use(auth({ name: process.env.AUTH_NAME, pass: process.env.AUTH_PASS }));
}

/**
 * Compile and serve assets on demand during development
 */

if (process.env.NODE_ENV === 'development') {
  server.use(require('./lib/middleware/dev'));
}

/**
 * Take extra care to clean up em' headers in production
 */

if (process.env.NODE_ENV !== 'development') {
  server.use(helmet());
}

/**
 * Prevent indexing everything but production
 */

if (process.env.NODE_ENV !== 'production') {
  server.use(require('./lib/middleware/robots'));
}

/**
 * Serve static files
 */

server.use(assets);
server.use(static('public', { maxage: 1000 * 60 * 60 * 24 * 365 }));

/**
 * Set up request cache mechanism
 */

server.use(cache);

/**
 * Parse request body
 */

server.use(body());

/**
 * Guard against any downstream errors
 */

server.use(catchall);

/**
 * Handle rendering response
 */

server.use(render(app));

/**
 * Hook up the Prismic api
 */

server.use(prismic);

/**
 * Hook up em' routes
 */

server.use(router);

/**
 * Lift off
 */

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`🚀  Server listening at localhost:${ process.env.PORT }`);
});
