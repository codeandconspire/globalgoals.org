const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { __ } = require('../locale');
const view = require('../components/view');
const card = require('../components/card');
const intro = require('../components/intro');
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

  /**
   * Sort articles by publication date
   */

  const articles = items.slice().sort((a, b) => {
    const dateA = a.data[ORIG_PUB_DATE] || a[PUB_DATE];
    const dateB = b.data[ORIG_PUB_DATE] || b[PUB_DATE];
    return Date.parse(dateA) > Date.parse(dateB) ? -1 : 1;
  });

  return html`
    <main class="View-main">
      <section class="View-section">
        ${ doc ? intro({title: asText(doc.data.title), body: asElement(doc.data.intro, doc => href(state, doc)) }) : intro() }

        <div class="Grid">
          ${ articles.slice(0, 2).map(doc => html`
            <div class="Grid-cell Grid-cell--md1of2">
              ${ card(state, emit, doc, { date: true }) }
            </div>
          `) }
          ${ articles.slice(2).map(doc => html`
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">
              ${ card(state, emit, doc, { date: true }) }
            </div>
          `) }
        </div>
      </section>
    </main>
  `;
}

function title(state) {
  if (state.pages.isLoading) { return html`<span class="u-textLoading">${ __('Loading') }</span>`; }
  const doc = state.pages.items.find(item => item.uid === 'news');
  return asText(doc.data.title);
}
