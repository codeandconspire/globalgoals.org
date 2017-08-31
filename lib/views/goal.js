const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { __ } = require('../locale');
const view = require('../components/view');
const edit = require('../components/edit');
const createHero = require('../components/hero');
const createTarget = require('../components/target');

const hero = createHero();

module.exports = view(goal, title);

const targets = [];

function goal(state, emit) {
  const { goal } = state.params;
  const doc = state.goals.items.find(item => item.data.number === goal);

  /**
   * Fetch missing goal
   */

  if (!doc) {
    emit('goals:fetch', goal);
    return html`
      <main class="View-main">
        <div class="View-section">

        </div>
      </main>
    `;
  }

  if (doc.data.targets.length !== targets.length) {
    targets.splice(0, targets.length);
  }

  return html`
    <main class="View-main">
      ${ edit(doc.id) }
      ${ hero(state, goal) }
      <section class="View-section">
        <div class="Space Space--contain Space--start Space--endShort">
          <div class="Text">
            <h2 class="Text-h2">${ asText(doc.data.targets_title) }</h2>
            ${ asElement(doc.data.targets_introduction) }
          </div>
        </div>
        <ul class="Grid Grid--wide">
          ${ doc.data.targets.map((props, index) => {
            if (!targets[index]) {
              targets.push(createTarget(props.id, goal));
            }

            return html`
              <li class="Grid-cell Grid-cell--md1of2">
                ${ targets[index](props) }
              </li>
            `;
          }) }
        </ul>
      </section>
    </main>
  `;
}

function title(state) {
  if (state.goals.isLoading) { return html`<span class="u-loading">${ __('LOADING_TEXT_SHORT') }</span>`; }

  const num = state.params.goal;
  const doc = state.goals.items.find(item => item.data.number === num);

  return `Goal ${ doc.data.number }: ${ asText(doc.data.title) }`;
}
