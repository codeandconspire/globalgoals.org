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
      ${process.env.NODE_ENV !== 'development' ? `
        <!-- Global site tag (gtag.js) - Google Ads: 10793109443 -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-10793109443"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-10793109443');

        </script>

        <!-- Google Tag Manager -->
        <script>
          (function(w,d,s,l,i) {
            w[l] = w[l] || [];
            w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
            var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l: '';
            j.async = true;
            j.src='https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
          })(window,document, 'script', 'dataLayer', 'GTM-WDJGTX8');
        </script>
        <!-- End Google Tag Manager -->

        <script>
          function docready(fn) {
            if (document.readyState !== 'loading'){
              fn();
            } else {
              document.addEventListener('DOMContentLoaded', fn);
            };
          }

          docready(function() {
            window.setTimeout(function(){
              document.documentElement.querySelector('.Shareable-action').addEventListener('click', function() {
                console.log('Shareable action');
                gtag('event', 'conversion', {'send_to': 'AW-10793109443/cXPbCL2Hn4IDEMOPx5oo'});
              });
              for (i = 0; i < document.querySelectorAll('a[href*="voicesforchange.world"]').length; i++) {
                document.documentElement.querySelectorAll('a[href*="voicesforchange.world"]')[i].addEventListener('click', function() {
                  console.log('Shareable link');
                  gtag('event', 'conversion', {'send_to': 'AW-10793109443/hG1-CMPGrIADEMOPx5oo'});
                });
              };
            }, 500);
          });
        </script>
      ` : ''}
    </head>
        ${body.replace(/<\/body>\s*$/, `
            ${process.env.NODE_ENV !== 'development' ? `
              <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex"></script>
            ` : ''}
            <script>window.initialState = JSON.parse(${stringify(state)})</script>
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
