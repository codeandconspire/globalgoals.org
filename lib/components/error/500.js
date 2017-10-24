const html = require('choo/html');
const intro = require('../intro');
const { __ } = require('../../locale');

module.exports = function view(error) {
  const body = html`
    <p>${ __('We apologize, an error has occured on our site. It may be temporary and you could') + ' ' } <a href="">${ __('try again') }</a> ${ ' ' + __('or go back to') + ' ' } <a href="/">${ __('the homepage' ) }</a>.</p>
  `;

  let stack = null;
  if (process.env.NODE_ENV === 'development') {
    stack = html`<pre>${ unescape(error.stack || error.message || error) }</pre>`;
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      <div class="View-section">
        ${ intro({ title: __('Something went wrong'), body: body, other: stack, center: true, large: true }) }
      </div>
    </main>
  `;
};
