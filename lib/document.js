const jsesc = require('jsesc')
const meta = require('./components/meta')
const favicon = require('./components/favicon')

/**
 * Create a HTML document
 *
 * @param {object} state
 * @param {any} body
 * @returns {string}
 */

module.exports = function document (state, body) {
  const background = state.params.goal ? ('u-bg' + state.params.goal) : ''

  return minify`
    <!doctype html>
    <html lang="${state.lang}" class="${background}">
    <head>
      <title>${state.title}</title>
      ${meta.render(state).join('\n')}
      ${favicon.render(state.params.goal)}
      <link rel="manifest" href="/site.webmanifest">
      <link rel="apple-touch-icon" href="/icon.png">
      <link rel="mask-icon" href="/icon.svg" color="#222">
      <link rel="dns-prefetch" href="//ik.imagekit.io">
      <link rel="dns-prefetch" href="//globalgoals.cdn.prismic.io">

      <!--[if !IE]><!-->
      <link rel="stylesheet" href="/index-${state.version}.css">
      <!--<![endif]-->
      <!--[if IE]>
      <link rel="stylesheet" href="/fallback-${state.version}.css">
      <![endif]-->

      <script>document.documentElement.classList.add('has-js')</script>
      <script src="/index-${state.version}.js" defer></script>
      ${process.env.GOOGLE_ANALYTICS_ID ? `
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
          ga('create', '${process.env.GOOGLE_ANALYTICS_ID}', 'auto');
          ga('send', 'pageview');
        </script>
      ` : ''}
    </head>
        ${body.replace(/<\/body>\s*$/, `
            ${process.env.NODE_ENV !== 'development' ? `
              <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex"></script>
            ` : ''}
            <script>window.initialState = ${stringify(state)}</script>
          </body>
        `)}
    </html>
  `
}

/**
 * Simple minification removing all new line feeds and leading spaces
 *
 * @param {array} strings Array of string parts
 * @param {array} parts Trailing arguments with expressions
 * @returns {string}
 */

function minify (strings, ...parts) {
  return strings.reduce((output, string, index) => {
    return output + string + (parts[index] || '')
  }, '').replace(/\n\s+/g, '')
}

/**
 * JSON stringify replacer function
 * @param {object} data
 * @return {any}
 */

function stringify (data) {
  return jsesc(JSON.stringify(data), {
    json: true,
    isScriptContext: true
  })
}
