const Prismic = require('prismic-javascript')

module.exports = async (ctx, next) => {
  /**
   * Add Link headers to speed up inital page load
   */

  if (ctx.accepts('html')) {
    ctx.append('Link', [
      `</index-${process.env.npm_package_version}.js>; rel=preload; as=script`,
      `</index-${process.env.npm_package_version}.css>; rel=preload; as=style`
    ])
  }

  /**
   * Prevent caching any content at this point
   */

  const previewCookie = ctx.cookies.get(Prismic.previewCookie)
  if (previewCookie) {
    ctx.state.ref = previewCookie
    ctx.set('Cache-Control', 'no-cache, private, max-age=0')
  } else {
    ctx.state.ref = null
    if (process.env.NODE_ENV !== 'development') {
      ctx.set('Cache-Control', `s-maxage=${60 * 60 * 24 * 30}, max-age=0`)
    }
  }

  return next()
}
