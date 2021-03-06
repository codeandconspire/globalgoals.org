const Prismic = require('prismic-javascript')

module.exports = async (ctx, next) => {
  if (!ctx.accepts('html')) return next()

  /**
   * Add Link headers to speed up inital page load
   */

  if (process.env.NODE_ENV !== 'development') {
    ctx.append('Link', [
      `</index-${process.env.SOURCE_VERSION}.js>; rel=preload; as=script`,
      `</index-${process.env.SOURCE_VERSION}.css>; rel=preload; as=style`
    ])
  }

  /**
   * Prevent caching any content at this point
   */

  await next()

  const previewCookie = ctx.cookies.get(Prismic.previewCookie)
  if (previewCookie) {
    ctx.state.ref = previewCookie
    ctx.set('Cache-Control', 'no-cache, private, max-age=0')
  } else {
    ctx.state.ref = null
    const cache = ctx.response.get('Cache-Control')
    if (process.env.NODE_ENV !== 'development' && !cache && ctx.status === 200) {
      ctx.set('Cache-Control', `s-maxage=${60 * 60 * 24 * 30}, max-age=0`)
    }
  }
}
