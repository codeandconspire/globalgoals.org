const html = require('choo/html')
const { asText } = require('prismic-richtext')
const { __ } = require('../locale')
const view = require('../components/view')
const single = require('../components/single')
const edit = require('../components/edit')
const intro = require('../components/intro')

const GOAL_TAG = /^goal-(\d{1,2})$/

module.exports = view(article, title)

function article (state, emit) {
  const { articles, goals, params } = state
  const doc = articles.items.find(doc => doc.uid === params.article)

  /**
   * Fetch missing document
   */

  if (!doc) {
    emit('articles:fetch', { uid: params.article })
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
  if (missing.length) {
    emit('goals:fetch', missing)
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      ${single(state, emit, doc, {showDate: true})}
      ${edit(state, doc)}
    </main>
  `
}

function title (state) {
  if (state.articles.isLoading) { return html`<span class="u-loading">${__('LOADING_TEXT_SHORT')}</span>` }

  const { articles, params } = state
  const doc = articles.items.find(doc => doc.uid === params.article)

  return asText(doc.data.title)
}
