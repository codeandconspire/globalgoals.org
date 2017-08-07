const dedent = require('dedent');

module.exports = function document(view, state) {
  return dedent`
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
