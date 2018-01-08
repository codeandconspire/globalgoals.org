const html = require('choo/html')
const Component = require('nanocomponent')
const Nanocache = require('../base/utils/cache')
const Tablist = require('./tablist')
const Follow = require('./follow')
const Messages = require('./messages')
const Organisations = require('./organisations')
const Tips = require('./tips')
const intro = require('../intro')
const { vw, scrollIntoView, inBrowser } = require('../base/utils')

const PANELS = [Messages, Organisations, Tips, Follow]

module.exports = class Engager extends Component {
  constructor (id, state, emit, doc) {
    super(id)
    this.state = state
    this.emit = emit
    this.cache = new Nanocache(state, emit)
    this.doc = doc
    this.expanded = null
    this.organisations = 0
  }

  static identity (doc) {
    return `engager-${doc.id}`
  }

  update (element) {
    PANELS.forEach(Panel => {
      const panel = this.cache.cache[Panel.identity(this.doc)]
      if (panel && panel.element && panel.update(this.doc)) panel.rerender()
    })

    return false
  }

  unload () {
    this.cache.prune()
  }

  createElement (doc, heading) {
    const goal = doc.data.number

    /**
     * Toggle expanded panel
     */

    const toggle = id => {
      const toggle = id ? 'add' : 'remove'
      this.element.classList[toggle]('is-expanded')
      this.expanded = id
      this.rerender()
    }

    /**
     * Handle accordion behavior and scroll panels into view on expand
     */

    const onclick = id => event => {
      const isSmall = vw() < 600
      const nextIndex = PANELS.findIndex(Panel => Panel.identity(doc) === id)
      const index = PANELS.findIndex(Panel => Panel.identity(doc) === this.expanded)
      const align = this.expanded && nextIndex > index && isSmall

      toggle(id === this.expanded ? null : id)
      event.target.classList.add('is-expanded')

      /**
       * Align view with expanded panel
       */

      if (align) {
        const target = event.currentTarget
        const {top} = target.getBoundingClientRect()
        // await repaint
        window.requestAnimationFrame(function () {
          // align target with where it was when clicked
          scrollIntoView(target, { behavior: 'instant', offsetTop: top })
          // await another repaint
          window.requestAnimationFrame(function () {
            // smoothly align target with viewport top
            scrollIntoView(target)
          })
        })
      }

      event.preventDefault()
    }

    /**
     * Two-step expand fn returning a callback for when transitions are done
     */

    const onexpand = id => {
      this.element.classList.add('in-transition')
      return () => {
        this.element.classList.remove('in-transition')
        toggle(id)
      }
    }

    return html`
      <div class="Engager ${goal ? `Engager--${goal}` : ''} ${this.expanded ? 'is-expanded' : ''}" id="${Engager.identity(doc)}">
        <div id="contribute">
          ${intro({ title: heading.title, body: heading.introduction })}
        </div>

        ${this.cache.render(Tablist, { expanded: this.expanded, onexpand, doc })}

        ${inBrowser ? PANELS.map(Panel => {
          const id = Panel.identity(doc)
          const isExpanded = this.expanded === id

          return html`
            <div class="Engager-block">
              <a href="${Panel.href(doc)}" onclick=${onclick(id)} class="Engager-button Engager-button--row ${isExpanded ? 'is-expanded' : ''}" role="button" aria-expanded="${isExpanded ? 'true' : 'false'}" aria-controls="${id}-panel">
                <span class="Engager-buttonText">${Panel.title(doc)}</span>
              </a>

              <div class="Engager-panel ${isExpanded ? 'is-expanded' : ''}" role="tabpanel" aria-expanded="${isExpanded ? 'true' : 'false'}" id="${id}-panel">
                ${isExpanded ? this.cache.render(Panel, doc) : null}
              </div>
            </div>
          `
        }) : null}
      </div>
    `
  }
}
