const html = require('choo/html');
const component = require('fun-component');
const createTablist = require('./tablist');
const poster = require('./poster');
const newsletter = require('./newsletter');
const { vw, scrollIntoView } = require('../base/utils');
const { __ } = require('../../locale');

const PANELS = [
  (state, doc, emit) => {
    const hasSlug = media => media.slug;

    let posters;
    if (doc) {
      posters = doc.data.media
        .filter(hasSlug)
        .map(media => poster(state, doc, media, emit));
    } else {
      posters = state.goals.items
        .filter(goal => goal.data.media.length)
        .map(goal => poster(state, goal, goal.data.media.find(hasSlug), emit));
    }

    return {
      id: 'message',
      title: __('Share a Message'),
      content: html`
        <div class="Grid Grid--masonry Grid--sm2col Grid--md3col">
          ${ posters.map((item, index) => html`
            <div class="Grid-cell Grid-cell--appear" style="animation-delay: ${ index * 100 }ms;">
              ${ item }
            </div>
          `) }
        </div>
      `
    };
  },
  () => ({
    id: 'organisations',
    title: __('Join an Organisation'),
    content: html`
      <div class="Text Text--growing"><p>${ __('Join an Organisation') }</p></div>
    `
  }),
  () => ({
    id: 'tips',
    title: __('Tips & Tricks'),
    content: html`
      <div class="Text Text--growing"><p>${ __('Tips & Tricks') }</p></div>
    `
  }),
  (state, doc, emit) => ({
    id: 'newsletter',
    title: __('Sign Up For Newsletter'),
    content: newsletter(state, emit)
  })
];

module.exports = function createCallToAction(view) {
  const tablist = createTablist(view);

  return component({
    name: `call-to-action:${ view }`,
    props: {
      expanded: null,
      firstPick: null
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

      return state.ui.cta.expanded !== this.props.expanded;
    },
    render(state, emit, { use = null, heading = {} }) {
      const props = Object.assign(this.props, state.ui.cta);
      const panels = PANELS.map(panel => panel(state, use, emit));

      const toggle = (id, invert) => event => {

        /**
         * Omitting `id` or toggling an expanded panel with `invert = true`
         * collapses the panel
         */

        if (invert && props.expanded === id) {
          id = null;
        }

        const isSmall = vw() < 600;
        const root = document.getElementById('call-to-action');
        const nextIndex = panels.findIndex(panel => panel.id === id);
        const index = panels.findIndex(panel => panel.id === props.expanded);
        const align = props.expanded && nextIndex > index && isSmall;

        /**
         * Prematurely apply/remove expanded state
         */

        const toggle = id ? 'add' : 'remove';
        root.classList[toggle]('is-expanded');
        event.target.classList.add('is-expanded');
        emit('ui:cta:toggle', id);

        /**
         * Align view with expanded panel
         */

        if (align) {
          scrollIntoView(event.currentTarget);
        }

        event.preventDefault();
      };

      return html`
        <div class="CallToAction ${ props.expanded ? 'is-expanded' : '' }" id="call-to-action">
          <div id="call-to-action" class="Space Space--contain Space--startTall">
            <div class="Text Text--growing">
              <h1 class="Text-h2">${ heading.title }</h1>
              <p>${ heading.introduction }</p>
            </div>
          </div>

          ${ tablist({ expanded: props.expanded, firstPick: props.firstPick }, panels, toggle, emit) }

          ${ panels.map(panel => {
            const id = `call-to-action-${ panel.id }`;
            const isExpanded = props.expanded === panel.id;

            return html`
              <div class="CallToAction-block" id="${ id }-container">
                <a href="#${ id }" onclick=${ toggle(panel.id, true) } class="CallToAction-button CallToAction-button--expandable CallToAction-button--row ${ isExpanded ? 'is-expanded' : '' }" role="tab" aria-expanded="${ isExpanded ? 'true' : 'false' }" aria-controls="${ id }">
                  ${ panel.title }
                </a>

                <div class="CallToAction-panel ${ isExpanded ? 'is-expanded' : '' }" role="tabpanel" aria-expanded="${ isExpanded ? 'true' : 'false' }" id="${ id }">
                  ${ panel.content }
                </div>
              </div>
            `;
          }) }
        </div>
      `;
    }
  });
};
