const dedent = require('dedent');
const Prismic = require('prismic-javascript');

const NUMBER_OF_GRID_LAYOUT = 7;
const GRID_LAYOUT_COOKIE_NAME = 'goal-grid-layout';

module.exports = app => async function render(ctx, next) {

  /**
   * Choose random-ish layout of featured grids on start page
   */

  const previousLayout = ctx.cookies.get(GRID_LAYOUT_COOKIE_NAME);
  let layout = randomizeLayout();
  layout = layout === parseInt(previousLayout) ? randomizeLayout() : layout;

  ctx.cookies.set(GRID_LAYOUT_COOKIE_NAME, layout);

  /**
   * Set up de default initial state
   */

  Object.assign(ctx.state, {
    // TODO: Guess language from header/path/subdomain whatevs
    version: process.env.npm_package_version,
    lang: 'en',
    error: null,
    routeName: null,
    gridLayout: layout,
    transitions: [],
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
      isLoading: false
    }
  });

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
 * Randomize grid layout
 */

function randomizeLayout() {
  return Math.floor(Math.random() * NUMBER_OF_GRID_LAYOUT + 1)
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
  return tag`
    <!doctype html>
    <html lang="${ state.lang }">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>${ state.title }</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="manifest" href="site.webmanifest">
      <link rel="apple-touch-icon" href="icon.png">
      <link rel="mask-icon" href="icon.svg" color="#333">
      <link rel="stylesheet" href="/index-${ state.version }.css" />
      <script type="application/json" class="js-initialState">${ JSON.stringify(state) }</script>
      <script src="/index-${ state.version }.js" async></script>
    </head>
    ${ body.toString() }
    </html>
  `;
}
