const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { href } = require('../params');
const { __ } = require('../locale');
const view = require('../components/view');
const card = require('../components/card');
const intro = require('../components/intro');

module.exports = view(initiatives, title);

function initiatives(state, emit) {
  const { initiatives: { isLoading, items, total }} = state;
  const doc = state.pages.items.find(item => item.uid === 'initiatives');

  /**
   * Fetch any missing documents
   */

  if (!state.pages.isLoading && !doc) {
    emit('pages:fetch', { type: 'landing_page', uid: 'initiatives' });
  }

  if (!isLoading && items.length !== total) {
    emit('initiatives:fetch');
  }

  return html`
    <main class="View-main">
      <section class="View-section">
        ${ doc ? intro({title: asText(doc.data.title), body: asElement(doc.data.intro, doc => href(state, doc)) }) : intro() }

        <div class="Grid">
          ${ state.initiatives.items.length ? html`
            <div class="Grid-cell">
              ${ card(state, emit, asCard(state.initiatives.items[0]), { horizontal: true, fill: true }) }
            </div>
          ` : null }
          ${ state.initiatives.items.slice(1).map(doc => html`
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">
              ${ card(state, emit, asCard(doc), { fill: true }) }
            </div>
          `) }
        </div>
      </section>
    </main>
  `;

  function asCard(doc) {
    return {
      title: doc.data.title,
      image: doc.data.image,
      body: doc.data.introduction || doc.data.body,
      tags: doc.tags,
      href: href(state, doc),
      link: __('View campaign')
    };
  }
}

function title(state) {
  if (state.pages.isLoading) { return __('LOADING_TEXT_SHORT'); }
  const doc = state.pages.items.find(item => item.uid === 'initiatives');
  return asText(doc.data.title);
}
