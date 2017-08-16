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

/**
 * Create a master router that orchestrates all the individual routers and
 * handles adding/removing param prefixes
 */

const router = module.exports = new Router();
const routes = [
  require('./redirects'),
  require('./catchall'),
  require('./home'),
  require('./goal'),
  require('./initiatives'),
  require('./news'),
  require('./page')
];

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
 * Pluck out all named routes for exposure on state
 */

const namedRoutes = routes
  .map(route => route.stack)
  .reduce((layers, layer) => layers.concat(layer), [])
  .filter(layer => layer.name)
  .reduce((stash, layer) => {
    stash[layer.name] = layer.path;
    return stash;
  }, {});

/**
 * Act on any route matched upstream
 * @see Router.prototype.url
 */

router.use(async function referrer(ctx, next) {
  // Clean up params identified upstream
  ctx.params = parse(ctx.params);

  // Expose all named routes
  ctx.state.routes = namedRoutes;

  return next();
});
