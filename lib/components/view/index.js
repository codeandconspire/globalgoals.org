const html = require('choo/html');

module.exports = function (view, title) {
  return function (state, emit) {
    emit(state.events.DOMTITLECHANGE, title(state));

    return html`
      <body class="View ${ typeof window === 'undefined' ? 'js-view' : '' }">
        ${ view(state, emit) }
      </body>
    `;
  };
};
