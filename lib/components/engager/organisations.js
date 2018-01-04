const html = require('choo/html')
const Component = require('nanocomponent')
const card = require('../card')
const { inBrowser } = require('../base/utils')
const { href, resolve, routes } = require('../../params')
const { __ } = require('../../locale')

const TAG_REGEX = /^goal-(\d{1,2})$/

module.exports = class Organisations extends Component {
  constructor (id, state, emit, doc) {
    super(id)
    this.state = state
    this.emit = emit
    this.organisations = this.state.pages.items.filter(isOrg)

    if (inBrowser) {
      const tags = [ 'organisation' ]
      if (doc.type === 'goal') tags.push(`goal-${doc.data.number}`)
      emit('pages:fetch', { tags })
    }
  }

  static title () {
    return __('Join an Organisation')
  }

  static href (doc) {
    return resolve(
      routes[doc.type === 'goal' ? 'goal_organisations' : 'organisations'],
      doc
    )
  }

  static identity (doc) {
    return `engager-${doc.id}-organisations`
  }

  update () {
    return this.state.pages.items.filter(isOrg).length !== this.organisations
  }

  createElement (doc) {
    let orgs = this.organisations = this.state.pages.items.filter(isOrg)

    if (doc.type === 'goal') {
      orgs = orgs.filter(org => org.tags.find(tag => {
        const match = tag.match(TAG_REGEX)
        return match && parseInt(match[1], 10) === doc.data.number
      }))
    }

    return html`
      <div class="Grid">
        ${this.state.pages.isLoading ? Array.from('123').map(() => html`
          <div class="Grid-cell Grid-cell--md1of2 Grid-cell--lg1of3">
            ${card.loading({fill: true})}
          </div>
        `) : orgs.map((item, index) => html`
          <div class="Grid-cell Grid-cell--md1of2 Grid-cell--lg1of3">
            ${card(this.state, this.emit, asCard(item), {fill: item.data.color || true})}
          </div>
        `)}
      </div>
    `
  }
}

function isOrg (doc) {
  return doc.tags.includes('organisation')
}

function asCard (doc) {
  let url

  if (doc.data.redirect.link_type === 'Document') {
    url = href(doc.data.redirect)
  } else if (doc.data.redirect.link_type === 'Web') {
    url = doc.data.redirect.url
  } else if (doc.data.redirect.link_type === 'Media') {
    url = doc.data.redirect.url
  } else {
    url = href(doc)
  }

  return {
    title: doc.data.title,
    image: doc.data.image,
    body: doc.data.introduction,
    href: url,
    link: __('Go to website')
  }
}
