const html = require('choo/html');
const component = require('fun-component');
const card = require('../card');
const { __ } = require('../../locale');

const PANELS = [
  state => ({
    id: 'message',
    title: __('Share a Message')
  }),
  state => ({
    id: 'organisations',
    title: __('Join an Organisation')
  }),
  state => ({
    id: 'newsletter',
    title: __('Sign Up For Newsletter')
  }),
  state => ({
    id: 'tips',
    title: __('Tips & Tricks')
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
    const expand = id => event => {
      if (this.inTransition) { return; }

      const { currentTarget: button } = event;
      const done = () => {
        this.inTransition = false;
        emit('transition:end', 'tablist');
        this.render(props, panels, toggle, emit);
      };

      emit('transition:start', 'tablist');

      this.inTransition = true;
      toggle(id)(event);

      const temp = html`
        <div class="CallToAction-tablist CallToAction-tablist--temp">
          ${ tabs() }
        </duv>
      `;

      const clone = button.cloneNode(true);
      const target = temp.querySelector('.js-target');

      button.style.visibility = 'hidden';
      Object.assign(clone.style, {
        position: 'absolute',
        left: `${ button.offsetLeft }px`,
        top: `${ button.offsetTop }px`,
        width: `${ button.offsetWidth }px`,
        height: `${ button.offsetHeight }px`
      });

      this.root.appendChild(temp);
      this.root.appendChild(clone);

      requestAnimationFrame(() => {
        clone.addEventListener('transitionend', function ontransitionend(event) {
          if (event.target === clone && event.propertyName === 'left') {
            clone.removeEventListener('transitionend', ontransitionend);
            done();
          }
        });

        clone.classList.add('in-transition');
        this.root.classList.add('in-transition');

        Object.assign(clone.style, {
          left: `${ target.offsetLeft }px`,
          top: `${ target.offsetTop + target.offsetHeight }px`,
          width: `${ target.offsetWidth }px`,
          height: '5px'
        });
      });

      event.preventDefault();
    };

    const collapse = (event) => {
      if (this.inTransition) { return; }

      const done = () => {
        this.inTransition = false;
        emit('transition:end', 'tablist');
        this.render(props, panels, toggle, emit);
      };

      emit('transition:start', 'tablist');

      const temp = html`
        <div class="CallToAction-tablist CallToAction-tablist--temp">
          ${ buttons() }
        </duv>
      `;

      this.inTransition = true;
      toggle(false)(event);

      const tab = this.root.querySelector('.js-origin');
      const button = temp.querySelector('.js-target');
      const clone = button.cloneNode(true);

      button.style.visibility = 'hidden';
      clone.classList.add('in-transition');
      Object.assign(clone.style, {
        position: 'absolute',
        left: `${ tab.offsetLeft }px`,
        top: `${ tab.offsetTop + tab.offsetHeight }px`,
        width: `${ tab.offsetWidth }px`,
        height: '5px'
      });

      this.root.appendChild(temp);
      this.root.appendChild(clone);
      this.root.classList.add('in-transition');

      requestAnimationFrame(() => {
        const target = {
          top: button.offsetTop,
          left: button.offsetLeft,
          width: button.offsetWidth,
          height: button.offsetHeight
        };

        requestAnimationFrame(() => {
          clone.addEventListener('transitionend', function ontransitionend(event) {
            if (event.target === clone && event.propertyName === 'left') {
              clone.removeEventListener('transitionend', ontransitionend);
              done();
            }
          });

          this.root.classList.remove('in-transition');
          Object.assign(clone.style, {
            top: `${ target.top }px`,
            left: `${ target.left }px`,
            width: `${ target.width }px`,
            height: `${ target.height }px`
          });
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
  load(element) {
    this.tablist = element.querySelector('.js-tablist');
  },
  render(state, media, emit) {
    const { props } = this;

    const toggle = id => event => {
      props.firstPick = id ? props.firstPick || id : null;
      props.expanded = id;
      this.render(state, media, emit);
      event.preventDefault();
    };

    return html`
      <div class="CallToAction">
        <div class="View-article">
          <div class="Text">
            <h2 class="Text-h3">Become an influencer</h2>
            <p>The Global Goals are only going to be completed if we fight for them. All we need you to do is to pick an option below.</p>
          </div>
        </div>

        ${ tablist(this.props, PANELS.map(panel => panel(state)), toggle, emit) }

        <div class="CallToAction-panel ${ props.expanded === 'message' ? 'is-expanded' : '' }" role="tabpanel" aria-expanded="${ props.expanded === 'message' ? 'true' : 'false' }" id="call-to-action-message">
          ${ media.map(item => card(state, emit, asCard(item), { fill: true })) }
        </div>

        <div class="CallToAction-panel ${ props.expanded === 'organisations' ? 'is-expanded' : '' }" role="tabpanel" aria-expanded="${ props.expanded === 'organisations' ? 'true' : 'false' }" id="call-to-action-organisations">
          ORGANISATIONS HERE!
        </div>

        <div class="CallToAction-panel ${ props.expanded === 'newsletter' ? 'is-expanded' : '' }" role="tabpanel" aria-expanded="${ props.expanded === 'newsletter' ? 'true' : 'false' }" id="call-to-action-newsletter">
          <form action="${ state.newsletterEndpoint }" method="POST">
            <input type="email" required class="CallToAction-input" />
            <button type="submit" class="CallToAction-button">${ __('Submit') }</button>
          </form>
        </div>

        <div class="CallToAction-panel ${ props.expanded === 'tips' ? 'is-expanded' : '' }" role="tabpanel" aria-expanded="${ props.expanded === 'tips' ? 'true' : 'false' }" id="call-to-action-tips">
          TIPS AND TRICKS HERE!
        </div>
      </div>
    `;
  }
});

function asCard(item) {
  return {
    title: item.title,
    body: item.description,
    image: item.link
  };
}
