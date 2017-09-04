const html = require('choo/html');
const component = require('fun-component');
const asElement = require('prismic-element');
const createHero = require('../hero');
const { resolve, href } = require('../../params');
const { icon } = require('../goal');

const PRESS_SCALE_FACTOR = 0.97; // Hardcoded in CSS, see index.css

module.exports = function createLink(state, goal, emit) {
  return component({
    name: `goal-link-${ goal }`,
    load(element) {
      let isPressed = false;
      let isAborted = false;

      element.addEventListener('touchstart', onpress);
      element.addEventListener('touchend', onrelease);
      element.addEventListener('mousedown', onpress);
      element.addEventListener('mouseup', onrelease);
      element.addEventListener('dragstart', abort);
      element.addEventListener('click', function onclick(event) {
        const inTransition = state.transitions.includes('takeover');

        if (isAborted || isPressed || inTransition) {
          event.preventDefault();
        }
      });

      function abort() {
        if (isPressed) {
          element.classList.remove('is-pressed');
          isPressed = false;
        }

        isAborted = true;
        window.removeEventListener('keydown', onescape);
        window.removeEventListener('scroll', abort, { passive: true });
      }

      function onescape(event) {
        if (event.key === 'Escape') {
          abort();
        }
      }

      function onpress(e) {
        if ((e.which && e.which === 3) || (e.button && e.button !== 0) ||
          e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) { return; }

        window.addEventListener('keydown', onescape);
        window.addEventListener('scroll', abort, { passive: true });

        isPressed = true;
        isAborted = false;
        element.classList.add('is-pressed');
      }

      function onrelease() {
        if (!isPressed || state.transitions.includes('takeover')) {
          return;
        }

        /**
         * Broadcast transition start
         */

        emit('transitions:start', 'takeover');

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

        const icon = element.querySelector('.js-icon').getBoundingClientRect();
        const box = element.getBoundingClientRect();

        /**
         * Transform takeover into position
         */

        const factor = ((1 - PRESS_SCALE_FACTOR) / 2);
        takeover.style.transform = `
          translate(${ box.left + (box.width * factor) }px, ${ box.top + (box.height * factor) }px)
          scaleX(${ (box.width * PRESS_SCALE_FACTOR) / vw() })
          scaleY(${ (box.height * PRESS_SCALE_FACTOR) / vh() })
        `;

        /**
         * Navigate on transition end
         */

        takeover.addEventListener('transitionend', function ontakeoverdone(event) {
          if (event.target === takeover) {
            takeover.removeEventListener('transitionend', ontakeoverdone);
            emit(state.events.PUSHSTATE, element.href);
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
             * Let em' loose
             */

            hero.classList.remove('no-transition');
            clone.classList.add('in-transition');
            takeover.style.transform = 'translate(0px, 0px) scaleX(1) scaleY(1)';
            clone.style.transform = 'translate(0px, 0px) scale(1)';
          });
        });
      }
    },
    render(doc) {
      if (!doc) {
        return html`
          <a id="goal-grid-item-${ goal }" class="GoalGrid-item GoalGrid-item--${ goal } u-bg${ goal } ${ state.goals.isLoading ? 'is-loading' : '' }"  href="${ resolve(state.routes.goal, { goal: goal, referrer: state.params.referrer }) }">
            <div class="GoalGrid-content">
              <div class="GoalGrid-icon js-icon">
                ${ icon({ goal: goal, cover: true }) }
              </div>
            </div>
          </a>
        `;
      }

      return html`
        <a id="goal-grid-item-${ goal }" class="GoalGrid-item GoalGrid-item--${ goal } u-bg${ goal }" href="${ resolve(state.routes.goal, { goal: doc.data.number, slug: doc.uid, referrer: state.params.referrer }) }">
          <div class="GoalGrid-content">
            <div class="GoalGrid-icon js-icon">
              ${ icon({ goal: goal, cover: true, noBackground: true }) }
            </div>

            <div class="GoalGrid-details">
              <div class="GoalGrid-desc Text Text--adaptive Text--growing">
                <!--<h2 class="Text-h4"></h2>-->
                ${ asElement(doc.data.introduction, doc => href(state, doc)) }
              </div>
              <span class="GoalGrid-button">View Goal</span>
              <div class="GoalGrid-animation"></div>
            </div>
          </div>
        </a>
      `;
    }
  });
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
