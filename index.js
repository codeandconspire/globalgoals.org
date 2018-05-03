const Koa = require('koa')
const body = require('koa-body')
const serve = require('koa-static')
const helmet = require('koa-helmet')
const auth = require('koa-basic-auth')
const noTrailingSlash = require('koa-no-trailing-slash')
const app = require('./lib/app')
const api = require('./lib/middleware/api')
const cache = require('./lib/middleware/cache')
const assets = require('./lib/middleware/assets')
const render = require('./lib/middleware/render')
const redirects = require('./lib/middleware/redirects')
const analytics = require('./lib/middleware/analytics')

const server = new Koa()

/**
 * Compile and serve assets on demand during development
 */

if (process.env.NODE_ENV === 'development') {
  // Serve live client resources
  server.use(require('./lib/middleware/watchify'))
  server.use(require('./lib/middleware/postcss'))

  // Serve components assets from disk
  server.use(serve('lib'))
}

/**
 * Take extra care to clean up em' headers in production
 */

if (process.env.NODE_ENV !== 'development') {
  server.use(helmet())
  const { AUTH_NAME, AUTH_PASS } = process.env
  if (AUTH_NAME && AUTH_PASS) {
    server.use(async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        if (err.status === 401) {
          ctx.status = 401
          ctx.set('WWW-Authenticate', 'Basic')
          ctx.body = 'cant haz that'
        } else {
          throw err
        }
      }
    })
    server.use(auth({name: AUTH_NAME, pass: AUTH_PASS}))
  }
}

/**
 * Prevent indexing everything
 */

server.use(require('./lib/middleware/robots'))

/**
 * Parse request body
 */

server.use(body({multipart: true}))

/**
 * Capture special routes before any other middleware
 */

server.use(api)
server.use(redirects)

/**
 * Remove trailing slashes before continuing
 */

server.use(noTrailingSlash())

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
 * Handle rendering response
 */

server.use(render(app))

/**
 * Lift off
 */

server.listen(process.env.PORT, () => {
  console.info(`🚀  Server listening at localhost:${process.env.PORT}`)
})
