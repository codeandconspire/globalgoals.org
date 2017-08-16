const html = require('choo/html');
const { resolve } = require('../../params');
const { icon } = require('../goal');

module.exports = (state, goals) => html`
  <div class="GoalGrid">
    ${ goals.map((doc, index) => doc ? html`
      <div class="GoalGrid-item">
        <a class="GoalGrid-action" href="${ resolve(state.routes.goal, { goal: doc.data.number, slug: doc.slugs[0], referrer: state.params.referrer }) }">
          ${ icon({goal: index + 1, className: 'GoalGrid-icon'}) }
        </a>
      </div>
    ` : html`
      ${ state.isLoading ? 'Loading' : 'Missing' }
    `) }
  </div>
`;
