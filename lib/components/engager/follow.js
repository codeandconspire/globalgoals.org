const html = require('choo/html')
const Component = require('nanocomponent')
const { resolve, routes } = require('../../params')
const { __ } = require('../../locale')

module.exports = class Follow extends Component {
  static title () {
    return __('Stay Updated')
  }

  static href (doc) {
    return resolve(routes[doc.type === 'goal' ? 'goal_follow' : 'follow'], doc)
  }

  static identity (doc) {
    return `engager-${doc.id}-follow`
  }

  createElement (doc) {
    return html`
      <div class="Text Text--growing">
        <p>${__('To-do, add social media channels here.')}</p>
      </div>
    `
  }
}
