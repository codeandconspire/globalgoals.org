const html = require('choo/html');
const { asText } = require('prismic-richtext');
const { __ } = require('../locale');
const single = require('../components/single');
const edit = require('../components/edit');
const view = require('../components/view');
const intro = require('../components/intro');

module.exports = view(page, title);

function page(state, emit) {
  const doc = state.pages.items.find(item => item.uid === state.params.page);

  if (!doc) {
    emit('pages:fetch', { type: 'page', uid: state.params.page });
    return html`
      <main class="View-main u-transformTarget" id="view-main">
        <div class="View-section">
          ${ intro() }
        </div>
      </main>
    `;
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      ${ single(state, emit, doc) }
      ${ edit(state, doc) }
    </main>
  `;
}

function title(state) {
  if (state.pages.isLoading) { return __('LOADING_TEXT_SHORT'); }
  const doc = state.pages.items.find(item => item.uid === state.params.page);
  return asText(doc.data.title);
}
