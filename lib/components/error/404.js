const html = require('choo/html');
const { __ } = require('../../locale');
const intro = require('../intro');

module.exports = function view(error) {
  return html`
    <main class="View-main View-animationFriendly">
      <div class="View-section">
        ${ intro({title: __('Sorry…'), body: html`<p>${ error.message }</p>`}) }
      </div>
    </main>
  `;
};
