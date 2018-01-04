const html = require('choo/html')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const Component = require('nanocomponent')
const serialize = require('../components/text/serialize')
const view = require('../components/view')
const GoalGrid = require('../components/goal-grid')
const Engager = require('../components/engager')
const intro = require('../components/intro')
const slices = require('../components/slices')
const edit = require('../components/edit')
const { href } = require('../params')

const TOTAL_GOALS = 17

module.exports = class Home extends Component {
  constructor (id, state, emit) {
    super(id)
    this.createElement = view(id, home)
  }

  static identity () {
    return 'home'
  }

  update (state) {
    return !state.transitions.includes('takeover')
  }
}

function home (state, emit, render) {
  const { goals, pages } = state
  const doc = pages.items.find(item => item.type === 'home_page')

  if (!doc && !pages.isLoading) {
    emit('pages:fetch', { single: 'home_page' })
  }

  /**
   * Fetch missing goals
   */

  if (!goals.isLoading && !goals.error && goals.items.length !== TOTAL_GOALS) {
    const missing = []
    for (let i = 1; i <= TOTAL_GOALS; i += 1) {
      if (!goals.items.find(item => item.data.number === i)) {
        missing.push(i)
      }
    }

    emit('goals:fetch', { number: missing.filter(Boolean) })
  }

  const classNames = [ 'View-main' ]
  if (state.transitions.includes('takeover')) {
    classNames.push('View-main--shrink')
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      <section class="View-section" id="goals">
        ${getIntro()}
        ${render(GoalGrid, doc)}
      </section>

      ${doc ? slices(state, emit, doc.data.body.map(slice => {
        switch (slice.slice_type) {
          case 'call_to_action': return render(Engager, doc, {
            title: asText(slice.primary.title),
            introduction: asElement(slice.primary.introduction, href, serialize)
          })
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

  function getIntro () {
    if (doc && 'data' in doc) {
      return intro({
        title: asText(doc.data.title),
        body: asElement(doc.data.introduction, href, serialize),
        pageIntro: true
      })
    } else {
      return intro({ loading: true, pageIntro: true })
    }
  }
}
