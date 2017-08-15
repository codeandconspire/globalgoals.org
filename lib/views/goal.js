const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const view = require('../components/view');
const { icons } = require('../components/goal');
const header = require('../components/header');
const footer = require('../components/footer');

module.exports = view(goal, title);

function goal(state, emit) {
  const { goal, referrer } = state.params;
  const doc = state.goals.items.find(item => item.data.number === goal);

  /**
   * Fetch missing goal
   */

  if (!doc) {
    emit('goals:fetch', goal);
    return html`<em>Loading</em>`;
  }

  return html`
    <div>
      ${ header() }
      <main>
        <section class="View-section">
          <div class="Text">
            <h1>${ asText(doc.data.title) }</h1>
            ${ icons[goal - 1]() }
            ${ referrer ? html`
              <p>
                Referrer id: ${ referrer }
              </p>
            ` : null }
            ${ asElement(doc.data.preamble) }
            <!-- TODO: Translate -->
            <h2>Targets</h2>
            <ul>
              ${ doc.data.targets.map(target => html`
                <li>
                  ${ asElement(target.body) }
                </li>
              `) }
            </ul>
          </div>
        </section>
      </main>
      ${ footer() }
    </div>
  `;
}

function title(state) {
  const num = state.params.goal;
  const doc = state.goals.items.find(item => item.data.number === num);

  if (state.goals.isLoading) {
    // TODO: Translate
    return 'Loading';
  }

  return `${ doc.data.number } ${ asText(doc.data.title) }`;
}
