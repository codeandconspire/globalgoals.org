const html = require('choo/html')

/**
 * Create list of tags layed out in grid formation
 * @param {array<mixed>} items List of objects or strings (max 4)
 * @return {Element}
 */

module.exports = function tags (items) {
  return html`
    <div class="Tags">
      ${items.slice(0, 4).map(item => item.href ? html`
        <a href="${item.href}" class="Tags-item u-bg${item.number}">${number(item.number)}</a>
      ` : html`
        <span class="Tags-item u-bg${item.number || item}">${number(item.number || item)}</span>
      `)}
    </div>
  `
}

const number = function (num) {
  return html`
    <svg class="Tags-number" viewBox="0 0 24 24" width="24" height="24">
      <text fill="currentColor" x="12" y="17" text-anchor="middle">${num}</text>
    </svg>
  `
}
