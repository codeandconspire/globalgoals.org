const html = require('choo/html');
const intro = require('../intro');
const { __ } = require('../../locale');

module.exports = function view(error) {
  const body = html`
    <p>${ __('There was a problem with loading the page. Please try again in a little while.') }</p>
  `;

  let stack = null;
  if (process.env.NODE_ENV === 'development') {
    stack = html`<pre>${ unescape(error.stack || error.message || error) }</pre>`;
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      <div class="View-section">
        ${ intro({ title: __('You\'re offline'), body: body, other: stack }, true) }
      </div>
    </main>
  `;
};
