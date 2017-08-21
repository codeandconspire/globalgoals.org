const html = require('choo/html');
const { resolve } = require('../../params');
const { icon } = require('../goal');
const logo = require('../logo');

module.exports = (state, goals) => {
  return html`
    <div class="GoalGrid ${ state.gridLayout ? 'GoalGrid--layout' + state.gridLayout : '' }">
      ${ goals.map((doc, index) => doc ? html`
        <div class="GoalGrid-item GoalGrid-item--${ index + 1 }">
          <a class="GoalGrid-content" href="${ resolve(state.routes.goal, { goal: doc.data.number, slug: doc.uid, referrer: state.params.referrer }) }">
            ${ icon({ goal: index + 1, cover: true }) }
          </a>
        </div>
      ` : html`
        <div class="GoalGrid-item GoalGrid-item--${ index + 1 } ${ state.isLoading ? 'is-loading' : '' }">
          <div class="GoalGrid-content"></div>
        </div>
      `) }
      <div class="GoalGrid-item GoalGrid-item--cta">
        <div class="GoalGrid-content"></div>
      </div>
      <div class="GoalGrid-item GoalGrid-item--banner">
        <div class="GoalGrid-content"></div>
      </div>
      <div class="GoalGrid-item GoalGrid-item--logo">
        <div class="GoalGrid-content">
          <div class="GoalGrid-logo">${ logo(false) }</div>
        </div>
      </div>
    </div>
  `;
}
