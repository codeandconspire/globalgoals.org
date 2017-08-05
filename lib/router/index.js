const Router = require('koa-router');
const pathToRegExp = require('path-to-regexp');

const REFERRER = '/:referrer(ref-\\w+)?';
const REFERRER_PREFIX = /^ref-/;
const SLUG_PREFIX = /^-/;

/**
 * Patch `route.url` adding on param prefixes and such
 */

const _url = Router.prototype.url;
Router.prototype.url = function url(name, _params) {
  if (typeof _params === 'object') {
    const params = Object.assign({}, _params);

    if (_params.referrer && !REFERRER_PREFIX.test(_params.referrer)) {
      // The `referrer` params need the `ref-` prefix
      params.referrer = `ref-${ _params.referrer }`;
    }

    if (_params.slug && !SLUG_PREFIX.test(_params.slug)) {
      // The goal `slug` param need a preceeding dash seperator
      params.slug = `-${ _params.slug }`;
    }

    return _url.call(this, name, params);
  }
  return _url.call(this, name, _params);
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
      route.path = route.path.replace(/\/?$/, REFERRER);
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
  if (ctx.params.referrer) {
    ctx.params.referrer = ctx.params.referrer.replace(REFERRER_PREFIX, '');
  }

  if (ctx.params.slug) {
    ctx.params.slug = ctx.params.slug.replace(SLUG_PREFIX, '');
  }

  return next();
});

module.exports = router;
