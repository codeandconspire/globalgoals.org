const compose = require('koa-compose')

/**
 * Application routes with language specific routes stacked on top
 */

const routes = [
  require('./prismic'),
  require('./home')
]

/**
 * Compose all routes
 */

module.exports = compose(routes.reduce((stack, middleware) => {
  // Non-router middleware are just passed on as-is
  if (!middleware.stack) return stack.concat(middleware)
  return stack.concat(middleware.routes(), middleware.allowedMethods())
}, []))
