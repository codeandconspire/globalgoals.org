const dedent = require('dedent')

module.exports = async (ctx, next) => {
  if (ctx.url !== '/robots.txt') return next()
  ctx.body = dedent`
    User-agent: *
    Disallow: ${process.env.NODE_ENV !== 'production' ? '/' : ''}
  `
}
