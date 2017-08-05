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

const router = new Router();
const routes = [
  require('./home'),
  require('./goal')
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
 * Clean up params, removing prefixes and such
 * @see Router.prototype.url
 */

router.use(async function referrer(ctx, next) {
  ctx.params = parse(ctx.params);
  return next();
});

module.exports = router;
