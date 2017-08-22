const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { __ } = require('../locale');
const single = require('../components/single');
const view = require('../components/view');
const { href } = require('../params');

module.exports = view(page, title);

function page(state, emit) {
  const doc = state.pages.items.find(item => item.uid === state.params.page);

  if (!doc) {
    emit('pages:fetch', { type: 'page', uid: state.params.page });
    return html`<em>Loading</em>`;
  }

  return html`
    <main class="View-main">
      ${ single(state, emit, doc) }
    </main>
  `;
}

function title(state) {
  if (state.pages.isLoading) { return html`<span class="u-textLoading">${ __('Loading') }</span>`; }

  const doc = state.pages.items.find(item => item.uid === state.params.page);

  return asText(doc.data.title);
}
