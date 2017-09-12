const dedent = require('dedent');
const Prismic = require('prismic-javascript');
const meta = require('../components/meta');
const favicon = require('../components/favicon');

const START_DATE = Date.now();

module.exports = app => async function render(ctx, next) {
  const previewCookie = ctx.cookies.get(Prismic.previewCookie);

  /**
   * Set up default initial state
   */

  ctx.state = Object.assign({
    version: process.env.npm_package_version,
    lang: 'en', // TODO: Guess language from header/path/subdomain whatevs
    error: null,
    routeName: null,
    transitions: [],
    params: {},
    query: ctx.query,
    isEditor: !!previewCookie,
    api: await new Promise((resolve, reject) => {
      ctx.cache.get('api-update', (err, data) => {
        if (err) { return reject(err); }
        resolve(data || START_DATE);
      });
    }),
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

  if (ctx.accepts('html') && !ctx.is('json')) {
    ctx.body = document(ctx.state, ctx.body);
  } else if (ctx.accepts('json')) {
    ctx.body = JSON.stringify(ctx.body || ctx.state);
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
  const background = state.params.goal ? ('u-bg' + state.params.goal) : '';

  return tag`
    <!doctype html>
    <html lang="${ state.lang }" class="${ background }">
    <head>
      <title>${ state.title }</title>
      ${ meta.render(state).join('\n') }
      ${ favicon.render(state.params.goal) }
      <link rel="manifest" href="site.webmanifest">
      <link rel="apple-touch-icon" href="icon.png">
      <link rel="mask-icon" href="icon.svg" color="#333">
      <link rel="stylesheet" href="/index-${ state.version }.css">
      <script>document.documentElement.classList.add('has-js')</script>
      <script type="application/json" class="js-initialState">${ JSON.stringify(state, sanitize) }</script>
      <script src="/index-${ state.version }.js" defer></script>
    </head>
    ${ body.toString() }
    </html>
  `;
}

/**
 * Remove newline characters that sneek into the editor when copy-pasting
 * @param {string} key
 * @param {any} value
 * @returns {any}
 */

function sanitize(key, value) {
  if (typeof value === 'string') {
    return value.replace(/[\n\s]+/g, ' ');
  }
  return value;
}
