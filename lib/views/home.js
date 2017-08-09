const html = require('choo/html');
const view = require('../components/view');
const { icons, texts } = require('../components/goals');
const { resolve } = require('../params');

module.exports = view(goal, title);

const GOALS = [];
for (let i = 1; GOALS.length < 17; i += 1) {
  GOALS.push(i);
}

function goal(state, emit) {
  const { referrer } = state.params;

  return html`
    <div>
      <h1 class="View-title">The Global Goals</h1>
      ${ referrer ? html`
        <p>
          Referrer id: ${ referrer }
        </p>
      ` : null }
      <ul>
        ${ GOALS.map(value => html`
          <li>
            <a href="${ resolve(state.routes.goal, { goal: value, slug: random(), referrer: referrer }) }">
              ${ texts[value - 1].title } <br />
              ${ icons[value - 1]() }
              ${ icons[value - 1](false) }
              ${ icons[value - 1](true, true) }
            </a>
          </li>
        `) }
      </ul>
    </div>
  `;
}

function random() {
  return Math.random().toString(36).substring(7);
}

function title(state) {
  return 'The Global Goals';
}
