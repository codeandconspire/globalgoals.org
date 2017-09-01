const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { __ } = require('../locale');
const { resolve } = require('../params');
const single = require('../components/single');
const view = require('../components/view');
const edit = require('../components/edit');
const { href } = require('../params');
const intro = require('../components/intro');

const GOAL_TAG = /^goal-(\d{1,2})$/;

module.exports = view(initiative, title);

function initiative(state, emit) {
  const { initiatives, goals, params } = state;
  const doc = initiatives.items.find(doc => doc.uid === params.initiative);

  /**
   * Fetch missing document
   */

  if (!doc) {
    emit('initiatives:fetch', params.initiative);
    return html`
      <main class="View-main View-animationFriendly">
        <div class="View-section">
          ${ intro() }
        </div>
      </main>
    `;
  }

  /**
   * Single out goal number from document tags
   */

  const numbers = doc.tags
    .map(tag => tag.match(GOAL_TAG))
    .filter(Boolean)
    .map(match => +match[1]);

  /**
   * Find all tagged documents
   */

  const docs = numbers
    .map(num => goals.items.find(goal => goal.data.number === num))
    .filter(Boolean);

  /**
   * Identify missing documents
   */

  const missing = numbers.filter(num => !docs.find(doc => doc.data.number === num));
  if (missing.length) {
    emit('goals:fetch', missing);
  }

  return html`
    <main class="View-main View-animationFriendly">
      ${ single(state, emit, doc) }
      ${ edit(doc.id) }
    </main>
  `;
}

function title(state) {
  if (state.initiatives.isLoading) { return html`<span class="u-loading">${ __('LOADING_TEXT_SHORT') }</span>`; }

  const { initiatives, params } = state;
  const doc = initiatives.items.find(doc => doc.uid === params.initiative);

  return asText(doc.data.title);
}
