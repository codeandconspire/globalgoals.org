const html = require('choo/html');
const createLink = require('./link');
const logo = require('../logo');
const { __ } = require('../../locale');
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
      <a class="GoalGrid-item GoalGrid-item--cta" href="#call-to-action">
        <div class="GoalGrid-bg">
          <div class="GoalGrid-content">
            <div class="GoalGrid-details">
              <div class="GoalGrid-desc Text Text--growing">
                <h3>${ __('There are many ways to contribute') }</h3>
                <p class="GoalGrid-paragraph">${ __('The Global Goals are only going to be completed if we fight for them. All we need you to do is to pick an option.') }</p>
              </div>
              <div class="GoalGrid-logo">${ logo() }</div>
              <span class="GoalGrid-button">Get involved</span>
            </div>
          </div>
        </div>
      </a>
      <div class="GoalGrid-item GoalGrid-item--banner">
        <div class="GoalGrid-bg">
          <div class="GoalGrid-content"></div>
        </div>
      </div>
      <div class="GoalGrid-item GoalGrid-item--logo">
        <div class="GoalGrid-bg">
          <div class="GoalGrid-content">
            <div class="GoalGrid-logo">${ logo(false) }</div>
          </div>
        </div>
      </div>
    </div>
  `;
};
