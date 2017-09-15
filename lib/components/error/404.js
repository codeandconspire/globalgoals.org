const html = require('choo/html');
const intro = require('../intro');
const { __ } = require('../../locale');

module.exports = function view(error) {
  const body = html`
    <div>
      <img src="sorry.gif" width="400" height="187" style="width: 100%; max-width: 400px; margin: -60px 0 0" />
      <p>${ __('There is no page at this address. Try finding your way using the menu or from') + ' ' } <a href="/">${ __('the homepage') }</a>.</p>
    </div>
  `;

  let stack = null;
  if (process.env.NODE_ENV === 'development') {
    stack = html`<pre>${ unescape(error.stack || error.message || error) }</pre>`;
  }

  return html`
    <main class="View-main View-animationFriendly">
      <div class="View-section">
        ${ intro({ body: body, other: stack }, true) }
      </div>
    </main>
  `;
};
