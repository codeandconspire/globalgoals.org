const html = require('choo/html')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const view = require('../components/view')
const goalGrid = require('../components/goal-grid')
const createCallToAction = require('../components/call-to-action')
const intro = require('../components/intro')
const slices = require('../components/slices')
const edit = require('../components/edit')
const { href } = require('../params')

const callToAction = createCallToAction('home')

module.exports = view(home)

function home (state, emit) {
  const { goals, pages } = state
  const doc = pages.items.find(item => item.type === 'home_page')

  if (!doc && !pages.isLoading) {
    emit('pages:fetch', { single: 'home_page' })
  }

  /**
   * Fetch missing goals
   */

  if (!goals.isLoading && goals.items.length !== goals.total) {
    const missing = []
    for (let i = 1; i <= goals.total; i += 1) {
      if (!goals.items.find(item => item.data.number === i)) {
        missing.push(i)
      }
    }

    emit('goals:fetch', missing.filter(Boolean))
  }

  const classNames = [ 'View-main' ]
  if (state.transitions.includes('takeover')) {
    classNames.push('View-main--shrink')
  }

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
      <section class="View-section" id="goals">
        ${getIntro()}
        ${goalGrid(state, emit, doc)}
      </section>

      ${doc ? slices(state, emit, doc.data.body.map(slice => {
        switch (slice.slice_type) {
          case 'call_to_action': return callToAction(state, emit, { doc,
            heading: {
              title: asText(slice.primary.title),
              introduction: asElement(slice.primary.introduction, doc => href(state, doc))
            }})
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
}
