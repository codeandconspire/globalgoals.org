/**
 * Catch downstream errors
 */

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    /**
     * Overwrite route name
     */

    ctx.state.routeName = 'error'

    /**
     * Add error to state
     */

    ctx.status = err.status || 500
    ctx.state.error = {
      status: ctx.status,
      message: null
    }

    /**
     * Expose error inner workings
     */

    if (err.expose || process.env.NODE_ENV === 'development') {
      ctx.state.error.message = err.message
    }

    if (ctx.status === 500 && process.env.NODE_ENV === 'development') {
      ctx.state.error.stack = err.stack
    }

    /**
     * Track exception
     */

    ctx.track.exception(err.message, ctx.status === 500).send()

    /**
     * Render error page
     */

    ctx.body = ctx.render(`/${ctx.status === 404 ? '404' : 'error'}`)
  }
}
