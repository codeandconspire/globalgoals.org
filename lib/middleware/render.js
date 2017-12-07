const document = require('../document')

module.exports = render

function render (app) {
  return async function (ctx, next) {
    /**
     * Set up default initial state
     */

    ctx.state = Object.assign({
      version: process.env.npm_package_version,
      lang: 'en', // TODO: Guess language from header/path/subdomain whatevs
      error: null,
      ref: null,
      routeName: null,
      transitions: [],
      params: {},
      ui: {},
      geoip: {
        error: null
      },
      query: ctx.query,
      isStatic: false,
      isEditor: false,
      twitter: {
        items: {},
        error: null,
        isLoading: false
      },
      instagram: {
        items: {},
        error: null,
        isLoading: false
      },
      pages: {
        items: [],
        error: null,
        isLoading: false
      },
      goals: {
        items: [],
        total: 0,
        error: null,
        isLoading: false
      },
      activities: {
        items: [],
        total: 0,
        error: null,
        isLoading: false,
        fetched: []
      },
      articles: {
        items: [],
        total: 0,
        pageSize: 8,
        page: 0,
        error: null,
        isLoading: false,
        fetched: []
      }
    }, ctx.state)

    try {
      await next()
      if (ctx.body) return
      if (ctx.accepts('html')) {
        ctx.type = 'text/html'
        ctx.body = asHtml(ctx.path, ctx.state)
      } else if (ctx.accepts('json')) {
        ctx.type = 'application/json'
        ctx.body = ctx.state
      } else {
        ctx.throw(406)
      }
    } catch (err) {
      ctx.status = err.status || 500
      ctx.state.error = {
        status: ctx.status,
        message: null
      }

      if (err.expose || process.env.NODE_ENV === 'development') {
        ctx.state.error.message = err.message
      }

      if (ctx.status === 500 && process.env.NODE_ENV === 'development') {
        ctx.state.error.stack = err.stack
      }

      // Track exception
      ctx.track.exception(err.message, ctx.status === 500).send()

      if (ctx.accepts('html')) {
        ctx.type = 'text/html'
        ctx.body = asHtml('/error', ctx.state)
      } else {
        ctx.type = 'application/json'
        ctx.body = ctx.state.error
      }
    }
  }

  function asHtml (href, state) {
    const html = app.toString(href, state)
    // Snatch up changes that were made to state in the process of rendering
    Object.assign(state, app.state)
    // Wrap up view html in document
    return document(state, html)
  }
}
