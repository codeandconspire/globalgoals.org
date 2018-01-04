const Koa = require('koa')
const mount = require('koa-mount')
const serve = require('koa-static')
const body = require('koa-body')
const helmet = require('koa-helmet')
const postcss = require('koa-postcss-watch')
const router = require('./lib/router')
const { auth, unauthorized } = require('./lib/middleware/auth')
const cache = require('./lib/middleware/cache')
const assets = require('./lib/middleware/assets')
const render = require('./lib/middleware/render')
const prismic = require('./lib/middleware/prismic')
const analytics = require('./lib/middleware/analytics')
const app = require('./lib/app')

const server = new Koa()

/**
 * Basic authentication
 */

if (process.env.AUTH === 'true') {
  server.use(unauthorized)
  server.use(auth({ name: process.env.AUTH_NAME, pass: process.env.AUTH_PASS }))
}

/**
 * Compile and serve assets on demand during development
 */

if (process.env.NODE_ENV === 'development') {
  const plugins = [
    require('postcss-import')(),
    require('postcss-custom-properties')(),
    require('postcss-custom-media')(),
    require('postcss-color-function')(),
    require('postcss-selector-matches')(),
    require('postcss-url')(),
    require('postcss-flexbugs-fixes')()
  ]

  // Serve live client scripts
  server.use(require('./lib/middleware/watchify'))

  // Serve live styles
  server.use(mount(`/index-${process.env.npm_package_version}.css`, postcss({
    file: 'lib/app/index.css',
    plugins: plugins
  })))
  server.use(mount(`/fallback-${process.env.npm_package_version}.css`, postcss({
    file: 'lib/app/fallback.css',
    plugins: plugins
  })))

  // Serve components assets from disk
  server.use(serve('lib'))
}

/**
 * Take extra care to clean up em' headers in production
 */

if (process.env.NODE_ENV !== 'development') {
  server.use(helmet())
}

/**
 * Prevent indexing everything but production
 */

if (process.env.NODE_ENV !== 'production') {
  server.use(require('./lib/middleware/robots'))
}

/**
 * Serve static files
 */

server.use(assets)
server.use(serve('public', { maxage: 1000 * 60 * 60 * 24 * 365 }))

/**
 * Add on Universal Analytics for server process tracking
 */

server.use(analytics(process.env.GOOGLE_ANALYTICS_ID))

/**
 * Set up request cache mechanism
 */

server.use(cache)

/**
 * Parse request body
 */

server.use(body())

/**
 * Handle rendering response
 */

server.use(render(app))

/**
 * Hook up the Prismic api
 */

server.use(prismic)

/**
 * Hook up em' routes
 */

server.use(router)

/**
 * Lift off
 */

server.listen(process.env.PORT, () => {
  console.info(`🚀  Server listening at localhost:${process.env.PORT}`)
})
