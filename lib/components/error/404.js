const html = require('choo/html');
const intro = require('../intro');

module.exports = function view(error) {
  const body = html`
    <div>
      <img src="sorry.gif" width="400" height="187" style="width: 100%; max-width: 400px; margin: 0" />
      <p>${ error.message }</p>
    </div>
  `;

  return html`
    <main class="View-main View-animationFriendly">
      <div class="View-section">
        ${ intro({ body: body }, true) }
      </div>
    </main>
  `;
};
