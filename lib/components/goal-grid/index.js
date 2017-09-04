const html = require('choo/html');
const createLink = require('./link');
const logo = require('../logo');

const links = [];

module.exports = (state, emit) => {
  /**
   * Compose list of goals and placeholders for goals being fetched
   */

  const goals = [];
  for (let i = 0; i < state.goals.total; i += 1) {
    goals.push(state.goals.items.find(item => item.data.number === i + 1));
  }


  return html`
    <div class="GoalGrid ${ state.layout ? 'GoalGrid--layout' + state.layout : '' }">
      ${ goals.map((doc, index) => {
        if (!links[index]) {
          links.push(createLink(state, index + 1, emit));
        }

        return links[index](doc);
      }) }
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
};
