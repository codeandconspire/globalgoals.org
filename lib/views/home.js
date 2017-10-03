const html = require('choo/html');
const asElement = require('prismic-element');
const { asText } = require('prismic-richtext');
const view = require('../components/view');
const goalGrid = require('../components/goal-grid');
const createCallToAction = require('../components/call-to-action');
const intro = require('../components/intro');
const quicklink = require('../components/quicklink');
const edit = require('../components/edit');
const { href } = require('../params');

const callToAction = createCallToAction('home');

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
    <main class="View-main u-transformTarget" id="view-main">
      <section class="View-section">
        ${ doc ? intro({title: asText(doc.data.title), body: asElement(doc.data.introduction, doc => href(state, doc)) }) : intro() }
        ${ goalGrid(state, emit, doc) }
      </section>

      ${ doc ? doc.data.body.map(slice => {
        switch (slice.slice_type) {
          case 'quicklink': return html`
            <section class="View-section">
              ${ quicklink({ title: asText(slice.primary.title), body: asElement(slice.primary.body, doc => href(state, doc)) }) }
            </section>
          `;
          case 'call_to_action': {
            const heading = {
              title: asText(slice.primary.title),
              introduction: asElement(slice.primary.introduction, doc => href(state, doc))
            };

            return html`
              <section class="View-section">
                ${ callToAction(state, emit, { heading }) }
              </section>
            `;
          }
          default: return null;
        }
      }) : null }

      ${ edit(state, doc) }
    </main>
  `;
}
