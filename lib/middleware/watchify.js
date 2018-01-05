const path = require('path')
const browserify = require('browserify')
const watchify = require('watchify-middleware')

const ROOT = path.resolve(__dirname, '../')

/**
 * Set up browserify bundles
 */

const bundles = {
  [`index-${process.env.npm_package_version}`]: watchify(browserify('app/index.js', {
    basedir: ROOT,
    debug: true,
    require: [ 'source-map-support/register' ],
    transform: [
      require('localenvify'),
      require('yo-yoify'),
      require('babelify').configure({
        plugins: [ 'babel-plugin-stack-trace-sourcemap' ]
      })
    ]
  })),
  'service-worker': watchify(browserify('app/service-worker.js', {
    basedir: ROOT,
    debug: true,
    transform: [
      require('localenvify')
    ]
  }))
}

/**
 * Middleware that captures requests for application entry files and assets
 */

module.exports = async function dev (ctx, next) {
  if (/\.js$/.test(ctx.url)) {
    return new Promise((resolve, reject) => {
      bundles[ ctx.url.match(/^\/(.+)\.js$/)[1] ](ctx.req, ctx.res)
      ctx.res.on('error', reject)
      ctx.res.on('end', resolve)
    })
  } else {
    return next()
  }
}
