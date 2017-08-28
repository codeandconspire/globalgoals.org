const html = require('choo/html');
const component = require('fun-component');
const newsletter = require('./newsletter');
const { __ } = require('../../locale');

const PANELS = [
  state => ({
    id: 'message',
    title: __('Share a Message'),
    content: html`
      <h2>${ __('Share a Message').toUpperCase() }</h2>
    `
  }),
  state => ({
    id: 'organisations',
    title: __('Join an Organisation'),
    content: html`
      <h2>${ __('Join an Organisation').toUpperCase() }</h2>
    `
  }),
  state => ({
    id: 'newsletter',
    title: __('Sign Up For Newsletter'),
    content: newsletter(state)
  }),
  state => ({
    id: 'tips',
    title: __('Tips & Tricks'),
    content: html`
      <h2>${ __('Tips & Tricks').toUpperCase() }</h2>
    `
  })
];

const tablist = component({
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
      const done = () => {
        this.inTransition = false;
        emit('transition:end', 'tablist');
        this.render(props, panels, toggle, emit);
      };

      /**
       * Prepare for animation and notify parent to toggle tab
       */

      this.inTransition = true;
      emit('transition:start', 'tablist');
      toggle(id)(event);

      /**
       * Create a temporary tablist for animation
       */

      const temp = html`
        <div class="CallToAction-tablist CallToAction-tablist--temp is-hidden">
          ${ tabs() }
        </duv>
      `;

      /**
       * Derrive animation origin (where to animate from)
       */

      const clone = button.cloneNode(true);
      const target = temp.querySelector('.js-target');
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

        requestAnimationFrame(() => {
          clone.addEventListener('transitionend', function ontransitionend(event) {
            if (event.target === clone && event.propertyName === 'transform') {
              clone.removeEventListener('transitionend', ontransitionend);
              done();
            }
          });

          /**
           * Apply translated state
           */

          clone.classList.add('in-transition', 'is-flat');
          this.root.classList.add('is-hidden');
          temp.classList.remove('is-hidden');

          /**
           * Transform clone into place of target element
           */

          clone.style.transform = `
            translate(${ target.offsetLeft - origin.left }px, ${ target.offsetTop + target.offsetHeight - origin.top - 5 }px)
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

      const done = () => {
        this.inTransition = false;
        this.root.classList.remove('in-transition', 'is-hidden');
        emit('transition:end', 'tablist');
        this.render(props, panels, toggle, emit);
      };

      /**
       * Broadcast transition
       */

      emit('transition:start', 'tablist');

      /**
       * Create a temporary set of buttons
       */

      const temp = html`
        <div class="CallToAction-tablist CallToAction-tablist--temp is-hidden">
          ${ buttons() }
        </duv>
      `;

      /**
       * Norify upstream to toggle panel states
       */

      this.inTransition = true;
      toggle(false)(event);

      /**
       * Derrive animation origin (where to animate from)
       */

      const tab = this.root.querySelector('.js-origin');
      const button = temp.querySelector('.js-target');
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
         * Place clone in target position but transform to origin
         */

        Object.assign(clone.style, {
          position: 'absolute',
          left: `${ target.left }px`,
          top: `${ target.top }px`,
          width: `${ target.width }px`,
          height: `${ target.height }px`,
          transform: `
            translate(${ origin.left - target.left }px, ${ origin.top + origin.height - target.top - 5 }px)
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
          clone.addEventListener('transitionend', function ontransitionend(event) {
            if (event.target === clone && event.propertyName === 'transform') {
              clone.removeEventListener('transitionend', ontransitionend);
              done();
            }
          });

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

    const classNames = [ 'CallToAction-tablist' ];

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

    function tabs() {
      return panels.map(panel => {
        const isExpanded = props.expanded === panel.id;
        const classNames = [ 'CallToAction-tab' ];

        if (isExpanded) {
          classNames.push('is-active', 'js-origin');
        }

        if (props.firstPick === panel.id) {
          classNames.push('is-first', 'js-target');
        }

        return html`
          <a href="#call-to-action-${ panel.id }" onclick=${ toggle(panel.id) } class="${ classNames.join(' ') }" role="tab" aria-expanded="${ isExpanded ? 'true' : 'false' }" aria-controls="call-to-action-${ panel.id }">
            ${ panel.title }
          </a>
        `;
      });
    }

    function buttons() {
      return panels.map(panel => {
        const classNames = [ 'CallToAction-button', 'CallToAction-button--expandable' ];

        if (props.expanded === panel.id) {
          classNames.push('js-target');
        }

        return html`
          <a href="#call-to-action-${ panel.id }" onclick=${ expand(panel.id) } class="${ classNames.join(' ') }" role="tab" aria-expanded="${ props.expanded === panel.id ? 'true' : 'false' }" aria-controls="call-to-action-${ panel.id }">
            ${ panel.title }
          </a>
        `;
      });
    }
  }
});

module.exports = component({
  name: 'call-to-action',
  props: {
    expanded: null,
    firstPick: null
  },
  render(state, media, emit) {
    const { props } = this;

    const toggle = id => event => {
      props.firstPick = id ? props.firstPick || id : null;
      props.expanded = id;
      this.render(state, media, emit);
      event.preventDefault();
    };

    const panels = PANELS.map(panel => panel(state));

    return html`
      <div class="CallToAction">
        <div class="View-article">
          <div class="Text">
            <h2 class="Text-h3">Become an influencer</h2>
            <p>The Global Goals are only going to be completed if we fight for them. All we need you to do is to pick an option below.</p>
          </div>
        </div>

        ${ tablist(this.props, panels, toggle, emit) }

        ${ panels.map(panel => {
          /* eslint-disable indent */ // eslint-disable-line indent
          // FIXME: https://github.com/eslint/eslint/issues/9061
          const id = `call-to-action-${ panel.id }`;
          const isExpanded = props.expanded === panel.id;

          return html`
            <div id="${ id }-container">
              <a href="#${ id }" onclick=${ toggle(panel.id) } class="CallToAction-button CallToAction-button--expandable CallToAction-button--wide" role="tab" aria-expanded="${ isExpanded ? 'true' : 'false' }" aria-controls="${ id }">
                ${ panel.title }
              </a>

              <div class="CallToAction-panel ${ isExpanded ? 'is-expanded' : '' }" role="tabpanel" aria-expanded="${ isExpanded ? 'true' : 'false' }" id="${ id }">
                ${ panel.content }
              </div>
            </div>
          `;
          /* eslint-enable indent */ // eslint-disable-next-line indent
        }) }
      </div>
    `;
  }
});
