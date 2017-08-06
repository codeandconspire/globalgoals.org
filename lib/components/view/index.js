const html = require('choo/html');

module.exports = function (view, title) {
  return function wrapper(state, emit) {
    emit(state.events.DOMTITLECHANGE, title(state));

    return html`
      <body class="View js-view">
        ${ view(state, emit) }
      </body>
    `;
  };
};
