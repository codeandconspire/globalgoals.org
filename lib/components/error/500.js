const html = require('choo/html');
const { __ } = require('../../locale');

module.exports = function view(error) {
  return html`
    <div class="View-section">
      <div class="Text">
        <h1>${ __('Something went catastrophically wrong') }</h1>
        <p>${ error.message }</p>
        ${ process.env.NODE_ENV === 'development' && error.stack ? html`
          <pre>${ unescape(error.stack) }</pre>
        ` : null }
      </div>
    </div>
  `;
};
