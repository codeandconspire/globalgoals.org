const document = require('../document');

const START_DATE = Date.now();

module.exports = app => async function render(ctx, next) {

  /**
   * Expose a render function on context object
   */

  ctx.render = function render(href) {
    if (ctx.accepts('html') && ctx.type !== 'application/json') {
      // Render href to string
      const html = app.toString(href, ctx.state);

      // Snatch up changes that were made to state in the process of rendering
      Object.assign(ctx.state, app.state);

      return document(ctx.state, html);
    }

    return JSON.stringify(ctx.state);
  };

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
    api: await new Promise((resolve, reject) => {
      ctx.cache.get('api-update', (err, data) => {
        if (err) { return reject(err); }
        resolve(data || START_DATE);
      });
    }),
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
      isLoading: false
    },
    goals: {
      items: [],
      total: 0,
      isLoading: false
    },
    activities: {
      items: [],
      total: 0,
      isLoading: false
    },
    articles: {
      items: [],
      total: 0,
      pageSize: 8,
      page: 1,
      isLoading: false
    }
  }, ctx.state);

  /**
   * Let all downstream middleware have a go at the request
   */

  return next();
};
