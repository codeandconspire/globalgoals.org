const html = require('choo/html');
const { __ } = require('../../locale');

module.exports = function view(error) {
  return html`
    <main class="View-container">
      <div class="View-section">
        <div class="View-intro">
          <div class="Text">
            <h1>${ __('Something went wrong') }</h1>
            <p>${ error.message }</p>
          </div>
        </div>
      </div>
    </main>
  `;
};
