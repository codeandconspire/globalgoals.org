const html = require('choo/html');
const { asText } = require('prismic-richtext');
const view = require('../components/view');
const { icons } = require('../components/goal');
const { resolve } = require('../params');

module.exports = view(goal);

function goal(state, emit) {
  const { referrer } = state.params;

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
        ` : null) }
      </div>
    </div>
  `;
}
