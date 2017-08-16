const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const view = require('../components/view');
const { icon } = require('../components/goal');
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
      ${ header(state) }
      <main class="GoalPage GoalPage--${ goal }">
        <section class="GoalPage-intro">
          <div class="View-section">
            <div class="Text Text--adaptive">
              ${ icon({goal: goal, label: false, className: 'GoalPage-icon'}) }
              <h1>${ asText(doc.data.title) }</h1>

              <div class="Text-large">
                ${ asElement(doc.data.introduction) }
              </div>
              ${ referrer ? html`
                <p>Referrer id: ${ referrer }</p>
              ` : null }
            </div>
          </div>
        </section>
        <section class="View-section">
          <div class="Text">
            <h1 class="Text-h2">Targets</h1>
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
  // TODO: Translate
  if (state.goals.isLoading) { return 'Loading'; }

  const num = state.params.goal;
  const doc = state.goals.items.find(item => item.data.number === num);

  return `${ doc.data.number } ${ asText(doc.data.title) }`;
}
