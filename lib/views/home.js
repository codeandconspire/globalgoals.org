const html = require('choo/html');
const { asText } = require('prismic-richtext');
const view = require('../components/view');
const { icons } = require('../components/goal');
const { resolve } = require('../params');

module.exports = view(goal);

function goal(state, emit) {
  const { referrer } = state.params;

  if (!state.isLoading && state.goals.filter(item => !item).length) {
    const missing = state.goals.map((item, index) => item ? null : index + 1);
    emit('goals:fetch', missing.filter(Boolean));
  }

  return html`
    <div>
      <h1 class="View-title">The Global Goals</h1>
      ${ referrer ? html`
        <p>
          Referrer id: ${ referrer }
        </p>
      ` : null }
      <ul>
        ${ state.goals.map((doc, index) => doc ? html`
          <li>
            <a href="${ resolve(state.routes.goal, { goal: doc.data.number, slug: doc.slugs[0], referrer: referrer }) }">
              <h2>${ doc.data.number } ${ asText(doc.data.title) }</h2>
              <br />
              ${ icons[index]() }
              ${ icons[index](false) }
              ${ icons[index](true, true) }
            </a>
          </li>
        ` : html`
          <li>${ state.isLoading ? 'Loading' : 'Missing' }</li>
        `) }
      </ul>
    </div>
  `;
}
