const html = require('choo/html');

module.exports = function border(text) {
  return html`
    <header class="Border">
      <h2 class="Border-text">${ text }</h2>
    </header>
  `;
};
