const html = require('choo/html');
const component = require('fun-component');

const TABLIST_BORDER_WIDTH = 5; // Hardcoded in CSS, see index.css

module.exports = component({
  name: 'call-to-action:tablist',
  inTransition: false,
  update() {
    return !this.inTransition;
  },
  load(element) {
    this.root = element;
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
      const ontransitionend = (event) => {
        if (event.target === clone && event.propertyName === 'transform') {
          clone.removeEventListener('transitionend', ontransitionend);
          this.inTransition = false;
          emit('transitions:end', 'tablist');
          this.rerender();
        }
      };

      /**
       * Prepare for animation and notify parent to toggle tab
       */

      this.inTransition = true;
      emit('transitions:start', 'tablist');
      toggle(id)(event);

      /**
       * Create a temporary tablist for animation
       */

      const temp = html`
        <div class="CallToAction-tablist CallToAction-tablist--temp is-hidden">
          ${ tabs(id, id) }
        </div>
      `;

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

      this.root.appendChild(temp);
      this.root.appendChild(clone);

      requestAnimationFrame(() => {

        /**
         * Enable transitions
         */

        temp.classList.add('in-transition');
        this.root.classList.add('in-transition');
        this.root.style.height = `${ temp.offsetHeight }px`;

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
            this.root.classList.add('is-slow');
          }

          clone.classList.add('in-transition', 'is-flat');
          this.root.classList.add('is-hidden');
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

    const classNames = [ 'CallToAction-tablist', 'js-tablist' ];

    if (this.inTransition) {
      classNames.push('in-transition');
    }

    if (props.expanded) {
      classNames.push('is-expanded');
    }

    return html`
      <div class="${ classNames.join(' ') }" role="tablist" aria-expanded="${ props.expanded ? 'true' : 'false' }">
        ${ props.expanded ? tabs() : buttons() }
      </div>
    `;

    function tabs(expanded = props.expanded, firstPick = props.firstPick) {
      return panels.map(panel => {
        const isExpanded = expanded === panel.id;
        const classNames = [ 'CallToAction-tab' ];

        if (isExpanded) {
          classNames.push('is-active', 'js-active');
        }

        if (firstPick === panel.id) {
          classNames.push('is-first');
        }

        return html`
          <a href="#call-to-action-${ panel.id }" onclick=${ toggle(panel.id) } class="${ classNames.join(' ') }" role="tab" aria-expanded="${ isExpanded ? 'true' : 'false' }" aria-controls="call-to-action-${ panel.id }">
            ${ panel.title }
          </a>
        `;
      });
    }

    function buttons(expanded = props.expanded) {
      return panels.map(panel => {
        return html`
          <a href="#call-to-action-${ panel.id }" onclick=${ expand(panel.id) } class="CallToAction-button ${ expanded === panel.id ? 'js-active' : ''}" role="tab" aria-expanded="${ expanded === panel.id ? 'true' : 'false' }" aria-controls="call-to-action-${ panel.id }">
            ${ panel.title }
          </a>
        `;
      });
    }
  }
});
