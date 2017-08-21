const html = require('choo/html');
const { resolve } = require('../../params');
const { icon } = require('../goal');
const goalHero = require('../goal-hero');
const logo = require('../logo');

module.exports = (state, emit) => {
  /**
   * Compose list of goals and placeholders for goals being fetched
   */

  const goals = [];
  for (let i = 0; i < state.goals.total; i += 1) {
    goals.push(state.goals.items.find(item => item.data.number === i + 1));
  }

  return html`
    <div class="GoalGrid ${ state.gridLayout ? 'GoalGrid--layout' + state.gridLayout : '' }">
      ${ goals.map((doc, index) => doc ? html`
      <a class="GoalGrid-item GoalGrid-item--${ index + 1 } u-bg${ index + 1 }" onclick=${ event => onclick(event, index + 1) } href="${ resolve(state.routes.goal, { goal: doc.data.number, slug: doc.uid, referrer: state.params.referrer }) }">
          <div class="GoalGrid-content">
            <div class="GoalGrid-icon">
              ${ icon({ goal: index + 1, cover: true }) }
            </div>

            <div class="Text Text--adaptive GoalGrid-details">
              <h2 class="GoalGrid-title Text-h4">Ensure availability and sustainable management of water and sanitation for all</h2>
              <p class="GoalGrid-desc">By 2030 clean, safe drinking water is accessible anywhere.</p>
              <span class="GoalGrid-button">View Goal</span>
              <div class="GoalGrid-animation"></div>
            </div>
          </div>
        </a>
      ` : html`
        <a class="GoalGrid-item GoalGrid-item--${ index + 1 } u-bg${ index + 1 } ${ state.isLoading ? 'is-loading' : '' }"  onclick=${ event => onclick(event, index + 1) } href="${ resolve(state.routes.goal, { goal: index + 1, referrer: state.params.referrer }) }">
          <div class="GoalGrid-content"></div>
        </a>
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

  function onclick(event, goal) {
    if (state.transitions.includes('takeover')) { return; }

    const { currentTarget: link } = event;

    /**
     * Start fetching missing goal right away
     */

    if (!goals[goal - 1]) {
      emit('goals:fetch', goal);
    }

    emit('transitions:start', 'takeover');

    link.addEventListener('transitionend', function onclickend() {
      link.removeEventListener('transitionend', onclickend);

      const takeover = html`<div class="View-takeover u-bg${ goal }"></div>`;
      const hero = goalHero(state, goal);

      hero.classList.add('no-transition');

      const origin = link.getBoundingClientRect();
      takeover.style.width = `${ origin.width }px`;
      takeover.style.height = `${ origin.height }px`;
      takeover.style.top = `${ origin.top }px`;
      takeover.style.left = `${ origin.left }px`;

      takeover.addEventListener('transitionend', function ontakeoverdone(event) {
        if (event.target === takeover) {
          takeover.removeEventListener('transitionend', ontakeoverdone);
          emit(state.events.PUSHSTATE, link.href);
        }
      });

      requestAnimationFrame(() => {
        document.body.appendChild(hero);

        requestAnimationFrame(() => {
          const title = hero.querySelector('.js-title');
          const clone = title.cloneNode(true);

          clone.classList.add('is-clone');
          title.parentElement.appendChild(clone);

          requestAnimationFrame(() => {
            document.body.insertBefore(takeover, hero);
            const target = title.getBoundingClientRect();

            clone.style.position = 'fixed';
            clone.style.height = `${ origin.height }px`;
            clone.style.width = `${ origin.width }px`;
            clone.style.left = `${ origin.left }px`;
            clone.style.top = `${ origin.top }px`;

            requestAnimationFrame(() => {
              takeover.removeAttribute('style');
              hero.classList.remove('no-transition');

              clone.style.height = `${ target.height }px`;
              clone.style.width = `${ target.width }px`;
              clone.style.left = `${ target.left }px`;
              clone.style.top = `${ target.top }px`;
            });
          });
        });
      });
    });

    event.preventDefault();
  }
};
