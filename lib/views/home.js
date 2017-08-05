const html = require('choo/html');
const view = require('../components/view');

module.exports = view(goal, title);

function goal(state, emit) {
  return html`
    <div>
      <h1>Hello World!</h1>
      ${ state.params.referrer ? html`
        <p>
          Referrer id: ${ state.params.referrer }
        </p>
      ` : null }
    </div>
  `;
}

function title(state) {
  return 'The Global Goals';
}
