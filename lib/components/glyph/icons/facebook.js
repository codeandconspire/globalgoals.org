const html = require('choo/html')

module.exports = function (className) {
  return html`
    <svg viewBox="0 0 18 18" width="18" height="18" class="${className}" role="presentation" aria-hidden="true">
      <g fill="none" fill-rule="evenodd">
        <path fill="currentColor" fill-rule="nonzero" d="M16.12 17H1.88a.87.87 0 0 1-.88-.88V1.88c0-.49.4-.88.88-.88h14.24c.49 0 .88.4.88.88v14.24c0 .49-.4.88-.88.88zm-4.08 0v-6.2h2.08l.3-2.4h-2.38V6.88c0-.7.2-1.17 1.2-1.17h1.27V3.57c-.61-.07-1.23-.1-1.85-.1-1.85 0-3.1 1.13-3.1 3.2V8.4h-2.1v2.4h2.1V17h2.48z"/>
      </g>
    </svg>
  `
}
