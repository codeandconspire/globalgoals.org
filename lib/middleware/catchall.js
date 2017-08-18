const { __ } = require('../locale');

/**
 * Catch downstream errors and missing routes
 */

module.exports = async (ctx, next) => {
  try {
    /**
     * Try downstream middleware
     */

    await next();

    /**
     * Catch uncaught routes
     */

    if (!ctx.body) {

      /**
       * Optimistically lookup pages by root path
       */

      const doc = await ctx.prismic.getByUID('page', ctx.url.split('/')[1]);

      if (doc) {
        ctx.state.pages.items.push(doc);
        ctx.body = ctx.render(ctx.url);
      }

      /**
       * Still no result
       */

      if (!ctx.body) {
        const err = new Error(__('This page does not exist'));
        err.status = 404;
        err.expose = true;
        throw err;
      }
    }
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
