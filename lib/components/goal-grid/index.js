const html = require('choo/html');
const { resolve } = require('../../params');
const { icon } = require('../goal');
const createHero = require('../hero');
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
            <div class="GoalGrid-icon js-icon">
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
        <a class="GoalGrid-item GoalGrid-item--${ index + 1 } u-bg${ index + 1 } ${ state.goals.isLoading ? 'is-loading' : '' }"  onclick=${ event => onclick(event, index + 1) } href="${ resolve(state.routes.goal, { goal: index + 1, referrer: state.params.referrer }) }">
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

    /**
     * Broadcast transition start
     */

    emit('transitions:start', 'takeover');

    /**
     * Wait for link transition to end before starting page transition
     */

    link.addEventListener('transitionend', function onclickend() {
      link.removeEventListener('transitionend', onclickend);

      /**
       * Create layers
       */

      const takeover = html`<div class="View-takeover u-bg${ goal }"></div>`;
      const hero = createHero('transition')(state, goal);

      /**
       * Avoid transitions while calculating layout
       */

      hero.classList.add('no-transition');

      /**
       * Extrapolate origin location (where to animate from)
       */

      const icon = link.querySelector('.js-icon').getBoundingClientRect();
      const box = link.getBoundingClientRect();

      /**
       * Transform takeover into position
       */

      takeover.style.transform = `
        translate(${ box.left }px, ${ box.top }px)
        scaleX(${ box.width / vw() })
        scaleY(${ box.height / vh() })
      `;

      /**
       * Navigate on transition end
       */

      takeover.addEventListener('transitionend', function ontakeoverdone(event) {
        if (event.target === takeover) {
          takeover.removeEventListener('transitionend', ontakeoverdone);
          emit(state.events.PUSHSTATE, link.href);
        }
      });

      requestAnimationFrame(() => {
        document.body.appendChild(hero);

        /**
         * Create a clone of the title element that we'll be animating
         */

        const title = hero.querySelector('.js-title');
        const clone = title.cloneNode(true);

        clone.classList.add('is-clone');
        title.parentElement.appendChild(clone);

        /**
         * Render hero in place and read title location (where to animate to)
         */

        document.body.insertBefore(takeover, hero);
        const target = title.getBoundingClientRect();

        /**
         * Put the clone in position on top of the icon label
         */

        Object.assign(clone.style, {
          height: `${ target.height }px`,
          width: `${ target.width }px`,
          left: `${ target.left }px`,
          top: `${ target.top }px`,
          transform: `
            translate(${ icon.left - target.left }px, ${ icon.top - target.top }px)
            scale(${ icon.width / target.width })
          `
        });

        requestAnimationFrame(() => {

          /**
           * Let em' loose 🐳
           */

          hero.classList.remove('no-transition');
          clone.classList.add('in-transition');
          takeover.style.transform = 'translate(0px, 0px) scaleX(1) scaleY(1)';
          clone.style.transform = 'translate(0px, 0px) scale(1)';
        });
      });
    });

    event.preventDefault();
  }
};

/**
 * Get viewport width
 * @return {Number}
 */

function vw() {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

/**
 * Get viewport height
 * @return {Number}
 */

function vh() {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}
