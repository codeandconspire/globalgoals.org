const html = require('choo/html');
const asElement = require('prismic-element');
const { asText } = require('prismic-richtext');
const view = require('../components/view');
const goalGrid = require('../components/goal-grid');
const intro = require('../components/intro');
const edit = require('../components/edit');
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
    <main class="View-main u-transformTarget" id="view-main">
      <section class="View-section">
        ${ (doc) && 'data' in doc ? intro({title: asText(doc.data.title), body: asElement(doc.data.introduction, doc => href(state, doc)) }) : intro() }
        ${ goalGrid(state, emit) }
      </section>

      <section class="View-section">
        <div class="Space Space--startTall">
          <div class="Text Text--full" id="video">
            <div class="Text-embed">
              <iframe src="https://player.vimeo.com/video/234053790?color=ffffff&title=0&byline=0&portrait=0" allowfullscreen></iframe>
            </div>
          </div>
        </div>
      </section>

      ${ edit(state, doc) }
    </main>
  `;
}
