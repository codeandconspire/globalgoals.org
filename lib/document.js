const dedent = require('dedent');

module.exports = function document(view, state) {
  return dedent`
    <!doctype html>
    <html lang="${ state.lang }">
    <head>
      <title>${ state.title }</title>
      <link rel="stylesheet" href="/index.css" />
      ${ process.env.NODE_ENV !== 'development' ? dedent`
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
      ` : '' }
      <script type="application/json" class="js-initialState">${ JSON.stringify(state) }</script>
      <script src="/index.js" async></script>
    </head>
    ${ view.toString() }
    </html>
  `;
};
