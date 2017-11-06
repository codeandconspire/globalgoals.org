const html = require('choo/html')

module.exports = function border (text, first) {
  return html`
    <header class="Border ${first ? 'Border--first' : ''}">
      <h2 class="Border-text">${text}</h2>
    </header>
  `
}
