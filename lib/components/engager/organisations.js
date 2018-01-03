const html = require('choo/html')
const card = require('../card')
const { href } = require('../../params')
const { __ } = require('../../locale')

const TAG_REGEX = /^goal-(\d{1,2})$/

module.exports = function (state, doc, emit) {
  const organisations = state.pages.items.filter(item => {
    const isOrg = item.tags.includes('organisation')

    if (doc.type === 'goal') {
      return isOrg && item.tags.find(tag => {
        const match = tag.match(TAG_REGEX)
        return match && parseInt(match[1], 10) === doc.data.number
      })
    }

    return isOrg
  })

  return html`
    <div class="Grid" id="contribute-organisations-content">
      ${state.pages.isLoading ? Array.from('123').map((index) => html`
        <div class="Grid-cell Grid-cell--md1of2 Grid-cell--lg1of3">
          ${card.loading({ fill: true })}
        </div>
      `) : organisations.map((item, index) => html`
        <div class="Grid-cell Grid-cell--md1of2 Grid-cell--lg1of3" id="${doc.id}-organisation-${index}">
          ${card(state, emit, asCard(item), { fill: item.data.color || true })}
        </div>
      `)}
    </div>
  `

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
}
