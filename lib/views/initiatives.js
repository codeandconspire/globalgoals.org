const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { href } = require('../params');
const { __ } = require('../locale');
const view = require('../components/view');
const card = require('../components/card');

const GOAL_TAG = /^goal-(\d{1,2})$/;

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
        <div class="View-intro">
          <div class="Text">
            <h1>${ doc ? asText(doc.data.title) : html`<span class="u-textLoading">${ __('Loading') }</span>` }</h1>
            ${ doc ? asElement(doc.data.intro, doc => href(state, doc)) : null }
          </div>
        </div>

        <div class="Grid">
          ${ state.initiatives.items.length ? html`
            <div class="Grid-cell">
              ${ card(state, emit, state.initiatives.items[0], { horizontal: true, fill: true }) }
            </div>
          ` : null }
          ${ state.initiatives.items.slice(1).map(doc => html`
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">
              ${ card(state, emit, doc, { fill: true }) }
            </div>
          `) }
        </div>
      </section>
    </main>
  `;
}

function title(state) {
  if (state.pages.isLoading) { return __('Loading'); }
  const doc = state.pages.items.find(item => item.uid === 'initiatives');
  return asText(doc.data.title);
}
