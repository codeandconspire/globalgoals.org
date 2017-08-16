const dedent = require('dedent');
const Prismic = require('prismic-javascript');

module.exports = app => async function render(ctx, next) {

  /**
   * Set up de default initial state
   */

  Object.assign(ctx.state, {
    // TODO: Guess language from header/path/subdomain whatevs
    lang: 'en',
    error: null,
    isLoading: false,
    pages: {
      items: []
    },
    goals: {
      items: [],
      total: 0
    },
    initiatives: {
      items: [],
      total: 0
    },
    articles: {
      items: [],
      totla: 0
    }
  });

  /**
   * Populate `total` with an appropiately long array of `undefined`
   */

  await Promise.all([
    ctx.prismic.query(
      Prismic.Predicates.at('document.type', 'goal'),
      { pageSize: 1 }
    ).then(body => {
      ctx.state.goals.total = body.total_results_size;
    }),
    ctx.prismic.query(
      Prismic.Predicates.at('document.type', 'initiative'),
      { pageSize: 1 }
    ).then(body => {
      ctx.state.initiatives.total = body.total_results_size;
    }),
    ctx.prismic.query(
      Prismic.Predicates.at('document.type', 'news'),
      { pageSize: 1 }
    ).then(body => {
      ctx.state.articles.total = body.total_results_size;
    })
  ]);

  /**
   * Expose a render function on context object
   */

  ctx.render = function render(href) {
    if (ctx.accepts('html')) {
      // Render href to string
      const html = app.toString(href, ctx.state);

      // Snatch up changes that were made to state in the process of rendering
      Object.assign(ctx.state, app.state);

      return html;
    }

    return null;
  };

  /**
   * Let all other middleware have a go at the request before acting on it
   */

  await next();

  if (ctx.accepts('html')) {

    /**
     * Wrap up HTML response in a document
     */

    ctx.type = 'text/html';
    const tag = process.env.NODE_ENV === 'development' ? dedent : minify;
    ctx.body = tag`
      <!doctype html>
      <html lang="${ ctx.state.lang }">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>${ ctx.state.title }</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="manifest" href="site.webmanifest">
        <link rel="apple-touch-icon" href="icon.png">
        <link rel="mask-icon" href="icon.svg" color="#333">
        <link rel="stylesheet" href="/index.css" />
        ${ process.env.NODE_ENV !== 'development' ? dedent`
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
        ` : '' }
        <script type="application/json" class="js-initialState">${ JSON.stringify(ctx.state) }</script>
        <script src="/index.js" async></script>
      </head>
      ${ ctx.body.toString() }
      </html>
    `;
  } else if (ctx.accepts('json')) {

    /**
     * Send the raw state, whateever that may be
     */

    ctx.type = 'application/json';
    ctx.body = JSON.stringify(ctx.state);
  } else {

    /**
     * We only support HTML and JSON
     */

    ctx.status = 406;
  }
};

/**
 * Simple minification removing all new line feeds and leading spaces
 *
 * @param {array} strings Array of string parts
 * @param {array} parts Trailing arguments with expressions
 * @returns {string}
 */

function minify(strings, ...parts) {
  return strings.reduce((output, string, index) => {
    return output + string.replace(/\n\s+/g, '') + (parts[index] || '');
  }, '');
}
