const html = require('choo/html');
const { asText } = require('prismic-richtext');
const view = require('../components/view');
const { icons } = require('../components/goal');
const { resolve } = require('../params');
const header = require('../components/header');
const footer = require('../components/footer');

module.exports = view(home);

function home(state, emit) {
  const { referrer } = state.params;

  /**
   * Fetch missing goals
   */

  if (state.goals.items.length !== state.goals.total) {
    const missing = [];
    for (let i = 1; i <= state.goals.total; i += 1) {
      if (!state.goals.items.find(item => item.data.number === i)) {
        missing.push(i);
      }
    }

    emit('goals:fetch', missing.filter(Boolean));
  }

  /**
   * Compose list of goals and placeholders for goals being fetched
   */

  const goals = [];
  for (let i = 0; i < state.goals.total; i += 1) {
    goals.push(state.goals.items.find(item => item.data.number === i + 1));
  }

  return html`
    <div>
      ${ header() }
      <div class="View-section">
        <div class="Text">
          <h1>The Global Goals</h1>
          ${ referrer ? html`
            <p>Referrer id: ${ referrer }</p>
          ` : null }

          ${ goals.map((doc, index) => doc ? html`
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
      ${ footer() }
    </div>
  `;
}
