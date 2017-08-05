const dedent = require('dedent');

module.exports = function document(view, state) {
  return dedent`
    <!doctype html>
    <html lang="${ state.lang }">
    <head>
      <title>${ state.title }</title>
      <link rel="stylesheet" href="/css/index.css" />
    </head>
    ${ view.toString() }
    </html>
  `;
}
