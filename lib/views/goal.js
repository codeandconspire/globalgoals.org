const html = require('choo/html');
const { asText } = require('prismic-richtext');
const { __ } = require('../locale');
const view = require('../components/view');
const edit = require('../components/edit');
const layer = require('../components/layer');
const createHero = require('../components/hero');
const target = require('../components/target');
const createCallToAction = require('../components/call-to-action');
const { resolve } = require('../params');

const hero = createHero();
const callToAction = createCallToAction('goal');

module.exports = view(goal, title);

function goal(state, emit) {
  const { goal } = state.params;
  const doc = state.goals.items.find(item => item.data.number === goal);

  /**
   * Fetch missing goal
   */

  if (!doc) {
    emit('goals:fetch', goal);
    return html`
      <main class="View-main" id="view-main">
        <div class="View-section u-transformTarget">

        </div>
      </main>
    `;
  }

  let media;
  if (doc && state.params.media) {
    media = doc.data.media.find(item => item.slug === state.params.media);

    if (!media) {
      const error = new Error('Image could not be found');
      error.status = 404;
      throw error;
    }
  }

  return html`
    <main class="View-main" id="view-main">
      ${ hero(state, goal, emit, { background: !media }) }

      ${ media ? layer(media, onclose) : null }

      <section class="View-section u-transformTarget" id="targets">
        <div class="Space Space--contain Space--start Space--end">
          <div class="Text Text--growing">
            <h2 class="Text-h2">${ asText(doc.data.targets_title) }</h2>
          </div>
        </div>
        <ul class="Grid Grid--loose">
          ${ doc.data.targets.map(props => html`
            <li class="Grid-cell Grid-cell--md1of2">
              ${ target(props, goal) }
            </li>
          `) }
        </ul>
      </section>

      <section class="View-section u-transformTarget" id="call-to-action">
        ${ callToAction(state, doc, emit) }
      </section>

      ${ edit(state, doc) }
    </main>
  `;

  function onclose() {
    emit(state.events.PUSHSTATE, resolve(state.routes.goal, {
      goal: doc.data.number,
      slug: doc.uid,
      referrer: state.params.referrer
    }));
  }
}

function title(state) {
  if (state.goals.isLoading) { return html`<span class="u-loading">${ __('LOADING_TEXT_SHORT') }</span>`; }

  const num = state.params.goal;
  const doc = state.goals.items.find(item => item.data.number === num);

  return `Goal ${ doc.data.number }: ${ asText(doc.data.title) }`;
}
