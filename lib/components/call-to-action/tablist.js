const html = require('choo/html');
const component = require('fun-component');
const { className } = require('../base/utils');

const TABLIST_BORDER_WIDTH = 4; // Hardcoded in CSS, see index.css

module.exports = function createTablist(parent) {
  return component({
    name: `call-to-action:${ parent }:tablist`,
    inTransition: false,
    update(element, [props], [prev]) {
      return !this.inTransition && props.expanded !== prev.expanded;
    },
    render(props, panels, toggle, emit) {

      /**
       * Expand tablist with given tab set as active
       * @param {string} id
       * @return {function} event handler
       */

      const expand = id => event => {
        if (this.inTransition) { return; }

        const { currentTarget: button } = event;
        const root = document.getElementById('call-to-action-tablist');
        const ontransitionend = (event) => {
          const isClone = event.target === clone;
          const isTransform = event.propertyName === 'transform';

          if (isClone && isTransform && !event.pseudoElement) {
            clone.removeEventListener('transitionend', ontransitionend);
            this.inTransition = false;
            emit('transitions:end', 'tablist');
            toggle(id)(event);
          }
        };

        /**
         * Prepare for animation and notify parent to toggle tab
         */

        this.inTransition = true;
        emit('transitions:start', 'tablist');

        /**
         * Create a temporary tablist for animation
         */

        const temp = tabs(id, id);
        temp.classList.add('in-transition', 'is-hidden');

        /**
         * Derrive animation origin (where to animate from)
         */

        const clone = button.cloneNode(true);
        const target = temp.querySelector('.js-active');
        const origin = {
          left: button.offsetLeft,
          top: button.offsetTop,
          width: button.offsetWidth,
          height: button.offsetHeight
        };

        /**
         * Place clone in position
         */

        button.style.visibility = 'hidden';
        Object.assign(clone.style, {
          position: 'absolute',
          left: `${ origin.left }px`,
          top: `${ origin.top }px`,
          width: `${ origin.width }px`,
          height: `${ origin.height }px`
        });

        /**
         * Insert temporary elements
         */

        root.appendChild(clone);
        root.insertBefore(temp, root.firstElementChild);

        requestAnimationFrame(() => {

          /**
           * Enable transitions
           */

          temp.classList.add('in-transition');
          root.classList.add('in-transition');
          root.style.height = `${ temp.offsetHeight }px`;

          requestAnimationFrame(() => {
            clone.addEventListener('transitionend', ontransitionend);

            /**
             * Figure out by how much to move clone
             */

            const deltaX = target.offsetLeft - origin.left;
            const deltaY = target.offsetTop + target.offsetHeight - origin.top - TABLIST_BORDER_WIDTH;

            /**
             * Apply translated state
             */

            if ((Math.abs(deltaX) + Math.abs(deltaY)) > origin.width) {
              root.classList.add('is-slow');
            }

            clone.classList.add('in-transition', 'is-flat');
            root.classList.add('is-hidden');
            temp.classList.remove('is-hidden');

            /**
             * Transform clone into place of target element
             */

            clone.style.transform = `
              translate(${ deltaX }px, ${ deltaY }px)
              scaleX(${ target.offsetWidth / origin.width })
              scaleY(${ TABLIST_BORDER_WIDTH / origin.height })
            `;
          });
        });

        event.preventDefault();
      };

      const moveTo = id => event => {
        if (this.inTransition || props.expanded === id) {
          return event.preventDefault();
        }

        const { currentTarget: target } = event;
        const root = document.getElementById('call-to-action-tablist');
        const from = root.querySelector('.js-active');

        const selector = html`<div class="CallToAction-selector"></div>`;

        selector.style.transform = `
          translateX(${ from.offsetLeft - target.offsetLeft }px)
          scaleX(${ from.offsetWidth / target.offsetWidth })
        `;

        selector.addEventListener('transitionend', function ontransitionend() {
          selector.removeEventListener('transitionend', ontransitionend);
          toggle(id)(event);
        });

        requestAnimationFrame(() => {
          target.appendChild(selector);
          from.classList.remove('is-active');
          requestAnimationFrame(() => {
            selector.style.transform = null;
          });
        });

        event.preventDefault();
      };

      const states = {
        'in-transition': this.inTransition,
        'is-expanded': props.expanded
      };

      return html`
        <div class="${ className('CallToAction-tablist js-tablist', states) }" role="tablist" aria-expanded="${ props.expanded ? 'true' : 'false' }" id="call-to-action-tablist">
          ${ props.expanded ? tabs() : buttons() }
        </div>
      `;

      function tabs(expanded = props.expanded, firstPick = props.firstPick) {
        return html`
          <div class="CallToAction-tabs" id="cta-tablist-tabs">
            ${ panels.map(panel => {
              const isExpanded = expanded === panel.id;

              const states = {
                'is-active js-active': isExpanded,
                'is-first': firstPick === panel.id
              };

              return html`
                <a href="#call-to-action-${ panel.id }" onclick=${ moveTo(panel.id) } class="${ className('CallToAction-tab', states) }" role="tab" aria-expanded="${ isExpanded ? 'true' : 'false' }" aria-controls="call-to-action-${ panel.id }">
                  ${ panel.title }
                </a>
              `;
            }) }
          </div>
        `;
      }

      function buttons(expanded = props.expanded) {
        return panels.map(panel => {
          return html`
            <a href="${ panel.href }" onclick=${ expand(panel.id) } class="${ className('CallToAction-button', { 'js-active': expanded === panel.id}) }" role="tab" aria-expanded="${ expanded === panel.id ? 'true' : 'false' }" aria-controls="call-to-action-${ panel.id }">
              ${ panel.title }
            </a>
          `;
        });
      }
    }
  });
};
