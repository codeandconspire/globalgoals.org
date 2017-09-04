const dedent = require('dedent');
const Prismic = require('prismic-javascript');

module.exports = app => async function render(ctx, next) {
  const previewCookie = ctx.cookies.get(Prismic.previewCookie);

  /**
   * Set up default initial state
   */

  ctx.state = Object.assign({
    // TODO: Guess language from header/path/subdomain whatevs
    version: process.env.npm_package_version,
    lang: 'en',
    error: null,
    routeName: null,
    transitions: [],
    query: ctx.query,
    isEditor: !!previewCookie,
    ref: previewCookie || ctx.prismic.master(),
    pages: {
      items: [],
      isLoading: false
    },
    goals: {
      items: [],
      total: 0,
      isLoading: false
    },
    initiatives: {
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
   * Populate inital state with
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
    if (ctx.state.error) {
      ctx.state.routeName = ctx.state.error.status || 'error';
    } else {
      ctx.state.routeName = ctx._matchedRouteName || 'page';
    }

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
   * Let all downstream middleware have a go at the request
   */

  await next();

  /**
   * Determine response type
   */

  if (ctx.accepts('html')) {
    ctx.body = document(ctx.state, ctx.body);
  } else if (ctx.accepts('json')) {
    ctx.body = JSON.stringify(ctx.state);
  } else {
    ctx.throw(406);
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
    return output + string + (parts[index] || '');
  }, '').replace(/\n\s+/g, '');
}

/**
 * Create a HTML document
 *
 * @param {object} state
 * @param {any} body
 * @returns {string}
 */

function document(state, body) {
  const tag = process.env.NODE_ENV === 'development' ? dedent : minify;
  const hasParams = state.params;
  const hasGoal = hasParams ? state.params.goal : null;
  const background = hasGoal ? (state.params.goal ? 'u-bg' + state.params.goal : '') : '';


  return tag`
    <!doctype html>
    <html lang="${ state.lang }" ${ background ? 'class="' + background + '"' : '' }>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>${ state.title }</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="manifest" href="site.webmanifest">
      <link rel="apple-touch-icon" href="icon.png">
      <link rel="mask-icon" href="icon.svg" color="#333">
      <link rel="stylesheet" href="/index-${ state.version }.css" />
      <script>document.documentElement.classList.add('has-js')</script>
      <script type="application/json" class="js-initialState">${ JSON.stringify(state, sanitize) }</script>
      <script src="/index-${ state.version }.js" async></script>
    </head>
    ${ body.toString() }
    </html>
  `;
}

function sanitize(key, value) {
  if (typeof value === 'string') {
    return value.replace(/[\n\s]+/g, ' ');
  }
  return value;
}
