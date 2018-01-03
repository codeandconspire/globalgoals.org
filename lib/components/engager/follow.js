const html = require('choo/html')
const { __ } = require('../../locale')

module.exports = function follow (state, emit = () => {}) {
  return html`
    <div class="Text Text--growing">
      <p>${__('To-do, add social media channels here.')}</p>
    </div>
  `
}
