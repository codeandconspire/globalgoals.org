const assert = require('assert')
const html = require('choo/html')
const Component = require('nanocomponent')
const { className, inBrowser } = require('../base/utils')

module.exports = class Tablist extends Component {
  constructor (id, state, emit, links, ontransition, opts) {
    super(id)
    Object.assign(this, {
      selected: null,
      inTransition: false
    }, opts)

    if (inBrowser && opts.selected && process.env.NODE_ENV === 'development') {
      window.requestAnimationFrame(function () {
        assert(document.getElementById(`${opts.selected}-panel`), `Could not find expanded panel with id "${opts.selected}-panel"`)
      })
    }
  }

  static identity (links, ontransition, opts = {}) {
    return `tablist-${opts.key || links.map(props => props.id).join('-')}`
  }

  update (links, ontransition, opts = {}) {
    if (opts.selected && opts.selected !== this.selected) {
      this.selected = opts.selected
      return true
    }
    return false
  }

  createElement (links, onselect, opts = {}) {
    const onclick = id => event => {
      if (this.inTransition || this.selected === id) {
        return event.preventDefault()
      }

      const { currentTarget: target } = event
      const from = this.element.querySelector('.js-active')
      const selector = html`<div class="Tablist-selector"></div>`
      const ontransitionend = () => {
        selector.removeEventListener('transitionend', ontransitionend)
        this.selected = id
        this.rerender()
        onselect(id)

        if (inBrowser && process.env.NODE_ENV === 'development') {
          window.requestAnimationFrame(function () {
            assert(document.getElementById(`${id}-panel`), `Could not find expanded panel with id "${id}-panel"`)
          })
        }
      }

      // target.classList.add('is-activeTemporarily')
      selector.addEventListener('transitionend', ontransitionend)
      selector.style.color = opts.color || ''
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

    return html`
      <ol class="Tablist" role="tablist" aria-expanded="${this.selected ? 'true' : 'false'}">
        ${links.map(props => {
          const isSelected = this.selected === props.id

          return html`
            <li class="${className('Tablist-tab', { [opts.tabClass]: !!opts.tabClass })}" role="tab" aria-selected="${isSelected ? 'true' : 'false'}" aria-controls="${props.id}-panel">
              <a href="${props.href}" onclick=${onclick(props.id)} class="${className('Tablist-link', { 'is-active js-active': isSelected })}" style="${isSelected && opts.color ? `color: ${opts.color};` : ''}">
                ${props.label}
              </a>
            </li>
          `
        })}
      </ol>
    `
  }
}
