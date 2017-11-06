const compose = require('koa-compose')
const pathToRegExp = require('path-to-regexp')
const { parse, extend } = require('../params')

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
  require('./page'),
  require('./404')
]

/**
 * Pluck out all named routes for exposure on state
 */

const namedRoutes = routes
  .filter(middleware => middleware.stack)
  .map(route => route.stack)
  .reduce((layers, layer) => layers.concat(layer), [])
  .filter(layer => layer.name)
  .reduce((stash, layer) => {
    stash[layer.name] = layer.path
    return stash
  }, { 'error': '/error' })

/**
 * Compose all routes extending their path with `referrer` in the process
 */

module.exports = compose(routes.reduce((stack, middleware) => {
  /**
   * Non-router middleware are just passed on as-is
   */

  if (!middleware.stack) { return stack.concat(middleware) }

  /**
   * Add the referrer suffix path to all routes
   */

  middleware.stack.forEach(route => {
    if (route.path) {
      route.path = extend(route.path)
      route.paramNames = []
      route.regexp = pathToRegExp(route.path, route.paramNames, route.opts)
      route.stack = route.stack.reduce(function wrapper (stack, layer) {
        if (Array.isArray(layer)) {
          return stack.concat(layer.reduce(wrapper, []))
        }

        return stack.concat(async (ctx, next) => {
          // Clean up params identified
          ctx.state.params = ctx.params = (ctx.params ? parse(ctx.params) : {})

          // Expose all named routes
          ctx.state.routes = namedRoutes

          // Expose matched route name
          ctx.state.routeName = ctx._matchedRouteName

          return layer(ctx, next)
        })
      }, [])
    }
  })

  return stack.concat(middleware.routes(), middleware.allowedMethods())
}, []))
