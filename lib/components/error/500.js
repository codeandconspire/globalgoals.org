const html = require('choo/html');

module.exports = function view(error) {
  return html`
    <div class="View-section">
      <!-- TODO: Translate -->
      <div class="Text">
        <h1>Something went catastrophically wrong</h1>
        <p class="Text-preamble">${ error.message }</p>
        ${ process.env.NODE_ENV === 'development' && error.stack ? html`
          <pre>${ error.stack }</pre>
        ` : null }
      </div>
    </div>
  `;
};
