const html = require('choo/html')
const asElement = require('prismic-element')
const serialize = require('../components/text/serialize')
const view = require('../components/view')
const intro = require('../components/intro')
const panels = require('../components/engager/panels')
const { __ } = require('../locale')
const { href } = require('../params')

module.exports = createView

function createView (type) {
  return view('engager', goal, title)

  function goal (state, emit) {
    const doc = getDoc(state)
    const panel = panels[type](state, doc, emit)

    return html`
      <main class="View-main" id="view-main">
        <div class="View-section" id="${panel.id}">
          ${intro({ pageIntro: true, title: title(state), body: asElement(doc.data.introduction, href, serialize) })}
          ${panel.content()}
        </div>
      </main>
    `
  }

  function title (state) {
    const panel = panels[type](state, getDoc(state))
    if (state.params.goal) {
      return `${__('Goal %s', state.params.goal)}: ${panel.title}`
    }
    return panel.title
  }
}

function getDoc (state) {
  if (state.params.goal) {
    return state.goals.items.find(item => item.data.number === state.params.goal)
  }
  return state.pages.items.find(item => item.type === 'home_page')
}
