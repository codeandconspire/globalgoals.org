const html = require('choo/html');
const view = require('../components/view');

module.exports = view(goal, title);

function goal(state, emit) {
  return html`
    <div class="u-textCenter">
      <iframe src="https://giphy.com/embed/LGVQJ4cQGPs8o" width="480" height="352" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
      <!-- TODO: Translate -->
      <p>
        Something went wrong
        <br />
        <small>${ state.error }</small>
      </p>
    </div>
  `;
}

function title(state) {
  return 'Not Found | The Global Goals';
}
