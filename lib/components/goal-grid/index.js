const html = require('choo/html');
const { resolve } = require('../../params');
const { icon } = require('../goal');
const logo = require('../logo');

const NUMBER_OF_GRID_SETS = 5;
let gridSet;

module.exports = (state, goals) => {
  let clientSide = typeof window !== 'undefined';

  if (clientSide && !gridSet) {
    gridSet = Math.floor(Math.random() * NUMBER_OF_GRID_SETS + 1);
  }

  return html`
    <div class="GoalGrid ${ gridSet ? 'GoalGrid--setInitialized GoalGrid--set' + gridSet : '' }">
      ${ goals.map((doc, index) => doc ? html`
        <div class="GoalGrid-item GoalGrid-item--${ index + 1 }">
          <a class="GoalGrid-content" href="${ resolve(state.routes.goal, { goal: doc.data.number, slug: doc.uid, referrer: state.params.referrer }) }">
            ${ icon({goal: index + 1, className: 'GoalGrid-icon'}) }
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
