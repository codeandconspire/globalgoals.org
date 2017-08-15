const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const view = require('../components/view');
const { icons } = require('../components/goal');
const header = require('../components/header');
const footer = require('../components/footer');

module.exports = view(goal, title);

function goal(state, emit) {
  const { goal, referrer } = state.params;
  const num = goal - 1;
  const doc = state.goals[num];

  if (!doc) {
    emit('goals:fetch', num);
    return html`
      <div>
        Loading
      </div>
    `;
  }

  return html`
    <div>
      ${ header() }
      <div class="View-section">
        <div class="Text">
          <h1>${ asText(doc.data.title) }</h1>
          ${ icons[num]() }
          ${ referrer ? html`
            <p>
              Referrer id: ${ referrer }
            </p>
          ` : null }
          ${ asElement(doc.data.preamble) }
          <!-- TODO: Translate -->
          <h2>Targets</h2>
          <ul>
            ${ doc.data.targets.map(target => html`
              <li>
                ${ asElement(target.body) }
              </li>
            `) }
          </ul>
        </div>
      </div>
      ${ footer() }
    </div>
  `;
}

function title(state) {
  const doc = state.goals[state.params.goal - 1];
  return `${ doc.data.number } ${ asText(doc.data.title).trim() }`;
}
