const html = require('choo/html')
const intro = require('../intro')
const { __ } = require('../../locale')

module.exports = function view (error) {
  const body = html`
    <p>${__('There is no page at this address. Try finding your way using the menu or from') + ' '} <a href="/">${__('the homepage')}</a>.</p>
  `

  let stack = null
  if (error && process.env.NODE_ENV === 'development') {
    stack = html`<pre>${unescape(error.stack || error.message || error)}</pre>`
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      <div class="View-section">
        ${intro({ title: __('Not found'), body: body, other: stack, center: true, pageIntro: true })}
      </div>
    </main>
  `
}
