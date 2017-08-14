const html = require('choo/html');
const { asText } = require('prismic-richtext');
const view = require('../components/view');
const { icons } = require('../components/goal');
const { resolve } = require('../params');

module.exports = view(goal);

function goal(state, emit) {
  const { referrer } = state.params;

  if (!state.isLoading && state.goals.filter(item => !item).length) {
    const missing = state.goals.map((item, index) => item ? null : index + 1);
    emit('goals:fetch', missing.filter(Boolean));
  }

  return html`
    <div class="View-section">
      <div class="Text">
        <h1>The Global Goals</h1>
        ${ referrer ? html`
          <p>Referrer id: ${ referrer }</p>
        ` : null }

        ${ state.goals.map((doc, index) => doc ? html`
          <div class="u-inlineBlock">
            <a href="${ resolve(state.routes.goal, { goal: doc.data.number, slug: doc.slugs[0], referrer: referrer }) }">
              ${ icons[index]() }
            </a>
          </div>
        ` : html`
          ${ state.isLoading ? 'Loading' : 'Missing' }
        `) }
      </ul>
    </div>
  `;
}
