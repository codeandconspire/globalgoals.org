const html = require('choo/html')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const Component = require('nanocomponent')
const nanoraf = require('nanoraf')
const backgrounds = require('./backgrounds')
const icon = require('../icon')
const { className, modulate, vh, isBrowser, scrollIntoView } = require('../base/utils')
const { __ } = require('../../locale')
const { href } = require('../../params')

const PARALLAX_AMOUNT = 60

module.exports = class Hero extends Component {
  constructor (id, state, emit, opts) {
    super(id)
    this.state = state
    this.emit = emit
    Object.assign(this, {background: true}, opts)
  }

  static identity (doc) {
    return `hero-${doc.data.number}`
  }

  update () {
    return false
  }

  beforerender (element) {
    /**
     * Circumvent mobile viewports calculating `vh` w/o address bar
     */

    element.style.height = this.height = `${vh()}px`
  }

  load (element) {
    if (!this.background) { return }

    const height = element.offsetHeight
    const container = element.querySelector('.js-container')
    const onscroll = nanoraf(() => {
      const scrollY = window.pageYOffset || window.scollY || 0
      const val = modulate(scrollY, [0, height], [0, PARALLAX_AMOUNT], true)
      container.style.transform = `translateY(${val}px)`
    })

    this.emit('ui:hero:height', element.offsetHeight)

    onscroll()
    window.addEventListener('scroll', onscroll, { passive: true })
    this.unload = function () {
      window.removeEventListener('scroll', onscroll)
    }
  }

  createElement (doc) {
    const goal = doc.data.number
    const inTransition = this.state.transitions.includes('takeover')

    return html`
      <section class="${className(`Hero Hero--${goal}`, { 'Hero--takeover': inTransition, [`u-bg${goal}`]: !inTransition })}" style="height: ${this.height}" id="${this._name}">
        <div class="Hero-container js-container" id="${this._name}-content">
          <div class="${className('Hero-title js-title', { 'u-transformTarget': !inTransition })}">
            ${icon.label(doc, 'Hero')}
          </div>
          <div class="Hero-intro">
            <h1 class="u-hiddenVisually">${asText(doc.data.title)}</h1>
            <div class="u-transformTarget">
              <div class="Text Text--adaptive Text--growing Text--bold">
                ${asElement(doc.data.introduction, href)}
              </div>
              ${doc.data.targets.length ? html`
                <div class="Hero-link">
                  <div class="Text Text--adaptive">
                    <a class="Text-largeLink" href="#manifest" onclick=${scrollWithoutHeader}>
                      <svg class="Text-icon" width="20" height="20" viewBox="0 0 20 20">
                        <g transform="rotate(90 10 10)" fill="none" fill-rule="evenodd">
                          <path d="M11.52 10L8 13.52l.73.73L12.98 10 8.73 5.75 8 6.48 11.52 10z" fill="currentColor" />
                          <circle stroke="currentColor" cx="10" cy="10" r="9.5" />
                        </g>
                      </svg>
                      ${__('Goal %s in Action', goal)}
                    </a>
                    <a class="Text-largeLink" href="#targets">
                      <svg class="Text-icon" width="20" height="20" viewBox="0 0 20 20">
                        <g transform="rotate(90 10 10)" fill="none" fill-rule="evenodd">
                          <path d="M11.52 10L8 13.52l.73.73L12.98 10 8.73 5.75 8 6.48 11.52 10z" fill="currentColor" />
                          <circle stroke="currentColor" cx="10" cy="10" r="9.5" />
                        </g>
                      </svg>
                      ${__('Explore the Targets')}
                    </a>
                  </div>
                </div>
              ` : null}
            </div>
          </div>
        </div>
        ${this.background ? backgrounds(goal) : null}
      </section>
    `
  }

  static loading (goal) {
    return html`
      <section class="Hero Hero--${goal} is-loading u-bg${goal}" style="${isBrowser ? `height: ${vh()}px` : ''}" id="hero-${goal}">
        <div class="Hero-container" id="hero-${goal}-content">
          <div class="Hero-title">
            ${icon.loading(goal, 'Hero')}
          </div>
        </div>
      </section>
    `
  }
}

function scrollWithoutHeader (event) {
  console.log(event.currentTarget.hash)
  scrollIntoView(document.querySelector(event.currentTarget.hash), { offsetTop: 0 })
  event.preventDefault()
}
