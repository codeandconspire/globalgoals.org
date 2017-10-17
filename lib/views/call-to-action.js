const html = require('choo/html');
const asElement = require('prismic-element');
const view = require('../components/view');
const intro = require('../components/intro');
const panels = require('../components/call-to-action/panels');
const { __ } = require('../locale');

module.exports = view(goal, title);

function goal(state, emit) {
  const doc = getDoc(state);
  const panel = getPanel(state.routeName)(state, doc, emit);

  return html`
    <main class="View-main" id="view-main">
      <div class="View-section" id="${ panel.id }">
        ${ intro({
          title: title(state),
          body: asElement(doc.data.introduction)
        }) }
        ${ panel.content() }
      </div>
    </main>
  `;
}

function title(state) {
  const doc = getDoc(state);
  const panel = getPanel(state.routeName);
  let title = panel(state, doc).title;

  if (state.params.goal) {
    return `${ __('Goal %s', state.params.goal) }: ${ title }`;
  }

  return title;
}

function getDoc(state) {
  if (state.params.goal) {
    return state.goals.items.find(item => item.data.number === state.params.goal);
  }
  return state.pages.items.find(item => item.type === 'home_page');
}

function getPanel(route) {
  switch (route) {
    case 'all_media':
    case 'goal_media': return panels.messages;
    case 'organisations':
    case 'goal_organisations': return panels.organisations;
    case 'faq':
    case 'goal_tips': return panels.tips;
    case 'newsletter':
    case 'goal_newsletter': return panels.newsletter;
    default: {
      const error = new Error('Cannot show page');
      error.status = 500;
      throw error;
    }
  }
}
