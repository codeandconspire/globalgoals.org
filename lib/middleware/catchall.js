/**
 * Catch downstream errors
 */

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {

    /**
     * Render error page
     */

    ctx.status = err.status || 500;
    ctx.state.error = {
      status: ctx.status,
      message: null
    };

    if (err.expose || process.env.NODE_ENV === 'development') {
      ctx.state.error.message = err.message;
    }

    if (ctx.status === 500 && process.env.NODE_ENV === 'development') {
      ctx.state.error.stack = escape(err.stack);
    }

    ctx.body = ctx.render(`/${ ctx.status === 404 ? '404' : 'error' }`);
  }
};
