const html = require('choo/html')
const Component = require('nanocomponent')
const Follow = require('./follow')
const Messages = require('./messages')
const Organisations = require('./organisations')
const Tips = require('./tips')
const { className } = require('../base/utils')

const PANELS = [Messages, Organisations, Tips, Follow]

const TABLIST_BORDER_WIDTH = 4 // Hardcoded in CSS, see index.css

module.exports = class Tablist extends Component {
  constructor (id, state, emit, { expanded }) {
    super(id)
    this.state = state
    this.emit = emit
    this.expanded = expanded
    this.firstPick = null
    this.inTransition = false
  }

  static identity () {
    return `engager-tablist`
  }

  update () {
    return false
  }

  createElement ({ expanded, onexpand, doc }) {
    /**
     * Expand tablist with given tab set as active
     * @param {string} id
     * @return {function} event handler
     */

    const expand = id => event => {
      if (this.inTransition) return

      const { currentTarget: button } = event
      const onexpanded = onexpand(id)
      const ontransitionend = (event) => {
        const isClone = event.target === clone
        const isTransform = event.propertyName === 'transform'

        if (isClone && isTransform && !event.pseudoElement) {
          clone.removeEventListener('transitionend', ontransitionend)
          this.inTransition = false
          this.expanded = this.firstPick = id
          this.rerender()
          onexpanded()
        }
      }

      /**
       * Prepare for animation and notify parent to onexpand tab
       */

      this.inTransition = true

      /**
       * Create a temporary tablist for animation
       */

      const temp = tabs(id, id)
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

      this.element.appendChild(clone)
      this.element.insertBefore(temp, this.element.firstElementChild)

      window.requestAnimationFrame(() => {
        /**
         * Enable transitions
         */

        temp.classList.add('in-transition')
        this.element.classList.add('in-transition')
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

    const moveTo = id => event => {
      if (this.inTransition || this.expanded === id) {
        return event.preventDefault()
      }

      const { currentTarget: target } = event
      const onexpanded = onexpand(id)
      const from = this.element.querySelector('.js-active')
      const selector = html`<div class="Engager-selector"></div>`
      const ontransitionend = () => {
        selector.removeEventListener('transitionend', ontransitionend)
        this.expanded = id
        this.rerender()
        onexpanded()
      }

      target.classList.add('is-activeTemporarily')
      selector.addEventListener('transitionend', ontransitionend)
      selector.style.transform = `
        translateX(${from.offsetLeft - target.offsetLeft}px)
        scaleX(${from.offsetWidth / target.offsetWidth})
      `

      window.requestAnimationFrame(() => {
        target.appendChild(selector)
        from.classList.remove('is-active')
        window.requestAnimationFrame(() => {
          selector.style.transform = ''
        })
      })

      event.preventDefault()
    }

    const states = {
      'in-transition': this.inTransition,
      'is-expanded': this.expanded
    }

    return html`
      <div class="${className('Engager-tablist js-tablist', states)}" role="tablist" aria-expanded="${this.expanded ? 'true' : 'false'}">
        ${this.expanded ? tabs(this.expanded, this.firstPick) : buttons(this.expanded)}
      </div>
    `

    function tabs (expanded, firstPick) {
      return html`
        <div class="Engager-tabs">
          ${PANELS.map(Panel => {
            const id = Panel.identity(doc)
            const isExpanded = expanded === id

            const states = {
              'is-active js-active': isExpanded,
              'is-first': firstPick === id
            }

            return html`
              <a href="#${id}-panel" onclick=${moveTo(id)} class="${className('Engager-tab', states)}" role="tab" aria-expanded="${isExpanded ? 'true' : 'false'}" aria-controls="${id}-panel">
                ${Panel.title(doc)}
              </a>
            `
          })}
        </div>
      `
    }

    function buttons (expanded) {
      return PANELS.map(Panel => {
        const id = Panel.identity(doc)
        return html`
          <a href="${Panel.href(doc)}" onclick=${expand(id)} class="${className('Engager-button', {'js-active': expanded === id})}" role="tab" aria-expanded="${expanded === id ? 'true' : 'false'}" aria-controls="${id}-panel">
            <span class="Engager-buttonText">${Panel.title(doc)}</span>
          </a>
        `
      })
    }
  }
}
