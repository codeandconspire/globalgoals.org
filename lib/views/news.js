const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { __ } = require('../locale');
const view = require('../components/view');
const card = require('../components/card');
const { href } = require('../params');

const ORIG_PUB_DATE = 'original_publication_date';
const PUB_DATE = 'first_publication_date';

module.exports = view(initiatives, title);

function initiatives(state, emit) {
  const { articles: { isLoading, items }} = state;
  const doc = state.pages.items.find(item => item.uid === 'news');

  if (!state.pages.isLoading && !doc) {
    emit('pages:fetch', { type: 'landing_page', uid: 'news' });
  }

  /**
   * Fetch all missing documents
   */

  if (!isLoading && items.length < state.articles.total) {
    emit('articles:fetch');
  }

  const articles = items.slice().sort((a, b) => {
    const dateA = a.data[ORIG_PUB_DATE] || a[PUB_DATE];
    const dateB = b.data[ORIG_PUB_DATE] || b[PUB_DATE];
    return Date.parse(dateA) > Date.parse(dateB) ? -1 : 1;
  });

  return html`
    <main class="View-main">
      <section class="View-section">
        <div class="View-intro">
          <div class="Text">
            <h1>${ doc ? asText(doc.data.title) : html`<em>${ __('Loading') }</em>` }</h1>
            ${ doc ? asElement(doc.data.intro, doc => href(state, doc)) : null }
          </div>
        </div>
        <div class="Grid">
          ${ articles.map(doc => html`
            <div class="Grid-cell Grid-cell--1of3">
              ${ card(state, emit, doc, { constrain: true }) }
            </div>
          `) }
        </div>
      </section>
    </main>
  `;
}

function title(state) {
  if (state.pages.isLoading) { return __('Loading'); }
  const doc = state.pages.items.find(item => item.uid === 'news');
  return asText(doc.data.title);
}
