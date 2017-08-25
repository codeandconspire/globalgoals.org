const html = require('choo/html');
const asElement = require('prismic-element');
const { asText } = require('prismic-richtext');
const { __ } = require('../locale');
const view = require('../components/view');
const goalGrid = require('../components/goal-grid');
const intro = require('../components/intro');
const outro = require('../components/outro');
const callToAction = require('../components/call-to-action');
const { href } = require('../params');

module.exports = view(home);

function home(state, emit) {
  const { goals, pages } = state;
  const doc = pages.items.find(item => item.uid === 'home');

  if (!doc && !pages.isLoading) {
    emit('pages:fetch', { type: 'landing_page', uid: 'home' });
  }

  /**
   * Fetch missing goals
   */

  if (!goals.isLoading && goals.items.length !== goals.total) {
    const missing = [];
    for (let i = 1; i <= goals.total; i += 1) {
      if (!goals.items.find(item => item.data.number === i)) {
        missing.push(i);
      }
    }

    emit('goals:fetch', missing.filter(Boolean));
  }

  const classNames = [ 'View-main' ];
  if (state.transitions.includes('takeover')) {
    classNames.push('View-main--shrink');
  }

  return html`
    <main class="View-main">
      <section class="View-section">
        ${ doc ? intro({title: asText(doc.data.title), body: asElement(doc.data.intro, doc => href(state, doc)) }) : intro() }
        ${ goalGrid(state, emit) }
      </section>

      <section class="View-section">
        ${ callToAction(state, goals.items.filter(goal => goal.data.media.length).map(goal => goal.data.media[0]), emit) }
      </section>

      ${ doc ? outro({title: asText(doc.data.outro_title), body: asElement(doc.data.outro_body, doc => href(state, doc))}) : null }
    </main>
  `;
}
