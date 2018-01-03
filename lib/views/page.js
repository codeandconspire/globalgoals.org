const html = require('choo/html')
const { asText } = require('prismic-richtext')
const { __ } = require('../locale')
const Single = require('../components/single')
const edit = require('../components/edit')
const view = require('../components/view')
const intro = require('../components/intro')
const slices = require('../components/slices')

module.exports = view('page', page, title)

function page (state, emit, render) {
  const doc = state.pages.items.find(item => item.uid === state.params.path)

  if (!doc) {
    // Trying to render w/o document on server resolves to 404
    if (typeof window === 'undefined') {
      const error = new Error('Page not found')
      error.status = 404
      throw error
    }

    emit('pages:fetch', { uid: state.params.path })
    return html`
      <main class="View-main u-transformTarget" id="view-main">
        <div class="View-section">
          ${intro({ loading: true, pageIntro: true })}
        </div>
      </main>
    `
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      ${render(Single, doc)}
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
  if (state.pages.isLoading) { return __('LOADING_TEXT_SHORT') }
  const doc = state.pages.items.find(item => item.uid === state.params.path)
  return asText(doc.data.title)
}
