const html = require('choo/html')
const { asText } = require('prismic-richtext')
const { __ } = require('../locale')
const single = require('../components/single')
const view = require('../components/view')
const edit = require('../components/edit')
const intro = require('../components/intro')
const slices = require('../components/slices')

const GOAL_TAG = /^goal-(\d{1,2})$/

module.exports = view('activity', activity, title)

function activity (state, emit) {
  const { activities, goals, params } = state
  const doc = activities.items.find(doc => doc.uid === params.activity)

  /**
   * Fetch missing document
   */

  if (!doc) {
    emit('activities:fetch', { uid: params.activity })
    return html`
      <main class="View-main u-transformTarget" id="view-main">
        <div class="View-section">
          ${intro({ pageIntro: true, loading: true })}
        </div>
      </main>
    `
  }

  /**
   * Single out goal number from document tags
   */

  const numbers = doc.tags
    .map(tag => tag.match(GOAL_TAG))
    .filter(Boolean)
    .map(match => +match[1])

  /**
   * Find all tagged documents
   */

  const docs = numbers
    .map(num => goals.items.find(goal => goal.data.number === num))
    .filter(Boolean)

  /**
   * Identify missing documents
   */

  const missing = numbers.filter(num => !docs.find(doc => doc.data.number === num))
  if (missing.length && !state.goals.error) {
    emit('goals:fetch', { number: missing, critical: false })
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      ${single(state, emit, doc)}
      ${slices(state, emit, doc.data.slices).map(content => html`
        <div class="View-section">
          ${content}
        </div>
      `)}
      ${edit(state, doc)}
    </main>
  `
}

function title (state) {
  if (state.activities.isLoading) { return html`<span class="u-loading">${__('LOADING_TEXT_SHORT')}</span>` }

  const { activities, params } = state
  const doc = activities.items.find(doc => doc.uid === params.activity)

  return asText(doc.data.title)
}
