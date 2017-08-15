const html = require('choo/html');

module.exports = function view(error) {
  return html`
    <div class="View-section">
      <!-- TODO: Translate -->
      <div class="Text">
        <h1>Something went wrong</h1>
        <p>${ error.message }</p>
      </div>
    </div>
  `;
};
