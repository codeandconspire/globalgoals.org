const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { __ } = require('../locale');
const view = require('../components/view');
const createHero = require('../components/hero');
const { href } = require('../params');

const hero = createHero();

module.exports = view(goal, title);

function goal(state, emit) {
  const { goal } = state.params;
  const doc = state.goals.items.find(item => item.data.number === goal);

  /**
   * Fetch missing goal
   */

  if (!doc) {
    emit('goals:fetch', goal);
    return html`<span class="u-textLoading">${ __('Loading') }</span>`;
  }

  return html`
    <div class="View-container">
      <main class="View-main">
        ${ hero(state, goal) }
        <section class="View-section">
          <div class="Text">
            <h1 class="Text-h2">${ __('Targets') }</h1>
            <ul>
              ${ doc.data.targets.map(target => html`
                <li>
                  ${ asElement(target.body, doc => href(state, doc)) }
                </li>
              `) }
            </ul>
          </div>
        </section>
      </main>
    </div>
  `;
}

function title(state) {
  if (state.goals.isLoading) { return html`<span class="u-textLoading">${ __('Loading') }</span>`; }

  const num = state.params.goal;
  const doc = state.goals.items.find(item => item.data.number === num);

  return `Goal ${ doc.data.number } – ${ asText(doc.data.title) }`;
}
