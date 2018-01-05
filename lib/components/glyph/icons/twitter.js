const html = require('choo/html')

module.exports = function (className) {
  return html`
    <svg viewBox="0 0 18 15" width="18" height="15" class="${className}" role="presentation" aria-hidden="true">
      <path fill="currentColor" fill-rule="evenodd" d="M5.66 15c6.8 0 10.5-5.77 10.5-10.77v-.5A7.62 7.62 0 0 0 18 1.8a7.23 7.23 0 0 1-2.12.6A3.8 3.8 0 0 0 17.5.27a7.3 7.3 0 0 1-2.34.92 3.65 3.65 0 0 0-2.7-1.2c-2.04 0-3.7 1.7-3.7 3.8 0 .26.04.55.1.83C5.8 4.5 3.06 2.98 1.26.7c-.3.55-.5 1.2-.5 1.9A3.8 3.8 0 0 0 2.4 5.75a3.6 3.6 0 0 1-1.68-.47v.04C.72 7.16 2 8.7 3.7 9.04A3.62 3.62 0 0 1 2 9.1c.47 1.5 1.83 2.6 3.45 2.63A7.3 7.3 0 0 1 0 13.3 10.27 10.27 0 0 0 5.66 15"
      />
    </svg>
  `
}
