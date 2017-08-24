const html = require('choo/html');
const component = require('fun-component');
const card = require('../card');
const { __ } = require('../../locale');

const NOOP = () => {};
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
      props.expanded = id;
      this.render(state, media, emit);
      event.preventDefault();
    };

    const collapse = event => {
      props.expanded = null;
      props.firstPick = null;
      this.render(state, media, emit);
      event.preventDefault();
    };

    const expand = id => event => {
      props.expanded = props.firstPick = id;

      const temp = tablist(state, props);
      temp.style.position = 'absolute';
      temp.style.top = '0';
      temp.style.left = '0';

      const target = temp.querySelector('.js-target').getBoundingClientRect();
      // TODO: inject and animate placeholder


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

        <!-- Render large buttons or tablist depending on expanded state -->
        <div class="js-tablist">
          ${ props.expanded ? tablist(state, props, toggle, collapse) : triggers(state, props, expand) }
        </div>

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

function tablist(state, props, expand = NOOP, collapse = NOOP) {
  return html`
    <div class="CallToAction-tablist" role="tablist" aria-expanded="${ props.expanded ? 'true' : 'false' }">
      ${ PANELS.map(panel => panel(state)).map(panel => html`
        <a href="#call-to-action-${ panel.id }" onclick=${ expand(panel.id) } class="CallToAction-tab ${ props.expanded === panel.id ? 'is-active' : '' } ${ props.firstPick === panel.id ? 'is-first js-target' : '' }" role="tab" aria-expanded="${ props.expanded === panel.id ? 'true' : 'false' }" aria-controls="call-to-action-${ panel.id }">
          ${ panel.title }
        </a>
      `) }
      <button class="CallToAction-close" onclick=${ collapse }>${ __('Close') }</button>
    </div>
  `;
}

function triggers(state, props, expand = NOOP) {
  return html`
    <div class="CallToAction-triggers" role="tablist" aria-expanded="${ props.expanded ? 'true' : 'false' }">
      ${ PANELS.map(panel => panel(state)).map(panel => html`
        <a href="#call-to-action-${ panel.id }" onclick=${ expand(panel.id) } class="CallToAction-button CallToAction-button--expandable" role="tab" aria-expanded="${ props.expanded === panel.id ? 'true' : 'false' }" aria-controls="call-to-action-${ panel.id }">
          ${ panel.title }
        </a>
      `) }
    </div>
  `;
}

function asCard(item) {
  return {
    title: item.title,
    body: item.description,
    image: item.link
  };
}
