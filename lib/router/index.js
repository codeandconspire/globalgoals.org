const compose = require('koa-compose');
const pathToRegExp = require('path-to-regexp');
const { parse, extend } = require('../params');

/**
 * Application routes
 */

const routes = [
  require('./404'),
  require('./page'),
  require('./api'),
  require('./prismic'),
  require('./home'),
  require('./goal'),
  tail
];

/**
 * Pluck out all named routes for exposure on state
 */

const namedRoutes = routes
  .filter(middleware => middleware.stack)
  .map(route => route.stack)
  .reduce((layers, layer) => layers.concat(layer), [])
  .filter(layer => layer.name)
  .reduce((stash, layer) => {
    stash[layer.name] = layer.path;
    return stash;
  }, { 'error': '/error' });

/**
 * Compose all routes extending their path with `referrer` in the process
 */

module.exports = compose(routes.reduce((stack, middleware) => {

  /**
   * Non-router middleware are just passed on as-is
   */

  if (!middleware.stack) { return stack.concat(middleware); }

  /**
   * Add the referrer suffix path to all routes
   */

  middleware.stack.forEach(route => {
    if (route.path) {
      route.path = extend(route.path);
      route.paramNames = [];
      route.regexp = pathToRegExp(route.path, route.paramNames, route.opts);
    }
  });

  return stack.concat(middleware.routes(), middleware.allowedMethods());
}, []));

/**
 * Tail route for cleaning up params and such
 */

async function tail(ctx, next) {

  /**
   * Clean up params identified upstream
   */

  ctx.state.params = ctx.params = (ctx.params ? parse(ctx.params) : {});

  /**
   * Expose all named routes
   */

  ctx.state.routes = namedRoutes;

  /**
   * Expose matched route name
   */

  ctx.state.routeName = ctx._matchedRouteName;

  return next();
}
