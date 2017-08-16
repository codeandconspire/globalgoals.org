const html = require('choo/html');
const { asText } = require('prismic-richtext');
const view = require('../components/view');
const goalGrid = require('../components/goal-grid');
const header = require('../components/header');
const footer = require('../components/footer');

module.exports = view(home);

function home(state, emit) {
  /**
   * Fetch missing goals
   */

  if (state.goals.items.length !== state.goals.total) {
    const missing = [];
    for (let i = 1; i <= state.goals.total; i += 1) {
      if (!state.goals.items.find(item => item.data.number === i)) {
        missing.push(i);
      }
    }

    emit('goals:fetch', missing.filter(Boolean));
  }

  /**
   * Compose list of goals and placeholders for goals being fetched
   */

  const goals = [];
  for (let i = 0; i < state.goals.total; i += 1) {
    goals.push(state.goals.items.find(item => item.data.number === i + 1));
  }

  return html`
    <div>
      ${ header(state) }
      <main>
        <section class="View-section">
          <div class="View-intro">
            <div class="Text">
              <h1>The Goals</h1>
              <p>The Global Goals are only going to work if we fight for them and you can’t fight for your rights if you don’t know what they are.</p>
            </div>
          </div>
          ${ goalGrid(state, goals) }
        </section>
        ${ footer() }
      </main>
    </div>
  `;
}
