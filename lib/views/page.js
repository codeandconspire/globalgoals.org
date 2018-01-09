const html = require('choo/html')
const { asText } = require('prismic-richtext')
const { __ } = require('../locale')
const Single = require('../components/single')
const edit = require('../components/edit')
const view = require('../components/view')
const intro = require('../components/intro')
const Slices = require('../components/slices')

module.exports = view('page', page, title)

function page (state, emit, render) {
  const uid = (state.params.sub_path || state.params.path)
  const doc = state.pages.items.find(item => item.uid === uid)
  const parent = state.pages.items.find(item => item.uid === state.params.path)

  if (!doc) {
    // Trying to render w/o document on server resolves to 404
    if (typeof window === 'undefined') {
      const error = new Error('Page not found')
      error.status = 404
      throw error
    }

    if (!doc) emit('pages:fetch', { uid: uid })
    if (state.params.sub_path && !parent) {
      emit('pages:fetch', { uid: state.params.path })
    }

    if (!doc && !parent) {
      return html`
        <main class="View-main u-transformTarget" id="view-main">
          <div class="View-section">
            ${intro({ loading: true, pageIntro: true })}
          </div>
        </main>
      `
    }
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      ${render(Single, doc, { parent: parent, isLoading: state.pages.isLoading, key: state.params.path })}
      ${doc ? render(Slices, doc.id, doc.data.slices, content => html`
        <div class="View-section">
          ${content}
        </div>
      `) : null}
      ${edit(state, doc)}
    </main>
  `
}

function title (state) {
  if (state.pages.isLoading) return __('LOADING_TEXT_SHORT')
  const path = state.params.sub_path || state.params.path
  const doc = state.pages.items.find(item => item.uid === path)
  return asText(doc.data.title)
}
