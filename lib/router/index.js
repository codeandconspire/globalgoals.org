const compose = require('koa-compose')

/**
 * Application routes
 */

const routes = [
  require('./api'),
  require('./redirects'),
  require('./prismic'),
  require('./home'),
  require('./goal'),
  require('./activities'),
  require('./news'),
  require('./resources'),
  require('./page')
]

/**
 * Compose all routes and expose route resolution pattern on `ctx.state`
 */

module.exports = compose(routes.reduce((stack, middleware) => {
  // Non-router middleware are just passed on as-is
  if (!middleware.stack) return stack.concat(middleware)
  return stack.concat(middleware.routes(), middleware.allowedMethods())
}, []))
