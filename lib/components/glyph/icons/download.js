const html = require('choo/html')

module.exports = function (className) {
  return html`
    <svg viewBox="0 0 11 14" width="11" height="14" class="${className}" role="presentation" aria-hidden="true">
      <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="square">
        <path d="M5.5.5v9M1 13.3h9M10 5.5L5.5 10M1 5.5L5.5 10" />
      </g>
    </svg>
  `
}
