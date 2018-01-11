const html = require('choo/html')
const { asText } = require('prismic-richtext')
const asElement = require('prismic-element')
const serialize = require('../components/text/serialize')
const view = require('../components/view')
const edit = require('../components/edit')
const card = require('../components/card')
const Slices = require('../components/slices')
const intro = require('../components/intro')
const { href } = require('../params')
const { __ } = require('../locale')

module.exports = view('action', action, title)

function action (state, emit, render) {
  const doc = state.pages.items.find(item => item.type === 'action')

  /**
   * Fetch any missing documents
   */

  if (!state.pages.isLoading && !doc) {
    emit('pages:fetch', { single: 'action' })
  }

  let links = []
  if (doc) {
    const missing = doc.data.links.filter(item => {
      return !state.pages.items.find(page => page.id === item.link.id)
    }).map(item => item.link.id)

    links = doc.data.links.filter(item => {
      return !item.link.isBroken && !missing.includes(item.link.id)
    }).map(item => state.pages.items.find(page => page.id === item.link.id))

    if (missing.length) emit('pages:fetch', { id: missing })
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      <section class="View-section">
        ${doc && !state.pages.isLoading ? intro({
          title: asText(doc.data.title),
          body: asElement(doc.data.introduction, href, serialize),
          pageIntro: true
        }) : intro({ loading: true, pageIntro: true })}

        ${doc && links.length && !state.pages.isLoading ? html`
          <div class="Grid">
            <div class="Grid-cell">
              ${card(state, emit, asCard(links[0]), {
                horizontal: true,
                fill: links[0].data.color || true,
                largeText: true
              })}
            </div>
            ${links.slice(1).map(doc => html`
              <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">
                ${card(state, emit, asCard(doc), { fill: doc.data.color || true })}
              </div>
            `)}
          </div>
        ` : html`
          <div class="Grid">
            <div class="Grid-cell">${card.loading({ fill: true, horizontal: true, largeText: true })}</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${card.loading({ fill: true })}</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${card.loading({ fill: true })}</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${card.loading({ fill: true })}</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${card.loading({ fill: true })}</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${card.loading({ fill: true })}</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${card.loading({ fill: true })}</div>
          </div>
        `}
      </section>

      ${doc ? render(Slices, doc.id, doc.data.body, content => html`
        <section class="View-section">
          ${content}
        </section>
      `) : null}

      ${edit(state, doc)}
    </main>
  `

  function asCard (doc) {
    const external = doc.data.redirect.link_type === 'Web'
    let url

    if (doc.data.redirect.link_type === 'Document') {
      url = href(doc.data.redirect)
    } else if (external) {
      url = doc.data.redirect.url
    } else if (doc.data.redirect.link_type === 'Media') {
      url = doc.data.redirect.url
    } else {
      url = href(doc)
    }

    return {
      title: doc.data.title,
      image: doc.data.image,
      body: doc.data.introduction || doc.data.body,
      href: url,
      link: external ? __('Go to website') : __('Read more')
    }
  }
}

function title (state) {
  if (state.pages.isLoading) { return __('LOADING_TEXT_SHORT') }
  const doc = state.pages.items.find(item => item.type === 'action')
  return asText(doc.data.title)
}
