const mount = require('koa-mount')
const compose = require('koa-compose')
const postcss = require('koa-postcss-watch')

const plugins = [
  require('postcss-import')(),
  require('postcss-custom-properties')(),
  require('postcss-custom-media')(),
  require('postcss-color-function')(),
  require('postcss-selector-matches')(),
  require('postcss-url')(),
  require('postcss-flexbugs-fixes')()
]

module.exports = compose([
  mount(`/index-${process.env.npm_package_version}.css`, postcss({
    file: 'lib/app/index.css',
    plugins: plugins
  })),
  mount(`/fallback-${process.env.npm_package_version}.css`, postcss({
    file: 'lib/app/fallback.css',
    plugins: plugins
  }))
])
