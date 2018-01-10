const html = require('choo/html')
const Component = require('nanocomponent')
const { className } = require('../base/utils')

module.exports = class Tablist extends Component {
  constructor (id, state, emit, links, onselect, opts) {
    super(id)
    Object.assign(this, {
      state: state,
      emit: emit,
      selected: null,
      inTransition: false
    }, opts)
  }

  static identity (links, onselect, opts = {}) {
    return `tablist-${opts.key || links.map(props => props.id).join('-')}`
  }

  update (links, onselect, opts = {}) {
    if (this.inTransition) return false
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
      const active = this.element.querySelector('.js-active')
      const selector = html`<div class="Tablist-selector"></div>`
      const ontransitionend = () => {
        selector.removeEventListener('transitionend', ontransitionend)
        this.selected = id
        this.inTransition = false
        this.rerender()
        onselect(id)
        this.emit('transitions:end', 'tab')
      }

      this.inTransition = true
      this.emit('transitions:start', 'tab')

      target.classList.add('is-active')
      target.style.color = opts.color || ''
      active.classList.remove('is-active')
      this.element.classList.add('in-transition')
      selector.addEventListener('transitionend', ontransitionend)
      selector.style.color = opts.color || ''
      selector.style.transform = `
        translateX(${active.offsetLeft - target.offsetLeft}px)
        scaleX(${active.offsetWidth / target.offsetWidth})
      `

      window.requestAnimationFrame(() => {
        target.appendChild(selector)
        active.classList.remove('is-active')
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
