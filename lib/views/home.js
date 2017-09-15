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
        <div class="Space Space--contain Space--startTall Space--endShort">
          <div class="Text Text--growing" id="video">
            <h1 class="Text-h2">The video</h1>
            <p>Something interesting to say about maybe the video it here.</p>
          </div>
        </div>
        <div class="Text Text--full">
          <div class="Text-embed">
            <iframe type="text/html" src="https://www.youtube.com/embed/GO5FwsblpT8?modestbranding=1&playsinline=1&rel=0&showinfo=0&color=white" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>
          </div>
        </div>
      </section>

      ${ edit(state, doc) }
    </main>
  `;
}
