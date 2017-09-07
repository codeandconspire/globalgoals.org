const html = require('choo/html');
const component = require('fun-component');
const header = require('../header');
const scrollIntoView = require('scroll-into-view');
const tablist = require('./tablist');
const newsletter = require('./newsletter');
const { __ } = require('../../locale');

const PANELS = [
  state => ({
    id: 'message',
    title: __('Share a Message'),
    content: html`
      <h2>${ __('Share a Message') }</h2>
    `
  }),
  state => ({
    id: 'organisations',
    title: __('Join an Organisation'),
    content: html`
      <h2>${ __('Join an Organisation') }</h2>
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
      <h2>${ __('Tips & Tricks') }</h2>
    `
  })
];

module.exports = component({
  name: 'call-to-action',
  props: {
    expanded: null,
    firstPick: null
  },
  load(element) {
    this.root = element;
  },
  update(element, [state]) {
    const transitions = {
      tablist: state.transitions.includes('tablist'),
      panel: state.transitions.includes('panel-expand')
    };
    const inTransition = (transitions.tablist || transitions.panel);

    if (inTransition) {
      element.classList.add('in-transition');
    } else {
      element.classList.remove('in-transition');
    }

    return false;
  },
  render(state, media, emit) {
    const { props } = this;
    const panels = PANELS.map(panel => panel(state));

    const toggle = (id, invert) => event => {

      /**
       * Omitting `id` or toggling an expanded panel with `invert = true`
       * collapses the panel
       */

      if (invert && props.expanded === id) {
        id = null;
      }

      const isSmall = vw() < 600;
      const nextIndex = panels.findIndex(panel => panel.id === id);
      const index = panels.findIndex(panel => panel.id === props.expanded);
      const align = props.expanded && nextIndex > index && isSmall;
      const done = () => {
        props.firstPick = id ? props.firstPick || id : null;
        props.expanded = id;
        this.render(state, media, emit);
      };

      /**
       * Prematurely apply/remove expanded state
       */

      const toggle = id ? 'add' : 'remove';
      this.root.classList[toggle]('is-expanded');
      event.target.classList.add('is-expanded');

      /**
       * Animate panel height when:
       * - small and expanding for first time
       * - small and collapsing
       */

      if (isSmall && (!props.expanded || !id)) {
        const panel = this.root.querySelector(`#call-to-action-${ id || props.expanded }`);

        panel.style.display = 'block';
        const height = panel.offsetHeight;
        const ontransitionend = () => {
          panel.removeEventListener('transitionend', ontransitionend);
          emit('transitions:end', 'panel-expand');
          done();
        };

        requestAnimationFrame(() => {
          emit('transitions:start', 'panel-expand');
          panel.style.height = `${ id ? 0 : height }px`;
          requestAnimationFrame(() => {
            panel.addEventListener('transitionend', ontransitionend);
            panel.classList.add('in-transition');
            panel.style.height = `${ id ? height : 0 }px`;
          });
        });
      } else {
        done();
      }

      /**
       * Align view with expanded panel
       */

      if (align) {
        emit('transitions:start', 'scroll');
        scrollIntoView(event.currentTarget, {
          align: {
            top: 0,
            topOffset: header.height + 20
          }
        }, () => emit('transitions:end', 'scroll'));
      }

      event.preventDefault();
    };

    return html`
      <div class="CallToAction ${ props.expanded ? 'is-expanded' : '' }">
        <div id="call-to-action" class="Space Space--contain Space--startTall Space--endShort">
          <div class="Text Text--growing">
            <h1 class="Text-h2">Become an influencer</h1>
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
            <div class="CallToAction-block" id="${ id }-container">
              <a href="#${ id }" onclick=${ toggle(panel.id, true) } class="CallToAction-button CallToAction-button--expandable CallToAction-button--row ${ isExpanded ? 'is-expanded' : '' }" role="tab" aria-expanded="${ isExpanded ? 'true' : 'false' }" aria-controls="${ id }">
                ${ panel.title }
              </a>

              <div style="height: 1000px" class="CallToAction-panel ${ isExpanded ? 'is-expanded' : '' }" role="tabpanel" aria-expanded="${ isExpanded ? 'true' : 'false' }" id="${ id }">
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

/**
 * Get viewport width
 * @return {Number}
 */

function vw() {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}
