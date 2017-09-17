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
      <a class="GoalGrid-item GoalGrid-item--cta" href="#video">
        <div class="GoalGrid-bg">
          <div class="GoalGrid-content">
            <div class="GoalGrid-details">
              <div class="GoalGrid-desc Text Text--growingLate">
                <h3>${ __('Introducing the Targets') }</h3>
                <p class="GoalGrid-paragraph">${ __('The 17 main goals are propelled by 169 detailed targets to help us aim our efforts and turn enthusiasm into action. The full system will be available at globalgoals.org this fall.') }</p>
              </div>
              <div class="GoalGrid-logo">${ logo() }</div>
              <span class="GoalGrid-button">Watch Video</span>
            </div>
          </div>
        </div>
      </a>
      <a class="GoalGrid-item GoalGrid-item--banner" href="http://www.globalgoals.org/goalkeepers/" target="_blank">
        <div class="GoalGrid-bg">
          <div class="GoalGrid-content">
            <img class="GoalGrid-bannerImage" src="/goalkeepers-logo.svg">
          </div>
        </div>
      </a>
      <div class="GoalGrid-item GoalGrid-item--logo">
        <div class="GoalGrid-bg">
          <div class="GoalGrid-content">
            <div class="GoalGrid-logo">${ logo({ horizontal: false }) }</div>
          </div>
        </div>
      </div>
    </div>
  `;
};
