const path = require('path')
const compose = require('koa-compose')
const mount = require('koa-mount')
const browserify = require('browserify')
const watchify = require('watchify-middleware')

const ROOT = path.resolve(__dirname, '../')

module.exports = compose([
  mount(`/index-${process.env.npm_package_version}.js`, serve(watchify(browserify('app/index.js', {
    basedir: ROOT,
    debug: true,
    require: [ 'source-map-support/register' ],
    transform: [
      require('localenvify'),
      require('babelify').configure({
        plugins: [ 'babel-plugin-stack-trace-sourcemap' ]
      })
    ]
  })))),
  mount('/service-worker.js', serve(watchify(browserify('app/service-worker.js', {
    basedir: ROOT,
    debug: true,
    transform: [
      require('localenvify')
    ]
  }))))
])

function serve (bundle) {
  return function (ctx) {
    return new Promise((resolve, reject) => {
      bundle(ctx.req, ctx.res)
      ctx.res.on('error', reject)
      ctx.res.on('end', resolve)
    })
  }
}
