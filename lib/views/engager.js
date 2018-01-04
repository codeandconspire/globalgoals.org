const html = require('choo/html')
const asElement = require('prismic-element')
const serialize = require('../components/text/serialize')
const view = require('../components/view')
const intro = require('../components/intro')
const { __ } = require('../locale')
const { href } = require('../params')

const panels = {
  follow: require('../components/engager/follow'),
  messages: require('../components/engager/messages'),
  organisations: require('../components/engager/organisations'),
  tips: require('../components/engager/tips')
}

module.exports = createView

function createView (type) {
  return view('engager', goal, title)

  function goal (state, emit, render) {
    const doc = getDoc(state)
    const Panel = panels[type]

    return html`
      <main class="View-main" id="view-main">
        <div class="View-section" id="${Panel.identity(doc)}-panel">
          ${intro({ pageIntro: true, title: title(state), body: asElement(doc.data.introduction, href, serialize) })}
          ${render(Panel, doc)}
        </div>
      </main>
    `
  }

  function title (state) {
    const Panel = panels[type]
    const title = Panel.title(getDoc(state))
    if (state.params.goal) {
      return `${__('Goal %s', state.params.goal)}: ${title}`
    }
    return title
  }
}

function getDoc (state) {
  if (state.params.goal) {
    return state.goals.items.find(item => item.data.number === state.params.goal)
  }
  return state.pages.items.find(item => item.type === 'home_page')
}
