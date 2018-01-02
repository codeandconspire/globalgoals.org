const html = require('choo/html')
const component = require('fun-component')
const createTablist = require('./tablist')
const allPanels = require('./panels')
const intro = require('../intro')
const { vw, scrollIntoView, inBrowser } = require('../base/utils')

module.exports = function createEngager (view) {
  const tablist = createTablist(view)

  return component({
    name: `engager:${view}`,
    props: {
      expanded: null,
      firstPick: null,
      organisations: 0
    },
    update (element, [state, emit, { doc }]) {
      /**
       * Act on transition state
       */

      const transitions = {
        tablist: state.transitions.includes('tablist'),
        panel: state.transitions.includes('panel-expand')
      }
      const inTransition = (transitions.tablist || transitions.panel)

      if (inTransition) {
        element.classList.add('in-transition')
      } else {
        element.classList.remove('in-transition')
      }

      const { expanded } = state.ui.cta
      let shouldUpdate = expanded !== this.props.expanded

      /**
       * Fetch organisations on first expand
       */

      if (expanded === 'organisations') {
        if (shouldUpdate) {
          const tags = [ 'organisation' ]

          if (doc && doc.type === 'goal') {
            tags.push(`goal-${doc.data.number}`)
          }

          this.props.organisations = 0
          emit('pages:fetch', { tags })
        } else {
          const organisations = state.pages.items.filter(item => {
            return item.tags.includes('organisation')
          })

          if (organisations.length !== this.props.organisations) {
            this.props.organisations = organisations.length
            shouldUpdate = true
          }
        }
      }

      return shouldUpdate
    },
    render (state, emit, { doc, heading = {} }, goal) {
      const props = Object.assign(this.props, state.ui.cta)
      const panels = Object.keys(allPanels).map(key => {
        return allPanels[key](state, doc, emit)
      })

      const toggle = (id, invert) => event => {
        /**
         * Omitting `id` or toggling an expanded panel with `invert = true`
         * collapses the panel
         */

        if (invert && props.expanded === id) {
          id = null
        }

        const isSmall = vw() < 600
        const root = document.getElementById('engager')
        const nextIndex = panels.findIndex(panel => panel.id === id)
        const index = panels.findIndex(panel => panel.id === props.expanded)
        const align = props.expanded && nextIndex > index && isSmall

        /**
         * Prematurely apply/remove expanded state
         */

        const toggle = id ? 'add' : 'remove'
        root.classList[toggle]('is-expanded')
        event.target.classList.add('is-expanded')
        emit('ui:cta:toggle', id)

        /**
         * Align view with expanded panel
         */

        if (align) {
          const target = event.currentTarget
          const {top} = target.getBoundingClientRect()
          // await repaint
          window.requestAnimationFrame(function () {
            // align target with where it was when clicked
            scrollIntoView(target, {behavior: 'instant', offsetTop: top})
            // await another repaint
            window.requestAnimationFrame(function () {
              // smoothly align target with viewport top
              scrollIntoView(target)
            })
          })
        }

        event.preventDefault()
      }

      return html`
        <div class="Engager ${goal ? `Engager--${goal}` : ''} ${props.expanded ? 'is-expanded' : ''}" id="engager">
          ${intro({ title: heading.title, body: heading.introduction })}

          ${tablist({ expanded: props.expanded, firstPick: props.firstPick }, panels, toggle, emit)}

          ${panels.map(panel => {
            const id = `engager-${panel.id}`
            const isExpanded = props.expanded === panel.id

            return html`
              <div class="Engager-block" id="${id}-container">
                <a href="${panel.href}" onclick=${toggle(panel.id, true)} class="Engager-button Engager-button--row ${isExpanded ? 'is-expanded' : ''}" role="button" aria-expanded="${isExpanded ? 'true' : 'false'}" aria-controls="${id}">
                  <span class="Engager-buttonText">${panel.title}</span>
                </a>

                <div class="Engager-panel ${isExpanded ? 'is-expanded' : ''}" role="tabpanel" aria-expanded="${isExpanded ? 'true' : 'false'}" id="${id}">
                  ${isExpanded && inBrowser ? panel.content() : null}
                </div>
              </div>
            `
          })}
        </div>
      `
    }
  })
}
