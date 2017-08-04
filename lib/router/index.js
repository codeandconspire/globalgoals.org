const Router = require('koa-router');
const pathToRegExp = require('path-to-regexp');

const REFERENCE = '/:referrer(ref-\\w+)?';

const router = new Router();

const routes = [
  require('./home'),
  require('./goal')
];

/**
 * Wrap up all routes in a new router
 */

router.use('', ...routes.reduce((stack, router) => {

  /**
   * Add the referrer suffix path on all routes
   */

  router.stack.forEach(route => {
    if (route.path) {
      route.path = route.path.replace(/\/?$/, REFERENCE);
      route.paramNames = [];
      route.regexp = pathToRegExp(route.path, route.paramNames, route.opts);
    }
  });

  return stack.concat(router.routes(), router.allowedMethods());
}, []));

module.exports = router;
