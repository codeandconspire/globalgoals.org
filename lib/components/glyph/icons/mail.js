const html = require('choo/html')

module.exports = function (className) {
  return html`
    <svg viewBox="0 0 34 25" width="34" height="25" class="${className}" role="presentation" aria-hidden="true">
      <g fill="none" fill-rule="evenodd" class="${className}Stroke" stroke="currentColor" stroke-width="1.5">
        <path d="M.8.8h32.5v23.5H.8z" />
        <path d="M1 1l16 16L33 1M1 24l11-13M33 24L23 11" />
      </g>
    </svg>
  `
}
