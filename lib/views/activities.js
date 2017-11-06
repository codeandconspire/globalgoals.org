const html = require('choo/html')
const { asText } = require('prismic-richtext')
const asElement = require('prismic-element')
const { href } = require('../params')
const { __ } = require('../locale')
const view = require('../components/view')
const slices = require('../components/slices')
const edit = require('../components/edit')
const card = require('../components/card')
const intro = require('../components/intro')

module.exports = view(activities, title)

function activities (state, emit) {
  const { activities: { isLoading, items, total } } = state
  const doc = state.pages.items.find(item => item.uid === 'activities')

  /**
   * Fetch any missing documents
   */

  if (!state.pages.isLoading && !doc) {
    emit('pages:fetch', { type: 'landing_page', uid: 'activities' })
  }

  if (!isLoading && items.length !== total) {
    emit('activities:fetch')
  }

  /**
   * Sort activities by order field primarily and date secondarily
   */

  const activities = state.activities.items.slice().sort((a, b) => {
    const aDate = Date.parse(a.last_publication_date)
    const bDate = Date.parse(b.last_publication_date)

    if (a.data.order === b.data.order) {
      return aDate > bDate ? -1 : 1
    }

    switch (a.data.order) {
      case 'High priority': return -1
      case 'Low priority': return 1
      case 'By date':
      default: {
        switch (b.data.order) {
          case 'Hight priority': return 1
          case 'Low priority': return -1
          default: return aDate > bDate ? -1 : 1
        }
      }
    }
  })

  function getIntro () {
    if (doc && 'data' in doc) {
      return intro({
        title: asText(doc.data.title),
        body: asElement(doc.data.introduction, doc => href(state, doc)),
        pageIntro: true
      })
    } else {
      return intro({ loading: true, pageIntro: true })
    }
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      <section class="View-section">
        ${getIntro()}

        ${!isLoading && items.length === total ? html`
          <div class="Grid">
            <div class="Grid-cell">
              ${card(state, emit, asCard(activities[0]), {
                horizontal: true,
                fill: activities[0].data.color || true,
                largeText: true
              })}
            </div>
            ${activities.slice(1).map(doc => html`
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

      ${doc ? slices(state, emit, doc.data.body.map(slice => {
        switch (slice.slice_type) {
          default: return slice
        }
      })).map(content => html`
        <section class="View-section">
          ${content}
        </section>
      `) : null}

      ${edit(state, doc)}
    </main>
  `

  function asCard (doc) {
    let url

    if (doc.data.redirect.link_type === 'Document') {
      url = href(state, doc.data.redirect)
    } else if (doc.data.redirect.link_type === 'Web') {
      url = doc.data.redirect.url
    } else if (doc.data.redirect.link_type === 'Media') {
      url = doc.data.redirect.url
    } else {
      url = href(state, doc)
    }

    return {
      title: doc.data.title,
      image: doc.data.image,
      body: doc.data.introduction || doc.data.body,
      tags: doc.tags,
      href: url,
      link: __('Read more')
    }
  }
}

function title (state) {
  if (state.pages.isLoading) { return __('LOADING_TEXT_SHORT') }
  const doc = state.pages.items.find(item => item.uid === 'activities')
  return asText(doc.data.title)
}
