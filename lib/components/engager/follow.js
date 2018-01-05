const html = require('choo/html')
const Component = require('nanocomponent')
const card = require('../card')
const { resolve, routes } = require('../../params')
const links = require('../header/links')
const { __ } = require('../../locale')

module.exports = class Follow extends Component {
  constructor (id, state, emit, doc) {
    super(id)
    this.state = state
    this.emit = emit
  }

  static title () {
    return __('Stay in Touch')
  }

  static href (doc) {
    return resolve(routes[doc.type === 'goal' ? 'goal_follow' : 'follow'], doc)
  }

  static identity (doc) {
    return `engager-${doc.id}-follow`
  }

  createElement () {
    return html`
      <div class="Grid" id="contribute-organisations-content">
        ${links.social.map(item => item(this.state)).map(item => html`
          <div class="Grid-cell Grid-cell--md1of2">
            ${card(this.state, this.emit, asCard(item), getCardOptions(item))}
          </div>
        `)}
      </div>
    `
  }
}

function asCard (link) {
  return {
    title: __('Global Goals on %s', link.title),
    image: link.image.src,
    body: link.desc,
    href: link.href,
    link: __('Go to %s', link.title)
  }
}

function getCardOptions (link) {
  const props = {
    withIcon: true,
    icon: link.name,
    fill: true
  }

  props[link.name] = true

  return props
}
