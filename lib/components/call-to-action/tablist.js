const html = require('choo/html');
const component = require('fun-component');
const { __ } = require('../../locale');

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
          this.render(props, panels, toggle, emit);
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
          const deltaY = target.offsetTop + target.offsetHeight - origin.top - 5;

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
            scaleY(${ 5 / origin.height })
          `;
        });
      });

      event.preventDefault();
    };

    /**
     * Collapse tablist
     * @param {string} event
     * @return {undefined}
     */

    const collapse = (event) => {
      if (this.inTransition) { return; }

      const ontransitionend = (event) => {
        if (event.target === clone && event.propertyName === 'transform') {
          clone.removeEventListener('transitionend', ontransitionend);
          this.inTransition = false;
          this.root.classList.remove('in-transition', 'is-hidden');
          emit('transitions:end', 'tablist');
          this.render(props, panels, toggle, emit);
        }
      };

      /**
       * Broadcast transition
       */

      emit('transitions:start', 'tablist');

      /**
       * Create a temporary set of buttons
       */

      const temp = html`
        <div class="CallToAction-tablist CallToAction-tablist--temp is-hidden">
          ${ buttons() }
        </div>
      `;

      /**
       * Norify upstream to toggle panel states
       */

      this.inTransition = true;
      toggle(false)(event);

      /**
       * Derrive animation origin (where to animate from)
       */

      const tab = this.root.querySelector('.js-active');
      const button = temp.querySelector('.js-active');
      const clone = button.cloneNode(true);
      const origin = {
        left: tab.offsetLeft,
        top: tab.offsetTop,
        width: tab.offsetWidth,
        height: tab.offsetHeight
      };

      /**
       * Hide target button and inject elements
       */

      button.style.visibility = 'hidden';
      this.root.appendChild(temp);

      requestAnimationFrame(() => {

        /**
         * Derive animation target (where to animate to)
         */

        const target = {
          top: button.offsetTop,
          left: button.offsetLeft,
          width: button.offsetWidth,
          height: button.offsetHeight
        };

        /**
         * Figure out by how much to move clone
         */

        const deltaX = origin.left - target.left;
        const deltaY = origin.top + origin.height - target.top - 5;

        /**
         * Apply translated state
         */

        if ((Math.abs(deltaX) + Math.abs(deltaY)) > target.width) {
          this.root.classList.add('is-slow');
        }

        /**
         * Place clone in target position but transform to origin
         */

        Object.assign(clone.style, {
          position: 'absolute',
          left: `${ target.left }px`,
          top: `${ target.top }px`,
          width: `${ target.width }px`,
          height: `${ target.height }px`,
          transform: `
            translate(${ deltaX }px, ${ deltaY }px)
            scaleX(${ origin.width / target.width })
            scaleY(${ 5 / target.height })
          `
        });

        /**
         * Prepare for animation
         */

        this.root.appendChild(clone);
        clone.classList.add('is-flat');

        requestAnimationFrame(() => {
          clone.addEventListener('transitionend', ontransitionend);

          /**
           * Remove all transforms and animate in to place
           */

          this.root.classList.add('is-hidden', 'in-transition');
          temp.classList.remove('is-hidden');
          temp.classList.add('in-transition');
          clone.classList.remove('is-flat');
          clone.classList.add('in-transition');
          clone.style.transform = 'translate(0px, 0px) scale(1)';
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
        ${ props.expanded ? html`
          <button class="CallToAction-close" onclick=${ collapse }>
            ${ __('Close') }
          </button>
        ` : null }
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
        const classNames = [ 'CallToAction-button', 'CallToAction-button--expandable' ];

        if (expanded === panel.id) {
          classNames.push('js-active');
        }

        return html`
          <a href="#call-to-action-${ panel.id }" onclick=${ expand(panel.id) } class="${ classNames.join(' ') }" role="tab" aria-expanded="${ expanded === panel.id ? 'true' : 'false' }" aria-controls="call-to-action-${ panel.id }">
            ${ panel.title }
          </a>
        `;
      });
    }
  }
});
