const meta = require('../components/meta');
const favicon = require('../components/favicon');

const START_DATE = Date.now();

module.exports = app => async function render(ctx, next) {

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
    query: ctx.query,
    isStatic: false,
    isEditor: false,
    api: await new Promise((resolve, reject) => {
      ctx.cache.get('api-update', (err, data) => {
        if (err) { return reject(err); }
        resolve(data || START_DATE);
      });
    }),
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
   * Expose a render function on context object
   */

  ctx.render = function render(href) {
    if (ctx.state.error) {
      ctx.state.routeName = ctx.state.error.status || 'error';
    }

    if (ctx.accepts('html')) {
      // Render href to string
      const html = app.toString(href, ctx.state);

      // Snatch up changes that were made to state in the process of rendering
      Object.assign(ctx.state, app.state);

      return document(ctx.state, html);
    }

    return null;
  };

  /**
   * Let all downstream middleware have a go at the request
   */

  return next();
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
  const background = state.params.goal ? ('u-bg' + state.params.goal) : '';

  return minify`
    <!doctype html>
    <html lang="${ state.lang }" class="${ background }">
    <head>
      <title>${ state.title }</title>
      ${ meta.render(state).join('\n') }
      ${ favicon.render(state.params.goal) }
      <link rel="manifest" href="site.webmanifest">
      <link rel="apple-touch-icon" href="icon.png">
      <link rel="mask-icon" href="icon.svg" color="#222">
      <link rel="stylesheet" href="/index-${ state.version }.css">
      ${ !state.isStatic && (!state.error || state.error.status < 500) ? `
        <script>document.documentElement.classList.add('has-js')</script>
        <script type="application/json" class="js-initialState">${ JSON.stringify(state, sanitize) }</script>
        <script src="/index-${ state.version }.js" defer></script>
      ` : null }
      ${ process.env.GOOGLE_ANALYTICS_ID ? minify`
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
          ga('create', '${ process.env.GOOGLE_ANALYTICS_ID }', 'auto');
          ga('send', 'pageview');
          ${ state.error && state.error.status >= 500 ? `
            ga('send', 'exception', { exDescription: '${ state.error.message }', exFatal: true });
          ` : null }
        </script>
      ` : null }
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
