const html = require('choo/html');
const view = require('../components/view');

module.exports = view(goal, title);

function goal(state, emit) {
  return html`
    <div>
      <h1 class="View-title">Oops!</h1>
      <p>This page couldn't be found</p>
    </div>
  `;
}

function title(state) {
  return 'Not Found | The Global Goals';
}
