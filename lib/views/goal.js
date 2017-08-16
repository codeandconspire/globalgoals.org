const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { __ } = require('../locale');
const view = require('../components/view');
const { color } = require('../components/goal');
const header = require('../components/header');
const footer = require('../components/footer');
const { setFavicon } = require('../components/favicon');

module.exports = view(goal, title);

function goal(state, emit) {
  const { goal, referrer } = state.params;
  const doc = state.goals.items.find(item => item.data.number === goal);

  setFavicon(goal, color(goal));

  /**
   * Fetch missing goal
   */

  if (!doc) {
    emit('goals:fetch', goal);
    return html`<em>${ __('Loading') }</em>`;
  }

  return html`
    <div class="View-container">
      ${ header(state, goal) }
      <main class="View-main GoalPage GoalPage--${ goal }">
        <section class="GoalPage-intro">
          <div class="View-section">
            <div class="Text Text--adaptive">
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
            <h1 class="Text-h2">${ __('Targets') }</h1>
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
  if (state.isLoading) { return __('Loading'); }

  const num = state.params.goal;
  const doc = state.goals.items.find(item => item.data.number === num);

  return `Goal ${ doc.data.number } – ${ asText(doc.data.title) }`;
}
