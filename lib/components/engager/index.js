const html = require('choo/html')
const Component = require('nanocomponent')
const Nanocache = require('../base/utils/cache')
const Tablist = require('../tablist')
const Follow = require('./follow')
const Messages = require('./messages')
const Organisations = require('./organisations')
const Tips = require('./tips')
const intro = require('../intro')
const { color } = require('../base')
const { vw, scrollIntoView, inBrowser, className } = require('../base/utils')

const PANELS = [Messages, Organisations, Tips, Follow]
const TABLIST_BORDER_WIDTH = 4

module.exports = class Engager extends Component {
  constructor (id, state, emit, doc) {
    super(id)
    this.state = state
    this.emit = emit
    this.cache = new Nanocache(state, emit)
    this.doc = doc
    this.tabs = null
    this.expanded = null
    this.inTransition = false
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

  toggle (id) {
    const toggle = id ? 'add' : 'remove'
    this.element.classList[toggle]('is-expanded')
    this.expanded = id
    this.rerender()
  }

  createElement (doc, heading) {
    const goal = doc.data.number
    const onselect = id => this.toggle(id)

    /**
     * Handle accordion behavior and scroll panels into view on expand
     */

    const ontoggle = id => event => {
      const isSmall = vw() < 600
      const nextIndex = PANELS.findIndex(Panel => Panel.identity(doc) === id)
      const index = PANELS.findIndex(Panel => Panel.identity(doc) === this.expanded)
      const align = this.expanded && nextIndex > index && isSmall

      this.tabs = PANELS.slice()
        .sort(Panel => Panel.identity(this.doc) === id ? -1 : 1)
        .map(Panel => ({
          id: Panel.identity(this.doc),
          label: Panel.title(this.doc),
          href: Panel.href(this.doc)
        }))

      this.toggle(id === this.expanded ? null : id)
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
     * Expand tablist with given tab set as active
     * @param {string} id
     * @return {function} event handler
     */

    const onexpand = id => event => {
      if (this.inTransition) return

      const { currentTarget: button } = event
      const ontransitionend = (event) => {
        const isClone = event.target === clone
        const isTransform = event.propertyName === 'transform'

        if (isClone && isTransform && !event.pseudoElement) {
          clone.removeEventListener('transitionend', ontransitionend)
          this.inTransition = false

          // Clean up hacky calss injection
          tablist.classList.remove('in-transition')

          // Toggle active tab
          this.toggle(id)
        }
      }

      /**
       * Prepare for animation and notify parent to onexpand tab
       */

      this.inTransition = true
      this.element.classList.add('in-transition')
      this.tabs = PANELS.slice()
        .sort(Panel => Panel.identity(this.doc) === id ? -1 : 1)
        .map(Panel => ({
          id: Panel.identity(this.doc),
          label: Panel.title(this.doc),
          href: Panel.href(this.doc)
        }))

      /**
       * Create a temporary tablist for animation
       */

      const tablist = this.cache.render(Tablist, this.tabs, onselect, {
        selected: id,
        tabClass: 'Engager-tab',
        color: color(goal)
      })
      tablist.classList.add('in-transition')

      const temp = html`
        <div class="Engager-tablist" id="${this._name}-tablist">
          ${tablist}
        </div>
      `
      temp.classList.add('in-transition', 'is-hidden')

      /**
       * Derrive animation origin (where to animate from)
       */

      const clone = button.cloneNode(true)
      const target = temp.querySelector('.js-active')
      const origin = {
        left: button.offsetLeft,
        top: button.offsetTop,
        width: button.offsetWidth,
        height: button.offsetHeight
      }

      /**
       * Place clone in position
       */

      clone.classList.add('is-clone')
      button.style.visibility = 'hidden'
      Object.assign(clone.style, {
        position: 'absolute',
        left: `${origin.left}px`,
        top: `${origin.top}px`,
        width: `${origin.width}px`,
        height: `${origin.height}px`
      })

      /**
       * Insert temporary elements
       */

      const container = this.element.querySelector('.js-tabs')
      container.appendChild(clone)
      container.insertBefore(temp, container.firstElementChild)

      window.requestAnimationFrame(() => {
        /**
         * Enable transitions
         */

        container.classList.add('in-transition')
        this.element.style.height = `${temp.offsetHeight}px`

        window.requestAnimationFrame(() => {
          clone.addEventListener('transitionend', ontransitionend)

          /**
           * Figure out by how much to move clone
           */

          const deltaX = target.offsetLeft - origin.left
          const deltaY = target.offsetTop + target.offsetHeight - origin.top - TABLIST_BORDER_WIDTH

          /**
           * Apply translated state
           */

          if ((Math.abs(deltaX) + Math.abs(deltaY)) > origin.width) {
            this.element.classList.add('is-slow')
          }

          clone.classList.add('in-transition', 'is-flat')
          this.element.classList.add('is-hidden')
          temp.classList.remove('is-hidden')

          /**
           * Transform clone into place of target element
           */

          clone.style.transform = `
            translate(${deltaX}px, ${deltaY}px)
            scaleX(${target.offsetWidth / origin.width})
            scaleY(${TABLIST_BORDER_WIDTH / origin.height})
          `
        })
      })

      event.preventDefault()
    }

    return html`
      <div class="Engager ${goal ? `Engager--${goal}` : ''} ${this.expanded ? 'is-expanded' : ''}" id="${Engager.identity(doc)}">
        <div id="contribute">
          ${intro({ title: heading.title, body: heading.introduction })}
        </div>

        <div class="Engager-tabs js-tabs">
          ${this.expanded ? html`
            <div class="Engager-tablist" id="${this._name}-tablist">
              ${this.cache.render(Tablist, this.tabs, onselect, { selected: this.expanded, tabClass: 'Engager-tab' })}
            </div>
          ` : PANELS.map(Panel => {
            const id = Panel.identity(doc)
            return html`
              <a href="${Panel.href(doc)}" onclick=${onexpand(id)} class="${className('Engager-button', {'js-active': this.expanded === id})}" role="tab" aria-expanded="${this.expanded === id ? 'true' : 'false'}" aria-controls="${id}-panel">
                <span class="Engager-buttonText">${Panel.title(doc)}</span>
              </a>
            `
          })}
        </div>

        ${inBrowser ? PANELS.map(Panel => {
          const id = Panel.identity(doc)
          const isExpanded = this.expanded === id

          return html`
            <div class="Engager-block">
              <a href="${Panel.href(doc)}" onclick=${ontoggle(id)} class="Engager-button Engager-button--row ${isExpanded ? 'is-expanded' : ''}" role="button" aria-expanded="${isExpanded ? 'true' : 'false'}" aria-controls="${id}-panel">
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
