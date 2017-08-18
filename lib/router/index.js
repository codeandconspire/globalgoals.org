const Router = require('koa-router');
const pathToRegExp = require('path-to-regexp');
const { encode, parse, extend } = require('../params');

/**
 * Patch `route.url` adding on param prefixes and such
 */

const _url = Router.prototype.url;
Router.prototype.url = function url(name, params) {
  return _url.call(this, name, encode(params));
};

const router = module.exports = new Router();

/**
 * Application routes
 */

const routes = [
  require('./redirects'),
  require('./home'),
  require('./goal'),
  require('./initiatives'),
  require('./news'),
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
  }, {});

/**
 * Pipe all routes through a "master" router that orchestrates everything
 */

router.use('', ...routes.reduce((stack, middleware) => {

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

  if (ctx.params) {
    ctx.params = parse(ctx.params);
  }

  /**
   * Because we stuff all routes under one router, its route ('') will always
   * be the best match. Fix that by assigning the (only) matching named route as
   * matched route.
   * WARNING: We assume all named routes are unique and only one can ever match.
   */

  if (ctx.matched && !ctx._matchedRouteName) {
    const match = ctx.matched.find(layer => layer.name);
    ctx._matchedRoute = match.path;
    ctx._matchedRouteName = match.name;
  }

  /**
   * Expose all named routes
   */

  ctx.state.routes = namedRoutes;

  return next();
}
