const html = require('choo/html');
const { asText } = require('prismic-richtext');
const { resolve } = require('../params');
const view = require('../components/view');

const GOAL_TAG = /^goal-(\d{1,2})$/;

module.exports = view(initiatives, title);

function initiatives(state, emit) {
  const { initiatives: { isLoading, items, total }} = state;

  /**
   * Fetch all missing documents
   */

  if (items.length !== total) {
    emit('initiatives:fetch');
  }

  return html`
    <div class="View-section">
      <div class="Text">
        <!-- TODO: Translate -->
        <h1>Initiatives</h1>
      </div>
      ${ isLoading ? html`<em>Loading</em>` : null }
      <ul>
        ${ state.initiatives.items.map(doc => html`
          <li class="Text">
            <a href="${ resolve(state.routes.initiative, { initiative: doc.uid }) }">
              ${ asText(doc.data.title) }
              <br />
              <em>Tags: ${ doc.tags.map(tag => tag.match(GOAL_TAG)).filter(Boolean).map(match => match[1]).join(', ') }</em>
            </a>
          </li>
        `) }
    </div>
  `;
}

function title(state) {
  // TODO: Translate
  return 'Initiatives';
}
